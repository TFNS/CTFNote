module.exports = function PgConnectionArgFilterForwardRelationsPlugin(builder) {
  builder.hook("inflection", inflection => ({
    ...inflection,
    filterForwardRelationExistsFieldName(relationFieldName) {
      return `${relationFieldName}Exists`;
    },
  }));

  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      describePgEntity,
      extend,
      newWithHooks,
      inflection,
      graphql: { GraphQLBoolean },
      pgOmit: omit,
      pgSql: sql,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
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

    const forwardRelationSpecs = introspectionResultsByKind.constraint
      .filter(con => con.type === "f")
      .filter(con => con.classId === table.id)
      .reduce((memo, constraint) => {
        if (omit(constraint, "read")) {
          return memo;
        }
        const foreignTable =
          introspectionResultsByKind.classById[constraint.foreignClassId];
        if (!foreignTable) {
          throw new Error(
            `Could not find the foreign table (constraint: ${constraint.name})`
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
        const keyAttributes = constraint.keyAttributeNums.map(
          num => attributes.filter(attr => attr.num === num)[0]
        );
        const foreignKeyAttributes = constraint.foreignKeyAttributeNums.map(
          num => foreignAttributes.filter(attr => attr.num === num)[0]
        );
        if (keyAttributes.some(attr => omit(attr, "read"))) {
          return memo;
        }
        if (foreignKeyAttributes.some(attr => omit(attr, "read"))) {
          return memo;
        }
        memo.push({
          table,
          keyAttributes,
          foreignTable,
          foreignKeyAttributes,
          constraint,
        });
        return memo;
      }, []);

    let forwardRelationSpecByFieldName = {};

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
      // Spec for use in resolver
      forwardRelationSpecByFieldName = extend(forwardRelationSpecByFieldName, {
        [fieldName]: spec,
      });
      // Resolver
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    };

    for (const spec of forwardRelationSpecs) {
      const { constraint, foreignTable, keyAttributes } = spec;
      const fieldName = inflection.singleRelationByKeys(
        keyAttributes,
        foreignTable,
        table,
        constraint
      );
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

      addField(
        fieldName,
        `Filter by the object’s \`${fieldName}\` relation.`,
        ForeignTableFilterType,
        resolve,
        spec,
        `Adding connection filter forward relation field from ${describePgEntity(
          table
        )} to ${describePgEntity(foreignTable)}`
      );

      const keyIsNullable = !keyAttributes.every(attr => attr.isNotNull);
      if (keyIsNullable) {
        const existsFieldName = inflection.filterForwardRelationExistsFieldName(
          fieldName
        );
        addField(
          existsFieldName,
          `A related \`${fieldName}\` exists.`,
          GraphQLBoolean,
          resolveExists,
          spec,
          `Adding connection filter forward relation exists field from ${describePgEntity(
            table
          )} to ${describePgEntity(foreignTable)}`
        );
      }
    }

    function resolve({ sourceAlias, fieldName, fieldValue, queryBuilder }) {
      if (fieldValue == null) return null;

      const {
        foreignTable,
        foreignKeyAttributes,
        keyAttributes,
      } = forwardRelationSpecByFieldName[fieldName];

      const foreignTableAlias = sql.identifier(Symbol());

      const sqlIdentifier = sql.identifier(
        foreignTable.namespace.name,
        foreignTable.name
      );

      const sqlKeysMatch = sql.query`(${sql.join(
        keyAttributes.map((key, i) => {
          return sql.fragment`${sourceAlias}.${sql.identifier(
            key.name
          )} = ${foreignTableAlias}.${sql.identifier(
            foreignKeyAttributes[i].name
          )}`;
        }),
        ") and ("
      )})`;

      const foreignTableTypeName = inflection.tableType(foreignTable);
      const foreignTableFilterTypeName = inflection.filterType(
        foreignTableTypeName
      );

      const sqlFragment = connectionFilterResolve(
        fieldValue,
        foreignTableAlias,
        foreignTableFilterTypeName,
        queryBuilder
      );

      return sqlFragment == null
        ? null
        : sql.query`\
      exists(
        select 1 from ${sqlIdentifier} as ${foreignTableAlias}
        where ${sqlKeysMatch} and
          (${sqlFragment})
      )`;
    }

    function resolveExists({ sourceAlias, fieldName, fieldValue }) {
      if (fieldValue == null) return null;

      const {
        foreignTable,
        foreignKeyAttributes,
        keyAttributes,
      } = forwardRelationSpecByFieldName[fieldName];

      const foreignTableAlias = sql.identifier(Symbol());

      const sqlIdentifier = sql.identifier(
        foreignTable.namespace.name,
        foreignTable.name
      );

      const sqlKeysMatch = sql.query`(${sql.join(
        keyAttributes.map((key, i) => {
          return sql.fragment`${sourceAlias}.${sql.identifier(
            key.name
          )} = ${foreignTableAlias}.${sql.identifier(
            foreignKeyAttributes[i].name
          )}`;
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
};
