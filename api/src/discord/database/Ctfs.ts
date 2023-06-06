import {connectToDatabase} from "./database";

async function getCTFNamesFromDatabase(): Promise<string[]> {
    const pgClient = await connectToDatabase();

    try {

        const query = `
              SELECT title, start_time, end_time
              FROM ctfnote.ctf
              WHERE start_time >= NOW()
              ORDER BY start_time ASC;
            `;

        const queryResult = await pgClient.query(query);
        // Extract the "name" field from each row
        return queryResult.rows.map((row) => row.title);

    } catch (error) {
        console.error("Failed to fetch CTF names from the database:", error);
        return [];
    }
}

// get id from ctf name
export async function getCtfIdFromDatabase(ctfName : string): Promise<bigint> {
    const pgClient = await connectToDatabase();

    try {

        //make a query to get all the challenges from a ctf

        const query = 'SELECT id FROM ctfnote.ctf WHERE title = $1';
        const values = [ctfName];
        const queryResult = await pgClient.query(query, values);
        // Extract the "name" field from each row
        return queryResult.rows[0].id;

    } catch (error) {
        console.error("Failed to fetch CTF names from the database:", error);
        return BigInt(-1);
    }
}


export async function getChallengesFromDatabase(ctfId : bigint): Promise<string[]> {
    const pgClient = await connectToDatabase();

    try {

        //make a query to get all the challenges from a ctf

        const query = 'SELECT title, description, category FROM ctfnote.task WHERE ctf_id = $1 ORDER BY category, title';
        const values = [ctfId];
        const queryResult = await pgClient.query(query, values);
// Extract the "name" field from each row
        return queryResult.rows.map((row) => row);


    } catch (error) {
        console.error("Failed to fetch CTF names from the database:", error);
        return [];
    }
}


export async function getCTFNamefromId(ctfId : bigint): Promise<string> {
    const pgClient = await connectToDatabase();

    try {

        //make a query to get all the challenges from a ctf

        const query = 'SELECT title FROM ctfnote.ctf WHERE id = $1';
        const values = [ctfId];
        const queryResult = await pgClient.query(query, values);
        // Extract the "name" field from each row
        return queryResult.rows[0].name;


    } catch (error) {
        console.error("Failed to fetch CTF names from the database:", error);
        return "";
    }
}


export { getCTFNamesFromDatabase };
