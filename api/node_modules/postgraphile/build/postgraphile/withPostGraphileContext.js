"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugPgClient = void 0;
const tslib_1 = require("tslib");
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
                return await callback(Object.assign({ [pgClientFromContext_1.$$pgClient]: pgClient, pgRole,
                    jwtClaims }, (explain
                    ? {
                        getExplainResults: () => {
                            results = results || pgClient.stopExplain();
                            return results;
                        },
                    }
                    : null)));
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
                jwt.verify(jwtToken, jwtVerificationSecret, Object.assign(Object.assign({}, jwtVerifyOptions), { audience: jwtAudiences ||
                        (jwtVerifyOptions && 'audience' in jwtVerifyOptions
                            ? undefinedIfEmpty(jwtVerifyOptions.audience)
                            : ['postgraphile']) }), (err, decoded) => {
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
                const { result: resultPromise } = r, rest = tslib_1.__rest(r, ["result"]);
                const result = await resultPromise;
                const firstKey = result && result[0] && Object.keys(result[0])[0];
                if (!firstKey) {
                    return null;
                }
                const plan = result.map((r) => r[firstKey]).join('\n');
                return Object.assign(Object.assign({}, rest), { plan });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFBvc3RHcmFwaGlsZUNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGdyYXBoaWxlL3dpdGhQb3N0R3JhcGhpbGVDb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSx3Q0FBeUM7QUFDekMsb0NBQXFDO0FBRXJDLHFDQUF5RTtBQUN6RSwrQkFBK0I7QUFDL0IsbUZBQXVFO0FBQ3ZFLDZDQUFxRDtBQUVyRCx5REFBMEQ7QUFFMUQsTUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixDQUE0QyxFQUNVLEVBQUUsQ0FDeEQsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFZdkQsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDeEQsTUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDbkUsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFFckU7O0dBRUc7QUFDSCxTQUFTLGtCQUFrQixDQUFDLE9BQWlDLEVBQUUsTUFBZ0I7SUFDN0UsT0FBTyxDQUNMLGNBQWMsRUFDZCxNQUFNLENBQUMsUUFBUSxJQUFJLE9BQU8sRUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFDckMsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLEVBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksTUFB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