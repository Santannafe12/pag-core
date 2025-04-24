"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Filter,
  RefreshCcw,
  Search,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    date: "2025-04-17T14:30:00",
    type: "sent",
    amount: 250.0,
    counterparty: {
      name: "Maria Silva",
      username: "maria.silva",
    },
    description: "Dinner payment",
    status: "completed",
  },
  {
    id: "tx2",
    date: "2025-04-16T09:15:00",
    type: "received",
    amount: 1200.0,
    counterparty: {
      name: "João Santos",
      username: "joao.santos",
    },
    description: "Project payment",
    status: "completed",
  },
  {
    id: "tx3",
    date: "2025-04-15T11:45:00",
    type: "sent",
    amount: 142.75,
    counterparty: {
      name: "Electricity Company",
      username: "electricity.co",
    },
    description: "Electricity bill",
    status: "completed",
  },
  {
    id: "tx4",
    date: "2025-04-12T16:20:00",
    type: "refund",
    amount: 89.9,
    counterparty: {
      name: "Online Store",
      username: "online.store",
    },
    description: "Refund for returned item",
    status: "completed",
  },
  {
    id: "tx5",
    date: "2025-04-10T08:30:00",
    type: "sent",
    amount: 156.32,
    counterparty: {
      name: "Supermarket",
      username: "super.market",
    },
    description: "Groceries",
    status: "completed",
  },
  {
    id: "tx6",
    date: "2025-04-08T13:45:00",
    type: "cashback",
    amount: 25.5,
    counterparty: {
      name: "PagCore Rewards",
      username: "pagcore.rewards",
    },
    description: "Monthly cashback",
    status: "completed",
  },
  {
    id: "tx7",
    date: "2025-04-05T19:10:00",
    type: "received",
    amount: 350.0,
    counterparty: {
      name: "Ana Pereira",
      username: "ana.pereira",
    },
    description: "Shared expenses",
    status: "completed",
  },
  {
    id: "tx8",
    date: "2025-04-03T10:25:00",
    type: "sent",
    amount: 75.0,
    counterparty: {
      name: "Carlos Mendes",
      username: "carlos.mendes",
    },
    description: "Lunch payment",
    status: "completed",
  },
  {
    id: "tx9",
    date: "2025-04-01T15:50:00",
    type: "received",
    amount: 500.0,
    counterparty: {
      name: "Lucia Ferreira",
      username: "lucia.ferreira",
    },
    description: "Freelance work",
    status: "completed",
  },
  {
    id: "tx10",
    date: "2025-03-28T09:30:00",
    type: "sent",
    amount: 120.0,
    counterparty: {
      name: "Internet Provider",
      username: "internet.provider",
    },
    description: "Internet bill",
    status: "completed",
  },
]

// Transaction type options
const transactionTypes = [
  { value: "all", label: "All Types" },
  { value: "sent", label: "Sent" },
  { value: "received", label: "Received" },
  { value: "cashback", label: "Cashback" },
  { value: "refund", label: "Refund" },
]

// Sort options
const sortOptions = [
  { value: "date-desc", label: "Date (Newest First)" },
  { value: "date-asc", label: "Date (Oldest First)" },
  { value: "amount-desc", label: "Amount (Highest First)" },
  { value: "amount-asc", label: "Amount (Lowest First)" },
]

