import { existsSync, readFileSync } from "fs";
import { connect } from "amqplib"; // RabbitMQ client

const SECRET_PATH = "/run/secrets/admin_password";
const ADMIN_PASSWORD = existsSync(SECRET_PATH)
    ? readFileSync(SECRET_PATH, "utf-8").trim()
    : process.env.ADMIN_PASSWORD || "password";

// RabbitMQ connection details
const QUEUE_HOST = process.env.QUEUE_HOST || "queue"; // or "queue"
const QUEUE_PORT = process.env.QUEUE_PORT || "5672";
const QUEUE_NAME = "renderQueue";

// Function to send a message to RabbitMQ
async function sendToQueue(url: string) {
    try {
        const connection = await connect(`amqp://${QUEUE_HOST}:${QUEUE_PORT}`);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        channel.sendToQueue(QUEUE_NAME, Buffer.from(url));
        console.log(`Message sent to queue: ${url}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Failed to send message to RabbitMQ:", error);
        throw new Error("Queue message failed");
    }
}

// Admin route
export default async function adminRoute(req: Request, pool: any) {
    const url = new URL(req.url);
    const password = url.searchParams.get("password");

    if (password !== ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

/*    if (url.pathname.endsWith("/fetchSite")) {
        const siteUrl = url.searchParams.get("url");

        if (!siteUrl) {
            return new Response("Missing 'url' query parameter", { status: 400 });
        }

        try {
            await sendToQueue(siteUrl);
            return new Response(`Site ${siteUrl} added to fetch queue`, { status: 200 });
        } catch (error) {
            return new Response("Failed to add site to queue", { status: 500 });
        }
    }

    return new Response("Not Found", { status: 404 });*/
}
