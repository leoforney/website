import puppeteer from "puppeteer";
import { Client } from "pg";
import { connect } from "amqplib";

// Environment variables
const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT,
    QUEUE_HOST,
    QUEUE_PORT,
} = process.env;

// Set up PostgreSQL client
const db = new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: parseInt(DB_PORT || "5432"),
});

db.connect().catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});

// Render page and save <body> content
async function renderPage(url: string) {
    const browser = await puppeteer.launch({
        headless: "new", // Use the new headless mode
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required flags for root in Docker
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    await browser.close();

    // Insert into PostgreSQL
    await db.query(
        "INSERT INTO pages (url, body) VALUES ($1, $2)",
        [url, bodyContent]
    );
}

// Consume messages from RabbitMQ
async function consumeMessages() {
    const connection = await connect(`amqp://${QUEUE_HOST}:${QUEUE_PORT}`);
    const channel = await connection.createChannel();
    await channel.assertQueue("renderQueue", { durable: true });

    console.log("Waiting for messages...");
    channel.consume("renderQueue", async (msg) => {
        const url = msg.content.toString();
        console.log(`Rendering: ${url}`);

        try {
            await renderPage(url);
            channel.ack(msg);
        } catch (error) {
            console.error(`Failed to render ${url}:`, error);
            channel.nack(msg);
        }
    });
}

consumeMessages().catch((err) => {
    console.error("Failed to consume messages:", err);
    process.exit(1);
});
