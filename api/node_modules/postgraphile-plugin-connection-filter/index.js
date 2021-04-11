const ConnectionArgFilterPlugin = require("./src/ConnectionArgFilterPlugin.js");
const PgConnectionArgFilterPlugin = require("./src/PgConnectionArgFilterPlugin.js");
const PgConnectionArgFilterColumnsPlugin = require("./src/PgConnectionArgFilterColumnsPlugin.js");
const PgConnectionArgFilterComputedColumnsPlugin = require("./src/PgConnectionArgFilterComputedColumnsPlugin.js");
const PgConnectionArgFilterCompositeTypeColumnsPlugin = require("./src/PgConnectionArgFilterCompositeTypeColumnsPlugin.js");
const PgConnectionArgFilterRecordFunctionsPlugin = require("./src/PgConnectionArgFilterRecordFunctionsPlugin.js");
const PgConnectionArgFilterBackwardRelationsPlugin = require("./src/PgConnectionArgFilterBackwardRelationsPlugin.js");
const PgConnectionArgFilterForwardRelationsPlugin = require("./src/PgConnectionArgFilterForwardRelationsPlugin.js");
const PgConnectionArgFilterLogicalOperatorsPlugin = require("./src/PgConnectionArgFilterLogicalOperatorsPlugin.js");
const PgConnectionArgFilterOperatorsPlugin = require("./src/PgConnectionArgFilterOperatorsPlugin.js");

module.exports = function PostGraphileConnectionFilterPlugin(
  builder,
  configOptions
) {
  builder.hook("build", build => {
    const pkg = require("./package.json");

    // Check dependencies
    if (!build.versions) {
      throw new Error(
        `Plugin ${pkg.name}@${pkg.version} requires graphile-build@^4.1.0 in order to check dependencies (current version: ${build.graphileBuildVersion})`
      );
    }
    const depends = (name, range) => {
      if (!build.hasVersion(name, range)) {
        throw new Error(
          `Plugin ${pkg.name}@${pkg.version} requires ${name}@${range} (${
            build.versions[name]
              ? `current version: ${build.versions[name]}`
              : "not found"
          })`
        );
      }
    };
    depends("graphile-build-pg", "^4.5.0");

    // Register this plugin
    build.versions = build.extend(build.versions, { [pkg.name]: pkg.version });

    return build;
  });

  const defaultOptions = {
    //connectionFilterAllowedOperators,
    //connectionFilterAllowedFieldTypes,
    connectionFilterArrays: true,
    connectionFilterComputedColumns: true,
    //connectionFilterOperatorNames,
    connectionFilterRelations: false,
    connectionFilterSetofFunctions: true,
    connectionFilterLogicalOperators: true,
    connectionFilterAllowNullInput: false,
    connectionFilterAllowEmptyObjectInput: false,
  };
  const options = {
    ...defaultOptions,
    ...configOptions,
  };
  const {
    connectionFilterRelations,
    connectionFilterLogicalOperators,
  } = options;

  ConnectionArgFilterPlugin(builder, options);
  PgConnectionArgFilterPlugin(builder, options);
  PgConnectionArgFilterColumnsPlugin(builder, options);
  PgConnectionArgFilterComputedColumnsPlugin(builder, options);
  PgConnectionArgFilterCompositeTypeColumnsPlugin(builder, options);
  PgConnectionArgFilterRecordFunctionsPlugin(builder, options);

  if (connectionFilterRelations) {
    PgConnectionArgFilterBackwardRelationsPlugin(builder, options);
    PgConnectionArgFilterForwardRelationsPlugin(builder, options);
  }

  if (connectionFilterLogicalOperators) {
    PgConnectionArgFilterLogicalOperatorsPlugin(builder, options);
  }

  PgConnectionArgFilterOperatorsPlugin(builder, options);
};
