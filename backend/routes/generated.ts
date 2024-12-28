import {join, normalize} from "path";
import {readFile, stat} from "fs/promises";

const generatedDir = join(process.cwd(), "generated");

export async function serveGeneratedFile(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const filename = url.pathname.replace("/api/generated/", "").trim();

    if (!filename || filename.includes("..")) {
        return new Response("Forbidden", { status: 403 });
    }

    const filePath = join(generatedDir, normalize(filename));
    console.log(`filepath: ${filePath}`)

    try {
        const dirStats = await stat(generatedDir);
        if (!dirStats.isDirectory()) {
            throw new Error("Generated folder is not a directory");
        }

        const fileStats = await stat(filePath);
        if (!fileStats.isFile()) {
            return new Response("Not Found", { status: 404 });
        }

        const fileContent = await readFile(filePath);
        return new Response(fileContent, {
            status: 200,
            headers: {
                "Content-Type": "application/octet-stream",
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });
    } catch (err) {
        if (err.code === "ENOENT") {
            return new Response("Not Found", { status: 404 });
        }
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
}