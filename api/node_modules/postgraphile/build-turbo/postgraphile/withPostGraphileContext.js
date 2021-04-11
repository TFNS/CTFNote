"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugPgClient = void 0;
const createDebugger = require("debug");
const jwt = require("jsonwebtoken");
const graphql_1 = require("graphql");
const sql = require("pg-sql2");
const pgClientFromContext_1 = require("../postgres/inventory/pgClientFromContext");
const pluginHook_1 = require("./pluginHook");
const postgraphile_core_1 = require("postgraphile-core");
const undefinedIfEmpty = (o) => o && (!Array.isArray(o) || o.length) ? o : undefined;
const debugPg = createDebugger('postgraphile:postgres');
const debugPgError = createDebugger('postgraphile:postgres:error');
const debugPgNotice = createDebugger('postgraphile:postgres:notice');
/**
 * Formats an error/notice from `pg` and feeds it into a `debug` function.
 */
function debugPgErrorObject(debugFn, object) {
    debugFn('%s%s: %s%s%s', object.severity || 'ERROR', object.code ? `[${object.code}]` : '', object.message || object, object.where ? ` | WHERE: ${object.where}` : '', object.hint ? ` | HINT: ${object.hint}` : '');
}
const simpleWithPgClientCache = new WeakMap();
function simpleWithPgClient(pgPool) {
    const cached = simpleWithPgClientCache.get(pgPool);
    if (cached) {
        return cached;
    }
    const func = async (cb) => {
        const pgClient = await pgPool.connect();
        try {
            return await cb(pgClient);
        }
        finally {
            pgClient.release();
        }
    };
    simpleWithPgClientCache.set(pgPool, func);
    return func;
}
const withDefaultPostGraphileContext = async (options, callback) => {
    const { pgPool, jwtToken, jwtSecret, jwtPublicKey, jwtAudiences, jwtRole = ['role'], jwtVerifyOptions, pgDefaultRole, pgSettings, explain, queryDocumentAst, operationName, pgForceTransaction, singleStatement, } = options;
    let operation;
    if (!pgForceTransaction && queryDocumentAst) {
        // tslint:disable-next-line
        for (let i = 0, l = queryDocumentAst.definitions.length; i < l; i++) {
            const definition = queryDocumentAst.definitions[i];
            if (definition.kind === graphql_1.Kind.OPERATION_DEFINITION) {
                if (!operationName && operation) {
                    throw new Error('Multiple operations present in GraphQL query, you must specify an `operationName` so we know which one to execute.');
                }
                else if (!operationName || (definition.name && definition.name.value === operationName)) {
                    operation = definition;
                }
            }
        }
    }
    // Warning: this is only set if pgForceTransaction is falsy
    const operationType = operation != null ? operation.operation : null;
    const { role: pgRole, localSettings, jwtClaims } = await getSettingsForPgClientTransaction({
        jwtToken,
        jwtSecret,
        jwtPublicKey,
        jwtAudiences,
        jwtRole,
        jwtVerifyOptions,
        pgDefaultRole,
        pgSettings,
    });
    const sqlSettings = [];
    if (localSettings.length > 0) {
        // Later settings should win, so we're going to loop backwards and not
        // add settings for keys we've already seen.
        const seenKeys = [];
        // TODO:perf: looping backwards is slow
        for (let i = localSettings.length - 1; i >= 0; i--) {
            const [key, value] = localSettings[i];
            if (!seenKeys.includes(key)) {
                seenKeys.push(key);
                // Make sure that the third config is always `true` so that we are only
                // ever setting variables on the transaction.
                // Also, we're using `unshift` to undo the reverse-looping we're doing
                sqlSettings.unshift(sql.fragment `set_config(${sql.value(key)}, ${sql.value(value)}, true)`);
            }
        }
    }
    const sqlSettingsQuery = sqlSettings.length > 0 ? sql.compile(sql.query `select ${sql.join(sqlSettings, ', ')}`) : null;
    // If we can avoid transactions, we get greater performance.
    const needTransaction = pgForceTransaction ||
        !!sqlSettingsQuery ||
        (operationType !== 'query' && operationType !== 'subscription');
    // Now we've caught as many errors as we can at this stage, let's create a DB connection.
    const withAuthenticatedPgClient = !needTransaction
        ? simpleWithPgClient(pgPool)
        : async (cb) => {
            // Connect a new Postgres client
            const pgClient = await pgPool.connect();
            // Begin our transaction
            await pgClient.query('begin');
            try {
                // If there is at least one local setting, load it into the database.
                if (sqlSettingsQuery) {
                    await pgClient.query(sqlSettingsQuery);
                }
                // Use the client, wait for it to be finished with, then go to 'finally'
                return await cb(pgClient);
            }
            finally {
                // Cleanup our Postgres client by ending the transaction and releasing
                // the client back to the pool. Always do this even if the query fails.
                try {
                    await pgClient.query('commit');
                }
                finally {
                    pgClient.release();
                }
            }
        };
    if (singleStatement) {
        // TODO:v5: remove this workaround
        /*
         * This is a workaround for subscriptions; the GraphQL context is allocated
         * for the entire duration of the subscription, however hogging a pgClient
         * for more than a few milliseconds (let alone hours!) is a no-no. So we
         * fake a PG client that will set up the transaction each time `query` is
         * called. It's a very thin/dumb wrapper, so it supports nothing but
         * `query`.
         */
        const fakePgClient = {
            query(textOrQueryOptions, values, // tslint:disable-line no-any
            cb) {
                if (!textOrQueryOptions) {
                    throw new Error('Incompatible call to singleStatement - no statement passed?');
                }
                else if (typeof textOrQueryOptions === 'object') {
                    if (values || cb) {
                        throw new Error('Incompatible call to singleStatement - expected no callback');
                    }
                }
                else if (typeof textOrQueryOptions !== 'string') {
                    throw new Error('Incompatible call to singleStatement - bad query');
                }
                else if (values && !Array.isArray(values)) {
                    throw new Error('Incompatible call to singleStatement - bad values');
                }
                else if (cb) {
                    throw new Error('Incompatible call to singleStatement - expected to return promise');
                }
                // Generate an authenticated client on the fly
                return withAuthenticatedPgClient(pgClient => pgClient.query(textOrQueryOptions, values));
            },
        }; // tslint:disable-line no-any
        return callback({
            [pgClientFromContext_1.$$pgClient]: fakePgClient,
            pgRole,
            jwtClaims,
        });
    }
    else {
        return withAuthenticatedPgClient(async (pgClient) => {
            let results = null;
            if (explain) {
                pgClient.startExplain();
            }
            try {
                return await callback({
                    [pgClientFromContext_1.$$pgClient]: pgClient,
                    pgRole,
                    jwtClaims,
                    ...(explain
                        ? {
                            getExplainResults: () => {
                                results = results || pgClient.stopExplain();
                                return results;
                            },
                        }
                        : null),
                });
            }
            finally {
                if (explain) {
                    results = results || pgClient.stopExplain();
                }
            }
        });
    }
};
/**
 * Creates a PostGraphile context object which should be passed into a GraphQL
 * execution. This function will also connect a client from a Postgres pool and
 * setup a transaction in that client.
 *
 * This function is intended to wrap a call to GraphQL-js execution like so:
 *
 * ```js
 * const result = await withPostGraphileContext({
 *   pgPool,
 *   jwtToken,
 *   jwtSecret,
 *   pgDefaultRole,
 * }, async context => {
 *   return await graphql(
 *     schema,
 *     query,
 *     null,
 *     { ...context },
 *     variables,
 *     operationName,
 *   );
 * });
 * ```
 */
