import {fetchAllProjects, fetchProjectById, insertProject, updateProject} from "../models/projectModel";

export async function getProjectById(pool: any, id: number) {
    return await fetchProjectById(pool, id);
}

export async function getAllProjects(pool: any) {
    return await fetchAllProjects(pool);
}

export async function createProject(pool: any, data: any) {
    return await insertProject(pool, data);
}

export async function updateProjectFromReq(pool: any, id: number, data: any) {
    return await updateProject(pool, id, data);
}