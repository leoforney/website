import React from 'react';
import Box from "@mui/material/Box";
import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ResumesList from "../components/ResumesList.jsx";

const ResumePage = () => {

    return (
        <Container maxWidth={"sm"} fixed>
            <Box>
                <Typography variant={"h2"}>Resume</Typography>
                <Divider sx={{ mt: 2 }} />
                <ResumesList />
            </Box>
        </Container>
    );
};

export default ResumePage;
