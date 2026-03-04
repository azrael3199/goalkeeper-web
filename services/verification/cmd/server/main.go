package main

import (
	"log"
	"os"

	"goalkeeper/pkg/db"
	"goalkeeper/services/verification/internal/handler"
	"goalkeeper/services/verification/internal/repository"
	"goalkeeper/services/verification/internal/service"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/context"
)

type mockEvents struct{}

func (m *mockEvents) Publish(ctx context.Context, subject string, data interface{}) error { return nil }

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9006"
	}

	log.Printf("Starting verification-service on :%s\n", port)
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

	repo := repository.NewVerificationRepo(database)
	svc := service.NewVerificationService(repo, &mockEvents{})
	h := handler.NewVerificationHandler(svc)

	e.POST("/v1/proofs/:id/review", h.ReviewProof)

	e.Start(":" + port)
}
