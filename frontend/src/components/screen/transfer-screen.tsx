"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, DollarSign, Mail, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransferScreen() {
  // Mock user data
  const user = {
    name: "Carlos Oliveira",
    balance: 3842.67,
    avatar: "/placeholder.svg?height=40&width=40",
  }

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [transferData, setTransferData] = useState({
    recipient: "",
    amount: "",
    description: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format amount as currency
    if (name === "amount") {
      // Allow only numbers and decimal point
      const formattedValue = value.replace(/[^\d.]/g, "")
      setTransferData({ ...transferData, [name]: formattedValue })
    } else {
      setTransferData({ ...transferData, [name]: value })
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate recipient
    if (!transferData.recipient.trim()) {
      newErrors.recipient = "Recipient is required"
    }

    // Validate amount
    if (!transferData.amount) {
      newErrors.amount = "Amount is required"
    } else {
      const amount = Number.parseFloat(transferData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Please enter a valid amount"
      } else if (amount > user.balance) {
        newErrors.amount = "Amount exceeds your current balance"
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
    setTransferData({ ...transferData, password: e.target.value })

    // Clear error when user starts typing
    if (errors.password) {
      setErrors({ ...errors, password: "" })
    }
  }

  const handleConfirmTransfer = async () => {
    // Validate password
    if (!transferData.password) {
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
      setTransferData({
        recipient: "",
        amount: "",
        description: "",
        password: "",
      })

      // Show success toast
      toast({
        title: "Transfer Successful",
        description: `R$ ${Number.parseFloat(transferData.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} has been sent to ${transferData.recipient}`,
        variant: "default",
      })
    } catch {
      // Show error toast
      toast({
        title: "Transfer Failed",
        description: "An error occurred while processing your transfer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
            <h1 className="text-2xl font-bold">Transfer Money</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardDescription>Available Balance</CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    R$ {user.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </CardTitle>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>Enter the recipient and amount to transfer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="email" className="w-full">
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
                        value={transferData.recipient}
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
                        value={transferData.recipient}
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
                    value={transferData.amount}
                    onChange={handleChange}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="What's this for?"
                  value={transferData.description}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Recent Recipients</h3>
              <div className="space-y-2">
                {["Maria Silva", "João Santos", "Ana Pereira"].map((name, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() =>
                      setTransferData({
                        ...transferData,
                        recipient: `${name.toLowerCase().replace(" ", ".")}@example.com`,
                      })
                    }
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {name}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Password Confirmation Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              You are about to transfer R${" "}
              {transferData.amount
                ? Number.parseFloat(transferData.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                : "0.00"}{" "}
              to {transferData.recipient}
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
                value={transferData.password}
                onChange={handlePasswordChange}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmTransfer} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
