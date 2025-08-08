import { fetchUserProfile, updateUserProfile } from '@/services/user.api';
import { supabase } from '@/models/supabase';
import { UserProfile } from '@/types';

// Mock do Supabase já está configurado no jest.setup.js
jest.mock('@/models/supabase');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('user.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUserProfile', () => {
    const mockUserId = 'user-123';
    const mockUserProfile: UserProfile = {
      id: 'user-123',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    it('deve retornar perfil do usuário quando encontrado', async () => {
      // Arrange
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUserProfile,
          error: null
        })
      } as any);

      // Act
      const result = await fetchUserProfile(mockUserId);

      // Assert
      expect(result).toEqual(mockUserProfile);
      expect(mockSupabase.from).toHaveBeenCalledWith('Users');
    });

    it('deve retornar null quando há erro na consulta', async () => {
      // Arrange
      const mockError = { message: 'Database error' };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: mockError
        })
      } as any);

      // Act
      const result = await fetchUserProfile(mockUserId);

      // Assert
      expect(result).toBeNull();
    });

    it('deve retornar null quando há exceção', async () => {
      // Arrange
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      // Act
      const result = await fetchUserProfile(mockUserId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateUserProfile', () => {
    const mockUserId = 'user-123';
    const mockUpdates: Partial<UserProfile> = {
      name: 'João Santos',
      phone: '11888888888'
    };

    it('deve atualizar usuário existente com sucesso', async () => {
      // Arrange - Usuário existe
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: mockUserId },
          error: null
        })
      } as any);

      // Mock para update
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null
        })
      } as any);

      // Act
      const result = await updateUserProfile(mockUserId, mockUpdates);

      // Assert
      expect(result).toEqual({ success: true });
    });

    it('deve criar novo usuário quando não existe', async () => {
      // Arrange - Usuário não existe
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' } // Código para "not found"
        })
      } as any);

      // Mock para insert
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null
        })
      } as any);

      // Act
      const result = await updateUserProfile(mockUserId, mockUpdates);

      // Assert
      expect(result).toEqual({ success: true });
    });

    it('deve retornar erro quando falha ao verificar usuário existente', async () => {
      // Arrange
      const mockError = { message: 'Database error', code: 'OTHER_ERROR' };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: mockError
        })
      } as any);

      // Act
      const result = await updateUserProfile(mockUserId, mockUpdates);

      // Assert
      expect(result).toEqual({ success: false, error: mockError });
    });

    it('deve retornar erro quando falha ao atualizar usuário', async () => {
      // Arrange - Usuário existe
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: mockUserId },
          error: null
        })
      } as any);

      // Mock para update com erro
      const updateError = { message: 'Update failed' };
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: updateError
        })
      } as any);

      // Act
      const result = await updateUserProfile(mockUserId, mockUpdates);

      // Assert
      expect(result).toEqual({ success: false, error: updateError });
    });

    it('deve retornar erro quando há exceção', async () => {
      // Arrange
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      // Act
      const result = await updateUserProfile(mockUserId, mockUpdates);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });
  });
});