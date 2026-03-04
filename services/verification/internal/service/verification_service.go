package service

import (
	"context"

	"goalkeeper/pkg/errcode"
	"goalkeeper/services/verification/internal/domain"
	"goalkeeper/services/verification/internal/repository"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type EventPublisher interface {
	Publish(ctx context.Context, subject string, data interface{}) error
}

type ProofReviewedEvent struct {
	ProofID        uuid.UUID  `json:"proofId"`
	TaskInstanceID uuid.UUID  `json:"taskInstanceId"`
	SubmitterID    uuid.UUID  `json:"submitterId"`
	BuddyID        *uuid.UUID `json:"buddyId"`
	Approved       bool       `json:"approved"`
}

type VerificationService struct {
	repo   *repository.VerificationRepo
	events EventPublisher
}

func NewVerificationService(repo *repository.VerificationRepo, events EventPublisher) *VerificationService {
	return &VerificationService{repo: repo, events: events}
}

func (s *VerificationService) ReviewProof(ctx context.Context, req domain.ReviewRequest) error {
	proof, err := s.repo.GetProof(ctx, req.ProofID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return errcode.New(errcode.ErrNotFound, "Not Found", 404, "Proof not found")
		}
		return err
	}

	if proof.BuddyID == nil || *proof.BuddyID != req.BuddyID {
		return errcode.New(errcode.ErrForbidden, "Forbidden", 403, "Not authorized to review this proof")
	}

	if proof.Status != "pending" {
		return errcode.New(errcode.ErrAlreadyReviewed, "Already Reviewed", 409, "Proof is no longer pending")
	}

	newStatus := "approved"
	subject := "goalkeeper.proof.approved"
	if !req.Approved {
		newStatus = "rejected"
		subject = "goalkeeper.proof.rejected"
	}

	if err := s.repo.UpdateProofStatus(ctx, proof.ID, newStatus, req.Comment); err != nil {
		return err
	}

	if s.events != nil {
		s.events.Publish(ctx, subject, ProofReviewedEvent{
			ProofID:        proof.ID,
			TaskInstanceID: proof.TaskInstanceID,
			SubmitterID:    proof.SubmitterID,
			BuddyID:        proof.BuddyID,
			Approved:       req.Approved,
		})
	}

	return nil
}

// Background
func (s *VerificationService) ProcessExpiredProofs(ctx context.Context) error {
	// Logic to auto-approve old proofs and penalize buddy
	return nil
}
