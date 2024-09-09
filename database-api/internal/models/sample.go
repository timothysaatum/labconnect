package models

import (
    "gorm.io/gorm"
)

type Sample struct {
    gorm.Model
    Name         string `json:"name"`
    LaboratoryID uint   `json:"laboratory_id"`
    Laboratory   Facility
}
