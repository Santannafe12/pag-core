// components/screen/qr-code-screen.tsx
"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Check, Copy, Download, Share2 } from "lucide-react";
import jsQR from "jsqr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface QRCodeScreenProps {
  user: any;
  generateQRCode: ({ amount }: { amount: number }) => Promise<any>;
  processQRCode: ({ qr_code_id }: { qr_code_id: number }) => Promise<any>;
  getQRDetails: ({ qr_code_id }: { qr_code_id: number }) => Promise<any>;
}

export default function QRCodeScreen({
  user,
  generateQRCode: serverGenerateQRCode,
  processQRCode: serverProcessQRCode,
  getQRDetails: serverGetQRDetails,
}: QRCodeScreenProps) {
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("receive");
  const [amount, setAmount] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<null | { qrCodeId: number }>(
    null
  );
  const [qrDetails, setQrDetails] = useState<null | {
    amount: number;
    recipient: string;
    recipient_name: string;
  }>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [qrCodeId, setQrCodeId] = useState<number | null>(null);
  const [manualCode, setManualCode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setAmount(value);
  };

  // Generate QR code via server action
  const generateQR = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast("Valor Inválido", {
        description: "Por favor, insira um valor maior que 0.",
      });
      return;
    }
    try {
      const data = await serverGenerateQRCode({
        amount: parsedAmount,
      });
      setQrCodeImage(`data:image/png;base64,${data.qr_code}`);
      setQrCodeId(data.id);
      toast("Código QR Gerado", {
        description: "O código QR para pagamento foi gerado com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao gerar QR:", error);
      toast("Erro ao Gerar QR", {
        description: error.message || "Falha ao gerar o código QR.",
      });
    }
  };

  // Copy QR code image to clipboard (base64)
  const copyPaymentLink = () => {
    if (qrCodeImage) {
      navigator.clipboard.writeText(qrCodeImage).then(
        () => {
          toast("Link Copiado", {
            description:
              "O código QR foi copiado para a área de transferência.",
          });
        },
        (err) => {
          console.error("Erro ao copiar:", err);
          toast("Falha ao Copiar", {
            description: "Não foi possível copiar o código QR.",
          });
        }
      );
    }
  };

  // Copy QR code ID
  const copyCode = () => {
    if (qrCodeId) {
      navigator.clipboard.writeText(qrCodeId.toString()).then(
        () => {
          toast("Código Copiado", {
            description: `Código ${qrCodeId} copiado para a área de transferência.`,
          });
        },
        (err) => {
          console.error("Erro ao copiar código:", err);
          toast("Falha ao Copiar", {
            description: "Não foi possível copiar o código.",
          });
        }
      );
    }
  };

  // Download QR code as image
  const downloadQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement("a");
      link.href = qrCodeImage;
      link.download = `pagcore-pagamento-${user.full_name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Share QR code image
  const sharePaymentLink = () => {
    if (navigator.share && qrCodeImage) {
      navigator
        .share({
          title: "Solicitação de Pagamento PagCore",
          text: `Solicitação de pagamento de ${user.full_name}${
            amount ? ` por R$ ${amount}` : ""
          }`,
          url: qrCodeImage,
        })
        .then(() => console.log("Compartilhado com sucesso"))
        .catch((error) => console.log("Erro ao compartilhar:", error));
    } else {
      copyPaymentLink();
    }
  };

  // Start QR code scanner
  const startScanner = async () => {
    if (!isMobile) return;

    try {
      setScanning(true);
      const constraints = { video: { facingMode: "environment" } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQRCode);
      }
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);
      setScanning(false);
      toast("Erro de Acesso à Câmera", {
        description:
          "Não foi possível acessar a câmera. Verifique as permissões.",
      });
    }
  };

  // Stop QR code scanner
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  // Scan for QR codes in video stream
  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        const parts = code.data.split(":");
        if (parts[0] === "pagcore") {
          const qrCodeId = parseInt(parts[1], 10);
          if (!isNaN(qrCodeId)) {
            setScannedData({ qrCodeId });
            stopScanner();
            toast("Código QR Escaneado", {
              description: "Detalhes do pagamento detectados.",
            });
          }
        }
      }
    }

    if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  // Handle manual code submit
  const handleManualSubmit = async () => {
    const id = parseInt(manualCode, 10);
    if (isNaN(id)) {
      toast("Código Inválido", {
        description: "Por favor, insira um código numérico válido.",
      });
      return;
    }
    try {
      const data = await serverGetQRDetails({ qr_code_id: id });
      setScannedData({ qrCodeId: id });
      setQrDetails({
        amount: data.amount,
        recipient: data.recipient,
        recipient_name: data.recipient_name,
      });
      setManualCode("");
      toast("Código Inserido", {
        description: "Detalhes do pagamento carregados.",
      });
    } catch (error: any) {
      console.error("Erro ao validar código:", error);
      toast("Erro ao Validar Código", {
        description: error.message || "Código inválido ou expirado.",
      });
    }
  };

  // Fetch QR details when scannedData changes
  useEffect(() => {
    if (scannedData) {
      const fetchDetails = async () => {
        try {
          const data = await serverGetQRDetails({
            qr_code_id: scannedData.qrCodeId,
          });
          setQrDetails({
            amount: data.amount,
            recipient: data.recipient,
            recipient_name: data.recipient_name,
          });
        } catch (error: any) {
          console.error("Erro ao obter detalhes do QR:", error);
          toast("Erro ao Carregar Detalhes", {
            description: error.message || "Falha ao obter detalhes do QR.",
          });
          setScannedData(null);
        }
      };
      fetchDetails();
    } else {
      setQrDetails(null);
    }
  }, [scannedData, serverGetQRDetails]);

  // Process payment via server action
  const proceedToPayment = async () => {
    if (scannedData) {
      try {
        await serverProcessQRCode({ qr_code_id: scannedData.qrCodeId });
        toast("Pagamento Processado", {
          description: "O pagamento foi concluído com sucesso.",
        });
        setScannedData(null);
      } catch (error: any) {
        console.error("Erro ao processar pagamento:", error);
        toast("Erro no Pagamento", {
          description: error.message || "Falha ao processar o pagamento.",
        });
      }
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "pay") {
      setScannedData(null);
    } else {
      stopScanner();
    }
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

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
            <h1 className="text-2xl font-bold">Código QR</h1>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Código QR PagCore</CardTitle>
            <CardDescription>
              Gerar ou escanear códigos QR para pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="receive">Receber</TabsTrigger>
                <TabsTrigger value="pay">Pagar</TabsTrigger>
              </TabsList>

              {/* Receive Tab Content */}
              <TabsContent value="receive" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    placeholder="0,00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="mb-4"
                  />
                  <Button className="w-full" onClick={generateQR}>
                    Gerar Código QR
                  </Button>
                </div>

                {qrCodeImage && (
                  <div
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border"
                    ref={qrCodeRef}
                  >
                    <div className="text-sm text-muted-foreground mb-2">
                      Solicitar pagamento de R$ {amount} para @
                      {user.username || user.full_name}
                    </div>
                    <img
                      src={qrCodeImage}
                      alt="Código QR"
                      className="my-4"
                      width={200}
                      height={200}
                    />
                    {qrCodeId && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Código: {qrCodeId}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                      Escaneie este código ou use o código {qrCodeId} para
                      enviar pagamento para {user.full_name}
                    </div>
                  </div>
                )}

                {qrCodeImage && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={downloadQRCode}
                      className="flex items-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={sharePaymentLink}
                      className="flex items-center"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartilhar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={copyCode}
                      className="flex items-center"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar QR Code
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Pay Tab Content */}
              <TabsContent value="pay" className="space-y-4">
                {scannedData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">
                          QR Code Detectado com Sucesso
                        </p>
                        <p className="text-sm text-green-700">
                          Detalhes do pagamento carregados
                        </p>
                      </div>
                    </div>

                    {qrDetails && (
                      <>
                        <div className="space-y-2">
                          <Label>Destinatário</Label>
                          <div className="p-3 bg-gray-100 rounded-md">
                            @{qrDetails.recipient} ({qrDetails.recipient_name})
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Valor</Label>
                          <div className="p-3 bg-gray-100 rounded-md">
                            R${" "}
                            {qrDetails.amount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <Button className="w-full" onClick={proceedToPayment}>
                      Confirmar Pagamento
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setScannedData(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isMobile ? (
                      <div className="space-y-4">
                        <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            muted
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          {!scanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
                              <Camera className="h-12 w-12 mb-4" />
                              <p className="text-center px-4">
                                Toque para escanear um código QR PagCore
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 border-[3px] border-white/30 rounded-lg pointer-events-none">
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg" />
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={scanning ? stopScanner : startScanner}
                        >
                          {scanning
                            ? "Cancelar Escaneamento"
                            : "Iniciar Escaner"}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                          Posicione o código QR dentro do quadro para
                          escaneamento automático
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center border rounded-lg">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">
                          Escaneamento de Código QR
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          O escaneamento está disponível apenas em dispositivos
                          móveis.
                        </p>
                        <p className="text-sm">
                          Use a entrada manual de código abaixo.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="manual-code">
                        Ou insira o código manualmente
                      </Label>
                      <Input
                        id="manual-code"
                        placeholder="Código QR (número)"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                      />
                      <Button className="w-full" onClick={handleManualSubmit}>
                        Enviar
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>Sistema de pagamento seguro PagCore</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
