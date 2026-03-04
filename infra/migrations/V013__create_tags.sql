-- ── Tags ─────────────────────────────────────────────────
CREATE TABLE tags (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 color TEXT,
 scope TEXT NOT NULL CHECK(scope IN ('user','community')),
 owner_id UUID NOT NULL, -- user_id or community_id
 created_at TIMESTAMPTZ DEFAULT now(),
 UNIQUE (scope, owner_id, name)
);
