package main

import (
    "encoding/json"
    "net/http"
    "strconv"
)

func FetchSamples(w http.ResponseWriter, r *http.Request) {
    referringFacility := r.URL.Query().Get("referring_facility")
    if referringFacility == "" {
        http.Error(w, "referring_facility parameter is required", http.StatusBadRequest)
        return
    }

    referringFacilityID, err := strconv.Atoi(referringFacility)
    if err != nil {
        http.Error(w, "Invalid referring_facility parameter", http.StatusBadRequest)
        return
    }

    query := `SELECT id, referring_facility, facility_type, sender_full_name, 
                     sender_phone, sender_email, patient_name, patient_age, 
                     patient_sex, delivery, to_laboratory, sample_status, 
                     is_marked_sent, is_rejected, rejection_reason, priority, 
                     date_created, date_modified 
              FROM sample WHERE referring_facility = ?`

    rows, err := db.Query(query, referringFacilityID)
    if err != nil {
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var samples []Sample
    for rows.Next() {
        var sample Sample
        err := rows.Scan(
            &sample.ID, &sample.ReferringFacility, &sample.FacilityType, 
            &sample.SenderFullName, &sample.SenderPhone, &sample.SenderEmail, 
            &sample.PatientName, &sample.PatientAge, &sample.PatientSex, 
            &sample.Delivery, &sample.ToLaboratory, &sample.SampleStatus, 
            &sample.IsMarkedSent, &sample.IsRejected, &sample.RejectionReason, 
            &sample.Priority, &sample.DateCreated, &sample.DateModified,
        )
        if err != nil {
            http.Error(w, "Error scanning data", http.StatusInternalServerError)
            return
        }
        samples = append(samples, sample)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(samples)
}
