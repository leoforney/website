import {getPool} from "./db";
import fs from "fs";
import path from "path";

export async function migrate() {
    try {
        const pool = getPool();
        const migrationsDir = path.resolve(__dirname, "migrations");
        const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith(".sql"));

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, "utf-8");

            console.log(`Running migration: ${file}`);
            await pool.query(sql);
        }

        console.log("Migrations completed successfully.");
    } catch (error) {
        console.error("Error running migrations:", error);
        throw error;
    }
}