package config

import "os"

type Config struct {
    DBConnectionString string
}

func Load() Config {
    return Config{
        DBConnectionString: getEnv("DB_CONNECTION", "postgresql://pag-core_owner:PASSWORD@ep-proud-fog-acg6tu4u-pooler.sa-east-1.aws.neon.tech/pag-core?sslmode=require"),
    }
}

func getEnv(key, defaultVal string) string {
    if value, exists := os.LookupEnv(key); exists {
        return value
    }
    return defaultVal
}