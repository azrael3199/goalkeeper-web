package handler

import (
	"goalkeeper/pkg/db"
	"goalkeeper/pkg/errcode"
	"goalkeeper/pkg/logger"
	"goalkeeper/services/users/internal/domain"
	"goalkeeper/services/users/internal/service"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type AuthWebhookEvent struct {
	Type string `json:"type"`
	Data struct {
		ID           string `json:"id"`
		EmailAddress string `json:"email_address"`
		FirstName    string `json:"first_name"`
		ImageURL     string `json:"image_url"`
	} `json:"data"`
}

type UserHandler struct {
	svc *service.UserService
}

func NewUserHandler(svc *service.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) GetMe(c echo.Context) error {
	userIDStr, ok := c.Request().Context().Value(db.UserIDKey).(string)
	if !ok || userIDStr == "" {
		return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "No user ID in context"))
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid user ID format"))
	}

	user, err := h.svc.GetUser(c.Request().Context(), userID)
	if err != nil {
		if appErr, ok := err.(*errcode.AppError); ok {
			return c.JSON(appErr.Status, appErr)
		}
		return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal Server Error", 500, err.Error()))
	}

	return c.JSON(200, user)
}

func (h *UserHandler) HandleAuthWebhook(c echo.Context) error {
	var event AuthWebhookEvent
	if err := c.Bind(&event); err != nil {
		logger.Log.Error().Err(err).Msg("failed to bind webhook event")
		return c.JSON(400, errcode.New(errcode.ErrBadRequest, "Bad Request", 400, "Invalid JSON payload"))
	}

	if event.Type == "user.created" {
		// Create a deterministic UUID from the provider's ID (e.g. Clerk's user_2aX...)
		// Here we generate a v5 UUID based on a static namespace and the provider's ID string
		namespace := uuid.MustParse("00000000-0000-0000-0000-000000000000") // Example namespace
		userID := uuid.NewMD5(namespace, []byte(event.Data.ID))

		d := domain.ProviderUserData{
			ID:        userID,
			Email:     event.Data.EmailAddress,
			Name:      event.Data.FirstName,
			AvatarURL: event.Data.ImageURL,
		}
		if err := h.svc.UpsertFromProvider(c.Request().Context(), d); err != nil {
			logger.Log.Error().Err(err).Msg("failed to upsert user from provider")
			return c.JSON(500, errcode.New(errcode.ErrUnknown, "Internal Server Error", 500, "Failed to upsert user"))
		}
	}

	return c.NoContent(200)
}
