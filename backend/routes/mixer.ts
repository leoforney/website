import { connect } from "amqplib";
import adminRoute from "./admin.ts"; // RabbitMQ client

// RabbitMQ connection details
const QUEUE_HOST = process.env.QUEUE_HOST || "localhost"; // or "queue"
const QUEUE_PORT = process.env.QUEUE_PORT || "5672";
const QUEUE_NAME = "renderQueue";
const MIXING_QUEUE_NAME = "mixingQueue";

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

// Function to listen for messages on the mixingQueue
async function listenToMixingQueue() {
    try {
        const connection = await connect(`amqp://${QUEUE_HOST}:${QUEUE_PORT}`);
        const channel = await connection.createChannel();
        await channel.assertQueue(MIXING_QUEUE_NAME, { durable: true });

        console.log("Listening for messages on mixingQueue...");

        channel.consume(MIXING_QUEUE_NAME, (msg) => {
            if (msg !== null) {
                console.log(`Received message: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Failed to listen to mixingQueue:", error);
    }
}

export default async function mixerRoute(req: Request, pool: any) {
    const url = new URL(req.url);
    const searchUrl = url.searchParams.get("url");

    if (req.method === "GET") {
        // TODO: GET MIXINGS AND SPECIFIC MIXING BY ID
        return new Response("{}", { status: 200 });
    }

    if (req.method === "POST" && searchUrl) {
        const deniedResponse = await adminRoute(req, pool);
        if (deniedResponse) {
            return deniedResponse;
        }

        await sendToQueue(searchUrl);
        return new Response("Queued URL", { status: 201 });
    }

    return new Response("Method not allowed", { status: 405 });
}

listenToMixingQueue();