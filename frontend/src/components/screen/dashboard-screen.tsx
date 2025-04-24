"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CreditCard,
  LogOut,
  Menu,
  QrCode,
  Search,
  Send,
  Settings,
  User,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock transaction data
const transactions = [
  {
    id: "tx1",
    type: "outflow",
    description: "Transfer to Maria Silva",
    amount: 250.0,
    date: "Today, 14:30",
    status: "completed",
  },
  {
    id: "tx2",
    type: "inflow",
    description: "Payment from João Santos",
    amount: 1200.0,
    date: "Yesterday, 09:15",
    status: "completed",
  },
  {
    id: "tx3",
    type: "outflow",
    description: "Electricity Bill",
    amount: 142.75,
    date: "Apr 15, 2025",
    status: "completed",
  },
  {
    id: "tx4",
    type: "inflow",
    description: "Refund - Online Store",
    amount: 89.9,
    date: "Apr 12, 2025",
    status: "completed",
  },
  {
    id: "tx5",
    type: "outflow",
    description: "Supermarket",
    amount: 156.32,
    date: "Apr 10, 2025",
    status: "completed",
  },
]

export default function DashboardScreen() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mock user data
  const user = {
    name: "Carlos Oliveira",
    balance: 3842.67,
    avatar: "/placeholder.svg?height=40&width=40",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-bold text-lg">PagCore</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/dashboard">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/transactions">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Transactions
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/cards">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Cards
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                </div>
                <div className="mt-auto">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-bold text-lg">PagCore</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex h-screen lg:pt-0 pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r bg-white">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-lg">PagCore</span>
            </div>
          </div>
          <nav className="flex flex-col gap-1 p-2">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard">
                <CreditCard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/transactions">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Transactions
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/cards">
                <CreditCard className="mr-2 h-4 w-4" />
                Cards
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </nav>
          <div className="mt-auto p-4 border-t">
            <Button variant="ghost" className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between p-4 bg-white border-b">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 md:p-6">
            {/* Balance Card */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardDescription>Welcome back</CardDescription>
                    <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <CardDescription>Current Balance</CardDescription>
                    <CardTitle className="text-3xl font-bold">
                      R$ {user.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </CardTitle>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button size="lg" className="h-auto py-6 flex flex-col items-center gap-2">
                <Send className="h-6 w-6" />
                <span>Transfer</span>
              </Button>
              <Button size="lg" className="h-auto py-6 flex flex-col items-center gap-2">
                <QrCode className="h-6 w-6" />
                <span>Receive via QR Code</span>
              </Button>
              <Button size="lg" className="h-auto py-6 flex flex-col items-center gap-2">
                <ArrowDownLeft className="h-6 w-6" />
                <span>Request Payment</span>
              </Button>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent payment activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transactions">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === "inflow" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "inflow" ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div
                        className={`font-medium ${transaction.type === "inflow" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "inflow" ? "+" : "-"} R${" "}
                        {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
