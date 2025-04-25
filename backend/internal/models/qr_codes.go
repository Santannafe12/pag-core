package models

import "time"

type QRCodeStatus string

const (
	QRCodeStatusActive  QRCodeStatus = "active"
	QRCodeStatusExpired QRCodeStatus = "expired"
)

type QRCodes struct {
	Id        int        `json:"id"`
	UserId  int     `json:"user_id"`
	Amount float64 `json:"amount"`
	QRCodeStatus QRCodeStatus `json:"qr_code_status"`
	QRCode string `json:"qr_code"`
	CreatedAt time.Time  `json:"created_at"`
	ExpiresAt time.Time  `json:"expires_at"`
}
