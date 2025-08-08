import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { supabase } from '@/models/supabase';
import { User } from '@/types';

// Mock do Supabase já está configurado no jest.setup.js
jest.mock('@/models/supabase');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Componente de teste para usar o hook useAuth
const TestComponent = () => {
  const { user, isLoading, signIn, signUp, signOut, refreshSession } = useAuth();
  
  const handleSignIn = async () => {
    try {
      await signIn('test@email.com', 'password');
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp('test@email.com', 'password', 'Test User');
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('SignOut error:', error);
      throw error;
    }
  };
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <button onClick={handleSignIn} data-testid="signin-btn">
        Sign In
      </button>
      <button onClick={handleSignUp} data-testid="signup-btn">
        Sign Up
      </button>
      <button onClick={handleSignOut} data-testid="signout-btn">
        Sign Out
      </button>
      <button onClick={refreshSession} data-testid="refresh-btn">
        Refresh
      </button>
    </div>
  );
};

// Componente para testar erro do hook fora do provider
const TestComponentWithoutProvider = () => {
  const auth = useAuth();
  return <div>{auth.user?.email}</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console para evitar logs nos testes
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AuthProvider', () => {
    it('deve renderizar children corretamente', () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      // Act
      render(
        <AuthProvider>
          <div data-testid="child">Test Child</div>
        </AuthProvider>
      );

      // Assert
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('deve inicializar com isLoading true e depois false', async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      // Act
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Assert - Inicialmente loading
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
      
      // Aguardar o loading terminar
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
    });

    it('deve definir usuário quando há sessão ativa', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@email.com',
        user_metadata: {
          full_name: 'Test User'
        }
      };
      
      const mockSession = {
        user: mockUser,
        access_token: 'token'
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      } as any);
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      // Act
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@email.com');
      });
    });

    it('deve limpar usuário quando não há sessão', async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      // Act
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });
  });

  describe('signIn', () => {
    it('deve chamar supabase.auth.signInWithPassword com credenciais corretas', async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: null
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      // Act
      await act(async () => {
        screen.getByTestId('signin-btn').click();
      });

      // Assert
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'password'
      });
    });

    it('deve lançar erro quando signIn falha', async () => {
      // Arrange
      const mockError = { message: 'Invalid credentials' };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      } as any);

      let authContext: any;
      const TestHook = () => {
        authContext = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestHook />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext.isLoading).toBe(false);
      });

      // Act & Assert
      await expect(authContext.signIn('test@email.com', 'password')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('deve chamar supabase.auth.signUp com dados corretos', async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: null
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      // Act
      await act(async () => {
        screen.getByTestId('signup-btn').click();
      });

      // Assert
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'password',
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });
    });

    it('deve lançar erro quando signUp falha', async () => {
      // Arrange
      const mockError = { message: 'Email already exists' };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      } as any);

      let authContext: any;
      const TestHook = () => {
        authContext = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestHook />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext.isLoading).toBe(false);
      });

      // Act & Assert
      await expect(authContext.signUp('test@email.com', 'password', 'Test User')).rejects.toThrow('Email already exists');
    });
  });

  describe('signOut', () => {
    it('deve chamar supabase.auth.signOut', async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      mockSupabase.auth.signOut.mockResolvedValue({
        error: null
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      // Act
      await act(async () => {
        screen.getByTestId('signout-btn').click();
      });

      // Assert
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('deve lançar erro quando signOut falha', async () => {
      // Arrange
      const mockError = { message: 'Sign out failed' };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      mockSupabase.auth.signOut.mockResolvedValue({
        error: mockError
      } as any);

      let authContext: any;
      const TestHook = () => {
        authContext = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestHook />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext.isLoading).toBe(false);
      });

      // Act & Assert
      await expect(authContext.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('refreshSession', () => {
    it('deve atualizar usuário quando há sessão ativa', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'updated@email.com',
        user_metadata: {
          full_name: 'Updated User'
        }
      };
      
      const mockSession = {
        user: mockUser,
        access_token: 'token'
      };

      mockSupabase.auth.getSession
        .mockResolvedValueOnce({
          data: { session: null },
          error: null
        })
        .mockResolvedValueOnce({
          data: { session: mockSession },
          error: null
        } as any);
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      } as any);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      // Act
      await act(async () => {
        screen.getByTestId('refresh-btn').click();
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('updated@email.com');
      });
    });
  });

  describe('useAuth hook', () => {
    it('deve lançar erro quando usado fora do AuthProvider', () => {
      // Arrange & Act & Assert
      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });

  describe('onAuthStateChange', () => {
    it('deve limpar subscription no cleanup', async () => {
      // Arrange
      const mockUnsubscribe = jest.fn();
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } }
      } as any);

      // Act
      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      unmount();

      // Assert
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});