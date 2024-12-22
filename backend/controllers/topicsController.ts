import {fetchAllTopics, fetchTopicById, insertTopic} from "../models/topicModel";

export async function getTopicById(pool: any, id: number) {
    return await fetchTopicById(pool, id);
}

export async function getAllTopics(pool: any) {
    return await fetchAllTopics(pool);
}

export async function createTopic(pool: any, data: any) {
    return await insertTopic(pool, data);
}