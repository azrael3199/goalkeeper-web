package service

import (
	"context"

	"goalkeeper/pkg/errcode"
	"goalkeeper/services/goals/internal/domain"
	"goalkeeper/services/goals/internal/repository"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type GoalService struct {
	repo *repository.GoalRepo
	// NATS publisher would be injected here for library.goal.adopted
	events interface{}
}

func NewGoalService(repo *repository.GoalRepo, events interface{}) *GoalService {
	return &GoalService{repo: repo, events: events}
}

func (s *GoalService) AdoptLibraryGoal(ctx context.Context, userID, libGoalID uuid.UUID) (*domain.Goal, error) {
	lib, err := s.repo.GetLibraryGoal(ctx, libGoalID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, errcode.New(errcode.ErrNotFound, "Not Found", 404, "Library Goal not found")
		}
		return nil, err
	}

	newGoal := lib.Fork(userID)
	if err := s.repo.CreateGoalWithTasks(ctx, newGoal); err != nil {
		return nil, err
	}

	// s.events.Publish(ctx, "library.goal.adopted", LibraryAdoptedEvent{LibGoalID: libGoalID})

	return newGoal, nil
}

func (s *GoalService) CreateGoal(ctx context.Context, goal *domain.Goal) error {
	return s.repo.Create(ctx, goal)
}

func (s *GoalService) UpdateGoal(ctx context.Context, goal *domain.Goal) error {
	if err := s.repo.Update(ctx, goal); err != nil {
		if err == pgx.ErrNoRows {
			return errcode.New(errcode.ErrNotFound, "Not Found", 404, "Goal not found or unauthorized")
		}
		return err
	}
	return nil
}

func (s *GoalService) GetGoal(ctx context.Context, id uuid.UUID) (*domain.Goal, error) {
	g, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, errcode.New(errcode.ErrNotFound, "Not Found", 404, "Goal not found")
		}
		return nil, err
	}
	return g, nil
}
