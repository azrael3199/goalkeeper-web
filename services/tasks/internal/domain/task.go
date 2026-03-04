package domain

import (
	"time"

	"github.com/google/uuid"
)

type RecurrenceRule struct {
	Frequency  string     `json:"freq"`            // daily|weekly|monthly|custom
	Interval   int        `json:"interval"`        // every N units (default 1)
	ByDay      []string   `json:"byday"`           // ['MO','WE','FR'] for weekly
	ByMonthDay []int      `json:"bymonthday"`      // [1,15] for monthly
	Until      *time.Time `json:"until,omitempty"` // end date, nil = follow goal target_date
	Cron       string     `json:"cron"`            // raw cron expression for 'custom'
}

type Task struct {
	ID                    uuid.UUID       `json:"id"`
	GoalID                uuid.UUID       `json:"goalId"`
	UserID                uuid.UUID       `json:"userId"`
	Title                 string          `json:"title"`
	Description           string          `json:"description"`
	Type                  string          `json:"type"`           // one_time, recurring
	RecurrenceRule        *RecurrenceRule `json:"recurrenceRule"` // null for one_time
	LastExpandedAt        *time.Time      `json:"lastExpandedAt"`
	XPValue               int             `json:"xpValue"`
	CoinValue             int             `json:"coinValue"`
	IsMandatory           bool            `json:"isMandatory"`
	ProofRequired         bool            `json:"proofRequired"`
	ProofType             string          `json:"proofType"`
	VerificationWindowHrs int             `json:"verificationWindowHrs"`
	Tags                  []string        `json:"tags"`
	Priority              string          `json:"priority"` // low, medium, high
	CreatedAt             time.Time       `json:"createdAt"`
	UpdatedAt             time.Time       `json:"updatedAt"`
}

type TaskInstance struct {
	ID            uuid.UUID  `json:"id"`
	TaskID        uuid.UUID  `json:"taskId"`
	GoalID        uuid.UUID  `json:"goalId"`
	UserID        uuid.UUID  `json:"userId"`
	BuddyID       *uuid.UUID `json:"buddyId"`
	ScheduledAt   time.Time  `json:"scheduledAt"`
	DurationMins  *int       `json:"durationMins"`
	Status        string     `json:"status"` // scheduled, pending, completed_unverified, completed_verified, skipped, missed, failed
	CompletedAt   *time.Time `json:"completedAt"`
	XPValue       int        `json:"xpValue"`
	CoinValue     int        `json:"coinValue"`
	ProofRequired bool       `json:"proofRequired"`
	CreatedAt     time.Time  `json:"createdAt"`
}

// Dummy expand algorithm for skeleton purposes
func (r *RecurrenceRule) Expand(lastExpandedAt *time.Time, until time.Time) []TaskInstance {
	return []TaskInstance{}
}
