"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/models/supabase";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Enviar link de redefinição de senha por email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message || "Erro ao enviar email de recuperação");
      }

      setIsEmailSent(true);
      toast.success("Link de redefinição enviado para seu email com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar senha:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao enviar senha por email"
      );
      toast.error("Erro ao enviar senha por email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
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
              Email Enviado!
            </h1>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mt-1 text-center`}
            >
              Verifique sua caixa de entrada
            </p>
          </div>

          <Card>
            <Card.Body>
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">📧</div>
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Verifique seu email
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Enviamos um link de redefinição para{" "}
                  <span className="font-semibold">{email}</span>
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Não esqueça de verificar sua pasta de spam se não encontrar o
                  email.
                </p>

                <div className="pt-4">
                  <Link href="/login">
                    <Button variant="outline" fullWidth>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar ao Login
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

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
            Esqueceu sua senha?
          </h1>
          <p
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } mt-1 text-center`}
          >
            Digite seu email para receber um link de redefinição
          </p>
        </div>

        <Card>
          <Card.Body>
            <h2
              className={`text-xl font-bold text-center mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Recuperar Senha
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } text-center mb-6`}
            >
              Enviaremos um link para redefinir sua senha
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

              <Button type="submit" fullWidth isLoading={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link
                href="/login"
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } hover:text-green-600 flex items-center justify-center gap-2`}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Login
              </Link>
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
