package controllers

import (
	"net/http"
	"os"
	"time"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/Santannafe12/pagcore-backend/middleware"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	FullName string `json:"full_name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Username string `json:"username" binding:"required"`
	CPF      string `json:"cpf" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	user := models.User{
		FullName: input.FullName,
		Email:    input.Email,
		Username: input.Username,
		CPF:      input.CPF,
		Password: string(hashedPassword),
	}
	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	if user.Status != models.UserStatusActive {
		c.JSON(http.StatusForbidden, gin.H{"error": "User blocked"})
		return
	}
	// Generate JWT
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &middleware.Claims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	// Store session
	session := models.Session{
		UserID:    user.ID,
		Token:     tokenStr,
		ExpiresAt: expirationTime,
	}
	config.DB.Create(&session)
	c.JSON(http.StatusOK, gin.H{
		"token": tokenStr,
		"role":  user.Role,
	})
}

func Logout(c *gin.Context) {
	tokenStr := c.GetHeader("Authorization")[7:] // Bearer <token>
	config.DB.Where("token = ?", tokenStr).Delete(&models.Session{})
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
