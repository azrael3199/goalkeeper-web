package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
)

// Analytics service aggregates data for charts. Can query PostgreSQL RO replica or read events
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9010"
	}

	log.Printf("Starting analytics-service on :%s\n", port)
	e := echo.New()

	e.GET("/v1/analytics/xp-chart", func(c echo.Context) error {
		return c.JSON(200, map[string]interface{}{"data": []string{}})
	})

	e.Start(":" + port)
}
