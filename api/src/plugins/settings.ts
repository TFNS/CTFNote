import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { PostGraphilePlugin } from "postgraphile";

const NODE_ID = "WyJzZXR0aW5ncyIsdHJ1ZV0=";

const settings = {
  allowRegistration: true,
};

let settingsFetched = false;

function convertType(obj: string | number | boolean) {
  switch (typeof obj) {
    case "string":
      return "String";
    case "number":
      return Number.isInteger(obj) ? "Int" : "Float";
    case "boolean":
      return "Boolean";
  }
}
/*
 Add settings to the request context
*/
export const settingsHook: PostGraphilePlugin = {
  withPostGraphileContext: (callback) => {
    return (context, next) => {
      if (context.pgSettings == undefined) {
        context.pgSettings = {};
      }
      for (const [key, value] of Object.entries(settings)) {
        const name = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
        context.pgSettings[`settings.${name}`] = value.toString();
      }
      return callback(context, next);
    };
  },
};

/*
 Extend the schema with our settings
*/
export const settingsPlugin = makeExtendSchemaPlugin(() => {
  const fieldList = Object.entries(settings).map(
    ([name, value]) => `${name}: ${convertType(value)}`
  );

  return {
    typeDefs: gql`     
                type Settings {
                    nodeId: ID
                    ${fieldList.map((s) => `${s}!`).join("\n")}
                }
        
                extend type Query {
                    settings : Settings!
                }
                
                input SettingsInput {
                    ${fieldList.join("\n")}
                }
        
                type updateSettingsPayload {
                    settings: Settings!
                }
        
                extend type Mutation {
                    updateSettings(input: SettingsInput!) : updateSettingsPayload!
                }
                `,
    resolvers: {
      Query: {
        settings: async (_query, _args, context) => {
          const { pgClient } = context;
          if (!settingsFetched) {
            // Fetch the settings the first time they are requested
            const response = await pgClient.query(
              `SELECT settings FROM ctfnote_private.settings;`
            );
            const savedSettings = response.rows[0].settings;
            Object.assign(settings, savedSettings);
            settingsFetched = true;
          }
          // deliver from cache
          return { ...settings, nodeId: NODE_ID };
        },
      },
      Mutation: {
        updateSettings: async (_query, { input }, { pgClient }) => {
          // Update the cache
          Object.assign(settings, input);

          // Save the cache to the db
          await pgClient.query("SELECT ctfnote_private.update_settings($1);", [
            JSON.stringify(settings),
          ]);
          return { settings: { ...settings, nodeId: NODE_ID } };
        },
      },
    },
  };
});
