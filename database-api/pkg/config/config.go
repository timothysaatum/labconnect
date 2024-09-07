package config

import (
    "os"
)

type Config struct {
    DatabasePath string
}

func LoadConfig() Config {
    return Config{
        DatabasePath: os.Getenv("DATABASE_PATH"),  // Load the SQLite3 database path from environment
    }
}
