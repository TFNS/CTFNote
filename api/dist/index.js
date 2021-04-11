"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var postgraphile_1 = require("postgraphile");
var pg_simplify_inflector_1 = __importDefault(require("@graphile-contrib/pg-simplify-inflector"));
var importCtf_1 = __importDefault(require("./plugins/importCtf"));
var createTask_1 = __importDefault(require("./plugins/createTask"));
dotenv_1.default.config();
var app = express_1.default();
var postgraphileOptions = {
    subscriptions: true,
    watchPg: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    ownerConnectionString: 'postgres://ctfnote:ctfnote@localhost:5432/ctfnote',
    ignoreIndexes: false,
    pgDefaultRole: "user_guest",
    jwtPgTypeIdentifier: "ctfnote.jwt",
    jwtSecret: "secret_for_jwts",
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    appendPlugins: [
        pg_simplify_inflector_1.default,
        importCtf_1.default,
        createTask_1.default,
        // require("./plugins/settings.js")
    ],
    exportGqlSchemaPath: "schema.graphql",
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain: true,
    enableQueryBatching: true,
    legacyRelations: "omit",
};
app.use(postgraphile_1.postgraphile(process.env.DATABASE_URL || "postgres://user_postgraphile:secret_password@localhost:5432/ctfnote", "ctfnote", postgraphileOptions));
app.listen(process.env.PORT || 3000);
