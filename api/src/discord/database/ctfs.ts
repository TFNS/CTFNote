import { connectToDatabase } from "./database";
import { Task } from "./tasks";

async function getCTFNamesFromDatabase(): Promise<string[]> {
  const pgClient = await connectToDatabase();

  try {
    const query = `SELECT title, start_time, end_time
                       FROM ctfnote.ctf
                       WHERE end_time >= NOW()
                       ORDER BY start_time ASC;`;

    const queryResult = await pgClient.query(query);

    return queryResult.rows.map((row) => row.title);
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return [];
  } finally {
    pgClient.release();
  }
}

export async function getAllCtfsFromDatabase(): Promise<string[]> {
  const pgClient = await connectToDatabase();

  try {
    const query = `SELECT title, start_time, end_time
                       FROM ctfnote.ctf;`;

    const queryResult = await pgClient.query(query);

    return queryResult.rows.map((row) => row.title);
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return [];
  } finally {
    pgClient.release();
  }
}

// get id from ctf name
export async function getCtfIdFromDatabase(ctfName: string): Promise<bigint> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query = "SELECT id FROM ctfnote.ctf WHERE title = $1";
    const values = [ctfName];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].id;
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return BigInt(-1);
  } finally {
    pgClient.release();
  }
}

export async function getChallengesFromDatabase(
  ctfId: bigint
): Promise<Task[]> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query =
      "SELECT title, description, id, ctf_id FROM ctfnote.task WHERE ctf_id = $1 ORDER BY title";
    const values = [ctfId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows.map((row) => row);
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return [];
  } finally {
    pgClient.release();
  }
}

export async function getNameFromUserId(userId: bigint): Promise<string> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query = "SELECT username FROM ctfnote.profile WHERE id = $1";
    const values = [userId];
    const queryResult = await pgClient.query(query, values);
    // Extract the "name" field from each row

    return queryResult.rows[0].username;
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return "";
  } finally {
    pgClient.release();
  }
}

export async function getTaskFromId(taskId: bigint): Promise<Task> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query =
      "SELECT title, ctf_id, id, description FROM ctfnote.task WHERE id = $1 LIMIT 1";
    const values = [taskId];
    const queryResult = await pgClient.query(query, values);

    const task: Task = {
      id: queryResult.rows[0].id as bigint,
      ctf_id: queryResult.rows[0].ctf_id as bigint,
      title: queryResult.rows[0].title as string,
      description: queryResult.rows[0].description as string,
      tags: undefined,
    };

    return task;
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return {} as Task;
  } finally {
    pgClient.release();
  }
}

export async function createTask(
  title: string,
  description: string,
  flag: string,
  padUrl: string,
  ctfId: number
): Promise<void> {
  const pgClient = await connectToDatabase();

  try {
    const query = `
            INSERT INTO ctfnote.task (title, description, flag, pad_url, ctf_id)
            VALUES ($1, $2, $3, $4, $5)
        `;
    const values = [title, description, flag, padUrl, ctfId];
    await pgClient.query(query, values);
  } catch (error) {
    console.error("Failed to create a task in the database:", error);
    throw error;
  } finally {
    pgClient.release();
  }
}

export async function getCTFNameFromId(ctfId: bigint): Promise<string> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query = "SELECT title FROM ctfnote.ctf WHERE id = $1";
    const values = [ctfId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].title;
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return "";
  } finally {
    pgClient.release();
  }
}

export { getCTFNamesFromDatabase };
