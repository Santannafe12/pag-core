"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Check, Copy, Download, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

import {QRCodeSVG} from 'qrcode.react';

export default function QRCodeScreen() {
  const { toast } = useToast()
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState("receive")
  const [amount, setAmount] = useState("")
  const [scanning, setScanning] = useState(false)
  const [scannedData, setScannedData] = useState<null | { username: string; amount?: string }>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  // Mock user data
  const user = {
    username: "carlos.oliveira",
    name: "Carlos Oliveira",
  }

  // Generate payment URL
  const paymentUrl = `https://pagcore.com/pay?to=${user.username}${amount ? `&amount=${amount}` : ""}`

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^\d.]/g, "")
    setAmount(value)
  }

  // Copy payment link to clipboard
  const copyPaymentLink = () => {
    navigator.clipboard.writeText(paymentUrl).then(
      () => {
        toast({
          title: "Link Copied",
          description: "Payment link copied to clipboard",
          variant: "default",
        })
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Copy Failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        })
      },
    )
  }

  // Download QR code as image
  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas")
      if (canvas) {
        const image = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = image
        link.download = `pagcore-payment-${user.username}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  // Share payment link (if Web Share API is available)
  const sharePaymentLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "PagCore Payment Request",
          text: `Payment request from ${user.name}${amount ? ` for R$ ${amount}` : ""}`,
          url: paymentUrl,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error))
    } else {
      copyPaymentLink()
    }
  }

  // Start QR code scanner
  const startScanner = async () => {
    if (!isMobile) return

    try {
      setScanning(true)
      const constraints = { video: { facingMode: "environment" } }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start scanning for QR codes
        requestAnimationFrame(scanQRCode)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setScanning(false)
      toast({
        title: "Camera Access Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Stop QR code scanner
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  // Scan for QR codes in video stream
  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight
      canvas.width = video.videoWidth

      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // In a real implementation, you would use a QR code scanning library here
      // For this example, we'll simulate a successful scan after a few seconds
      setTimeout(() => {
        if (scanning) {
          // Simulate finding a QR code with payment data
          const mockData = {
            username: "maria.silva",
            amount: "150.00",
          }

          setScannedData(mockData)
          stopScanner()

          toast({
            title: "QR Code Scanned",
            description: "Payment details detected",
            variant: "default",
          })
        }
      }, 3000)
    }

    if (scanning) {
      requestAnimationFrame(scanQRCode)
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "pay") {
      // Reset scanned data when switching to pay tab
      setScannedData(null)
    } else {
      // Stop scanner when switching away from pay tab
      stopScanner()
    }
  }

  // Proceed to payment after scanning
  const proceedToPayment = () => {
    if (scannedData) {
      // In a real app, you would redirect to the payment screen with the scanned data
      toast({
        title: "Proceeding to Payment",
        description: `Paying ${scannedData.username}${scannedData.amount ? ` R$ ${scannedData.amount}` : ""}`,
        variant: "default",
      })
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <header className="mb-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">QR Code</h1>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>PagCore QR Code</CardTitle>
            <CardDescription>Generate or scan QR codes for payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="receive">Receive</TabsTrigger>
                <TabsTrigger value="pay">Pay</TabsTrigger>
              </TabsList>

              {/* Receive Tab Content */}
              <TabsContent value="receive" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Optional)</Label>
                  <Input id="amount" placeholder="0.00" value={amount} onChange={handleAmountChange} className="mb-4" />
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-2">
                    {amount
                      ? `Request payment of R$ ${amount} to @${user.username}`
                      : `Request payment to @${user.username}`}
                  </div>
                  <div ref={qrCodeRef} className="my-4">
                    <QRCodeSVG value={paymentUrl} size={200} level="H" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    Scan this code to send payment to {user.name}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <Button variant="outline" onClick={copyPaymentLink} className="flex items-center">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button variant="outline" onClick={downloadQRCode} className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={sharePaymentLink} className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </TabsContent>

              {/* Pay Tab Content */}
              <TabsContent value="pay" className="space-y-4">
                {!isMobile ? (
                  <div className="p-8 text-center border rounded-lg">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">QR Code Scanner</h3>
                    <p className="text-muted-foreground mb-4">QR code scanning is only available on mobile devices.</p>
                    <p className="text-sm">Please open PagCore on your mobile device to scan payment QR codes.</p>
                  </div>
                ) : scannedData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">QR Code Scanned Successfully</p>
                        <p className="text-sm text-green-700">Payment details detected</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Recipient</Label>
                      <div className="p-3 bg-gray-100 rounded-md">@{scannedData.username}</div>
                    </div>

                    {scannedData.amount && (
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <div className="p-3 bg-gray-100 rounded-md">
                          R${" "}
                          {Number.parseFloat(scannedData.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}

                    <Button className="w-full" onClick={proceedToPayment}>
                      Proceed to Payment
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setScannedData(null)}>
                      Scan Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                      <canvas ref={canvasRef} className="hidden" />
                      {!scanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
                          <Camera className="h-12 w-12 mb-4" />
                          <p className="text-center px-4">Tap to scan a PagCore QR code</p>
                        </div>
                      )}
                      <div className="absolute inset-0 border-[3px] border-white/30 rounded-lg pointer-events-none">
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg" />
                      </div>
                    </div>

                    <Button className="w-full" onClick={scanning ? stopScanner : startScanner}>
                      {scanning ? "Cancel Scanning" : "Start Scanner"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      Position the QR code within the frame to scan automatically
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>PagCore secure payment system</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
