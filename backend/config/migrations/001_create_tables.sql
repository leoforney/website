CREATE TABLE IF NOT EXISTS topics
(
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects
(
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    color       VARCHAR(10) NOT NULL,
    topic_id INT REFERENCES topics(id) ON UPDATE CASCADE,
    summary TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS posts (
     id SERIAL PRIMARY KEY,
     project_id INT REFERENCES projects(id) ON UPDATE CASCADE,
     editor_state TEXT,
     title TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT null
);