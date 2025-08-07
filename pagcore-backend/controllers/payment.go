package controllers

import (
	"net/http"
	"strconv"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PaymentRequestInput struct {
	PayerUsername string  `json:"payer_username" binding:"required"`
	Amount        float64 `json:"amount" binding:"required,gt=0"`
	Description   string  `json:"description"`
}

func CreatePaymentRequest(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input PaymentRequestInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var payer models.User
	config.DB.Where("username = ?", input.PayerUsername).First(&payer)
	if payer.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payer not found"})
		return
	}
	req := models.PaymentRequest{
		RequesterID: userID,
		PayerID:     payer.ID,
		Amount:      input.Amount,
		Description: input.Description,
	}
	config.DB.Create(&req)
	c.JSON(http.StatusOK, gin.H{"message": "Payment requested"})
}

func AcceptPaymentRequest(c *gin.Context) {
	userID := c.GetUint("user_id")
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	var req models.PaymentRequest
	config.DB.First(&req, id)
	if req.PayerID != userID || req.Status != models.PaymentStatusPending {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid request"})
		return
	}
	var payer, requester models.User
	config.DB.First(&payer, userID)
	config.DB.First(&requester, req.RequesterID)
	if payer.Balance < req.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient balance"})
		return
	}
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		payer.Balance -= req.Amount
		requester.Balance += req.Amount
		if err := tx.Save(&payer).Error; err != nil {
			return err
		}
		if err := tx.Save(&requester).Error; err != nil {
			return err
		}
		req.Status = models.PaymentStatusAccepted
		if err := tx.Save(&req).Error; err != nil {
			return err
		}
		txRecord := models.Transaction{
			SenderID:    payer.ID,
			RecipientID: requester.ID,
			Amount:      req.Amount,
			Description: "Payment Request: " + req.Description,
			Type:        models.TransactionTypeTransfer,
		}
		return tx.Create(&txRecord).Error
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Accept failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Request accepted"})
}

func DeclinePaymentRequest(c *gin.Context) {
	userID := c.GetUint("user_id")
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	var req models.PaymentRequest
	config.DB.First(&req, id)
	if req.PayerID != userID || req.Status != models.PaymentStatusPending {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid request"})
		return
	}
	req.Status = models.PaymentStatusDeclined
	config.DB.Save(&req)
	c.JSON(http.StatusOK, gin.H{"message": "Request declined"})
}

func GetPaymentRequests(c *gin.Context) {
	userID := c.GetUint("user_id")
	var sentRequests []models.PaymentRequest
	var receivedRequests []models.PaymentRequest

	// Fetch sent requests (where user is the requester)
	config.DB.Preload("Requester").Preload("Payer").Where("requester_id = ?", userID).Find(&sentRequests)

	// Fetch received requests (where user is the payer)
	config.DB.Preload("Requester").Preload("Payer").Where("payer_id = ?", userID).Find(&receivedRequests)

	c.JSON(http.StatusOK, gin.H{
		"sent":     sentRequests,
		"received": receivedRequests,
	})
}
