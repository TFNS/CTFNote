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

function fetchFromCtftime(id: number) {
  const url = `https://ctftime.org/api/v1/events/${id}/`;
  return axios
    .get<CTFTimeResponse>(url, {
      headers: { "User-Agent": "CTFNote" }, // The default axios user-agent is blacklisted by ctftime :/
    })
    .then((r) => ({
      title: r.data.title,
      weight: r.data.weight,
      url: r.data.url,
      logo: r.data.logo,
      ctftimeUrl: r.data.ctftime_url,
      description: r.data.description,
      start: r.data.start,
      finish: r.data.finish,
    }))
    .catch(() => null);
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

      type CtftimeCtf {
        title: String!
        weight: Float!
        url: String!
        logo: String!
        ctftimeUrl: String!
        description: String!
        start: String!
        finish: String!
      }

      extend type Mutation {
        importCtf(input: ImportCtfInput): ImportCtfPayload
      }

      extend type Query {
        ctftimeCtfById(id: Int!): CtftimeCtf
      }
    `,
    resolvers: {
      Query: {
        async ctftimeCtfById(_query, { id }, { pgRole }) {
          if (pgRole !== "user_manager" && pgRole !== "user_admin") {
            throw new Error("Permission denied");
          }

          return fetchFromCtftime(id);
        },
      },
      Mutation: {
        importCtf: async (
          _query,
          { input: { ctftimeId } },
          { pgClient },
          resolveInfo
        ) => {
          const ctf = await fetchFromCtftime(ctftimeId);
          if (!ctf) {
            return {
              data: null,
              query: build.$$isQuery,
            };
          }
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
                ctf.ctftimeUrl,
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
