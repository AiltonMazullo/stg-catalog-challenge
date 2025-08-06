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
  ArrowLeft,
  Home,
  ShoppingCart,
  User,
  Heart,
  Trash2,
  ShoppingBag,
} from "lucide-react";

export default function FavoriteListPage() {
  const { items, removeFromFavoriteList, clearFavoriteList, getTotalItems } =
    useFavoriteList();
  const { addToCart, getTotalItems: getCartTotalItems } = useCart();
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

  const closeModal = () => {
    setShowProfileModal(false);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    removeFromFavoriteList(product.id);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <header
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-sm py-4 px-4 sticky top-0 z-10`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/products"
              className="mr-4"
              aria-label="Voltar para produtos"
            >
              <ArrowLeft
                className={`h-6 w-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </Link>
            <h1
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Lista de Desejos
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileModal(!showProfileModal)}
                className="p-2 cursor-pointer"
                aria-label="Abrir perfil"
              >
                <User
                  className={`h-6 w-6 cursor-pointer ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>

              {/* Modal de Perfil */}
              {showProfileModal && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={closeModal}
                  ></div>
                  <div
                    className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } border ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <User
                            className={`h-5 w-5 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {getUserName(user)}
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Usuário
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link
                          href="/settings"
                          className={`flex items-center space-x-2 w-full p-2 rounded-md text-left transition-colors ${
                            isDarkMode
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                          onClick={closeModal}
                        >
                          <span className="text-sm">Configurações</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center space-x-2 w-full p-2 rounded-md text-left transition-colors cursor-pointer ${
                            isDarkMode
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="text-sm">Sair</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20 md:pb-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <Heart
                className={`h-12 w-12 ${
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
            </div>
            <h2
              className={`text-xl font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Sua lista de desejos está vazia
            </h2>
            <p
              className={`mb-8 leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Adicione produtos à sua lista de desejos para salvá-los para mais
              tarde
            </p>
            <Link href="/products">
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="py-3 text-base font-medium"
              >
                Explorar Produtos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"} na
                lista
              </h2>
              {items.length > 0 && (
                <button
                  onClick={clearFavoriteList}
                  className={`text-sm cursor-pointer ${
                    isDarkMode
                      ? "text-gray-400 hover:text-red-400"
                      : "text-gray-500 hover:text-red-500"
                  } transition-colors`}
                >
                  Limpar lista
                </button>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg shadow-sm p-3 sm:p-4 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {/* Mobile */}
                  <div className="flex items-start space-x-3 sm:hidden">
                    <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          } flex items-center justify-center`}
                        >
                          <span
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-500"
                            } text-xs text-center px-1`}
                          >
                            {item.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium text-sm mb-1 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </h3>
                      {item.description && (
                        <p
                          className={`text-xs mb-2 line-clamp-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold text-sm ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatPrice(item.price)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                            aria-label="Mover para carrinho"
                          >
                            <ShoppingBag className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromFavoriteList(item.id)}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isDarkMode
                                ? "text-gray-400 hover:text-red-400"
                                : "text-gray-500 hover:text-red-500"
                            }`}
                            aria-label="Remover da lista de desejos"
                          >
                            <Trash2 className="w-4 h-4 cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          } flex items-center justify-center`}
                        >
                          <span
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-500"
                            } text-xs text-center px-1`}
                          >
                            {item.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium mb-1 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </h3>
                      {item.description && (
                        <p
                          className={`text-sm mb-2 line-clamp-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      )}
                      {item.category && (
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Categoria: {item.category}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold mb-3 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatPrice(item.price)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1 cursor-pointer"
                          aria-label="Mover para carrinho"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Mover para carrinho</span>
                        </button>
                        <button
                          onClick={() => removeFromFavoriteList(item.id)}
                          className={`p-2 rounded transition-colors cursor-pointer ${
                            isDarkMode
                              ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                              : "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                          }`}
                          aria-label="Remover da lista de desejos"
                        >
                          <Trash2 className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 sm:space-y-4">
              <Link href="/products">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  className="py-3 text-sm sm:text-base bg-gray-800 text-gray-900 border-gray-800 hover:border-gray-900"
                >
                  Continuar Explorando
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div
        className={`border-t py-2 px-4 flex justify-around items-center z-10 md:hidden ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-200"
        }`}
      >
        <Link
          href="/products"
          className={`flex flex-col items-center ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
          aria-label="Ir para produtos"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <div className="flex flex-col items-center text-red-500">
          <div className="relative">
            <Heart className="h-6 w-6 fill-current" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Desejos</span>
        </div>

        <Link
          href="/cart"
          className={`flex flex-col items-center ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {getCartTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getCartTotalItems()}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Carrinho</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowProfileModal(!showProfileModal)}
            className={`flex flex-col items-center cursor-pointer ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
            aria-label="Abrir perfil"
          >
            <User className="h-6 w-6 cursor-pointer" />
            <span className="text-xs mt-1">Perfil</span>
          </button>

          {/* Modal de Perfil Mobile */}
          {showProfileModal && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeModal}></div>
              <div
                className={`absolute bottom-full right-0 mb-2 w-64 rounded-lg shadow-lg z-50 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <User
                        className={`h-5 w-5 cursor-pointer ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                          {getUserName(user)}
                        </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Usuário
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/settings"
                      className={`flex items-center space-x-2 w-full p-2 rounded-md text-left transition-colors ${
                        isDarkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={closeModal}
                    >
                      <span className="text-sm">Configurações</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center space-x-2 w-full p-2 rounded-md text-left transition-colors cursor-pointer ${
                        isDarkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="text-sm">Sair</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
