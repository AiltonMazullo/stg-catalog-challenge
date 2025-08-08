import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';

// Produto mock para testes
const mockProduct1 = {
  id: '1',
  name: 'Produto 1',
  price: 10.99,
  image_url: 'https://example.com/product1.jpg'
};

const mockProduct2 = {
  id: '2',
  name: 'Produto 2',
  price: 25.50
};

const mockProduct3 = {
  id: '3',
  name: 'Produto 3',
  price: 5.00,
  image_url: 'https://example.com/product3.jpg'
};

// Componente de teste para usar o hook useCart
const TestComponent = () => {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();

  return (
    <div>
      <div data-testid="items-count">{items.length}</div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">{getTotalPrice().toFixed(2)}</div>
      
      {items.map((item) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          <span data-testid={`item-${item.id}-name`}>{item.name}</span>
          <span data-testid={`item-${item.id}-quantity`}>{item.quantity}</span>
          <span data-testid={`item-${item.id}-price`}>{item.price}</span>
        </div>
      ))}
      
      <button
        onClick={() => addToCart(mockProduct1)}
        data-testid="add-product1-btn"
      >
        Add Product 1
      </button>
      
      <button
        onClick={() => addToCart(mockProduct2)}
        data-testid="add-product2-btn"
      >
        Add Product 2
      </button>
      
      <button
        onClick={() => addToCart(mockProduct3)}
        data-testid="add-product3-btn"
      >
        Add Product 3
      </button>
      
      <button
        onClick={() => removeFromCart('1')}
        data-testid="remove-product1-btn"
      >
        Remove Product 1
      </button>
      
      <button
        onClick={() => updateQuantity('1', 3)}
        data-testid="update-product1-quantity-btn"
      >
        Update Product 1 Quantity to 3
      </button>
      
      <button
        onClick={() => updateQuantity('1', 0)}
        data-testid="update-product1-quantity-zero-btn"
      >
        Update Product 1 Quantity to 0
      </button>
      
      <button
        onClick={clearCart}
        data-testid="clear-cart-btn"
      >
        Clear Cart
      </button>
    </div>
  );
};

