package repository

import (
	"context"

	"goalkeeper/pkg/db"
	"goalkeeper/services/goals/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type GoalRepo struct {
	db *db.DB
}

func NewGoalRepo(d *db.DB) *GoalRepo {
	return &GoalRepo{db: d}
}

func (r *GoalRepo) GetLibraryGoal(ctx context.Context, id uuid.UUID) (*domain.LibraryGoal, error) {
	row := r.db.Pool.QueryRow(ctx, `
		SELECT id, title, description, category, difficulty, estimated_days,
		adoption_count, tags, tasks_template, created_by, is_curated, created_at
		FROM goal_library WHERE id = $1`, id)

	var g domain.LibraryGoal
	if err := row.Scan(&g.ID, &g.Title, &g.Description, &g.Category, &g.Difficulty,
		&g.EstimatedDays, &g.AdoptionCount, &g.Tags, &g.TasksTemplate,
		&g.CreatedBy, &g.IsCurated, &g.CreatedAt); err != nil {
		return nil, err
	}
	return &g, nil
}

func (r *GoalRepo) CreateGoalWithTasks(ctx context.Context, g *domain.Goal /* tasks implementation omitted for skeleton */) error {
	query := `
		INSERT INTO goals (id, user_id, community_id, library_ref, title, description,
		category, privacy, status, target_date, start_date, progress_pct, tags)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
	`
	_, err := r.db.Pool.Exec(ctx, query, g.ID, g.UserID, g.CommunityID, g.LibraryRef,
		g.Title, g.Description, g.Category, g.Privacy, g.Status, g.TargetDate,
		g.StartDate, g.ProgressPct, g.Tags)

	// In a real implementation this would accept a transaction object or use WithTx,
	// and iterate over tasks to insert them into the 'tasks' table as well.
	return err
}

func (r *GoalRepo) GetTaskInstanceCounts(ctx context.Context, goalID uuid.UUID) (total int, completed int, err error) {
	query := `
		SELECT
			COUNT(*) AS total,
			COUNT(*) FILTER (WHERE status IN ('completed_verified','completed_unverified')) AS completed
		FROM task_instances
		WHERE goal_id = $1
		  AND scheduled_at BETWEEN (SELECT start_date FROM goals WHERE id=$1)
							   AND (SELECT target_date FROM goals WHERE id=$1)
	`
	row := r.db.Pool.QueryRow(ctx, query, goalID)
	err = row.Scan(&total, &completed)
	return
}

func (r *GoalRepo) UpdateProgress(ctx context.Context, goalID uuid.UUID, pct float64) error {
	_, err := r.db.Pool.Exec(ctx, "UPDATE goals SET progress_pct = $1, updated_at = now() WHERE id = $2", pct, goalID)
	return err
}

func (r *GoalRepo) Create(ctx context.Context, g *domain.Goal) error {
	return r.CreateGoalWithTasks(ctx, g)
}

func (r *GoalRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Goal, error) {
	row := r.db.Pool.QueryRow(ctx, `
		SELECT id, user_id, community_id, library_ref, title, description,
		category, privacy, status, target_date, start_date, progress_pct, tags,
		created_at, updated_at
		FROM goals WHERE id = $1`, id)

	var g domain.Goal
	if err := row.Scan(&g.ID, &g.UserID, &g.CommunityID, &g.LibraryRef, &g.Title,
		&g.Description, &g.Category, &g.Privacy, &g.Status, &g.TargetDate,
		&g.StartDate, &g.ProgressPct, &g.Tags, &g.CreatedAt, &g.UpdatedAt); err != nil {
		return nil, err
	}
	return &g, nil
}

func (r *GoalRepo) Update(ctx context.Context, g *domain.Goal) error {
	query := `
		UPDATE goals SET
			title = $1, description = $2, privacy = $3, status = $4,
			updated_at = now()
		WHERE id = $5 AND user_id = $6
	`
	// The RLS policy restricts update automatically, but we explicitly match user_id in the skeleton
	cmdTag, err := r.db.Pool.Exec(ctx, query, g.Title, g.Description, g.Privacy, g.Status, g.ID, g.UserID)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return pgx.ErrNoRows // Usually denotes NotFound or not owner
	}
	return nil
}
