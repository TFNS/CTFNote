import { connectToDatabase } from "./database";

export interface Task {
  id: bigint;
  tags: string[] | undefined;
  title: string;
  description: string;
  ctf_id: bigint;
  flag: string;
}

export async function getTaskByCtfIdAndNameFromDatabase(
  ctfId: bigint,
  name: string
): Promise<Task> {
  const pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT title, ctf_id, id, description, flag FROM ctfnote.task WHERE ctf_id = $1 AND title = $2 LIMIT 1";
    const values = [ctfId, name];
    const queryResult = await pgClient.query(query, values);

    const task: Task = {
      id: queryResult.rows[0].id as bigint,
      ctf_id: queryResult.rows[0].ctf_id as bigint,
      title: queryResult.rows[0].title as string,
      description: queryResult.rows[0].description as string,
      tags: undefined,
      flag: queryResult.rows[0].flag as string,
    };

    return task;
  } catch (error) {
    console.error(
      "Failed to fetch CTF task from the database:",
      error,
      ctfId,
      name
    );
    return {} as Task;
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
