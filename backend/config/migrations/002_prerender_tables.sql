CREATE TABLE IF NOT EXISTS pages (
                       id SERIAL PRIMARY KEY,
                       url TEXT NOT NULL,
                       body TEXT NOT NULL,
                       keywords TEXT NOT NULL,
                       tweaked_resume TEXT,
                       cover_letter TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);