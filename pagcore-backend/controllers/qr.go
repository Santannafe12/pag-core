package controllers

import (
	"encoding/base64"
	"net/http"
	"time"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

type GenerateQRInput struct {
	Amount float64 `json:"amount" binding:"required,gt=0"`
}

func GenerateQR(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input GenerateQRInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Generate QR content (e.g., unique ID or URL, but for simplicity, encode qr_id:amount:user_id)
	qrContent := "pagcore:" + time.Now().String() // Placeholder; make it unique/processable
	png, _ := qrcode.Encode(qrContent, qrcode.Medium, 256)
	base64QR := base64.StdEncoding.EncodeToString(png)
	qr := models.QRCode{
		UserID:    userID,
		Amount:    input.Amount,
		QRCode:    base64QR,
		ExpiresAt: time.Now().Add(10 * time.Minute), // Expires in 10 min
	}
	config.DB.Create(&qr)
	c.JSON(http.StatusOK, gin.H{"qr_code": base64QR, "id": qr.ID})
}

type ProcessQRInput struct {
	QRCodeID uint `json:"qr_code_id" binding:"required"` // Frontend "reads" by sending ID or content
}

func ProcessQR(c *gin.Context) {
	userID := c.GetUint("user_id") // Scanner's ID
	var input ProcessQRInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var qr models.QRCode
	config.DB.First(&qr, input.QRCodeID)
	if qr.ID == 0 || qr.Status == models.QRStatusExpired || time.Now().After(qr.ExpiresAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired QR"})
		return
	}
	var scanner, recipient models.User
	config.DB.First(&scanner, userID)
	config.DB.First(&recipient, qr.UserID)
	if scanner.Balance < qr.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient balance"})
		return
	}
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		scanner.Balance -= qr.Amount
		recipient.Balance += qr.Amount
		tx.Save(&scanner)
		tx.Save(&recipient)
		qr.Status = models.QRStatusExpired
		tx.Save(&qr)
		txRecord := models.Transaction{
			SenderID:    userID,
			RecipientID: qr.UserID,
			Amount:      qr.Amount,
			Type:        models.TransactionTypeTransfer,
			QRCodeID:    &qr.ID,
		}
		return tx.Create(&txRecord).Error
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Payment failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Payment processed"})
}
