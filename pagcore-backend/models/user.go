package models

import "time"

type UserStatus string
type UserRole string

const (
	UserStatusActive  UserStatus = "active"
	UserStatusBlocked UserStatus = "blocked"
	UserRoleUser      UserRole   = "user"
	UserRoleAdmin     UserRole   = "admin"
)

type User struct {
	ID        uint       `gorm:"primaryKey"`
	FullName  string     `gorm:"not null"`
	Email     string     `gorm:"unique;not null"`
	Username  string     `gorm:"unique;not null"`
	CPF       string     `gorm:"unique;not null"`
	Password  string     `gorm:"not null"`
	Balance   float64    `gorm:"default:0.00"`
	Status    UserStatus `gorm:"default:active"`
	Role      UserRole   `gorm:"default:user"`
	CreatedAt time.Time  `gorm:"default:now()"`
	UpdatedAt time.Time  `gorm:"default:now()"`
}
