-- ── User Inventory ───────────────────────────────────────
CREATE TABLE user_inventory (
 user_id UUID NOT NULL REFERENCES users(id),
 item_id UUID NOT NULL REFERENCES store_items(id),
 is_equipped BOOLEAN DEFAULT false,
 acquired_at TIMESTAMPTZ DEFAULT now(),
 PRIMARY KEY (user_id, item_id)
);
