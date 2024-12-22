import React, {useState} from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import {createProject, updateProject} from "../../api.js";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";

const ProjectModal = ({
                          open,
                          onClose,
                          onSave,
                          topics,
                          project = null,
                      }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTopic, setSelectedTopic] = useState(null);

    React.useEffect(() => {
        if (project) {
            setName(project.name || "");
            setDescription(project.description || "");
            setSelectedTopic(project.topic_id || null);
        } else {
            setName("");
            setDescription("");
            setSelectedTopic(null);
        }
    }, [project]);

    const handleSave = async () => {
        const projectData = {
            project_id: project?.id || undefined,
            name,
            topic_id: selectedTopic,
            description,
        };

        try {
            if (project) {
                await updateProject(projectData);
            } else {
                await createProject(projectData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginBottom: "16px" }}
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    style={{ marginBottom: "16px" }}
                />
                <Typography variant="subtitle1" style={{ marginBottom: "8px" }}>
                    Select Topic
                </Typography>
                <Box display="flex" overflow="auto" whiteSpace="nowrap">
                    <Chip
                        label="None"
                        clickable
                        onClick={() => setSelectedTopic(null)}
                        color={selectedTopic === null ? "primary" : "default"}
                        style={{ marginRight: "8px" }}
                    />
                    {topics.map((topic) => (
                        <Chip
                            key={topic.id}
                            label={topic.name}
                            clickable
                            onClick={() => setSelectedTopic(topic.id)}
                            color={selectedTopic === topic.id ? "primary" : "default"}
                            style={{ marginRight: "8px" }}
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const AdminProjectsList = ({ projects, selectedProject, onProjectSelect, onAddProject, onEditProject, topics }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const handleAddProject = () => {
        setEditingProject(null);
        setModalOpen(true);
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            await onAddProject();
        } catch (error) {
            console.error("Error refreshing project list:", error);
        } finally {
            setModalOpen(false);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h6">Projects</Typography>
                <Button onClick={handleAddProject} style={{ marginLeft: '6px' }}>
                    + Add Project
                </Button>
            </Box>
            <List sx={{overflow: 'auto', maxHeight: 300}}>
                {projects.map((project) => (
                    <ListItem
                        key={project.id}
                        button
                        selected={selectedProject?.id === project.id}
                        onClick={() => onProjectSelect(project)}
                        style={{ justifyContent: "space-between" }}
                    >
                        <ListItemText primary={project.name} />
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditProject(project);
                            }}
                        >
                            Edit
                        </Button>
                    </ListItem>
                ))}
            </List>
            <ProjectModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                topics={topics}
                project={editingProject}
            />
        </>
    );
};

export default AdminProjectsList;
