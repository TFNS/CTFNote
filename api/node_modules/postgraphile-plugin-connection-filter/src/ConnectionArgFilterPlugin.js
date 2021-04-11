module.exports = function ConnectionArgFilterPlugin(builder) {
  builder.hook("inflection", inflection => {
    return Object.assign(inflection, {
      filterType(typeName) {
        return `${typeName}Filter`;
      },
      filterFieldType(typeName) {
        return `${typeName}Filter`;
      },
      filterFieldListType(typeName) {
        return `${typeName}ListFilter`;
      },
    });
  });
};
