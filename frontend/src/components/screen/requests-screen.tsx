"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { ArrowLeft, Check, Clock, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

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

export default function RequestsScreen({
  user,
  sentRequests,
  receivedRequests,
  createPaymentRequest,
  acceptPaymentRequest,
  declinePaymentRequest,
}: RequestPaymentScreenProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requestsTab, setRequestsTab] = useState("sent");

  const handleAccept = async (requestId: number) => {
    setIsLoading(true);
    try {
      await acceptPaymentRequest(requestId);
      toast("Solicitação Aceita", {
        description: "A solicitação de pagamento foi aceita com sucesso.",
      });
      router.refresh();
    } catch (error: any) {
      toast("Solicitação Aceita", {
        description:
          error.message || "Ocorreu um erro ao aceitar a solicitação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async (requestId: number) => {
    setIsLoading(true);
    try {
      await declinePaymentRequest(requestId);
      toast("Solicitação Recusada", {
        description: "A solicitação de pagamento foi recusada com sucesso.",
      });
      router.refresh();
    } catch (error: any) {
      toast("Falha ao Recusar", {
        description:
          error.message || "Ocorreu um erro ao recusar a solicitação.",
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
                <span className="sr-only">Voltar ao Painel</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Solicitações</h1>
          </div>
        </header>
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