const withPostGraphileContext = async (options, callback) => {
    const pluginHook = pluginHook_1.pluginHookFromOptions(options);
    const withContext = pluginHook('withPostGraphileContext', withDefaultPostGraphileContext, {
        options,
    });
    return withContext(options, callback);
};
exports.default = withPostGraphileContext;
/**
 * Sets up the Postgres client transaction by decoding the JSON web token and
 * doing some other cool things.
 */
// THIS METHOD SHOULD NEVER RETURN EARLY. If this method returns early then it
// may skip the super important step of setting the role on the Postgres
// client. If this happens it’s a huge security vulnerability. Never using the
// keyword `return` in this function is a good first step. You can still throw
// errors, however, as this will stop the request execution.
async function getSettingsForPgClientTransaction({ jwtToken, jwtSecret, jwtPublicKey, jwtAudiences, jwtRole, jwtVerifyOptions, pgDefaultRole, pgSettings, }) {
    // Setup our default role. Once we decode our token, the role may change.
    let role = pgDefaultRole;
    let jwtClaims = {};
    // If we were provided a JWT token, let us try to verify it. If verification
    // fails we want to throw an error.
    if (jwtToken) {
        // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
        // as a 403 error because the token is not trustworthy.
        try {
            const jwtVerificationSecret = jwtPublicKey || jwtSecret;
            // If a JWT token was defined, but a secret was not provided to the server or
            // secret had unsupported type, throw a 403 error.
            if (!Buffer.isBuffer(jwtVerificationSecret) &&
                typeof jwtVerificationSecret !== 'string' &&
                typeof jwtVerificationSecret !== 'function') {
                // tslint:disable-next-line no-console
                console.error(`ERROR: '${jwtPublicKey ? 'jwtPublicKey' : 'jwtSecret'}' was not set to a string or buffer - rejecting JWT-authenticated request.`);
                throw new Error('Not allowed to provide a JWT token.');
            }
            if (jwtAudiences != null && jwtVerifyOptions && 'audience' in jwtVerifyOptions)
                throw new Error(`Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both`);
            const claims = await new Promise((resolve, reject) => {
                jwt.verify(jwtToken, jwtVerificationSecret, {
                    ...jwtVerifyOptions,
                    audience: jwtAudiences ||
                        (jwtVerifyOptions && 'audience' in jwtVerifyOptions
                            ? undefinedIfEmpty(jwtVerifyOptions.audience)
                            : ['postgraphile']),
                }, (err, decoded) => {
                    if (err)
                        reject(err);
                    else
                        resolve(decoded);
                });
            });
            if (typeof claims === 'string') {
                throw new Error('Invalid JWT payload');
            }
            // jwt.verify returns `object | string`; but the `object` part is really a map
            jwtClaims = claims;
            const roleClaim = getPath(jwtClaims, jwtRole);
            // If there is a `role` property in the claims, use that instead of our
            // default role.
            if (typeof roleClaim !== 'undefined') {
                if (typeof roleClaim !== 'string')
                    throw new Error(`JWT \`role\` claim must be a string. Instead found '${typeof jwtClaims['role']}'.`);
                role = roleClaim;
            }
        }
        catch (error) {
            // In case this error is thrown in an HTTP context, we want to add status code
            // Note. jwt.verify will add a name key to its errors. (https://github.com/auth0/node-jsonwebtoken#errors--codes)
            error.statusCode =
                'name' in error && error.name === 'TokenExpiredError'
                    ? // The correct status code for an expired ( but otherwise acceptable token is 401 )
                        401
                    : // All other authentication errors should get a 403 status code.
                        403;
            throw error;
        }
    }
    // Instantiate a map of local settings. This map will be transformed into a
    // Sql query.
    const localSettings = [];
    // Set the custom provided settings before jwt claims and role are set
    // this prevents an accidentional overwriting
    if (pgSettings && typeof pgSettings === 'object') {
        for (const key in pgSettings) {
            if (Object.prototype.hasOwnProperty.call(pgSettings, key) &&
                isPgSettingValid(pgSettings[key])) {
                if (key === 'role') {
                    role = String(pgSettings[key]);
                }
                else {
                    localSettings.push([key, String(pgSettings[key])]);
                }
            }
        }
    }
    // If there is a rule, we want to set the root `role` setting locally
    // to be our role. The role may only be null if we have no default role.
    if (typeof role === 'string') {
        localSettings.push(['role', role]);
    }
    // If we have some JWT claims, we want to set those claims as local
    // settings with the namespace `jwt.claims`.
    for (const key in jwtClaims) {
        if (Object.prototype.hasOwnProperty.call(jwtClaims, key)) {
            const rawValue = jwtClaims[key];
            // Unsafe to pass raw object/array to pg.query -> set_config; instead JSONify
            const value = rawValue != null && typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue;
            if (isPgSettingValid(value)) {
                localSettings.push([`jwt.claims.${key}`, String(value)]);
            }
        }
    }
    return {
        localSettings,
        role,
        jwtClaims: jwtToken ? jwtClaims : null,
    };
}
const $$pgClientOrigQuery = Symbol();
/**
 * Monkey-patches the `query` method of a pg Client to add debugging
 * functionality. Use with care.
 */
