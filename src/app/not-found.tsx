"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavoriteList } from "@/context/FavoriteList";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Home,
  ShoppingCart,
  User,
  ArrowLeft,
  AlertCircle,
  Heart,
} from "lucide-react";

export default function NotFoundPage() {
  const { getTotalItems } = useCart();
  const { getTotalItems: getFavoriteListTotalItems } = useFavoriteList();
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
      setShowProfileModal(false);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getUserName = (user: any) => {
    if (user?.fullName && user.fullName.trim() !== "") {
      return user.fullName;
    }

    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }

    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Usuário";
  };

  const closeModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <header
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } shadow-sm py-4 px-4 sticky top-0 z-10`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-lg mr-3">
              <span className="text-white font-bold text-sm md:text-lg">
                STG
              </span>
            </div>
            <div className="flex flex-col">
              <h1
                className={`text-lg md:text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                STG Store
              </h1>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Sua loja online
              </p>
            </div>
          </div>

          {/* Header buttons - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileModal(!showProfileModal)}
                  className="p-2"
                  aria-label="Abrir perfil"
                >
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Modal de Perfil Desktop */}
                {showProfileModal && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={closeModal}
                    ></div>
                    <div
                      className={`absolute top-full right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 p-4 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div
                        className={`text-sm mb-3 ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        <strong>Olá, {getUserName(user)}</strong>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={toggleDarkMode}
                          className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${
                            isDarkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>Modo {isDarkMode ? "Claro" : "Escuro"}</span>
                          <div
                            className={`w-10 h-5 rounded-full ${
                              isDarkMode ? "bg-green-500" : "bg-gray-300"
                            } relative transition-colors`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                                isDarkMode ? "translate-x-5" : "translate-x-0.5"
                              }`}
                            ></div>
                          </div>
                        </button>

                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-3 py-2 text-sm text-red-600 rounded cursor-pointer ${
                            isDarkMode
                              ? "hover:bg-red-900/20"
                              : "hover:bg-red-50"
                          }`}
                        >
                          Fazer Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-6 md:mb-8">
            <div
              className={`mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <AlertCircle
                className={`w-10 h-10 md:w-12 md:h-12 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Error Code */}
          <h1
            className={`text-6xl md:text-8xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            404
          </h1>

          {/* Title */}
          <h2
            className={`text-xl md:text-2xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Página não encontrada
          </h2>

          {/* Description */}
          <p
            className={`text-sm md:text-base mb-8 md:mb-12 max-w-md mx-auto ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            A página que você está procurando não existe ou foi movida.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className={`w-full sm:w-auto px-6 py-3 text-sm md:text-base ${
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <Link href="/products" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full px-6 py-3 text-sm md:text-base bg-green-500 hover:bg-green-600 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-200"
        } border-t py-2 px-4 flex justify-around items-center z-10 md:hidden`}
      >
        <Link
          href="/products"
          className="flex flex-col items-center text-green-500"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/favorite"
          className="flex flex-col items-center text-gray-500"
        >
          <div className="relative">
            <Heart className="h-6 w-6" />
            {getFavoriteListTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getFavoriteListTotalItems()}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Desejos</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center text-gray-500">
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Carrinho</span>
        </Link>

        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="flex flex-col items-center text-gray-500"
              aria-label="Abrir perfil"
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Perfil</span>
            </button>

            {/* Modal de Perfil Mobile */}
            {showProfileModal && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeModal}></div>
                <div
                  className={`absolute bottom-full right-0 mb-2 w-80 max-w-[95vw] rounded-lg shadow-lg border z-50 p-4 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`text-sm mb-3 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <strong>Olá, {getUserName(user)}</strong>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={toggleDarkMode}
                      className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>Modo {isDarkMode ? "Claro" : "Escuro"}</span>
                      <div
                        className={`w-10 h-5 rounded-full ${
                          isDarkMode ? "bg-green-500" : "bg-gray-300"
                        } relative transition-colors`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                            isDarkMode ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        ></div>
                      </div>
                    </button>

                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-3 py-2 text-sm text-red-600 rounded cursor-pointer ${
                        isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"
                      }`}
                    >
                      Fazer Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
