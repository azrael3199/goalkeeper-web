package repository

import (
	"context"
	"time"

	"goalkeeper/pkg/db"
	"goalkeeper/services/gamification/internal/domain"

	"github.com/google/uuid"
)

type GamificationRepo struct {
	db *db.DB
}

func NewGamificationRepo(d *db.DB) *GamificationRepo {
	return &GamificationRepo{db: d}
}

func (r *GamificationRepo) GetStreak(ctx context.Context, userID uuid.UUID) (int, error) {
	var streak int
	err := r.db.Pool.QueryRow(ctx, "SELECT streak_current FROM users WHERE id = $1", userID).Scan(&streak)
	return streak, err
}

func (r *GamificationRepo) AwardXP(ctx context.Context, userID uuid.UUID, amount int, source string, taskID uuid.UUID, commID *uuid.UUID) error {
	// Write to ledger
	_, err := r.db.Pool.Exec(ctx,
		"INSERT INTO xp_ledger (user_id, amount, type, ref_id, community_id) VALUES ($1, $2, $3, $4, $5)",
		userID, amount, source, taskID, commID)
	if err != nil {
		return err
	}

	// Update cached total
	_, err = r.db.Pool.Exec(ctx, "UPDATE users SET total_xp = total_xp + $1 WHERE id = $2", amount, userID)
	return err
}

func (r *GamificationRepo) IncrCoins(ctx context.Context, userID uuid.UUID, amount int) error {
	_, err := r.db.Pool.Exec(ctx, "UPDATE users SET coins = coins + $1 WHERE id = $2", amount, userID)
	return err
}

func (r *GamificationRepo) GetUserSnapshot(ctx context.Context, userID uuid.UUID) (domain.UserGamification, error) {
	var snap domain.UserGamification
	snap.UserID = userID
	err := r.db.Pool.QueryRow(ctx, "SELECT level, total_xp, coins, streak_current FROM users WHERE id = $1", userID).
		Scan(&snap.Level, &snap.TotalXP, &snap.Coins, &snap.StreakCurrent)
	return snap, err
}

func (r *GamificationRepo) SetLevel(ctx context.Context, userID uuid.UUID, level int) error {
	_, err := r.db.Pool.Exec(ctx, "UPDATE users SET level = $1 WHERE id = $2", level, userID)
	return err
}

func (r *GamificationRepo) UpdateStreak(ctx context.Context, userID uuid.UUID, lastActive time.Time) error {
	_, err := r.db.Pool.Exec(ctx, `
		UPDATE users 
		SET streak_current = streak_current + 1,
		    streak_best = GREATEST(streak_best, streak_current + 1),
		    last_active_date = $1 
		WHERE id = $2`, lastActive, userID)
	return err
}