function debugPgClient(pgClient, allowExplain = false) {
    // If Postgres debugging is enabled, enhance our query function by adding
    // a debug statement.
    if (!pgClient[$$pgClientOrigQuery]) {
        // Set the original query method to a key on our client. If that key is
        // already set, use that.
        pgClient[$$pgClientOrigQuery] = pgClient.query;
        pgClient.startExplain = () => {
            pgClient._explainResults = [];
        };
        pgClient.stopExplain = async () => {
            const results = pgClient._explainResults;
            pgClient._explainResults = null;
            if (!results) {
                return Promise.resolve([]);
            }
            return (await Promise.all(results.map(async (r) => {
                const { result: resultPromise, ...rest } = r;
                const result = await resultPromise;
                const firstKey = result && result[0] && Object.keys(result[0])[0];
                if (!firstKey) {
                    return null;
                }
                const plan = result.map((r) => r[firstKey]).join('\n');
                return {
                    ...rest,
                    plan,
                };
            }))).filter((entry) => !!entry);
        };
        if (debugPgNotice.enabled) {
            pgClient.on('notice', (msg) => {
                debugPgErrorObject(debugPgNotice, msg);
            });
        }
        const logError = (error) => {
            if (error.name && error['severity']) {
                debugPgErrorObject(debugPgError, error);
            }
            else {
                debugPgError('%O', error);
            }
        };
        if (debugPg.enabled || debugPgNotice.enabled || allowExplain) {
            // tslint:disable-next-line only-arrow-functions
            pgClient.query = function (...args) {
                const [a, b, c] = args;
                // If we understand it (and it uses the promises API)
                if ((typeof a === 'string' && !c && (!b || Array.isArray(b))) ||
                    (typeof a === 'object' && !b && !c)) {
                    if (debugPg.enabled) {
                        // Debug just the query text. We don’t want to debug variables because
                        // there may be passwords in there.
                        debugPg('%s', postgraphile_core_1.formatSQLForDebugging(a && a.text ? a.text : a));
                    }
                    if (pgClient._explainResults) {
                        const query = a && a.text ? a.text : a;
                        const values = a && a.text ? a.values : b;
                        if (query.match(/^\s*(select|insert|update|delete|with)\s/i) && !query.includes(';')) {
                            // Explain it
                            const explain = `explain ${query}`;
                            pgClient._explainResults.push({
                                query,
                                result: pgClient[$$pgClientOrigQuery]
                                    .call(this, explain, values)
                                    .then((data) => data.rows),
                            });
                        }
                    }
                    const promiseResult = pgClient[$$pgClientOrigQuery].apply(this, args);
                    if (debugPgError.enabled) {
                        // Report the error with our Postgres debugger.
                        promiseResult.catch(logError);
                    }
                    return promiseResult;
                }
                else {
                    // We don't understand it (e.g. `pgPool.query`), just let it happen.
                    return pgClient[$$pgClientOrigQuery].apply(this, args);
                }
            };
        }
    }
    return pgClient;
}
exports.debugPgClient = debugPgClient;
/**
 * Safely gets the value at `path` (array of keys) of `inObject`.
 *
 * @private
 */
