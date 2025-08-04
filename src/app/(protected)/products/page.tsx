'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchProducts } from '@/supabase/products.api';
import { useCart } from '@/context/CartContext';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const { addToCart, getTotalItems } = useCart();

  // Produtos de exemplo para demonstração
  const sampleProducts = [
    { id: '1', name: 'Smartphone Pro Max', price: 1299.99, image: '' },
    { id: '2', name: 'Notebook Gamer Ultra', price: 2499.99, image: '' },
    { id: '3', name: 'Tablet Design Pro', price: 899.99, image: '' },
    { id: '4', name: 'Smartwatch Fitness', price: 399.99, image: '' }
  ];

  const handleAddToCart = (product: { id: string; name: string; price: number; image?: string }) => {
    addToCart(product);
  };

  useEffect(() => {
    fetchProducts().then((products) => {
      console.log(products);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-lg mr-2">
              <span className="text-white font-bold text-sm md:text-lg">STG</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">STG Store</h1>
            <p className="text-xs text-gray-500 ml-2 hidden md:block">Sua loja online</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/cart" className="text-gray-600 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{getTotalItems()}</span>
            </Link>
            <Button className="text-gray-600 hover:text-gray-900 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white shadow-sm py-3 px-4 mb-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Produto 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="relative pt-[100%] bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Smartphone Galaxy Pro</span>
                  </div>
                </div>
              </div>
              <div className="p-3 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">Smartphone Galaxy Pro</h3>
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">R$ 899,99</span>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full sm:w-auto text-xs py-1 px-2 cursor-pointer"
                    onClick={() => handleAddToCart(sampleProducts[0])}
                  >
                    <span className="mr-1">+</span> Adicionar
                  </Button>
                </div>
              </div>
            </div>

            {/* Produto 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="relative pt-[100%] bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Fone Bluetooth Premium</span>
                  </div>
                </div>
              </div>
              <div className="p-3 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">Fone Bluetooth Premium</h3>
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">R$ 199,99</span>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full sm:w-auto text-xs py-1 px-2 cursor-pointer"
                    onClick={() => handleAddToCart(sampleProducts[1])}
                  >
                    <span className="mr-1">+</span> Adicionar
                  </Button>
                </div>
              </div>
            </div>

            {/* Produto 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="relative pt-[100%] bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Tablet Design Pro</span>
                  </div>
                </div>
              </div>
              <div className="p-3 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">Tablet Design Pro</h3>
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">R$ 899,99</span>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full sm:w-auto text-xs py-1 px-2 cursor-pointer"
                    onClick={() => handleAddToCart(sampleProducts[2])}
                  >
                    <span className="mr-1">+</span> Adicionar
                  </Button>
                </div>
              </div>
            </div>

            {/* Produto 4 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="relative pt-[100%] bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Notebook UltraBook</span>
                  </div>
                </div>
              </div>
              <div className="p-3 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">Notebook UltraBook</h3>
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">R$ 1.299,99</span>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full sm:w-auto text-xs py-1 px-2 cursor-pointer"
                    onClick={() => handleAddToCart(sampleProducts[3])}
                  >
                    <span className="mr-1">+</span> Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-10 md:hidden">
        <Link href="/" className="flex flex-col items-center text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/cart" className="flex flex-col items-center text-gray-500">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{getTotalItems()}</span>
          </div>
          <span className="text-xs mt-1">Carrinho</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </div>
  );
}