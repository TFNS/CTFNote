var util = require('util');
var pg = require('pg');
var semver = require('semver');
var Base = require('db-migrate-base');
var Promise = require('bluebird');

var PgDriver = Base.extend({
  init: function (connection, schema, intern) {
    this.log = intern.mod.log;
    this.type = intern.mod.type;
    this._escapeString = "'";
    this._super(intern);
    this.internals = intern;
    this.connection = connection;
    this.schema = schema || 'public';
  },

  startMigration: function (cb) {
    if (!this.internals.notransactions) {
      return this.runSql('BEGIN;').nodeify(cb);
    } else return Promise.resolve().nodeify(cb);
  },

  endMigration: function (cb) {
    if (!this.internals.notransactions) {
      return this.runSql('COMMIT;').nodeify(cb);
    } else return Promise.resolve(null).nodeify(cb);
  },

  createColumnDef: function (name, spec, options, tableName) {
    // add support for datatype timetz, timestamptz
    // https://www.postgresql.org/docs/9.5/static/datatype.html
    spec.type = spec.type.replace(/^(time|timestamp)tz$/, function ($, type) {
      spec.timezone = true;
      return type;
    });
    var type =
      spec.primaryKey && spec.autoIncrement ? '' : this.mapDataType(spec.type);
    var len = spec.length ? util.format('(%s)', spec.length) : '';
    var constraint = this.createColumnConstraint(
      spec,
      options,
      tableName,
      name
    );
    if (name.charAt(0) !== '"') {
      name = '"' + name + '"';
    }

    return {
      foreignKey: constraint.foreignKey,
      callbacks: constraint.callbacks,
      constraints: [name, type, len, constraint.constraints].join(' ')
    };
  },

  _translateSpecialDefaultValues: function (
    spec,
    options,
    tableName,
    columnName
  ) {
    switch (spec.defaultValue.special) {
      case 'CURRENT_TIMESTAMP':
        spec.defaultValue.prep = 'CURRENT_TIMESTAMP';
        break;
      default:
        this.super(spec, options, tableName, columnName);
        break;
    }
  },

  mapDataType: function (str) {
    switch (str) {
      case 'json':
      case 'jsonb':
        return str.toUpperCase();
      case this.type.STRING:
        return 'VARCHAR';
      case this.type.DATE_TIME:
        return 'TIMESTAMP';
      case this.type.BLOB:
        return 'BYTEA';
    }
    return this._super(str);
  },

  createDatabase: function (dbName, options, callback) {
    var spec = '';

    if (typeof options === 'function') callback = options;

    this.runSql(
      util.format('CREATE DATABASE %s %s', this.escapeDDL(dbName), spec),
      callback
    );
  },

  dropDatabase: function (dbName, options, callback) {
    var ifExists = '';

    if (typeof options === 'function') callback = options;
    else {
      ifExists = options.ifExists === true ? 'IF EXISTS' : '';
    }

    this.runSql(
      util.format('DROP DATABASE %s %s', ifExists, this.escapeDDL(dbName)),
      callback
    );
  },

  createSequence: function (sqName, options, callback) {
    var spec = '';
    var temp = '';

    if (typeof options === 'function') callback = options;
    else {
      temp = options.temp === true ? 'TEMP' : '';
    }

    this.runSql(
      util.format('CREATE %s SEQUENCE `%s` %s', temp, sqName, spec),
      callback
    );
  },

  switchDatabase: function (options, callback) {
    if (typeof options === 'object') {
      if (typeof options.database === 'string') {
        this.log.info(
          'Ignore database option, not available with postgres. Use schema instead!'
        );
        this.runSql(
          util.format('SET search_path TO `%s`', options.database),
          callback
        );
      }
    } else if (typeof options === 'string') {
      this.runSql(util.format('SET search_path TO `%s`', options), callback);
    } else callback(null);
  },

  dropSequence: function (dbName, options, callback) {
    var ifExists = '';
    var rule = '';

    if (typeof options === 'function') callback = options;
    else {
      ifExists = options.ifExists === true ? 'IF EXISTS' : '';

      if (options.cascade === true) rule = 'CASCADE';
      else if (options.restrict === true) rule = 'RESTRICT';
    }

    this.runSql(
      util.format('DROP SEQUENCE %s `%s` %s', ifExists, dbName, rule),
      callback
    );
  },

  createMigrationsTable: function (callback) {
    var options = {
      columns: {
        id: {
          type: this.type.INTEGER,
          notNull: true,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: this.type.STRING, length: 255, notNull: true },
        run_on: { type: this.type.DATE_TIME, notNull: true }
      },
      ifNotExists: false
    };

    return this.all('show server_version_num')
      .then(
        function (result) {
          if (result && result.length > 0 && result[0].server_version_num) {
            var version = result[0].server_version_num;
            var major = Math.floor(version / 10000);
            var minor = Math.floor((version - major * 10000) / 100);
            var patch = Math.floor(version - major * 10000 - minor * 100);
            version = major + '.' + minor + '.' + patch;
            options.ifNotExists = semver.gte(version, '9.1.0');
          }

          // Get the current search path so we can change the current schema
          // if necessary
          return this.all('SHOW search_path');
        }.bind(this)
      )
      .catch(
        // not all DBs support server_version_num, fall back to server_version
        function () {
          return this.all('show server_version').then(
            function (result) {
              if (result && result.length > 0 && result[0].server_version) {
                var version = result[0].server_version;
                // handle versions like “10.2 (Ubuntu 10.2)”
                version = version.split(' ')[0];
                // handle missing patch numbers
                if (version.split('.').length !== 3) {
                  version += '.0';
                }
                options.ifNotExists = semver.gte(version, '9.1.0');
                // Get the current search path so we can change the current
                // schema if necessary
                return this.all('SHOW search_path');
              }
            }.bind(this)
          );
        }.bind(this)
      )
      .then(
        function (result) {
          var searchPath;
          var searchPathes = result[0].search_path.split(',');

          for (var i = 0; i < searchPathes.length; ++i) {
            if (searchPathes[i].indexOf('"') !== 0) {
              searchPathes[i] = '"' + searchPathes[i].trim() + '"';
            }
          }

          result[0].search_path = searchPathes.join(',');

          // if the user specified a different schema, prepend it to the
          // search path. This will make all DDL/DML/SQL operate on the specified
          // schema.
          if (this.schema === 'public') {
            searchPath = result[0].search_path;
          } else {
            searchPath = '"' + this.schema + '",' + result[0].search_path;
          }

          return this.all('SET search_path TO ' + searchPath);
        }.bind(this)
      )
      .then(
        function () {
          return this.all(
            "SELECT table_name FROM information_schema.tables WHERE table_name = '" +
              this.internals.migrationTable +
              "'" +
              (this.schema ? " AND table_schema = '" + this.schema + "'" : '')
          );
        }.bind(this)
      )
      .then(
        function (result) {
          if (result && result.length < 1) {
            return this.createTable(this.internals.migrationTable, options);
          } else {
            return Promise.resolve();
          }
        }.bind(this)
      )
      .nodeify(callback);
  },

  createSeedsTable: function (callback) {
    var options = {
      columns: {
        id: {
          type: this.type.INTEGER,
          notNull: true,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: this.type.STRING, length: 255, notNull: true },
        run_on: { type: this.type.DATE_TIME, notNull: true }
      },
      ifNotExists: false
    };

    return this.all('select version() as version')
      .then(
        function (result) {
          if (result && result.length > 0 && result[0].version) {
            var version = result[0].version;
            var match = version.match(/\d+\.\d+\.\d+/);
            if (match && match[0] && semver.gte(match[0], '9.1.0')) {
              options.ifNotExists = true;
            }
          }

          // Get the current search path so we can change the current schema
          // if necessary
          return this.all('SHOW search_path');
        }.bind(this)
      )
      .then(
        function (result) {
          var searchPath;

          // if the user specified a different schema, prepend it to the
          // search path. This will make all DDL/DML/SQL operate on the specified
          // schema.
          if (this.schema === 'public') {
            searchPath = result[0].search_path;
          } else {
            searchPath = '"' + this.schema + '",' + result[0].search_path;
          }

          return this.all('SET search_path TO ' + searchPath);
        }.bind(this)
      )
      .then(
        function () {
          return this.all(
            "SELECT table_name FROM information_schema.tables WHERE table_name = '" +
              this.internals.seedTable +
              "'" +
              (this.schema ? " AND table_schema = '" + this.schema + "'" : '')
          );
        }.bind(this)
      )
      .then(
        function (result) {
          if (result && result.length < 1) {
            return this.createTable(this.internals.seedTable, options);
          } else {
            return Promise.resolve();
          }
        }.bind(this)
      )
      .nodeify(callback);
  },

  createColumnConstraint: function (spec, options, tableName, columnName) {
    var constraint = [];
    var callbacks = [];
    var cb;

    if (spec.timezone) {
      constraint.push('WITH TIME ZONE');
    }

    if (spec.primaryKey) {
      if (spec.autoIncrement) {
        constraint.push('SERIAL');
      }

      if (options.emitPrimaryKey) {
        constraint.push('PRIMARY KEY');
      }
    }

    if (spec.notNull === true) {
      constraint.push('NOT NULL');
    }

    if (spec.unique) {
      constraint.push('UNIQUE');
    }

    if (spec.defaultValue !== undefined) {
      constraint.push('DEFAULT');
      if (typeof spec.defaultValue === 'string') {
        constraint.push("'" + spec.defaultValue + "'");
      } else if (typeof spec.defaultValue.prep === 'string') {
        constraint.push(spec.defaultValue.prep);
      } else {
        constraint.push(spec.defaultValue);
      }
    }

    // keep foreignKey for backward compatiable, push to callbacks in the future
    if (spec.foreignKey) {
      cb = this.bindForeignKey(tableName, columnName, spec.foreignKey);
    }
    if (spec.comment) {
      // TODO: create a new function addComment is not callable from here
      callbacks.push(
        function (tableName, columnName, comment, callback) {
          var sql = util.format(
            "COMMENT on COLUMN %s.%s IS '%s'",
            tableName,
            columnName,
            comment
          );
          return this.runSql(sql).nodeify(callback);
        }.bind(this, tableName, columnName, spec.comment)
      );
    }

    return {
      foreignKey: cb,
      callbacks: callbacks,
      constraints: constraint.join(' ')
    };
  },

  renameTable: function (tableName, newTableName, callback) {
    let options = {};
    if (typeof callback === 'object') {
      options = callback;
      callback = null;
    }

    var sql = util.format(
      'ALTER TABLE "%s" RENAME TO "%s"',
      tableName,
      newTableName
    );
    return this.runSql(sql).nodeify(callback);
  },

  removeColumn: function (tableName, columnName, callback) {
    let options = {};
    if (typeof callback === 'object') {
      options = callback;
      callback = null;
    }

    if (options.columnStrategy === 'delay') {
      return this.renameColumn(
        tableName,
        columnName,
        options.passthrough.column
      );
    }

    var sql = util.format(
      'ALTER TABLE "%s" DROP COLUMN "%s"',
      tableName,
      columnName
    );

    return this.runSql(sql).nodeify(callback);
  },

  renameColumn: function (tableName, oldColumnName, newColumnName, callback) {
    let options = {};
    if (typeof callback === 'object') {
      options = callback;
      callback = null;
    }

    var sql = util.format(
      'ALTER TABLE "%s" RENAME COLUMN "%s" TO "%s"',
      tableName,
      oldColumnName,
      newColumnName
    );
    return this.runSql(sql).nodeify(callback);
  },

  changeColumn: function (tableName, columnName, columnSpec, callback) {
    let options = {};
    if (typeof callback === 'object') {
      options = callback;
      callback = null;
    }

    return setNotNull.call(this).nodeify(callback);

    function setNotNull () {
      var setOrDrop = columnSpec.notNull === true ? 'SET' : 'DROP';
      var sql = util.format(
        'ALTER TABLE "%s" ALTER COLUMN "%s" %s NOT NULL',
        tableName,
        columnName,
        setOrDrop
      );

      return this.runSql(sql).then(setUnique.bind(this));
    }

    function setUnique () {
      var sql;
      var constraintName = tableName + '_' + columnName + '_key';

      if (columnSpec.unique === true) {
        sql = util.format(
          'ALTER TABLE "%s" ADD CONSTRAINT "%s" UNIQUE ("%s")',
          tableName,
          constraintName,
          columnName
        );
        return this.runSql(sql).then(setDefaultValue.bind(this));
      } else if (columnSpec.unique === false) {
        sql = util.format(
          'ALTER TABLE "%s" DROP CONSTRAINT "%s"',
          tableName,
          constraintName
        );
        return this.runSql(sql).then(setDefaultValue.bind(this));
      } else {
        return setDefaultValue.call(this);
      }
    }

    function setDefaultValue () {
      var sql;

      if (columnSpec.defaultValue !== undefined) {
        var defaultValue = null;
        if (typeof columnSpec.defaultValue === 'string') {
          defaultValue = "'" + columnSpec.defaultValue + "'";
        } else {
          defaultValue = columnSpec.defaultValue;
        }
        sql = util.format(
          'ALTER TABLE "%s" ALTER COLUMN "%s" SET DEFAULT %s',
          tableName,
          columnName,
          defaultValue
        );
      } else {
        sql = util.format(
          'ALTER TABLE "%s" ALTER COLUMN "%s" DROP DEFAULT',
          tableName,
          columnName
        );
      }
      return this.runSql(sql).then(setType.bind(this));
    }

    function setType () {
      if (columnSpec.type !== undefined) {
        var using =
          columnSpec.using !== undefined
            ? columnSpec.using
            : util.format(
              'USING "%s"::%s',
              columnName,
              this.mapDataType(columnSpec.type)
            );
        var len = columnSpec.length
          ? util.format('(%s)', columnSpec.length)
          : '';
        var sql = util.format(
          'ALTER TABLE "%s" ALTER COLUMN "%s" TYPE %s %s %s',
          tableName,
          columnName,
          this.mapDataType(columnSpec.type),
          len,
          using
        );
        return this.runSql(sql);
      }
    }
  },

  addForeignKey: function (
    tableName,
    referencedTableName,
    keyName,
    fieldMapping,
    rules,
    callback
  ) {
    if (arguments.length === 5 && typeof rules === 'function') {
      callback = rules;
      rules = {};
    }
    var columns = Object.keys(fieldMapping);
    var referencedColumns = columns.map(function (key) {
      return '"' + fieldMapping[key] + '"';
    });
    var sql = util.format(
      'ALTER TABLE "%s" ADD CONSTRAINT "%s" FOREIGN KEY (%s) REFERENCES "%s" (%s) ON DELETE %s ON UPDATE %s',
      tableName,
      keyName,
      this.quoteDDLArr(columns).join(', '),
      referencedTableName,
      referencedColumns.join(', '),
      rules.onDelete || 'NO ACTION',
      rules.onUpdate || 'NO ACTION'
    );
    return this.runSql(sql).nodeify(callback);
  },

  removeForeignKey: function (tableName, keyName, callback) {
    let options = {};
    if (typeof callback === 'object') {
      options = callback;
      callback = null;
    }

    var sql = util.format(
      'ALTER TABLE "%s" DROP CONSTRAINT "%s"',
      tableName,
      keyName
    );
    return this.runSql(sql).nodeify(callback);
  },

  insert: function () {
    var index = 1;

    if (arguments.length > 3) {
      index = 2;
    }

    arguments[index] = arguments[index].map(function (value) {
      return typeof value === 'string' ? value : JSON.stringify(value);
    });

    return this._super.apply(this, arguments);
  },

  runSql: function () {
    var callback;
    var minLength = 1;
    var params;

    if (typeof arguments[arguments.length - 1] === 'function') {
      minLength = 2;
      callback = arguments[arguments.length - 1];
    }

    params = arguments;
    if (params.length > minLength) {
      // We have parameters, but db-migrate uses "?" for param substitutions.
      // PG uses "$1", "$2", etc so fix up the "?" into "$1", etc
      var param = params[0].split('?');
      var newParam = [];
      for (var i = 0; i < param.length - 1; i++) {
        newParam.push(param[i], '$' + (i + 1));
      }
      newParam.push(param[param.length - 1]);
      params[0] = newParam.join('');
    }

    this.log.sql.apply(null, params);
    if (this.internals.dryRun) {
      return Promise.resolve().nodeify(callback);
    }

    return new Promise(
      function (resolve, reject) {
        var prCB = function (err, data) {
          return err ? reject(err) : resolve(data);
        };

        if (minLength === 2) params[params.length - 1] = prCB;
        else params[params.length++] = prCB;

        this.connection.query.apply(this.connection, params);
      }.bind(this)
    ).nodeify(callback);
  },

  _getKV: function (table, key) {
    var sql =
      'SELECT * FROM ' +
      this._escapeDDL +
      table +
      this._escapeDDL +
      ' WHERE key = $1';
    return this.allAsync(sql, [key]).then(([row]) => row);
  },

  all: function (...params) {
    let cb;
    if (typeof params[params.length - 1] === 'function') {
      cb = params.pop();
    }

    this.log.sql.apply(null, params);

    return new Promise(
      function (resolve, reject) {
        var prCB = function (err, data) {
          return err ? reject(err) : resolve(data);
        };
        params.push(function (err, result) {
          prCB(err, result ? result.rows : result);
        });

        this.connection.query.apply(this.connection, params);
      }.bind(this)
    ).nodeify(cb);
  },

  close: function (callback) {
    this.connection.end();
    if (typeof callback === 'function') {
      return Promise.resolve().nodeify(callback);
    } else return Promise.resolve();
  },

  _meta: {
    supports: {
      // all legacy callbacks can be option objects
      optionParam: true,
      // support for column strategies for example on dropping not
      // null columns
      columnStrategies: true
    }
  }
});

Promise.promisifyAll(PgDriver);

exports.connect = function (config, intern, callback) {
  if (config.native) {
    pg = pg.native;
  }
  if (!config.database) {
    config.database = 'postgres';
  }
  var db = config.db || new pg.Client(config);
  db.connect(function (err) {
    if (err) {
      callback(err);
    }
    callback(null, new PgDriver(db, config.schema, intern));
  });
};

exports.base = PgDriver;
