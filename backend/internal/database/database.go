package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/Santannafe12/pag-core/backend/internal/config"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect(cfg config.Config) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Erro ao conectar no banco:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Erro ao acessar banco:", err)
	}

	log.Println("Conectado ao banco com sucesso")
}
