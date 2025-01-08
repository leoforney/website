import { createParentDirs, renderTopicPdf, ResumeData } from "./renderer.tsx";
import path from "path";
import fs from "fs/promises";
import { fetchTopicById } from "../models/topicModel.ts";
import { fetchProjectsByTopicId } from "../models/projectModel.ts";

function splitSummaries(summary: string): string[] {
    return summary
        .split('*')
        .map((bullet) => bullet.trim())
        .filter((bullet) => bullet.length > 0);
}

async function readResumeData(): Promise<ResumeData> {
    const filePath = path.join(process.cwd(), "resumeData.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
}

export async function generateResumePdf(pool: any, topicId: number) {
    const projects = await fetchProjectsByTopicId(pool, topicId);
    const projectPointsDefinition = projects
        .sort((a, b) => {
            if (a.rank == null && b.rank == null) return 0;
            if (a.rank == null) return 1;
            if (b.rank == null) return -1;
            return b.rank - a.rank;
        })
        .filter((p) => p.resume_points)
        .map((p) => {
            return {
                name: p.name,
                summaryPoints: splitSummaries(p.resume_points),
            };
        });

    const topic = await fetchTopicById(pool, topicId);
    const outputPath = path.join(
        process.cwd(),
        "generated",
        `Leo_Forney_${topic.name}.pdf`
    );

    await createParentDirs(outputPath);

    const resumeData = await readResumeData();
    const copiedResumeBase = { ...resumeData, projects: projectPointsDefinition };

    await renderTopicPdf(copiedResumeBase, outputPath);
}
