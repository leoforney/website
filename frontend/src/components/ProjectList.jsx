import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {fetchProjects, fetchTopics} from '../api';
import {
    Box,
    Checkbox,
    Chip,
    CircularProgress,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {NoEntries} from './NoEntries.jsx';

const ProjectList = ({ topicFilter = [], onClearForm }) => {
    const [projects, setProjects] = useState(null);
    const [topics, setTopics] = useState({});
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTopics, setSelectedTopics] = useState(topicFilter);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsData = await fetchProjects();
                const topicsData = await fetchTopics();
                const topicsMap = topicsData.reduce((acc, topic) => {
                    acc[topic.id] = topic.name;
                    return acc;
                }, {});
                setTopics(topicsMap);
                setProjects(projectsData);
                setFilteredProjects(projectsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setProjects([]);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedTopics.length > 0) {
            setFilteredProjects(
                projects?.filter((project) => selectedTopics.includes(project.topic_id))
            );
        } else {
            setFilteredProjects(projects);
        }
    }, [selectedTopics, projects]);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleCheckboxChange = (topicId) => {
        const updatedSelectedTopics = selectedTopics.includes(topicId)
            ? selectedTopics.filter((id) => id !== topicId)
            : [...selectedTopics, topicId];

        setSelectedTopics(updatedSelectedTopics);

        const searchParams = new URLSearchParams(location.search);
        if (updatedSelectedTopics.length > 0) {
            searchParams.set('topics', updatedSelectedTopics.join(','));
        } else {
            searchParams.delete('topics');
        }

        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    const handleProjectSelection = (projectId) => {
        if (onClearForm) {
            onClearForm();
        }
        navigate(`/projects/${projectId}`);
    };

    if (projects === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleFilterClick} aria-controls="filter-menu" aria-haspopup="true">
                    <FilterListIcon />
                </IconButton>
                <Menu
                    id="filter-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleFilterClose}
                >
                    {Object.entries(topics).map(([id, name]) => (
                        <MenuItem key={id}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedTopics.includes(parseInt(id))}
                                        onChange={() => handleCheckboxChange(parseInt(id))}
                                    />
                                }
                                label={name}
                            />
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            {filteredProjects.length === 0 ? (
                <NoEntries />
            ) : (
                <List sx={{ width: '100%' }}>
                    {filteredProjects.map((project) => (
                        <ListItem
                            key={project.id}
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                            <Box style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <Link
                                    to={`/projects/${project.id}`}
                                    onClick={() => handleProjectSelection(project.id)}
                                    style={{
                                        flexGrow: 1,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                    }}
                                >
                                    <ListItemText
                                        primary={project.name}
                                        secondary={project.description}
                                    />
                                </Link>
                                {project.topic_id && (
                                    <Chip
                                        label={topics[project.topic_id]}
                                        color="primary"
                                        style={{ marginLeft: '8px' }}
                                    />
                                )}
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}
        </>
    );
};

export default ProjectList;