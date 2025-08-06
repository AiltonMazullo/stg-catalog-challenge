"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavoriteList } from "@/context/FavoriteList";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useOrders } from "@/context/OrderContext";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

import {
  ArrowLeft,
  Home,
  ShoppingCart,
  User,
  Minus,
  Plus,
  Trash2,
  Heart,
  Settings,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();
  const { getTotalItems: getFavoriteListTotalItems } = useFavoriteList();
  const { signOut, user } = useAuth();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);
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
    console.log("User object:", user);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleFinalizePedido = () => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    const userName = getUserName(user);
    const userEmail = user?.email || "Não informado";
    
    // Preparar dados do pedido 
    const orderItems = items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    
    const pendingOrder = {
      items: orderItems,
      total: getTotalPrice(),
      customerName: userName,
      customerEmail: userEmail
    };
    
    let message = `*NOVO PEDIDO - STG CATALOG*\n\n`;
    message += `*Cliente:* ${userName}\n`;
    message += `*Email:* ${userEmail}\n\n`;
    message += `*PRODUTOS:*\n`;
    
    items.forEach(item => {
      message += `- ${item.name} - Qtd: ${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\n*TOTAL: ${formatPrice(getTotalPrice())}*\n\n`;
    message += `---\nPedido realizado via STG Catalog`;
    
    const encodedMessage = encodeURIComponent(message);
    
    // Número do WhatsApp (substitua pelo número que vai receber o Pedido.)
    const whatsappNumber = 5581992392899; // Formato: código do país + DDD + número 
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Preparar dados para confirmação
    setPendingOrderData(pendingOrder);
    
    // Detectar quando usuário volta para a aba e mostrar modal de confirmação
    const handleFocus = () => {
      // Aguardar um pouco para garantir que o usuário teve tempo de enviar
      setTimeout(() => {
        setShowConfirmationModal(true);
        
        // Remover o listener após usar
        window.removeEventListener('focus', handleFocus);
      }, 500);
    };
    
    // Adicionar listener para detectar quando volta do WhatsApp
    setTimeout(() => {
      window.addEventListener('focus', handleFocus);
      
      // Remover listener automaticamente após 2 minutos (fallback)
      setTimeout(() => {
        window.removeEventListener('focus', handleFocus);
      }, 120000);
    }, 1000);
    
    toast.success("📱 WhatsApp aberto! Envie a mensagem e volte para confirmar.");
  };

  const handleConfirmSent = () => {
    if (pendingOrderData) {
      // Salvar pedido no histórico
      addOrder(pendingOrderData);
      
      // Limpar carrinho
      items.forEach(item => {
        removeFromCart(item.id);
      });
      
      toast.success("✅ Pedido registrado no histórico! Carrinho limpo.");
    }
    
    setShowConfirmationModal(false);
    setPendingOrderData(null);
  };

  const handleConfirmCancel = () => {
    toast.error("❌ Pedido não foi registrado. Tente novamente quando enviar a mensagem.");
    setShowConfirmationModal(false);
    setPendingOrderData(null);
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
              Carrinho de Compras
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
                  className={`h-6 w-6 ${
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
                      <Link
                        href="/settings"
                        onClick={() => setShowProfileModal(false)}
                        className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                      </Link>

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
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-sm mx-auto">
            <div className="mb-6">
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <ShoppingCart
                  className={`h-10 w-10 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
            <h2
              className={`text-xl font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Seu carrinho está vazio
            </h2>
            <p
              className={`mb-8 leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Adicione produtos ao seu carrinho para continuar com a compra
            </p>
            <Link href="/products">
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="py-3 text-base font-medium"
              >
                Voltar às compras
              </Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-3 sm:space-y-4 mb-6">
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
                          className={`w-full h-full flex items-center justify-center ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <span
                            className={`text-xs text-center ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {item.name.split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-sm mb-1 truncate ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <p className="text-green-600 font-bold text-sm mb-3">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              isDarkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300"
                            }`}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span
                            className={`w-12 text-center font-bold text-lg ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              isDarkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300"
                            }`}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors cursor-pointer"
                          aria-label="Remover item do carrinho"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop*/}
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
                          className={`w-full h-full flex items-center justify-center ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <span
                            className={`text-xs text-center ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {item.name.split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-sm ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <p className="text-green-600 font-bold text-sm">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        className={`w-12 text-center font-bold text-lg ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors cursor-pointer"
                      aria-label="Remover item do carrinho"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`rounded-lg shadow-sm p-4 mb-4 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span
                  className={`text-sm sm:text-base ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total de itens:
                </span>
                <span
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getTotalItems()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Total:
                </span>
                <span className="text-green-600 font-bold text-xl sm:text-2xl">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="py-4 text-base sm:text-lg font-semibold cursor-pointer"
                onClick={handleFinalizePedido}
              >
                Finalizar Pedido
              </Button>
              <Link href="/products">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  className="py-3 text-sm sm:text-base bg-gray-800 text-gray-900 border-gray-800 hover:border-gray-900"
                >
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Mobile  */}
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

        <Link
          href="/favorite"
          className={`flex flex-col items-center ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
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

        <div className="flex flex-col items-center text-green-500">
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {getTotalItems()}
            </span>
          </div>
          <span className="text-xs mt-1">Carrinho</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileModal(!showProfileModal)}
            className={`flex flex-col items-center cursor-pointer ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
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
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileModal(false)}
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>

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
      </div>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmSent}
        onCancel={handleConfirmCancel}
        title="Confirmar Envio"
        message="Você enviou a mensagem no WhatsApp?"
        confirmText="Sim, enviei"
        cancelText="Não enviei"
      />
    </div>
  );
}
