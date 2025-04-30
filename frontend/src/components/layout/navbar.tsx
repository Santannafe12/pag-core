"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center mr-2">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-purple-600">PagCore</span>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-700 hover:text-purple-600 transition-colors"
          >
            Recursos
          </a>
          <a
            href="#benefits"
            className="text-gray-700 hover:text-purple-600 transition-colors"
          >
            Benefícios
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 transition-colors"
          >
            Preços
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 transition-colors"
          >
            Suporte
          </a>
        </nav>

        {/* Botão do Menu Mobile */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-purple-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Navegação Mobile */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 py-2 px-4 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col space-y-3">
            <a
              href="#features"
              className="text-gray-700 hover:text-purple-600 transition-colors py-2"
            >
              Recursos
            </a>
            <a
              href="#benefits"
              className="text-gray-700 hover:text-purple-600 transition-colors py-2"
            >
              Benefícios
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 transition-colors py-2"
            >
              Preços
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 transition-colors py-2"
            >
              Suporte
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}