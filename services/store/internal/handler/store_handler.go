package handler

import (
	"goalkeeper/pkg/db"
	"goalkeeper/pkg/errcode"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type StoreHandler struct{}

func NewStoreHandler() *StoreHandler { return &StoreHandler{} }

func (h *StoreHandler) PurchaseItem(c echo.Context) error {
	userIDStr, ok := c.Request().Context().Value(db.UserIDKey).(string)
	if !ok || userIDStr == "" {
		return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "No user ID"))
	}
	_ = uuid.MustParse(userIDStr)

	// idStr := c.Param("id")

	// Check coin balance (sync/async against users-service or gamification cache)
	// Decrement user coins
	// Insert into user_inventory

	return c.JSON(200, map[string]string{"status": "purchased"})
}
