package labs

import (
    "github.com/gofiber/fiber/v2"
    "database-api/internal/database"
    "fmt"
)

func GetAllFacilities(c *fiber.Ctx) error {
    fmt.Println(c)
    var facilities []Facility
    if err := database.DB.Find(&facilities).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to retrieve facilities",
        })
    }

    return c.JSON(facilities)
}
