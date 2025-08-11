// controllers/qr.go
package controllers

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/Santannafe12/pagcore-backend/config"
	"github.com/Santannafe12/pagcore-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

type GenerateQRInput struct {
	Amount float64 `json:"amount" binding:"required,gt=0"` // Enforce amount > 0
}

func GenerateQR(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input GenerateQRInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	expiresAt := time.Now().UTC().Add(10 * time.Minute) // Use UTC for consistency
	qr := models.QRCode{
		UserID:    userID,
		Amount:    input.Amount,
		Status:    models.QRStatusActive,
		ExpiresAt: expiresAt,
	}
	if err := config.DB.Create(&qr).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create QR"})
		return
	}
	fmt.Printf("Created QR code with ID: %d, Amount: %f, ExpiresAt: %s\n", qr.ID, qr.Amount, qr.ExpiresAt.Format(time.RFC3339))
	qrContent := "pagcore:" + strconv.Itoa(int(qr.ID))
	png, err := qrcode.Encode(qrContent, qrcode.Medium, 256)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate QR image"})
		return
	}
	base64QR := base64.StdEncoding.EncodeToString(png)
	qr.QRCode = base64QR
	if err := config.DB.Save(&qr).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update QR"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"qr_code": base64QR, "id": qr.ID, "expires_at": qr.ExpiresAt.Format(time.RFC3339)})
}

type ProcessQRInput struct {
	QRCodeID uint `json:"qr_code_id" binding:"required"`
}

func ProcessQR(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input ProcessQRInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var qr models.QRCode
	if err := config.DB.First(&qr, input.QRCodeID).Error; err != nil {
		fmt.Printf("QR code %d not found\n", input.QRCodeID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid QR code"})
		return
	}
	if userID == qr.UserID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot pay your own QR code"})
		return
	}
	fmt.Printf("Processing QR code %d, Status: %s, ExpiresAt: %s, CurrentTime: %s\n",
		qr.ID, qr.Status, qr.ExpiresAt.Format(time.RFC3339), time.Now().UTC().Format(time.RFC3339))
	if qr.Status == models.QRStatusExpired || time.Now().UTC().After(qr.ExpiresAt.Add(30*time.Second)) { // Add 30s grace period
		c.JSON(http.StatusBadRequest, gin.H{"error": "QR code expired", "expires_at": qr.ExpiresAt.Format(time.RFC3339)})
		return
	}
	var scanner, recipient models.User
	if err := config.DB.First(&scanner, userID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Scanner user not found"})
		return
	}
	if err := config.DB.First(&recipient, qr.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recipient user not found"})
		return
	}
	if scanner.Balance < qr.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient balance"})
		return
	}
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		scanner.Balance -= qr.Amount
		recipient.Balance += qr.Amount
		if err := tx.Save(&scanner).Error; err != nil {
			return err
		}
		if err := tx.Save(&recipient).Error; err != nil {
			return err
		}
		qr.Status = models.QRStatusExpired
		if err := tx.Save(&qr).Error; err != nil {
			return err
		}
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

func GetQR(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid QR code ID"})
		return
	}
	var qr models.QRCode
	if err := config.DB.Preload("User").First(&qr, id).Error; err != nil {
		fmt.Printf("QR code %d not found\n", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "QR code not found"})
		return
	}
	fmt.Printf("Retrieved QR code %d, Status: %s, ExpiresAt: %s, CurrentTime: %s\n",
		qr.ID, qr.Status, qr.ExpiresAt.Format(time.RFC3339), time.Now().UTC().Format(time.RFC3339))
	if qr.Status == models.QRStatusExpired || time.Now().UTC().After(qr.ExpiresAt.Add(30*time.Second)) { // Add 30s grace period
		c.JSON(http.StatusBadRequest, gin.H{"error": "QR code expired", "expires_at": qr.ExpiresAt.Format(time.RFC3339)})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"id":             qr.ID,
		"amount":         qr.Amount,
		"recipient":      qr.User.Username,
		"recipient_name": qr.User.FullName,
	})
}
