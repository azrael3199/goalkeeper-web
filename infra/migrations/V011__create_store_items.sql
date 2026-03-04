-- ── Store Items ──────────────────────────────────────────
CREATE TABLE store_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 description TEXT,
 category TEXT NOT NULL CHECK(category IN
('title','avatar','background','card_theme','goal_badge')),
 rarity TEXT NOT NULL CHECK(rarity IN 
('common','rare','epic','legendary')),
 coin_cost INT NOT NULL,
 asset_url TEXT,
 is_limited BOOLEAN DEFAULT false,
 stock INT,
 available_from TIMESTAMPTZ,
 available_until TIMESTAMPTZ
);
