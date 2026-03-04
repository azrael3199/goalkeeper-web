-- ── Community Members ────────────────────────────────────
CREATE TABLE community_members (
 community_id UUID NOT NULL REFERENCES communities(id),
 user_id UUID NOT NULL REFERENCES users(id),
 role TEXT NOT NULL DEFAULT 'member' CHECK(role IN 
('admin','moderator','member')),
 joined_at TIMESTAMPTZ DEFAULT now(),
 PRIMARY KEY (community_id, user_id)
);
