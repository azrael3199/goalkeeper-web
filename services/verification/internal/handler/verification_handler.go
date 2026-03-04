package handler

import (
	"goalkeeper/pkg/db"
	"goalkeeper/pkg/errcode"
	"goalkeeper/services/verification/internal/domain"
	"goalkeeper/services/verification/internal/service"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type VerificationHandler struct {
	svc *service.VerificationService
}

func NewVerificationHandler(svc *service.VerificationService) *VerificationHandler {
	return &VerificationHandler{svc: svc}
}

func (h *VerificationHandler) ReviewProof(c echo.Context) error {
	proofIDStr := c.Param("id")
	proofID, err := uuid.Parse(proofIDStr)
	if err != nil {
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid ID"))
	}

	userIDStr, ok := c.Request().Context().Value(db.UserIDKey).(string)
	if !ok || userIDStr == "" {
		return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "No user ID"))
	}
	buddyID := uuid.MustParse(userIDStr)

	var req struct {
		Approved bool   `json:"approved"`
		Comment  string `json:"comment"`
	}
	if err := c.Bind(&req); err != nil {
		return c.JSON(400, errcode.ErrBadRequest)
	}

	err = h.svc.ReviewProof(c.Request().Context(), domain.ReviewRequest{
		ProofID:  proofID,
		BuddyID:  buddyID,
		Approved: req.Approved,
		Comment:  req.Comment,
	})

	if err != nil {
		if appErr, ok := err.(*errcode.AppError); ok {
			return c.JSON(appErr.Status, appErr)
		}
		return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal", 500, err.Error()))
	}

	return c.NoContent(200)
}
