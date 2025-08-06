package models

import "time"

type TransactionType string
type TransactionStatus string

const (
	TransactionTypeTransfer    TransactionType   = "transfer"
	TransactionTypeDeposit     TransactionType   = "deposit"
	TransactionTypeRefund      TransactionType   = "refund"
	TransactionStatusCompleted TransactionStatus = "completed"
	TransactionStatusPending   TransactionStatus = "pending"
	TransactionStatusFailed    TransactionStatus = "failed"
)

type Transaction struct {
	ID          uint    `gorm:"primaryKey"`
	SenderID    uint    `gorm:"index"`
	Sender      User    `gorm:"foreignKey:SenderID"`
	RecipientID uint    `gorm:"index"`
	Recipient   User    `gorm:"foreignKey:RecipientID"`
	Amount      float64 `gorm:"not null"`
	Description string
	Type        TransactionType   `gorm:"not null"`
	Status      TransactionStatus `gorm:"default:completed"`
	QRCodeID    *uint             `gorm:"index"`
	QRCode      *QRCode           `gorm:"foreignKey:QRCodeID"`
	CreatedAt   time.Time         `gorm:"default:now()"`
}
