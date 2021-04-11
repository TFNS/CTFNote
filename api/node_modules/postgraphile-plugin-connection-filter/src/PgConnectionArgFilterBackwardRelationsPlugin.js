module.exports = function PgConnectionArgFilterBackwardRelationsPlugin(
  builder,
  { pgSimpleCollections }
) {
  const hasConnections = pgSimpleCollections !== "only";

  builder.hook("inflection", inflection => {
    return Object.assign(inflection, {
      filterManyType(table, foreignTable) {
        return this.upperCamelCase(
          `${this.tableType(table)}-to-many-${this.tableType(
            foreignTable
          )}-filter`
        );
      },
      filterBackwardSingleRelationExistsFieldName(relationFieldName) {
        return `${relationFieldName}Exists`;
      },
      filterBackwardManyRelationExistsFieldName(relationFieldName) {
        return `${relationFieldName}Exist`;
      },
    });
  });

  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      describePgEntity,
      extend,
      newWithHooks,
      inflection,
      pgOmit: omit,
      pgSql: sql,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      graphql: { GraphQLInputObjectType, GraphQLBoolean },
      connectionFilterResolve,
      connectionFilterRegisterResolver,
      connectionFilterTypesByTypeName,
      connectionFilterType,
    } = build;
    const {
      fieldWithHooks,
      scope: { pgIntrospection: table, isPgConnectionFilter },
      Self,
    } = context;

    if (!isPgConnectionFilter || table.kind !== "class") return fields;

    connectionFilterTypesByTypeName[Self.name] = Self;

    const backwardRelationSpecs = introspectionResultsByKind.constraint
      .filter(con => con.type === "f")
      .filter(con => con.foreignClassId === table.id)
      .reduce((memo, foreignConstraint) => {
        if (omit(foreignConstraint, "read")) {
          return memo;
        }
        const foreignTable =
          introspectionResultsByKind.classById[foreignConstraint.classId];
        if (!foreignTable) {
          throw new Error(
            `Could not find the foreign table (constraint: ${foreignConstraint.name})`
          );
        }
        if (omit(foreignTable, "read")) {
          return memo;
        }
        const attributes = introspectionResultsByKind.attribute
          .filter(attr => attr.classId === table.id)
          .sort((a, b) => a.num - b.num);
        const foreignAttributes = introspectionResultsByKind.attribute
          .filter(attr => attr.classId === foreignTable.id)
          .sort((a, b) => a.num - b.num);
        const keyAttributes = foreignConstraint.foreignKeyAttributeNums.map(
          num => attributes.filter(attr => attr.num === num)[0]
        );
        const foreignKeyAttributes = foreignConstraint.keyAttributeNums.map(
          num => foreignAttributes.filter(attr => attr.num === num)[0]
        );
        if (keyAttributes.some(attr => omit(attr, "read"))) {
          return memo;
        }
        if (foreignKeyAttributes.some(attr => omit(attr, "read"))) {
          return memo;
        }
        const isForeignKeyUnique = !!introspectionResultsByKind.constraint.find(
          c =>
            c.classId === foreignTable.id &&
            (c.type === "p" || c.type === "u") &&
            c.keyAttributeNums.length === foreignKeyAttributes.length &&
            c.keyAttributeNums.every(
              (n, i) => foreignKeyAttributes[i].num === n
            )
        );
        memo.push({
          table,
          keyAttributes,
          foreignTable,
          foreignKeyAttributes,
          foreignConstraint,
          isOneToMany: !isForeignKeyUnique,
        });
        return memo;
      }, []);

    let backwardRelationSpecByFieldName = {};

    const addField = (fieldName, description, type, resolve, spec, hint) => {
      // Field
      fields = extend(
        fields,
        {
          [fieldName]: fieldWithHooks(
            fieldName,
            {
              description,
              type,
            },
            {
              isPgConnectionFilterField: true,
            }
          ),
        },
        hint
      );
      // Relation spec for use in resolver
      backwardRelationSpecByFieldName = extend(
        backwardRelationSpecByFieldName,
        {
          [fieldName]: spec,
        }
      );
      // Resolver
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    };

    for (const spec of backwardRelationSpecs) {
      const {
        foreignTable,
        foreignKeyAttributes,
        foreignConstraint,
        isOneToMany,
      } = spec;
      const foreignTableTypeName = inflection.tableType(foreignTable);
      const foreignTableFilterTypeName = inflection.filterType(
        foreignTableTypeName
      );
      const ForeignTableFilterType = connectionFilterType(
        newWithHooks,
        foreignTableFilterTypeName,
        foreignTable,
        foreignTableTypeName
      );
      if (!ForeignTableFilterType) continue;

      if (isOneToMany) {
        if (!omit(foreignTable, "many")) {
          const filterManyTypeName = inflection.filterManyType(
            table,
            foreignTable
          );
          if (!connectionFilterTypesByTypeName[filterManyTypeName]) {
            connectionFilterTypesByTypeName[filterManyTypeName] = newWithHooks(
              GraphQLInputObjectType,
              {
                name: filterManyTypeName,
                description: `A filter to be used against many \`${foreignTableTypeName}\` object types. All fields are combined with a logical ‘and.’`,
              },
              {
                foreignTable,
                isPgConnectionFilterMany: true,
              }
            );
          }
          const FilterManyType =
            connectionFilterTypesByTypeName[filterManyTypeName];
          const fieldName = hasConnections
            ? inflection.manyRelationByKeys(
                foreignKeyAttributes,
                foreignTable,
                table,
                foreignConstraint
              )
            : inflection.manyRelationByKeysSimple(
                foreignKeyAttributes,
                foreignTable,
                table,
                foreignConstraint
              );
          addField(
            fieldName,
            `Filter by the object’s \`${fieldName}\` relation.`,
            FilterManyType,
            makeResolveMany(spec),
            spec,
            `Adding connection filter backward relation field from ${describePgEntity(
              table
            )} to ${describePgEntity(foreignTable)}`
          );

          const existsFieldName = inflection.filterBackwardManyRelationExistsFieldName(
            fieldName
          );
          addField(
            existsFieldName,
            `Some related \`${fieldName}\` exist.`,
            GraphQLBoolean,
            resolveExists,
            spec,
            `Adding connection filter backward relation exists field from ${describePgEntity(
              table
            )} to ${describePgEntity(foreignTable)}`
          );
        }
      } else {
        const fieldName = inflection.singleRelationByKeysBackwards(
          foreignKeyAttributes,
          foreignTable,
          table,
          foreignConstraint
        );
        addField(
          fieldName,
          `Filter by the object’s \`${fieldName}\` relation.`,
          ForeignTableFilterType,
          resolveSingle,
          spec,
          `Adding connection filter backward relation field from ${describePgEntity(
            table
          )} to ${describePgEntity(foreignTable)}`
        );

        const existsFieldName = inflection.filterBackwardSingleRelationExistsFieldName(
          fieldName
        );
        addField(
          existsFieldName,
          `A related \`${fieldName}\` exists.`,
          GraphQLBoolean,
          resolveExists,
          spec,
          `Adding connection filter backward relation exists field from ${describePgEntity(
            table
          )} to ${describePgEntity(foreignTable)}`
        );
      }
    }

    function resolveSingle({
      sourceAlias,
      fieldName,
      fieldValue,
      queryBuilder,
    }) {
      if (fieldValue == null) return null;

      const {
        foreignTable,
        foreignKeyAttributes,
        keyAttributes,
      } = backwardRelationSpecByFieldName[fieldName];

      const foreignTableTypeName = inflection.tableType(foreignTable);

      const foreignTableAlias = sql.identifier(Symbol());
      const foreignTableFilterTypeName = inflection.filterType(
        foreignTableTypeName
      );
      const sqlIdentifier = sql.identifier(
        foreignTable.namespace.name,
        foreignTable.name
      );
      const sqlKeysMatch = sql.query`(${sql.join(
        foreignKeyAttributes.map((attr, i) => {
          return sql.fragment`${foreignTableAlias}.${sql.identifier(
            attr.name
          )} = ${sourceAlias}.${sql.identifier(keyAttributes[i].name)}`;
        }),
        ") and ("
      )})`;
      const sqlSelectWhereKeysMatch = sql.query`select 1 from ${sqlIdentifier} as ${foreignTableAlias} where ${sqlKeysMatch}`;
      const sqlFragment = connectionFilterResolve(
        fieldValue,
        foreignTableAlias,
        foreignTableFilterTypeName,
        queryBuilder
      );
      return sqlFragment == null
        ? null
        : sql.query`exists(${sqlSelectWhereKeysMatch} and (${sqlFragment}))`;
    }

    function makeResolveMany(backwardRelationSpec) {
      return function resolveMany({
        sourceAlias,
        fieldName,
        fieldValue,
        queryBuilder,
      }) {
        if (fieldValue == null) return null;

        const { foreignTable } = backwardRelationSpecByFieldName[fieldName];

        const foreignTableFilterManyTypeName = inflection.filterManyType(
          table,
          foreignTable
        );
        const sqlFragment = connectionFilterResolve(
          fieldValue,
          sourceAlias,
          foreignTableFilterManyTypeName,
          queryBuilder,
          null,
          null,
          null,
          { backwardRelationSpec }
        );
        return sqlFragment == null ? null : sqlFragment;
      };
    }

    function resolveExists({ sourceAlias, fieldName, fieldValue }) {
      if (fieldValue == null) return null;

      const {
        foreignTable,
        foreignKeyAttributes,
        keyAttributes,
      } = backwardRelationSpecByFieldName[fieldName];

      const foreignTableAlias = sql.identifier(Symbol());

      const sqlIdentifier = sql.identifier(
        foreignTable.namespace.name,
        foreignTable.name
      );

      const sqlKeysMatch = sql.query`(${sql.join(
        foreignKeyAttributes.map((attr, i) => {
          return sql.fragment`${foreignTableAlias}.${sql.identifier(
            attr.name
          )} = ${sourceAlias}.${sql.identifier(keyAttributes[i].name)}`;
        }),
        ") and ("
      )})`;

      const sqlSelectWhereKeysMatch = sql.query`select 1 from ${sqlIdentifier} as ${foreignTableAlias} where ${sqlKeysMatch}`;

      return fieldValue === true
        ? sql.query`exists(${sqlSelectWhereKeysMatch})`
        : sql.query`not exists(${sqlSelectWhereKeysMatch})`;
    }

    return fields;
  });

  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      newWithHooks,
      inflection,
      pgSql: sql,
      connectionFilterResolve,
      connectionFilterRegisterResolver,
      connectionFilterTypesByTypeName,
      connectionFilterType,
    } = build;
    const {
      fieldWithHooks,
      scope: { foreignTable, isPgConnectionFilterMany },
      Self,
    } = context;

    if (!isPgConnectionFilterMany || !foreignTable) return fields;

    connectionFilterTypesByTypeName[Self.name] = Self;

    const foreignTableTypeName = inflection.tableType(foreignTable);
    const foreignTableFilterTypeName = inflection.filterType(
      foreignTableTypeName
    );
    const FilterType = connectionFilterType(
      newWithHooks,
      foreignTableFilterTypeName,
      foreignTable,
      foreignTableTypeName
    );

    const manyFields = {
      every: fieldWithHooks(
        "every",
        {
          description: `Every related \`${foreignTableTypeName}\` matches the filter criteria. All fields are combined with a logical ‘and.’`,
          type: FilterType,
        },
        {
          isPgConnectionFilterManyField: true,
        }
      ),
      some: fieldWithHooks(
        "some",
        {
          description: `Some related \`${foreignTableTypeName}\` matches the filter criteria. All fields are combined with a logical ‘and.’`,
          type: FilterType,
        },
        {
          isPgConnectionFilterManyField: true,
        }
      ),
      none: fieldWithHooks(
        "none",
        {
          description: `No related \`${foreignTableTypeName}\` matches the filter criteria. All fields are combined with a logical ‘and.’`,
          type: FilterType,
        },
        {
          isPgConnectionFilterManyField: true,
        }
      ),
    };

    const resolve = ({
      sourceAlias,
      fieldName,
      fieldValue,
      queryBuilder,
      parentFieldInfo,
    }) => {
      if (fieldValue == null) return null;

      if (!parentFieldInfo || !parentFieldInfo.backwardRelationSpec)
        throw new Error("Did not receive backward relation spec");
      const {
        keyAttributes,
        foreignKeyAttributes,
      } = parentFieldInfo.backwardRelationSpec;

      const foreignTableAlias = sql.identifier(Symbol());
      const sqlIdentifier = sql.identifier(
        foreignTable.namespace.name,
        foreignTable.name
      );
      const sqlKeysMatch = sql.query`(${sql.join(
        foreignKeyAttributes.map((attr, i) => {
          return sql.fragment`${foreignTableAlias}.${sql.identifier(
            attr.name
          )} = ${sourceAlias}.${sql.identifier(keyAttributes[i].name)}`;
        }),
        ") and ("
      )})`;
      const sqlSelectWhereKeysMatch = sql.query`select 1 from ${sqlIdentifier} as ${foreignTableAlias} where ${sqlKeysMatch}`;

      const sqlFragment = connectionFilterResolve(
        fieldValue,
        foreignTableAlias,
        foreignTableFilterTypeName,
        queryBuilder
      );
      if (sqlFragment == null) {
        return null;
      } else if (fieldName === "every") {
        return sql.query`not exists(${sqlSelectWhereKeysMatch} and not (${sqlFragment}))`;
      } else if (fieldName === "some") {
        return sql.query`exists(${sqlSelectWhereKeysMatch} and (${sqlFragment}))`;
      } else if (fieldName === "none") {
        return sql.query`not exists(${sqlSelectWhereKeysMatch} and (${sqlFragment}))`;
      }
      throw new Error(`Unknown field name: ${fieldName}`);
    };

    for (const fieldName of Object.keys(manyFields)) {
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    }

    return extend(fields, manyFields);
  });
};
