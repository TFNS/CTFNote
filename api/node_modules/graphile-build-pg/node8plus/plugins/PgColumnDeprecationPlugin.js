"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var PgColumnDeprecationPlugin = function PgColumnDeprecationPlugin(builder) {
  builder.hook("GraphQLObjectType:fields:field", (field, build, context) => {
    const {
      scope: {
        pgFieldIntrospection
      }
    } = context;

    if (!pgFieldIntrospection || !pgFieldIntrospection.tags || !pgFieldIntrospection.tags.deprecated) {
      return field;
    }

    return { ...field,
      deprecationReason: Array.isArray(pgFieldIntrospection.tags.deprecated) ? pgFieldIntrospection.tags.deprecated.join("\n") : pgFieldIntrospection.tags.deprecated
    };
  }, ["PgColumnDeprecation"]);
};

exports.default = PgColumnDeprecationPlugin;
//# sourceMappingURL=PgColumnDeprecationPlugin.js.map