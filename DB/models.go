package main

import "time"

type Sample struct {
    ID                int       `json:"id"`
    ReferringFacility int       `json:"referring_facility"`
    FacilityType      string    `json:"facility_type"`
    SenderFullName    string    `json:"sender_full_name"`
    SenderPhone       string    `json:"sender_phone"`
    SenderEmail       string    `json:"sender_email"`
    PatientName       string    `json:"patient_name"`
    PatientAge        time.Time `json:"patient_age"`
    PatientSex        string    `json:"patient_sex"`
    Delivery          int       `json:"delivery"`
    ToLaboratory      int       `json:"to_laboratory"`
    SampleStatus      string    `json:"sample_status"`
    IsMarkedSent      bool      `json:"is_marked_sent"`
    IsRejected        bool      `json:"is_rejected"`
    RejectionReason   string    `json:"rejection_reason"`
    Priority          string    `json:"priority"`
    DateCreated       time.Time `json:"date_created"`
    DateModified      time.Time `json:"date_modified"`
}
