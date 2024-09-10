package repository

import (
    "gorm.io/gorm"
    "gorm.io/driver/sqlite"  // Use SQLite driver for connecting to SQLite3
    "database-api/pkg/config"
    "fmt"
)

func SetupDatabase(cfg config.Config) (*gorm.DB, error) {
    db, err := gorm.Open(sqlite.Open(cfg.DatabasePath), &gorm.Config{})
    if err != nil {
        return nil, err
    }
    fmt.Printf("Here %v", db)
    return db, nil
}
