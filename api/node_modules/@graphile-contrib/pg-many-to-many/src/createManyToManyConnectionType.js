const hasNonNullKey = (row) => {
  if (
    Array.isArray(row.__identifiers) &&
    row.__identifiers.every((i) => i != null)
  ) {
    return true;
  }
  for (const k in row) {
    if (Object.prototype.hasOwnProperty.call(row, k)) {
      if ((k[0] !== "_" || k[1] !== "_") && row[k] !== null) {
        return true;
      }
    }
  }
  return false;
};

module.exports = function createManyToManyConnectionType(
  relationship,
  build,
  options,
  leftTable
) {
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
  const {
    newWithHooks,
    inflection,
    graphql: { GraphQLObjectType, GraphQLNonNull, GraphQLList },
    getTypeByName,
    pgGetGqlTypeByTypeIdAndModifier,
    pgField,
    getSafeAliasFromResolveInfo,
    describePgEntity,
  } = build;
  const { pgForbidSetofFunctionsToReturnNull = false } = options;
  const nullableIf = (condition, Type) =>
    condition ? Type : new GraphQLNonNull(Type);
  const Cursor = getTypeByName("Cursor");
  const handleNullRow = pgForbidSetofFunctionsToReturnNull
    ? (row) => row
    : (row, identifiers) => {
        if ((identifiers && hasNonNullKey(identifiers)) || hasNonNullKey(row)) {
          return row;
        } else {
          return null;
        }
      };

  const LeftTableType = pgGetGqlTypeByTypeIdAndModifier(
    leftTable.type.id,
    null
  );
  if (!LeftTableType) {
    throw new Error(
      `Could not determine type for table with id ${leftTable.type.id}`
    );
  }

  const TableType = pgGetGqlTypeByTypeIdAndModifier(rightTable.type.id, null);
  if (!TableType) {
    throw new Error(
      `Could not determine type for table with id ${rightTable.type.id}`
    );
  }

  const rightPrimaryKeyConstraint = rightTable.primaryKeyConstraint;
  const rightPrimaryKeyAttributes =
    rightPrimaryKeyConstraint && rightPrimaryKeyConstraint.keyAttributes;

  const junctionTypeName = inflection.tableType(junctionTable);
  const base64 = (str) => Buffer.from(String(str)).toString("base64");

  const EdgeType = newWithHooks(
    GraphQLObjectType,
    {
      description: `A \`${TableType.name}\` edge in the connection, with data from \`${junctionTypeName}\`.`,
      name: inflection.manyToManyRelationEdge(
        leftKeyAttributes,
        junctionLeftKeyAttributes,
        junctionRightKeyAttributes,
        rightKeyAttributes,
        junctionTable,
        rightTable,
        junctionLeftConstraint,
        junctionRightConstraint,
        LeftTableType.name
      ),
      fields: ({ fieldWithHooks }) => {
        return {
          cursor: fieldWithHooks(
            "cursor",
            ({ addDataGenerator }) => {
              addDataGenerator(() => ({
                usesCursor: [true],
                pgQuery: (queryBuilder) => {
                  if (rightPrimaryKeyAttributes) {
                    queryBuilder.selectIdentifiers(rightTable);
                  }
                },
              }));
              return {
                description: "A cursor for use in pagination.",
                type: Cursor,
                resolve(data) {
                  return data.__cursor && base64(JSON.stringify(data.__cursor));
                },
              };
            },
            {
              isCursorField: true,
            }
          ),
          node: pgField(
            build,
            fieldWithHooks,
            "node",
            {
              description: `The \`${TableType.name}\` at the end of the edge.`,
              type: nullableIf(!pgForbidSetofFunctionsToReturnNull, TableType),
              resolve(data, _args, _context, resolveInfo) {
                const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
                const record = handleNullRow(
                  data[safeAlias],
                  data.__identifiers
                );
                return record;
              },
            },
            {},
            false,
            {}
          ),
        };
      },
    },
    {
      __origin: `Adding many-to-many edge type from ${describePgEntity(
        leftTable
      )} to ${describePgEntity(rightTable)} via ${describePgEntity(
        junctionTable
      )}.`,
      isEdgeType: true,
      isPgRowEdgeType: true,
      isPgManyToManyEdgeType: true,
      nodeType: TableType,
      pgManyToManyRelationship: relationship,
    }
  );
  const PageInfo = getTypeByName(inflection.builtin("PageInfo"));

  return newWithHooks(
    GraphQLObjectType,
    {
      description: `A connection to a list of \`${TableType.name}\` values, with data from \`${junctionTypeName}\`.`,
      name: inflection.manyToManyRelationConnection(
        leftKeyAttributes,
        junctionLeftKeyAttributes,
        junctionRightKeyAttributes,
        rightKeyAttributes,
        junctionTable,
        rightTable,
        junctionLeftConstraint,
        junctionRightConstraint,
        LeftTableType.name
      ),
      fields: ({ recurseDataGeneratorsForField, fieldWithHooks }) => {
        recurseDataGeneratorsForField("pageInfo", true);
        return {
          nodes: pgField(
            build,
            fieldWithHooks,
            "nodes",
            {
              description: `A list of \`${TableType.name}\` objects.`,
              type: new GraphQLNonNull(
                new GraphQLList(
                  nullableIf(!pgForbidSetofFunctionsToReturnNull, TableType)
                )
              ),
              resolve(data, _args, _context, resolveInfo) {
                const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
                return data.data.map((entry) => {
                  const record = handleNullRow(
                    entry[safeAlias],
                    entry[safeAlias].__identifiers
                  );
                  return record;
                });
              },
            },
            {},
            false,
            {}
          ),
          edges: pgField(
            build,
            fieldWithHooks,
            "edges",
            {
              description: `A list of edges which contains the \`${TableType.name}\`, info from the \`${junctionTypeName}\`, and the cursor to aid in pagination.`,
              type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(EdgeType))
              ),
              resolve(data, _args, _context, resolveInfo) {
                const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
                return data.data.map((entry) => ({
                  ...entry,
                  ...entry[safeAlias],
                }));
              },
            },
            {},
            false,
            {
              hoistCursor: true,
            }
          ),
          pageInfo: PageInfo && {
            description: "Information to aid in pagination.",
            type: new GraphQLNonNull(PageInfo),
            resolve(data) {
              return data;
            },
          },
        };
      },
    },
    {
      __origin: `Adding many-to-many connection type from ${describePgEntity(
        leftTable
      )} to ${describePgEntity(rightTable)} via ${describePgEntity(
        junctionTable
      )}.`,
      isConnectionType: true,
      isPgRowConnectionType: true,
      edgeType: EdgeType,
      nodeType: TableType,
      pgIntrospection: rightTable,
    }
  );
};
