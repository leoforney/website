import React from 'react';
import {useSearchParams} from 'react-router-dom';
import ProjectList from '../components/ProjectList';
import Box from "@mui/material/Box";
import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const ProjectsPage = () => {
    const [searchParams] = useSearchParams();
    const topicFilter = searchParams.get('topics')?.split(',').map(Number) || [];

    return (
        <Container maxWidth={"sm"} fixed>
            <Box>
                <Typography variant={"h2"}>Projects</Typography>
                <Divider sx={{ mt: 2 }} />
                <ProjectList topicFilter={topicFilter} />
            </Box>
        </Container>
    );
};

export default ProjectsPage;
