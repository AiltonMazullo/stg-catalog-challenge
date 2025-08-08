import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock do AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Componente de teste para renderizar dentro do ProtectedRoute
const TestComponent = () => (
  <div data-testid="protected-content">Conteúdo Protegido</div>
);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Comportamento de Autenticação', () => {
    it('deve mostrar loading enquanto verifica autenticação', () => {
      // Arrange
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      expect(screen.getByText('Carregando...')).toHaveClass('text-gray-600');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('deve redirecionar para /login quando usuário não está autenticado', async () => {
      // Arrange
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('deve permitir acesso quando usuário está autenticado', async () => {
      // Arrange
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User'
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('não deve redirecionar quando usuário está carregando', () => {
      // Arrange
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
  });

  describe('Proteção de Rotas Privadas', () => {
    it('deve proteger conteúdo sensível de usuários não autenticados', async () => {
      // Arrange
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      const SensitiveComponent = () => (
        <div>
          <div data-testid="user-data">Dados do Usuário</div>
          <div data-testid="private-info">Informações Privadas</div>
        </div>
      );

      // Act
      render(
        <ProtectedRoute>
          <SensitiveComponent />
        </ProtectedRoute>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
      expect(screen.queryByTestId('user-data')).not.toBeInTheDocument();
      expect(screen.queryByTestId('private-info')).not.toBeInTheDocument();
    });

    it('deve permitir acesso a múltiplos componentes filhos quando autenticado', () => {
      // Arrange
      const mockUser = {
        id: '456',
        email: 'user@example.com',
        fullName: 'Authenticated User'
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      render(
        <ProtectedRoute>
          <div data-testid="header">Header</div>
          <div data-testid="main-content">Main Content</div>
          <div data-testid="footer">Footer</div>
        </ProtectedRoute>
      );

      // Assert
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('deve redirecionar imediatamente após logout', async () => {
      // Arrange - Inicialmente autenticado
      const mockUser = {
        id: '789',
        email: 'logout@example.com',
        fullName: 'Logout User'
      };

      const { rerender } = render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      rerender(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Verificar que o conteúdo está visível
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();

      // Act - Simular logout
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      rerender(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Estados de Transição', () => {
    it('deve gerenciar transição de loading para autenticado', async () => {
      // Arrange - Estado inicial de loading
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      const { rerender } = render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Verificar estado de loading
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();

      // Act - Transição para autenticado
      const mockUser = {
        id: '999',
        email: 'transition@example.com',
        fullName: 'Transition User'
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      rerender(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('deve gerenciar transição de loading para não autenticado', async () => {
      // Arrange - Estado inicial de loading
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      const { rerender } = render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Verificar estado de loading
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();

      // Act - Transição para não autenticado
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      rerender(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Renderização Condicional', () => {
    it('deve renderizar loading com spinner e texto corretos', () => {
      // Arrange
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      const loadingText = screen.getByText('Carregando...');
      const loadingContainer = loadingText.closest('.min-h-screen');
      expect(loadingContainer).toHaveClass('min-h-screen');
    expect(loadingContainer).toHaveClass('flex');
    expect(loadingContainer).toHaveClass('items-center');
    expect(loadingContainer).toHaveClass('justify-center');
    expect(loadingContainer).toHaveClass('bg-gray-50');
      expect(loadingText).toHaveClass('text-gray-600');
    });

    it('deve retornar null quando não há usuário e não está carregando', () => {
      // Arrange
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      const { container } = render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it('deve renderizar children como fragmento quando autenticado', () => {
      // Arrange
      const mockUser = {
        id: '111',
        email: 'fragment@example.com',
        fullName: 'Fragment User'
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      });

      // Act
      const { container } = render(
        <ProtectedRoute>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </ProtectedRoute>
      );

      // Assert
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      // Verificar que não há wrapper adicional
      expect(container.firstChild).toHaveAttribute('data-testid', 'child1');
    });
  });
});