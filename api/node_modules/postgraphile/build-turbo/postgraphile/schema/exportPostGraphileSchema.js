"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const graphql_1 = require("graphql");
const GQL = require("graphql");
const util_1 = require("util");
const introspectionQuery = typeof GQL.getIntrospectionQuery === 'function'
    ? GQL.getIntrospectionQuery()
    : GQL.introspectionQuery;
const readFile = util_1.promisify(fs_1.readFile);
const writeFile = util_1.promisify(fs_1.writeFile);
async function writeFileIfDiffers(path, contents) {
    let oldContents = null;
    try {
        oldContents = await readFile(path, 'utf8');
    }
    catch (e) {
        /* noop */
    }
    if (oldContents !== contents) {
        await writeFile(path, contents);
    }
}
/**
 * Exports a PostGraphile schema by looking at a Postgres client.
 */
async function exportPostGraphileSchema(schema, options = {}) {
    const jsonPath = typeof options.exportJsonSchemaPath === 'string' ? options.exportJsonSchemaPath : null;
    const graphqlPath = typeof options.exportGqlSchemaPath === 'string' ? options.exportGqlSchemaPath : null;
    // Sort schema, if requested
    const finalSchema = options.sortExport && graphql_1.lexicographicSortSchema && (jsonPath || graphqlPath)
        ? graphql_1.lexicographicSortSchema(schema)
        : schema;
    // JSON version
    if (jsonPath) {
        const result = await graphql_1.graphql(finalSchema, introspectionQuery);
        await writeFileIfDiffers(jsonPath, JSON.stringify(result, null, 2));
    }
    // Schema language version
    if (graphqlPath) {
        await writeFileIfDiffers(graphqlPath, graphql_1.printSchema(finalSchema));
    }
}
exports.default = exportPostGraphileSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0UG9zdEdyYXBoaWxlU2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaGlsZS9zY2hlbWEvZXhwb3J0UG9zdEdyYXBoaWxlU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTBFO0FBQzFFLHFDQUF1RjtBQUN2RiwrQkFBK0I7QUFFL0IsK0JBQWlDO0FBRWpDLE1BQU0sa0JBQWtCLEdBQ3RCLE9BQU8sR0FBRyxDQUFDLHFCQUFxQixLQUFLLFVBQVU7SUFDN0MsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRTtJQUM3QixDQUFDLENBQUUsR0FBVyxDQUFDLGtCQUFrQixDQUFDO0FBRXRDLE1BQU0sUUFBUSxHQUFHLGdCQUFTLENBQUMsYUFBWSxDQUFDLENBQUM7QUFDekMsTUFBTSxTQUFTLEdBQUcsZ0JBQVMsQ0FBQyxjQUFhLENBQUMsQ0FBQztBQUUzQyxLQUFLLFVBQVUsa0JBQWtCLENBQUMsSUFBWSxFQUFFLFFBQWdCO0lBQzlELElBQUksV0FBVyxHQUFrQixJQUFJLENBQUM7SUFDdEMsSUFBSTtRQUNGLFdBQVcsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDNUM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLFVBQVU7S0FDWDtJQUNELElBQUksV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUM1QixNQUFNLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDWSxLQUFLLFVBQVUsd0JBQXdCLENBQ3BELE1BQXFCLEVBQ3JCLFVBQStCLEVBQUU7SUFFakMsTUFBTSxRQUFRLEdBQ1osT0FBTyxPQUFPLENBQUMsb0JBQW9CLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN6RixNQUFNLFdBQVcsR0FDZixPQUFPLE9BQU8sQ0FBQyxtQkFBbUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRXZGLDRCQUE0QjtJQUM1QixNQUFNLFdBQVcsR0FDZixPQUFPLENBQUMsVUFBVSxJQUFJLGlDQUF1QixJQUFJLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQztRQUN4RSxDQUFDLENBQUMsaUNBQXVCLENBQUMsTUFBTSxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFYixlQUFlO0lBQ2YsSUFBSSxRQUFRLEVBQUU7UUFDWixNQUFNLE1BQU0sR0FBRyxNQUFNLGlCQUFPLENBQUMsV0FBVyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDOUQsTUFBTSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDckU7SUFFRCwwQkFBMEI7SUFDMUIsSUFBSSxXQUFXLEVBQUU7UUFDZixNQUFNLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxxQkFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDakU7QUFDSCxDQUFDO0FBekJELDJDQXlCQyJ9