package labs

import (
    "github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
    
    app.Get("/labs-all", GetAllFacilities)
}
