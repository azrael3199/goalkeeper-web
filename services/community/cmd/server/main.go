package main

import (
	"log"
	"os"

	"goalkeeper/pkg/db"
	"goalkeeper/pkg/validator"
	"goalkeeper/services/community/internal/handler"
	"goalkeeper/services/community/internal/repository"
	"goalkeeper/services/community/internal/service"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/context"
)

// Mock event publisher for skeleton
type mockEvents struct{}

func (m *mockEvents) Publish(ctx context.Context, subject string, data interface{}) error { return nil }

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9004"
	}

	log.Printf("Starting community-service on :%s\n", port)
	e := echo.New()
	validator.Init()

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

	repo := repository.NewCommunityRepo(database)

	cfg := service.Config{
		SmartMatchEnabled: true,
		BuddyRotationDays: 14,
	}

	svc := service.NewCommunityService(repo, &mockEvents{}, cfg)
	h := handler.NewCommunityHandler(svc)

	e.POST("/v1/communities/:id/join", h.JoinCommunity)

	e.Start(":" + port)
}
