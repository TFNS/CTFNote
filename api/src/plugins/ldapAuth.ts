import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import * as ldapAuthentication from "ldap-authentication";
import * as jwt from "jsonwebtoken";
import config from "../config";
import { Context } from "./uploadLogo";

interface LdapUserInfo {
  uid: string;
  cn: string;
  mail?: string;
  memberOf?: string[];
}

// Rate limiting for LDAP authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function checkRateLimit(username: string): boolean {
  const now = Date.now();
  const userAttempts = authAttempts.get(username);

  if (!userAttempts) {
    authAttempts.set(username, { count: 1, lastAttempt: now });
    return true;
  }

  // Reset if outside window
  if (now - userAttempts.lastAttempt > RATE_LIMIT_WINDOW) {
    authAttempts.set(username, { count: 1, lastAttempt: now });
    return true;
  }

  // Check if within limits
  if (userAttempts.count >= MAX_ATTEMPTS) {
    return false;
  }

  // Increment count
  userAttempts.count++;
  userAttempts.lastAttempt = now;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  authAttempts.forEach((attempts, username) => {
    if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
      authAttempts.delete(username);
    }
  });
}, RATE_LIMIT_WINDOW);

// Validate username to prevent LDAP injection
function validateLdapUsername(username: string): boolean {
  // Allow alphanumeric, dots, hyphens, underscores
  const validUsernameRegex = /^[a-zA-Z0-9._-]+$/;
  return validUsernameRegex.test(username) && username.length <= 64;
}

// Check if user is member of specific groups by querying the groups directly
async function getUserGroupsFromLdap(userDn: string): Promise<string[]> {
  const groups: string[] = [];

  // Combine all configured groups to check
  const allGroups = [
    ...config.ldap.adminGroups,
    ...config.ldap.managerGroups,
    ...config.ldap.userGroups,
  ];

  for (const groupName of allGroups) {
    try {
      // Try to authenticate against the group to see if user is a member
      // This is a workaround since ldap-authentication doesn't support direct group queries
      const groupDn = `ou=${groupName},${config.ldap.searchBase}`;

      // Use a simple LDAP bind test to check if the group exists and contains the user
      // Note: This is a simplified approach and may need adjustment based on your LDAP schema
      const testOptions = {
        ldapOpts: {
          url: config.ldap.url,
          connectTimeout: 5000,
          timeout: 10000,
        },
        adminDn: config.ldap.bindDN,
        adminPassword: config.ldap.bindPassword,
        userSearchBase: groupDn,
        usernameAttribute: "uniqueMember",
        username: userDn,
        userPassword: "dummy", // Not used for this type of search
        verifyUserExists: true,
      };

      const result = await ldapAuthentication.authenticate(testOptions);
      if (result) {
        groups.push(groupName);
      }
    } catch (error) {
      // Group doesn't exist or user is not a member - ignore
      continue;
    }
  }

  return groups;
}

async function authenticateWithLdap(
  username: string,
  password: string
): Promise<LdapUserInfo | null> {
  if (!config.ldap.enabled) {
    throw new Error("LDAP authentication is not enabled");
  }

  // Validate username to prevent injection
  if (!validateLdapUsername(username)) {
    console.warn("Invalid LDAP username format attempted");
    return null;
  }

  // Log authentication attempt without sensitive data
  console.log("LDAP authentication attempt");

  try {
    const options = {
      ldapOpts: {
        url: config.ldap.url,
        connectTimeout: 10000, // 10 second connection timeout
        timeout: 30000, // 30 second operation timeout
      },
      adminDn: config.ldap.bindDN,
      adminPassword: config.ldap.bindPassword,
      userSearchBase: config.ldap.searchBase,
      usernameAttribute: config.ldap.usernameAttribute,
      username: username,
      userPassword: password,
    };

    const user = await ldapAuthentication.authenticate(options);

    if (user) {
      console.log("LDAP authentication successful");

      // For LDAP servers that use reverse group membership (like forumsys.com)
      // we need to search for groups that contain this user as a member
      let groups: string[] = [];

      if (
        user[config.ldap.groupAttribute] &&
        user[config.ldap.groupAttribute].length > 0
      ) {
        // Standard memberOf attribute exists
        groups = user[config.ldap.groupAttribute];
      } else {
        // For LDAP servers that don't provide memberOf attribute,
        // query each configured group to see if user is a member
        console.log(
          "No memberOf attribute found, attempting group lookup via configured groups"
        );
        try {
          groups = await getUserGroupsFromLdap(user.dn);
          console.log("Found groups via direct group query:", groups);
        } catch (groupError) {
          console.warn("Failed to lookup user groups:", groupError);
          console.log(
            "To enable role assignment, ensure LDAP_ADMIN_GROUPS, LDAP_MANAGER_GROUPS, and LDAP_USER_GROUPS are configured"
          );
          groups = [];
        }
      }

      return {
        uid: user[config.ldap.usernameAttribute] || username,
        cn: user.cn || user.displayName || username,
        mail: user[config.ldap.emailAttribute],
        memberOf: groups,
      };
    }

    // Authentication failed - no logging to prevent user enumeration
    return null;
  } catch (error) {
    // Log error without sensitive details
    console.error("LDAP authentication failed");
    return null;
  }
}

