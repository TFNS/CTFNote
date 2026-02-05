import dotenv from "dotenv";
dotenv.config();

type DeepReadOnly<T> = {
  readonly [k in keyof T]: T[k] extends Record<string, unknown>
    ? DeepReadOnly<T[k]>
    : T[k];
};

export enum DiscordChannelHandleStyle {
  Agile = "agile",
}

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
    migrateOnly: boolean;
  };
  pad: {
    createUrl: string;
    showUrl: string;
    documentMaxLength: number;
    domain: string;
    useSSL: string;
  };

  web: {
    port: number;
  };
  discord: {
    use: string;
    token: string;
    serverId: string;
    voiceChannels: number;
    botName: string;
    maxChannelsPerCategory: number;
    registrationEnabled: string;
    registrationAccountRole: string;
    registrationRoleId: string;
    channelHandleStyle: DiscordChannelHandleStyle;
  };
  oauth2: {
    enabled: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    usernameAttr: string;
    roleAttr: string;
    roleMapping: string;
    discoveryUrl: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userinfoEndpoint: string;
    tokenEndpointAuthMethod: string;
    issuer: string;
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
    migrateOnly: !!process.env["DB_MIGRATE_ONLY"],
  },
  pad: {
    createUrl: getEnv("PAD_CREATE_URL"),
    showUrl: getEnv("PAD_SHOW_URL"),
    documentMaxLength: Number(getEnv("CMD_DOCUMENT_MAX_LENGTH", "100000")),
    domain: getEnv("CMD_DOMAIN", ""),
    useSSL: getEnv("CMD_PROTOCOL_USESSL", "false"),
  },
  web: {
    port: getEnvInt("WEB_PORT"),
  },
  discord: {
    use: getEnv("USE_DISCORD", "false"),
    token: getEnv("DISCORD_BOT_TOKEN"),
    serverId: getEnv("DISCORD_SERVER_ID"),
    voiceChannels: getEnvInt("DISCORD_VOICE_CHANNELS"),
    botName: getEnv("DISCORD_BOT_NAME", "CTFNote"),
    maxChannelsPerCategory: 50, //! 50 is the hard Discord limit
    registrationEnabled: getEnv("DISCORD_REGISTRATION_ENABLED", "false"),
    registrationAccountRole: getEnv(
      "DISCORD_REGISTRATION_CTFNOTE_ROLE",
      "user_guest"
    ),
    registrationRoleId: getEnv("DISCORD_REGISTRATION_ROLE_ID", ""),
    channelHandleStyle: getEnv(
      "DISCORD_CHANNEL_HANDLE_STYLE",
      "agile"
    ) as DiscordChannelHandleStyle,
  },
  oauth2: {
    enabled: getEnv("OAUTH2_ENABLED", "false"),
    clientId: getEnv("OAUTH2_CLIENT_ID", ""),
    clientSecret: getEnv("OAUTH2_CLIENT_SECRET", ""),
    scope: getEnv("OAUTH2_SCOPE", ""),
    usernameAttr: getEnv("OAUTH2_USERNAME_ATTR", ""),
    roleAttr: getEnv("OAUTH2_ROLE_ATTR", ""),
    roleMapping: getEnv("OAUTH2_ROLE_MAPPING", ""),
    discoveryUrl: getEnv("OAUTH2_DISCOVERY_URL", ""),
    authorizationEndpoint: getEnv("OAUTH2_AUTHORIZATION_ENDPOINT", ""),
    tokenEndpoint: getEnv("OAUTH2_TOKEN_ENDPOINT", ""),
    userinfoEndpoint: getEnv("OAUTH2_USERINFO_ENDPOINT", ""),
    tokenEndpointAuthMethod: getEnv(
      "OAUTH2_TOKEN_ENDPOINT_AUTH_METHOD",
      "client_secret_basic"
    ),
    issuer: getEnv("OAUTH2_ISSUER", ""),
  },
};

export default config;
