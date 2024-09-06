package main

import (
    "log"
    "net/http"
    "database-api/db"
    "database-api/handlers"

    "github.com/gorilla/mux"
)

func main() {
    // Initialize the database
    db.InitDB("db.sqlite3")

    // Create a new router
    r := mux.NewRouter()

    // Define your routes
    r.HandleFunc("/samples/{facility_id}", handlers.GetSamplesByFacilityID).Methods("GET")

    // Start the server
    log.Println("Starting server on :8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}
