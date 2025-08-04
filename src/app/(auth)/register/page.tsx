'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação básica
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de registro
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você implementaria a lógica real de registro
      
      // Redirecionar para a página de login após o cadastro
      router.push('/login');
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
          <p className="text-gray-600 mt-1">Crie sua conta para continuar</p>
        </div>

        <Card>
          <Card.Body>
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Criar Conta</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Preencha os campos abaixo para se registrar
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

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
                  placeholder="Crie uma senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Cadastrar
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta? <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">Entrar</Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Demo - Qualquer informação é aceita para registro
          </p>
        </div>
      </div>
    </div>
  );
}