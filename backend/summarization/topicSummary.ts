import {fetchPostsByTopicId} from "../models/postModel.ts";
import {createParentDirs, renderTopicPdf} from "./renderer.tsx";
import {extractPlainText, makeNewChatSession} from "./util.ts";
import {createHeadlessEditor} from "@lexical/headless";
import path from "path";
import {fetchTopicById} from "../models/topicModel.ts";

const RESUME_POINTS_PROMPT = "Given the provided text describing a single project with multiple components, generate concise bullet points suitable for a software engineering resume. Treat all details as part of the same project, regardless of the complexity or the number of posts. Focus on the most important features, functionalities, and concepts that demonstrate technical expertise, problem-solving, and impact. Each bullet point should:\n" +
    "\n" +
    "Highlight key technologies, tools, frameworks, and methodologies used.\n" +
    "Emphasize major achievements, contributions, or innovations, prioritizing those most relevant to potential employers.\n" +
    "Be concise (at most around 12 words) and avoid unnecessary repetition or overly technical jargon.\n" +
    "Use action-oriented language (e.g., 'developed,' 'implemented,' 'designed,' 'optimized') and focus on measurable or impactful outcomes where possible.\n" +
    "Include 3-5 bullet points, weighing and selecting the most important aspects of the project to maintain brevity and relevance.\n" +
    "Separate each point with an asterisk (*).";

function splitSummaries(summary: string): string[] {
    return summary
        .split('*')
        .map((bullet) => bullet.trim())
        .filter((bullet) => bullet.length > 0);
}

async function summarizeEditorState(posts: string[]): Promise<string> {
    const chatSession = makeNewChatSession(RESUME_POINTS_PROMPT);

    const textData = posts.join(' ');

    const result = await chatSession.sendMessage(textData);
    return result.response.text();
}

const editor = createHeadlessEditor();

export const groupPostsByProject = (posts) => {
    return posts.reduce((acc, post) => {
        const { project_name, editor_state } = post;

        let project = acc.find((p) => p.name === project_name);
        if (!project) {
            project = { name: project_name, editorContentText: [] };
            acc.push(project);
        }

        const plainText = extractPlainText(JSON.parse(editor_state), editor);
        if (plainText) {
            project.editorContentText.push(plainText);
        }

        return acc;
    }, []);
};

export const summarizeGroupedProjects = async (groupedProjects) => {
    return Promise.all(
        groupedProjects.map(async (project) => {
            const summaryPoint = await summarizeEditorState(project.editorContentText);
            return {
                name: project.name,
                summaryPoints: splitSummaries(summaryPoint),
            };
        })
    );
};


export async function generateTopicPdf(pool: any, topicId: number) {
    const posts = await fetchPostsByTopicId(pool, topicId);
    const grouped = groupPostsByProject(posts);
    const summarized = await summarizeGroupedProjects(grouped)

    const topic = await fetchTopicById(pool, topicId);

    const outputPath = path.join(process.cwd(), 'generated', `Leo_Forney_${topic.name}.pdf`);

    await createParentDirs(outputPath);

    await renderTopicPdf(summarized, outputPath);
}

