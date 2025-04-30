"use client"

import Link from "next/link"
import { CreditCard, Shield, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Pagamentos Modernos para a Era Digital</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            O PagCore simplifica sua vida financeira com soluções de pagamento rápidas, seguras e sem complicações.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg"
            >
              <Link href="/register">Criar Conta</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-10 left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recursos Poderosos para Pagamentos Modernos</h2>
            <p className="text-xl text-gray-600">Tudo o que você precisa para gerenciar suas finanças em um só lugar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-50 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transferências Instantâneas</h3>
              <p className="text-gray-600">Envie e receba dinheiro instantaneamente, sem atrasos ou períodos de espera.</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transações Seguras</h3>
              <p className="text-gray-600">Protocolos avançados de criptografia e segurança para manter seu dinheiro seguro.</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pagamentos com QR Code</h3>
              <p className="text-gray-600">Escaneie e pague com facilidade usando nossa tecnologia integrada de QR Code.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}