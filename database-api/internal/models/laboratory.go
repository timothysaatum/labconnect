package models

import (
    "gorm.io/gorm"
)

type Facility struct {
    gorm.Model
    Name               string `json:"name"`
    AccreditationNumber string `json:"accreditation_number"`
}


// TableName overrides the default table name used by GORM
func (Facility) TableName() string {
    return "modelmixins_facility"
}