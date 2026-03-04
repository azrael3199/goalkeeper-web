package main

import (
	"log"
	"os"

	"goalkeeper/services/store/internal/handler"

	"github.com/labstack/echo/v4"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9007"
	}

	log.Printf("Starting store-service on :%s\n", port)
	e := echo.New()

	h := handler.NewStoreHandler()
	e.POST("/v1/store/items/:id/purchase", h.PurchaseItem)

	e.Start(":" + port)
}
