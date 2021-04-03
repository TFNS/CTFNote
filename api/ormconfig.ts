import { ConnectionOptions } from "typeorm";
import path from "path";

const baseSrcDir = process.env.NODE_ENV === "prod" ? "/usr/src/app/dist" : "src";
const ext = process.env.NODE_ENV === "prod" ? "js" : "ts";

const url = process.env.DB_URL || "postgres://ctfnote:ctfnote@127.0.0.1/ctfnote";

const entitiesDir = path.join(baseSrcDir, "entity", `*.${ext}`);
const migrationsDir = path.join(baseSrcDir, "migration", `*.${ext}`);
const subscribersDir = path.join(baseSrcDir, "subscriber", `*.${ext}`);

const config: ConnectionOptions = {
  type: "postgres",
  url,
  synchronize: false,
  logging: false,
  entities: [entitiesDir],
  migrations: [migrationsDir],
  subscribers: [subscribersDir],
  migrationsRun: true,
  cli: {
    entitiesDir: `${baseSrcDir}/entity`,
    migrationsDir: `${baseSrcDir}/migration`,
    subscribersDir: `${baseSrcDir}/subscriber`,
  },
};

export default config;
