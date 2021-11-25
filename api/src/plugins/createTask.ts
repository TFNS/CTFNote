import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import axios from "axios";
import savepointWrapper from "./savepointWrapper";
import { HedgedocAuth } from "./hedgedocAuth";
import config from "../config";

async function createPad(): Promise<string> {
  const Cookie = await HedgedocAuth.login("ctfnote", config.pad.ownerPass);
  try {
    const res = await axios.get(config.pad.createUrl, {
      maxRedirects: 0,
      headers: {
        Cookie,
      },
      validateStatus: (status) => status === 302,
    });
    return res.headers.location;
  } catch (e) {
    throw Error(`Call to ${config.pad.createUrl} during task creation failed.`);
  }
}

export default makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input CreateTaskInput {
        ctfId: Int!
        title: String!
        category: String
        description: String
        flag: String
      }

      type CreateTaskPayload {
        task: Task @pgField
        query: Query
      }

      extend type Mutation {
        createTask(input: CreateTaskInput): CreateTaskPayload
      }
    `,
    resolvers: {
      Mutation: {
        createTask: async (
          _query,
          { input: { title, description, category, flag, ctfId } },
          { pgClient },
          resolveInfo
        ) => {
          const padPathOrUrl = await createPad();

          let padPath: string;
          if (padPathOrUrl.startsWith("/")) {
            padPath = padPathOrUrl.slice(1);
          } else {
            padPath = new URL(padPathOrUrl).pathname.slice(1);
          }

          const padUrl = `${config.pad.showUrl}${padPath}`;

          return await savepointWrapper(pgClient, async () => {
            const {
              rows: [newTask],
            } = await pgClient.query(
              `SELECT * FROM ctfnote_private.create_task($1, $2, $3, $4, $5, $6)`,
              [
                title,
                description ?? "",
                category ?? "???",
                flag ?? "",
                padUrl,
                ctfId,
              ]
            );
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`ctfnote.task`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(newTask.id)}`
                  );
                }
              );
            return {
              data: row,
              query: build.$$isQuery,
            };
          });
        },
      },
    },
  };
});
