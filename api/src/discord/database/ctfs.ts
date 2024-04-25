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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  ctfName: string | bigint,
  pgClient: PoolClient | null = null
): Promise<CTF | null> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

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
    if (!useRequestClient) pgClient.release();
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

// invite the user to play the CTF, but only if they don't have access yet
export async function insertInvitation(
  ctfId: bigint,
  profileId: bigint,
  pgClient: PoolClient | null = null
): Promise<void> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  const accessibleCTFs = await getAccessibleCTFsForUser(profileId, pgClient);
  if (accessibleCTFs.find((ctf) => ctf.id === ctfId) != null) {
    // already has access
    return;
  }

  try {
    // only insert if the user can't play the CTF
    const query = `INSERT INTO ctfnote.invitation (ctf_id, profile_id) VALUES ($1, $2)`;
    const values = [ctfId, profileId];
    await pgClient.query(query, values);
  } catch (error) {
    console.error("Failed to insert invitation in the database:", error);
    return;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}

export async function getInvitedUsersByCtf(
  ctfId: bigint,
  pgClient: PoolClient | null = null
): Promise<bigint[]> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query = `SELECT profile_id FROM ctfnote.invitation WHERE ctf_id = $1`;
    const values = [ctfId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows.map((row) => row.profile_id);
  } catch (error) {
    console.error("Failed to get invited users from the database:", error);
    return [];
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}

export async function deleteInvitation(
  ctfId: bigint,
  profileId: bigint,
  pgClient: PoolClient | null = null
): Promise<void> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query = `DELETE FROM ctfnote.invitation WHERE ctf_id = $1 AND profile_id = $2`;
    const values = [ctfId, profileId];
    await pgClient.query(query, values);
  } catch (error) {
    console.error("Failed to delete invitation from the database:", error);
    return;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}
