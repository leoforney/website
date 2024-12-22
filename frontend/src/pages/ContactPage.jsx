import React from 'react';
import Typography from "@mui/material/Typography";
import {Avatar, Card, CardActions, CardContent, CardMedia, Container, Grid, ListItemAvatar} from "@mui/material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {getAnalytics, logEvent} from "firebase/analytics";
import {firebaseApp} from "../WebsiteFirebaseConfig.js";

const analytics = getAnalytics(firebaseApp);


class ContactPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            socials: [
                {
                    "name": "GitHub",
                    "icon": <GitHubIcon />,
                    "link": "https://github.com/leoforney"
                },
                {
                    "name": "X",
                    "icon": <XIcon />,
                    "link": "https://x.com/leo_forney"
                },
                {
                    "name": "LinkedIn",
                    "icon": <LinkedInIcon />,
                    "link": "https://www.linkedin.com/in/leo-forney-82850317a/"
                },
                {
                    "name": "Email",
                    "icon": <EmailIcon />,
                    "link": "mailto:forneyleo@gmail.com"
                },
            ]
        }
    }

    componentDidMount() {
        logEvent(analytics, 'page_opened',
            {
                name: "Contact"
            });
    }

    render() {
        return (
            <Container maxWidth={"sm"}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >

                    <Card sx={{ justifyContent: "center"}}>
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            sx={{maxHeight: "60vh"}}
                            image="/img/headshot1.jpg"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                My contact
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ width: "100%" }}>
                            <List sx={{ width: "100%" }}>
                                {this.state.socials.map((social) => {
                                    return (
                                        <ListItemButton size="small" href={social.link} sx={{ width: "100%" }} onClick={() => {
                                            logEvent(analytics, "social_clicked", {
                                                name: social.name
                                            })
                                        }}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {social.icon}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={social.name}/>
                                        </ListItemButton>
                                    )
                                })}
                                <Button variant={"contained"} href="/api/leo.vcf" sx={{ mt: 2 }} onClick={() => {
                                    logEvent(analytics, 'contact_downloaded');
                                }}>
                                    Save contact
                                </Button>
                            </List>
                        </CardActions>
                    </Card>
                    <Box sx={{height: 15}} />

                </Grid>
            </Container>
        )
    }

}

export default ContactPage;
