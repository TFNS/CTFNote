const createManyToManyConnectionType = require("./createManyToManyConnectionType");
const manyToManyRelationships = require("./manyToManyRelationships");

module.exports = function PgManyToManyRelationPlugin(builder, options) {
  const { pgSimpleCollections } = options;
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgGetGqlTypeByTypeIdAndModifier,
      pgSql: sql,
      getSafeAliasFromResolveInfo,
      getSafeAliasFromAlias,
      graphql: { GraphQLNonNull, GraphQLList },
      inflection,
      pgQueryFromResolveData: queryFromResolveData,
      pgAddStartEndCursor: addStartEndCursor,
      describePgEntity,
    } = build;
    const {
      scope: { isPgRowType, pgIntrospection: leftTable },
      fieldWithHooks,
      Self,
    } = context;
    if (!isPgRowType || !leftTable || leftTable.kind !== "class") {
      return fields;
    }

    const relationships = manyToManyRelationships(leftTable, build);
    return extend(
      fields,
      relationships.reduce((memo, relationship) => {
        const {
          leftKeyAttributes,
          junctionLeftKeyAttributes,
          junctionRightKeyAttributes,
          rightKeyAttributes,
          junctionTable,
          rightTable,
          junctionLeftConstraint,
          junctionRightConstraint,
        } = relationship;
        const RightTableType = pgGetGqlTypeByTypeIdAndModifier(
          rightTable.type.id,
          null
        );
        if (!RightTableType) {
          throw new Error(
            `Could not determine type for table with id ${rightTable.type.id}`
          );
        }
        const RightTableConnectionType = createManyToManyConnectionType(
          relationship,
          build,
          options,
          leftTable
        );

        // Since we're ignoring multi-column keys, we can simplify here
        const leftKeyAttribute = leftKeyAttributes[0];
        const junctionLeftKeyAttribute = junctionLeftKeyAttributes[0];
        const junctionRightKeyAttribute = junctionRightKeyAttributes[0];
        const rightKeyAttribute = rightKeyAttributes[0];

        function makeFields(isConnection) {
          const manyRelationFieldName = isConnection
            ? inflection.manyToManyRelationByKeys(
                leftKeyAttributes,
                junctionLeftKeyAttributes,
                junctionRightKeyAttributes,
                rightKeyAttributes,
                junctionTable,
                rightTable,
                junctionLeftConstraint,
                junctionRightConstraint
              )
            : inflection.manyToManyRelationByKeysSimple(
                leftKeyAttributes,
                junctionLeftKeyAttributes,
                junctionRightKeyAttributes,
                rightKeyAttributes,
                junctionTable,
                rightTable,
                junctionLeftConstraint,
                junctionRightConstraint
              );

          memo = extend(
            memo,
            {
              [manyRelationFieldName]: fieldWithHooks(
                manyRelationFieldName,
                ({
                  getDataFromParsedResolveInfoFragment,
                  addDataGenerator,
                }) => {
                  const sqlFrom = sql.identifier(
                    rightTable.namespace.name,
                    rightTable.name
                  );
                  const queryOptions = {
                    useAsterisk: rightTable.canUseAsterisk,
                    withPagination: isConnection,
                    withPaginationAsFields: false,
                    asJsonAggregate: !isConnection,
                  };
                  addDataGenerator((parsedResolveInfoFragment) => {
                    return {
                      pgQuery: (queryBuilder) => {
                        queryBuilder.select(() => {
                          const resolveData = getDataFromParsedResolveInfoFragment(
                            parsedResolveInfoFragment,
                            isConnection
                              ? RightTableConnectionType
                              : RightTableType
                          );
                          const rightTableAlias = sql.identifier(Symbol());
                          const leftTableAlias = queryBuilder.getTableAlias();
                          const query = queryFromResolveData(
                            sqlFrom,
                            rightTableAlias,
                            resolveData,
                            queryOptions,
                            (innerQueryBuilder) => {
                              innerQueryBuilder.parentQueryBuilder = queryBuilder;
                              const rightPrimaryKeyConstraint =
                                rightTable.primaryKeyConstraint;
                              const rightPrimaryKeyAttributes =
                                rightPrimaryKeyConstraint &&
                                rightPrimaryKeyConstraint.keyAttributes;
                              if (rightPrimaryKeyAttributes) {
                                innerQueryBuilder.beforeLock("orderBy", () => {
                                  // append order by primary key to the list of orders
                                  if (!innerQueryBuilder.isOrderUnique(false)) {
                                    innerQueryBuilder.data.cursorPrefix = [
                                      "primary_key_asc",
                                    ];
                                    rightPrimaryKeyAttributes.forEach(
                                      (attr) => {
                                        innerQueryBuilder.orderBy(
                                          sql.fragment`${innerQueryBuilder.getTableAlias()}.${sql.identifier(
                                            attr.name
                                          )}`,
                                          true
                                        );
                                      }
                                    );
                                    innerQueryBuilder.setOrderIsUnique();
                                  }
                                });
                              }

                              const subqueryName = inflection.manyToManyRelationSubqueryName(
                                leftKeyAttributes,
                                junctionLeftKeyAttributes,
                                junctionRightKeyAttributes,
                                rightKeyAttributes,
                                junctionTable,
                                rightTable,
                                junctionLeftConstraint,
                                junctionRightConstraint
                              );
                              const subqueryBuilder = innerQueryBuilder.buildNamedChildSelecting(
                                subqueryName,
                                sql.identifier(
                                  junctionTable.namespace.name,
                                  junctionTable.name
                                ),
                                sql.identifier(junctionRightKeyAttribute.name)
                              );
                              subqueryBuilder.where(
                                sql.fragment`${sql.identifier(
                                  junctionLeftKeyAttribute.name
                                )} = ${leftTableAlias}.${sql.identifier(
                                  leftKeyAttribute.name
                                )}`
                              );

                              innerQueryBuilder.where(
                                () =>
                                  sql.fragment`${rightTableAlias}.${sql.identifier(
                                    rightKeyAttribute.name
                                  )} in (${subqueryBuilder.build()})`
                              );
                            },
                            queryBuilder.context,
                            queryBuilder.rootValue
                          );
                          return sql.fragment`(${query})`;
                        }, getSafeAliasFromAlias(parsedResolveInfoFragment.alias));
                      },
                    };
                  });

                  return {
                    description: `Reads and enables pagination through a set of \`${RightTableType.name}\`.`,
                    type: isConnection
                      ? new GraphQLNonNull(RightTableConnectionType)
                      : new GraphQLNonNull(
                          new GraphQLList(new GraphQLNonNull(RightTableType))
                        ),
                    args: {},
                    resolve: (data, _args, _context, resolveInfo) => {
                      const safeAlias = getSafeAliasFromResolveInfo(
                        resolveInfo
                      );
                      if (isConnection) {
                        return addStartEndCursor(data[safeAlias]);
                      } else {
                        return data[safeAlias];
                      }
                    },
                  };
                },
                {
                  isPgFieldConnection: isConnection,
                  isPgFieldSimpleCollection: !isConnection,
                  isPgManyToManyRelationField: true,
                  pgFieldIntrospection: rightTable,
                }
              ),
            },

            `Many-to-many relation field (${
              isConnection ? "connection" : "simple collection"
            }) on ${Self.name} type for ${describePgEntity(
              junctionLeftConstraint
            )} and ${describePgEntity(junctionRightConstraint)}.`
          );
        }

        const simpleCollections =
          junctionRightConstraint.tags.simpleCollections ||
          rightTable.tags.simpleCollections ||
          pgSimpleCollections;
        const hasConnections = simpleCollections !== "only";
        const hasSimpleCollections =
          simpleCollections === "only" || simpleCollections === "both";
        if (hasConnections) {
          makeFields(true);
        }
        if (hasSimpleCollections) {
          makeFields(false);
        }
        return memo;
      }, {}),
      `Adding many-to-many relations for ${Self.name}`
    );
  });
};
