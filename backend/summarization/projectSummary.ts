import {fetchPostsByProjectId} from "../models/postModel.ts";
import {createHeadlessEditor} from "@lexical/headless";
import {bulkUpdateProjectRank, updateProjectResumePoints} from "../models/projectModel.ts";
import {extractPlainText, makeNewChatSession} from "./util.ts";
import {getAllProjects} from "../controllers/projectsController.ts";

const editor = createHeadlessEditor();
const SUMMARY_PROMPT = "Summarize the current state of this project in a way that is clear and accessible to people from all backgrounds, while maintaining a moderate level of technical depth. Focus on what the project is, what it does, its key features or achievements so far, do not talk about the next steps or what's planned. Keep the summary concise and limited to a single paragraph, around 5 sentences but no more than 8. You are writing this in the perspective of the author, but do try to not use the word \'I\'.";
const RESUME_POINTS_PROMPT = "Given the provided text describing a single project with multiple components, generate concise bullet points suitable for a software engineering resume. Treat all details as part of the same project, regardless of the complexity or the number of posts. Focus on the most important features, functionalities, and concepts that demonstrate technical expertise, problem-solving, and impact. Each bullet point should:\n" +
    "\n" +
    "Highlight key technologies, tools, frameworks, and methodologies used.\n" +
    "Emphasize major achievements, contributions, or innovations, prioritizing those most relevant to potential employers.\n" +
    "Be concise (at most around 12 words) and avoid unnecessary repetition or overly technical jargon.\n" +
    "Use action-oriented language (e.g., 'developed,' 'implemented,' 'designed,' 'optimized') and focus on measurable or impactful outcomes where possible.\n" +
    "Include 3-5 bullet points, weighing and selecting the most important aspects of the project to maintain brevity and relevance.\n" +
    "Separate each point with an asterisk (*).";
const RESUME_RANK_PROMPT = "You will read and rank personal side projects that belong on resume. The goal is to tailor these rankings to both technical and hiring managers. You will rank based on technical complexity, real world applicationable ability, and just plain interest that you think hiring managers/technical engineers might have. Together with all these criteria, you will create a combined score for each project. Each project must have a unique score, from 0 (not important, should basically not be shown) to 1000 (should be shown immediately). Each project will start with a <SP> and end with a <EP>. There will be the resume points that were created, the summary, and the creator description (defined by the user). Read through each project and understand it, then use the criteria that was mentioned to create the \"score\". Return for each project";

const projectRankGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            project: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number"
                        },
                        score: {
                            type: "number"
                        }
                    }
                }
            }
        }
    },
};

interface ProjectRankEntry {
    id: number;
    score: number;
}

interface ProjectRankOutput {
    project: ProjectRankEntry[];
}

async function summarizeEditorState(posts: string[]) {
    const summaryChatSession = makeNewChatSession(SUMMARY_PROMPT);

    const textData = posts.join(' ');

    const result = await summaryChatSession.sendMessage(textData);
    return result.response.text();
}

async function resumePointsFromEditorPosts(posts: string[]) {
    const resumePointsChatSession = makeNewChatSession(RESUME_POINTS_PROMPT);

    const textData = posts.join(' ');

    const result = await resumePointsChatSession.sendMessage(textData);
    return result.response.text();
}

export async function summarizeProject(pool: any, projectId: number) {
    const allPostsForProject: any[] = await fetchPostsByProjectId(pool, projectId);
    if (!allPostsForProject || allPostsForProject.length == 0) {
        return;
    }
    const editorStates = allPostsForProject.map(p => p.editor_state);
    const editorContent: string[] = editorStates.map((editorState) => extractPlainText(editorState, editor));
    const summary = await summarizeEditorState(editorContent);
    const resumePoints = await resumePointsFromEditorPosts(editorStates);
    await updateProjectResumePoints(pool, projectId, resumePoints);
    return await updateProjectResumePoints(pool, projectId, resumePoints);
}

export async function rankProjects(pool: any) {
    const projects = await getAllProjects(pool);
    const collectedProjectReports = projects
        .filter((p: any) => p.summary && p.resume_points)
        .map((p: any) => {
        return `<SP>project_id:${p.id}
            resume_points:${p.resume_points}
            summary:${p.summary}
            creator description:${p.description}
            <EP>`;
        })
        .join('');
    const resumeRankChatSession = makeNewChatSession(RESUME_RANK_PROMPT, projectRankGenerationConfig);
    const result = await resumeRankChatSession.sendMessage(collectedProjectReports);
    const ranks: ProjectRankOutput = JSON.parse(result.response.text());
    const updatedProjects = await bulkUpdateProjectRank(pool, ranks.project);
    console.log(`Updated rankings: ${JSON.stringify(ranks.project)}`)
    return ranks.project;
}