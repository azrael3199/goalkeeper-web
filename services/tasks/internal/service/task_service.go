package service

import (
	"context"

	"goalkeeper/pkg/errcode"
	"goalkeeper/services/tasks/internal/repository"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type EventPublisher interface {
	Publish(ctx context.Context, subject string, data interface{}) error
}

type TaskCompletedEvent struct {
	UserID      uuid.UUID  `json:"userId"`
	TaskID      uuid.UUID  `json:"taskId"`
	XPValue     int        `json:"xpValue"`
	CoinValue   int        `json:"coinValue"`
	CommunityID *uuid.UUID `json:"communityId,omitempty"` // Omitted/nil if solo
	IsSolo      bool       `json:"isSolo"`
}

type ProofRequiredEvent struct {
	TaskInstanceID uuid.UUID  `json:"taskInstanceId"`
	BuddyID        *uuid.UUID `json:"buddyId"`
	ExpiresAt      string     `json:"expiresAt"`
}

type GoalProgressEvent struct {
	GoalID uuid.UUID `json:"goalId"`
}

type TaskService struct {
	repo   *repository.TaskRepo
	events EventPublisher
}

func NewTaskService(repo *repository.TaskRepo, events EventPublisher) *TaskService {
	return &TaskService{repo: repo, events: events}
}

// CompleteTask translates from the LLD state machine implementation
func (s *TaskService) CompleteTask(ctx context.Context, taskInstanceID uuid.UUID) error {
	instance, err := s.repo.GetInstance(ctx, taskInstanceID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return errcode.New(errcode.ErrNotFound, "Not Found", 404, "Task Instance not found")
		}
		return err
	}

	if instance.Status != "pending" {
		return errcode.New(errcode.ErrInvalidTransition, "Invalid State", 409, "Task must be pending to complete")
	}

	nextStatus := "completed_verified"
	if instance.ProofRequired {
		nextStatus = "completed_unverified"
	}

	if err := s.repo.SetStatus(ctx, instance.ID, nextStatus); err != nil {
		return err
	}

	// In a real system, the HTTP middleware sets user_id. We'll skip deep community checks for skeleton
	if nextStatus == "completed_verified" && s.events != nil {
		s.events.Publish(ctx, "goalkeeper.task.completed", TaskCompletedEvent{
			UserID:    instance.UserID,
			TaskID:    instance.ID,
			XPValue:   instance.XPValue,
			CoinValue: instance.CoinValue,
			IsSolo:    false, // placeholder logic
		})
	} else if nextStatus == "completed_unverified" && s.events != nil {
		// Just a placeholder time serialization
		s.events.Publish(ctx, "goalkeeper.proof.required", ProofRequiredEvent{
			TaskInstanceID: instance.ID,
			BuddyID:        instance.BuddyID,
			ExpiresAt:      "",
		})
	}

	if s.events != nil {
		s.events.Publish(ctx, "goalkeeper.goal.progress.recalc", GoalProgressEvent{GoalID: instance.GoalID})
	}

	return nil
}
