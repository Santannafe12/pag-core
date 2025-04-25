package models

import "time"

type PaymentStatus string

const (
	PaymentStatusPending PaymentStatus = "pending"
	PaymentStatusAccepted PaymentStatus = "accepetd"
	PaymentStatusDeclined PaymentStatus = "declined"
)


type PaymentRequests struct {
	Id int `json:id`
	RequesterId int `json:"requester_id"`
	PayerId int `json:"payer_id"`
	Amount float64 `json:"amount"`
	Description string `json:"description"` // optional field
	PaymentStatus PaymentStatus `json:"payment_status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}