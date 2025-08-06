package controllers

import (
	"net/http"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	statusFilter := c.Query("status")
	var users []models.User
	query := config.DB
	if statusFilter != "" {
		query = query.Where("status = ?", statusFilter)
	}
	query.Find(&users)
	c.JSON(http.StatusOK, users)
}

func BlockUser(c *gin.Context) {
	idStr := c.Param("id")
	var user models.User
	config.DB.First(&user, idStr)
	user.Status = models.UserStatusBlocked
	config.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User blocked"})
}

func GetAdminTransactions(c *gin.Context) {
	var txs []models.Transaction
	config.DB.Order("created_at desc").Limit(50).Find(&txs) // Recent 50
	c.JSON(http.StatusOK, txs)
}

func GetStats(c *gin.Context) {
	var totalUsers int64
	config.DB.Model(&models.User{}).Count(&totalUsers)
	var totalTx int64
	config.DB.Model(&models.Transaction{}).Count(&totalTx)
	c.JSON(http.StatusOK, gin.H{"total_users": totalUsers, "total_transactions": totalTx})
}
