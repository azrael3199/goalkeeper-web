package repository

import (
	"context"

	"goalkeeper/pkg/db"
	"goalkeeper/services/tasks/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type TaskRepo struct {
	db *db.DB
}

func NewTaskRepo(d *db.DB) *TaskRepo {
	return &TaskRepo{db: d}
}

func (r *TaskRepo) GetInstance(ctx context.Context, id uuid.UUID) (*domain.TaskInstance, error) {
	row := r.db.Pool.QueryRow(ctx, `
		SELECT id, task_id, goal_id, user_id, buddy_id, scheduled_at, duration_mins,
		status, completed_at, xp_value, coin_value, proof_required, created_at
		FROM task_instances WHERE id = $1`, id)

	var t domain.TaskInstance
	if err := row.Scan(&t.ID, &t.TaskID, &t.GoalID, &t.UserID, &t.BuddyID, &t.ScheduledAt,
		&t.DurationMins, &t.Status, &t.CompletedAt, &t.XPValue, &t.CoinValue,
		&t.ProofRequired, &t.CreatedAt); err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TaskRepo) SetStatus(ctx context.Context, id uuid.UUID, status string) error {
	cmd, err := r.db.Pool.Exec(ctx, "UPDATE task_instances SET status = $1 WHERE id = $2", status, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *TaskRepo) CreateTask(ctx context.Context, t *domain.Task) error {
	query := `
		INSERT INTO tasks (id, goal_id, user_id, title, description, type, recurrence_rule, 
		last_expanded_at, xp_value, coin_value, is_mandatory, proof_required, proof_type, 
		verification_window_hrs, tags, priority)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
	`
	_, err := r.db.Pool.Exec(ctx, query, t.ID, t.GoalID, t.UserID, t.Title, t.Description,
		t.Type, t.RecurrenceRule, t.LastExpandedAt, t.XPValue, t.CoinValue, t.IsMandatory,
		t.ProofRequired, t.ProofType, t.VerificationWindowHrs, t.Tags, t.Priority)
	return err
}
