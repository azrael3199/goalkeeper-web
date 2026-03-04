-- ── Communities ──────────────────────────────────────────
CREATE TABLE communities (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 description TEXT,
 avatar_url TEXT,
 privacy TEXT NOT NULL DEFAULT 'open'
 CHECK(privacy IN ('open','invite_only','private')),
 max_members INT DEFAULT 500,
 buddy_rotation_days INT DEFAULT 14,
 buddy_xp_ratio DECIMAL(4,2) DEFAULT 0.30,
 coin_solo_ratio DECIMAL(4,2) DEFAULT 0.60,
 created_by UUID NOT NULL REFERENCES users(id),
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);
