module.exports = function PgConnectionArgFilterCompositeTypeColumnsPlugin(
  builder,
  { connectionFilterAllowedFieldTypes }
) {
  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      newWithHooks,
      pgSql: sql,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgGetGqlTypeByTypeIdAndModifier,
      pgColumnFilter,
      pgOmit: omit,
      inflection,
      connectionFilterRegisterResolver,
      connectionFilterResolve,
      connectionFilterType,
      connectionFilterTypesByTypeName,
    } = build;
    const {
      fieldWithHooks,
      scope: { pgIntrospection: table, isPgConnectionFilter },
      Self,
    } = context;

    if (!isPgConnectionFilter || table.kind !== "class") return fields;

    connectionFilterTypesByTypeName[Self.name] = Self;

    const attrByFieldName = introspectionResultsByKind.attribute
      .filter(attr => attr.classId === table.id)
      .filter(attr => pgColumnFilter(attr, build, context))
      .filter(attr => !omit(attr, "filter"))
      .filter(
        attr =>
          attr.type &&
          attr.type.type === "c" &&
          attr.type.class &&
          !attr.type.class.isSelectable
      ) // keep only the composite type columns
      .reduce((memo, attr) => {
        const fieldName = inflection.column(attr);
        memo[fieldName] = attr;
        return memo;
      }, {});

    const filterTypeNameByFieldName = {};

    const attrFields = Object.entries(attrByFieldName).reduce(
      (memo, [fieldName, attr]) => {
        const NodeType = pgGetGqlTypeByTypeIdAndModifier(
          attr.typeId,
          attr.typeModifier
        );
        if (!NodeType) {
          return memo;
        }
        const nodeTypeName = NodeType.name;
        // Respect `connectionFilterAllowedFieldTypes` config option
        if (
          connectionFilterAllowedFieldTypes &&
          !connectionFilterAllowedFieldTypes.includes(nodeTypeName)
        ) {
          return memo;
        }
        const filterTypeName = inflection.filterType(nodeTypeName);
        const CompositeFilterType = connectionFilterType(
          newWithHooks,
          filterTypeName,
          attr.type.class,
          nodeTypeName
        );
        if (!CompositeFilterType) {
          return memo;
        }
        filterTypeNameByFieldName[fieldName] = filterTypeName;
        return extend(memo, {
          [fieldName]: fieldWithHooks(
            fieldName,
            {
              description: `Filter by the object’s \`${fieldName}\` field.`,
              type: CompositeFilterType,
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

      const attr = attrByFieldName[fieldName];
      const sqlIdentifier = sql.query`(${sourceAlias}.${sql.identifier(
        attr.name
      )})`; // parentheses are required to avoid confusing the parser
      const pgType = attr.type;
      const pgTypeModifier = attr.typeModifier;
      const filterTypeName = filterTypeNameByFieldName[fieldName];

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

    for (const fieldName of Object.keys(attrFields)) {
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    }

    return extend(fields, attrFields);
  });
};
