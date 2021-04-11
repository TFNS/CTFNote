const assert = require('assert');
const { Pool } = require('pg')

const pools = {};



const roles = [
  "user_anonymous",
  "user_guest",
  "user_member",
  "user_manager",
  "user_admin"
]

const schemas = {
  "ctfnote": {
    "ctf": [
      "id",
      "title",
      "weight",
      "ctf_url",
      "logo_url",
      "ctftime_url",
      "description",
      "start_time",
      "end_time",
      "secrets_id"
    ],
    "invitation": [
      "ctf_id",
      "profile_id"
    ],
    "ctf_secrets": [
      "id",
      "credentials"
    ],
    "profile": [
      "id",
      "username",
      "role"
    ],
    "work_on_task": [
      "task_id",
      "profile_id"
    ],
    "task": [
      "id",
      "title",
      "description",
      "category",
      "flag",
      "pad_url",
      "ctf_id",
    ]
  },
  "ctfnote_private": {
    "user": [
      "id",
      "login",
      "password"
    ]
  }
}



afterEach(() => {
  const keys = Object.keys(pools);
  return Promise.all(
    keys.map(async key => {
      try {
        const pool = pools[key];
        delete pools[key];
        await pool.end();
      } catch (e) {
        console.error("Failed to release connection!");
        console.error(e);
      }
    })
  );
});

const withRootDb = async (fn) => {
  const pool = new Pool({
    host: '127.0.0.1',
    port: 5433,
    user: 'ctfnote',
    password: 'ctfnote',
  })
  const client = await pool.connect();
  await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE;");

  try {
    await fn(client);
  } catch (e) {
    // Error logging can be helpful:
    if (typeof e.code === "string" && e.code.match(/^[0-9A-Z]{5}$/)) {
      console.error([e.message, e.code, e.detail, e.hint, e.where].join("\n"));
    }
    throw e;
  } finally {
    await client.query("ROLLBACK;");
    await client.query("RESET ALL;"); // Shouldn't be necessary, but just in case...
    await client.release();
  }
};

const becomeRoot = (client) => client.query("reset role");

async function sendQuery(...args) {
  const pool = new Pool({
    host: '127.0.0.1',
    port: 5433,
    user: 'ctfnote',
    password: 'ctfnote',
  })
  const client = await pool.connect();
  const data = await client.query(...args)
  return data.rows
}


function check_schema_exists(schemaName) {
  it(`Schema ${schemaName} should exists`, async () => {
    const r = await sendQuery(`SELECT TRUE as ok FROM pg_namespace WHERE nspname = $1`, [schemaName])
    assert(r[0]['ok'] === true)
  })
}

function check_table_exists(schemaName, tableName) {
  it(`Table ${schemaName}.${tableName} should exists`, async () => {
    const r = await sendQuery(`SELECT TRUE as ok FROM pg_tables WHERE schemaname = $1 and tablename = $2`, [schemaName, tableName])
    assert(r[0]['ok'] === true)
  })
}

function check_column_exists(schemaName, tableName, columnName) {
  const table = `${schemaName}.${tableName}`
  const query = `
  SELECT TRUE AS ok FROM pg_attribute 
  WHERE attrelid = ($1)::regclass
   AND attnum > 0
   AND NOT attisdropped
   AND attname = $2;`
  it(`Column ${schemaName}.${tableName}.${columnName} should exists`, async () => {
    const r = await sendQuery(query, [table, columnName])
    assert(r[0]['ok'] === true)
  })
}

function check_role_exists(roleName) {
  it(`Role ${roleName} should exists`, async () => {
    const r = await sendQuery(`SELECT TRUE as ok FROM pg_roles WHERE rolname = $1`, [roleName])
    assert(r[0]['ok'] === true)
  })
}

async function run_dp() {
  const query = `SELECT n.nspname as "Schema",
  c.relname as "Name",
  CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'S' THEN 'sequence' WHEN 'f' THEN 'foreign table' WHEN 'p' THEN 'partitioned table' END as "Type",
  pg_catalog.array_to_string(c.relacl, E'\n') AS "Access privileges",
  pg_catalog.array_to_string(ARRAY(
    SELECT attname || E':\n  ' || pg_catalog.array_to_string(attacl, E'\n  ')
    FROM pg_catalog.pg_attribute a
    WHERE attrelid = c.oid AND NOT attisdropped AND attacl IS NOT NULL
  ), E'\n') AS "Column privileges",
  pg_catalog.array_to_string(ARRAY(
    SELECT polname
    || CASE WHEN NOT polpermissive THEN
       E' (RESTRICTIVE)'
       ELSE '' END
    || CASE WHEN polcmd != '*' THEN
           E' (' || polcmd || E'):'
       ELSE E':'
       END
    || CASE WHEN polqual IS NOT NULL THEN
           E'\n  (u): ' || pg_catalog.pg_get_expr(polqual, polrelid)
       ELSE E''
       END
    || CASE WHEN polwithcheck IS NOT NULL THEN
           E'\n  (c): ' || pg_catalog.pg_get_expr(polwithcheck, polrelid)
       ELSE E''
       END    || CASE WHEN polroles <> '{0}' THEN
           E'\n  to: ' || pg_catalog.array_to_string(
               ARRAY(
                   SELECT rolname
                   FROM pg_catalog.pg_roles
                   WHERE oid = ANY (polroles)
                   ORDER BY 1
               ), E', ')
       ELSE E''
       END
    FROM pg_catalog.pg_policy pol
    WHERE polrelid = c.oid), E'\n')
    AS "Policies"
FROM pg_catalog.pg_class c
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind IN ('r','v','m','S','f','p')
  AND n.nspname !~ '^pg_' AND pg_catalog.pg_table_is_visible(c.oid)
ORDER BY 1, 2;`
  return await sendQuery(query)
}

function main() {

  describe("Database schema", () => {
    for (const [schemaName, tables] of Object.entries(schemas)) {
      describe("Schema existence", () => {
        check_schema_exists(schemaName)

        describe("Table existence", () => {
          for (const [tableName, columns] of Object.entries(tables)) {
            check_table_exists(schemaName, tableName)

            describe("Column existence", () => {
              for (const columnName of columns) {
                check_column_exists(schemaName, tableName, columnName)
              }
            })
          }
        })
      })
    }

    describe("Roles existence", () => {
      for (const roleName of roles) {
        check_role_exists(roleName)
      }
      it("zob", async () => {
        const d = await run_dp()
        console.log(d)
      })
    })



  })
}

main()