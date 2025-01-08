import { existsSync, readFileSync } from "fs";

const SECRET_PATH = "/run/secrets/admin_password";
const ADMIN_PASSWORD = existsSync(SECRET_PATH)
    ? readFileSync(SECRET_PATH, "utf-8").trim()
    : process.env.ADMIN_PASSWORD || "password";

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
