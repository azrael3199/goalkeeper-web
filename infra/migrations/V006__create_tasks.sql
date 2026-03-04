-- ── Tasks ────────────────────────────────────────────────
CREATE TABLE tasks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id),
 title TEXT NOT NULL,
 description TEXT,
 type TEXT NOT NULL CHECK(type IN ('one_time','recurring')),
 recurrence_rule JSONB, -- null for one_time
 last_expanded_at TIMESTAMPTZ, -- for expander job
 xp_value INT NOT NULL DEFAULT 10,
 coin_value INT NOT NULL DEFAULT 10,
 is_mandatory BOOLEAN DEFAULT false,
 proof_required BOOLEAN DEFAULT false,
 proof_type TEXT CHECK(proof_type IN ('photo','text','link','any')),
 verification_window_hrs INT DEFAULT 24,
 tags TEXT[] DEFAULT '{}',
 priority TEXT DEFAULT 'medium' CHECK(priority IN ('low','medium','high')),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);
