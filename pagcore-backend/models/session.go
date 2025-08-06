package models

import "time"

type Session struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"index"`
	User      User      `gorm:"foreignKey:UserID"`
	Token     string    `gorm:"not null"`
	CreatedAt time.Time `gorm:"default:now()"`
	ExpiresAt time.Time
}
