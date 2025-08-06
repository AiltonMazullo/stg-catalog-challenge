"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingBag,
  Calendar,
  Package,
} from "lucide-react";



export default function OrdersPage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { orders } = useOrders();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 border-b px-4 py-3 sm:py-4 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1
            className={`text-lg sm:text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Meus Pedidos
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Carregando pedidos...
              </p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <ShoppingBag
              className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h2
              className={`text-lg sm:text-xl font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Nenhum pedido encontrado
            </h2>
            <p
              className={`text-sm sm:text-base mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Você ainda não fez nenhum pedido.
            </p>
            <Link href="/products">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition-colors cursor-pointer">
                Começar a Comprar
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`rounded-lg border p-4 sm:p-6 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-sm sm:text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Pedido #{order.id}
                        </h3>
                        <div className="flex items-center text-xs sm:text-sm">
                          <span
                            className={`flex items-center gap-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            {formatDate(order.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
                      <p
                        className={`text-base sm:text-lg font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatPrice(order.total)}
                      </p>
                      <p
                        className={`text-xs sm:text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                      </p>
                    </div>
                  </div>

                {/* Order Items */}
                <div className="space-y-2 sm:space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-3 px-3 sm:px-4 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex-1">
                        <p
                          className={`text-sm sm:text-base font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Qtd: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex justify-between sm:block sm:text-right">
                        <span className={`text-xs sm:hidden ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>Total:</span>
                        <p
                          className={`text-sm sm:text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}