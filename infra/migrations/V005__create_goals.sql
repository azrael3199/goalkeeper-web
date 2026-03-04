-- ── Goals ────────────────────────────────────────────────
CREATE TABLE goals (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
 library_ref UUID REFERENCES goal_library(id),
 title TEXT NOT NULL,
 description TEXT,
 category TEXT,
 privacy TEXT NOT NULL CHECK(privacy IN 
('private','community','public')),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN 
('active','paused','completed','archived')),
 target_date DATE NOT NULL,
 start_date DATE NOT NULL DEFAULT CURRENT_DATE,
 progress_pct DECIMAL(5,2) DEFAULT 0,
 tags TEXT[] DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
