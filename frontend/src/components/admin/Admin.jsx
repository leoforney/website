import React, {useEffect, useState} from "react";
import {Box, Button, Grid, TextField} from "@mui/material";
import {fetchPostsByProjectId, fetchProjects, fetchTopics, savePost, updatePost} from "../../api.js";
import AdminProjectsList from "./AdminProjectList";
import AdminPostsList from "./AdminPostsList";
import AdminTopicsList from "./AdminTopicsList";
import {Editor} from "../editor/Editor.jsx";

const Admin = () => {
    const [projects, setProjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editorState, setEditorState] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [postTitle, setPostTitle] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const projectsData = await fetchProjects();
            const topicsData = await fetchTopics();
            setProjects(projectsData);
            setTopics(topicsData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (selectedProject) {
                const postsData = await fetchPostsByProjectId(selectedProject.id);
                setPosts(postsData);
            }
        };
        fetchPosts();
    }, [selectedProject]);

    const handleSavePost = async () => {
        const editor_state = JSON.stringify(editorState);
        if (isCreating) {
            await savePost({ project_id: selectedProject.id, title: postTitle, editor_state: editor_state });
        } else {
            await updatePost({ ...selectedPost, title: postTitle, editor_state: editor_state });
        }
        const postsData = await fetchPostsByProjectId(selectedProject.id);
        setPosts(postsData);
        setIsCreating(false);
    };

    return (
        <Box style={{ padding: "16px", border: "1px solid #ccc" }}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <AdminProjectsList
                        projects={projects}
                        topics={topics}
                        selectedProject={selectedProject}
                        onProjectSelect={setSelectedProject}
                        onAddProject={async () => {
                            const projectsData = await fetchProjects();
                            setProjects(projectsData);
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <AdminPostsList
                        posts={posts}
                        selectedPost={selectedPost}
                        onPostSelect={(post) => {
                            setSelectedPost(post);
                            setEditorState(JSON.parse(post.editor_state));
                            setPostTitle(post.title);
                            setIsCreating(false);
                        }}
                        onCreatePost={() => {
                            setSelectedPost(null);
                            setEditorState(null);
                            setPostTitle("");
                            setIsCreating(true);
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <AdminTopicsList
                        topics={topics}
                    />
                </Grid>
            </Grid>
            {(selectedPost || isCreating) && (
                <Box style={{ marginTop: "16px" }}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        style={{ marginBottom: "8px" }}
                    />
                    <Editor editorState={editorState} setEditorState={setEditorState} />
                    <Button
                        onClick={handleSavePost}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "8px" }}
                    >
                        Save Post
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Admin;
