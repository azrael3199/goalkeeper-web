package middleware

import (
	"context"
	"strings"

	"goalkeeper/pkg/auth"
	"goalkeeper/pkg/db"
	"goalkeeper/pkg/errcode"
	"goalkeeper/pkg/logger"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// AuthMiddleware intercepts requests to decode the JWT and inject the userID into context
func AuthMiddleware(verifier *auth.Verifier) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "Missing Authorization Header"))
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "Invalid Authorization Header Format"))
			}

			claims, err := verifier.Verify(parts[1])
			if err != nil {
				// ADDED DETAILED LOGGING HERE FOR THE JWT VERIFICATION ERROR
				logger.Log.Error().Err(err).Msg("JWT Verification Failed")
				return c.JSON(401, errcode.New(errcode.ErrUnauthorized, "Unauthorized", 401, "Invalid or Expired Token"))
			}

			// Extract User ID from the Subject claim (e.g. Clerk string 'user_2...')
			clerkSubject := claims.Subject

			// Compute the deterministic UUID
			namespace := uuid.MustParse("00000000-0000-0000-0000-000000000000")
			parsedUUID := uuid.NewMD5(namespace, []byte(clerkSubject))

			// Inject into request Context for local service handlers
			ctx := context.WithValue(c.Request().Context(), db.UserIDKey, parsedUUID.String())
			c.SetRequest(c.Request().WithContext(ctx))

			// Inject into Headers for reverse proxy downstream services
			c.Request().Header.Set("X-User-ID", parsedUUID.String())

			return next(c)
		}
	}
}
