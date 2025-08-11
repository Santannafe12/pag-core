package controllers

import (
	"net/http"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUsers(c *gin.Context) {
	statusFilter := c.Query("status")
	var users []models.User
	query := config.DB
	if statusFilter != "" && statusFilter != "all" {
		query = query.Where("status = ?", statusFilter)
	}
	query.Select("id", "full_name", "email", "created_at", "status").Find(&users)
	c.JSON(http.StatusOK, users)
}

func BlockUser(c *gin.Context) {
	idStr := c.Param("id")
	var user models.User
	if err := config.DB.First(&user, idStr).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	user.Status = models.UserStatusBlocked
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao bloquear usuário"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User blocked successfully"})
}

func GetStats(c *gin.Context) {
	var totalUsers int64
	if err := config.DB.Model(&models.User{}).Count(&totalUsers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user count"})
		return
	}

	var totalTransactionVolume float64
	if err := config.DB.Model(&models.Transaction{}).Select("SUM(amount)").Scan(&totalTransactionVolume).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transaction volume"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"totalUsers":             totalUsers,
		"totalTransactionVolume": totalTransactionVolume,
	})
}
