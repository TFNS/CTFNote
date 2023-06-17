import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import axios from "axios";
import savepointWrapper from "./savepointWrapper";
import config from "../config";

function buildNoteContent(
  title: string,
  description?: string,
  tags?: string[]
): string {
  let note = "";

  note += `# ${title}`;

  if (tags) {
    for (const tag of tags) {
      note += ` - ${tag}`;
    }
  }

  note += "\n\n";

  if (description) {
    note += `## Description\n`;
    note += "\n";
    note += `${description}\n`;

    note += "\n";
    note += "----\n";
  }
  return note;
}

async function createPad(
  title: string,
  description?: string,
  tags?: string[]
): Promise<string> {
  const options = {
    headers: {
      "Content-Type": "text/markdown",
    },

    maxRedirects: 0,
    validateStatus: (status: number) => status === 302,
  };

  try {
    const res = await axios.post(
      config.pad.createUrl,
      buildNoteContent(title, description, tags),
      options
    );
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
        tags: [String]
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
          { input: { title, description, tags, flag, ctfId } },
          { pgClient },
          resolveInfo
        ) => {
          const {
            rows: [isAllowed],
          } = await pgClient.query(`SELECT ctfnote_private.can_play_ctf($1)`, [
            ctfId,
          ]);

          if (isAllowed.can_play_ctf !== true) {
            return {};
          }

          const padPathOrUrl = await createPad(title, description, tags);

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
              `SELECT * FROM ctfnote_private.create_task($1, $2, $3, $4, $5)`,
              [title, description ?? "", flag ?? "", padUrl, ctfId]
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
