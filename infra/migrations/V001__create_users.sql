-- ── Users ────────────────────────────────────────────────
CREATE TABLE users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 email TEXT NOT NULL UNIQUE,
 display_name TEXT NOT NULL,
 avatar_url TEXT,
 level INT DEFAULT 1,
 total_xp BIGINT DEFAULT 0,
 coins BIGINT DEFAULT 0,
 streak_current INT DEFAULT 0,
 streak_best INT DEFAULT 0,
 last_active_date DATE,
 solo_mode BOOLEAN DEFAULT false,
 timezone_offset INT DEFAULT 0, -- minutes from UTC
 created_at TIMESTAMPTZ DEFAULT now(),
 updated_at TIMESTAMPTZ DEFAULT now()
);
