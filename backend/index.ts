import {serve} from "bun";
import router from "./routes/index";
import {getPool} from "./config/db";
import {migrate} from "./config/migrate";

(async () => {
    await migrate();

    // @ts-ignore
    serve({
        development: process.env.NODE_ENV !== "production",
        port: 3000,
        async fetch(req) {
            const pool = getPool();
            const res = await router(req, pool);
            if (res) {
                res.headers.set('Access-Control-Allow-Origin', '*');
                res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                return res;
            } else {
                return new Response("Internal Server Error", { status: 500 });
            }
        },
    });

    console.log("Backend running at http://localhost:3000");
})();