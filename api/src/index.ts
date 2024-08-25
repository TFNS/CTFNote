import simplifyPlugin from "@graphile-contrib/pg-simplify-inflector";
import PgPubsub from "@graphile/pg-pubsub";
import crypto from "crypto";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload-ts";
import {
  makePluginHook,
  postgraphile,
  PostGraphileOptions,
} from "postgraphile";
import { migrate, MigrateDBConfig } from "postgres-migrations";
import config from "./config";
import createTasKPlugin from "./plugins/createTask";
import importCtfPlugin from "./plugins/importCtf";
import uploadLogoPlugin from "./plugins/uploadLogo";
import uploadScalar from "./plugins/uploadScalar";
import { Pool } from "pg";
import { icalRoute } from "./routes/ical";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import OperationHook from "@graphile/operation-hooks";
import discordHooks from "./plugins/discordHooks";
import { getDiscordClient } from "./discord";
import PgManyToManyPlugin from "@graphile-contrib/pg-many-to-many";
import ProfileSubscriptionPlugin from "./plugins/ProfileSubscriptionPlugin";
import { connectToDatabase } from "./discord/database/database";

function getDbUrl(role: "user" | "admin") {
  const login = config.db[role].login;
  const password = config.db[role].password;
  return `postgres://${login}:${password}@${config.db.host}:${config.db.port}/${config.db.database}`;
}

function createOptions() {
  let secret: string;
  if (config.sessionSecret.length < 64 && config.env !== "development") {
    console.info(
      "Using random session secret since SESSION_SECRET is too short. All users will be logged out."
    );
    secret = crypto.randomBytes(32).toString("hex");
  } else {
    secret = config.sessionSecret;
  }

  const postgraphileOptions: PostGraphileOptions = {
    pluginHook: makePluginHook([PgPubsub, OperationHook]),
    subscriptions: true,
    dynamicJson: true,
    simpleSubscriptions: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    disableQueryLog: true,
    ignoreIndexes: false,
    subscriptionAuthorizationFunction: "ctfnote_private.validate_subscription",
    jwtPgTypeIdentifier: "ctfnote.jwt",
    pgDefaultRole: "user_anonymous",
    jwtSecret: secret,
    appendPlugins: [
      simplifyPlugin,
      uploadScalar,
      importCtfPlugin,
      uploadLogoPlugin,
      createTasKPlugin,
      ConnectionFilterPlugin,
      discordHooks,
      PgManyToManyPlugin,
      ProfileSubscriptionPlugin,
    ],
    ownerConnectionString: getDbUrl("admin"),
    enableQueryBatching: true,
    legacyRelations: "omit" as const,
  };

  if (config.env == "development") {
    postgraphileOptions.watchPg = true;
    postgraphileOptions.disableQueryLog = false;
    postgraphileOptions.graphiql = true;
    postgraphileOptions.exportGqlSchemaPath = "schema.graphql";
    postgraphileOptions.retryOnInitFail = true;
    postgraphileOptions.enhanceGraphiql = true;
    postgraphileOptions.allowExplain = true;
    postgraphileOptions.jwtSecret = "DEV";
    postgraphileOptions.showErrorStack = "json" as const;
    postgraphileOptions.extendedErrors = [
      "severity",
      "code",
      "detail",
      "hint",
      "position",
      "internalPosition",
      "internalQuery",
      "where",
      "schema",
      "table",
      "column",
      "dataType",
      "constraint",
      "file",
      "line",
      "routine",
    ];

    postgraphileOptions.graphileBuildOptions = {
      connectionFilterAllowedOperators: ["includesInsensitive"],
      connectionFilterAllowedFieldTypes: ["String"],
      connectionFilterComputedColumns: false,
      connectionFilterSetofFunctions: false,
      connectionFilterArrays: false,
    };
  }
  return postgraphileOptions;
}

function createApp(postgraphileOptions: PostGraphileOptions) {
  const pool = new Pool({
    connectionString: getDbUrl("user"),
  });

  const app = express();
  app.use(graphqlUploadExpress());
  app.use(
    "/uploads",
    express.static("uploads", {
      setHeaders: function (res) {
        res.set("Content-Disposition", "attachment");
      },
    })
  );
  app.use(postgraphile(pool, "ctfnote", postgraphileOptions));
  app.use("/calendar.ics", icalRoute(pool));
  return app;
}

async function performMigrations() {
  const dbConfig: MigrateDBConfig = {
    database: config.db.database,
    user: config.db.admin.login,
    password: config.db.admin.password,
    host: config.db.host,
    port: config.db.port,
    ensureDatabaseExists: true,
    defaultDatabase: "postgres",
  };

  await migrate(dbConfig, "./migrations");
}

async function main() {
  await performMigrations();
  if (config.db.migrateOnly) {
    console.log("Migrations done. Exiting.");
    return;
  }
  const postgraphileOptions = createOptions();
  const app = createApp(postgraphileOptions);

  getDiscordClient();

  const pgClient = await connectToDatabase(); //? maybe we should not keep this dependency in the discord folder?

  try {
    const query =
      "UPDATE ctfnote.settings SET discord_integration_enabled = $1";
    const values = [config.discord.use.toLowerCase() !== "false"];
    await pgClient.query(query, values);
  } catch (error) {
    console.error(
      "Failed to set discord_integration_enabled flag in the database:",
      error
    );
  } finally {
    pgClient.release();
  }

  app.listen(config.web.port, () => {
    //sendMessageToDiscord("CTFNote API started");
    console.log(`Listening on :${config.web.port}`);
  });
}

main();
