"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário submetido");
    setIsLoading(true);
    setError("");

    try {
      console.log("Chamando signIn...");
      await signIn(email, password);
      console.log("SignIn concluído, redirecionando...");
      router.push("/products");
    } catch (err) {
      console.error("Erro no handleSubmit:", err);
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
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
            Entrar na STG Store
          </h1>
          <p
            className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1`}
          >
            Faça login para continuar
          </p>
        </div>

        <Card>
          <Card.Body>
            <h2
              className={`text-xl font-bold text-center mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Entrar
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } text-center mb-6`}
            >
              Digite suas credenciais para acessar sua conta
            </p>

            {error && (
              <div
                className={`mb-4 p-3 ${
                  isDarkMode
                    ? "bg-red-900/20 border-red-800"
                    : "bg-red-50 border-red-200"
                } border rounded-md`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Digite seu email"
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
                onClick={() => console.log("Botão clicado")}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
