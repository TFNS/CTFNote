module.exports = function PgConnectionArgFilterRecordFunctionsPlugin(
  builder,
  { connectionFilterSetofFunctions }
) {
  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      newWithHooks,
      pgSql: sql,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgGetGqlTypeByTypeIdAndModifier,
      inflection,
      describePgEntity,
      connectionFilterOperatorsType,
      connectionFilterRegisterResolver,
      connectionFilterResolve,
      connectionFilterTypesByTypeName,
    } = build;
    const {
      fieldWithHooks,
      scope: { pgIntrospection: proc, isPgConnectionFilter },
      Self,
    } = context;

    if (!isPgConnectionFilter || proc.kind !== "procedure") return fields;

    connectionFilterTypesByTypeName[Self.name] = Self;

    // Must return a `RECORD` type
    const isRecordLike = proc.returnTypeId === "2249";
    if (!isRecordLike) return fields;

    // Must be marked @filterable OR enabled via plugin option
    if (!(proc.tags.filterable || connectionFilterSetofFunctions))
      return fields;

    const argModesWithOutput = [
      "o", // OUT,
      "b", // INOUT
      "t", // TABLE
    ];
    const outputArgNames = proc.argTypeIds.reduce((prev, _, idx) => {
      if (argModesWithOutput.includes(proc.argModes[idx])) {
        prev.push(proc.argNames[idx] || "");
      }
      return prev;
    }, []);
    const outputArgTypes = proc.argTypeIds.reduce((prev, typeId, idx) => {
      if (argModesWithOutput.includes(proc.argModes[idx])) {
        prev.push(introspectionResultsByKind.typeById[typeId]);
      }
      return prev;
    }, []);

    const outputArgByFieldName = outputArgNames.reduce(
      (memo, outputArgName, idx) => {
        const fieldName = inflection.functionOutputFieldName(
          proc,
          outputArgName,
          idx + 1
        );
        if (memo[fieldName]) {
          throw new Error(
            `Tried to register field name '${fieldName}' twice in '${describePgEntity(
              proc
            )}'; the argument names are too similar.`
          );
        }
        memo[fieldName] = {
          name: outputArgName,
          type: outputArgTypes[idx],
        };
        return memo;
      },
      {}
    );

    const outputArgFields = Object.entries(outputArgByFieldName).reduce(
      (memo, [fieldName, outputArg]) => {
        const OperatorsType = connectionFilterOperatorsType(
          newWithHooks,
          outputArg.type.id,
          null
        );
        if (!OperatorsType) {
          return memo;
        }
        return extend(memo, {
          [fieldName]: fieldWithHooks(
            fieldName,
            {
              description: `Filter by the object’s \`${fieldName}\` field.`,
              type: OperatorsType,
            },
            {
              isPgConnectionFilterField: true,
            }
          ),
        });
      },
      {}
    );

    const resolve = ({ sourceAlias, fieldName, fieldValue, queryBuilder }) => {
      if (fieldValue == null) return null;

      const outputArg = outputArgByFieldName[fieldName];

      const sqlIdentifier = sql.query`${sourceAlias}.${sql.identifier(
        outputArg.name
      )}`;

      const typeName = pgGetGqlTypeByTypeIdAndModifier(outputArg.type.id, null)
        .name;
      const filterTypeName = inflection.filterType(typeName);

      return connectionFilterResolve(
        fieldValue,
        sqlIdentifier,
        filterTypeName,
        queryBuilder,
        outputArg.type,
        null,
        fieldName
      );
    };

    for (const fieldName of Object.keys(outputArgFields)) {
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    }

    return extend(fields, outputArgFields);
  });
};
