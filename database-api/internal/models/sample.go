package models

import (
    "gorm.io/gorm"
    // "github.com/google/uuid"
    "time"
)

// type Sample struct {
//     gorm.Model
//     Name         string `json:"name"`
//     LaboratoryID uint   `json:"laboratory_id"`
//     Laboratory   Facility
// }

type Sample struct {
    gorm.Model
    ID                int       `json:"id"`
    ReferringFacility uint      `json:"referring_facility"`
    ToLaboratory      uint      `json:"to_laboratory"`
    PatientName       string    `json:"patient_name"`
    FacilityType      string    `json:"facility_type"`
    SenderFullName    string    `json:"sender_full_name"`
    SenderPhone       string    `json:"sender_phone"`
    SenderEmail       string    `json:"sender_email"`
    PatientAge        string    `json:"patient_age"`
    PatientSex        string    `json:"patient_sex"`
    ClinicalHistory   string    `json:"clinical_history"`
    Attachment        string    `json:"attachment"`
    SampleStatus      string    `json:"sample_status"`
    IsMarkedSent      bool      `json:"is_marked_sent"`
    IsRejected        bool      `json:"is_rejected"`
    RejectionReason   string    `json:"rejection_reason"`
    Priority          string    `json:"priority"`
    DateCreated       time.Time `json:"date_created"`
    DateModified      time.Time `json:"date_modified"`
}
//set DATABASE_PATH=C:\Users\TIMOTHY\Desktop\Projects\labs\labconnect\db.sqlite3
