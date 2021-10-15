import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import axios from "axios";
import savepointWrapper from "./savepointWrapper";
import config from "../config";

async function createPad(): Promise<string> {
  try {
    const res = await axios.get(config.pad.createUrl, {
      maxRedirects: 0,
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
          const padPath = await createPad();
          const padUrl = `${config.pad.showUrl}${padPath.slice(1)}`;

          return await savepointWrapper(pgClient, async () => {
            const {
              rows: [newTask],
            } = await pgClient.query(
              `SELECT * FROM ctfnote_private.create_task($1, $2, $3, $4, $5, $6)`,
              [title, description ?? '', category ?? '???', flag ?? '', padUrl, ctfId]
            );
            const [
              row,
            ] = await resolveInfo.graphile.selectGraphQLResultFromTable(
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
