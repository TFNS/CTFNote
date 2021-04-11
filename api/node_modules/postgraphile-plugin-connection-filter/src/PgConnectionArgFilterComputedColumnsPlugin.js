module.exports = function PgConnectionArgFilterComputedColumnsPlugin(
  builder,
  { connectionFilterComputedColumns }
) {
  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      newWithHooks,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgOmit: omit,
      pgSql: sql,
      inflection,
      connectionFilterOperatorsType,
      connectionFilterRegisterResolver,
      connectionFilterResolve,
      connectionFilterTypesByTypeName,
    } = build;
    const {
      scope: { isPgConnectionFilter, pgIntrospection: table },
      fieldWithHooks,
      Self,
    } = context;

    if (!isPgConnectionFilter || !table || table.kind !== "class") {
      return fields;
    }

    connectionFilterTypesByTypeName[Self.name] = Self;

    const procByFieldName = introspectionResultsByKind.procedure.reduce(
      (memo, proc) => {
        // Must be marked @filterable OR enabled via plugin option
        if (!(proc.tags.filterable || connectionFilterComputedColumns))
          return memo;

        // Must not be omitted
        if (omit(proc, "execute")) return memo;
        if (omit(proc, "filter")) return memo;

        // Must be a computed column
        const computedColumnDetails = getComputedColumnDetails(
          build,
          table,
          proc
        );
        if (!computedColumnDetails) return memo;
        const { pseudoColumnName } = computedColumnDetails;

        // Must have only one required argument
        const inputArgsCount = proc.argTypeIds.filter(
          (_typeId, idx) =>
            proc.argModes.length === 0 || // all args are `in`
            proc.argModes[idx] === "i" || // this arg is `in`
            proc.argModes[idx] === "b" // this arg is `inout`
        ).length;
        const nonOptionalArgumentsCount = inputArgsCount - proc.argDefaultsNum;
        if (nonOptionalArgumentsCount > 1) {
          return memo;
        }

        // Must return a scalar or an array
        if (proc.returnsSet) return memo;
        const returnType =
          introspectionResultsByKind.typeById[proc.returnTypeId];
        const returnTypeTable =
          introspectionResultsByKind.classById[returnType.classId];
        if (returnTypeTable) return memo;
        const isRecordLike = returnType.id === "2249";
        if (isRecordLike) return memo;
        const isVoid = String(returnType.id) === "2278";
        if (isVoid) return memo;

        // Looks good
        const fieldName = inflection.computedColumn(
          pseudoColumnName,
          proc,
          table
        );
        memo = build.extend(memo, { [fieldName]: proc });
        return memo;
      },
      {}
    );

    const operatorsTypeNameByFieldName = {};

    const procFields = Object.entries(procByFieldName).reduce(
      (memo, [fieldName, proc]) => {
        const OperatorsType = connectionFilterOperatorsType(
          newWithHooks,
          proc.returnTypeId,
          null
        );
        if (!OperatorsType) {
          return memo;
        }
        operatorsTypeNameByFieldName[fieldName] = OperatorsType.name;
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

      const proc = procByFieldName[fieldName];
      const sqlIdentifier = sql.query`${sql.identifier(
        proc.namespace.name
      )}.${sql.identifier(proc.name)}(${sourceAlias})`;
      const pgType = introspectionResultsByKind.typeById[proc.returnTypeId];
      const pgTypeModifier = null;
      const filterTypeName = operatorsTypeNameByFieldName[fieldName];

      return connectionFilterResolve(
        fieldValue,
        sqlIdentifier,
        filterTypeName,
        queryBuilder,
        pgType,
        pgTypeModifier,
        fieldName
      );
    };

    for (const fieldName of Object.keys(procFields)) {
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    }

    return extend(fields, procFields);
  });

  function getComputedColumnDetails(build, table, proc) {
    if (!proc.isStable) return null;
    if (proc.namespaceId !== table.namespaceId) return null;
    if (!proc.name.startsWith(`${table.name}_`)) return null;
    if (proc.argTypeIds.length < 1) return null;
    if (proc.argTypeIds[0] !== table.type.id) return null;

    const argTypes = proc.argTypeIds.reduce((prev, typeId, idx) => {
      if (
        proc.argModes.length === 0 || // all args are `in`
        proc.argModes[idx] === "i" || // this arg is `in`
        proc.argModes[idx] === "b" // this arg is `inout`
      ) {
        prev.push(build.pgIntrospectionResultsByKind.typeById[typeId]);
      }
      return prev;
    }, []);
    if (
      argTypes
        .slice(1)
        .some(
          type => type.type === "c" && type.class && type.class.isSelectable
        )
    ) {
      // Accepts two input tables? Skip.
      return null;
    }

    const pseudoColumnName = proc.name.substr(table.name.length + 1);
    return { argTypes, pseudoColumnName };
  }
};
