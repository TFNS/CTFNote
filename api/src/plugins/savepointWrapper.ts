import { Client } from "pg";

async function savepointWrapper(pgClient: Client, f: () => any): Promise<any> {
  const name = `"CHECKPOINT-${Math.floor(Math.random() * 0xffff)}"`;
  await pgClient.query(`SAVEPOINT ${name}`);
  try {
    return await f();
  } catch (e) {
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${name}`);
    throw e;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${name}`);
  }
}

export default savepointWrapper;
