import {existsSync, readFileSync} from "fs";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {$getRoot} from "lexical";

const SECRET_PATH = "/run/secrets/gemini_key";
const apiKey = existsSync(SECRET_PATH)
    ? readFileSync(SECRET_PATH, "utf-8").trim()
    : process.env.GEMINI_KEY || "";
export const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export function makeNewChatSession(systemPrompt: string) {
    const summarizationModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt
    });

    const chatSession = summarizationModel.startChat({
        generationConfig,
        history: [
        ],
    });
    return chatSession;
}

export function extractPlainText(editorStateJSON: any, editor: any) {
    if (!editorStateJSON) {
        return undefined;
    }
    const parsedEditorState = editor.parseEditorState(editorStateJSON);
    return parsedEditorState.read(() => $getRoot().getTextContent())
}
