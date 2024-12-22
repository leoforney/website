import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

let pool: typeof Pool;

export async function connectToDb() {
    try {
        if (!pool) {
            pool = new Pool({
                host: process.env.DB_HOST || "localhost",
                user: process.env.DB_USER || "postgres",
                password: process.env.DB_PASSWORD || "password",
                database: process.env.DB_DATABASE || "exampledb",
                port: parseInt(process.env.DB_PORT || "5432", 10),
            });
            console.log("Pool instance created.");
        }

        const client = await pool.connect();
        console.log("Connected to the database successfully.");
        client.release();

    } catch (error) {
        console.error("Error connecting to the database:", error.message);

        const retryInterval = 3 * 60 * 1000; // in ms
        console.log(`Retrying connection in ${retryInterval / 1000} seconds...`);
        setTimeout(connectToDb, retryInterval);
    }
}

connectToDb();

export function getPool() {
    return pool;
}