package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "database-api/internal/models"
    "gorm.io/gorm"
)

func AllLaboratories(c *gin.Context, db *gorm.DB) {
    var labs []models.Facility

    if err := db.Find(&labs).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch laboratories"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"facilities": labs})
}
