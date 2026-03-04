package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
)

// Search service wraps database FTS (Postgres pg_trgm for Goal Library and Communities).
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9009"
	}

	log.Printf("Starting search-service on :%s\n", port)
	e := echo.New()

	e.GET("/v1/search", func(c echo.Context) error {
		// query := c.QueryParam("q")
		// type := c.QueryParam("type") // 'community', 'library'
		// Returns pg_query matches
		return c.JSON(200, []string{})
	})

	e.Start(":" + port)
}
