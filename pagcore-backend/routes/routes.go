package routes

import (
	"github.com/Santannafe12/pagcore-backend/controllers"
	"github.com/Santannafe12/pagcore-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		// Public
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)

		// Protected
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/logout", controllers.Logout)
			protected.GET("/profile", controllers.GetProfile)
			protected.PUT("/profile", controllers.UpdateProfile)
			protected.GET("/dashboard", controllers.GetDashboard)
			protected.POST("/transfer", controllers.MakeTransfer)
			protected.GET("/transactions", controllers.GetTransactionHistory)
			protected.GET("/payment/payment-requests", controllers.GetPaymentRequests)
			protected.POST("/payment/request", controllers.CreatePaymentRequest)
			protected.POST("/payment/accept/:id", controllers.AcceptPaymentRequest)
			protected.POST("/payment/decline/:id", controllers.DeclinePaymentRequest)
			protected.POST("/qr/generate", controllers.GenerateQR)
			protected.POST("/qr/process", controllers.ProcessQR) // "Read" via API

			// Admin only
			admin := protected.Group("/admin")
			admin.Use(middleware.AdminMiddleware())
			{
				admin.GET("/users", controllers.GetUsers)
				admin.POST("/users/block/:id", controllers.BlockUser)
				admin.GET("/stats", controllers.GetStats)
			}
		}
	}
	return r
}
