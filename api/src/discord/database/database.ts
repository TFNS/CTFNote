import { Pool } from "pg";
import config from "../../config";

const pgPool = new Pool({
  user: config.db.admin.login,
  host: config.db.host,
  database: config.db.database,
  password: config.db.admin.password,
  port: config.db.port,
});

async function connectToDatabase() {
  await pgPool.connect();
  return pgPool;
}

export { connectToDatabase };
