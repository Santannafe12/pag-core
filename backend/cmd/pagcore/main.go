package main

import (
	"log"
	"net/http"

	"github.com/Santannafe12/pag-core/backend/api/handler"
)

func main() {
	http.HandleFunc("/ping", handler.Ping)

	log.Println("Servidor rodando na porta 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
