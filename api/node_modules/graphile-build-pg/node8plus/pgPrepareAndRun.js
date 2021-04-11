"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pgPrepareAndRun;

var _crypto = require("crypto");

var _lru = _interopRequireDefault(require("@graphile/lru"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cacheSizeFromEnv = parseInt(process.env.POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE, 10);
const POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE = !!cacheSizeFromEnv || cacheSizeFromEnv === 0 ? cacheSizeFromEnv : 100;
let lastString;
let lastHash;

const hash = str => {
  if (str !== lastString) {
    lastString = str;
    lastHash = (0, _crypto.createHash)("sha1").update(str).digest("base64");
  }

  return lastHash;
};

function pgPrepareAndRun(pgClient, text, // eslint-disable-next-line flowtype/no-weak-types
values) {
  const connection = pgClient.connection;

  if (!values || POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE < 2 || !connection || !connection.parsedStatements) {
    return pgClient.query(text, values);
  } else {
    const name = hash(text);

    if (!connection._graphilePreparedStatementCache) {
      connection._graphilePreparedStatementCache = new _lru.default({
        maxLength: POSTGRAPHILE_PREPARED_STATEMENT_CACHE_SIZE,

        dispose(key) {
          if (connection.parsedStatements[key]) {
            pgClient.query(`deallocate ${pgClient.escapeIdentifier(key)}`).then(() => {
              delete connection.parsedStatements[key];
            }).catch(e => {
              // eslint-disable-next-line no-console
              console.error("Error releasing prepared query", e);
            });
          }
        }

      });
    }

    if (!connection._graphilePreparedStatementCache.get(name)) {
      // We're relying on dispose to clear out the old ones.
      connection._graphilePreparedStatementCache.set(name, true);
    }

    return pgClient.query({
      name,
      text,
      values
    });
  }
}
//# sourceMappingURL=pgPrepareAndRun.js.map