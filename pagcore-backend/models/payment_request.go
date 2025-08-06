package models

import "time"

type PaymentStatus string

const (
	PaymentStatusPending  PaymentStatus = "pending"
	PaymentStatusAccepted PaymentStatus = "accepted"
	PaymentStatusDeclined PaymentStatus = "declined"
)

type PaymentRequest struct {
	ID          uint    `gorm:"primaryKey"`
	RequesterID uint    `gorm:"index"`
	Requester   User    `gorm:"foreignKey:RequesterID"`
	PayerID     uint    `gorm:"index"`
	Payer       User    `gorm:"foreignKey:PayerID"`
	Amount      float64 `gorm:"not null"`
	Description string
	Status      PaymentStatus `gorm:"default:pending"`
	CreatedAt   time.Time     `gorm:"default:now()"`
	UpdatedAt   time.Time     `gorm:"default:now()"`
}
