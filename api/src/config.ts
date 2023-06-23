import dotenv from "dotenv";
dotenv.config();

type DeepReadOnly<T> = {
  readonly [k in keyof T]: T[k] extends Record<string, unknown>
    ? DeepReadOnly<T[k]>
    : T[k];
};

export type CTFNoteConfig = DeepReadOnly<{
  env: string;
  sessionSecret: string;
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
    documentMaxLength: number;
  };

  web: {
    port: number;
  };
  discord: {
    use: string;
    token: string;
    serverId: string;
    voiceChannels: number;
  };
}>;

function getEnv(
  name: string,
  defaultValue: string | undefined = undefined
): string {
  const v = process.env[name];
  if (!v && defaultValue !== undefined) return defaultValue;
  if (!v) throw Error(`Missing env variable ${name}`);
  return v;
}

function getEnvInt(name: string): number {
  return parseInt(getEnv(name));
}

const config: CTFNoteConfig = {
  env: getEnv("NODE_ENV"),
  sessionSecret: getEnv("SESSION_SECRET", ""),
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
    documentMaxLength: Number(getEnv("CMD_DOCUMENT_MAX_LENGTH", "100000")),
  },
  web: {
    port: getEnvInt("WEB_PORT"),
  },
  discord: {
    use: getEnv("USE_DISCORD", "false"),
    token: getEnv("DISCORD_BOT_TOKEN"),
    serverId: getEnv("DISCORD_SERVER_ID"),
    voiceChannels: getEnvInt("DISCORD_VOICE_CHANNELS"),
  },
};

export default config;
