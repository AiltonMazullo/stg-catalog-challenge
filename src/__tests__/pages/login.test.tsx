import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "",
}));

// Mock Supabase
jest.mock("@/models/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest
        .fn()
        .mockResolvedValue({ data: { user: null }, error: null }),
      getSession: jest
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

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
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: () => ({
    isDarkMode: false,
    toggleTheme: jest.fn(),
  }),
}));

// Mock toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Importando após os mocks
import LoginPage from "@/app/(auth)/login/page";

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Deve renderizar o botão de formulário de login", () => {
    render(<LoginPage />);
    const button = screen.getByRole("button", { name: /entrar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  test("deve ter campos de entrada", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Digite seu email");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("deve permitir digitar nos campos", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Digite seu email");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("deve ter senha como tipo password por padrão", () => {
    render(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("deve renderizar links de navegação", () => {
    render(<LoginPage />);

    expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
    expect(screen.getByText("Esqueceu sua senha?")).toBeInTheDocument();
  });
});
