package domain

import (
	"time"

	"github.com/google/uuid"
)

type StoreItem struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Category    string    `json:"category"` // avatar_frame, theme, badge
	Rarity      string    `json:"rarity"`   // common, rare, epic, legendary
	Cost        int       `json:"cost"`
	AssetURL    string    `json:"assetUrl"`
	IsAvailable bool      `json:"isAvailable"`
	CreatedAt   time.Time `json:"createdAt"`
}

type UserInventory struct {
	UserID     uuid.UUID `json:"userId"`
	ItemID     uuid.UUID `json:"itemId"`
	IsEquipped bool      `json:"isEquipped"`
	AcquiredAt time.Time `json:"acquiredAt"`
}
