package models

import "time"

type QRStatus string

const (
	QRStatusActive  QRStatus = "active"
	QRStatusExpired QRStatus = "expired"
)

type QRCode struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint `gorm:"index"`
	User      User `gorm:"foreignKey:UserID"`
	Amount    float64
	Status    QRStatus  `gorm:"default:active"`
	QRCode    string    `gorm:"not null"` // Base64 string
	CreatedAt time.Time `gorm:"default:now()"`
	ExpiresAt time.Time
}
