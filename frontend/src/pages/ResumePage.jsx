import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import { Container, Button, Modal, TextField, Typography, Divider } from "@mui/material";
import ResumesList from "../components/ResumesList.jsx";

// Utility function to get a cookie by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
};

const ResumePage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState('input'); // 'input' or 'result'
    const [jobUrl, setJobUrl] = useState('');

    useEffect(() => {
        const apiPassword = getCookie('apiPassword');
        if (apiPassword && apiPassword.trim() !== '') {
            setIsAdmin(true);
        }
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
        setModalStep('input');
        setJobUrl('');
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handlePost = () => {
        if (jobUrl.trim() === '') {
            // You might want to add more robust validation here
            alert('Please enter a valid URL.');
            return;
        }
        // Perform your post action here (e.g., API call)
        // After posting, move to the result step
        setModalStep('result');
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, // Adjust as needed
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Container maxWidth={"sm"} fixed>
            <Box>
                <Typography variant={"h2"}>Resume</Typography>
                <Divider sx={{ mt: 2 }} />
                {isAdmin && (
                    <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handleOpenModal}>
                            New AI Tailored resume
                        </Button>
                    </Box>
                )}
                <ResumesList />

                <Modal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={modalStyle}>
                        {modalStep === 'input' && (
                            <Box>
                                <Typography id="modal-title" variant="h6" component="h2">
                                    Enter job posting URL
                                </Typography>
                                <Box component="form" sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="URL"
                                        variant="outlined"
                                        value={jobUrl}
                                        onChange={(e) => setJobUrl(e.target.value)}
                                        type="url"
                                        required
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={handlePost}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {modalStep === 'result' && (
                            <Box>
                                <Typography id="modal-title" variant="h6" component="h2">
                                    Job Posted Successfully
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: '50%',
                                            aspectRatio: '1 / 1.414', // A4 ratio
                                            bgcolor: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography>Preview Section 1</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '50%',
                                            aspectRatio: '1 / 1.414', // A4 ratio
                                            bgcolor: '#e0e0e0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography>Preview Section 2</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default ResumePage;
