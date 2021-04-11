var util = require('util');
var events = require('events');
var log;
var type;
var Class = require('./class.js');
var Promise = require('bluebird');

var internals = {};

var Base = Class.extend({
  init: function(intern) {
    this._escapeDDL = this._escapeDDL || '"';
    this._escapeString = this._escapeString || "'";

    internals = intern;
    this.internals = intern;

    log = this.internals.mod.log;
    type = this.internals.mod.type;

    this.eventEmmiter = new events.EventEmitter();
    for (var n in events.EventEmitter.prototype) {
      this[n] = events.EventEmitter.prototype[n];
    }
  },

  close: function() {
    throw new Error('not implemented');
  },

  _translateSpecialDefaultValues: function(
    spec,
    options,
    tableName,
    columnName
  ) {
    spec.defaultValue.prep = null;
    log.warn(
      'special default value ' +
        spec.defaultvalue.special +
        ' is not supported by your driver. Setting to no defaultvalue instead.'
    );
  },

  _prepareSpec: function(columnName, spec, options, tableName) {
    if (spec.defaultValue) {
      if (spec.defaultValue.raw) {
        spec.defaultValue.prep = spec.defaultValue.raw;
      } else if (spec.defaultValue.special) {
        this._translateSpecialDefaultValues(
          spec,
          options,
          tableName,
          columnName
        );
      }
    }
  },

  mapDataType: function(str) {
    switch (str) {
      case type.STRING:
        return 'VARCHAR';
      case type.TEXT:
        return 'TEXT';
      case type.INTEGER:
        return 'INTEGER';
      case type.BIG_INTEGER:
        return 'BIGINT';
      case type.DATE_TIME:
        return 'INTEGER';
      case type.REAL:
        return 'REAL';
      case type.BLOB:
        return 'BLOB';
      case type.TIMESTAMP:
        return 'TIMESTAMP';
      case type.BINARY:
        return 'BINARY';
      case type.BOOLEAN:
        return 'BOOLEAN';
      case type.DECIMAL:
        return 'DECIMAL';
      case type.CHAR:
        return 'CHAR';
      case type.DATE:
        return 'DATE';
      case type.SMALLINT:
        return 'SMALLINT';
      default:
        var unknownType = str.toUpperCase();
        log.warn('Using unknown data type', unknownType);
        return unknownType;
    }
  },

  truncate: function(tableName, callback) {
    return this.runSql(
      'TRUNCATE ' + this._escapeDDL + tableName + this._escapeDDL
    ).nodeify(callback);
  },

  checkDBMS: function(dbms, callback) {
    if (this.dbms === dbms) return Promise.resolve(dbms).nodeify(callback);
    else return Promise.reject('dbms does not match');
  },

  createDatabase: function() {
    throw new Error('not implemented');
  },

  showDatabase: function() {
    throw new Error('not implemented');
  },

  switchDatabase: function() {
    throw new Error('not implemented');
  },

  dropDatabase: function() {
    throw new Error('not implemented');
  },

  recurseCallbackArray: function(foreignKeys, callback) {
    var fkFunc;
    var promises = [];

    while ((fkFunc = foreignKeys.pop())) {
      promises.push(Promise.resolve(fkFunc()));
    }

    return Promise.all(promises).nodeify(callback);
  },

  bindForeignKey: function(tableName, columnName, fkOptions) {
    var self = this;
    var mapping = {};

    if (typeof fkOptions.mapping === 'string') {
      mapping[columnName] = fkOptions.mapping;
    } else mapping = fkOptions.mapping;

    return function(callback) {
      if (typeof callback === 'function') {
        self.addForeignKey(
          tableName,
          fkOptions.table,
          fkOptions.name,
          mapping,
          fkOptions.rules,
          callback
        );
      } else {
        return self.addForeignKey(
          tableName,
          fkOptions.table,
          fkOptions.name,
          mapping,
          fkOptions.rules
        );
      }
    };
  },

  createColumnDef: function(name, spec, options) {
    name = this._escapeDDL + name + this._escapeDDL;
    var type = this.mapDataType(spec.type);
    var len = spec.length ? util.format('(%s)', spec.length) : '';
    var constraint = this.createColumnConstraint(spec, options);

    return {
      foreignKey: null,
      constraints: [name, type, len, constraint].join(' ')
    };
  },

  _createList: function(table, opt = {}) {
    var options = {
      columns: {
        id: {
          type: type.INTEGER,
          notNull: true,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: type.STRING, length: 255, notNull: true },
        run_on: { type: type.DATE_TIME, notNull: true }
      },
      ifNotExists: true
    };
    return this.createTable(table, options);
  },

  _createKV: function(table, opt = { valueJson: false }) {
    var options = {
      columns: {
        key: {
          type: type.STRING,
          notNull: true,
          primaryKey: true,
          unique: true
        },
        value: { type: type.TEXT, notNull: true },
        run_on: { type: type.DATE_TIME, notNull: true }
      },
      ifNotExists: true
    };
    return this.createTable(table, options);
  },

  createMigrationsTable: function(callback) {
    var options = {
      columns: {
        id: {
          type: type.INTEGER,
          notNull: true,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: type.STRING, length: 255, notNull: true },
        run_on: { type: type.DATE_TIME, notNull: true }
      },
      ifNotExists: true
    };
    this.createTable(this.internals.migrationTable, options, callback);
  },

  createSeedsTable: function(callback) {
    var options = {
      columns: {
        id: {
          type: type.INTEGER,
          notNull: true,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: type.STRING, length: 255, notNull: true },
        run_on: { type: type.DATE_TIME, notNull: true }
      },
      ifNotExists: true
    };
    this.createTable(this.internals.seedTable, options, callback);
  },

  _handleMultiPrimaryKeys: function(primaryKeyColumns) {
    return util.format(
      ', PRIMARY KEY (%s)',
      this.quoteDDLArr(
        primaryKeyColumns.map(function(value) {
          return value.name;
        })
      ).join(', ')
    );
  },

  createTable: function(tableName, options, callback) {
    log.verbose('creating table:', tableName);
    var columnSpecs = options;
    var opts = {};

    if (options.columns !== undefined) {
      columnSpecs = options.columns;
      opts = options;
    }

    var ifNotExistsSql = '';
    if (opts.ifNotExists) {
      ifNotExistsSql = 'IF NOT EXISTS';
    }

    var primaryKeyColumns = [];
    var columnDefOptions = {
      emitPrimaryKey: false
    };

    for (var columnName in columnSpecs) {
      var columnSpec = this.normalizeColumnSpec(columnSpecs[columnName]);
      columnSpecs[columnName] = columnSpec;
      if (columnSpec.primaryKey) {
        primaryKeyColumns.push({ spec: columnSpec, name: columnName });
      }
    }

    var pkSql = '';
    if (primaryKeyColumns.length > 1) {
      pkSql = this._handleMultiPrimaryKeys(primaryKeyColumns);
    } else if (primaryKeyColumns.length === 1) {
      primaryKeyColumns[0] = primaryKeyColumns[0].name;
      columnDefOptions.emitPrimaryKey = true;
    }

    var columnDefs = [];
    var callbacks = [];
    var extensions = '';
    var tableOptions = '';

    for (var columnName in columnSpecs) {
      var columnSpec = columnSpecs[columnName];
      this._prepareSpec(columnName, columnSpec, columnDefOptions, tableName);
      var constraint = this.createColumnDef(
        columnName,
        columnSpec,
        columnDefOptions,
        tableName
      );

      columnDefs.push(constraint.constraints);

      // check foreignKey for backward compatiable
      if (constraint.foreignKey) callbacks.push(constraint.foreignKey);
      if (constraint.callbacks) {
        // support multiple callbacks
        callbacks = callbacks.concat(constraint.callbacks);
      }
    }

    if (typeof this._applyExtensions === 'function') {
      extensions = this._applyExtensions(options, tableName);
    }

    if (typeof this._applyTableOptions === 'function') {
      tableOptions = this._applyTableOptions(options, tableName);
    }

    var sql = util.format(
      'CREATE TABLE %s %s (%s%s%s) %s',
      ifNotExistsSql,
      this.escapeDDL(tableName),
      columnDefs.join(', '),
      extensions,
      pkSql,
      tableOptions
    );

    return this.runSql(sql)
      .then(
        function() {
          if (this._dbmControl === true) this._counter.signal();

          return this.recurseCallbackArray(callbacks);
        }.bind(this)
      )
      .nodeify(callback);
  },

  dropTable: function(tableName, options, callback) {
    if (arguments.length < 3 && typeof options === 'function') {
      callback = options;
      options = {};
    } else {
      options = options || {};
    }

    var ifExistsSql = '';
    if (options.ifExists) {
      ifExistsSql = 'IF EXISTS';
    }
    var sql = util.format(
      'DROP TABLE %s %s',
      ifExistsSql,
      this.escapeDDL(tableName)
    );

    return this.runSql(sql).nodeify(callback);
  },

  renameTable: function(tableName, newTableName, callback) {
    throw new Error('not implemented');
  },

  addColumn: function(tableName, columnName, columnSpec, callback) {
    var columnSpec = this.normalizeColumnSpec(columnSpec);
    this._prepareSpec(columnName, columnSpec, {}, tableName);
    var def = this.createColumnDef(columnName, columnSpec, {}, tableName);
    var extensions = '';
    var self = this;

    if (typeof this._applyAddColumnExtension === 'function') {
      extensions = this._applyAddColumnExtension(def, tableName, columnName);
    }

    var sql = util.format(
      'ALTER TABLE %s ADD COLUMN %s %s',
      this.escapeDDL(tableName),
      def.constraints,
      extensions
    );

    return this.runSql(sql)
      .then(function() {
        if (this._dbmControl === true) this._counter.signal();

        var callbacks = def.callbacks || [];
        if (def.foreignKey) callbacks.push(def.foreignKey);
        return self.recurseCallbackArray(callbacks);
      })
      .nodeify(callback);
  },

  removeColumn: function(tableName, columnName, callback) {
    throw new Error('not implemented');
  },

  renameColumn: function(tableName, oldColumnName, newColumnName, callback) {
    throw new Error('not implemented');
  },

  changeColumn: function(tableName, columnName, columnSpec, callback) {
    throw new Error('not implemented');
  },

  quoteDDLArr: function(arr) {
    for (var i = 0; i < arr.length; ++i) {
      arr[i] = this._escapeDDL + arr[i] + this._escapeDDL;
    }

    return arr;
  },

  quoteArr: function(arr) {
    for (var i = 0; i < arr.length; ++i) {
      arr[i] = this._escapeString + arr[i] + this._escapeString;
    }

    return arr;
  },

  addIndex: function(tableName, indexName, columns, unique, callback) {
    if (typeof unique === 'function') {
      callback = unique;
      unique = false;
    }

    if (!Array.isArray(columns)) {
      columns = [columns];
    }
    var sql = util.format(
      'CREATE %s INDEX "%s" ON "%s" (%s)',
      unique ? 'UNIQUE' : '',
      indexName,
      tableName,
      this.quoteDDLArr(columns).join(', ')
    );

    return this.runSql(sql).nodeify(callback);
  },

  insert: function(tableName, valueArray, callback) {
    var columnNameArray = {};

    if (arguments.length > 3 || Array.isArray(callback)) {
      columnNameArray = valueArray;
      valueArray = callback;
    } else {
      var names;
      if (Array.isArray(valueArray)) {
        names = Object.keys(valueArray[0]);
      } else {
        names = Object.keys(valueArray);
      }

      for (var i = 0; i < names.length; ++i) {
        columnNameArray[names[i]] = names[i];
      }
    }

    if (columnNameArray.length !== valueArray.length) {
      return Promise.reject(
        new Error('The number of columns does not match the number of values.')
      ).nodeify(callback);
    }

    var sql = util.format('INSERT INTO %s ', this.escapeDDL(tableName));
    var columnNames = '(';
    var values = 'VALUES ';
    var values_part = [];

    for (var index in columnNameArray) {
      columnNames += this.escapeDDL(columnNameArray[index]);

      if (Array.isArray(valueArray) && typeof valueArray[0] === 'object') {
        for (var i = 0; i < valueArray.length; ++i) {
          values_part[i] = values_part[i] || '';

          if (typeof valueArray[i][index] === 'string') {
            values_part[i] += this.escapeString(valueArray[i][index]);
          } else {
            values_part[i] += valueArray[i][index];
          }
        }
      } else {
        if (typeof valueArray[index] === 'string') {
          values_part += this.escapeString(valueArray[index]);
        } else {
          values_part += valueArray[index];
        }

        values_part += ',';
      }

      columnNames += ',';
    }

    if (Array.isArray(valueArray) && typeof valueArray[0] === 'object') {
      for (var i = 0; i < values_part.length; ++i) {
        values += '(' + values_part[i].slice(0, -1) + '),';
      }

      values = values.slice(0, -1);
    } else {
      values += '(' + values_part.slice(0, -1) + ')';
    }

    sql += columnNames.slice(0, -1) + ') ' + values + ';';

    return this.runSql(sql).nodeify(callback);
  },

  update: function(tableName, valueArray, ids, callback) {
    var columnNameArray = {};

    if (arguments.length > 4 && arguments[1].length !== arguments[2].length) {
      return callback(
        new Error('The number of columns does not match the number of values.')
      );
    } else if (arguments.length > 4) {
      columnNameArray = valueArray;
      valueArray = ids;
      ids = callback;
      callback = arguments[4];
    } else {
      var names;
      if (Array.isArray(valueArray)) {
        names = Object.keys(valueArray[0]);
      } else {
        names = Object.keys(valueArray);
      }

      for (var i = 0; i < names.length; ++i) {
        columnNameArray[names[i]] = names[i];
      }
    }

    var sql = util.format(
      'UPDATE ' + this._escapeDDL + '%s' + this._escapeDDL + ' SET ',
      tableName
    );

    for (var index in columnNameArray) {
      sql += columnNameArray[index] + '=';

      if (typeof valueArray[index] === 'string') {
        sql +=
          this._escapeString +
          this.escape(valueArray[index]) +
          this._escapeString;
      } else {
        sql += valueArray[index];
      }

      if (index != columnNameArray.length - 1) {
        sql += ', ';
      }
    }

    sql = sql.substring(0, sql.length - 2) + ' ' + this.buildWhereClause(ids);
    return this.runSql(sql).nodeify(callback);
  },

  lookup: function(tableName, column, id, callback) {
    var sql =
      'SELECT ' +
      this.escapeDDL(column) +
      ' FROM ' +
      this.escapeDDL(tableName) +
      ' ' +
      this.buildWhereClause(id);

    return this.runSql(sql).then(function(row) {
      return row[0];
    });
  },

  removeIndex: function(tableName, indexName, callback) {
    if (arguments.length === 2 && typeof indexName === 'function') {
      callback = indexName;
      indexName = tableName;
    } else if (arguments.length === 1 && typeof tableName === 'string') {
      indexName = tableName;
    }

    var sql = util.format('DROP INDEX "%s"', indexName);
    return this.runSql(sql).nodeify(callback);
  },

  addForeignKey: function() {
    throw new Error('not implemented');
  },

  removeForeignKey: function() {
    throw new Error('not implemented');
  },

  normalizeColumnSpec: function(obj) {
    if (typeof obj === 'string') {
      return { type: obj };
    } else {
      return obj;
    }
  },

  _insertEntry: function(table, name) {
    return this.runSql(
      'INSERT INTO ' +
        this.escapeDDL(table) +
        ' (' +
        this.escapeDDL('name') +
        ', ' +
        this.escapeDDL('run_on') +
        ') VALUES (?, ?)',
      [name, new Date()]
    );
  },

  _insertKV: function(table, key, value) {
    return this.runSql(
      `INSERT INTO ${this.escapeDDL(table)}
        (${this.escapeDDL('key')}, ${this.escapeDDL('value')}, ${this.escapeDDL(
        'run_on'
      )}) VALUES (?, ?, ?)`,
      [key, value, new Date()]
    );
  },

  _updateKV: function(table, key, value) {
    return this.runSql(
      `UPDATE ${this.escapeDDL(table)} SET ${this.escapeDDL('value')} = ?,
      ${this.escapeDDL('run_on')} = ? 
      WHERE ${this.escapeDDL('key')} = ?`,
      [value, new Date(), key]
    );
  },

  _updateKVC: function(table, key, value, c, v) {
    return this.runSql(
      `UPDATE ${this.escapeDDL(table)} SET ${this.escapeDDL('value')} = ?,
      ${this.escapeDDL('run_on')} = ? 
      WHERE ${this.escapeDDL('key')} = ? AND ${this.escapeDDL(c)} = ?`,
      [value, new Date(), key, v]
    );
  },

  addMigrationRecord: function(name, callback) {
    this.runSql(
      'INSERT INTO ' +
        this.escapeDDL(this.internals.migrationTable) +
        ' (' +
        this.escapeDDL('name') +
        ', ' +
        this.escapeDDL('run_on') +
        ') VALUES (?, ?)',
      [name, new Date()],
      callback
    );
  },

  addSeedRecord: function(name, callback) {
    this.runSql(
      'INSERT INTO ' +
        this.escapeDDL(this.internals.seedTable) +
        ' (' +
        this.escapeDDL('name') +
        ', ' +
        this.escapeDDL('run_on') +
        ') VALUES (?, ?)',
      [name, new Date()],
      callback
    );
  },

  startMigration: function(cb) {
    return Promise.resolve().nodeify(cb);
  },
  endMigration: function(cb) {
    return Promise.resolve().nodeify(cb);
  },
  // sql, params, callback
  // sql, callback
  runSql: function() {
    throw new Error('not implemented');
  },

  _getList: function(table) {
    var sql =
      'SELECT * FROM ' +
      this._escapeDDL +
      table +
      this._escapeDDL +
      ` ORDER BY ${this.escapeDDL('run_on')} DESC,
      ${this.escapeDDL('name')} DESC`;
    return this.allAsync(sql);
  },

  _getKV: function(table, key) {
    var sql =
      'SELECT * FROM ' +
      this._escapeDDL +
      table +
      this._escapeDDL +
      ` WHERE ${this.escapeDDL('key')} = ?`;
    return this.allAsync(sql, [key]).then(([row]) => row);
  },

  /**
   * Queries the migrations table
   *
   * @param callback
   */
  allLoadedMigrations: function(callback) {
    var sql =
      'SELECT * FROM ' +
      this._escapeDDL +
      this.internals.migrationTable +
      this._escapeDDL +
      ' ORDER BY run_on DESC, name DESC';
    return this.all(sql, callback);
  },

  /**
   * Queries the seeds table
   *
   * @param callback
   */
  allLoadedSeeds: function(callback) {
    var sql =
      'SELECT * FROM ' +
      this._escapeDDL +
      this.internals.seedTable +
      this._escapeDDL +
      ' ORDER BY run_on DESC, name DESC';
    return this.all(sql, callback);
  },

  _deleteEntry: function(table, entry) {
    var sql =
      'DELETE FROM ' +
      this._escapeDDL +
      table +
      this._escapeDDL +
      ' WHERE name = ?';
    return this.runSql(sql, [entry]);
  },

  _deleteExpired: function(table, expiry) {
    var sql =
      'DELETE FROM ' +
      this._escapeDDL +
      table +
      this._escapeDDL +
      ' WHERE run_on <= ?';
    return this.runSql(sql, [expiry]);
  },

  _deleteKV: function(table, key) {
    var sql =
      'DELETE FROM ' +
      this._escapeDDL +
      table +
      this._escapeDDL +
      ` WHERE ${this.escapeDDL('key')} = ?`;
    return this.runSql(sql, [key]);
  },

  /**
   * Deletes a migration
   *
   * @param migrationName   - The name of the migration to be deleted
   */
  deleteMigration: function(migrationName, callback) {
    var sql =
      'DELETE FROM ' +
      this._escapeDDL +
      this.internals.migrationTable +
      this._escapeDDL +
      ' WHERE name = ?';
    this.runSql(sql, [migrationName], callback);
  },

  /**
   * Removes the specified keys from the database
   *
   * @param table - The table in which the to be deleted values are located
   * @param ids - array or object
   * id array  - arrayof the to be deleted ids
   * id object - { table: "name of the table to resolve the ids from",
   *               column: [
   *               {
   *                 name: "name of column", //defaults to id if unset
   *                 operator: ">", //defaults to = if unset
   *                 searchValue: "12",
   *                 searchValue: { table: "source", column: [...] },
   *                 //recursion with objects possible
   *                 link: "AND" //defaults to AND if unset
   *               }
   *               ]
   *             }
   *
   * @return Promise(runSql)
   */
  remove: function(table, ids, callback) {
    var sql = 'DELETE FROM ' + this._escapeDDL + table + +this._escapeDDL;
    // var searchClause = '';

    return this.runSql(sql + this.buildWhereClause(ids)).nodeify(callback);
  },

  /**
   * Builds a where clause out of column objects.
   *
   * @param ids - array or object
   * id array  - arrayof the to be deleted ids
   * id object - { table: "name of the table to resolve the ids from",
   *               column: [
   *               {
   *                 name: "name of column", //defaults to id if unset
   *                 operator: ">", //defaults to = if unset
   *                 searchValue: "12",
   *                 searchValue: { table: "source", column: [...] },
   *                 //recursion with objects possible
   *                 link: "AND" //defaults to AND if unset
   *               }
   *               ]
   *             }
   *
   * @return string
   */
  buildWhereClause: function(ids) {
    var searchClause = '';

    if (Array.isArray(ids) && typeof ids[0] !== 'object' && ids.length > 1) {
      searchClause +=
        'WHERE id IN (' +
        ids.join(this._escapeString + ',' + this._escapeString) +
        ')';
    } else if (
      typeof ids === 'string' ||
      ids.length === 1 ||
      typeof ids === 'number'
    ) {
      var id = Array.isArray(ids) ? ids[0] : ids;
      searchClause +=
        'WHERE id = ' + this._escapeString + id + this._escapeString;
    } else if (Array.isArray(ids) && typeof ids[0] === 'object') {
      var preLink = '';
      searchClause = ' WHERE ';

      for (var column in ids) {
        var columnKeys = Object.keys(ids[column]);

        if (columnKeys.length === 1) {
          var _column = {
            name: columnKeys[0],
            value: ids[column][columnKeys[0]]
          };

          column = _column;
        } else {
          column = ids[column];
        }

        (column.name = column.name || 'id'),
          (column.operator = column.operator || '='),
          (column.link = column.link || 'AND');

        if (!column.value) {
          return Promise.reject(
            'column ' + column.name + ' was entered without a search value.'
          );
        }

        searchClause +=
          ' ' +
          preLink +
          ' ' +
          this._escapeDDL +
          column.name +
          this._escapeDDL +
          ' ' +
          column.operator;

        if (
          typeof searchValue === 'object' &&
          typeof searchValue.table === 'string' &&
          typeof searchValue.columns === 'object'
        ) {
          searchClause +=
            ' (SELECT ' +
            this._escapeDDL +
            column.selector +
            this._escapeDDL +
            ' FROM ' +
            this._escapeDDL +
            column.searchValue.table +
            this._escapeDDL +
            this.buildWhereClause(column.searchValue.column) +
            ')';
        } else {
          searchClause +=
            ' (' + this._escapeString + column.value + this._escapeString + ')';
        }

        preLink = column.link;
      }
    } else if (typeof ids === 'object') {
      var key = Object.keys(ids);
      var preLink = '';
      searchClause += 'WHERE ';

      for (var i = 0; i < key.length; ++i) {
        searchClause +=
          preLink +
          this._escapeDDL +
          key[i] +
          this._escapeDDL +
          ' = ' +
          this._escapeString +
          ids[key[i]] +
          this._escapeString;
        preLink = ' AND ';
      }
    }

    return searchClause;
  },

  /**
   * Deletes a seed
   *
   * @param seedName   - The name of the seed to be deleted
   */
  deleteSeed: function(seedName, callback) {
    var sql =
      'DELETE FROM ' +
      this._escapeDDL +
      this.internals.seedTable +
      this._escapeDDL +
      ' WHERE name = ?';
    this.runSql(sql, [seedName], callback);
  },

  all: function(sql, params, callback) {
    throw new Error('not implemented');
  },

  escape: function(str) {
    if (this._escapeString === "'") return str.replace(/'/g, "''");
    else return str.replace(/"/g, '"""');
  },

  escapeString: function(str) {
    return this._escapeString + this.escape(str) + this._escapeString;
  },

  escapeDDL: function(str) {
    return this._escapeDDL + str + this._escapeDDL;
  }
});

Promise.promisifyAll(Base);

module.exports = Base;
