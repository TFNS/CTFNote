const baseSrcDir = process.env.NODE_ENV === "prod" ? "/usr/src/app/dist" : "src";
const ext = process.env.NODE_ENV === "prod" ? "js" : "ts";

const url = process.env.DB_URL || "postgres://ctfnote:ctfnote@127.0.0.1/ctfnote";

const config = {
  type: "postgres",
  url,
  synchronize: true,
  logging: false,
  entities: [`${baseSrcDir}/entity/**/*.${ext}`],
  migrations: [`${baseSrcDir}/migration/**/*.${ext}`],
  subscribers: [`${baseSrcDir}/subscriber/**/*.${ext}`],
  cli: {
    entitiesDir: `${baseSrcDir}/entity`,
    migrationsDir: `${baseSrcDir}/migration`,
    subscribersDir: `${baseSrcDir}/subscriber`,
  },
};

module.exports = config;
