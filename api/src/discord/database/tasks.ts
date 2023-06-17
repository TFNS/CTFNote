import { connectToDatabase } from "./database";

export async function getChallengeIdByCtfIdAndNameFromDatabase(
  ctfId: bigint,
  name: string
): Promise<bigint | null> {
  const pgClient = await connectToDatabase();

  try {
    //make a query to get all the challenges from a ctf

    const query =
      "SELECT id FROM ctfnote.task WHERE ctf_id = $1 AND title = $2 LIMIT 1";
    const values = [ctfId, name];
    const queryResult = await pgClient.query(query, values);
    // Extract the "id" field from the first row
    return queryResult.rows[0].id;
  } catch (error) {
    console.error(
      "Failed to fetch CTF task from the database:",
      error,
      ctfId,
      name
    );
    return null;
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
    //make a query to get all the challenges from a ctf

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
