import { fetchProducts } from '@/services/products.api';
import { supabase } from '@/models/supabase';
import { Product } from '@/types';

// Mock do Supabase já está configurado no jest.setup.js
jest.mock('@/models/supabase');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('products.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error para evitar logs nos testes
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchProducts', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Produto 1',
        description: 'Descrição do produto 1',
        price: 29.99,
        category: 'Categoria A',
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Produto 2',
        description: 'Descrição do produto 2',
        price: 49.99,
        category: 'Categoria B',
        stock: 5,
        image_url: 'https://example.com/image2.jpg',
        created_at: '2024-01-02T00:00:00Z'
      }
    ];

    it('deve retornar lista de produtos quando consulta é bem-sucedida', async () => {
      // Arrange
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockProducts,
          error: null
        })
      } as any);

      // Act
      const result = await fetchProducts();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
    });

    it('deve retornar array vazio quando há erro na consulta', async () => {
      // Arrange
      const mockError = { message: 'Database error' };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError
        })
      } as any);

      // Act
      const result = await fetchProducts();

      // Assert
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando data é null', async () => {
      // Arrange
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      } as any);

      // Act
      const result = await fetchProducts();

      // Assert
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando há exceção', async () => {
      // Arrange
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      // Act
      const result = await fetchProducts();

      // Assert
      expect(result).toEqual([]);
    });

    it('deve retornar produtos mesmo quando array está vazio', async () => {
      // Arrange
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      } as any);

      // Act
      const result = await fetchProducts();

      // Assert
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});