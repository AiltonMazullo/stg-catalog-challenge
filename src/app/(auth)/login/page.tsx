'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você implementaria a lógica real de autenticação
      
      // Redirecionar para a página de produtos após o login
      router.push('/products');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-500 p-3 rounded-lg mb-4">
            <span className="text-white font-bold text-xl">STG</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">STG Store</h1>
          <p className="text-gray-600 mt-1">Faça login para continuar</p>
        </div>

        <Card>
          <Card.Body>
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Entrar</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Digite suas credenciais para acessar sua conta
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta? <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">Criar conta</Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Demo - Use qualquer email e senha para entrar
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Exemplo: demo@stg.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}