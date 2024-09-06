package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    _ "github.com/mattn/go-sqlite3" // SQLite3 driver
)

var db *sql.DB


func InitializeDB() (*sql.DB, error) {
    dbPath := "./db.sqlite3"  // Replace with your actual path
    db, err := sql.Open("sqlite3", dbPath)
    if err != nil {
        return nil, err
    }
    if err := db.Ping(); err != nil {
        return nil, err
    }
    return db, nil
}

func main() {
    var err error
    db, err = InitializeDB()
    if err != nil {
        log.Fatal("Failed to connect to the database:", err)
    }
    defer db.Close()

    r := InitializeRoutes()

    fmt.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}
