package handler

import (
	"context"
	"goalkeeper/services/gamification/internal/domain"
	"goalkeeper/services/gamification/internal/service"

	"github.com/labstack/echo/v4"
)

type GamificationHandler struct {
	svc *service.GamificationService
}

func NewGamificationHandler(svc *service.GamificationService) *GamificationHandler {
	return &GamificationHandler{svc: svc}
}

// Mocking the event handler logic as HTTP post for tests/setup
func (h *GamificationHandler) ProcessTaskCompleted(c echo.Context) error {
	var event domain.TaskCompletedEvent
	if err := c.Bind(&event); err != nil {
		return c.JSON(400, err)
	}

	if err := h.svc.HandleTaskCompleted(context.Background(), event); err != nil {
		return c.JSON(500, err)
	}

	return c.NoContent(200)
}
