package config

import (
	"fmt"
	"os"

	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		panic("Failed to load .env file")
	}

	// Construct DSN for Neon
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s channel_binding=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
		os.Getenv("DB_CHANNEL_BINDING"),
	)

	// Connect to the database
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}

	// Auto-migrate models
	err = DB.AutoMigrate(&models.User{}, &models.QRCode{}, &models.Transaction{}, &models.PaymentRequest{}, &models.Session{})
	if err != nil {
		panic("Failed to auto-migrate database: " + err.Error())
	}

	fmt.Println("Successfully connected to the database")
}
