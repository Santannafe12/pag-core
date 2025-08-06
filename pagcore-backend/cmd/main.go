package main

import (
	"os"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/routes"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDB()
	r := routes.SetupRouter()
	r.Run(":" + os.Getenv("PORT"))
}
