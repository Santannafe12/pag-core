package models

import "time"

type TransactionType string
type TransactionStatus string

const (
	TransactionTypeTransfer TransactionType = "transfer"
	TransactionTypeDeposit TransactionType = "deposit"
	TransactionTypeRefund TransactionType = "refund"

	TransactionStatusCompleted TransactionStatus = "completed"
	TransactionStatusPending TransactionStatus = "pending"
	TransactionStatusFailed TransactionStatus = "failed"
)

type Transactions struct {
	Id int `json:"id"`
	SenderId int `json:"sender_id"`
	RecipientId int `json:"recipient_id"`
	Amount float64 `json:"amount"`
	Description string `json:"description"` // optional field
	TransactionType TransactionType `json:"transaction_type"`
	TransactionStatus TransactionStatus `json:"transaction_status"`
	QRCodeId int `json:"qr_code_id"`
	CreatedAt time.Time `json:"created_at"`
}