import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchPostById} from '../api';
import {Box, CircularProgress, Typography} from '@mui/material';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import './editor/Editor.css';
import EditorTheme from "./editor/EditorTheme.js";
import dayjs from "dayjs";

const ReadOnlyPlugin = ({ initialContent }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.update(() => {
            const parsedContent = JSON.parse(initialContent);
            editor.setEditorState(editor.parseEditorState(parsedContent));
        });
    }, [editor, initialContent]);

    return null;
};

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await fetchPostById(id);
                setPost(postData);
            } catch (error) {
                console.error("Failed to fetch post:", error);
                setPost(false);
            }
        };

        fetchData();
    }, [id]);

    if (post === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (post === false) {
        return (
            <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
                Failed to load post. Please try again later.
            </Typography>
        );
    }

    const initialConfig = {
        namespace: 'PostDetailsEditor',
        theme: EditorTheme,
        onError: (error) => console.error(error),
        editable: false,
        nodes: [],
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={"bold"}>{post.title}</Typography>
            <Typography variant="subtitle1">
                Last updated: {dayjs.utc(post.updated_at || post.created_at).format('MM/DD/YYYY: h:mm A')}
            </Typography>
            <Box sx={{ mt: 2 }}>
                <LexicalComposer initialConfig={initialConfig}>
                    <ReadOnlyPlugin initialContent={post.editor_state} />
                    <ContentEditable className="readonly-editor" />
                    <HistoryPlugin />
                </LexicalComposer>
            </Box>
        </Box>
    );
};

export default PostDetails;
