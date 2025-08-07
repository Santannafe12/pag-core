// components/screen/dashboard-screen.tsx (Client Component - no async functions)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/logout";

export default function DashboardScreen({
  user,
  transactions: initialTransactions,
  role,
}: {
  user: any;
  transactions: any[];
  role: any;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(initialTransactions);
  const router = useRouter();

  const handleLogout = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8080/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    logout();
  };

  useEffect(() => {
    const filtered = initialTransactions.filter((tx) => {
      const isOutflow = tx.SenderID === user.user_id;
      const otherUser = isOutflow ? tx.Recipient : tx.Sender;
      const description =
        tx.Description ||
        (isOutflow
          ? `Transfer to ${otherUser.FullName}`
          : `Payment from ${otherUser.FullName}`);
      return (
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.Amount.toString().includes(searchQuery) ||
        new Date(tx.CreatedAt).toLocaleString("pt-BR").includes(searchQuery)
      );
    });
    setFilteredTransactions(filtered);
  }, [searchQuery, initialTransactions, user.user_id]);

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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
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
                      Transações
                    </Link>
                  </Button>
                  {role === "admin" && (
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                </div>
                <div className="mt-auto">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
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
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.full_name}
                  />
                  <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
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
                Transações
              </Link>
            </Button>
            {role === "admin" && (
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            )}
          </nav>
          <div className="mt-auto p-4 border-t">
            <Button
              variant="ghost"
              className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
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
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.full_name}
                      />
                      <AvatarFallback>
                        {user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={handleLogout}
                  >
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
                    <CardTitle className="text-2xl font-bold">
                      {user.full_name}
                    </CardTitle>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <CardDescription>Saldo Atual</CardDescription>
                    <CardTitle className="text-3xl font-bold">
                      R${" "}
                      {user.balance.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </CardTitle>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button
                size="lg"
                className="h-auto py-6 flex flex-col items-center gap-2"
                asChild
              >
                <Link href="/transfer">
                  <Send className="h-6 w-6" />
                  <span>Transferir</span>
                </Link>
              </Button>
              <Button
                size="lg"
                className="h-auto py-6 flex flex-col items-center gap-2"
                asChild
              >
                <Link href="/qr">
                  <QrCode className="h-6 w-6" />
                  <span>Receber via QR Code</span>
                </Link>
              </Button>
              <Button
                size="lg"
                className="h-auto py-6 flex flex-col items-center gap-2"
                asChild
              >
                <Link href="/request-payment">
                  <ArrowDownLeft className="h-6 w-6" />
                  <span>Solicitar Pagamento</span>
                </Link>
              </Button>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>
                    Suas últimas transações e atividades
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      Nenhuma transação recente
                    </p>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const isOutflow = transaction.SenderID === user.user_id;
                      const type = isOutflow ? "outflow" : "inflow";
                      const otherUser = isOutflow
                        ? transaction.Recipient
                        : transaction.Sender;
                      const description =
                        transaction.Description ||
                        (isOutflow
                          ? `Transfer to ${otherUser.FullName}`
                          : `Payment from ${otherUser.FullName}`);
                      const date = new Date(
                        transaction.CreatedAt
                      ).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      });

                      return (
                        <div
                          key={transaction.ID}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                type === "inflow"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }`}
                            >
                              {type === "inflow" ? (
                                <ArrowDownLeft className="h-5 w-5 text-green-600" />
                              ) : (
                                <ArrowUpRight className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{description}</p>
                              <p className="text-sm text-muted-foreground">
                                {date}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`font-medium ${
                              type === "inflow"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {type === "inflow" ? "+" : "-"} R${" "}
                            {transaction.Amount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
