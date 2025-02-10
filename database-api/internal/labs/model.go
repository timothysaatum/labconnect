package labs

import (
    "time"
)

type Facility struct {
    ID            string    `json:"id" gorm:"type:uuid;primary_key"`
    PostalAddress string    `json:"postal_address"`
    Phone         string    `json:"phone"`
    Email         string    `json:"email"`
    FacilityType  string    `json:"facility_type"`
    DeletedAt     time.Time `json:"deleted_at"`
    DateCreated   time.Time `json:"date_added"`
    DateModified  time.Time `json:"date_modified"`
}

// Overrides the default table name convention
func (Facility) TableName() string {
    return "modelmixins_facility"
}