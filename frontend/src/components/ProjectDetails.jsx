import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchPostsByProjectId} from '../api';
import {Box, CircularProgress, List, ListItem, ListItemText} from '@mui/material';
import {NoEntries} from "./NoEntries.jsx";
import dayjs from "dayjs";

const ProjectDetails = () => {
    const { id } = useParams();
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsData = await fetchPostsByProjectId(id);
                const sortedPosts = postsData.sort((a, b) => {
                    const dateA = a.updated_at ? new Date(a.updated_at) : new Date(a.created_at);
                    const dateB = b.updated_at ? new Date(b.updated_at) : new Date(b.created_at);
                    return dateB - dateA;
                });
                setPosts(sortedPosts);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setPosts([]);
            }
        };

        fetchData();
    }, [id]);

    if (posts === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {posts.length === 0 ? (
                <NoEntries />
            ) : (
                <List>
                    {posts.map((post) => (
                        <ListItem key={post.id}>
                            <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText
                                    primary={post.title}
                                    secondary={`Last updated: ${
                                        dayjs.utc(post.updated_at || post.created_at)?.format('MM/DD/YYYY: h:mm A')
                                    }`}
                                />
                            </Link>
                        </ListItem>
                    ))}
                </List>
            )}
        </>
    );
};

export default ProjectDetails;
