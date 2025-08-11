"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, User } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { makeTransfer } from "@/actions/transfer";
import { toast } from "sonner";

interface User {
  full_name: string;
  balance: number;
  avatar?: string;
}

interface TransferScreenProps {
  user: User;
}

export default function TransferScreen({ user }: TransferScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [transferData, setTransferData] = useState({
    recipient: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format amount as currency
    if (name === "amount") {
      const formattedValue = value.replace(/[^\d.]/g, "");
      setTransferData({ ...transferData, [name]: formattedValue });
    } else {
      setTransferData({ ...transferData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!transferData.recipient.trim()) {
      newErrors.recipient = "Usuário do destinatário é obrigatório";
    }

    if (!transferData.amount) {
      newErrors.amount = "Quantia é obrigatória";
    } else {
      const amount = Number.parseFloat(transferData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Digite uma quantia válida";
      } else if (amount > user.balance) {
        newErrors.amount = "Quantia excede o valor disponível";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await makeTransfer(
        transferData.recipient,
        transferData.amount,
        transferData.description
      );

      setTransferData({
        recipient: "",
        amount: "",
        description: "",
      });
      toast("Transferência Concluída", {
        description: `R$ ${Number.parseFloat(
          transferData.amount
        ).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })} foi enviado para ${transferData.recipient}`,
      });
    } catch (error: any) {
      toast("Transferência Falhou", {
        description:
          error.message ||
          "Ocorreu um erro ao processar sua transferência. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <header className="mb-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar para o Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Transferir Dinheiro</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardDescription>Saldo Disponível</CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    R${" "}
                    {user.balance.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </CardTitle>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.full_name}
                  />
                  <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes de Transferência</CardTitle>
            <CardDescription>
              Digite o usuário do destinatário e o valor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Usuário do Recebedor</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipient"
                    name="recipient"
                    placeholder="@username"
                    className={`pl-10 ${
                      errors.recipient ? "border-red-500" : ""
                    }`}
                    value={transferData.recipient}
                    onChange={handleChange}
                  />
                </div>
                {errors.recipient && (
                  <p className="text-sm text-red-500">{errors.recipient}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Quantia</Label>
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
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Para o que é isso?"
                  value={transferData.description}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processando..." : "Transferir"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
