"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock, DollarSign, User, X } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

interface PaymentRequest {
  ID: number;
  RequesterID: number;
  PayerID: number;
  Requester: {
    ID: number;
    FullName: string;
    Email: string;
    Username: string;
    CPF: string;
    Password: string;
    Balance: number;
    Status: string;
    Role: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  Payer: {
    ID: number;
    FullName: string;
    Email: string;
    Username: string;
    CPF: string;
    Password: string;
    Balance: number;
    Status: string;
    Role: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  Amount: number;
  Description: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface User {
  full_name: string;
  balance: number;
  avatar?: string;
}

interface RequestPaymentScreenProps {
  user: User;
  sentRequests: PaymentRequest[];
  receivedRequests: PaymentRequest[];
  createPaymentRequest: (
    payerUsername: string,
    amount: string,
    description: string
  ) => Promise<any>;
  acceptPaymentRequest: (requestId: number) => Promise<any>;
  declinePaymentRequest: (requestId: number) => Promise<any>;
  getPaymentRequests: () => Promise<{
    sent: PaymentRequest[];
    received: PaymentRequest[];
  }>;
}

export default function RequestPaymentScreen({
  user,
  sentRequests,
  receivedRequests,
  createPaymentRequest,
  acceptPaymentRequest,
  declinePaymentRequest,
}: RequestPaymentScreenProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    recipient: "",
    amount: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestsTab, setRequestsTab] = useState("sent");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const formattedValue = value.replace(/[^\d.]/g, "");
      setRequestData({ ...requestData, [name]: formattedValue });
    } else {
      setRequestData({ ...requestData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!requestData.recipient.trim()) {
      newErrors.recipient = "Usuário do pagador é obrigatório";
    }

    if (!requestData.amount) {
      newErrors.amount = "Quantia é obrigatória";
    } else {
      const amount = Number.parseFloat(requestData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Digite uma quantia válida";
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
      await createPaymentRequest(
        requestData.recipient,
        requestData.amount,
        requestData.message
      );

      setRequestData({
        recipient: "",
        amount: "",
        message: "",
      });

      toast("Solicitação de Pagamento Enviada", {
        description: `Solicitação de R$ ${Number.parseFloat(
          requestData.amount
        )} foi enviada para ${requestData.recipient}`,
      });

      setRequestsTab("sent");
      router.refresh(); // Refresh the page to reload server-side data
    } catch (error: any) {
      toast("Solicitação Falhou", {
        description:
          error.message ||
          "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
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
            <h1 className="text-2xl font-bold">Solicitar Pagamento</h1>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalhes da Solicitação</CardTitle>
            <CardDescription>
              Digite o usuário do pagador e o valor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Usuário do Pagador</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipient"
                    name="recipient"
                    placeholder="@username"
                    className={`pl-10 ${
                      errors.recipient ? "border-red-500" : ""
                    }`}
                    value={requestData.recipient}
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
                    value={requestData.amount}
                    onChange={handleChange}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem (Opcional)</Label>
                <div className="relative">
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Para que é esse pagamento?"
                    className={`min-h-[80px]`}
                    value={requestData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processando..." : "Solicitar Pagamento"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
