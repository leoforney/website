export async function fetchProjectById(pool: any, id: number) {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    return result.rows[0];
}

export async function fetchProjectsByTopicId(pool: any, topicId: number) {
    const result = await pool.query("SELECT * FROM projects WHERE topic_id = $1", [topicId]);
    return result.rows;
}

export async function fetchAllProjects(pool: any) {
    const query = `
        SELECT 
            p.id, 
            p.name, 
            p.topic_id, 
            p.summary, 
            p.description, 
            p.resume_points, 
            p.rank,
            COALESCE(
                (SELECT MAX(COALESCE(posts.updated_at, posts.created_at)) 
                 FROM posts 
                 WHERE posts.project_id = p.id), 
                NULL
            ) AS latest_post_date
        FROM 
            projects p
        ORDER BY 
            p.id ASC;
    `;
    const result = await pool.query(query);
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

export async function bulkUpdateProjectRank(pool: any, projects: { id: number; score: number }[]) {
    if (projects.length === 0) {
        return [];
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const updatedProjects = [];
        for (const project of projects) {
            const query = `
                UPDATE projects
                SET rank = $1
                WHERE id = $2
                RETURNING *;
            `;
            const result = await client.query(query, [project.score, project.id]);
            if (result.rows.length > 0) {
                updatedProjects.push(result.rows[0]);
            }
        }

        await client.query("COMMIT");
        return updatedProjects;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
