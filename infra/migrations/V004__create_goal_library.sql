-- ── Goal Library ─────────────────────────────────────────
CREATE TABLE goal_library (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 title TEXT NOT NULL,
 description TEXT,
 category TEXT,
 difficulty TEXT CHECK(difficulty IN 
('beginner','intermediate','advanced')),
 estimated_days INT,
 adoption_count BIGINT DEFAULT 0,
 tags TEXT[],
 tasks_template JSONB, -- Array of task configs to fork
 created_by UUID REFERENCES users(id),
 is_curated BOOLEAN DEFAULT false,
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_library_tags ON goal_library USING GIN(tags);
