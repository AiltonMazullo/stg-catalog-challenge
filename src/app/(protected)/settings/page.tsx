"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { updateUserProfile } from "@/services/user.api";
import { supabase } from "@/models/supabase";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Shield,
  Eye,
  EyeOff,
  ShoppingBag,
  Facebook,
  Chrome,
  Edit2,
  Check,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const { user, signOut, refreshSession } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const router = useRouter();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(getUserName(user));
      setEditedEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await refreshSession();
      } catch (error) {
        console.error("Erro ao atualizar sessão:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshSession]);

  const getUserName = (user: any) => {
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

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres!");
      return;
    }
    toast.success("Senha alterada com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(getUserName(user));
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setEditedEmail(user?.email || "");
  };

  const handleSaveName = async () => {
    if (!user || !editedName.trim()) return;

    setIsUpdating(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: editedName.trim() },
      });

      if (authError) {
        console.error("Erro ao atualizar nome no Auth:", authError);
        toast.error("Erro ao atualizar nome: " + authError.message);
        setIsEditingName(false);
        return;
      }

      console.log(
        "Nome atualizado com sucesso no Supabase Auth:",
        editedName.trim()
      );
      toast.success("Nome atualizado com sucesso!");
      setIsEditingName(false);
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      toast.error("Erro inesperado ao atualizar nome.");
      setIsEditingName(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!user || !editedEmail.trim()) {
      console.log(
        "Validação falhou - user:",
        user,
        "editedEmail:",
        editedEmail
      );
      return;
    }

    console.log("Iniciando atualização de email:", {
      userId: user.id,
      emailAtual: user.email,
      novoEmail: editedEmail.trim(),
    });

    setIsUpdating(true);
    try {
      // Atualizar email apenas no Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        email: editedEmail.trim(),
      });

      if (authError) {
        console.error("Erro ao atualizar email no Auth:", authError);
        toast.error("Erro ao atualizar email: " + authError.message);
        setEditedEmail(user.email || "");
        setIsEditingEmail(false);
        return;
      }

      console.log(
        "Solicitação de alteração de email enviada:",
        editedEmail.trim()
      );

      // Iniciar polling para verificar mudanças de email
      const targetEmail = editedEmail.trim();
      let attempts = 0;
      const maxAttempts = 60; // 5 minutos (5 segundos * 60)

      const checkEmailUpdate = async () => {
        attempts++;
        console.log(`Verificando atualização de email - tentativa ${attempts}`);

        try {
          await refreshSession();

          // Verificar se o email foi atualizado
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user?.email === targetEmail) {
            console.log("Email atualizado com sucesso!");
            toast.success("Email atualizado com sucesso!");
            setEditedEmail(targetEmail);
            setIsEditingEmail(false);
            return;
          }

          if (attempts < maxAttempts) {
            setTimeout(checkEmailUpdate, 5000); 
          } else {
            console.log("Timeout na verificação de email");
            toast.error(
              "A confirmação está demorando mais que o esperado. Verifique seu email."
            );
          }
        } catch (error) {
          console.error("Erro ao verificar atualização de email:", error);
          if (attempts < maxAttempts) {
            setTimeout(checkEmailUpdate, 5000);
          }
        }
      };

      toast.success(
        "Solicitação enviada! Verifique seu email para confirmar a alteração. Aguardando confirmação..."
      );
      
      setTimeout(checkEmailUpdate, 10000);

      setEditedEmail(user.email || "");
      setIsEditingEmail(false);
    } catch (error) {
      console.error("Erro catch ao atualizar email:", {
        error,
        message: error instanceof Error ? error.message : "Erro desconhecido",
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast.error("Erro inesperado ao atualizar email.");
      setEditedEmail(user.email || "");
      setIsEditingEmail(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = (field: "name" | "email") => {
    if (field === "name") {
      setIsEditingName(false);
      setEditedName(getUserName(user));
    } else {
      setIsEditingEmail(false);
      setEditedEmail(user?.email || "");
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <header
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } shadow-sm py-4 px-4 sticky top-0 z-10`}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={() => router.back()}
            className={`mr-3 p-2 rounded-lg ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
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
                Configurações
              </h1>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Gerencie sua conta
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-20 pt-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 1. Informações Pessoais */}
          <section
            className={`rounded-lg shadow-sm p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <User className="h-5 w-5" />
              Informações Pessoais
            </h2>

            <div className="space-y-4">
              {/* Nome Completo */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nome Completo
                </label>
                <div className="relative">
                  {isEditingName ? (
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className={`w-full sm:flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          isDarkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                        disabled={isUpdating}
                      />
                      <div className="flex items-center gap-2 justify-end sm:justify-start">
                        <button
                          aria-label="Salvar nome"
                          onClick={handleSaveName}
                          disabled={isUpdating}
                          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                            isDarkMode
                              ? "text-green-400 hover:bg-gray-700"
                              : "text-green-600 hover:bg-green-50"
                          } disabled:opacity-50`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Cancelar edição do nome"
                          onClick={() => handleCancelEdit("name")}
                          disabled={isUpdating}
                          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                            isDarkMode
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-red-50"
                          } disabled:opacity-50`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={getUserName(user)}
                        readOnly
                        className={`flex-1 px-3 py-2 rounded-lg border cursor-not-allowed ${
                          isDarkMode
                            ? "bg-gray-600 text-gray-300 border-gray-500"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}
                      />
                      <button
                        aria-label="Editar nome"
                        onClick={handleEditName}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <div
                  className={`mb-2 p-2 rounded-lg text-xs ${
                    isDarkMode
                      ? "bg-blue-900/20 text-blue-300 border border-blue-800"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  💡 <strong>Importante:</strong> Alterações de email requerem
                  confirmação por segurança. Você receberá um email para
                  confirmar a mudança. Após clicar no link do email, Realize login novamente já com o novo email.
                </div>
                <div className="relative">
                  {isEditingEmail ? (
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                      <input
                        type="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className={`w-full sm:flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          isDarkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                        disabled={isUpdating}
                      />
                      <div className="flex items-center gap-2 justify-end sm:justify-start">
                        <button
                          aria-label="Salvar email"
                          onClick={handleSaveEmail}
                          disabled={isUpdating}
                          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                            isDarkMode
                              ? "text-green-400 hover:bg-gray-700"
                              : "text-green-600 hover:bg-green-50"
                          } disabled:opacity-50`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Cancelar edição do email"
                          onClick={() => handleCancelEdit("email")}
                          disabled={isUpdating}
                          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                            isDarkMode
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-red-50"
                          } disabled:opacity-50`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className={`flex-1 px-3 py-2 rounded-lg border cursor-not-allowed ${
                          isDarkMode
                            ? "bg-gray-600 text-gray-300 border-gray-500"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}
                      />
                      <button
                        aria-label="Editar email"
                        onClick={handleEditEmail}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Preferências da Conta */}
          <section
            className={`rounded-lg shadow-sm p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <Globe className="h-5 w-5" />
              Preferências da Conta
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Modo escuro
                  </label>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Ativar tema escuro
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* 3. Segurança e Login */}
          <section
            className={`rounded-lg shadow-sm p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <Shield className="h-5 w-5" />
              Segurança e Login
            </h2>

            <div className="space-y-4">
              {/* Alterar Senha */}
              <div>
                <h3
                  className={`text-sm font-medium mb-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Alterar Senha
                </h3>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Senha atual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className={`absolute right-3 top-2.5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3 top-2.5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmar senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

                  <Button
                    onClick={handlePasswordChange}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
                  >
                    Atualizar Senha
                  </Button>
                </div>
              </div>


            </div>
          </section>

          <section
            className={`rounded-lg shadow-sm p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              Pedidos
            </h2>

            <div className="space-y-3">
              <Link
                href="/orders"
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Ver Pedidos
                    </span>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Acompanhe o status dos seus pedidos
                    </p>
                  </div>
                </div>
                <ArrowLeft
                  className={`h-4 w-4 rotate-180 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
