package models

import "time"

type Sessions struct {
	Id int `json:"id"`
	UserId int `json:"user_id"`
	Token string `json:"token"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}