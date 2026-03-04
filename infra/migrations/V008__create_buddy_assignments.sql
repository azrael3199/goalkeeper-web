-- ── Buddy Assignments ────────────────────────────────────
CREATE TABLE buddy_assignments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 community_id UUID NOT NULL REFERENCES communities(id),
 goal_id UUID NOT NULL REFERENCES goals(id),
 user_id UUID NOT NULL REFERENCES users(id),
 buddy_id UUID NOT NULL REFERENCES users(id),
 rotation_start TIMESTAMPTZ NOT NULL,
 rotation_end TIMESTAMPTZ NOT NULL,
 is_active BOOLEAN DEFAULT true,
 verification_score DECIMAL(5,2) DEFAULT 100.0,
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ba_active ON buddy_assignments(user_id, is_active, 
rotation_end);
