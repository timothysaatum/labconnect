package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "database-api/internal/models"
    "gorm.io/gorm"
)

func LaboratorySampleList(c *gin.Context, db *gorm.DB) {
    var samples []models.Sample
    laboratoryID := c.Param("lab_id")

    if err := db.Where("laboratory_id = ?", laboratoryID).Preload("Laboratory").Find(&samples).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch samples"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"samples": samples})
}

func LaboratorySampleRequests(c *gin.Context, db *gorm.DB) {
    var sampleRequests []models.SampleRequest
    laboratoryID := c.Param("lab_id")

    if err := db.Where("laboratory_id = ?", laboratoryID).Preload("Sample").Preload("Laboratory").Find(&sampleRequests).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sample requests"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"sample_requests": sampleRequests})
}
