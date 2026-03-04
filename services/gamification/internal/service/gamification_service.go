package service

import (
	"context"
	"math"
	"time"

	"goalkeeper/services/gamification/internal/domain"
	"goalkeeper/services/gamification/internal/repository"

	"github.com/google/uuid"
)

type EventPublisher interface {
	Publish(ctx context.Context, subject string, data interface{}) error
}

type LevelUpEvent struct {
	UserID     uuid.UUID `json:"userId"`
	OldLevel   int       `json:"oldLevel"`
	NewLevel   int       `json:"newLevel"`
	BonusCoins int       `json:"bonusCoins"`
}

type Config struct {
	SoloPenaltyRatio float64
}

const BASE_XP = 250.0

func XPToLevel(totalXP int64) int {
	if totalXP <= 0 {
		return 1
	}
	level := int((-1 + math.Sqrt(1+8*float64(totalXP)/BASE_XP)) / 2)
	if level < 1 {
		return 1
	}
	return level
}

type GamificationService struct {
	repo   *repository.GamificationRepo
	events EventPublisher
	cfg    Config
}

func NewGamificationService(repo *repository.GamificationRepo, events EventPublisher, cfg Config) *GamificationService {
	return &GamificationService{repo: repo, events: events, cfg: cfg}
}

func streakMultiplier(streak int) float64 {
	switch {
	case streak >= 30:
		return 2.0
	case streak >= 14:
		return 1.5
	case streak >= 7:
		return 1.25
	case streak >= 3:
		return 1.1
	default:
		return 1.0
	}
}

// CheckAndApplyLevelUp determines if new XP crossed a threshold and triggers reward
func (s *GamificationService) checkAndApplyLevelUp(ctx context.Context, userID uuid.UUID) {
	user, err := s.repo.GetUserSnapshot(ctx, userID)
	if err != nil {
		return
	}

	newLevel := XPToLevel(user.TotalXP)
	if newLevel > user.Level {
		bonusCoins := newLevel * 100 // 100 coins per level
		s.repo.SetLevel(ctx, userID, newLevel)
		s.repo.IncrCoins(ctx, userID, bonusCoins)

		if s.events != nil {
			s.events.Publish(ctx, "goalkeeper.user.levelup", LevelUpEvent{
				UserID:     userID,
				OldLevel:   user.Level,
				NewLevel:   newLevel,
				BonusCoins: bonusCoins,
			})
		}
	}
}

// HandleTaskCompleted consumes the message to process XP
func (s *GamificationService) HandleTaskCompleted(ctx context.Context, e domain.TaskCompletedEvent) error {
	// 1. Fetch current streak
	streak, _ := s.repo.GetStreak(ctx, e.UserID)
	multiplier := streakMultiplier(streak)

	// 2. Apply solo penalty
	if e.IsSolo {
		multiplier *= s.cfg.SoloPenaltyRatio
	}

	// 3. Compute final XP
	finalXP := int(math.Round(float64(e.XPValue) * multiplier))
	finalCoins := int(math.Round(float64(e.CoinValue) * multiplier))

	// 4. Issue the DB award
	err := s.repo.AwardXP(ctx, e.UserID, finalXP, "task_completion", e.TaskID, e.CommunityID)
	if err != nil {
		return err
	}
	s.repo.IncrCoins(ctx, e.UserID, finalCoins)

	// 5. Level ups
	s.checkAndApplyLevelUp(ctx, e.UserID)

	// 6. Strengthen streak
	s.repo.UpdateStreak(ctx, e.UserID, time.Now())

	// 7. Fire notification event
	if s.events != nil {
		s.events.Publish(ctx, "goalkeeper.xp.awarded", domain.XPAwardedEvent{
			UserID:      e.UserID,
			Amount:      finalXP,
			Coins:       finalCoins,
			Multiplier:  multiplier,
			CommunityID: e.CommunityID,
		})
	}

	return nil
}
