package domain

import "github.com/google/uuid"

type UserGamification struct {
	UserID        uuid.UUID
	Level         int
	TotalXP       int64
	Coins         int64
	StreakCurrent int
}

type XPAwardedEvent struct {
	UserID      uuid.UUID  `json:"userId"`
	Amount      int        `json:"amount"`
	Coins       int        `json:"coins"`
	Multiplier  float64    `json:"multiplier"`
	CommunityID *uuid.UUID `json:"communityId,omitempty"`
}

type TaskCompletedEvent struct {
	UserID      uuid.UUID  `json:"userId"`
	TaskID      uuid.UUID  `json:"taskId"`
	XPValue     int        `json:"xpValue"`
	CoinValue   int        `json:"coinValue"`
	CommunityID *uuid.UUID `json:"communityId,omitempty"`
	IsSolo      bool       `json:"isSolo"`
}
