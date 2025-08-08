import { render, screen } from "@testing-library/react";
import React from "react";
import RegisterPage from "@/app/(auth)/register/page";

// Mock contexts
jest.mock("@/context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: () => ({
    user: null,
    isLoading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  }),
}));

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    isDarkMode: false,
    toggleTheme: jest.fn(),
  }),
}));

test("Deve renderizar todos os campos e botão", () => {
  render(<RegisterPage />);

  const inputName = screen.getByPlaceholderText("Seu nome completo");
  const inputEmail = screen.getByPlaceholderText("seu@email.com");
  const inputPassword = screen.getByPlaceholderText("Crie uma senha");
  const inputConfirmPassword = screen.getByPlaceholderText("Confirme sua senha");
  const button = screen.getByRole("button", { name: "Criar Conta" });

  expect(inputName).toBeInTheDocument();
  expect(inputEmail).toBeInTheDocument();
  expect(inputPassword).toBeInTheDocument();
  expect(inputConfirmPassword).toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(button).not.toBeDisabled();
});
