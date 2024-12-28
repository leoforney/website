export async function fetchProjectById(pool: any, id: number) {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    return result.rows[0];
}

export async function fetchProjectsByTopicId(pool: any, topicId: number) {
    const result = await pool.query("SELECT * FROM projects WHERE topic_id = $1", [topicId]);
    return result.rows;
}

export async function fetchAllProjects(pool: any) {
    const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
    return result.rows;
}

export async function insertProject(pool: any, { name, topic_id, description }: any) {
    const result = await pool.query(
        "INSERT INTO projects (name, topic_id, description) VALUES ($1, $2, $3) RETURNING *",
        [name, topic_id, description]
    );
    return result.rows[0];
}

export async function updateProjectSummary(pool: any, id: number, summary: string) {
    const result = await pool.query(
        `
        UPDATE projects
        SET 
            summary = $1
        WHERE id = $2
        RETURNING *;
        `,
        [summary, id]
    );
    return result.rows[0];
}

export async function updateProjectResumePoints(pool: any, id: number, resume_points: string) {
    const result = await pool.query(
        `
        UPDATE projects
        SET 
            resume_points = $1
        WHERE id = $2
        RETURNING *;
        `,
        [resume_points, id]
    );
    return result.rows[0];
}

export async function updateProject(pool: any, id: number, { name, topic_id, description }: any) {
    const result = await pool.query(
        `
        UPDATE projects
        SET 
            name = COALESCE($1, name), 
            topic_id = $2, 
            description = COALESCE($3, description)
        WHERE id = $4
        RETURNING *;
        `,
        [name, topic_id, description, id]
    );
    return result.rows[0];
}
