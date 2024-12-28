import React, {useEffect, useRef, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DownloadIcon from "@mui/icons-material/Download";
import {usePdf} from "@mikecousins/react-pdf";

const TopicsWithResumePointsPage = () => {
    const [topics, setTopics] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [page, setPage] = useState(1);
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch("/api/topics?withResumePoints=true");
                const data = await response.json();
                setTopics(data);
                if (data.length > 0) {
                    setExpanded(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();
    }, []);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
        setPage(1);
    };

    return (
        <>
            {topics.map((topic) => (
                <Accordion
                    key={topic.id}
                    expanded={expanded === topic.id}
                    onChange={handleAccordionChange(topic.id)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${topic.id}-content`}
                        id={`panel${topic.id}-header`}
                    >
                        <Typography>{topic.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {expanded === topic.id && (
                            <PdfViewer
                                file={`/api/generated/Leo_Forney_${topic.name}.pdf`}
                                page={page}
                                setPage={setPage}
                                canvasRef={canvasRef}
                                downloadUrl={`/api/generated/Leo_Forney_${topic.name}.pdf`}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

const PdfViewer = ({ file, page, setPage, canvasRef, downloadUrl }) => {
    const { pdfDocument, pdfPage } = usePdf({
        file,
        page,
        canvasRef,
    });

    useEffect(() => {
        if (pdfPage && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            const devicePixelRatio = window.devicePixelRatio || 1;
            const viewport = pdfPage.getViewport({ scale: 1 });

            canvas.width = viewport.width * devicePixelRatio;
            canvas.height = viewport.height * devicePixelRatio;

            canvas.style.width = "100%";
            canvas.style.height = "auto";

            context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

            pdfPage.render({ canvasContext: context, viewport }).promise.catch((err) => {
                console.error("PDF render error:", err);
            });
        }
    }, [pdfPage, canvasRef]);

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {!pdfDocument && <span>Loading...</span>}
            <canvas ref={canvasRef} style={{ margin: "0 auto" }} />
            {Boolean(pdfDocument && pdfDocument.numPages) && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        mt: 2,
                        gap: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<NavigateBeforeIcon />}
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        sx={{ flex: 1 }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<NavigateNextIcon />}
                        onClick={() => setPage(page + 1)}
                        disabled={page === pdfDocument.numPages}
                        sx={{ flex: 1 }}
                    >
                        Next
                    </Button>
                </Box>
            )}
            <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                href={downloadUrl}
                target="_blank"
                sx={{ marginTop: 2 }}
            >
                Download PDF
            </Button>
        </div>
    );
};

export default TopicsWithResumePointsPage;
