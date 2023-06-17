import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { Context } from "./uploadLogo";

export default makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      type PublicProfileSubscriptionPayload {
        publicProfile: PublicProfile
        event: String
      }

      extend type Subscription {
        currentProfileUpdated: PublicProfileSubscriptionPayload
          @pgSubscription(topic: "postgraphile:update:profiles")
        currentProfileCreated: PublicProfileSubscriptionPayload
          @pgSubscription(topic: "postgraphile:create:profiles")
        currentProfileDeleted: PublicProfileSubscriptionPayload
          @pgSubscription(topic: "postgraphile:delete:profiles")
      }
    `,
    resolvers: {
      PublicProfileSubscriptionPayload: {
        publicProfile: async (event, _args, _context: Context, resolveInfo) => {
          const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`ctfnote.public_profile`,
            (tableAlias, sqlBuilder) => {
              sqlBuilder.where(
                sql.fragment`${tableAlias}.id = ${sql.value(event.__node__[1])}`
              );
            }
          );
          return rows[0];
        },
      },
    },
  };
});
