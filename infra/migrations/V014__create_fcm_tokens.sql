-- ── FCM Tokens ───────────────────────────────────────────
CREATE TABLE fcm_tokens (
 user_id UUID NOT NULL REFERENCES users(id),
 token TEXT NOT NULL,
 device_type TEXT,
 created_at TIMESTAMPTZ DEFAULT now(),
 PRIMARY KEY (user_id, token)
);
