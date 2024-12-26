import {fetchPostsByProjectId} from "../models/postModel.ts";
import {createHeadlessEditor} from "@lexical/headless";
import {updateProjectSummary} from "../models/projectModel.ts";
import {extractPlainText, makeNewChatSession} from "./util.ts";

const editor = createHeadlessEditor();
const SUMMARY_PROMPT = "Summarize the current state of this project in a way that is clear and accessible to people from all backgrounds, while maintaining a moderate level of technical depth. Focus on what the project is, what it does, its key features or achievements so far, do not talk about the next steps or what's planned. Keep the summary concise and limited to a single paragraph, around 5 sentences but no more than 8. You are writing this in the perspective of the author, but do try to not use the word \'I\'.";

async function summarizeEditorState(posts: string[]) {
    const chatSession = makeNewChatSession(SUMMARY_PROMPT);

    const textData = posts.join(' ');

    const result = await chatSession.sendMessage(textData);
    return result.response.text();
}

export async function summarizeProject(pool: any, projectId: number) {
    const allPostsForProject: any[] = await fetchPostsByProjectId(pool, projectId);
    const editorStates = allPostsForProject.map(p => p.editor_state);
    const editorContent: string[] = editorStates.map((editorState) => extractPlainText(editorState, editor));
    const summary = await summarizeEditorState(editorContent);
    return await updateProjectSummary(pool, projectId, summary);
}