"use client"

import { useState } from "react"
import {
  ArrowDownUp,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for users
const mockUsers = [
  {
    id: "user1",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@example.com",
    registrationDate: "2023-06-15T10:30:00",
    status: "active",
  },
  {
    id: "user2",
    name: "Maria Silva",
    email: "maria.silva@example.com",
    registrationDate: "2023-07-22T14:45:00",
    status: "active",
  },
  {
    id: "user3",
    name: "João Santos",
    email: "joao.santos@example.com",
    registrationDate: "2023-08-05T09:15:00",
    status: "blocked",
  },
  {
    id: "user4",
    name: "Ana Pereira",
    email: "ana.pereira@example.com",
    registrationDate: "2023-09-10T16:20:00",
    status: "active",
  },
  {
    id: "user5",
    name: "Lucas Ferreira",
    email: "lucas.ferreira@example.com",
    registrationDate: "2023-10-18T11:30:00",
    status: "pending",
  },
  {
    id: "user6",
    name: "Juliana Costa",
    email: "juliana.costa@example.com",
    registrationDate: "2023-11-25T13:45:00",
    status: "active",
  },
  {
    id: "user7",
    name: "Rafael Almeida",
    email: "rafael.almeida@example.com",
    registrationDate: "2023-12-30T10:10:00",
    status: "blocked",
  },
  {
    id: "user8",
    name: "Camila Rodrigues",
    email: "camila.rodrigues@example.com",
    registrationDate: "2024-01-15T15:30:00",
    status: "active",
  },
  {
    id: "user9",
    name: "Gabriel Martins",
    email: "gabriel.martins@example.com",
    registrationDate: "2024-02-20T09:45:00",
    status: "pending",
  },
  {
    id: "user10",
    name: "Isabela Santos",
    email: "isabela.santos@example.com",
    registrationDate: "2024-03-25T14:20:00",
    status: "active",
  },
]

// Mock data for transactions
const mockTransactions = [
  {
    id: "tx1",
    date: "2025-04-17T14:30:00",
    type: "sent",
    amount: 250.0,
    sender: {
      id: "user1",
      name: "Carlos Oliveira",
    },
    recipient: {
      id: "user2",
      name: "Maria Silva",
    },
    description: "Dinner payment",
    status: "completed",
  },
  {
    id: "tx2",
    date: "2025-04-16T09:15:00",
    type: "received",
    amount: 1200.0,
    sender: {
      id: "user3",
      name: "João Santos",
    },
    recipient: {
      id: "user4",
      name: "Ana Pereira",
    },
    description: "Project payment",
    status: "completed",
  },
  {
    id: "tx3",
    date: "2025-04-15T11:45:00",
    type: "sent",
    amount: 142.75,
    sender: {
      id: "user5",
      name: "Lucas Ferreira",
    },
    recipient: {
      id: "user6",
      name: "Juliana Costa",
    },
    description: "Electricity bill",
    status: "completed",
  },
  {
    id: "tx4",
    date: "2025-04-12T16:20:00",
    type: "refund",
    amount: 89.9,
    sender: {
      id: "user7",
      name: "Rafael Almeida",
    },
    recipient: {
      id: "user8",
      name: "Camila Rodrigues",
    },
    description: "Refund for returned item",
    status: "completed",
  },
  {
    id: "tx5",
    date: "2025-04-10T08:30:00",
    type: "sent",
    amount: 156.32,
    sender: {
      id: "user9",
      name: "Gabriel Martins",
    },
    recipient: {
      id: "user10",
      name: "Isabela Santos",
    },
    description: "Groceries",
    status: "completed",
  },
]

// System statistics
const systemStats = {
  totalUsers: 1254,
  totalTransactionVolume: 1458750.25,
  transactionsLast24Hours: 287,
  activeUsers: 1087,
  pendingUsers: 98,
  blockedUsers: 69,
}

export default function AdminDashboardScreen() {
  const { toast } = useToast()
  const [userStatusFilter, setUserStatusFilter] = useState("all")
  const [userPage, setUserPage] = useState(1)
  const [transactionPage, setTransactionPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  // Items per page
  const usersPerPage = 5
  const transactionsPerPage = 5

  // Filter users by status and search query
  const filteredUsers = mockUsers.filter((user) => {
    const matchesStatus = userStatusFilter === "all" || user.status === userStatusFilter
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Paginate users
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage)
  const paginatedUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage)

  // Paginate transactions
  const totalTransactionPages = Math.ceil(mockTransactions.length / transactionsPerPage)
  const paginatedTransactions = mockTransactions.slice(
    (transactionPage - 1) * transactionsPerPage,
    transactionPage * transactionsPerPage,
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get user status badge
  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Blocked
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Unknown
          </Badge>
        )
    }
  }

  // Handle user status change
  const handleUserStatusChange = (userId: string, newStatus: string) => {
    // In a real app, this would call an API to update the user status
    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${newStatus}.`,
      variant: "default",
    })
  }

  // Get transaction by ID
  const getTransactionById = (id: string) => {
    return mockTransactions.find((tx) => tx.id === id)
  }

  // Get user by ID
  const getUserById = (id: string) => {
    return mockUsers.find((user) => user.id === id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r">
          <div className="flex h-14 items-center border-b px-4">
            <h1 className="text-lg font-bold">PagCore Admin</h1>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Button variant="ghost" className="justify-start" asChild>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all">
                  <Users className="h-4 w-4" />
                  Users
                </a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
                >
                  <ArrowDownUp className="h-4 w-4" />
                  Transactions
                </a>
              </Button>
              {/* Additional navigation items would go here */}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6">
            <div className="flex flex-1 items-center gap-4">
              <h1 className="text-lg font-semibold md:hidden">PagCore Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>

              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {systemStats.activeUsers.toLocaleString()} active users
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                    <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {systemStats.totalTransactionVolume.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">Total transaction volume</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                    <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemStats.transactionsLast24Hours.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Transactions in the last 24 hours</p>
                  </CardContent>
                </Card>
              </div>

              {/* User Management */}
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users by name or email"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="blocked">Blocked</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter</span>
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">Registration Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No users found matching your criteria.
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedUsers.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {formatDate(user.registrationDate)}
                                </TableCell>
                                <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => setSelectedUser(user.id)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      {user.status !== "active" && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                              <Check className="mr-2 h-4 w-4" />
                                              Enable Account
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Enable User Account</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to enable this user account? They will regain
                                                access to the PagCore system.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handleUserStatusChange(user.id, "active")}
                                              >
                                                Enable Account
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                      {user.status !== "blocked" && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                              <Ban className="mr-2 h-4 w-4" />
                                              Block Account
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Block User Account</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to block this user account? They will lose access
                                                to the PagCore system.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handleUserStatusChange(user.id, "blocked")}
                                              >
                                                Block Account
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalUserPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 py-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                          disabled={userPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>
                        <div className="text-sm">
                          Page {userPage} of {totalUserPages}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                          disabled={userPage === totalUserPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>View recent transaction activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="mb-4">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="sent">Sent</TabsTrigger>
                        <TabsTrigger value="received">Received</TabsTrigger>
                        <TabsTrigger value="refund">Refunds</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="hidden md:table-cell">From</TableHead>
                            <TableHead className="hidden md:table-cell">To</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDateTime(transaction.date)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`${
                                    transaction.type === "sent"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : transaction.type === "received"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-purple-50 text-purple-700 border-purple-200"
                                  }`}
                                >
                                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                R$ {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{transaction.sender.name}</TableCell>
                              <TableCell className="hidden md:table-cell">{transaction.recipient.name}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedTransaction(transaction.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalTransactionPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 py-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTransactionPage((p) => Math.max(1, p - 1))}
                          disabled={transactionPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>
                        <div className="text-sm">
                          Page {transactionPage} of {totalTransactionPages}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTransactionPage((p) => Math.min(totalTransactionPages, p + 1))}
                          disabled={transactionPage === totalTransactionPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              {(() => {
                const transaction = getTransactionById(selectedTransaction)
                if (!transaction) return null

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                        <p className="text-sm">{transaction.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                        <p className="text-sm">{formatDateTime(transaction.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Type</p>
                        <Badge
                          variant="outline"
                          className={`${
                            transaction.type === "sent"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : transaction.type === "received"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Amount</p>
                        <p className="text-sm font-bold">
                          R$ {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-sm">{transaction.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">From</p>
                        <p className="text-sm font-medium">{transaction.sender.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {transaction.sender.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">To</p>
                        <p className="text-sm font-medium">{transaction.recipient.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {transaction.recipient.id}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete information about this user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {(() => {
                const user = getUserById(selectedUser)
                if (!user) return null

                return (
                  <>
                    <div className="flex flex-col items-center mb-4">
                      <Avatar className="h-20 w-20 mb-2">
                        <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-bold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">User ID</p>
                        <p className="text-sm">{user.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                        <p className="text-sm">{formatDate(user.registrationDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        {getUserStatusBadge(user.status)}
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      {user.status !== "active" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            handleUserStatusChange(user.id, "active")
                            setSelectedUser(null)
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Enable Account
                        </Button>
                      )}
                      {user.status !== "blocked" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            handleUserStatusChange(user.id, "blocked")
                            setSelectedUser(null)
                          }}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Block Account
                        </Button>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
