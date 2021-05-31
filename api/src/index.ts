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
import hedgedocAuth from "./plugins/hedgedocAuth";
import { settingsPlugin, settingsHook } from "./plugins/settings";

dotenv.config();

const app = express();

const pluginHook = makePluginHook([PgPubsub, settingsHook]);

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
  jwtPgTypeIdentifier: "ctfnote.jwt",
  pgDefaultRole: "user_guest",
  jwtSecret: crypto.randomBytes(32).toString("hex"),
  appendPlugins: [
    simplifyPlugin,
    importCtfPlugin,
    createTasKPlugin,
    settingsPlugin,
    hedgedocAuth
  ],
  enableQueryBatching: true,
  legacyRelations: "omit" as const,
  async additionalGraphQLContextFromRequest(req, res) {
    return {
      setHeader: (name: string, value: string | number) => res.setHeader(name, value)
    };
  },
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
