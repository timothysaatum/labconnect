package database

import (
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "log"
)

var DB *gorm.DB

func ConnectDB() {
    var err error
    DB, err = gorm.Open(sqlite.Open("C:\\Users\\TIMOTHY\\Desktop\\Projects\\labs\\labconnect:db.sqlite3"), &gorm.Config{})
    // log.Printf("Connected to database successfully %v", DB)
    if err != nil {
        log.Fatal("Failed to connect to database: ", err)
    }
}
