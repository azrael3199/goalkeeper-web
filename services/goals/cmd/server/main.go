package main

import (
	"log"
	"os"

	"goalkeeper/pkg/db"
	"goalkeeper/pkg/validator"
	"goalkeeper/services/goals/internal/handler"
	"goalkeeper/services/goals/internal/repository"
	"goalkeeper/services/goals/internal/service"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/context"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9002"
	}

	log.Printf("Starting goals-service on :%s\n", port)
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

	repo := repository.NewGoalRepo(database)
	svc := service.NewGoalService(repo, nil) // Events mocked out
	h := handler.NewGoalHandler(svc)

	e.POST("/v1/goals", h.Create)
	e.GET("/v1/goals/:id", h.Get)
	e.POST("/v1/goals/library/:id/adopt", h.AdoptLibraryGoal)

	e.Start(":" + port)
}
