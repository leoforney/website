import React, {Suspense, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Box, Button, CssBaseline, Grid} from "@mui/material";
import {getAnalytics, logEvent} from "firebase/analytics";
import {firebaseApp} from "../WebsiteFirebaseConfig.js";
import {PLYViewer, SkeletonViewer} from "../components/PLYViewer.jsx";
import {fetchTopics} from "../api.js";
import {useNavigate} from "react-router-dom";

const analytics = getAnalytics(firebaseApp);

const AboutPage = () => {
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        logEvent(analytics, 'page_opened', { name: "About" });

        const getTopics = async () => {
            try {
                const data = await fetchTopics();
                setTopics(data);
            } catch (error) {
                console.error("Failed to fetch topics:", error);
            }
        };

        getTopics();
    }, []);

    const handleTopicClick = (id) => {
        const encodedId = encodeURIComponent(id);
        navigate(`/projects?topics=${encodedId}`);
    };

    return (
        <Box>
            <Grid container sx={{ display: "flex", flexDirection: "row" }}>
                <CssBaseline />
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "10px",
                        aspectRatio: "1 / 1",
                        position: "relative",
                    }}
                >
                    <Suspense fallback={<SkeletonViewer />}>
                        <PLYViewer />
                    </Suspense>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        pl: 5,
                        pr: 5,
                        height: "100%",
                    }}
                >
                    <Typography variant={"h1"} className={"flashingText"} sx={{ textAlign: "left" }}>
                        Hi I'm Leo
                    </Typography>
                    <Typography variant={"h4"} sx={{ textAlign: "left" }}>
                        I'm a software engineer based out of Chicago who's extremely passionate about devising
                        software that helps people.
                    </Typography>
                    <Typography
                        variant={"h4"}
                        sx={{
                            mt: 3,
                            textAlign: "left",
                        }}
                    >
                        My passions:
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            mt: 2,
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {topics.map((topic) => (
                            <Grid
                                item
                                key={topic.id}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                sx={{ display: "flex", justifyContent: "center" }}
                            >
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => handleTopicClick(topic.id)}
                                >
                                    {topic.name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sx={{ height: "100%", width: "100%", mt: 5, mb: 10 }}
                >
                    <Button
                        variant={"contained"}
                        sx={{ height: "100%", width: "100%" }}
                        href={"/projects"}
                    >
                        Check out my work
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AboutPage;
