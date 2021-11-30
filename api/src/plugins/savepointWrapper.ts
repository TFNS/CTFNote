import { Client } from "pg";

async function savepointWrapper(
  pgClient: Client,
  f: () => void
): Promise<void> {
  const name = `"CHECKPOINT-${Math.floor(Math.random() * 0xffff)}"`;
  await pgClient.query(`SAVEPOINT ${name}`);
  try {
    await f();
  } catch (e) {
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${name}`);
    throw e;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${name}`);
  }
}

export default savepointWrapper;
