export async function fetchTopicById(pool: any, id: number) {
    const result = await pool.query("SELECT * FROM topics WHERE id = $1", [id]);
    return result.rows[0];
}

export async function fetchAllTopics(pool: any) {
    const result = await pool.query("SELECT * FROM topics ORDER BY id ASC");
    return result.rows;
}

export async function insertTopic(pool: any, { name, color }: any) {
    const result = await pool.query(
        "INSERT INTO topics (name) VALUES ($1) RETURNING *",
        [name]
    );
    return result.rows[0];
}

export async function fetchTopicsWithResumePoints(pool: any) {
    const query = `
        SELECT DISTINCT t.*
        FROM topics t
        JOIN projects p ON t.id = p.topic_id
        WHERE p.resume_points IS NOT NULL
    `;

    const result = await pool.query(query);
    return result.rows;
}
