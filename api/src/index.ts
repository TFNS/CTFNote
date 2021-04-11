import dotenv from "dotenv"
import express from "express"
import crypto from "crypto"
import { postgraphile } from "postgraphile"
import simplifyPlugin from "@graphile-contrib/pg-simplify-inflector"
import importCtfPlugin from "./plugins/importCtf"
import createTasKPlugin from "./plugins/createTask"

dotenv.config()

const app = express();


const postgraphileOptions = {
    subscriptions: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    ownerConnectionString: process.env.DATABASE_URL || "postgres://ctfnote:ctfnote@localhost:5432/ctfnote",
    ignoreIndexes: false,
    pgDefaultRole: "user_guest",
    jwtPgTypeIdentifier: "ctfnote.jwt",
    jwtSecret: crypto.randomBytes(32).toString("hex"),
    showErrorStack: "json" as const,
    extendedErrors: ["hint", "detail", "errcode"],
    appendPlugins: [
        simplifyPlugin,
        importCtfPlugin,
        createTasKPlugin,
        // require("./plugins/settings.js")
    ],
    exportGqlSchemaPath: "schema.graphql",
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain: true,
    enableQueryBatching: true,
    legacyRelations: "omit" as const,
};

app.use(
    postgraphile(
        "postgres://user_postgraphile:secret_password@localhost:5432/ctfnote",
        "ctfnote",
        postgraphileOptions
    )
);



app.listen(3000);
