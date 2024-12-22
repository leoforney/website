import {fetchAllPosts, fetchPostById, fetchPostsByProjectId, insertPost, updatePostById} from "../models/postModel";

export async function getPostById(pool: any, id: number) {
    return await fetchPostById(pool, id);
}

export async function getAllPosts(pool: any) {
    return await fetchAllPosts(pool);
}

export async function getPostsByProjectId(pool: any, projectId: number) {
    return await fetchPostsByProjectId(pool, projectId);
}

export async function createPost(pool: any, data: any) {
    return await insertPost(pool, {
        project_id: data.project_id,
        editor_state: data.editor_state,
        title: data.title,
    });
}

export async function updatePost(pool: any, id: number, data: any) {
    return await updatePostById(pool, id, {
        project_id: data.project_id,
        editor_state: data.editor_state,
        title: data.title,
    });
}

