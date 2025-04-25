package database

import (
    "database/sql"
    "log"

    "github.com/Santannafe12/pag-core/backend/internal/config"
    _ "github.com/lib/pq"
)

var DB *sql.DB

func Connect(cfg config.Config) {
    var err error
    DB, err = sql.Open("postgres", cfg.DBConnectionString)
    if err != nil {
        log.Fatal("Erro ao conectar no banco:", err)
    }

    if err = DB.Ping(); err != nil {
        log.Fatal("Erro ao acessar banco:", err)
    }

    log.Println("Conectado ao banco com sucesso")
}