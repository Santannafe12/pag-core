package controllers

import (
	"net/http"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetProfile(c *gin.Context) {
	userID := c.GetUint("user_id")
	var user models.User
	config.DB.First(&user, userID)
	c.JSON(http.StatusOK, gin.H{
		"full_name":  user.FullName,
		"email":      user.Email,
		"username":   user.Username,
		"cpf":        user.CPF,
		"balance":    user.Balance,
		"status":     user.Status,
		"created_at": user.CreatedAt,
	})
}

type UpdatePasswordInput struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

func UpdateProfile(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input UpdatePasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	config.DB.First(&user, userID)
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.OldPassword)) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Senha antiga inválida"})
		return
	}
	hashedNew, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	user.Password = string(hashedNew)
	config.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{"message": "Senha atualizada"})
}

func GetDashboard(c *gin.Context) {
	userID := c.GetUint("user_id")
	var user models.User
	config.DB.First(&user, userID)

	var recentTx []models.Transaction
	config.DB.Where("sender_id = ? OR recipient_id = ?", userID, userID).
		Preload("Sender").Preload("Recipient").
		Order("created_at desc").Find(&recentTx)

	c.JSON(http.StatusOK, gin.H{
		"user_id":             user.ID,
		"full_name":           user.FullName,
		"balance":             user.Balance,
		"recent_transactions": recentTx,
	})
}
