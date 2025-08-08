import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/context/ThemeContext';
import '@testing-library/jest-dom';

// Mock do lucide-react
jest.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => (
    <div data-testid="loader-icon" className={className}>
      Loading Icon
    </div>
  ),
}));

// Componente wrapper para testes com tema
const ButtonWithTheme = ({ 
  children, 
  isDarkMode = false, 
  ...props 
}: any) => (
  <ThemeProvider>
    <div data-theme={isDarkMode ? 'dark' : 'light'}>
      <Button {...props}>{children}</Button>
    </div>
  </ThemeProvider>
);

describe('Button Component', () => {
  describe('Renderização Básica', () => {
    it('deve renderizar o botão com texto', () => {
      render(<ButtonWithTheme>Clique aqui</ButtonWithTheme>);
      
      const button = screen.getByRole('button', { name: /clique aqui/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Clique aqui');
    });

    it('deve renderizar como elemento button por padrão', () => {
      render(<ButtonWithTheme>Teste</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('deve aplicar classes CSS básicas', () => {
      render(<ButtonWithTheme>Teste</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('rounded-md');
    });
  });

  describe('Variantes de Estilo', () => {
    it('deve aplicar estilo primary por padrão', () => {
      render(<ButtonWithTheme>Primary</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-500');
    expect(button).toHaveClass('text-white');
    });

    it('deve aplicar estilo secondary', () => {
      render(<ButtonWithTheme variant="secondary">Secondary</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-900');
    });

    it('deve aplicar estilo outline', () => {
      render(<ButtonWithTheme variant="outline">Outline</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
    expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('Tamanhos', () => {
    it('deve aplicar tamanho médio por padrão', () => {
      render(<ButtonWithTheme>Medium</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('text-base');
    });

    it('deve aplicar tamanho pequeno', () => {
      render(<ButtonWithTheme size="sm">Small</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-1.5');
    expect(button).toHaveClass('text-sm');
    });

    it('deve aplicar tamanho grande', () => {
      render(<ButtonWithTheme size="lg">Large</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-lg');
    });
  });

  describe('Estado de Carregamento', () => {
    it('deve mostrar indicador de carregamento quando isLoading é true', () => {
      render(<ButtonWithTheme isLoading>Carregando</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      const loader = screen.getByTestId('loader-icon');
      
      expect(loader).toBeInTheDocument();
      expect(button).toHaveTextContent('Carregando...');
      // O texto original não deve estar visível quando está carregando
      expect(button).toHaveTextContent('Loading Icon');
    });

    it('deve desabilitar o botão quando está carregando', () => {
      render(<ButtonWithTheme isLoading>Teste</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-70');
    expect(button).toHaveClass('cursor-not-allowed');
    });

    it('deve mostrar o ícone de carregamento com animação', () => {
      render(<ButtonWithTheme isLoading>Teste</ButtonWithTheme>);
      
      const loader = screen.getByTestId('loader-icon');
      expect(loader).toHaveClass('animate-spin');
    });
  });

  describe('Estado Desabilitado', () => {
    it('deve desabilitar o botão quando disabled é true', () => {
      render(<ButtonWithTheme disabled>Desabilitado</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-70');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    it('deve manter o texto original quando desabilitado', () => {
      render(<ButtonWithTheme disabled>Texto Original</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Texto Original');
    });
  });

  describe('Largura Completa', () => {
    it('deve aplicar largura completa quando fullWidth é true', () => {
      render(<ButtonWithTheme fullWidth>Full Width</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('não deve aplicar largura completa por padrão', () => {
      render(<ButtonWithTheme>Normal Width</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Classes Customizadas', () => {
    it('deve aplicar classes customizadas', () => {
      render(
        <ButtonWithTheme className="custom-class another-class">
          Custom
        </ButtonWithTheme>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('another-class');
    });

    it('deve manter classes padrão junto com classes customizadas', () => {
      render(<ButtonWithTheme className="custom">Teste</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom');
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('bg-green-500');
    });
  });

  describe('Eventos de Interação', () => {
    it('deve chamar onClick quando clicado', () => {
      const handleClick = jest.fn();
      render(<ButtonWithTheme onClick={handleClick}>Clique</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onClick quando desabilitado', () => {
      const handleClick = jest.fn();
      render(
        <ButtonWithTheme onClick={handleClick} disabled>
          Desabilitado
        </ButtonWithTheme>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('não deve chamar onClick quando está carregando', () => {
      const handleClick = jest.fn();
      render(
        <ButtonWithTheme onClick={handleClick} isLoading>
          Carregando
        </ButtonWithTheme>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('deve responder a eventos de teclado', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<ButtonWithTheme onClick={handleClick}>Pressione Enter</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter foco visível', () => {
      render(<ButtonWithTheme>Foco</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
    });

    it('deve ser acessível via teclado', () => {
      render(<ButtonWithTheme>Acessível</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('deve manter acessibilidade quando desabilitado', () => {
      render(<ButtonWithTheme disabled>Desabilitado</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Props Adicionais', () => {
    it('deve passar props adicionais para o elemento button', () => {
      render(
        <ButtonWithTheme 
          data-testid="custom-button" 
          aria-label="Botão customizado"
        >
          Props
        </ButtonWithTheme>
      );
      
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Botão customizado');
    });

    it('deve suportar atributos HTML padrão', () => {
      render(
        <ButtonWithTheme 
          type="submit" 
          form="test-form"
        >
          Submit
        </ButtonWithTheme>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('form', 'test-form');
    });
  });

  describe('Animações e Transições', () => {
    it('deve ter classes de transição', () => {
      render(<ButtonWithTheme>Animado</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors');
    });

    it('deve ter efeitos de hover e active', () => {
      render(<ButtonWithTheme>Hover</ButtonWithTheme>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:scale-105');
    expect(button).toHaveClass('active:scale-95');
    });
  });

  describe('Combinações de Estados', () => {
    it('deve funcionar com múltiplas props combinadas', () => {
      render(
        <ButtonWithTheme 
          variant="secondary" 
          size="lg" 
          fullWidth 
          className="custom"
        >
          Combinado
        </ButtonWithTheme>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200'); 
      expect(button).toHaveClass('px-6'); 
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('text-lg'); 
      expect(button).toHaveClass('w-full'); 
      expect(button).toHaveClass('custom');
    });

    it('deve priorizar estado de carregamento sobre disabled', () => {
      render(
        <ButtonWithTheme isLoading disabled>
          Loading e Disabled
        </ButtonWithTheme>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Carregando...');
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });
  });
});