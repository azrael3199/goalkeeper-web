package main

import (
	"log"
	"os"

	"goalkeeper/pkg/db"
	"goalkeeper/services/users/internal/handler"
	"goalkeeper/services/users/internal/repository"
	"goalkeeper/services/users/internal/service"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/context"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9001"
	}

	log.Printf("Starting users-service on :%s\n", port)
	e := echo.New()

	// Initialize DB
	dbURL := os.Getenv("DATABASE_URL")
	var database *db.DB
	if dbURL != "" {
		d, err := db.Connect(context.Background(), dbURL)
		if err != nil {
			log.Fatalf("Failed to connect to db: %v", err)
		}
		database = d
	} else {
		log.Println("WARNING: DATABASE_URL not set, running with nil DB")
	}

	// Wire dependencies
	repo := repository.NewUserRepo(database)
	svc := service.NewUserService(repo)
	h := handler.NewUserHandler(svc)

	e.GET("/v1/users/me", h.GetMe)
	e.POST("/internal/webhooks/auth", h.HandleAuthWebhook)

	e.Start(":" + port)
}