function getUserRoleFromGroups(memberOf: string[]): string {
  // For FreeIPA, we need to do exact DN matching since the groups are returned as full DNs
  // like "cn=ctfnote-admins,cn=groups,cn=accounts,dc=ctfnote,dc=local"

  // Check admin groups first (exact DN match)
  for (const configuredGroup of config.ldap.adminGroups) {
    if (memberOf.includes(configuredGroup)) {
      return "user_admin";
    }
  }

  // Check manager groups (exact DN match)
  for (const configuredGroup of config.ldap.managerGroups) {
    if (memberOf.includes(configuredGroup)) {
      return "user_manager";
    }
  }

  // Check user groups (exact DN match)
  for (const configuredGroup of config.ldap.userGroups) {
    if (memberOf.includes(configuredGroup)) {
      return "user_member";
    }
  }

  // Default role
  return "user_guest";
}

export default makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      extend type Query {
        ldapAuthEnabled: Boolean
      }
      ${config.ldap.enabled
        ? `
        type LdapAuthPayload {
          jwt: String
        }
        extend type Mutation {
          authenticateWithLdap(username: String!, password: String!): LdapAuthPayload
        }
      `
        : ""}
    `,
    resolvers: {
      Query: {
        ldapAuthEnabled: () => config.ldap.enabled,
      },
      ...(config.ldap.enabled
        ? {
            Mutation: {
              authenticateWithLdap: async (
                _parent: unknown,
                args: { username: string; password: string },
                context: Context
              ) => {
                // Process LDAP authentication request
                const { username, password } = args;

                if (!config.ldap.enabled) {
                  throw new Error("LDAP authentication is not enabled");
                }

                // Check rate limit
                if (!checkRateLimit(username)) {
                  throw new Error(
                    "Too many authentication attempts. Please try again later."
                  );
                }

                // Authenticate with LDAP
                const ldapUser = await authenticateWithLdap(username, password);

                if (!ldapUser) {
                  throw new Error("Invalid LDAP credentials");
                }

                // Determine user role based on LDAP groups
                const userRole = getUserRoleFromGroups(ldapUser.memberOf || []);
                // User role determined from groups

                try {
                  // Use the database function to handle user creation/update
                  // Call database function to handle user creation/update
                  const result = await context.pgClient.query(
                    `SELECT (ctfnote.login_ldap($1, $2, $3)).*`,
                    [username, userRole, JSON.stringify(ldapUser)]
                  );

                  // Process database result

                  const jwtRow = result.rows[0];
                  // Validate JWT row

                  if (!jwtRow || !jwtRow.user_id) {
                    // Generic error without revealing internals
                    throw new Error("Authentication failed");
                  }

                  // Create JWT payload from the database result
                  const jwtPayload = {
                    user_id: parseInt(jwtRow.user_id),
                    role: jwtRow.role,
                    exp: parseInt(jwtRow.exp),
                    aud: "postgraphile", // Add the required audience
                    iss: "ctfnote-ldap", // Add issuer claim
                    iat: Math.floor(Date.now() / 1000), // Add issued at timestamp
                  };
                  // JWT payload created

                  // Sign the JWT token using the same secret as PostGraphile
                  const jwtSecret =
                    config.env === "development" ? "DEV" : config.sessionSecret;
                  // Explicitly specify algorithm to prevent algorithm confusion attacks
                  const signedJwt = jwt.sign(jwtPayload, jwtSecret, {
                    algorithm: "HS256",
                  });
                  // JWT token signed

                  return {
                    jwt: signedJwt,
                  };
                } catch (dbError) {
                  // Log sanitized error
                  console.error("LDAP login processing failed");
                  throw new Error("Authentication failed");
                }
              },
            },
          }
        : {}),
    },
  };
});
