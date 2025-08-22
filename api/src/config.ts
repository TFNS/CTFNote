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
  ldap: {
    enabled: boolean;
    url: string;
    bindDN: string;
    bindPassword: string;
    searchBase: string;
    searchFilter: string;
    usernameAttribute: string;
    emailAttribute: string;
    groupAttribute: string;
    adminGroups: string[];
    managerGroups: string[];
    userGroups: string[];
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
  ldap: {
    enabled: getEnv("LDAP_ENABLED", "false") === "true",
    url: getEnv("LDAP_URL", "ldap://ldap.forumsys.com:389"),
    bindDN: getEnv("LDAP_BIND_DN", "cn=read-only-admin,dc=example,dc=com"),
    bindPassword: getEnv("LDAP_BIND_PASSWORD", "password"),
    searchBase: getEnv("LDAP_SEARCH_BASE", "dc=example,dc=com"),
    searchFilter: getEnv("LDAP_SEARCH_FILTER", "(uid={{username}})"),
    usernameAttribute: getEnv("LDAP_USERNAME_ATTRIBUTE", "uid"),
    emailAttribute: getEnv("LDAP_EMAIL_ATTRIBUTE", "mail"),
    groupAttribute: getEnv("LDAP_GROUP_ATTRIBUTE", "memberOf"),
    adminGroups: getEnv("LDAP_ADMIN_GROUPS", "").split(",").filter(g => g.trim()),
    managerGroups: getEnv("LDAP_MANAGER_GROUPS", "").split(",").filter(g => g.trim()),
    userGroups: getEnv("LDAP_USER_GROUPS", "").split(",").filter(g => g.trim()),
  },
};

export default config;
