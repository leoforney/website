import {createPost, getAllPosts, getPostById, getPostsByProjectId, updatePost} from "../controllers/postsController";
import adminRoute from "./admin.ts";
import {rankProjects, summarizeProject} from "../summarization/projectSummary.ts";
import {generateResumePdf} from "../summarization/topicSummary.ts";

export default async function postsRoute(req: Request, pool: any) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const projectId = url.searchParams.get("project_id");
    console.log("Posts")

    if (req.method === "GET") {
        if (id) {
            const post = await getPostById(pool, parseInt(id));
            return new Response(JSON.stringify(post), { status: 200 });
        } else if (projectId) {
            const posts = await getPostsByProjectId(pool, parseInt(projectId))
            return new Response(JSON.stringify(posts), { status: 200 });
        } else {
            const posts = await getAllPosts(pool);
            return new Response(JSON.stringify(posts), { status: 200 });
        }
    }

    if (req.method === "PATCH" || req.method === "POST") {
        const data = await req.json();

        let response;

        if (req.method === "POST") {
            const deniedResponse = await adminRoute(req, pool);
            if (deniedResponse) {
                return deniedResponse;
            }

            const newPost = await createPost(pool, data);
            response = new Response(JSON.stringify(newPost), { status: 201 });
        }

        if (req.method === "PATCH") {
            const deniedResponse = await adminRoute(req, pool);
            if (deniedResponse) {
                return deniedResponse;
            }

            const postId = data.id;
            const post = await updatePost(pool, postId, data);
            response = new Response(JSON.stringify(post), { status: 201 });
        }

        if (data.project_id) {
            summarizeProject(pool, data.project_id).then(async (p) => {
                await rankProjects(pool);
                await generateResumePdf(pool, p.topic_id);
            })
        }

        return response;
    }

    return new Response("Method not allowed", { status: 405 });
}
