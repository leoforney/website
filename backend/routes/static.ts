import {join} from "path";
import {readFile} from "fs/promises";

const buildDir = join("frontend", "build");

let indexHtml;
if (process.env.NODE_ENV !== "development") {
    indexHtml = await readFile(join(buildDir, "index.html"), "utf8");
}

export async function serveStaticFile(req) {
    const urlPath = new URL(req.url).pathname;

    console.log(urlPath);

    if (urlPath === "/") {
        if (process.env.NODE_ENV === "development") {
            const dynamicIndexHtml = await readFile(join(buildDir, "index.html"), "utf8");
            return new Response(dynamicIndexHtml, {
                status: 200,
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        return new Response(indexHtml, {
            status: 200,
            headers: {
                "Content-Type": "text/html",
            },
        });
    }

    const filePath = join(buildDir, urlPath);

    try {
        return new Response(await readFile(filePath), {
            status: 200,
            headers: {
                "Content-Type": getContentType(filePath),
                "Cache-Control": "public, max-age=31536000",
            },
        });
    } catch (err) {
        if (err.code === "ENOENT") {
            if (process.env.NODE_ENV === "development") {
                const dynamicIndexHtml = await readFile(join(buildDir, "index.html"), "utf8");
                return new Response(dynamicIndexHtml, {
                    status: 200,
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            }
            return new Response(indexHtml, {
                status: 200,
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        return new Response("Internal Server Error", { status: 500 });
    }
}

function getContentType(filePath) {
    const ext = filePath.split(".").pop();
    const contentTypes = {
        html: "text/html",
        js: "application/javascript",
        css: "text/css",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        svg: "image/svg+xml",
        ico: "image/x-icon",
        woff: "font/woff",
        woff2: "font/woff2",
        ttf: "font/ttf",
        eot: "application/vnd.ms-fontobject",
    };

    return contentTypes[ext] || "application/octet-stream";
}