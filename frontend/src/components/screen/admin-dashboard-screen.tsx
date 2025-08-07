"use client";

import { useState } from "react";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import UserList from "../user-list";
import { getStats } from "@/actions/admin";
import Link from "next/link";

export default function AdminDashboardScreen({ stats, users }: { stats: any, users: any }) {
  const { toast } = useToast();

  // Parse the stats.value and users.value strings into objects
  const parsedStats = JSON.parse(stats.value);
  const parsedUsers = JSON.parse(users.value).map((user: any) => ({
    id: user.ID.toString(), // Convert ID to string to match User interface
    fullName: user.FullName.trim(), // Trim any extra whitespace
    email: user.Email.trim(), // Trim any extra whitespace
    createdAt: user.CreatedAt,
    status: user.Status,
  }));

  console.log("parsedStats:", parsedStats);
  console.log("parsedUsers:", parsedUsers);

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
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all"
                >
                  <Users className="h-4 w-4" />
                  Voltar a Dashboard
                </Link>
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6">
            <div className="flex flex-1 items-center gap-4">
              <h1 className="text-lg font-semibold md:hidden">PagCore Admin</h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold">Painel de Administração</h1>

              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Usuários
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {parsedStats.totalUsers}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Volume de Transações
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {parsedStats.totalTransactionVolume}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Management */}
              <UserList users={parsedUsers} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}