"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostgraphileSchemaBuilder = void 0;
const pg_1 = require("pg");
const graphql_1 = require("graphql");
const events_1 = require("events");
const postgraphile_core_1 = require("postgraphile-core");
const createPostGraphileHttpRequestHandler_1 = require("./http/createPostGraphileHttpRequestHandler");
const exportPostGraphileSchema_1 = require("./schema/exportPostGraphileSchema");
const pluginHook_1 = require("./pluginHook");
const chalk_1 = require("chalk");
const withPostGraphileContext_1 = require("./withPostGraphileContext");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// tslint:disable-next-line no-any
function isPlainObject(obj) {
    if (!obj || typeof obj !== 'object' || String(obj) !== '[object Object]')
        return false;
    const proto = Object.getPrototypeOf(obj);
    if (proto === null || proto === Object.prototype) {
        return true;
    }
    return false;
}
/**
 * Creates a PostGraphile Http request handler by first introspecting the
 * database to get a GraphQL schema, and then using that to create the Http
 * request handler.
 */
function getPostgraphileSchemaBuilder(pgPool, schema, incomingOptions, release = null) {
    let released = false;
    function releaseOnce() {
        if (released) {
            throw new Error('Already released this PostGraphile schema builder; should not have attempted a second release');
        }
        released = true;
        if (release) {
            release();
        }
    }
    if (incomingOptions.live && incomingOptions.subscriptions == null) {
        // live implies subscriptions
        incomingOptions.subscriptions = true;
    }
    const pluginHook = pluginHook_1.pluginHookFromOptions(incomingOptions);
    const options = pluginHook('postgraphile:options', incomingOptions, {
        pgPool,
        schema,
    });
    // Check for a jwtSecret without a jwtPgTypeIdentifier
    // a secret without a token identifier prevents JWT creation
    if (options.jwtSecret && !options.jwtPgTypeIdentifier) {
        // tslint:disable-next-line no-console
        console.warn('WARNING: jwtSecret provided, however jwtPgTypeIdentifier (token identifier) not provided.');
    }
    if (options.handleErrors && (options.extendedErrors || options.showErrorStack)) {
        throw new Error(`You cannot combine 'handleErrors' with the other error options`);
    }
    // Creates the Postgres schemas array.
    const pgSchemas = Array.isArray(schema) ? schema : [schema];
    const _emitter = options['_emitter'] || new events_1.EventEmitter();
    // Creates a promise which will resolve to a GraphQL schema. Connects a
    // client from our pool to introspect the database.
    //
    // This is not a constant because when we are in watch mode, we want to swap
    // out the `gqlSchema`.
    let gqlSchema;
    const gqlSchemaPromise = createGqlSchema();
    return {
        _emitter,
        getGraphQLSchema: () => (gqlSchema ? Promise.resolve(gqlSchema) : gqlSchemaPromise),
        options,
    };
    async function createGqlSchema() {
        let attempts = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                if (options.watchPg) {
                    await postgraphile_core_1.watchPostGraphileSchema(pgPool, pgSchemas, options, newSchema => {
                        gqlSchema = newSchema;
                        _emitter.emit('schemas:changed');
                        exportGqlSchema(gqlSchema);
                    });
                    if (!gqlSchema) {
                        throw new Error("Consistency error: watchPostGraphileSchema promises to call the callback before the promise resolves; but this hasn't happened");
                    }
                }
                else {
                    gqlSchema = await postgraphile_core_1.createPostGraphileSchema(pgPool, pgSchemas, options);
                    exportGqlSchema(gqlSchema);
                }
                if (attempts > 0) {
                    // tslint:disable-next-line no-console
                    console.error(`Schema ${attempts > 15 ? 'eventually' : attempts > 5 ? 'finally' : 'now'} generated successfully`);
                }
                return gqlSchema;
            }
            catch (error) {
                attempts++;
                const delay = Math.min(100 * Math.pow(attempts, 2), 30000);
                if (typeof options.retryOnInitFail === 'function') {
                    const start = process.hrtime();
                    try {
                        const retry = await options.retryOnInitFail(error, attempts);
                        const diff = process.hrtime(start);
                        const dur = diff[0] * 1e3 + diff[1] * 1e-6;
                        if (!retry) {
                            releaseOnce();
                            throw error;
                        }
                        else {
                            if (dur < 50) {
                                // retryOnInitFail didn't wait long enough; use default wait.
                                console.error(`Your retryOnInitFail function should include a delay before resolving; falling back to a ${delay}ms wait (attempts = ${attempts}) to avoid overwhelming the database.`);
                                await sleep(delay);
                            }
                        }
                    }
                    catch (e) {
                        throw Object.defineProperties(new graphql_1.GraphQLError('Failed to initialize GraphQL schema.', undefined, undefined, undefined, undefined, e), {
                            status: {
                                value: 503,
                                enumerable: false,
                            },
                        });
                    }
                }
                else {
                    const exitOnFail = !options.retryOnInitFail;
                    // If we fail to build our schema, log the error and either exit or retry shortly
                    logSeriousError(error, 'building the initial schema' + (attempts > 1 ? ` (attempt ${attempts})` : ''), exitOnFail
                        ? 'Exiting because `retryOnInitFail` is not set.'
                        : `We'll try again in ${delay}ms.`);
                    if (exitOnFail) {
                        process.exit(34);
                    }
                    // Retry shortly
                    await sleep(delay);
                }
            }
        }
    }
    async function exportGqlSchema(newGqlSchema) {
        try {
            await exportPostGraphileSchema_1.default(newGqlSchema, options);
        }
        catch (error) {
            // If we exit cleanly; let calling scripts know there was a problem.
            process.exitCode = 35;
            // If we fail to export our schema, log the error.
            logSeriousError(error, 'exporting the schema');
        }
    }
}
exports.getPostgraphileSchemaBuilder = getPostgraphileSchemaBuilder;
function postgraphile(poolOrConfig, schemaOrOptions, maybeOptions) {
    let schema;
    // These are the raw options we're passed in; getPostgraphileSchemaBuilder
    // must process them with `pluginHook` before we can rely on them.
    let incomingOptions;
    // If the second argument is a string or array, it is the schemas so set the
    // `schema` value and try to use the third argument (or a default) for
    // `incomingOptions`.
    if (typeof schemaOrOptions === 'string' || Array.isArray(schemaOrOptions)) {
        schema = schemaOrOptions;
        incomingOptions = maybeOptions || {};
    }
    // If the second argument is null or an object then use default `schema`
    // and set incomingOptions to second or third argument (or default).
    else if (typeof schemaOrOptions === 'object') {
        schema = 'public';
        incomingOptions = schemaOrOptions || maybeOptions || {};
    }
    // Otherwise if the second argument is present it's invalid: throw an error.
    else if (arguments.length > 1) {
        throw new Error('The second argument to postgraphile was invalid... did you mean to set a schema?');
    }
    // No schema or options specified, use defaults.
    else {
        schema = 'public';
        incomingOptions = {};
    }
    if (typeof poolOrConfig === 'undefined' && arguments.length >= 1) {
        throw new Error('The first argument to postgraphile was `undefined`... did you mean to set pool options?');
    }
    // Do some things with `poolOrConfig` so that in the end, we actually get a
    // Postgres pool.
    const { pgPool, release } = toPgPool(poolOrConfig);
    pgPool.on('error', err => {
        /*
         * This handler is required so that client connection errors don't bring
         * the server down (via `unhandledError`).
         *
         * `pg` will automatically terminate the client and remove it from the
         * pool, so we don't actually need to take any action here, just ensure
         * that the event listener is registered.
         */
        // tslint:disable-next-line no-console
        console.error('PostgreSQL client generated error: ', err.message);
    });
    pgPool.on('connect', pgClient => {
        // Enhance our Postgres client with debugging stuffs.
        withPostGraphileContext_1.debugPgClient(pgClient, !!options.allowExplain);
    });
    const { getGraphQLSchema, options, _emitter } = getPostgraphileSchemaBuilder(pgPool, schema, incomingOptions, release);
    return createPostGraphileHttpRequestHandler_1.default(Object.assign(Object.assign(Object.assign({}, (typeof poolOrConfig === 'string' ? { ownerConnectionString: poolOrConfig } : {})), options), { getGqlSchema: getGraphQLSchema, pgPool,
        _emitter }));
}
exports.default = postgraphile;
function logSeriousError(error, when, nextSteps) {
    // tslint:disable-next-line no-console
    console.error(`A ${chalk_1.default.bold('serious error')} occurred when ${chalk_1.default.bold(when)}. ${nextSteps ? nextSteps + ' ' : ''}Error details:\n\n${error.stack}\n`);
}
function hasPoolConstructor(obj) {
    return (
    // tslint:disable-next-line no-any
    (obj && typeof obj.constructor === 'function' && obj.constructor === pg_1.Pool.super_) ||
        false);
}
function constructorName(obj) {
    return ((obj &&
        typeof obj.constructor === 'function' &&
        obj.constructor.name &&
        String(obj.constructor.name)) ||
        null);
}
// tslint:disable-next-line no-any
function toPgPool(poolOrConfig) {
    if (quacksLikePgPool(poolOrConfig)) {
        // If it is already a `Pool`, just use it.
        return { pgPool: poolOrConfig, release: null };
    }
    if (typeof poolOrConfig === 'string') {
        // If it is a string, let us parse it to get a config to create a `Pool`.
        const pgPool = new pg_1.Pool({ connectionString: poolOrConfig });
        return { pgPool, release: () => pgPool.end() };
    }
    else if (!poolOrConfig) {
        // Use an empty config and let the defaults take over.
        const pgPool = new pg_1.Pool({});
        return { pgPool, release: () => pgPool.end() };
    }
    else if (isPlainObject(poolOrConfig)) {
        // The user handed over a configuration object, pass it through
        const pgPool = new pg_1.Pool(poolOrConfig);
        return { pgPool, release: () => pgPool.end() };
    }
    else {
        throw new Error('Invalid connection string / Pool ');
    }
}
// tslint:disable-next-line no-any
function quacksLikePgPool(pgConfig) {
    if (pgConfig instanceof pg_1.Pool)
        return true;
    if (hasPoolConstructor(pgConfig))
        return true;
    // A diagnosis of exclusion
    if (!pgConfig || typeof pgConfig !== 'object')
        return false;
    if (constructorName(pgConfig) !== 'Pool' && constructorName(pgConfig) !== 'BoundPool')
        return false;
    if (!pgConfig['Client'])
        return false;
    if (!pgConfig['options'])
        return false;
    if (typeof pgConfig['connect'] !== 'function')
        return false;
    if (typeof pgConfig['end'] !== 'function')
        return false;
    if (typeof pgConfig['query'] !== 'function')
        return false;
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBoaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Bvc3RncmFwaGlsZS9wb3N0Z3JhcGhpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkJBQXNDO0FBRXRDLHFDQUFzRDtBQUN0RCxtQ0FBc0M7QUFDdEMseURBQXNGO0FBQ3RGLHNHQUErRjtBQUMvRixnRkFBeUU7QUFDekUsNkNBQXFEO0FBRXJELGlDQUEwQjtBQUMxQix1RUFBMEQ7QUFFMUQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBRTlFLGtDQUFrQztBQUNsQyxTQUFTLGFBQWEsQ0FBQyxHQUFRO0lBQzdCLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxpQkFBaUI7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN2RixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNoRCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBV0Q7Ozs7R0FJRztBQUNILFNBQWdCLDRCQUE0QixDQUkxQyxNQUFZLEVBQ1osTUFBOEIsRUFDOUIsZUFBdUQsRUFDdkQsVUFBK0IsSUFBSTtJQUVuQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDckIsU0FBUyxXQUFXO1FBQ2xCLElBQUksUUFBUSxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FDYiwrRkFBK0YsQ0FDaEcsQ0FBQztTQUNIO1FBQ0QsUUFBUSxHQUFHLElB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