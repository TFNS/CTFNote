import dotenv from "dotenv";
dotenv.config();

type DeepReadOnly<T> = {
  readonly [k in keyof T]: T[k] extends Record<string, unknown>
    ? DeepReadOnly<T[k]>
    : T[k];
};

export type CTFNoteConfig = DeepReadOnly<{
  env: string;
  db: {
    database: string;
    admin: {
      login: string;
      password: string;
    };
    user: {
      login: string;
      password: string;
    };
    host: string;
    port: number;
  };
  pad: {
    createUrl: string;
    showUrl: string;
  };

  web: {
    port: number;
  };
  discord: {
    token: string;
    serverId: string;
    voiceChannels: number;
  };
}>;

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw Error(`Missing env variable ${name}`);
  return v;
}

function getEnvInt(name: string): number {
  return parseInt(getEnv(name));
}

const config: CTFNoteConfig = {
  env: getEnv("NODE_ENV"),
  db: {
    database: getEnv("DB_DATABASE"),
    user: {
      login: getEnv("DB_USER_LOGIN"),
      password: getEnv("DB_USER_PASSWORD"),
    },
    admin: {
      login: getEnv("DB_ADMIN_LOGIN"),
      password: getEnv("DB_ADMIN_PASSWORD"),
    },
    host: getEnv("DB_HOST"),
    port: getEnvInt("DB_PORT"),
  },
  pad: {
    createUrl: getEnv("PAD_CREATE_URL"),
    showUrl: getEnv("PAD_SHOW_URL"),
  },
  web: {
    port: getEnvInt("WEB_PORT"),
  },
  discord: {
    token: getEnv("DISCORD_BOT_TOKEN"),
    serverId: getEnv("DISCORD_SERVER_ID"),
    voiceChannels: getEnvInt("DISCORD_VOICE_CHANNELS"),
  },
};

export default config;
