module.exports = function PgConnectionArgFilterLogicalOperatorsPlugin(builder) {
  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      graphql: { GraphQLList, GraphQLNonNull },
      pgSql: sql,
      connectionFilterTypesByTypeName,
      connectionFilterResolve,
      connectionFilterRegisterResolver,
    } = build;
    const {
      fieldWithHooks,
      scope: { isPgConnectionFilter },
      Self,
    } = context;

    if (!isPgConnectionFilter) return fields;

    connectionFilterTypesByTypeName[Self.name] = Self;

    if (Object.keys(fields).length === 0) {
      // Skip adding these operators if they would be the only fields
      return fields;
    }

    const logicResolversByFieldName = {
      and: (arr, sourceAlias, queryBuilder) => {
        const sqlFragments = arr
          .map(o =>
            connectionFilterResolve(o, sourceAlias, Self.name, queryBuilder)
          )
          .filter(x => x != null);
        return sqlFragments.length === 0
          ? null
          : sql.query`(${sql.join(sqlFragments, ") and (")})`;
      },
      or: (arr, sourceAlias, queryBuilder) => {
        const sqlFragments = arr
          .map(o =>
            connectionFilterResolve(o, sourceAlias, Self.name, queryBuilder)
          )
          .filter(x => x != null);
        return sqlFragments.length === 0
          ? null
          : sql.query`(${sql.join(sqlFragments, ") or (")})`;
      },
      not: (obj, sourceAlias, queryBuilder) => {
        const sqlFragment = connectionFilterResolve(
          obj,
          sourceAlias,
          Self.name,
          queryBuilder
        );
        return sqlFragment == null ? null : sql.query`not (${sqlFragment})`;
      },
    };

    const logicalOperatorFields = {
      and: fieldWithHooks(
        "and",
        {
          description: `Checks for all expressions in this list.`,
          type: new GraphQLList(new GraphQLNonNull(Self)),
        },
        {
          isPgConnectionFilterOperatorLogical: true,
        }
      ),
      or: fieldWithHooks(
        "or",
        {
          description: `Checks for any expressions in this list.`,
          type: new GraphQLList(new GraphQLNonNull(Self)),
        },
        {
          isPgConnectionFilterOperatorLogical: true,
        }
      ),
      not: fieldWithHooks(
        "not",
        {
          description: `Negates the expression.`,
          type: Self,
        },
        {
          isPgConnectionFilterOperatorLogical: true,
        }
      ),
    };

    const resolve = ({ sourceAlias, fieldName, fieldValue, queryBuilder }) => {
      if (fieldValue == null) return null;

      return logicResolversByFieldName[fieldName](
        fieldValue,
        sourceAlias,
        queryBuilder
      );
    };

    for (const fieldName of Object.keys(logicResolversByFieldName)) {
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    }

    return extend(fields, logicalOperatorFields);
  });
};
