"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { isDarkMode } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validação básica
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, fullName);
      setSuccess("Conta criada com sucesso!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      let errorMessage = "Erro ao criar conta";

      if (err instanceof Error) {
        // Traduzir mensagem específica de validação de senha do Supabase
        if (
          err.message.includes(
            "Password should contain at least one character of each"
          )
        ) {
          errorMessage =
            "A senha deve conter pelo menos:\n• Uma letra minúscula (a-z)\n• Uma letra maiúscula (A-Z)\n• Um número (0-9)\n• Um caractere especial (!@#$%^&*()_+-=[]{};':|\"|<>?,./`~)";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-500 p-3 rounded-lg mb-4">
            <span className="text-white font-bold text-xl">STG</span>
          </div>
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            STG Catalog
          </h1>
          <p
            className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1`}
          >
            Cadastre-se para começar
          </p>
        </div>

        <Card>
          <Card.Body>
            <h2
              className={`text-xl font-bold text-center mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Criar Conta
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } text-center mb-6`}
            >
              Preencha os campos abaixo para se registrar
            </p>

            {error && (
              <div
                className={`mb-4 p-3 ${
                  isDarkMode
                    ? "bg-red-900/20 border-red-800 text-red-400"
                    : "bg-red-100 border-red-200 text-red-700"
                } border rounded-md`}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className={`mb-4 p-3 ${
                  isDarkMode
                    ? "bg-green-900/20 border-green-800 text-green-400"
                    : "bg-green-100 border-green-200 text-green-700"
                } border rounded-md`}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Nome Completo
                </label>
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
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Email
                </label>
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
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Senha
                </label>
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
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Confirmar Senha
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        <div className="mt-8 text-center"></div>
      </div>
    </div>
  );
}