function getPath(inObject, path) {
    let object = inObject;
    // From https://github.com/lodash/lodash/blob/master/.internal/baseGet.js
    let index = 0;
    const length = path.length;
    while (object && index < length) {
        object = object[path[index++]];
    }
    return index && index === length ? object : undefined;
}
/**
 * Check if a pgSetting is a string or a number.
 * Null and Undefined settings are not valid and will be ignored.
 * pgSettings of other types throw an error.
 *
 * @private
 */
function isPgSettingValid(pgSetting) {
    if (pgSetting === undefined || pgSetting === null) {
        return false;
    }
    const typeOfPgSetting = typeof pgSetting;
    if (typeOfPgSetting === 'string' ||
        typeOfPgSetting === 'number' ||
        typeOfPgSetting === 'boolean') {
        return true;
    }
    // TODO: booleans!
    throw new Error(`Error converting pgSetting: ${typeof pgSetting} needs to be of type string, number or boolean.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFBvc3RHcmFwaGlsZUNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGdyYXBoaWxlL3dpdGhQb3N0R3JhcGhpbGVDb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF5QztBQUN6QyxvQ0FBcUM7QUFFckMscUNBQXlFO0FBQ3pFLCtCQUErQjtBQUMvQixtRkFBdUU7QUFDdkUsNkNBQXFEO0FBRXJELHlEQUEwRDtBQUUxRCxNQUFNLGdCQUFnQixHQUFHLENBQ3ZCLENBQTRDLEVBQ1UsRUFBRSxDQUN4RCxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQVl2RCxNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN4RCxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNuRSxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUVyRTs7R0FFRztBQUNILFNBQVMsa0JBQWtCLENBQUMsT0FBaUMsRUFBRSxNQUFnQjtJQUM3RSxPQUFPLENBQ0wsY0FBYyxFQUNkLE1BQU0sQ0FBQyxRQUFRLElBQUksT0FBTyxFQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUNyQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sRUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxNQUFN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