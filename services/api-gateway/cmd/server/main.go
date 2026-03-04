package main

import (
	"log"
	"net/url"
	"os"

	"context"
	"goalkeeper/pkg/auth"
	"goalkeeper/pkg/middleware"

	"github.com/labstack/echo/v4"
	// Ensure this is aliased if needed, but echo/v4/middleware is already imported below
	echomiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	e := echo.New()

	// CORS Setup for frontend
	e.Use(echomiddleware.CORSWithConfig(echomiddleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "https://*.vercel.app"}, // Local Vite & Vercel
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Basic health check (Public)
	e.GET("/health", func(c echo.Context) error {
		return c.String(200, "API Gateway is running")
	})

	// --- SETUP JWKS VERIFIER & AUTH MIDDLEWARE ---
	jwksURL := os.Getenv("CLERK_JWKS_URL")
	if jwksURL == "" {
		log.Println("WARNING: CLERK_JWKS_URL not set. Authentication will fail or be disabled.")
	}

	verifier, err := auth.NewVerifier(context.Background(), jwksURL, "", "")
	if err != nil {
		log.Printf("ERROR: Failed to initialize JWKS Verifier: %v", err)
	}

	// Create a protected API group
	api := e.Group("")
	if verifier != nil {
		api.Use(middleware.AuthMiddleware(verifier))
	}

	// Setup Reverse Proxies to Microservices under the protected group
	// Assuming local docker compose execution logic
	setupProxy(api, "/api/v1/users/*", getEnvOrDefault("USERS_SERVICE_URL", "http://users-svc:9001"))
	setupProxy(api, "/api/v1/goals/*", getEnvOrDefault("GOALS_SERVICE_URL", "http://goals-svc:9002"))
	setupProxy(api, "/api/v1/tasks/*", getEnvOrDefault("TASKS_SERVICE_URL", "http://tasks-svc:9003"))
	setupProxy(api, "/api/v1/communities/*", getEnvOrDefault("COMMUNITY_SERVICE_URL", "http://community-svc:9004"))
	setupProxy(api, "/api/v1/verification/*", getEnvOrDefault("VERIFICATION_SERVICE_URL", "http://verification-svc:9006"))
	setupProxy(api, "/api/v1/store/*", getEnvOrDefault("STORE_SERVICE_URL", "http://store-svc:9007"))

	log.Printf("Starting API Gateway on :%s\n", port)
	e.Start(":" + port)
}

func setupProxy(group *echo.Group, prefix, targetURLRaw string) {
	targetURL, err := url.Parse(targetURLRaw)
	if err != nil {
		log.Fatalf("Invalid proxy target URL %s: %v", targetURLRaw, err)
	}

	balancer := echomiddleware.NewRoundRobinBalancer([]*echomiddleware.ProxyTarget{
		{URL: targetURL},
	})

	// Strip the "/api/" prefix when talking to downstream services.
	// E.g. /api/v1/users/me -> /v1/users/me
	rewrite := map[string]string{
		"^/api/*": "/$1",
	}

	group.Group(prefix, echomiddleware.ProxyWithConfig(echomiddleware.ProxyConfig{
		Balancer: balancer,
		Rewrite:  rewrite,
	}))
}

func getEnvOrDefault(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
