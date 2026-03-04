package domain

import (
	"time"

	"github.com/google/uuid"
)

type Privacy string

const (
	PrivacyPrivate   Privacy = "private"
	PrivacyCommunity Privacy = "community"
	PrivacyPublic    Privacy = "public"
)

type Status string

const (
	StatusActive    Status = "active"
	StatusPaused    Status = "paused"
	StatusCompleted Status = "completed"
	StatusArchived  Status = "archived"
)

type Goal struct {
	ID          uuid.UUID  `json:"id"`
	UserID      uuid.UUID  `json:"userId"`
	CommunityID *uuid.UUID `json:"communityId,omitempty"`
	LibraryRef  *uuid.UUID `json:"libraryRef,omitempty"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Category    string     `json:"category"`
	Privacy     Privacy    `json:"privacy"`
	Status      Status     `json:"status"`
	TargetDate  time.Time  `json:"targetDate"`
	StartDate   time.Time  `json:"startDate"`
	ProgressPct float64    `json:"progressPct"`
	Tags        []string   `json:"tags"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

type LibraryGoal struct {
	ID            uuid.UUID      `json:"id"`
	Title         string         `json:"title"`
	Description   string         `json:"description"`
	Category      string         `json:"category"`
	Difficulty    string         `json:"difficulty"`
	EstimatedDays int            `json:"estimatedDays"`
	AdoptionCount int64          `json:"adoptionCount"`
	Tags          []string       `json:"tags"`
	TasksTemplate []TaskTemplate `json:"tasksTemplate"`
	CreatedBy     uuid.UUID      `json:"createdBy"`
	IsCurated     bool           `json:"isCurated"`
	CreatedAt     time.Time      `json:"createdAt"`
}

type TaskTemplate struct {
	Title           string  `json:"title"`
	Description     string  `json:"description"`
	Type            string  `json:"type"`
	RecurrenceRule  *string `json:"recurrenceRule,omitempty"`
	XPValue         int     `json:"xpValue"`
	CoinValue       int     `json:"coinValue"`
	IsMandatory     bool    `json:"isMandatory"`
	ProofRequired   bool    `json:"proofRequired"`
	VerificationHrs int     `json:"verificationWindowHrs"`
}

func (l *LibraryGoal) Fork(userID uuid.UUID) *Goal {
	g := &Goal{
		ID:          uuid.New(),
		UserID:      userID,
		LibraryRef:  &l.ID,
		Title:       l.Title,
		Description: l.Description,
		Category:    l.Category,
		Privacy:     PrivacyPrivate,
		Status:      StatusActive,
		StartDate:   time.Now().Truncate(24 * time.Hour),
		TargetDate:  time.Now().AddDate(0, 0, l.EstimatedDays).Truncate(24 * time.Hour),
		ProgressPct: 0.0,
		Tags:        l.Tags,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	return g
}
