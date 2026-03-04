-- ── Task Instances (materialised recurring occurrences) ───
CREATE TABLE task_instances (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
 goal_id UUID NOT NULL REFERENCES goals(id),
 user_id UUID NOT NULL REFERENCES users(id),
 buddy_id UUID REFERENCES users(id),
 scheduled_at TIMESTAMPTZ NOT NULL,
 duration_mins INT,
 status TEXT NOT NULL DEFAULT 'scheduled'
 CHECK(status IN 
('scheduled','pending','completed_unverified',
'completed_verified','skipped','missed','failed')),
 completed_at TIMESTAMPTZ,
 xp_value INT NOT NULL,
 coin_value INT NOT NULL,
 proof_required BOOLEAN,
 created_at TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (scheduled_at);

-- monthly partitions for initial 6 months (2026-03 to 2026-09)
CREATE TABLE task_instances_2026_03 PARTITION OF task_instances FOR VALUES FROM ('2026-03-01 00:00:00Z') TO ('2026-04-01 00:00:00Z');
CREATE TABLE task_instances_2026_04 PARTITION OF task_instances FOR VALUES FROM ('2026-04-01 00:00:00Z') TO ('2026-05-01 00:00:00Z');
CREATE TABLE task_instances_2026_05 PARTITION OF task_instances FOR VALUES FROM ('2026-05-01 00:00:00Z') TO ('2026-06-01 00:00:00Z');
CREATE TABLE task_instances_2026_06 PARTITION OF task_instances FOR VALUES FROM ('2026-06-01 00:00:00Z') TO ('2026-07-01 00:00:00Z');
CREATE TABLE task_instances_2026_07 PARTITION OF task_instances FOR VALUES FROM ('2026-07-01 00:00:00Z') TO ('2026-08-01 00:00:00Z');
CREATE TABLE task_instances_2026_08 PARTITION OF task_instances FOR VALUES FROM ('2026-08-01 00:00:00Z') TO ('2026-09-01 00:00:00Z');

CREATE INDEX idx_ti_user_status_date ON task_instances(user_id, status, scheduled_at);
CREATE INDEX idx_ti_buddy ON task_instances(buddy_id, status);
