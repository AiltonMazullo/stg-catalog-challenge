"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/services/products.api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import { Product } from "@/types";
import {
  Home,
  ShoppingCart,
  User,
  Search,
  Filter,
  X,
  Calendar,
  Tag,
  Settings,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopModal, setShowTopModal] = useState(false);
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { addToCart, getTotalItems } = useCart();
  const { signOut, user } = useAuth();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      setShowTopModal(false);
      setShowBottomModal(false);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
  };

  const closeFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setShowFilterModal(false);
  };

  const clearFilter = () => {
    setSelectedCategory("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
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

  const closeModals = () => {
    setShowTopModal(false);
    setShowBottomModal(false);
  };

  const handleAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }) => {
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  useEffect(() => {
    const loadingProducts = async () => {
      setLoading(true);
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);

        const uniqueCategories = [
          ...new Set(productsData.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadingProducts();
  }, []);

  // Filtrar produtos baseado na categoria e termo de busca
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
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
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/cart"
              className={`relative ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getTotalItems()}
              </span>
            </Link>
            <div className="relative">
              <button
                aria-label="Menu do usuário"
                onClick={() => {
                  setShowTopModal(!showTopModal);
                  setShowBottomModal(false);
                }}
                className={`text-sm p-2 rounded-md transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <User className="h-6 w-6" />
              </button>

              {/* Modal Superior */}
              {showTopModal && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={closeModals}
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
                        onClick={() => setShowTopModal(false)}
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
                        aria-label={`Alternar para modo ${
                          isDarkMode ? "claro" : "escuro"
                        }`}
                        onClick={toggleDarkMode}
                        className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>Modo {isDarkMode ? "claro" : "escuro"}</span>
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
                        aria-label="Sair da conta"
                        onClick={handleLogout}
                        className={`w-full text-left px-3 py-2 text-sm text-red-600 rounded ${
                          isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"
                        }`}
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-sm py-3 px-4 mb-4`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "text-gray-800 bg-white"
              }`}
            />
            <div className="absolute left-3 top-2.5">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button
              aria-label="Abrir filtros"
              onClick={openFilterModal}
              className="absolute right-3 top-2.5 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Filter
                className={`h-4 w-4 ${
                  selectedCategory ? "text-green-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>
          {selectedCategory && (
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Filtrado por:
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {selectedCategory}
                <button
                  aria-label="Limpar filtro"
                  onClick={clearFilter}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-lg shadow-sm overflow-hidden flex flex-col`}
                >
                  <div
                    className={`relative pt-[100%] ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
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
                            } text-xs text-center px-2`}
                          >
                            {product.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 flex flex-col">
                    <button
                      aria-label={`Ver detalhes de ${product.name}`}
                      onClick={() => openProductModal(product)}
                      className={`text-sm font-semibold ${
                        isDarkMode
                          ? "text-white hover:text-green-400"
                          : "text-gray-800 hover:text-green-600"
                      } mb-1 line-clamp-2 text-left transition-colors cursor-pointer`}
                    >
                      {product.name}
                    </button>
                    {product.description && (
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } mb-2 line-clamp-2`}
                      >
                        {product.description}
                      </p>
                    )}
                    <div className="mt-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-green-600 font-bold text-sm">
                        {formatPrice(product.price)}
                      </span>
                      <Button
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                        className="w-full sm:w-auto text-xs py-1 px-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors cursor-pointer"
                        onClick={() => handleAddToCart(product)}
                      >
                        <span className="mr-1">+</span> Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-20">
              <p
                className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                {searchTerm || selectedCategory
                  ? "Nenhum produto encontrado com os filtros aplicados"
                  : "Nenhum produto encontrado"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-200"
        } border-t py-2 px-4 flex justify-around items-center z-10 md:hidden`}
      >
        <Link href="/" className="flex flex-col items-center text-green-500">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Início</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center text-gray-500">
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {getTotalItems()}
            </span>
          </div>
          <span className="text-xs mt-1">Carrinho</span>
        </Link>
        <div className="relative">
          <button
            onClick={() => {
              setShowBottomModal(!showBottomModal);
              setShowTopModal(false);
            }}
            className="flex flex-col items-center text-gray-500"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </button>

          {/* Modal Inferior */}
          {showBottomModal && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeModals}></div>
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
                    onClick={() => setShowBottomModal(false)}
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
                    aria-label={`Alternar para modo ${
                      isDarkMode ? "claro" : "escuro"
                    }`}
                    onClick={toggleDarkMode}
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>Modo {isDarkMode ? "claro" : "escuro"}</span>
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
                    aria-label="Sair da conta"
                    onClick={handleLogout}
                    className={`w-full text-left px-3 py-2 text-sm text-red-600 rounded ${
                      isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"
                    }`}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-md w-full rounded-lg shadow-lg max-h-[90vh] overflow-y-auto ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h2
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {selectedProduct.name}
                </h2>
                <button
                  aria-label="Fechar detalhes do produto"
                  onClick={closeProductModal}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedProduct.image_url && (
                <div className="mb-4">
                  <div
                    className={`relative pt-[100%] rounded-lg overflow-hidden ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Data do anúncio: {formatDate(selectedProduct.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Categoria: {selectedProduct.category}
                  </span>
                </div>

                <div>
                  <h3
                    className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Descrição:
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {formatPrice(selectedProduct.price)}
                    </span>
                    <button
                      aria-label={`Adicionar ${selectedProduct.name} ao carrinho`}
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        closeProductModal();
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtro */}
      {showFilterModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-sm w-full rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Filtrar por categoria
                </h2>
                <button
                  aria-label="Fechar filtro"
                  onClick={closeFilterModal}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  aria-label="Mostrar todas as categorias"
                  onClick={() => {
                    clearFilter();
                    closeFilterModal();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : isDarkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Todas as categorias
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    aria-label={`Filtrar por categoria ${category}`}
                    onClick={() => {
                      handleCategoryFilter(category);
                      closeFilterModal();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : isDarkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
