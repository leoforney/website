import './App.css';
import React from 'react';
import DrawerAppBar from "./DrawerAppBar.jsx";
import {Container, createTheme, Fab, Fade, ThemeProvider, useScrollTrigger} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import router from './config/Router.jsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {RouterProvider,} from "react-router-dom";

dayjs.extend(utc)

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: [
            "Source Code Pro",
            "Menlo",
            "Monaco",
            "Consolas",
            "Monospaced"
        ].join(','),
    },
    components: {
        MuiCssBaseline: {
        }
    },
});

theme.typography.h1 = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    '@media (min-width:600px)': {
        fontWeight: 'bold',
        fontSize: '4rem',
    },
    [theme.breakpoints.up('md')]: {
        fontWeight: 'normal',
        fontSize: '6rem',
    },
};

theme.typography.h2 = {
    fontSize: '2rem',
    fontWeight: 'bold',
    '@media (min-width:600px)': {
        fontSize: '2.25rem',
    },
    [theme.breakpoints.up('md')]: {
        fontWeight: 'normal',
        fontSize: '2.65rem',
    },
};


theme.typography.h3 = {
    fontSize: '1.5rem',
    '@media (min-width:600px)': {
        fontSize: '1.75rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2.25rem',
    },
};

theme.typography.h4 = {
    fontSize: '1.25rem',
    fontWeight: 'normal',
    '@media (min-width:600px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2rem',
    },
};

function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

function ScrollTop(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );

        if (anchor) {
            anchor.scrollIntoView({
                block: 'center',
            });
        }
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {children}
            </Box>
        </Fade>
    );
}

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <ElevationScroll {...this.props}>
                    <DrawerAppBar />
                </ElevationScroll>
                <Box sx={{height: 0}} id="back-to-top-anchor" />
                <Container maxWidth={"xl"}>
                    <RouterProvider router={router} />
                </Container>

                <ScrollTop {...this.props}>
                    <Fab size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
            </ThemeProvider>
        )
    }

}

export default App;
