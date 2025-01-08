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
async function renderPage(url, channel) {
    const browser = await puppeteer.launch({
        headless: "new", // Use the new headless mode
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required flags for root in Docker
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    await browser.close();

    // Insert into PostgreSQL and get the generated ID
    const result = await db.query(
        "INSERT INTO pages (url, body) VALUES ($1, $2) RETURNING id",
        [url, bodyContent]
    );
    const generatedId = result.rows[0].id;

    // Publish message to "mixingQueue" with the generated ID
    const message = JSON.stringify({ id: generatedId, url });
    channel.sendToQueue("mixingQueue", Buffer.from(message), {
        persistent: true,
    });

    console.log(`Inserted page with ID ${generatedId} and sent to mixingQueue`);
}

// Consume messages from RabbitMQ
async function consumeMessages() {
    const connection = await connect(`amqp://${QUEUE_HOST}:${QUEUE_PORT}`);
    const channel = await connection.createChannel();
    await channel.assertQueue("renderQueue", { durable: true });
    await channel.assertQueue("mixingQueue", { durable: true });

    console.log("Waiting for messages...");
    channel.consume("renderQueue", async (msg) => {
        const url = msg.content.toString();
        console.log(`Rendering: ${url}`);

        try {
            await renderPage(url, channel);
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