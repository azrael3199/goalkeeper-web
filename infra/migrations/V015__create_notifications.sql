-- ── Notifications ─────────────────────────────────────────
CREATE TABLE notifications (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id),
 type TEXT NOT NULL,
 title TEXT NOT NULL,
 body TEXT,
 data JSONB,
 action_url TEXT,
 is_read BOOLEAN DEFAULT false,
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, 
created_at DESC);
