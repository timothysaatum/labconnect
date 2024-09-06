package handlers

import (
    // "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "database-api/db"
    "database-api/models"
    "strconv"

    "github.com/gorilla/mux"
)

func GetSamplesByFacilityID(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    facilityIDStr := vars["facility_id"]
    facilityID, err := strconv.Atoi(facilityIDStr)
    if err != nil {
        http.Error(w, "Invalid facility ID", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query(`
        SELECT id, referring_facility, facility_type, sender_full_name, sender_phone, sender_email,
               patient_name, patient_age, patient_sex, delivery, to_laboratory, clinical_history,
               attachment, is_marked_sent, sample_status, is_rejected, rejection_reason, priority,
               date_created, date_modified
        FROM sample
        WHERE referring_facility = ?`, facilityID)
    
    if err != nil {
        log.Printf("Error querying database: %v", err)
        http.Error(w, "Error fetching samples", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var samples []models.Sample

    for rows.Next() {
        var sample models.Sample
        err := rows.Scan(
            &sample.ID, &sample.ReferringFacility, &sample.FacilityType, &sample.SenderFullName,
            &sample.SenderPhone, &sample.SenderEmail, &sample.PatientName, &sample.PatientAge,
            &sample.PatientSex, &sample.Delivery, &sample.ToLaboratory, &sample.ClinicalHistory,
            &sample.Attachment, &sample.IsMarkedSent, &sample.SampleStatus, &sample.IsRejected,
            &sample.RejectionReason, &sample.Priority, &sample.DateCreated, &sample.DateModified,
        )
        if err != nil {
            log.Printf("Error scanning row: %v", err)
            http.Error(w, "Error processing data", http.StatusInternalServerError)
            return
        }
        samples = append(samples, sample)
    }

    if err = rows.Err(); err != nil {
        log.Printf("Error with rows: %v", err)
        http.Error(w, "Error fetching samples", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(samples)
}
