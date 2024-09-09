package main

import (
    "database-api/internal/handlers"
    "database-api/internal/repository"
    "database-api/pkg/config"
    "github.com/gin-gonic/gin"
    "log"
)

func main() {
    // Initialize configuration (loads database info, etc.)
    db, err := repository.SetupDatabase(config.LoadConfig())
    if err != nil {
        log.Fatalf("Could not connect to the database: %v", err)
    }

    // Initialize Gin router
    r := gin.Default()

    // Define routes and assign handlers
    r.GET("/laboratories", func(c *gin.Context) { handlers.AllLaboratories(c, db) })
    r.GET("/laboratories/:lab_id/samples", func(c *gin.Context) { handlers.LaboratorySampleList(c, db) })
    r.GET("/laboratories/:lab_id/sample_requests", func(c *gin.Context) { handlers.LaboratorySampleRequests(c, db) })

    // Start the server
    if err := r.Run(":8080"); err != nil {
        log.Fatalf("Failed to run server: %v", err)
    }
}
