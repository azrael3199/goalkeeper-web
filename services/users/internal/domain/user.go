package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID             uuid.UUID  `json:"id"`
	Email          string     `json:"email"`
	DisplayName    string     `json:"displayName"`
	AvatarURL      string     `json:"avatarUrl"`
	Level          int        `json:"level"`
	TotalXP        int64      `json:"totalXp"`
	Coins          int64      `json:"coins"`
	StreakCurrent  int        `json:"streakCurrent"`
	StreakBest     int        `json:"streakBest"`
	LastActiveDate *time.Time `json:"lastActiveDate"`
	SoloMode       bool       `json:"soloMode"`
	TimezoneOffset int        `json:"timezoneOffset"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}

type ProviderUserData struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	AvatarURL string    `json:"avatarUrl"`
}
