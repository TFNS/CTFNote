"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphileBuild = require("graphile-build");

class PgLiveProvider extends _graphileBuild.LiveProvider {
  // eslint-disable-next-line flowtype/no-weak-types
  constructor(...args) {
    super(...args);
    this.namespace = "pg";
  }

  collectionIdentifierIsValid(collectionIdentifier) {
    return collectionIdentifier && collectionIdentifier.kind === "class";
  }

  recordIdentifierIsValid(collectionIdentifier, // eslint-disable-next-line flowtype/no-weak-types
  recordIdentifier) {
    if (!Array.isArray(recordIdentifier)) return false;
    if (!collectionIdentifier.primaryKeyConstraint) return false;

    if (recordIdentifier.length !== collectionIdentifier.primaryKeyConstraint.keyAttributes.length) {
      return false;
    } // TODO: more validation would not go amiss


    return true;
  }

}

exports.default = PgLiveProvider;
//# sourceMappingURL=PgLiveProvider.js.map