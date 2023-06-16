import { connectToDatabase } from "./database";

async function getCTFNamesFromDatabase(): Promise<string[]> {
  const pgClient = await connectToDatabase();

  try {
    const query = `SELECT title, start_time, end_time
                       FROM ctfnote.ctf
                       WHERE end_time >= NOW()
                       ORDER BY start_time ASC;`;

    const queryResult = await pgClient.query(query);
    // Extract the "name" field from each row
    return queryResult.rows.map((row) => row.title);
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return [];
  }
}

export async function getAllCtfsFromDatabase(): Promise<string[]> {
  const pgClient = await connectToDatabase();

  try {
    const query = `SELECT title, start_time, end_time
                       FROM ctfnote.ctf;`;

    const queryResult = await pgClient.query(query);
    // Extract the "name" field from each row
    return queryResult.rows.map((row) => row.title);
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return [];
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
    // Extract the "name" field from each row
    return queryResult.rows[0].id;
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return BigInt(-1);
  }
}

export async function getChallengesFromDatabase(
  ctfId: bigint
): Promise<string[]> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query =
      "SELECT title, description, category FROM ctfnote.task WHERE ctf_id = $1 ORDER BY category, title";
    const values = [ctfId];
    const queryResult = await pgClient.query(query, values);
    // Extract the "name" field from each row
    return queryResult.rows.map((row) => row);
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return [];
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
  }
}

export async function getTaskFromId(taskId: bigint): Promise<string[]> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query =
      "SELECT title,category,ctf_id FROM ctfnote.task WHERE id = $1";
    const values = [taskId];
    const queryResult = await pgClient.query(query, values);
    // Extract the "name" field from each row

    return [
      // replace spaces with dashes
      queryResult.rows[0].title.replace(/\s/g, "-"),
      queryResult.rows[0].category.replace(/\s/g, "-"),
      queryResult.rows[0].ctf_id,
    ];
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return [];
  }
}

export async function createTask(
  title: string,
  description: string,
  category: string,
  flag: string,
  padUrl: string,
  ctfId: number
): Promise<void> {
  const pgClient = await connectToDatabase();

  try {
    const query = `
            INSERT INTO ctfnote.task (title, description, category, flag, pad_url, ctf_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
    const values = [title, description, category, flag, padUrl, ctfId];
    await pgClient.query(query, values);
  } catch (error) {
    console.error("Failed to create a task in the database:", error);
    throw error;
  }
}

export async function getCTFNameFromId(ctfId: bigint): Promise<string> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query = "SELECT title FROM ctfnote.ctf WHERE id = $1";
    const values = [ctfId];
    const queryResult = await pgClient.query(query, values);
    // Extract the "name" field from each row

    return queryResult.rows[0].title;
  } catch (error) {
    console.error("Failed to fetch CTF names from the database:", error);
    return "";
  }
}

export { getCTFNamesFromDatabase };
