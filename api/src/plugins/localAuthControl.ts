import { makeExtendSchemaPlugin, gql, makeWrapResolversPlugin } from "graphile-utils";
import config from "../config";

// Export a function that returns a plugin array
export default [
  // Add the localAuthEnabled query
  makeExtendSchemaPlugin(() => ({
    typeDefs: gql`
      extend type Query {
        localAuthEnabled: Boolean
      }
    `,
    resolvers: {
      Query: {
        localAuthEnabled: () => config.localAuthEnabled,
      },
    },
  })),
  
  // Wrap the existing mutations to check if local auth is enabled
  makeWrapResolversPlugin({
    Mutation: {
      login: {
        requires: {},
        resolve: async (resolver, source, args, context, resolveInfo) => {
          if (!config.localAuthEnabled) {
            throw new Error("Local authentication is disabled. Please use LDAP authentication.");
          }
          return resolver(source, args, context, resolveInfo);
        },
      },
      register: {
        requires: {},
        resolve: async (resolver, source, args, context, resolveInfo) => {
          if (!config.localAuthEnabled) {
            throw new Error("Local authentication is disabled. Registration is not available.");
          }
          return resolver(source, args, context, resolveInfo);
        },
      },
      registerWithPassword: {
        requires: {},
        resolve: async (resolver, source, args, context, resolveInfo) => {
          if (!config.localAuthEnabled) {
            throw new Error("Local authentication is disabled. Registration is not available.");
          }
          return resolver(source, args, context, resolveInfo);
        },
      },
    },
  }),
];