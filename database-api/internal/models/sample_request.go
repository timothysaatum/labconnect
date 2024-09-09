package models

import (
    "gorm.io/gorm"
)

type SampleRequest struct {
    gorm.Model
    RequestDetails string `json:"request_details"`
    SampleID       uint   `json:"sample_id"`
    LaboratoryID   uint   `json:"laboratory_id"`
    Sample         Sample
    Laboratory     Facility
}
