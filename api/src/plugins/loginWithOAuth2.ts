import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { connectToDatabase } from "../utils/database";
import savepointWrapper from "./savepointWrapper";
import config from "../config";
import { determineRoleByMapping } from "../utils/role";
import { AllowedRoles } from "../utils/role";

// relevant excerpt from .well-known/openid-configuration
type DiscoveryJson = {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  issuer: string;
};

export type OAuth2Metadata = {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint: string;
  issuer: string;
};

let oauth2Metadata: OAuth2Metadata = {
  authorizationEndpoint: config.oauth2.authorizationEndpoint,
  tokenEndpoint: config.oauth2.tokenEndpoint,
  userinfoEndpoint: config.oauth2.userinfoEndpoint,
  issuer: config.oauth2.issuer,
};

export async function checkOAuth2Enabled() {
  let enabled = config.oauth2.enabled === "true";
  const errors: string[] = [];

  if (enabled) {
    if (!config.oauth2.clientId) {
      errors.push("clientId is missing");
    }
    if (!config.oauth2.scope) {
      errors.push("scopes is missing");
    }
    if (!config.oauth2.usernameAttr) {
      errors.push("usernameAttr is missing");
    }
    if (!config.oauth2.roleAttr) {
      errors.push("roleAttr is missing");
    }
    if (!config.oauth2.roleMapping) {
      errors.push("roleMapping is missing");
    }
    if (config.oauth2.discoveryUrl) {
      try {
        const discoverResponse = await fetch(config.oauth2.discoveryUrl);
        const discoveryJson: DiscoveryJson = await discoverResponse.json();
        oauth2Metadata = {
          authorizationEndpoint:
            config.oauth2.authorizationEndpoint ||
            discoveryJson.authorization_endpoint,
          tokenEndpoint:
            config.oauth2.tokenEndpoint || discoveryJson.token_endpoint,
          userinfoEndpoint:
            config.oauth2.userinfoEndpoint || discoveryJson.userinfo_endpoint,
          issuer: discoveryJson.issuer || config.oauth2.issuer,
        };
      } catch (error) {
        console.error(`Failed to fetch ${config.oauth2.discoveryUrl}:`, error);
      }
    }
    if (!oauth2Metadata.authorizationEndpoint) {
      errors.push("authorizationEndpoint is missing");
    }
    if (!oauth2Metadata.tokenEndpoint) {
      errors.push("tokenEndpoint is missing");
    }
    if (!oauth2Metadata.userinfoEndpoint) {
      errors.push("userinfoEndpoint is missing");
    }
    if (!oauth2Metadata.issuer) {
      errors.push("issuer is missing");
    }

    if (errors.length) {
      enabled = false;
      console.error("Disabling OAuth2 due to configuration errors:");
      for (const message of errors) {
        console.error(`  - ${message}`);
      }
    }
  }

  const pgClient = await connectToDatabase();
  try {
    const query = "UPDATE ctfnote.settings SET oauth2_enabled = $1";
    await pgClient.query(query, [enabled]);
  } catch (error) {
    console.error("Failed to set oauth2_enabled flag in the database:", error);
  } finally {
    pgClient.release();
  }

  return enabled;
}

export const loginWithOAuth2Plugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      input LoginWithOAuth2Input {
        callbackUrl: String!
        pkceCodeVerifier: String
        expectedState: String
      }

      type LoginWithOAuth2Payload {
        jwt: Jwt
        login: String
      }

      type OAuth2Settings {
        clientId: String!
        scope: String!
        issuer: String!
        authorizationEndpoint: String!
      }

      extend type Query {
        oauth2Settings: OAuth2Settings
      }

      extend type Mutation {
        loginWithOAuth2(input: LoginWithOAuth2Input): LoginWithOAuth2Payload
      }
    `,
    resolvers: {
      Query: {
        oauth2Settings: () => {
          return {
            clientId: config.oauth2.clientId,
            scope: config.oauth2.scope,
            issuer: oauth2Metadata.issuer,
            authorizationEndpoint: oauth2Metadata.authorizationEndpoint,
          };
        },
      },
      Mutation: {
        loginWithOAuth2: async (
          _query,
          { input: { callbackUrl, expectedState, pkceCodeVerifier } },
          { pgClient }
        ) => {
          if (!config.oauth2.enabled) {
            throw new Error("OAuth 2.0 login is not enabled");
          }

          const oauth2 = await import("openid-client");

          let clientAuth;
          switch (config.oauth2.tokenEndpointAuthMethod) {
            case "client_secret_post":
              clientAuth = oauth2.ClientSecretPost(config.oauth2.clientSecret);
              break;
            case "client_secret_jwt":
              clientAuth = oauth2.ClientSecretJwt(config.oauth2.clientSecret);
              break;
            case "client_secret_basic":
              clientAuth = oauth2.ClientSecretBasic(config.oauth2.clientSecret);
              break;
            case "none":
              clientAuth = undefined;
              break;
          }

          const oauth2Config = new oauth2.Configuration(
            {
              issuer: oauth2Metadata.issuer,
              token_endpoint: oauth2Metadata.tokenEndpoint,
            },
            config.oauth2.clientId,
            undefined,
            clientAuth
          );

          const tokenResponse = await oauth2.authorizationCodeGrant(
            oauth2Config,
            new URL(callbackUrl),
            {
              pkceCodeVerifier: pkceCodeVerifier,
              expectedState: expectedState,
            }
          );

          const profileResponse = await oauth2.fetchProtectedResource(
            oauth2Config,
            tokenResponse.access_token,
            new URL(oauth2Metadata.userinfoEndpoint),
            "GET"
          );

          const profile = await profileResponse.json();
          const login = profile[config.oauth2.usernameAttr];
          if (!login) {
            throw new Error("Login is missing in profile");
          }
          const roleAttr = profile[config.oauth2.roleAttr];
          if (!roleAttr) {
            throw new Error("Role is missing in profile");
          }
          const roleMapping: Record<string, AllowedRoles | undefined> =
            JSON.parse(config.oauth2.roleMapping);
          const role = determineRoleByMapping(roleAttr, roleMapping);
          if (!role) {
            throw new Error("Access denied");
          }

          return await savepointWrapper(pgClient, async () => {
            const {
              rows: [jwt],
            } = await pgClient.query(
              `SELECT * FROM ctfnote_private.login_with_extern($1, $2)`,
              [login, role]
            );
            return { jwt, login };
          });
        },
      },
    },
  };
});
