package models

import "time"

type UserStatus string
type UserRole string

const (
	UserStatusActive  UserStatus = "active"
	UserStatusBlocked UserStatus = "blocked"

	UserRoleUser  UserRole = "user"
	UserRoleAdmin UserRole = "admin"
)

type User struct {
	Id        int        `json:"id"`
	FullName  string     `json:"full_name"`
	Email     string     `json:"email"`
	Username  string     `json:"username"`
	CPF       string     `json:"cpf"`
	Password  string     `json:"-"`
	Balance   float64    `json:"balance"`
	Status    UserStatus `json:"status"`
	Role      UserRole   `json:"role"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}
