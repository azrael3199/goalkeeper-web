package handler

import (
	"goalkeeper/pkg/errcode"
	"goalkeeper/services/tasks/internal/service"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type TaskHandler struct {
	svc *service.TaskService
}

func NewTaskHandler(svc *service.TaskService) *TaskHandler {
	return &TaskHandler{svc: svc}
}

func (h *TaskHandler) CompleteTask(c echo.Context) error {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid ID"))
	}

	if err := h.svc.CompleteTask(c.Request().Context(), id); err != nil {
		if appErr, ok := err.(*errcode.AppError); ok {
			return c.JSON(appErr.Status, appErr)
		}
		return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal Error", 500, err.Error()))
	}

	return c.JSON(200, map[string]string{"status": "success"})
}
