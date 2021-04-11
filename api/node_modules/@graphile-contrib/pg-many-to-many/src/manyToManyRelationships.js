function arraysAreEqual(array1, array2) {
  return (
    array1.length === array2.length && array1.every((el, i) => array2[i] === el)
  );
}

// Given a `leftTable`, trace through the foreign key relations
// and identify a `junctionTable` and `rightTable`.
// Returns a list of data objects for these many-to-many relationships.
module.exports = function manyToManyRelationships(leftTable, build) {
  const {
    pgIntrospectionResultsByKind: introspectionResultsByKind,
    pgOmit: omit,
  } = build;

  return leftTable.foreignConstraints
    .filter((con) => con.type === "f")
    .reduce((memoLeft, junctionLeftConstraint) => {
      if (
        omit(junctionLeftConstraint, "read") ||
        omit(junctionLeftConstraint, "manyToMany")
      ) {
        return memoLeft;
      }
      const junctionTable =
        introspectionResultsByKind.classById[junctionLeftConstraint.classId];
      if (!junctionTable) {
        throw new Error(
          `Could not find the table that referenced us (constraint: ${junctionLeftConstraint.name})`
        );
      }
      if (omit(junctionTable, "read") || omit(junctionTable, "manyToMany")) {
        return memoLeft;
      }
      const memoRight = junctionTable.constraints
        .filter(
          (con) =>
            con.id !== junctionLeftConstraint.id && // Don't follow the same constraint back to the left table
            con.type === "f" &&
            !omit(con, "read") &&
            !omit(con, "manyToMany")
        )
        .reduce((memoRight, junctionRightConstraint) => {
          const rightTable = junctionRightConstraint.foreignClass;
          if (omit(rightTable, "read") || omit(rightTable, "manyToMany")) {
            return memoRight;
          }

          const leftKeyAttributes = junctionLeftConstraint.foreignKeyAttributes;
          const junctionLeftKeyAttributes =
            junctionLeftConstraint.keyAttributes;
          const junctionRightKeyAttributes =
            junctionRightConstraint.keyAttributes;
          const rightKeyAttributes =
            junctionRightConstraint.foreignKeyAttributes;

          // Ensure keys were found
          if (
            !leftKeyAttributes.every((_) => _) ||
            !junctionLeftKeyAttributes.every((_) => _) ||
            !junctionRightKeyAttributes.every((_) => _) ||
            !rightKeyAttributes.every((_) => _)
          ) {
            throw new Error("Could not find key columns!");
          }

          // Ensure keys can be read
          if (
            leftKeyAttributes.some((attr) => omit(attr, "read")) ||
            junctionLeftKeyAttributes.some((attr) => omit(attr, "read")) ||
            junctionRightKeyAttributes.some((attr) => omit(attr, "read")) ||
            rightKeyAttributes.some((attr) => omit(attr, "read"))
          ) {
            return memoRight;
          }

          // Ensure both constraints are single-column
          // TODO: handle multi-column
          if (leftKeyAttributes.length > 1 || rightKeyAttributes.length > 1) {
            return memoRight;
          }

          // Ensure junction constraint keys are not unique (which would result in a one-to-one relation)
          const junctionLeftConstraintIsUnique = !!junctionTable.constraints.find(
            (c) =>
              ["p", "u"].includes(c.type) &&
              arraysAreEqual(
                c.keyAttributeNums,
                junctionLeftKeyAttributes.map((attr) => attr.num)
              )
          );
          const junctionRightConstraintIsUnique = !!junctionTable.constraints.find(
            (c) =>
              ["p", "u"].includes(c.type) &&
              arraysAreEqual(
                c.keyAttributeNums,
                junctionRightKeyAttributes.map((attr) => attr.num)
              )
          );
          if (
            junctionLeftConstraintIsUnique ||
            junctionRightConstraintIsUnique
          ) {
            return memoRight;
          }

          const allowsMultipleEdgesToNode = !junctionTable.constraints.find(
            (c) =>
              ["p", "u"].includes(c.type) &&
              arraysAreEqual(
                c.keyAttributeNums.concat().sort(),
                [
                  ...junctionLeftKeyAttributes.map((obj) => obj.num),
                  ...junctionRightKeyAttributes.map((obj) => obj.num),
                ].sort()
              )
          );

          return [
            ...memoRight,
            {
              leftKeyAttributes,
              junctionLeftKeyAttributes,
              junctionRightKeyAttributes,
              rightKeyAttributes,
              junctionTable,
              rightTable,
              junctionLeftConstraint,
              junctionRightConstraint,
              allowsMultipleEdgesToNode,
            },
          ];
        }, []);
      return [...memoLeft, ...memoRight];
    }, []);
};
