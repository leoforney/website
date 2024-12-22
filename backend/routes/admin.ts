import {existsSync, readFileSync} from "fs";

const SECRET_PATH = "/run/secrets/admin_password";
const ADMIN_PASSWORD = existsSync(SECRET_PATH)
    ? readFileSync(SECRET_PATH, "utf-8").trim()
    : process.env.ADMIN_PASSWORD || "password";

export default async function adminRoute(req: Request, pool: any) {
    const url = new URL(req.url);
    const password = url.searchParams.get("password");

    if (password !== ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
    }

}
