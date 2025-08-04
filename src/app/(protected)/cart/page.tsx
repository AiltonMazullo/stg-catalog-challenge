'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Link href="/products" className="mr-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Carrinho</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-sm mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
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
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-3 sm:p-4">

                   {/* Mobile */}
                   <div className="flex items-start space-x-3 sm:hidden">
                     <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                       <span className="text-xs text-gray-500 text-center">{item.name.split(' ')[0]}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                       <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.name}</h3>
                       <p className="text-green-600 font-bold text-sm mb-3">{formatPrice(item.price)}</p>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                           <button 
                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
                             className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                           >
                             <span className="text-lg font-bold">-</span>
                           </button>
                           <span className="w-12 text-center font-bold text-lg text-gray-900">{item.quantity}</span>
                           <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                             className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                           >
                             <span className="text-lg font-bold">+</span>
                           </button>
                         </div>
                         <button 
                           onClick={() => removeFromCart(item.id)}
                           className="text-red-500 hover:text-red-700 p-2 transition-colors"
                         >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                         </button>
                       </div>
                     </div>
                   </div>
                   
                   {/* Desktop*/ }
                   <div className="hidden sm:flex items-center space-x-4">
                     <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                       <span className="text-xs text-gray-500 text-center">{item.name.split(' ')[0]}</span>
                     </div>
                     <div className="flex-1">
                       <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                       <p className="text-green-600 font-bold text-sm">{formatPrice(item.price)}</p>
                     </div>
                     <div className="flex items-center space-x-3">
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                       >
                         <span className="text-lg font-bold">-</span>
                       </button>
                       <span className="w-12 text-center font-bold text-lg text-gray-900">{item.quantity}</span>
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                       >
                         <span className="text-lg font-bold">+</span>
                       </button>
                     </div>
                     <button 
                       onClick={() => removeFromCart(item.id)}
                       className="text-red-500 hover:text-red-700 p-1 transition-colors"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                       </button>
                     </div>
                   </div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-gray-600 text-sm sm:text-base">Total de itens:</span>
                 <span className="font-bold text-lg text-gray-900">{getTotalItems()}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-lg sm:text-xl font-bold text-gray-900">Total:</span>
                 <span className="text-green-600 font-bold text-xl sm:text-2xl">{formatPrice(getTotalPrice())}</span>
               </div>
             </div>
            
            <div className="space-y-3 sm:space-y-4">
               <Button variant="primary" size="md" fullWidth className="py-4 text-base sm:text-lg font-semibold">
                 Finalizar Pedido
               </Button>
               <Link href="/products">
                 <Button variant="outline" size="md" fullWidth className="py-3 text-sm sm:text-base bg-gray-800 text-gray-900 border-gray-800 hover:border-gray-900">
                   Continuar Comprando
                 </Button>
               </Link>
             </div>
          </div>
        )}
      </main>

      {/* Mobile  */}
      <div className="bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-10 md:hidden">
        <Link href="/products" className="flex flex-col items-center text-gray-500">
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <div className="flex flex-col items-center text-green-500">
          <div className="relative">
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {getTotalItems()}
            </span>
          </div>
          <span className="text-xs mt-1">Carrinho</span>
        </div>
        
        <Link href="/profile" className="flex flex-col items-center text-gray-500">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </div>
  );
}