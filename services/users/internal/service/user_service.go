package service

import (
	"context"
	"errors"

	"goalkeeper/pkg/errcode"
	"goalkeeper/services/users/internal/domain"
	"goalkeeper/services/users/internal/repository"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type UserService struct {
	repo *repository.UserRepo
}

func NewUserService(repo *repository.UserRepo) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUser(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	user, err := s.repo.FindByID(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, errcode.New(errcode.ErrNotFound, "User Not Found", 404, "User not found")
	}
	return user, err
}

func (s *UserService) UpsertFromProvider(ctx context.Context, d domain.ProviderUserData) error {
	_, err := s.repo.Upsert(ctx, &domain.User{
		ID:          d.ID,
		Email:       d.Email,
		DisplayName: d.Name,
		AvatarURL:   d.AvatarURL,
	})
	return err
}
