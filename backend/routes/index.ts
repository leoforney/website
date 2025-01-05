import postsRoute from "./posts";
import projectsRoute from "./projects";
import topicsRoute from "./topics";
import adminRoute from "./admin";
import {serveStaticFile} from "./static.ts";
import {vcardRoute} from "./vcard.ts";
import {serveGeneratedFile} from "./generated.ts";

export default async function router(req: Request, pool: any) {
    const url = new URL(req.url);

    console.log(url.pathname)

    if (url.pathname.startsWith("/api/posts")) {
        return postsRoute(req, pool);
    } else if (url.pathname.startsWith("/api/projects")) {
        return projectsRoute(req, pool);
    } else if (url.pathname.startsWith("/api/topics")) {
        return topicsRoute(req, pool);
    } else if (url.pathname.startsWith("/api/admin")) {
        return adminRoute(req, pool);
    } else if (url.pathname.startsWith("/api/leo.vcf")) {
        return vcardRoute(req);
    } else if (url.pathname.startsWith("/api/generated/")) {
        return serveGeneratedFile(req);
    }

    return serveStaticFile(req);
}
