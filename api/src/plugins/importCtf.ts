import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import axios from "axios";
import savepointWrapper from "./savepointWrapper";

interface CTFTimeResponse {
  title: string;
  weight: number;
  url: string;
  logo: string;
  ctftime_url: string;
  description: string;
  start: string;
  finish: string;
}

async function fetchFromCtftime(id: number): Promise<CTFTimeResponse> {
  const url = `https://ctftime.org/api/v1/events/${id}/`;
  const response = await axios.get(url, {
    headers: { "User-Agent": "CTFNote" }, // The default axios user-agent is blacklisted by ctftime :/
  });
  return response.data;
}

export default makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input ImportCtfInput {
        ctftimeId: Int!
      }

      type ImportCtfPayload {
        ctf: Ctf @pgField
        query: Query
      }

      extend type Mutation {
        importCtf(input: ImportCtfInput): ImportCtfPayload
      }
    `,
    resolvers: {
      Mutation: {
        importCtf: async (
          _query,
          { input: { ctftimeId } },
          { pgClient },
          resolveInfo
        ) => {
          const ctf = await fetchFromCtftime(ctftimeId);
          await savepointWrapper(pgClient, async () => {
            const {
              rows: [newCtf],
            } = await pgClient.query(
              `INSERT INTO ctfnote.ctf(
                                title,
                                weight,
                                ctf_url,
                                logo_url,
                                ctftime_url,
                                description,
                                start_time,
                                end_time
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                                RETURNING *;
                                `,
              [
                ctf.title,
                ctf.weight,
                ctf.url,
                ctf.logo,
                ctf.ctftime_url,
                ctf.description,
                ctf.start,
                ctf.finish,
              ]
            );
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`ctfnote.ctf`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(newCtf.id)}`
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
