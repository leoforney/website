import {useEffect, useRef} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import EditorTheme from "./EditorTheme.js";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import ToolbarPlugin from "../admin/ToolbarPlugin.tsx";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {TabIndentationPlugin} from "@lexical/react/LexicalTabIndentationPlugin";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import Box from "@mui/material/Box";
import "./Editor.css";

function MyOnChangePlugin({ editorState, setEditorState }) {
    const [editor] = useLexicalComposerContext();
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const unregisterUpdateListener = editor.registerUpdateListener(({ editorState: newEditorState }) => {
            setEditorState(newEditorState); // Notify parent of changes
        });

        return () => {
            unregisterUpdateListener();
        };
    }, [editor, setEditorState]);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            if (editorState) {
                editor.update(() => {
                    editor.setEditorState(editor.parseEditorState(editorState));
                });
            }
        }
    }, [editor, editorState]);

    return null;
}

export function Editor({ editorState, setEditorState }) {
    const initialConfig = {
        namespace: "MyEditor",
        theme: EditorTheme,
        onError: console.error,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <Box
                sx={{
                    minHeight: "500px",
                    flexGrow: 1,
                    margin: "16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <ToolbarPlugin />
                <Box
                    className="editor-inner editor-shell"
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                    <RichTextPlugin
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            padding: "8px",
                        }}
                        contentEditable={
                            <ContentEditable
                                className="editor-input"
                                aria-placeholder=""
                                placeholder=""
                                sx={{
                                    flexGrow: 1,
                                    overflowY: "auto",
                                    padding: "8px",
                                }}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </Box>
                <TabIndentationPlugin />
                <MyOnChangePlugin
                    editorState={editorState}
                    setEditorState={setEditorState}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
            </Box>
        </LexicalComposer>
    );
}
