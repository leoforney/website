import ProjectDetails from '../components/ProjectDetails';
import {Box, Button, Container, Divider, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchProjectById} from "../api.js";

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const project = await fetchProjectById(id);
            setProject(project);
        };

        fetchData();
    }, [id]);

    const toggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <Container maxWidth={"sm"} fixed>
            <Typography variant={"h2"}>{project ? project.name : ""}: Posts</Typography>
            <Divider sx={{ mt: 2 }} />

            {/* Expandable Summary */}
            {project?.summary && (
                <Box
                    sx={{
                        mt: 2,
                        border: "1px solid white",
                        borderRadius: "8px",
                        padding: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Summary
                    </Typography>
                    <Box
                        sx={{
                            maxHeight: expanded ? "none" : "100px",
                            overflow: "hidden",
                        }}
                    >
                        <Typography>{project.summary}</Typography>
                    </Box>
                    <Button
                        onClick={toggleExpand}
                        size="small"
                        sx={{ mt: 1 }}
                        fullWidth
                        variant="outlined"
                    >
                        {expanded ? "Read Less" : "Read More"}
                    </Button>
                </Box>
            )}

            <ProjectDetails />
        </Container>
    );
};

export default ProjectDetailsPage;
