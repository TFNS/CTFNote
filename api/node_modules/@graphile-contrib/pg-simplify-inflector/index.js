function fixCapitalisedPlural(fn) {
  return function (str) {
    const original = fn.call(this, str);
    return original.replace(/[0-9]S(?=[A-Z]|$)/g, (match) =>
      match.toLowerCase()
    );
  };
}

function fixChangePlural(fn) {
  return function (str) {
    const matches = str.match(/([A-Z]|_[a-z0-9])[a-z0-9]*_*$/);
    const index = matches ? matches.index + matches[1].length - 1 : 0;
    const suffixMatches = str.match(/_*$/);
    const suffixIndex = suffixMatches.index;
    const prefix = str.substr(0, index);
    const word = str.substr(index, suffixIndex - index);
    const suffix = str.substr(suffixIndex);
    return `${prefix}${fn.call(this, word)}${suffix}`;
  };
}

function PgSimplifyInflectorPlugin(
  builder,
  {
    pgSimpleCollections,
    pgOmitListSuffix,
    pgSimplifyPatch = true,
    pgSimplifyAllRows = true,
    pgShortPk = true,
    pgSimplifyMultikeyRelations = true,
    nodeIdFieldName = "nodeId",
  }
) {
  const hasConnections = pgSimpleCollections !== "only";
  const hasSimpleCollections =
    pgSimpleCollections === "only" || pgSimpleCollections === "both";

  if (
    hasSimpleCollections &&
    !hasConnections &&
    pgOmitListSuffix !== true &&
    pgOmitListSuffix !== false
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "You can simplify the inflector further by adding `{graphileBuildOptions: {pgOmitListSuffix: true}}` to the options passed to PostGraphile, however be aware that doing so will mean that later enabling relay connections will be a breaking change. To dismiss this message, set `pgOmitListSuffix` to false instead."
    );
  }

  /** @typedef {import('graphile-build-pg').PgEntity} PgEntity */

  function omitListSuffix(/** @type PgEntity */ entity) {
    const tag = entity.tags.listSuffix;
    if (tag == null) return !!pgOmitListSuffix;
    if (tag !== "include" && tag !== "omit")
      throw new Error(
        `Unrecognized @listSuffix value "${tag}" on ${entity.kind} "${entity.name}". If @listSuffix is set, it must be "omit" or "include".`
      );
    return tag === "omit";
  }

  function connectionSuffix(/** @type PgEntity */ entity) {
    return omitListSuffix(entity) ? "-connection" : "";
  }

  function ConnectionSuffix(/** @type PgEntity */ entity) {
    return omitListSuffix(entity) ? "Connection" : "";
  }

  function listSuffix(/** @type PgEntity */ entity) {
    return omitListSuffix(entity) ? "" : "-list";
  }

  function ListSuffix(/** @type PgEntity */ entity) {
    return omitListSuffix(entity) ? "" : "List";
  }

  builder.hook("inflection", (oldInflection) => {
    return {
      ...oldInflection,

      /*
       * This solves the issue with `blah-table1s` becoming `blahTable1S`
       * (i.e. the capital S at the end) or `table1-connection becoming `Table1SConnection`
       */
      camelCase: fixCapitalisedPlural(oldInflection.camelCase),
      upperCamelCase: fixCapitalisedPlural(oldInflection.upperCamelCase),

      /*
       * Pluralize/singularize only supports single words, so only run
       * on the final segment of a name.
       */
      pluralize: fixChangePlural(oldInflection.pluralize),
      singularize: fixChangePlural(oldInflection.singularize),

      distinctPluralize(str) {
        const singular = this.singularize(str);
        const plural = this.pluralize(singular);
        if (singular !== plural) {
          return plural;
        }
        if (
          plural.endsWith("ch") ||
          plural.endsWith("s") ||
          plural.endsWith("sh") ||
          plural.endsWith("x") ||
          plural.endsWith("z")
        ) {
          return plural + "es";
        } else if (plural.endsWith("y")) {
          return plural.slice(0, -1) + "ies";
        } else {
          return plural + "s";
        }
      },

      // Fix a naming bug
      deletedNodeId(table) {
        return this.camelCase(
          `deleted-${this.singularize(table.name)}-${nodeIdFieldName}`
        );
      },

      getBaseName(columnName) {
        const matches = columnName.match(
          /^(.+?)(_row_id|_id|_uuid|_fk|_pk|RowId|Id|Uuid|UUID|Fk|Pk)$/
        );
        if (matches) {
          return matches[1];
        }
        return null;
      },

      baseNameMatches(baseName, otherName) {
        const singularizedName = this.singularize(otherName);
        return baseName === singularizedName;
      },

      /* This is a good method to override. */
      getOppositeBaseName(baseName) {
        return (
          {
            /*
             * Changes to this list are breaking changes and will require a
             * major version update, so we need to group as many together as
             * possible! Rather than sending a PR, please look for an open
             * issue called something like "Add more opposites" (if there isn't
             * one then please open it) and add your suggestions to the GitHub
             * comments.
             */
            parent: "child",
            child: "parent",
            author: "authored",
            editor: "edited",
            reviewer: "reviewed",
          }[baseName] || null
        );
      },

      getBaseNameFromKeys(detailedKeys) {
        if (detailedKeys.length === 1) {
          const key = detailedKeys[0];
          const columnName = this._columnName(key);
          return this.getBaseName(columnName);
        }
        if (pgSimplifyMultikeyRelations) {
          const columnNames = detailedKeys.map((key) => this._columnName(key));
          const baseNames = columnNames.map((columnName) =>
            this.getBaseName(columnName)
          );
          // Check none are null
          if (baseNames.every((n) => n)) {
            return baseNames.join("-");
          }
        }
        return null;
      },

      ...(pgSimplifyPatch
        ? {
            patchField() {
              return "patch";
            },
          }
        : null),

      ...(pgSimplifyAllRows
        ? {
            allRows(table) {
              return this.camelCase(
                this.distinctPluralize(this._singularizedTableName(table)) +
                  connectionSuffix(table)
              );
            },
            allRowsSimple(table) {
              return this.camelCase(
                this.distinctPluralize(this._singularizedTableName(table)) +
                  listSuffix(table)
              );
            },
          }
        : null),

      computedColumn(pseudoColumnName, proc, _table) {
        return proc.tags.fieldName
          ? proc.tags.fieldName +
              (proc.returnsSet ? ConnectionSuffix(proc) : "")
          : this.camelCase(
              pseudoColumnName + (proc.returnsSet ? connectionSuffix(proc) : "")
            );
      },

      computedColumnList(pseudoColumnName, proc, _table) {
        return proc.tags.fieldName
          ? proc.tags.fieldName + ListSuffix(proc)
          : this.camelCase(pseudoColumnName + listSuffix(proc));
      },

      singleRelationByKeys(detailedKeys, table, _foreignTable, constraint) {
        if (constraint.tags.fieldName) {
          return constraint.tags.fieldName;
        }
        const baseName = this.getBaseNameFromKeys(detailedKeys);
        if (baseName) {
          return this.camelCase(baseName);
        }
        if (this.baseNameMatches(baseName, table.name)) {
          return this.camelCase(`${this._singularizedTableName(table)}`);
        }
        return oldInflection.singleRelationByKeys(
          detailedKeys,
          table,
          _foreignTable,
          constraint
        );
      },

      singleRelationByKeysBackwards(
        detailedKeys,
        table,
        foreignTable,
        constraint
      ) {
        if (constraint.tags.foreignSingleFieldName) {
          return constraint.tags.foreignSingleFieldName;
        }
        if (constraint.tags.foreignFieldName) {
          return constraint.tags.foreignFieldName;
        }
        const baseName = this.getBaseNameFromKeys(detailedKeys);
        const oppositeBaseName = baseName && this.getOppositeBaseName(baseName);
        if (oppositeBaseName) {
          return this.camelCase(
            `${oppositeBaseName}-${this._singularizedTableName(table)}`
          );
        }
        if (this.baseNameMatches(baseName, foreignTable.name)) {
          return this.camelCase(`${this._singularizedTableName(table)}`);
        }
        return oldInflection.singleRelationByKeysBackwards(
          detailedKeys,
          table,
          foreignTable,
          constraint
        );
      },

      _manyRelationByKeysBase(detailedKeys, table, _foreignTable, _constraint) {
        const baseName = this.getBaseNameFromKeys(detailedKeys);
        const oppositeBaseName = baseName && this.getOppositeBaseName(baseName);
        if (oppositeBaseName) {
          return this.camelCase(
            `${oppositeBaseName}-${this.distinctPluralize(
              this._singularizedTableName(table)
            )}`
          );
        }
        if (this.baseNameMatches(baseName, _foreignTable.name)) {
          return this.camelCase(
            `${this.distinctPluralize(this._singularizedTableName(table))}`
          );
        }
        return null;
      },

      manyRelationByKeys(detailedKeys, table, foreignTable, constraint) {
        if (constraint.tags.foreignFieldName) {
          if (constraint.tags.foreignSimpleFieldName) {
            return constraint.tags.foreignFieldName;
          } else {
            return (
              constraint.tags.foreignFieldName + ConnectionSuffix(constraint)
            );
          }
        }
        const base = this._manyRelationByKeysBase(
          detailedKeys,
          table,
          foreignTable,
          constraint
        );
        if (base) {
          return base + ConnectionSuffix(constraint);
        }
        return (
          oldInflection.manyRelationByKeys(
            detailedKeys,
            table,
            foreignTable,
            constraint
          ) + ConnectionSuffix(constraint)
        );
      },

      manyRelationByKeysSimple(detailedKeys, table, foreignTable, constraint) {
        if (constraint.tags.foreignSimpleFieldName) {
          return constraint.tags.foreignSimpleFieldName;
        }
        if (constraint.tags.foreignFieldName) {
          return constraint.tags.foreignFieldName + ListSuffix(constraint);
        }
        const base = this._manyRelationByKeysBase(
          detailedKeys,
          table,
          foreignTable,
          constraint
        );
        if (base) {
          return base + ListSuffix(constraint);
        }
        return (
          oldInflection.manyRelationByKeys(
            detailedKeys,
            table,
            foreignTable,
            constraint
          ) + ListSuffix(constraint)
        );
      },

      functionQueryName(proc) {
        return this.camelCase(
          this._functionName(proc) +
            (proc.returnsSet ? connectionSuffix(proc) : "")
        );
      },
      functionQueryNameList(proc) {
        return this.camelCase(this._functionName(proc) + listSuffix(proc));
      },

      ...(pgShortPk
        ? {
            tableNode(table) {
              return this.camelCase(
                `${this._singularizedTableName(table)}-by-${nodeIdFieldName}`
              );
            },
            rowByUniqueKeys(detailedKeys, table, constraint) {
              if (constraint.tags.fieldName) {
                return constraint.tags.fieldName;
              }
              if (constraint.type === "p") {
                // Primary key, shorten!
                return this.camelCase(this._singularizedTableName(table));
              } else {
                return this.camelCase(
                  `${this._singularizedTableName(
                    table
                  )}-by-${detailedKeys
                    .map((key) => this.column(key))
                    .join("-and-")}`
                );
              }
            },

            updateByKeys(detailedKeys, table, constraint) {
              if (constraint.tags.updateFieldName) {
                return constraint.tags.updateFieldName;
              }
              if (constraint.type === "p") {
                return this.camelCase(
                  `update-${this._singularizedTableName(table)}`
                );
              } else {
                return this.camelCase(
                  `update-${this._singularizedTableName(
                    table
                  )}-by-${detailedKeys
                    .map((key) => this.column(key))
                    .join("-and-")}`
                );
              }
            },
            deleteByKeys(detailedKeys, table, constraint) {
              if (constraint.tags.deleteFieldName) {
                return constraint.tags.deleteFieldName;
              }
              if (constraint.type === "p") {
                // Primary key, shorten!
                return this.camelCase(
                  `delete-${this._singularizedTableName(table)}`
                );
              } else {
                return this.camelCase(
                  `delete-${this._singularizedTableName(
                    table
                  )}-by-${detailedKeys
                    .map((key) => this.column(key))
                    .join("-and-")}`
                );
              }
            },
            updateByKeysInputType(detailedKeys, table, constraint) {
              if (constraint.tags.updateFieldName) {
                return this.upperCamelCase(
                  `${constraint.tags.updateFieldName}-input`
                );
              }
              if (constraint.type === "p") {
                // Primary key, shorten!
                return this.upperCamelCase(
                  `update-${this._singularizedTableName(table)}-input`
                );
              } else {
                return this.upperCamelCase(
                  `update-${this._singularizedTableName(
                    table
                  )}-by-${detailedKeys
                    .map((key) => this.column(key))
                    .join("-and-")}-input`
                );
              }
            },
            deleteByKeysInputType(detailedKeys, table, constraint) {
              if (constraint.tags.deleteFieldName) {
                return this.upperCamelCase(
                  `${constraint.tags.deleteFieldName}-input`
                );
              }
              if (constraint.type === "p") {
                // Primary key, shorten!
                return this.upperCamelCase(
                  `delete-${this._singularizedTableName(table)}-input`
                );
              } else {
                return this.upperCamelCase(
                  `delete-${this._singularizedTableName(
                    table
                  )}-by-${detailedKeys
                    .map((key) => this.column(key))
                    .join("-and-")}-input`
                );
              }
            },
            updateNode(table) {
              return this.camelCase(
                `update-${this._singularizedTableName(
                  table
                )}-by-${nodeIdFieldName}`
              );
            },
            deleteNode(table) {
              return this.camelCase(
                `delete-${this._singularizedTableName(
                  table
                )}-by-${nodeIdFieldName}`
              );
            },
            updateNodeInputType(table) {
              return this.upperCamelCase(
                `update-${this._singularizedTableName(
                  table
                )}-by-${nodeIdFieldName}-input`
              );
            },
            deleteNodeInputType(table) {
              return this.upperCamelCase(
                `delete-${this._singularizedTableName(
                  table
                )}-by-${nodeIdFieldName}-input`
              );
            },
          }
        : null),
    };
  });
}

module.exports = PgSimplifyInflectorPlugin;
// Hacks for TypeScript/Babel import
module.exports.default = PgSimplifyInflectorPlugin;
Object.defineProperty(module.exports, "__esModule", { value: true });
