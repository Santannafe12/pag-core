"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock, DollarSign, Mail, MessageSquare, User, X } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock data for payment requests
const sentRequests = [
  {
    id: "req1",
    recipient: "Maria Silva",
    email: "maria.silva@example.com",
    amount: 150.0,
    message: "For dinner last night",
    date: "Today, 10:30",
    status: "pending",
  },
  {
    id: "req2",
    recipient: "João Santos",
    email: "joao.santos@example.com",
    amount: 75.5,
    message: "Movie tickets",
    date: "Yesterday, 18:45",
    status: "accepted",
  },
  {
    id: "req3",
    recipient: "Ana Pereira",
    email: "ana.pereira@example.com",
    amount: 200.0,
    message: "Shared expenses",
    date: "Apr 15, 2025",
    status: "rejected",
  },
]

const receivedRequests = [
  {
    id: "req4",
    sender: "Carlos Mendes",
    email: "carlos.mendes@example.com",
    amount: 320.0,
    message: "Project consultation",
    date: "Today, 09:15",
    status: "pending",
  },
  {
    id: "req5",
    sender: "Lucia Ferreira",
    email: "lucia.ferreira@example.com",
    amount: 45.75,
    message: "Coffee and snacks",
    date: "Yesterday, 14:20",
    status: "pending",
  },
]

export default function RequestPaymentScreen() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [requestData, setRequestData] = useState({
    recipient: "",
    amount: "",
    message: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("email")
  const [requestsTab, setRequestsTab] = useState("sent")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Format amount as currency
    if (name === "amount") {
      // Allow only numbers and decimal point
      const formattedValue = value.replace(/[^\d.]/g, "")
      setRequestData({ ...requestData, [name]: formattedValue })
    } else {
      setRequestData({ ...requestData, [name]: value })
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate recipient
    if (!requestData.recipient.trim()) {
      newErrors.recipient = "Recipient is required"
    }

    // Validate amount
    if (!requestData.amount) {
      newErrors.amount = "Amount is required"
    } else {
      const amount = Number.parseFloat(requestData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Please enter a valid amount"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setShowPasswordDialog(true)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestData({ ...requestData, password: e.target.value })

    // Clear error when user starts typing
    if (errors.password) {
      setErrors({ ...errors, password: "" })
    }
  }

  const handleConfirmRequest = async () => {
    // Validate password
    if (!requestData.password) {
      setErrors({ ...errors, password: "Password is required" })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Close dialog
      setShowPasswordDialog(false)

      // Reset form
      setRequestData({
        recipient: "",
        amount: "",
        message: "",
        password: "",
      })

      // Show success toast
      toast({
        title: "Payment Request Sent",
        description: `Request for R$ ${Number.parseFloat(requestData.amount).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })} has been sent to ${requestData.recipient}`,
        variant: "default",
      })

      // Switch to sent requests tab
      setRequestsTab("sent")
    } catch {
      // Show error toast
      toast({
        title: "Request Failed",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <X className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <header className="mb-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Request Payment</h1>
          </div>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>Enter the recipient and amount to request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="username">Username</TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recipient-email"
                        name="recipient"
                        type="email"
                        placeholder="name@example.com"
                        className={`pl-10 ${errors.recipient ? "border-red-500" : ""}`}
                        value={requestData.recipient}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.recipient && <p className="text-sm text-red-500">{errors.recipient}</p>}
                  </div>
                </TabsContent>
                <TabsContent value="username" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-username">Recipient Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recipient-username"
                        name="recipient"
                        placeholder="@username"
                        className={`pl-10 ${errors.recipient ? "border-red-500" : ""}`}
                        value={requestData.recipient}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.recipient && <p className="text-sm text-red-500">{errors.recipient}</p>}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    name="amount"
                    placeholder="0.00"
                    className={`pl-10 ${errors.amount ? "border-red-500" : ""}`}
                    value={requestData.amount}
                    onChange={handleChange}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="What's this payment for?"
                    className={`pl-10 min-h-[80px]`}
                    value={requestData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Request Payment
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Requests</CardTitle>
            <CardDescription>Manage your payment requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={requestsTab} onValueChange={setRequestsTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
              </TabsList>
              <TabsContent value="sent" className="space-y-4">
                {sentRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven`&apos;`t sent any payment requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{request.recipient.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{request.recipient}</p>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                            </div>
                          </div>
                          {renderStatusBadge(request.status)}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm text-muted-foreground">{request.date}</p>
                            <p className="text-sm">{request.message}</p>
                          </div>
                          <p className="font-medium">
                            R$ {request.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="received" className="space-y-4">
                {receivedRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You don`&apos;`t have any payment requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{request.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{request.sender}</p>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                            </div>
                          </div>
                          {renderStatusBadge(request.status)}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm text-muted-foreground">{request.date}</p>
                            <p className="text-sm">{request.message}</p>
                          </div>
                          <p className="font-medium">
                            R$ {request.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        {request.status === "pending" && (
                          <div className="flex gap-2 mt-4">
                            <Button variant="default" className="flex-1">
                              <Check className="mr-1 h-4 w-4" />
                              Pay
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <X className="mr-1 h-4 w-4" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Password Confirmation Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment Request</DialogTitle>
            <DialogDescription>
              You are about to request R${" "}
              {requestData.amount
                ? Number.parseFloat(requestData.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                : "0.00"}{" "}
              from {requestData.recipient}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Enter your password to confirm</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                className={errors.password ? "border-red-500" : ""}
                value={requestData.password}
                onChange={handlePasswordChange}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmRequest} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
