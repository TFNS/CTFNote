module.exports = function PgConnectionArgFilterOperatorsPlugin(
  builder,
  { connectionFilterAllowedOperators, connectionFilterOperatorNames }
) {
  builder.hook("build", build => {
    const {
      graphql: {
        getNamedType,
        GraphQLBoolean,
        GraphQLString,
        GraphQLNonNull,
        GraphQLList,
      },
      pgGetGqlTypeByTypeIdAndModifier,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      gql2pg,
      escapeLikeWildcards,
    } = build;

    const resolveListType = fieldInputType =>
      new GraphQLList(new GraphQLNonNull(fieldInputType));
    const resolveListSqlValue = (
      input,
      pgType,
      pgTypeModifier,
      resolveListItemSqlValue
    ) =>
      input.length === 0
        ? sql.query`(select null::${sql.identifier(
            pgType.namespaceName
          )}.${sql.identifier(pgType.name)} limit 0)`
        : sql.query`(${sql.join(
            input.map(i =>
              resolveListItemSqlValue
                ? resolveListItemSqlValue(i, pgType, pgTypeModifier)
                : gql2pg(i, pgType, pgTypeModifier)
            ),
            ","
          )})`;

    const standardOperators = {
      isNull: {
        description:
          "Is null (if `true` is specified) or is not null (if `false` is specified).",
        resolveType: () => GraphQLBoolean,
        resolveSqlValue: () => null, // do not parse
        resolve: (i, _v, input) =>
          sql.query`${i} ${
            input ? sql.query`IS NULL` : sql.query`IS NOT NULL`
          }`,
      },
      equalTo: {
        description: "Equal to the specified value.",
        resolve: (i, v) => sql.query`${i} = ${v}`,
      },
      notEqualTo: {
        description: "Not equal to the specified value.",
        resolve: (i, v) => sql.query`${i} <> ${v}`,
      },
      distinctFrom: {
        description:
          "Not equal to the specified value, treating null like an ordinary value.",
        resolve: (i, v) => sql.query`${i} IS DISTINCT FROM ${v}`,
      },
      notDistinctFrom: {
        description:
          "Equal to the specified value, treating null like an ordinary value.",
        resolve: (i, v) => sql.query`${i} IS NOT DISTINCT FROM ${v}`,
      },
      in: {
        description: "Included in the specified list.",
        resolveType: resolveListType,
        resolveSqlValue: resolveListSqlValue,
        resolve: (i, v) => sql.query`${i} IN ${v}`,
      },
      notIn: {
        description: "Not included in the specified list.",
        resolveType: resolveListType,
        resolveSqlValue: resolveListSqlValue,
        resolve: (i, v) => sql.query`${i} NOT IN ${v}`,
      },
    };
    const sortOperators = {
      lessThan: {
        description: "Less than the specified value.",
        resolve: (i, v) => sql.query`${i} < ${v}`,
      },
      lessThanOrEqualTo: {
        description: "Less than or equal to the specified value.",
        resolve: (i, v) => sql.query`${i} <= ${v}`,
      },
      greaterThan: {
        description: "Greater than the specified value.",
        resolve: (i, v) => sql.query`${i} > ${v}`,
      },
      greaterThanOrEqualTo: {
        description: "Greater than or equal to the specified value.",
        resolve: (i, v) => sql.query`${i} >= ${v}`,
      },
    };
    const patternMatchingOperators = {
      includes: {
        description: "Contains the specified string (case-sensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}%`,
        resolve: (i, v) => sql.query`${i} LIKE ${v}`,
      },
      notIncludes: {
        description: "Does not contain the specified string (case-sensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}%`,
        resolve: (i, v) => sql.query`${i} NOT LIKE ${v}`,
      },
      includesInsensitive: {
        description: "Contains the specified string (case-insensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}%`,
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} ILIKE ${v}`,
      },
      notIncludesInsensitive: {
        description:
          "Does not contain the specified string (case-insensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}%`,
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} NOT ILIKE ${v}`,
      },
      startsWith: {
        description: "Starts with the specified string (case-sensitive).",
        resolveInput: input => `${escapeLikeWildcards(input)}%`,
        resolve: (i, v) => sql.query`${i} LIKE ${v}`,
      },
      notStartsWith: {
        description:
          "Does not start with the specified string (case-sensitive).",
        resolveInput: input => `${escapeLikeWildcards(input)}%`,
        resolve: (i, v) => sql.query`${i} NOT LIKE ${v}`,
      },
      startsWithInsensitive: {
        description: "Starts with the specified string (case-insensitive).",
        resolveInput: input => `${escapeLikeWildcards(input)}%`,
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} ILIKE ${v}`,
      },
      notStartsWithInsensitive: {
        description:
          "Does not start with the specified string (case-insensitive).",
        resolveInput: input => `${escapeLikeWildcards(input)}%`,
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} NOT ILIKE ${v}`,
      },
      endsWith: {
        description: "Ends with the specified string (case-sensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}`,
        resolve: (i, v) => sql.query`${i} LIKE ${v}`,
      },
      notEndsWith: {
        description: "Does not end with the specified string (case-sensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}`,
        resolve: (i, v) => sql.query`${i} NOT LIKE ${v}`,
      },
      endsWithInsensitive: {
        description: "Ends with the specified string (case-insensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}`,
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} ILIKE ${v}`,
      },
      notEndsWithInsensitive: {
        description:
          "Does not end with the specified string (case-insensitive).",
        resolveInput: input => `%${escapeLikeWildcards(input)}`,
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} NOT ILIKE ${v}`,
      },
      like: {
        description:
          "Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.",
        resolve: (i, v) => sql.query`${i} LIKE ${v}`,
      },
      notLike: {
        description:
          "Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.",
        resolve: (i, v) => sql.query`${i} NOT LIKE ${v}`,
      },
      likeInsensitive: {
        description:
          "Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.",
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} ILIKE ${v}`,
      },
      notLikeInsensitive: {
        description:
          "Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.",
        resolveSqlIdentifier: i => i, // avoid casting citext to text
        resolve: (i, v) => sql.query`${i} NOT ILIKE ${v}`,
      },
    };
    const hstoreOperators = {
      contains: {
        description: "Contains the specified KeyValueHash.",
        resolve: (i, v) => sql.query`${i} @> ${v}`,
      },
      containsKey: {
        description: "Contains the specified key.",
        resolveType: () => GraphQLString,
        resolveSqlValue: input => sql.query`${sql.value(input)}::text`,
        resolve: (i, v) => sql.query`${i} ? ${v}`,
      },
      containsAllKeys: {
        name: "containsAllKeys",
        description: "Contains all of the specified keys.",
        resolveType: () => new GraphQLList(new GraphQLNonNull(GraphQLString)),
        resolveSqlValue: input => sql.value(input),
        resolve: (i, v) => sql.query`${i} ?& ${v}`,
      },
      containsAnyKeys: {
        name: "containsAnyKeys",
        description: "Contains any of the specified keys.",
        resolveType: () => new GraphQLList(new GraphQLNonNull(GraphQLString)),
        resolveSqlValue: input => sql.value(input),
        resolve: (i, v) => sql.query`${i} ?| ${v}`,
      },
      containedBy: {
        description: "Contained by the specified KeyValueHash.",
        resolve: (i, v) => sql.query`${i} <@ ${v}`,
      },
    };
    const jsonbOperators = {
      contains: {
        description: "Contains the specified JSON.",
        resolve: (i, v) => sql.query`${i} @> ${v}`,
      },
      containsKey: {
        description: "Contains the specified key.",
        resolveType: () => GraphQLString,
        resolveSqlValue: input => sql.query`${sql.value(input)}::text`,
        resolve: (i, v) => sql.query`${i} ? ${v}`,
      },
      containsAllKeys: {
        name: "containsAllKeys",
        description: "Contains all of the specified keys.",
        resolveType: () => new GraphQLList(new GraphQLNonNull(GraphQLString)),
        resolveSqlValue: input => sql.value(input),
        resolve: (i, v) => sql.query`${i} ?& ${v}`,
      },
      containsAnyKeys: {
        name: "containsAnyKeys",
        description: "Contains any of the specified keys.",
        resolveType: () => new GraphQLList(new GraphQLNonNull(GraphQLString)),
        resolveSqlValue: input => sql.value(input),
        resolve: (i, v) => sql.query`${i} ?| ${v}`,
      },
      containedBy: {
        description: "Contained by the specified JSON.",
        resolve: (i, v) => sql.query`${i} <@ ${v}`,
      },
    };
    const inetOperators = {
      contains: {
        description: "Contains the specified internet address.",
        resolve: (i, v) => sql.query`${i} >> ${v}`,
      },
      containsOrEqualTo: {
        description: "Contains or equal to the specified internet address.",
        resolve: (i, v) => sql.query`${i} >>= ${v}`,
      },
      containedBy: {
        description: "Contained by the specified internet address.",
        resolve: (i, v) => sql.query`${i} << ${v}`,
      },
      containedByOrEqualTo: {
        description: "Contained by or equal to the specified internet address.",
        resolve: (i, v) => sql.query`${i} <<= ${v}`,
      },
      containsOrContainedBy: {
        description: "Contains or contained by the specified internet address.",
        resolve: (i, v) => sql.query`${i} && ${v}`,
      },
    };

    const gqlTypeNameFromPgTypeName = pgTypeName => {
      const pgType = introspectionResultsByKind.type.find(
        t => t.name === pgTypeName
      );
      if (!pgType) {
        return null;
      }
      const gqlTypeName = pgGetGqlTypeByTypeIdAndModifier(pgType.id, null).name;
      if (gqlTypeName === "String") {
        // PostGraphile v4 handles all unknown types as Strings, so we can't trust
        // that the String operators are appropriate. Just return null so that the
        // fallback type name defined below is used.
        return null;
      }
      return gqlTypeName;
    };

    const _BigFloat = gqlTypeNameFromPgTypeName("numeric") || "BigFloat";
    const _BigInt = gqlTypeNameFromPgTypeName("int8") || "BigInt";
    const _BitString = gqlTypeNameFromPgTypeName("varbit") || "BitString";
    const _Boolean = gqlTypeNameFromPgTypeName("bool") || "Boolean";
    const _CidrAddress = gqlTypeNameFromPgTypeName("cidr") || "CidrAddress";
    const _Date = gqlTypeNameFromPgTypeName("date") || "Date";
    const _Datetime = gqlTypeNameFromPgTypeName("timestamp") || "Datetime";
    const _Float = gqlTypeNameFromPgTypeName("float4") || "Float";
    const _Int = gqlTypeNameFromPgTypeName("int2") || "Int";
    const _InternetAddress =
      gqlTypeNameFromPgTypeName("inet") || "InternetAddress";
    const _Interval = gqlTypeNameFromPgTypeName("interval") || "Interval";
    const _JSON = gqlTypeNameFromPgTypeName("jsonb") || "JSON";
    const _KeyValueHash = gqlTypeNameFromPgTypeName("hstore") || "KeyValueHash";
    const _MacAddress = gqlTypeNameFromPgTypeName("macaddr") || "MacAddress";
    const _MacAddress8 = gqlTypeNameFromPgTypeName("macaddr8") || "MacAddress8";
    const _String = gqlTypeNameFromPgTypeName("text") || "String";
    const _Time = gqlTypeNameFromPgTypeName("time") || "Time";
    const _UUID = gqlTypeNameFromPgTypeName("uuid") || "UUID";

    const connectionFilterScalarOperators = {
      [_BigFloat]: { ...standardOperators, ...sortOperators },
      [_BigInt]: { ...standardOperators, ...sortOperators },
      [_BitString]: { ...standardOperators, ...sortOperators },
      [_Boolean]: { ...standardOperators, ...sortOperators },
      [_CidrAddress]: {
        ...standardOperators,
        ...sortOperators,
        ...inetOperators,
      },
      [_Date]: { ...standardOperators, ...sortOperators },
      [_Datetime]: { ...standardOperators, ...sortOperators },
      [_Float]: { ...standardOperators, ...sortOperators },
      [_Int]: { ...standardOperators, ...sortOperators },
      [_InternetAddress]: {
        ...standardOperators,
        ...sortOperators,
        ...inetOperators,
      },
      [_Interval]: { ...standardOperators, ...sortOperators },
      [_JSON]: {
        ...standardOperators,
        ...sortOperators,
        ...jsonbOperators,
      },
      [_KeyValueHash]: {
        ...standardOperators,
        ...hstoreOperators,
      },
      [_MacAddress]: {
        ...standardOperators,
        ...sortOperators,
      },
      [_MacAddress8]: {
        ...standardOperators,
        ...sortOperators,
      },
      [_String]: {
        ...standardOperators,
        ...sortOperators,
        ...patternMatchingOperators,
      },
      [_Time]: { ...standardOperators, ...sortOperators },
      [_UUID]: { ...standardOperators, ...sortOperators },
    };

    /**
     * This block adds the following operators:
     * - distinctFromInsensitive
     * - equalToInsensitive
     * - greaterThanInsensitive
     * - greaterThanOrEqualToInsensitive
     * - inInsensitive
     * - lessThanInsensitive
     * - lessThanOrEqualToInsensitive
     * - notDistinctFromInsensitive
     * - notEqualToInsensitive
     * - notInInsensitive
     *
     * The compiled SQL depends on the underlying PostgreSQL column type.
     * Using case-insensitive operators with `text`/`varchar`/`char` columns
     * will result in calling `lower()` on the operands. Using case-sensitive
     * operators with `citext` columns will result in casting the operands to `text`.
     *
     * For example, here is how the `equalTo`/`equalToInsensitive` operators compile to SQL:
     * | GraphQL operator   | PostgreSQL column type  | Compiled SQL               |
     * | ------------------ | ----------------------- | -------------------------- |
     * | equalTo            | `text`/`varchar`/`char` | `<col> = $1`               |
     * | equalTo            | `citext`                | `<col>::text = $1::text`   |
     * | equalToInsensitive | `text`/`varchar`/`char` | `lower(<col>) = lower($1)` |
     * | equalToInsensitive | `citext`                | `<col> = $1`               |
     */
    for (const [name, spec] of [
      ...Object.entries(standardOperators),
      ...Object.entries(sortOperators),
    ]) {
      if (name == "isNull") continue;

      const description = `${spec.description.substring(
        0,
        spec.description.length - 1
      )} (case-insensitive).`;

      const resolveSqlIdentifier = (sourceAlias, pgType) =>
        pgType.name === "citext"
          ? sourceAlias // already case-insensitive, so no need to call `lower()`
          : sql.query`lower(${sourceAlias})`;

      const resolveSimpleSqlValue = (input, pgType, pgTypeModifier) =>
        pgType.name === "citext"
          ? gql2pg(input, pgType, pgTypeModifier) // already case-insensitive, so no need to call `lower()`
          : sql.query`lower(${gql2pg(input, pgType, pgTypeModifier)})`;

      const resolveSqlValue = (input, pgType, pgTypeModifier) =>
        name === "in" || name === "notIn"
          ? resolveListSqlValue(
              input,
              pgType,
              pgTypeModifier,
              resolveSimpleSqlValue
            )
          : resolveSimpleSqlValue(input, pgType, pgTypeModifier);

      connectionFilterScalarOperators[_String][`${name}Insensitive`] = {
        ...spec,
        description,
        resolveSqlIdentifier,
        resolveSqlValue,
      };
    }

    const connectionFilterEnumOperators = {
      ...standardOperators,
      ...sortOperators,
    };

    const connectionFilterRangeOperators = {
      ...standardOperators,
      ...sortOperators,
      contains: {
        description: "Contains the specified range.",
        resolve: (i, v) => sql.query`${i} @> ${v}`,
      },
      containsElement: {
        description: "Contains the specified value.",
        resolveType: (_fieldInputType, rangeElementInputType) =>
          rangeElementInputType,
        resolveSqlValue: (input, pgType, pgTypeModifier) => {
          const rangeSubType =
            introspectionResultsByKind.typeById[pgType.rangeSubTypeId];
          return sql.query`${gql2pg(
            input,
            pgType.rangeSubTypeId,
            pgTypeModifier
          )}::${sql.identifier(rangeSubType.namespaceName, rangeSubType.name)}`;
        },
        resolve: (i, v) => sql.query`${i} @> ${v}`,
      },
      containedBy: {
        description: "Contained by the specified range.",
        resolve: (i, v) => sql.query`${i} <@ ${v}`,
      },
      overlaps: {
        description: "Overlaps the specified range.",
        resolve: (i, v) => sql.query`${i} && ${v}`,
      },
      strictlyLeftOf: {
        description: "Strictly left of the specified range.",
        resolve: (i, v) => sql.query`${i} << ${v}`,
      },
      strictlyRightOf: {
        description: "Strictly right of the specified range.",
        resolve: (i, v) => sql.query`${i} >> ${v}`,
      },
      notExtendsRightOf: {
        description: "Does not extend right of the specified range.",
        resolve: (i, v) => sql.query`${i} &< ${v}`,
      },
      notExtendsLeftOf: {
        description: "Does not extend left of the specified range.",
        resolve: (i, v) => sql.query`${i} &> ${v}`,
      },
      adjacentTo: {
        description: "Adjacent to the specified range.",
        resolve: (i, v) => sql.query`${i} -|- ${v}`,
      },
    };

    const resolveArrayItemType = fieldInputType => getNamedType(fieldInputType);
    const resolveArrayItemSqlValue = (input, pgType, pgTypeModifier) =>
      gql2pg(input, pgType.arrayItemType, pgTypeModifier);

    const connectionFilterArrayOperators = {
      isNull: standardOperators.isNull,
      equalTo: standardOperators.equalTo,
      notEqualTo: standardOperators.notEqualTo,
      distinctFrom: standardOperators.distinctFrom,
      notDistinctFrom: standardOperators.notDistinctFrom,
      ...sortOperators,
      contains: {
        description: "Contains the specified list of values.",
        resolve: (i, v) => sql.query`${i} @> ${v}`,
      },
      containedBy: {
        description: "Contained by the specified list of values.",
        resolve: (i, v) => sql.query`${i} <@ ${v}`,
      },
      overlaps: {
        description: "Overlaps the specified list of values.",
        resolve: (i, v) => sql.query`${i} && ${v}`,
      },
      anyEqualTo: {
        description: "Any array item is equal to the specified value.",
        resolveType: resolveArrayItemType,
        resolveSqlValue: resolveArrayItemSqlValue,
        resolve: (i, v) => sql.query`${v} = ANY (${i})`,
      },
      anyNotEqualTo: {
        description: "Any array item is not equal to the specified value.",
        resolveType: resolveArrayItemType,
        resolveSqlValue: resolveArrayItemSqlValue,
        resolve: (i, v) => sql.query`${v} <> ANY (${i})`,
      },
      anyLessThan: {
        description: "Any array item is less than the specified value.",
        resolveType: resolveArrayItemType,
        resolveSqlValue: resolveArrayItemSqlValue,
        resolve: (i, v) => sql.query`${v} > ANY (${i})`,
      },
      anyLessThanOrEqualTo: {
        description:
          "Any array item is less than or equal to the specified value.",
        resolveType: resolveArrayItemType,
        resolveSqlValue: resolveArrayItemSqlValue,
        resolve: (i, v) => sql.query`${v} >= ANY (${i})`,
      },
      anyGreaterThan: {
        description: "Any array item is greater than the specified value.",
        resolveType: resolveArrayItemType,
        resolveSqlValue: resolveArrayItemSqlValue,
        resolve: (i, v) => sql.query`${v} < ANY (${i})`,
      },
      anyGreaterThanOrEqualTo: {
        description:
          "Any array item is greater than or equal to the specified value.",
        resolveType: resolveArrayItemType,
        resolveSqlValue: resolveArrayItemSqlValue,
        resolve: (i, v) => sql.query`${v} <= ANY (${i})`,
      },
    };

    return build.extend(build, {
      connectionFilterArrayOperators,
      connectionFilterEnumOperators,
      connectionFilterRangeOperators,
      connectionFilterScalarOperators,
    });
  });

  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      gql2pg,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      connectionFilterRegisterResolver,
      connectionFilterTypesByTypeName,
      connectionFilterArrayOperators,
      connectionFilterEnumOperators,
      connectionFilterRangeOperators,
      connectionFilterScalarOperators,
    } = build;
    const {
      scope: {
        isPgConnectionFilterOperators,
        pgConnectionFilterOperatorsCategory,
        fieldType,
        fieldInputType,
        rangeElementInputType,
        domainBaseType,
      },
      fieldWithHooks,
      Self,
    } = context;
    if (
      !isPgConnectionFilterOperators ||
      !pgConnectionFilterOperatorsCategory ||
      !fieldType ||
      !fieldInputType
    ) {
      return fields;
    }

    connectionFilterTypesByTypeName[Self.name] = Self;

    const operatorSpecsByCategory = {
      Array: connectionFilterArrayOperators,
      Range: connectionFilterRangeOperators,
      Enum: connectionFilterEnumOperators,
      Domain: domainBaseType
        ? connectionFilterScalarOperators[domainBaseType.name]
        : {},
      Scalar: connectionFilterScalarOperators[fieldType.name],
    };
    const operatorSpecs =
      operatorSpecsByCategory[pgConnectionFilterOperatorsCategory];
    if (!operatorSpecs) {
      return fields;
    }

    const operatorSpecByFieldName = {};

    const operatorFields = Object.entries(operatorSpecs).reduce(
      (memo, [name, spec]) => {
        const { description, resolveType } = spec;

        if (
          connectionFilterAllowedOperators &&
          !connectionFilterAllowedOperators.includes(name)
        ) {
          return memo;
        }
        const type = resolveType
          ? resolveType(fieldInputType, rangeElementInputType)
          : fieldInputType;

        const operatorName =
          (connectionFilterOperatorNames &&
            connectionFilterOperatorNames[name]) ||
          name;

        operatorSpecByFieldName[operatorName] = spec;

        memo[operatorName] = fieldWithHooks(
          operatorName,
          {
            description,
            type,
          },
          {
            isPgConnectionFilterOperator: true,
          }
        );
        return memo;
      },
      {}
    );

    const textPgType = introspectionResultsByKind.type.find(
      t => t.name === "text"
    );
    const textArrayPgType = introspectionResultsByKind.type.find(
      t => t.name === "_text"
    );

    const resolve = ({
      sourceAlias,
      fieldName,
      fieldValue,
      queryBuilder,
      pgType,
      pgTypeModifier,
      parentFieldName,
    }) => {
      if (fieldValue == null) return null;

      const operatorSpec = operatorSpecByFieldName[fieldName];
      const {
        resolveInput,
        resolveSqlIdentifier,
        resolveSqlValue,
      } = operatorSpec;

      const sqlIdentifier = resolveSqlIdentifier
        ? resolveSqlIdentifier(sourceAlias, pgType, pgTypeModifier)
        : pgType.name === "citext"
        ? sql.query`${sourceAlias}::text` // cast column to text for case-sensitive matching
        : pgType.name === "_citext"
        ? sql.query`${sourceAlias}::text[]` // cast column to text[] for case-sensitive matching
        : sourceAlias;

      const input = fieldValue;
      const resolvedInput = resolveInput ? resolveInput(input) : input;

      const sqlValue = resolveSqlValue
        ? resolveSqlValue(input, pgType, pgTypeModifier)
        : pgType.name === "citext"
        ? gql2pg(resolvedInput, textPgType, null) // cast input to text
        : pgType.name === "_citext"
        ? gql2pg(resolvedInput, textArrayPgType, null) // cast input to text[]
        : gql2pg(resolvedInput, pgType, pgTypeModifier);

      return operatorSpec.resolve(
        sqlIdentifier,
        sqlValue,
        input,
        parentFieldName,
        queryBuilder
      );
    };

    for (const fieldName of Object.keys(operatorFields)) {
      connectionFilterRegisterResolver(Self.name, fieldName, resolve);
    }

    return extend(fields, operatorFields);
  });
};
