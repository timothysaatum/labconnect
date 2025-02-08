package main

import (
    "log"
    "github.com/gofiber/fiber/v2"
    "database-api/internal/database"
    "database-api/internal/labs"
    // "database-api/internal/samples"
)

func main() {
    app := fiber.New()

    // Initialize database
    database.ConnectDB()

    // Register routes

    labs.SetupRoutes(app)
    // samples.SetupRoutes(app)

    // Start server
    log.Fatal(app.Listen(":3000"))
}