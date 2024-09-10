package models

import (
    "gorm.io/gorm"
     "time"
)

type Facility struct {
    gorm.Model
    ID              uint `json:"id"`
    PostalAddress   string `json:"postal_address"`
    Email           string `json:"email"`
    Phone           string `json:"phone"`
    FacilityType    string `json:"facility_type"`
    DateCreated     time.Time `json:"date_created"`
    DateModified    time.Time `json:"date_modified"`
}


// TableName overrides the default table name used by GORM
func (Facility) TableName() string {
    return "modelmixins_facility"
}