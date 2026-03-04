package main

import (
	"log"
	"os"

	"goalkeeper/pkg/db"
	"goalkeeper/services/gamification/internal/handler"
	"goalkeeper/services/gamification/internal/repository"
	"goalkeeper/services/gamification/internal/service"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/context"
)

type mockEvents struct{}

func (m *mockEvents) Publish(ctx context.Context, subject string, data interface{}) error { return nil }

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9005"
	}

	log.Printf("Starting gamification-service on :%s\n", port)
	e := echo.New()

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

	repo := repository.NewGamificationRepo(database)

	cfg := service.Config{
		SoloPenaltyRatio: 0.60,
	}

	svc := service.NewGamificationService(repo, &mockEvents{}, cfg)

	// Just for debugging/skeleton execution
	h := handler.NewGamificationHandler(svc)
	e.POST("/internal/events/task-completed", h.ProcessTaskCompleted)

	e.Start(":" + port)
}
