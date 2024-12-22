import {fetchPostsByProjectId} from "../models/postModel.ts";
import {createHeadlessEditor} from "@lexical/headless";
import {$getRoot} from "lexical";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {updateProjectSummary} from "../models/projectModel.ts";
import {existsSync, readFileSync} from "fs";

const editor = createHeadlessEditor();
const SECRET_PATH = "/run/secrets/gemini_key";
const apiKey = existsSync(SECRET_PATH)
    ? readFileSync(SECRET_PATH, "utf-8").trim()
    : process.env.GEMINI_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Summarize the current state of this project in a way that is clear and accessible to people from all backgrounds, while maintaining a moderate level of technical depth. Focus on what the project is, what it does, its key features or achievements so far, do not talk about the next steps or what's planned. Keep the summary concise and limited to a single paragraph, around 5 sentences but no more than 8. You are writing this in the perspective of the author.",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function summarizeEditorState(posts: string[]) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const textData = posts.join(' ');

    const result = await chatSession.sendMessage(textData);
    return result.response.text();
}

function extractPlainText(editorStateJSON: any) {
    const parsedEditorState = editor.parseEditorState(editorStateJSON);
    return parsedEditorState.read(() => $getRoot().getTextContent())
}

export async function summarizeProject(pool: any, projectId: number) {
    const allPostsForProject: any[] = await fetchPostsByProjectId(pool, projectId);
    const editorStates = allPostsForProject.map(p => p.editor_state);
    const editorContent: string[] = editorStates.map(extractPlainText);
    const summary = await summarizeEditorState(editorContent);
    return await updateProjectSummary(pool, projectId, summary);
}