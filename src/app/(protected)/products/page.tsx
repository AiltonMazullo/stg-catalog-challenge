'use client';

import React from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-lg mr-3">
              <span className="text-white font-bold text-lg">STG</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">STG Store</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Sair
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Catálogo de Produtos</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Produtos de exemplo */}
          {[1, 2, 3, 4, 5, 6, 8].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-500">Imagem do Produto {item}</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Produto {item}</h3>
                <p className="text-gray-600 text-sm mb-3">Descrição breve do produto {item}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">R$ {(item * 10).toFixed(2)}</span>
                  <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-600">
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}