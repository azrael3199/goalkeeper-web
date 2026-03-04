package service

import (
	"context"

	"github.com/google/uuid"
)

// Called on every task state change via NATS event
func (s *GoalService) RecalculateProgress(ctx context.Context, goalID uuid.UUID) error {
	total, completed, err := s.repo.GetTaskInstanceCounts(ctx, goalID)
	if err != nil {
		return err
	}

	pct := 0.0
	if total > 0 {
		pct = float64(completed) / float64(total) * 100
	}

	return s.repo.UpdateProgress(ctx, goalID, pct)
}
