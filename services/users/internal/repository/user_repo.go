package repository

import (
	"context"

	"goalkeeper/pkg/db"
	"goalkeeper/services/users/internal/domain"

	"github.com/google/uuid"
)

type UserRepo struct {
	db *db.DB
}

func NewUserRepo(d *db.DB) *UserRepo {
	return &UserRepo{db: d}
}

func (r *UserRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	row := r.db.Pool.QueryRow(ctx,
		`SELECT id, email, display_name, avatar_url, level, total_xp,
		coins, streak_current, streak_best, solo_mode
		FROM users WHERE id = $1`, id)
	var u domain.User
	if err := row.Scan(&u.ID, &u.Email, &u.DisplayName, &u.AvatarURL, &u.Level, &u.TotalXP,
		&u.Coins, &u.StreakCurrent, &u.StreakBest, &u.SoloMode); err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepo) Upsert(ctx context.Context, u *domain.User) (*domain.User, error) {
	query := `
		INSERT INTO users (id, email, display_name, avatar_url)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (email) DO UPDATE SET
			display_name = EXCLUDED.display_name,
			avatar_url = EXCLUDED.avatar_url,
			updated_at = now()
		RETURNING id, email, display_name, avatar_url, level, total_xp, coins, streak_current, streak_best, solo_mode
	`
	row := r.db.Pool.QueryRow(ctx, query, u.ID, u.Email, u.DisplayName, u.AvatarURL)
	var updated domain.User
	if err := row.Scan(&updated.ID, &updated.Email, &updated.DisplayName, &updated.AvatarURL, &updated.Level, &updated.TotalXP,
		&updated.Coins, &updated.StreakCurrent, &updated.StreakBest, &updated.SoloMode); err != nil {
		return nil, err
	}
	return &updated, nil
}
