package controllers

import (
	"net/http"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TransferInput struct {
	RecipientUsername string  `json:"recipient_username" binding:"required"`
	Amount            float64 `json:"amount" binding:"required,gt=0"`
	Description       string  `json:"description"`
}

func MakeTransfer(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input TransferInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var sender, recipient models.User
	config.DB.First(&sender, userID)
	config.DB.Where("username = ?", input.RecipientUsername).First(&recipient)
	if recipient.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recipient not found"})
		return
	}
	if sender.Balance < input.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient balance"})
		return
	}
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		sender.Balance -= input.Amount
		recipient.Balance += input.Amount
		if err := tx.Save(&sender).Error; err != nil {
			return err
		}
		if err := tx.Save(&recipient).Error; err != nil {
			return err
		}
		txRecord := models.Transaction{
			SenderID:    sender.ID,
			RecipientID: recipient.ID,
			Amount:      input.Amount,
			Description: input.Description,
			Type:        models.TransactionTypeTransfer,
		}
		return tx.Create(&txRecord).Error
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transfer failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Transfer successful"})
}

func GetTransactionHistory(c *gin.Context) {
	userID := c.GetUint("user_id")
	fromDate := c.Query("from_date") // e.g., "2025-01-01"
	toDate := c.Query("to_date")
	typeFilter := c.Query("type") // transfer, etc.

	query := config.DB.Where("sender_id = ? OR recipient_id = ?", userID, userID)
	if fromDate != "" {
		query = query.Where("created_at >= ?", fromDate)
	}
	if toDate != "" {
		query = query.Where("created_at <= ?", toDate)
	}
	if typeFilter != "" {
		query = query.Where("type = ?", typeFilter)
	}
	var txs []models.Transaction
	query.Order("created_at desc").Find(&txs)
	c.JSON(http.StatusOK, txs)
}
