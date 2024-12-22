import React from "react";
import {Button, List, ListItem, ListItemText, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

const PostsList = ({posts, selectedPost, onPostSelect, onCreatePost}) => (<>
        <Box sx={{ display: 'flex' }}>
            <Typography variant="h6">Posts</Typography>
            <Button onClick={onCreatePost} style={{ marginLeft: '6px' }}>
                + New Post
            </Button>
        </Box>

        <List sx={{overflow: 'auto', maxHeight: 300}}>
            {posts.map((post) => (<ListItem
                    key={post.id}
                    button
                    selected={selectedPost?.id === post.id}
                    onClick={() => onPostSelect(post)}
                >
                    <ListItemText primary={post.title} secondary={`Updated: ${dayjs.utc(post.updated_at).format('MM/DD/YYYY: h:mm A')}`}/>
                </ListItem>))}
        </List>
    </>);

export default PostsList;
