"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/models/supabase";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao verificar sessão:", error);
          setError("Sessão inválida ou expirada");
          setIsValidSession(false);
        } else if (session) {
          setIsValidSession(true);
        } else {
          setError("Link de recuperação inválido ou expirado");
          setIsValidSession(false);
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
        setError("Erro ao verificar sessão");
        setIsValidSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success("Senha redefinida com sucesso!");
      router.push("/login");
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);

      let errorMessage = "Erro ao redefinir senha";

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
      toast.error("Erro ao redefinir senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-white" : "text-gray-900"}>
            Verificando link de recuperação...
          </p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-red-500 p-3 rounded-lg mb-4">
              <span className="text-white font-bold text-xl">⚠️</span>
            </div>
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Link Inválido
            </h1>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mt-1 text-center`}
            >
              O link de recuperação é inválido ou expirou
            </p>
          </div>

          <Card>
            <Card.Body>
              <div className="text-center space-y-4">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {error}
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Solicite um novo link de recuperação de senha.
                </p>

                <div className="space-y-2">
                  <Link href="/forgot-password">
                    <Button fullWidth>Solicitar Novo Link</Button>
                  </Link>
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
            Redefinir Senha
          </h1>
          <p
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } mt-1 text-center`}
          >
            Digite sua nova senha
          </p>
        </div>

        <Card>
          <Card.Body>
            <h2
              className={`text-xl font-bold text-center mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Nova Senha
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } text-center mb-6`}
            >
              Escolha uma senha segura para sua conta
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
                  htmlFor="password"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Nova Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-2.5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-2.5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                {isLoading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } hover:text-green-600 flex items-center justify-center gap-2`}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Login
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