// Componente para testar erro do hook fora do provider
const TestComponentWithoutProvider = () => {
  const cart = useCart();
  return <div>{cart.items.length}</div>;
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console para evitar logs nos testes
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('CartProvider', () => {
    it('deve renderizar children corretamente', () => {
      // Arrange & Act
      render(
        <CartProvider>
          <div data-testid="child">Test Child</div>
        </CartProvider>
      );

      // Assert
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('deve inicializar com carrinho vazio', () => {
      // Arrange & Act
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
    });
  });

  describe('addToCart', () => {
    it('deve adicionar novo produto ao carrinho', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Act
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('10.99');
      expect(screen.getByTestId('item-1-name')).toHaveTextContent('Produto 1');
      expect(screen.getByTestId('item-1-quantity')).toHaveTextContent('1');
      expect(screen.getByTestId('item-1-price')).toHaveTextContent('10.99');
    });

    it('deve incrementar quantidade quando produto já existe no carrinho', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Act - Adicionar o mesmo produto duas vezes
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });
      
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('1'); // Ainda 1 item único
      expect(screen.getByTestId('total-items')).toHaveTextContent('2'); // Mas 2 unidades
      expect(screen.getByTestId('total-price')).toHaveTextContent('21.98'); // 10.99 * 2
      expect(screen.getByTestId('item-1-quantity')).toHaveTextContent('2');
    });

    it('deve adicionar múltiplos produtos diferentes', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Act
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });
      
      act(() => {
        screen.getByTestId('add-product2-btn').click();
      });
      
      act(() => {
        screen.getByTestId('add-product3-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('3');
      expect(screen.getByTestId('total-items')).toHaveTextContent('3');
      expect(screen.getByTestId('total-price')).toHaveTextContent('41.49'); // 10.99 + 25.50 + 5.00
    });
  });

  describe('removeFromCart', () => {
    it('deve remover produto do carrinho', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Adicionar produto primeiro
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });

      // Act - Remover produto
      act(() => {
        screen.getByTestId('remove-product1-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
      expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    });

    it('deve remover apenas o produto especificado', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Adicionar múltiplos produtos
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });
      
      act(() => {
        screen.getByTestId('add-product2-btn').click();
      });

      // Act - Remover apenas o produto 1
      act(() => {
        screen.getByTestId('remove-product1-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('25.50');
      expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
    });
  });

  describe('updateQuantity', () => {
    it('deve atualizar quantidade do produto', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Adicionar produto primeiro
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });

      // Act - Atualizar quantidade para 3
      act(() => {
        screen.getByTestId('update-product1-quantity-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('3');
      expect(screen.getByTestId('total-price')).toHaveTextContent('32.97'); // 10.99 * 3
      expect(screen.getByTestId('item-1-quantity')).toHaveTextContent('3');
    });

    it('deve remover produto quando quantidade for 0', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Adicionar produto primeiro
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });

      // Act - Atualizar quantidade para 0
      act(() => {
        screen.getByTestId('update-product1-quantity-zero-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
      expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    });

    it('deve remover produto quando quantidade for negativa', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      let cartContext: any;
      const TestHook = () => {
        cartContext = useCart();
        return null;
      };

      render(
        <CartProvider>
          <TestHook />
        </CartProvider>
      );

      // Adicionar produto primeiro
      act(() => {
        cartContext.addToCart(mockProduct1);
      });

      // Act - Atualizar quantidade para -1
      act(() => {
        cartContext.updateQuantity('1', -1);
      });

      // Assert
      expect(cartContext.items).toHaveLength(0);
      expect(cartContext.getTotalItems()).toBe(0);
      expect(cartContext.getTotalPrice()).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('deve limpar todos os itens do carrinho', () => {
      // Arrange
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Adicionar múltiplos produtos
      act(() => {
        screen.getByTestId('add-product1-btn').click();
      });
      
      act(() => {
        screen.getByTestId('add-product2-btn').click();
      });
      
      act(() => {
        screen.getByTestId('add-product3-btn').click();
      });

      // Act - Limpar carrinho
      act(() => {
        screen.getByTestId('clear-cart-btn').click();
      });

      // Assert
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
      expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    });
  });

  describe('getTotalItems', () => {
    it('deve retornar 0 para carrinho vazio', () => {
      // Arrange
      let cartContext: any;
      const TestHook = () => {
        cartContext = useCart();
        return null;
      };

      render(
        <CartProvider>
          <TestHook />
        </CartProvider>
      );

      // Act & Assert
      expect(cartContext.getTotalItems()).toBe(0);
    });

    it('deve calcular total de itens corretamente', () => {
      // Arrange
      let cartContext: any;
      const TestHook = () => {
        cartContext = useCart();
        return null;
      };

      render(
        <CartProvider>
          <TestHook />
        </CartProvider>
      );

      // Act
      act(() => {
        cartContext.addToCart(mockProduct1); // quantidade 1
        cartContext.addToCart(mockProduct1); // quantidade 2
        cartContext.addToCart(mockProduct2); // quantidade 1
        cartContext.updateQuantity('2', 3); // quantidade 3
      });

      // Assert
      expect(cartContext.getTotalItems()).toBe(5); // 2 + 3 = 5
    });
  });

  describe('getTotalPrice', () => {
    it('deve retornar 0 para carrinho vazio', () => {
      // Arrange
      let cartContext: any;
      const TestHook = () => {
        cartContext = useCart();
        return null;
      };

      render(
        <CartProvider>
          <TestHook />
        </CartProvider>
      );

      // Act & Assert
      expect(cartContext.getTotalPrice()).toBe(0);
    });

    it('deve calcular preço total corretamente', () => {
      // Arrange
      let cartContext: any;
      const TestHook = () => {
        cartContext = useCart();
        return null;
      };

      render(
        <CartProvider>
          <TestHook />
        </CartProvider>
      );

      // Act
      act(() => {
        cartContext.addToCart(mockProduct1); // 10.99 * 1 = 10.99
        cartContext.addToCart(mockProduct1); // 10.99 * 2 = 21.98
        cartContext.addToCart(mockProduct2); // 25.50 * 1 = 25.50
        cartContext.updateQuantity('2', 2); // 25.50 * 2 = 51.00
      });

      // Assert
      expect(cartContext.getTotalPrice()).toBe(72.98); // 21.98 + 51.00 = 72.98
    });

    it('deve calcular preço com decimais corretamente', () => {
      // Arrange
      let cartContext: any;
      const TestHook = () => {
        cartContext = useCart();
        return null;
      };

      render(
        <CartProvider>
          <TestHook />
        </CartProvider>
      );

      // Act
      act(() => {
        cartContext.addToCart(mockProduct3); // 5.00 * 1 = 5.00
        cartContext.updateQuantity('3', 3); // 5.00 * 3 = 15.00
      });

      // Assert
      expect(cartContext.getTotalPrice()).toBe(15.00);
    });
  });

  describe('useCart hook', () => {
    it('deve lançar erro quando usado fora do CartProvider', () => {
      // Arrange & Act & Assert
      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useCart must be used within a CartProvider');
    });

    it('deve retornar todas as funções e propriedades do contexto', () => {
      // Arrange
      let cartContext: any;
      const TestHook = () => {
        cartContext = useCart();
        return null;
      };

      render(
        <CartProvider>
          <TestHook />
        </CartProvider>
      );

      // Act & Assert
      expect(cartContext).toHaveProperty('items');
      expect(cartContext).toHaveProperty('addToCart');
      expect(cartContext).toHaveProperty('removeFromCart');
      expect(cartContext).toHaveProperty('updateQuantity');
      expect(cartContext).toHaveProperty('clearCart');
      expect(cartContext).toHaveProperty('getTotalItems');
      expect(cartContext).toHaveProperty('getTotalPrice');
      
      expect(typeof cartContext.addToCart).toBe('function');
      expect(typeof cartContext.removeFromCart).toBe('function');
      expect(typeof cartContext.updateQuantity).toBe('function');
      expect(typeof cartContext.clearCart).toBe('function');
      expect(typeof cartContext.getTotalItems).toBe('function');
      expect(typeof cartContext.getTotalPrice).toBe('function');
      expect(Array.isArray(cartContext.items)).toBe(true);
    });
  });
});