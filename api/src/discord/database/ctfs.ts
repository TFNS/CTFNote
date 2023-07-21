import { connectToDatabase } from "./database";
import { PoolClient } from "pg";

export interface CTF {
  id: bigint;
  title: string;
  weight: number;
  ctf_url: string;
  logo_url: string;
  ctftime_url: string;
  description: string;
  start_time: Date;
  end_time: Date;
  secrets_id: bigint;
}

function buildCtf(row: any): CTF {
  return {
    id: row.id as bigint,
    title: row.title as string,
    weight: row.weight as number,
    ctf_url: row.ctf_url as string,
    logo_url: row.logo_url as string,
    ctftime_url: row.ctftime_url as string,
    description: row.description as string,
    start_time: row.start_time as Date,
    end_time: row.end_time as Date,
    secrets_id: row.secrets_id as bigint,
  };
}

export async function getCTFNamesFromDatabase(): Promise<string[]> {
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
    const query = `SELECT title FROM ctfnote.ctf;`;

    const queryResult = await pgClient.query(query);

    return queryResult.rows.map((row) => row.title);
  } catch (error) {
    console.error("Failed to fetch all CTFs from the database:", error);
    return [];
  } finally {
    pgClient.release();
  }
}

// get id from ctf name
export async function getCtfFromDatabase(
  ctfName: string | bigint
): Promise<CTF | null> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    let query =
      "SELECT id, title, weight, ctf_url, logo_url, ctftime_url, description, start_time, end_time, secrets_id FROM ctfnote.ctf";

    if (typeof ctfName === "string") {
      query += " WHERE title = $1";
    } else if (typeof ctfName === "bigint" || typeof ctfName === "number") {
      query += " WHERE id = $1";
    } else {
      throw new Error("Invalid type for ctfName: " + typeof ctfName);
    }

    const values = [ctfName];
    const queryResult = await pgClient.query(query, values);

    return buildCtf(queryResult.rows[0]);
  } catch (error) {
    console.error("Failed to get CTF from the database:", error);
    return null;
  } finally {
    pgClient.release();
  }
}

export async function getNameFromUserId(userId: bigint): Promise<string> {
  const pgClient = await connectToDatabase();

  try {
    const query = "SELECT username FROM ctfnote.profile WHERE id = $1";
    const values = [userId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].username;
  } catch (error) {
    console.error("get name from user id from the database:", error);
    return "";
  } finally {
    pgClient.release();
  }
}

export async function createTask(
  title: string,
  description: string,
  flag: string,
  padUrl: string,
  ctfId: bigint
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

export async function getAccessibleCTFsForUser(
  userId: bigint,
  pgClient: PoolClient | null = null
): Promise<CTF[]> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query = `SELECT * FROM ctfnote_private.user_can_play_ctfs($1);`;
    const values = [userId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows;
  } catch (error) {
    console.error("Failed to fetch accessible CTFs from the database:", error);
    return [];
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}
