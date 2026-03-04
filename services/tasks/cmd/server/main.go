package main

import (
	"log"
	"os"

	"goalkeeper/pkg/db"
	"goalkeeper/pkg/validator"
	"goalkeeper/services/tasks/internal/handler"
	"goalkeeper/services/tasks/internal/repository"
	"goalkeeper/services/tasks/internal/service"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/context"
)

// Mock event publisher for skeleton
type mockEvents struct{}

func (m *mockEvents) Publish(ctx context.Context, subject string, data interface{}) error { return nil }

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9003"
	}

	log.Printf("Starting tasks-service on :%s\n", port)
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

	repo := repository.NewTaskRepo(database)
	svc := service.NewTaskService(repo, &mockEvents{})
	h := handler.NewTaskHandler(svc)

	e.POST("/v1/tasks/:id/complete", h.CompleteTask)

	e.Start(":" + port)
}
