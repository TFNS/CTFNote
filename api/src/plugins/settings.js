
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");


const settings = {
    allowRegistration: true,
}

function convertType(obj){
    switch (typeof obj){
        case "string": return "String"
        case "number": return Number.isInteger(obj) ? "Int": "Float"
        case "boolean": return "Boolean"
        default: throw Error(`Unsuported type ${typeof obj}`)
    }
}

const Settings = makeExtendSchemaPlugin(build => {
    const { pgSql: sql } = build;
    const fieldList = Object.entries(settings).map(([name, value]) => `${name}: ${convertType(value)}`)
    return {
        typeDefs: gql`     
                type Settings {
                    ${fieldList.map(s=>`${s}!`).join("\n")}
                }
        
                extend type Query {
                    settings : Settings!
                }
                
                input SettingsInput {
                    ${fieldList.join("\n")}
                }
        
                type updateSettingsPayload {
                    settings: Settings
                }
        
                extend type Mutation {
                    updateSettings(input: SettingsInput) : updateSettingsPayload
                }
                `,
        resolvers: {
            Query: {
                settings: async () => {
                    return settings;
                },
            },
            Mutation: {
                updateSettings: async (_query, { input }, { pgClient }, resolveInfo) => {
                    Object.assign(settings, input)
                    return {settings}
                }
            }
        },
    };
});



module.exports = Settings