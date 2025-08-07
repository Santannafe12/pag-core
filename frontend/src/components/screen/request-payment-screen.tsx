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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const { toast } = useToast();
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

      toast({
        title: "Solicitação de Pagamento Enviada",
        description: `Solicitação de R$ ${Number.parseFloat(
          requestData.amount
        )} foi enviada para ${requestData.recipient}`,
        variant: "default",
      });

      setRequestsTab("sent");
      router.refresh(); // Refresh the page to reload server-side data
    } catch (error: any) {
      toast({
        title: "Solicitação Falhou",
        description:
          error.message ||
          "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: number) => {
    setIsLoading(true);
    try {
      await acceptPaymentRequest(requestId);
      toast({
        title: "Solicitação Aceita",
        description: "A solicitação de pagamento foi aceita com sucesso.",
        variant: "default",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Falha ao Aceitar",
        description:
          error.message || "Ocorreu um erro ao aceitar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async (requestId: number) => {
    setIsLoading(true);
    try {
      await declinePaymentRequest(requestId);
      toast({
        title: "Solicitação Recusada",
        description: "A solicitação de pagamento foi recusada com sucesso.",
        variant: "default",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Falha ao Recusar",
        description:
          error.message || "Ocorreu um erro ao recusar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            Aceita
          </Badge>
        );
      case "declined":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Recusada
          </Badge>
        );
      default:
        return null;
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
                    R$ {user.balance}
                  </CardTitle>
                </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Pagamento</CardTitle>
            <CardDescription>
              Gerencie suas solicitações de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={requestsTab}
              onValueChange={setRequestsTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="sent">Enviadas</TabsTrigger>
                <TabsTrigger value="received">Recebidas</TabsTrigger>
              </TabsList>
              <TabsContent value="sent" className="space-y-4">
                {sentRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>
                      Você ainda não enviou nenhuma solicitação de pagamento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentRequests.map((request, index) => (
                      <div
                        key={index}
                        className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div>
                              <p className="font-medium">
                                {request.Payer.Username}
                              </p>
                            </div>
                          </div>
                          {renderStatusBadge(request.Status)}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.CreatedAt).toLocaleString(
                                "pt-BR"
                              )}
                            </p>
                            <p className="text-sm">{request.Description}</p>
                          </div>
                          <p className="font-medium">R$ {request.Amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="received" className="space-y-4">
                {receivedRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Você não tem nenhuma solicitação de pagamento.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedRequests.map((request, index) => (
                      <div
                        key={index}
                        className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div>
                              <p className="font-medium">
                                {request.Requester.Username}
                              </p>
                            </div>
                          </div>
                          {renderStatusBadge(request.Status)}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.CreatedAt).toLocaleString(
                                "pt-BR"
                              )}
                            </p>
                            <p className="text-sm">{request.Description}</p>
                          </div>
                          <p className="font-medium">
                            R${" "}
                            {request.Amount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        {request.Status === "pending" && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="default"
                              className="flex-1"
                              onClick={() => handleAccept(request.ID)}
                              disabled={isLoading}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Pagar
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleDecline(request.ID)}
                              disabled={isLoading}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Recusar
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
    </div>
  );
}