export default function TransactionHistoryScreen() {
  const isMobile = useMobile()
  const [page, setPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [amountRange, setAmountRange] = useState({
    min: "",
    max: "",
  })

  // Sort state
  const [sortBy, setSortBy] = useState("date-desc")

  // Items per page
  const itemsPerPage = 5

  // Apply filters and sorting to transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...mockTransactions]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (tx) =>
          tx.counterparty.name.toLowerCase().includes(query) ||
          tx.counterparty.username.toLowerCase().includes(query) ||
          tx.description.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter((tx) => selectedTypes.includes(tx.type))
    }

    // Apply date range filter
    if (dateRange.from) {
      result = result.filter((tx) => new Date(tx.date) >= dateRange.from!)
    }
    if (dateRange.to) {
      // Add one day to include the end date fully
      const endDate = new Date(dateRange.to)
      endDate.setDate(endDate.getDate() + 1)
      result = result.filter((tx) => new Date(tx.date) < endDate)
    }

    // Apply amount range filter
    if (amountRange.min) {
      const min = Number.parseFloat(amountRange.min)
      if (!isNaN(min)) {
        result = result.filter((tx) => tx.amount >= min)
      }
    }
    if (amountRange.max) {
      const max = Number.parseFloat(amountRange.max)
      if (!isNaN(max)) {
        result = result.filter((tx) => tx.amount <= max)
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        default:
          return 0
      }
    })

    return result
  }, [mockTransactions, searchQuery, selectedTypes, dateRange, amountRange, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredAndSortedTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedTypes([])
    setDateRange({ from: undefined, to: undefined })
    setAmountRange({ min: "", max: "" })
    setSortBy("date-desc")
    setPage(1)
  }

  // Handle type selection
  const handleTypeSelection = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Get transaction details by ID
  const getTransactionById = (id: string) => {
    return mockTransactions.find((tx) => tx.id === id)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy • h:mm a")
  }

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "sent":
        return <ArrowUpRight className="h-5 w-5 text-red-600" />
      case "received":
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />
      case "cashback":
        return <RefreshCcw className="h-5 w-5 text-blue-600" />
      case "refund":
        return <ArrowDownLeft className="h-5 w-5 text-purple-600" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />
    }
  }

  // Get transaction color based on type
  const getTransactionColor = (type: string) => {
    switch (type) {
      case "sent":
        return "text-red-600"
      case "received":
        return "text-green-600"
      case "cashback":
        return "text-blue-600"
      case "refund":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  // Get transaction badge based on type
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "sent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Sent
          </Badge>
        )
      case "received":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Received
          </Badge>
        )
      case "cashback":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Cashback
          </Badge>
        )
      case "refund":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Refund
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Other
          </Badge>
        )
    }
  }

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredAndSortedTransactions.reduce(
      (acc, tx) => {
        if (tx.type === "received" || tx.type === "cashback" || tx.type === "refund") {
          acc.inflow += tx.amount
        } else if (tx.type === "sent") {
          acc.outflow += tx.amount
        }
        return acc
      },
      { inflow: 0, outflow: 0 },
    )

    return {
      inflow: total.inflow,
      outflow: total.outflow,
      net: total.inflow - total.outflow,
    }
  }, [filteredAndSortedTransactions])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <header className="mb-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardDescription>Total Inflow</CardDescription>
                  <CardTitle className="text-xl font-bold text-green-600">
                    + R$ {summaryStats.inflow.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </CardTitle>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardDescription>Total Outflow</CardDescription>
                  <CardTitle className="text-xl font-bold text-red-600">
                    - R$ {summaryStats.outflow.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </CardTitle>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardDescription>Net Balance</CardDescription>
                  <CardTitle
                    className={`text-xl font-bold ${summaryStats.net >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {summaryStats.net >= 0 ? "+" : "-"} R${" "}
                    {Math.abs(summaryStats.net).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </CardTitle>
                </div>
                <div
                  className={`h-10 w-10 rounded-full ${
                    summaryStats.net >= 0 ? "bg-green-100" : "bg-red-100"
                  } flex items-center justify-center`}
                >
                  {summaryStats.net >= 0 ? (
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Sort Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, username, or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {isMobile ? (
                  <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Filter Transactions</DrawerTitle>
                        <DrawerDescription>Apply filters to your transaction history</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 space-y-4">
                        {/* Transaction Type Filter */}
                        <div className="space-y-2">
                          <Label>Transaction Type</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {transactionTypes.slice(1).map((type) => (
                              <div key={type.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`type-${type.value}-mobile`}
                                  checked={selectedTypes.includes(type.value)}
                                  onCheckedChange={() => handleTypeSelection(type.value)}
                                />
                                <Label htmlFor={`type-${type.value}-mobile`} className="font-normal">
                                  {type.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Date Range Filter */}
                        <div className="space-y-2">
                          <Label>Date Range</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal">
                                  {dateRange.from ? (
                                    format(dateRange.from, "MMM d, yyyy")
                                  ) : (
                                    <span className="text-muted-foreground">Start date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={dateRange.from}
                                  onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal">
                                  {dateRange.to ? (
                                    format(dateRange.to, "MMM d, yyyy")
                                  ) : (
                                    <span className="text-muted-foreground">End date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={dateRange.to}
                                  onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Amount Range Filter */}
                        <div className="space-y-2">
                          <Label>Amount Range</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <Input
                                placeholder="Min"
                                value={amountRange.min}
                                onChange={(e) => setAmountRange((prev) => ({ ...prev, min: e.target.value }))}
                              />
                            </div>
                            <div className="relative">
                              <Input
                                placeholder="Max"
                                value={amountRange.max}
                                onChange={(e) => setAmountRange((prev) => ({ ...prev, max: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <DrawerFooter>
                        <Button onClick={resetFilters} variant="outline">
                          Reset Filters
                        </Button>
                        <DrawerClose asChild>
                          <Button>Apply Filters</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px]" align="end">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter Transactions</h4>
                          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                            Reset
                          </Button>
                        </div>

                        {/* Transaction Type Filter */}
                        <div className="space-y-2">
                          <Label>Transaction Type</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {transactionTypes.slice(1).map((type) => (
                              <div key={type.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`type-${type.value}`}
                                  checked={selectedTypes.includes(type.value)}
                                  onCheckedChange={() => handleTypeSelection(type.value)}
                                />
                                <Label htmlFor={`type-${type.value}`} className="font-normal">
                                  {type.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Date Range Filter */}
                        <div className="space-y-2">
                          <Label>Date Range</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal">
                                  {dateRange.from ? (
                                    format(dateRange.from, "MMM d, yyyy")
                                  ) : (
                                    <span className="text-muted-foreground">Start date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={dateRange.from}
                                  onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal">
                                  {dateRange.to ? (
                                    format(dateRange.to, "MMM d, yyyy")
                                  ) : (
                                    <span className="text-muted-foreground">End date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={dateRange.to}
                                  onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Amount Range Filter */}
                        <div className="space-y-2">
                          <Label>Amount Range</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <Input
                                placeholder="Min"
                                value={amountRange.min}
                                onChange={(e) => setAmountRange((prev) => ({ ...prev, min: e.target.value }))}
                              />
                            </div>
                            <div className="relative">
                              <Input
                                placeholder="Max"
                                value={amountRange.max}
                                onChange={(e) => setAmountRange((prev) => ({ ...prev, max: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort by</SelectLabel>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Export Transactions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export as PDF</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedTypes.length > 0 || dateRange.from || dateRange.to || amountRange.min || amountRange.max) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {transactionTypes.find((t) => t.value === type)?.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedTypes(selectedTypes.filter((t) => t !== type))}
                    />
                  </Badge>
                ))}
                {dateRange.from && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    From: {format(dateRange.from, "MMM d, yyyy")}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setDateRange((prev) => ({ ...prev, from: undefined }))}
                    />
                  </Badge>
                )}
                {dateRange.to && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    To: {format(dateRange.to, "MMM d, yyyy")}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setDateRange((prev) => ({ ...prev, to: undefined }))}
                    />
                  </Badge>
                )}
                {amountRange.min && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Min: R$ {amountRange.min}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setAmountRange((prev) => ({ ...prev, min: "" }))}
                    />
                  </Badge>
                )}
                {amountRange.max && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Max: R$ {amountRange.max}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setAmountRange((prev) => ({ ...prev, max: "" }))}
                    />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs font-normal">
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Showing {paginatedTransactions.length} of {filteredAndSortedTransactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAndSortedTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found matching your filters.</p>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop View - Table */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Counterparty</th>
                        <th className="text-left py-3 px-4 font-medium">Description</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedTransaction(transaction.id)}
                        >
                          <td className="py-3 px-4 text-sm">{formatDate(transaction.date)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  transaction.type === "sent"
                                    ? "bg-red-100"
                                    : transaction.type === "received"
                                      ? "bg-green-100"
                                      : transaction.type === "cashback"
                                        ? "bg-blue-100"
                                        : "bg-purple-100"
                                }`}
                              >
                                {getTransactionIcon(transaction.type)}
                              </div>
                              {getTransactionBadge(transaction.type)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{transaction.counterparty.name}</p>
                              <p className="text-sm text-muted-foreground">@{transaction.counterparty.username}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{transaction.description}</td>
                          <td className={`py-3 px-4 text-right font-medium ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === "sent" ? "-" : "+"} R${" "}
                            {transaction.amount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4">
                  {paginatedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              transaction.type === "sent"
                                ? "bg-red-100"
                                : transaction.type === "received"
                                  ? "bg-green-100"
                                  : transaction.type === "cashback"
                                    ? "bg-blue-100"
                                    : "bg-purple-100"
                            }`}
                          >
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.counterparty.name}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        {getTransactionBadge(transaction.type)}
                      </div>
                      <p className="text-sm mb-2">{transaction.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">@{transaction.counterparty.username}</p>
                        <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === "sent" ? "-" : "+"} R${" "}
                          {transaction.amount.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Drawer */}
      <Drawer
        open={!!selectedTransaction}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null)
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Transaction Details</DrawerTitle>
            <DrawerDescription>View complete transaction information</DrawerDescription>
          </DrawerHeader>
          {selectedTransaction && (
            <div className="p-4">
              {(() => {
                const transaction = getTransactionById(selectedTransaction)
                if (!transaction) return null

                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          transaction.type === "sent"
                            ? "bg-red-100"
                            : transaction.type === "received"
                              ? "bg-green-100"
                              : transaction.type === "cashback"
                                ? "bg-blue-100"
                                : "bg-purple-100"
                        }`}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.counterparty.name}</h3>
                        <p className="text-sm text-muted-foreground">@{transaction.counterparty.username}</p>
                      </div>
                    </div>

                    <div
                      className={`text-center py-4 ${
                        transaction.type === "sent"
                          ? "text-red-600"
                          : transaction.type === "received"
                            ? "text-green-600"
                            : transaction.type === "cashback"
                              ? "text-blue-600"
                              : transaction.type === "text-purple-600"
                      }`}
                    >
                      <p className="text-sm font-medium">{transaction.type.toUpperCase()}</p>
                      <p className="text-3xl font-bold">
                        {transaction.type === "sent" ? "-" : "+"} R${" "}
                        {transaction.amount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Date & Time</p>
                        <p className="font-medium">{formatDate(transaction.date)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Transaction Type</p>
                        <div>{getTransactionBadge(transaction.type)}</div>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Description</p>
                        <p className="font-medium">{transaction.description}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-center gap-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Receipt
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Repeat
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
