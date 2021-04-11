"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PgNodeAliasPostGraphile = async function PgNodeAliasPostGraphile(builder) {
  builder.hook("GraphQLObjectType", (object, build, context) => {
    const {
      setNodeAlias,
      inflection: {
        pluralize
      }
    } = build;

    if (!setNodeAlias) {
      // Node plugin must be disabled.
      return object;
    }

    const {
      scope: {
        isPgRowType,
        isPgCompoundType,
        pgIntrospection: table
      }
    } = context;

    if (isPgRowType || isPgCompoundType) {
      setNodeAlias(object.name, pluralize(table.name));
    }

    return object;
  }, ["PgNodeAliasPostGraphile"]);
};

exports.default = PgNodeAliasPostGraphile;
//# sourceMappingURL=PgNodeAliasPostGraphile.js.map