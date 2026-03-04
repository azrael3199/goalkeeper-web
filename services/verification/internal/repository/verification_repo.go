package repository

import (
	"context"

	"goalkeeper/pkg/db"
	"goalkeeper/services/verification/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type VerificationRepo struct {
	db *db.DB
}

func NewVerificationRepo(d *db.DB) *VerificationRepo {
	return &VerificationRepo{db: d}
}

func (r *VerificationRepo) CreateProof(ctx context.Context, p *domain.ProofSubmission) (*domain.ProofSubmission, error) {
	query := `
		INSERT INTO proof_submissions (id, task_instance_id, submitter_id, buddy_id, media_urls, note, status, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	p.ID = uuid.New()
	_, err := r.db.Pool.Exec(ctx, query, p.ID, p.TaskInstanceID, p.SubmitterID, p.BuddyID, p.MediaURLs, p.Note, p.Status, p.ExpiresAt)
	return p, err
}

func (r *VerificationRepo) GetProof(ctx context.Context, id uuid.UUID) (*domain.ProofSubmission, error) {
	row := r.db.Pool.QueryRow(ctx, `
		SELECT id, task_instance_id, submitter_id, buddy_id, media_urls, note, status, buddy_comment, submitted_at, reviewed_at, expires_at
		FROM proof_submissions WHERE id = $1`, id)

	var p domain.ProofSubmission
	if err := row.Scan(&p.ID, &p.TaskInstanceID, &p.SubmitterID, &p.BuddyID, &p.MediaURLs, &p.Note, &p.Status, &p.BuddyComment, &p.SubmittedAt, &p.ReviewedAt, &p.ExpiresAt); err != nil {
		if err == pgx.ErrNoRows {
			return nil, err
		}
		return nil, err
	}
	return &p, nil
}

func (r *VerificationRepo) UpdateProofStatus(ctx context.Context, id uuid.UUID, status string, comment string) error {
	_, err := r.db.Pool.Exec(ctx, "UPDATE proof_submissions SET status = $1, buddy_comment = $2, reviewed_at = now() WHERE id = $3", status, comment, id)
	return err
}

func (r *VerificationRepo) GetExpiredPendingProofs(ctx context.Context) ([]domain.ProofSubmission, error) {
	// Stub to return proofs where expires_at < now() and status = 'pending'
	return []domain.ProofSubmission{}, nil
}
