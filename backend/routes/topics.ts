import {createTopic, getAllTopics, getTopicById} from "../controllers/topicsController";
import adminRoute from "./admin.ts";

export default async function topicsRoute(req: Request, pool: any) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (req.method === "GET") {
        if (id) {
            const topic = await getTopicById(pool, parseInt(id));
            return new Response(JSON.stringify(topic), { status: 200 });
        } else {
            const topics = await getAllTopics(pool);
            return new Response(JSON.stringify(topics), { status: 200 });
        }
    }

    if (req.method === "POST") {
        const deniedResponse = await adminRoute(req, pool);
        if (deniedResponse) {
            return deniedResponse;
        }
        const body = await req.json();
        const newTopic = await createTopic(pool, body);
        return new Response(JSON.stringify(newTopic), { status: 201 });
    }

    return new Response("Method not allowed", { status: 405 });
}
