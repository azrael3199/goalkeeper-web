package domain

import (
	"time"

	"github.com/google/uuid"
)

type Community struct {
	ID                uuid.UUID `json:"id"`
	Name              string    `json:"name"`
	Description       string    `json:"description"`
	AvatarURL         string    `json:"avatarUrl"`
	Privacy           string    `json:"privacy"` // open, invite_only, private
	MaxMembers        int       `json:"maxMembers"`
	BuddyRotationDays int       `json:"buddyRotationDays"`
	BuddyXPRatio      float64   `json:"buddyXpRatio"`
	CoinSoloRatio     float64   `json:"coinSoloRatio"`
	CreatedBy         uuid.UUID `json:"createdBy"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

type BuddyAssignment struct {
	ID                uuid.UUID `json:"id"`
	CommunityID       uuid.UUID `json:"communityId"`
	GoalID            uuid.UUID `json:"goalId"`
	UserID            uuid.UUID `json:"userId"`
	BuddyID           uuid.UUID `json:"buddyId"`
	RotationStart     time.Time `json:"rotationStart"`
	RotationEnd       time.Time `json:"rotationEnd"`
	IsActive          bool      `json:"isActive"`
	VerificationScore float64   `json:"verificationScore"`
	CreatedAt         time.Time `json:"createdAt"`
}

// User representation derived from users-service via sync or auth
type User struct {
	ID             uuid.UUID `json:"id"`
	Level          int       `json:"level"`
	TimezoneOffset int       `json:"timezoneOffset"`
}
