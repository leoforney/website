const BASE_URL = '/api';

/**
 * Function to set the password in a cookie.
 * Call this in the developer console like: `setApiPassword('your_password')`.
 */
window.setApiPassword = (newPassword) => {
    document.cookie = `apiPassword=${encodeURIComponent(newPassword)}; path=/;`;
    console.log('API password set successfully.');
};

/**
 * Function to retrieve the password from the cookie.
 */
const getApiPassword = () => {
    const match = document.cookie.match(/(?:^|;\s*)apiPassword=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
};

/**
 * Ensure requests with POST or PATCH verify the password.
 */
const checkPassword = () => {
    const password = getApiPassword();
    if (!password) {
        throw new Error("API password not set. Use setApiPassword('your_password') to set it.");
    }
    return password;
};

export const fetchProjects = async () => {
    const response = await fetch(`${BASE_URL}/projects`);
    return response.json();
};

export const fetchProjectById = async (projectId) => {
    const response = await fetch(`${BASE_URL}/projects?id=${projectId}`);
    return response.json();
};

export const fetchTopics = async () => {
    const response = await fetch(`${BASE_URL}/topics`);
    return response.json();
};

export const fetchPostsByProjectId = async (projectId) => {
    const response = await fetch(`${BASE_URL}/posts?project_id=${projectId}`);
    return response.json();
};

export const fetchPostById = async (postId) => {
    const response = await fetch(`${BASE_URL}/posts?id=${postId}`);
    return response.json();
};

export const createProject = async (project) => {
    const password = checkPassword();
    await fetch(`${BASE_URL}/projects?password=${password}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
};

export const updateProject = async (project) => {
    const password = checkPassword();
    console.log(project)
    await fetch(`${BASE_URL}/projects?password=${password}&id=${project.project_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
}

export const saveTopics = async (projectId, topicIds) => {
    const password = checkPassword();
    await fetch(`${BASE_URL}/projects/${projectId}/setTopics?password=${password}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicIds }),
    });
};

export const savePost = async (post) => {
    const password = checkPassword();
    await fetch(`${BASE_URL}/posts?password=${password}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });
};

export const updatePost = async (post) => {
    const password = checkPassword();
    await fetch(`${BASE_URL}/posts?password=${password}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });
};
