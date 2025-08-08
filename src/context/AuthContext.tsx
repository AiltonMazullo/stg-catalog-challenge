"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/models/supabase";
import { User, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificando se há uma sessão ativa
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("User metadata:", session.user.user_metadata);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          fullName:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            "",
        });
      }
      setIsLoading(false);
    };

    getSession();

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event, session?.user?.email);

      if (session?.user) {
        console.log("User metadata:", session.user.user_metadata);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          fullName:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            "",
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função para forçar atualização da sessão
  const refreshSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        fullName:
          session.user.user_metadata?.name ||
          session.user.user_metadata?.full_name ||
          "",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Traduzir mensagem específica de validação de senha do Supabase
      if (
        error.message.includes(
          "Password should contain at least one character of each"
        )
      ) {
        throw new Error(
          "A senha deve conter pelo menos:\n• Uma letra minúscula (a-z)\n• Uma letra maiúscula (A-Z)\n• Um número (0-9)\n• Um caractere especial (!@#$%^&*()_+-=[]{};':|\"|<>?,./`~)"
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
