import React from 'react';
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import Box from "@mui/material/Box";


class ErrorPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <Box>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >

                    <Box sx={{justifyContent: "center", textJustify: "center", mt: "15%"}}>
                        <Typography variant="h1" gutterBottom>
                            Page not found
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Are you sure you have the correct link?
                        </Typography>
                    </Box>
                    <Box sx={{height: 15}}/>

                </Grid>
            </Box>
        )
    }

}

export default ErrorPage;
