import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import ToolbarPlugin from "../admin/ToolbarPlugin.tsx";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {TabIndentationPlugin} from "@lexical/react/LexicalTabIndentationPlugin";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {useEffect, useRef} from "react";
import Box from "@mui/material/Box";
import './Editor.css';
import {$getRoot} from "lexical";
import EditorTheme from "./EditorTheme.js";

function onError(error) {
    console.error(error);
}

function MyOnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();
    const editorStateRef = useRef({});

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorStateRef.current = editorState;
            onChange(editorState);
        });
    }, [editor, onChange]);

    return null;
}

function RestoreEditorStatePlugin({ editorState: initialEditorState }) {
    const [editor] = useLexicalComposerContext();
    const editorStateRef = useRef(initialEditorState);

    useEffect(() => {
        if (initialEditorState) {
            editor.update(() => {
                const newState = editor.parseEditorState(initialEditorState);
                editor.setEditorState(newState);
                editorStateRef.current = newState;
            });
        } else {
            editor.update(() => {
                const root = $getRoot();
                root.clear();
            });
        }
    }, [editor, initialEditorState]);

    return null;
}
export function Editor({ editorState, setEditorState }) {
    const initialConfig = {
        namespace: 'MyEditor',
        theme: EditorTheme,
        onError,
    };

    function onChange(editorState) {
        setEditorState(editorState);
    }

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
                    className="editor-inner"
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        padding: "8px",
                    }}
                >
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="editor-input"
                                aria-placeholder={""}
                                placeholder={""}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                        initialEditorState={editorState}
                    />
                </Box>
                <TabIndentationPlugin />
                <MyOnChangePlugin onChange={onChange} />
                <RestoreEditorStatePlugin editorState={editorState} />
                <HistoryPlugin />
                <AutoFocusPlugin />
            </Box>
        </LexicalComposer>
    );
}
