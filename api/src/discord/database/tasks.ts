import { connectToDatabase } from "./database";
import { PoolClient } from "pg";

export interface Task {
  id: bigint;
  tags: string[] | undefined;
  title: string;
  description: string;
  ctf_id: bigint;
  flag: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTask(row: any): Task {
  return {
    id: row.id as bigint,
    ctf_id: row.ctf_id as bigint,
    title: row.title as string,
    description: row.description as string,
    tags: undefined,
    flag: row.flag as string,
  };
}

export async function getTaskByCtfIdAndNameFromDatabase(
  ctfId: bigint,
  name: string,
  pgClient: PoolClient | null = null
): Promise<Task | null> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT title, ctf_id, id, description, flag FROM ctfnote.task WHERE ctf_id = $1 AND title = $2 LIMIT 1";
    const values = [ctfId, name];
    const queryResult = await pgClient.query(query, values);

    return buildTask(queryResult.rows[0]);
  } catch (error) {
    console.error(
      "Failed to fetch CTF task from the database:",
      error,
      ctfId,
      name
    );
    return null;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}

export async function getTaskFromId(taskId: bigint): Promise<Task | null> {
  const pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT title, ctf_id, tsk.id, description, flag, array_agg(tag) as tags FROM ctfnote.task tsk LEFT JOIN ctfnote.assigned_tags tt ON tsk.id = tt.task_id LEFT JOIN ctfnote.tag t ON tt.tag_id = t.id WHERE tsk.id = $1 GROUP BY tsk.id LIMIT 1;";
    const values = [taskId];
    const queryResult = await pgClient.query(query, values);

    return buildTask(queryResult.rows[0]);
  } catch (error) {
    console.error("Failed to get task from id:", error);
    return null;
  } finally {
    pgClient.release();
  }
}

export async function getChallengesFromDatabase(
  ctfId: bigint
): Promise<Task[]> {
  const pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT title, description, tsk.id, ctf_id, flag, array_agg(tag) AS tags FROM ctfnote.task tsk LEFT JOIN ctfnote.assigned_tags tt ON tsk.id = tt.task_id LEFT JOIN ctfnote.tag t ON tt.tag_id = t.id WHERE ctf_id = $1 GROUP BY tsk.id ORDER BY title";
    const values = [ctfId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows;
  } catch (error) {
    console.error("Failed to get challenges from database:", error);
    return [];
  } finally {
    pgClient.release();
  }
}

export async function setFlagForChallengeId(
  challengeId: bigint,
  flag: string
): Promise<boolean> {
  const pgClient = await connectToDatabase();

  try {
    const query =
      "UPDATE ctfnote.task SET flag = $2 WHERE id = $1 AND flag = '' ";
    const values = [challengeId, flag];
    const result = await pgClient.query(query, values);
    return result.rowCount == 1;
  } catch (error) {
    console.error(
      "Failed to update flag from the database:",
      error,
      challengeId
    );
    return false;
  } finally {
    pgClient.release();
  }
}

export async function userStartsWorkingOnTask(
  userId: bigint,
  taskId: bigint
): Promise<boolean> {
  const pgClient = await connectToDatabase();

  try {
    const query = "SELECT ctfnote_private.start_working_on($1, $2)";
    const values = [userId, taskId];
    const result = await pgClient.query(query, values);
    return result.rows[0].start_working_on as boolean;
  } catch (error) {
    console.error(
      "Failed to start working on task from the database:",
      error,
      userId,
      taskId
    );
    return false;
  } finally {
    pgClient.release();
  }
}

export async function userStopsWorkingOnTask(
  userId: bigint,
  taskId: bigint
): Promise<boolean> {
  const pgClient = await connectToDatabase();

  try {
    const query = "SELECT ctfnote_private.stop_working_on($1, $2)";
    const values = [userId, taskId];
    const result = await pgClient.query(query, values);
    return result.rows[0].stop_working_on as boolean;
  } catch (error) {
    console.error(
      "Failed to stop working on task from the database:",
      error,
      userId,
      taskId
    );
    return false;
  } finally {
    pgClient.release();
  }
}

export async function getUserIdsWorkingOnTask(task: Task): Promise<bigint[]> {
  const pgClient = await connectToDatabase();
  try {
    const query =
      "SELECT profile_id FROM ctfnote.work_on_task WHERE task_id = $1";
    const values = [task.id];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows.map((row) => row.user_id as bigint);
  } catch (error) {
    console.error(
      "Failed to fetch user ids working on task from the database:",
      error,
      task
    );
    return [];
  } finally {
    pgClient.release();
  }
}
