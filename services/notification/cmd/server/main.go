package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
)

// Notification service listens for domain events (e.g. proof.required, user.levelup)
// and pushes them to FCM or email (via SendGrid). For MVP, this serves as an Echo skeleton.
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9008"
	}

	log.Printf("Starting notification-service on :%s\n", port)
	e := echo.New()

	e.POST("/internal/test/fcm", func(c echo.Context) error {
		return c.String(200, "Notification Sent")
	})

	e.Start(":" + port)
}
