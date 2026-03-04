package repository

import (
	"context"

	"goalkeeper/pkg/db"
	"goalkeeper/services/community/internal/domain"

	"github.com/google/uuid"
)

type CommunityRepo struct {
	db *db.DB
}

func NewCommunityRepo(d *db.DB) *CommunityRepo {
	return &CommunityRepo{db: d}
}

func (r *CommunityRepo) GetUnpairedParticipants(ctx context.Context, communityID, goalID, excludeUserID uuid.UUID) ([]domain.User, error) {
	// Dummy query to mirror LLD's intent.
	// In reality you would query active goals in a community where users don't have active buddy_assignments.
	// Since community_service doesn't own users table directly, it relies on User IDs or joined data.
	return []domain.User{}, nil
}

func (r *CommunityRepo) AddToWaitingQueue(ctx context.Context, communityID, goalID, userID uuid.UUID) error {
	// Stub
	return nil
}

func (r *CommunityRepo) CreateBuddyAssignment(ctx context.Context, ba *domain.BuddyAssignment) error {
	query := `
		INSERT INTO buddy_assignments (id, community_id, goal_id, user_id, buddy_id, rotation_start, rotation_end, is_active, verification_score)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	_, err := r.db.Pool.Exec(ctx, query, uuid.New(), ba.CommunityID, ba.GoalID, ba.UserID, ba.BuddyID, ba.RotationStart, ba.RotationEnd, true, 100.0)
	return err
}

func (r *CommunityRepo) GetProfile(userID uuid.UUID) domain.User {
	// Stub to fetch local cached profile info for leveling
	return domain.User{ID: userID, Level: 1, TimezoneOffset: 0}
}
