package service

import (
	"context"
	"math"
	"time"

	"goalkeeper/services/community/internal/domain"
	"goalkeeper/services/community/internal/repository"

	"github.com/google/uuid"
	"github.com/samber/lo"
)

type EventPublisher interface {
	Publish(ctx context.Context, subject string, data interface{}) error
}

type BuddyAssignedEvent struct {
	UserID  uuid.UUID `json:"userId"`
	BuddyID uuid.UUID `json:"buddyId"`
}

type Config struct {
	SmartMatchEnabled bool
	BuddyRotationDays int
}

type CommunityService struct {
	repo   *repository.CommunityRepo
	events EventPublisher
	cfg    Config
}

func NewCommunityService(repo *repository.CommunityRepo, events EventPublisher, cfg Config) *CommunityService {
	return &CommunityService{repo: repo, events: events, cfg: cfg}
}

func (s *CommunityService) AssignBuddy(ctx context.Context, communityID, goalID, userID uuid.UUID) error {
	// 1. Fetch all active participants without a buddy
	pool, err := s.repo.GetUnpairedParticipants(ctx, communityID, goalID, userID)
	if err != nil {
		return err
	}
	if len(pool) == 0 {
		return s.repo.AddToWaitingQueue(ctx, communityID, goalID, userID)
	}

	// 2. Score candidates
	buddy := s.scoreCandidates(userID, pool, s.cfg.SmartMatchEnabled)

	// 3. Create buddy assignment record
	rotationEnd := time.Now().Add(time.Duration(s.cfg.BuddyRotationDays) * 24 * time.Hour)
	err = s.repo.CreateBuddyAssignment(ctx, &domain.BuddyAssignment{
		CommunityID:   communityID,
		GoalID:        goalID,
		UserID:        userID,
		BuddyID:       buddy.ID,
		RotationStart: time.Now(),
		RotationEnd:   rotationEnd,
	})
	if err != nil {
		return err
	}

	// Assign reciprocal
	err = s.repo.CreateBuddyAssignment(ctx, &domain.BuddyAssignment{
		CommunityID:   communityID,
		GoalID:        goalID,
		UserID:        buddy.ID,
		BuddyID:       userID,
		RotationStart: time.Now(),
		RotationEnd:   rotationEnd,
	})
	if err != nil {
		return err
	}

	// 4. Notify both parties
	if s.events != nil {
		s.events.Publish(ctx, "goalkeeper.buddy.assigned", BuddyAssignedEvent{UserID: userID, BuddyID: buddy.ID})
	}

	return nil
}

type ScoredUser struct {
	User  domain.User
	Score int
}

func abs(n int) int {
	return int(math.Abs(float64(n)))
}

func (s *CommunityService) scoreCandidates(requester uuid.UUID, pool []domain.User, smart bool) domain.User {
	if !smart {
		return pool[0] // round-robin: first unassigned
	}

	// Smart: score by |level diff| + |timezone offset|
	requesterProfile := s.repo.GetProfile(requester)
	scored := lo.Map(pool, func(u domain.User, _ int) ScoredUser {
		levelDiff := abs(u.Level - requesterProfile.Level)
		tzDiff := abs(u.TimezoneOffset - requesterProfile.TimezoneOffset)
		return ScoredUser{User: u, Score: levelDiff*2 + tzDiff}
	})

	best := lo.MinBy(scored, func(a, b ScoredUser) bool {
		return a.Score < b.Score
	})

	return best.User
}
