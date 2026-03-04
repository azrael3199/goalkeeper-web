package handler

import (
	"time"

	"goalkeeper/pkg/db"
	"goalkeeper/pkg/errcode"
	"goalkeeper/pkg/validator"
	"goalkeeper/services/goals/internal/domain"
	"goalkeeper/services/goals/internal/service"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type GoalHandler struct {
	svc *service.GoalService
}

func NewGoalHandler(svc *service.GoalService) *GoalHandler {
	return &GoalHandler{svc: svc}
}

type CreateGoalRequest struct {
	Title       string   `json:"title" validate:"required,min=1,max=120"`
	Description string   `json:"description" validate:"omitempty,max=1000"`
	TargetDate  string   `json:"targetDate" validate:"required,future"`
	Privacy     string   `json:"privacy" validate:"required,oneof=private community public"`
	Tags        []string `json:"tags" validate:"dive,max=30"`
}

func (h *GoalHandler) Create(c echo.Context) error {
	var req CreateGoalRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid JSON definition"))
	}

	if err := validator.Validate.Struct(req); err != nil {
		return c.JSON(422, errcode.New(errcode.ErrBadRequest, "Validation Error", 422, err.Error()))
	}

	userIDStr, ok := c.Request().Context().Value(db.UserIDKey).(string)
	if !ok || userIDStr == "" {
		return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "No user ID"))
	}
	userID := uuid.MustParse(userIDStr)

	tDate, _ := time.Parse("2006-01-02", req.TargetDate)

	goal := &domain.Goal{
		ID:          uuid.New(),
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		Privacy:     domain.Privacy(req.Privacy),
		TargetDate:  tDate,
		Tags:        req.Tags,
		Status:      domain.StatusActive,
	}

	if err := h.svc.CreateGoal(c.Request().Context(), goal); err != nil {
		return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal Error", 500, "Failed to create goal"))
	}

	return c.JSON(201, goal)
}

func (h *GoalHandler) Get(c echo.Context) error {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid ID"))
	}

	goal, err := h.svc.GetGoal(c.Request().Context(), id)
	if err != nil {
		if appErr, ok := err.(*errcode.AppError); ok {
			return c.JSON(appErr.Status, appErr)
		}
		return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal Server Error", 500, err.Error()))
	}
	return c.JSON(200, goal)
}

func (h *GoalHandler) AdoptLibraryGoal(c echo.Context) error {
	libGoalIDStr := c.Param("id")
	libGoalID, err := uuid.Parse(libGoalIDStr)
	if err != nil {
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid library ID"))
	}

	userIDStr, ok := c.Request().Context().Value(db.UserIDKey).(string)
	if !ok || userIDStr == "" {
		return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "No user ID"))
	}
	userID := uuid.MustParse(userIDStr)

	newGoal, err := h.svc.AdoptLibraryGoal(c.Request().Context(), userID, libGoalID)
	if err != nil {
		if appErr, ok := err.(*errcode.AppError); ok {
			return c.JSON(appErr.Status, appErr)
		}
		return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal Error", 500, err.Error()))
	}
	return c.JSON(201, newGoal)
}
