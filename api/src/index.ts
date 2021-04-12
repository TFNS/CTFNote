import dotenv from "dotenv"
import express from "express"
import crypto from "crypto"
import { postgraphile, PostGraphileOptions, makePluginHook } from "postgraphile"
import simplifyPlugin from "@graphile-contrib/pg-simplify-inflector"
import PgPubsub from "@graphile/pg-pubsub"
import importCtfPlugin from "./plugins/importCtf"
import createTasKPlugin from "./plugins/createTask"

dotenv.config()

const app = express();
const pluginHook = makePluginHook([PgPubsub]);

const postgraphileOptions: PostGraphileOptions = {
    pluginHook,
    subscriptions: true,
    dynamicJson: true,
    simpleSubscriptions: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    ownerConnectionString: process.env.DATABASE_URL || "postgres://ctfnote:ctfnote@localhost:5432/ctfnote",
    ignoreIndexes: false,
    pgDefaultRole: "user_guest",
    jwtPgTypeIdentifier: "ctfnote.jwt",
    jwtSecret: crypto.randomBytes(32).toString("hex"),
    extendedErrors: ["hint", "detail", "errcode"],
    appendPlugins: [
        simplifyPlugin,
        importCtfPlugin,
        createTasKPlugin,
        // require("./plugins/settings.js")
    ],
    exportGqlSchemaPath: "schema.graphql",
    enableQueryBatching: true,
    legacyRelations: "omit" as const,
};

if (process.env.NODE_ENV == "development"){
    postgraphileOptions.watchPg = true
    postgraphileOptions.graphiql = true
    postgraphileOptions.enhanceGraphiql = true
    postgraphileOptions.allowExplain = true
    postgraphileOptions.jwtSecret = "DEV"
    postgraphileOptions.showErrorStack = "json" as const
    postgraphileOptions.extendedErrors = ["hint", "detail", "errcode"]
}

app.use(
    postgraphile(
        "postgres://user_postgraphile:secret_password@localhost:5432/ctfnote",
        "ctfnote",
        postgraphileOptions
    )
);



app.listen(3000);
