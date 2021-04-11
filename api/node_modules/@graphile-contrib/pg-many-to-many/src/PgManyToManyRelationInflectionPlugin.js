module.exports = function PgManyToManyRelationInflectionPlugin(builder) {
  builder.hook("inflection", (inflection) => {
    return Object.assign(inflection, {
      manyToManyRelationByKeys(
        _leftKeyAttributes,
        junctionLeftKeyAttributes,
        junctionRightKeyAttributes,
        _rightKeyAttributes,
        junctionTable,
        rightTable,
        _junctionLeftConstraint,
        junctionRightConstraint
      ) {
        if (junctionRightConstraint.tags.manyToManyFieldName) {
          return junctionRightConstraint.tags.manyToManyFieldName;
        }
        return this.camelCase(
          `${this.pluralize(
            this._singularizedTableName(rightTable)
          )}-by-${this._singularizedTableName(junctionTable)}-${[
            ...junctionLeftKeyAttributes,
            ...junctionRightKeyAttributes,
          ]
            .map((attr) => this.column(attr))
            .join("-and-")}`
        );
      },
      manyToManyRelationByKeysSimple(
        _leftKeyAttributes,
        junctionLeftKeyAttributes,
        junctionRightKeyAttributes,
        _rightKeyAttributes,
        junctionTable,
        rightTable,
        _junctionLeftConstraint,
        junctionRightConstraint
      ) {
        if (junctionRightConstraint.tags.manyToManySimpleFieldName) {
          return junctionRightConstraint.tags.manyToManySimpleFieldName;
        }
        return this.camelCase(
          `${this.pluralize(
            this._singularizedTableName(rightTable)
          )}-by-${this._singularizedTableName(junctionTable)}-${[
            ...junctionLeftKeyAttributes,
            ...junctionRightKeyAttributes,
          ]
            .map((attr) => this.column(attr))
            .join("-and-")}-list`
        );
      },
      manyToManyRelationEdge(
        leftKeyAttributes,
        junctionLeftKeyAttributes,
        junctionRightKeyAttributes,
        rightKeyAttributes,
        junctionTable,
        rightTable,
        junctionLeftConstraint,
        junctionRightConstraint,
        leftTableTypeName
      ) {
        const relationName = inflection.manyToManyRelationByKeys(
          leftKeyAttributes,
          junctionLeftKeyAttributes,
          junctionRightKeyAttributes,
          rightKeyAttributes,
          junctionTable,
          rightTable,
          junctionLeftConstraint,
          junctionRightConstraint
        );
        return this.upperCamelCase(
          `${leftTableTypeName}-${relationName}-many-to-many-edge`
        );
      },
      manyToManyRelationConnection(
        leftKeyAttributes,
        junctionLeftKeyAttributes,
        junctionRightKeyAttributes,
        rightKeyAttributes,
        junctionTable,
        rightTable,
        junctionLeftConstraint,
        junctionRightConstraint,
        leftTableTypeName
      ) {
        const relationName = inflection.manyToManyRelationByKeys(
          leftKeyAttributes,
          junctionLeftKeyAttributes,
          junctionRightKeyAttributes,
          rightKeyAttributes,
          junctionTable,
          rightTable,
          junctionLeftConstraint,
          junctionRightConstraint,
          leftTableTypeName
        );
        return this.upperCamelCase(
          `${leftTableTypeName}-${relationName}-many-to-many-connection`
        );
      },
      /* eslint-disable no-unused-vars */
      manyToManyRelationSubqueryName(
        leftKeyAttributes,
        junctionLeftKeyAttributes,
        junctionRightKeyAttributes,
        rightKeyAttributes,
        junctionTable,
        rightTable,
        junctionLeftConstraint,
        junctionRightConstraint,
        leftTableTypeName
      ) {
        /* eslint-enable no-unused-vars */
        return `many-to-many-subquery-by-${this._singularizedTableName(
          junctionTable
        )}`;
      },
    });
  });
};
