-- ── Proof Submissions ────────────────────────────────────
CREATE TABLE proof_submissions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 task_instance_id UUID NOT NULL REFERENCES task_instances(id),
 submitter_id UUID NOT NULL REFERENCES users(id),
 buddy_id UUID NOT NULL REFERENCES users(id),
 media_urls TEXT[],
 note TEXT,
 status TEXT NOT NULL DEFAULT 'pending'
 CHECK(status IN 
('pending','approved','rejected','auto_approved','appealed')),
 buddy_comment TEXT,
 submitted_at TIMESTAMPTZ DEFAULT now(),
 reviewed_at TIMESTAMPTZ,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_proof_buddy_pending ON proof_submissions(buddy_id, status, 
expires_at);
