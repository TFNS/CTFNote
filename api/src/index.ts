import dotenv from "dotenv";
import express from "express";
import crypto from "crypto";
import {
  postgraphile,
  PostGraphileOptions,
  makePluginHook,
} from "postgraphile";
import simplifyPlugin from "@graphile-contrib/pg-simplify-inflector";
import PgPubsub from "@graphile/pg-pubsub";
import importCtfPlugin from "./plugins/importCtf";
import createTasKPlugin from "./plugins/createTask";

dotenv.config();

const app = express();
const pluginHook = makePluginHook([PgPubsub]);

const postgraphileOptions: PostGraphileOptions = {
  pluginHook,
  subscriptions: true,
  dynamicJson: true,
  simpleSubscriptions: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  disableQueryLog: true,
  ignoreIndexes: false,
  subscriptionAuthorizationFunction: "ctfnote_private.validate_subscription",
  pgDefaultRole: "user_guest",
  jwtPgTypeIdentifier: "ctfnote.jwt",
  jwtSecret: crypto.randomBytes(32).toString("hex"),
  appendPlugins: [
    simplifyPlugin,
    importCtfPlugin,
    createTasKPlugin,
    // require("./plugins/settings.js")
  ],
  enableQueryBatching: true,
  legacyRelations: "omit" as const,
};

if (process.env.NODE_ENV == "development") {
  postgraphileOptions.watchPg = true;
  postgraphileOptions.disableQueryLog = false;
  postgraphileOptions.graphiql = true;
  postgraphileOptions.exportGqlSchemaPath = "schema.graphql";
  postgraphileOptions.retryOnInitFail = true;
  postgraphileOptions.enhanceGraphiql = true;
  postgraphileOptions.allowExplain = true;
  postgraphileOptions.jwtSecret = "DEV";
  postgraphileOptions.showErrorStack = "json" as const;
  postgraphileOptions.extendedErrors = ["hint", "detail", "errcode"];
  postgraphileOptions.ownerConnectionString =
    "postgres://ctfnote:ctfnote@localhost:5432/ctfnote";
}

app.use(
  postgraphile(
    process.env.DATABASE_URL ||
      "postgres://user_postgraphile:secret_password@db:5432/ctfnote",
    "ctfnote",
    postgraphileOptions
  )
);

app.listen(3000, () => {
	console.log("Listening on :3000");
});
