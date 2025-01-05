CREATE TABLE IF NOT EXISTS pages (
                       id SERIAL PRIMARY KEY,
                       url TEXT NOT NULL,
                       body TEXT NOT NULL,
                       keywords TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);