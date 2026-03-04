package handler

import (
	"goalkeeper/pkg/db"
	"goalkeeper/pkg/errcode"
	"goalkeeper/services/community/internal/service"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type CommunityHandler struct {
	svc *service.CommunityService
}

func NewCommunityHandler(svc *service.CommunityService) *CommunityHandler {
	return &CommunityHandler{svc: svc}
}

func (h *CommunityHandler) JoinCommunity(c echo.Context) error {
	commIDStr := c.Param("id")
	communityID, err := uuid.Parse(commIDStr)
	if err != nil {
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid ID"))
	}

	userIDStr, ok := c.Request().Context().Value(db.UserIDKey).(string)
	if !ok || userIDStr == "" {
		return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "No user ID"))
	}
	userID := uuid.MustParse(userIDStr)

	// Stub out actual goal ID logic for this mock; typically derived from request body
	dummyGoalID := uuid.New()

	if err := h.svc.AssignBuddy(c.Request().Context(), communityID, dummyGoalID, userID); err != nil {
		if appErr, ok := err.(*errcode.AppError); ok {
			return c.JSON(appErr.Status, appErr)
		}
		return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal Server Error", 500, err.Error()))
	}

	return c.JSON(200, map[string]string{"status": "joined_and_assigning"})
}
