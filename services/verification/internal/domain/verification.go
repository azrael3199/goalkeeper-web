package domain

import (
	"time"

	"github.com/google/uuid"
)

type ProofSubmission struct {
	ID             uuid.UUID  `json:"id"`
	TaskInstanceID uuid.UUID  `json:"taskInstanceId"`
	SubmitterID    uuid.UUID  `json:"submitterId"`
	BuddyID        *uuid.UUID `json:"buddyId"`
	MediaURLs      []string   `json:"mediaUrls"`
	Note           string     `json:"note"`
	Status         string     `json:"status"` // pending, approved, rejected, auto_approved, appealed
	BuddyComment   string     `json:"buddyComment"`
	SubmittedAt    time.Time  `json:"submittedAt"`
	ReviewedAt     *time.Time `json:"reviewedAt"`
	ExpiresAt      time.Time  `json:"expiresAt"`
}

type ReviewRequest struct {
	ProofID  uuid.UUID `json:"proofId"`
	BuddyID  uuid.UUID `json:"buddyId"`
	Approved bool      `json:"approved"`
	Comment  string    `json:"comment"`
}
