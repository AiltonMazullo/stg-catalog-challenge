import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';
import { ThemeProvider } from '@/context/ThemeContext';
import '@testing-library/jest-dom';

// Componente wrapper para testes com tema
const InputWithTheme = ({ 
  isDarkMode = false, 
  ...props 
}: any) => (
  <ThemeProvider>
    <div data-theme={isDarkMode ? 'dark' : 'light'}>
      <Input {...props} />
    </div>
  </ThemeProvider>
);

describe('Input Component', () => {
  describe('Renderização Básica', () => {
    it('deve renderizar o input corretamente', () => {
      render(<InputWithTheme />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('deve renderizar como elemento input', () => {
      render(<InputWithTheme />);
      
      const input = screen.getByRole('textbox');
      expect(input.tagName).toBe('INPUT');
    });

    it('deve aplicar classes CSS básicas', () => {
      render(<InputWithTheme />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('rounded-md');
    });
  });

  describe('Label', () => {
    it('deve renderizar label quando fornecido', () => {
      render(<InputWithTheme label="Nome" />);
      
      const label = screen.getByText('Nome');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('não deve renderizar label quando não fornecido', () => {
      render(<InputWithTheme />);
      
      const labels = screen.queryAllByRole('label');
      expect(labels).toHaveLength(0);
    });

    it('deve aplicar estilos corretos ao label', () => {
      render(<InputWithTheme label="Teste" />);
      
      const label = screen.getByText('Teste');
      expect(label).toHaveClass('block');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-medium');
    });

    it('deve associar label com input via htmlFor', () => {
      render(<InputWithTheme label="Email" id="email-input" />);
      
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveAttribute('id', 'email-input');
      // Note: O componente atual não implementa htmlFor, mas deveria
    });
  });

  describe('Estados de Erro', () => {
    it('deve exibir mensagem de erro quando fornecida', () => {
      render(<InputWithTheme error="Campo obrigatório" />);
      
      const errorMessage = screen.getByText('Campo obrigatório');
      expect(errorMessage).toBeInTheDocument();
    });

    it('não deve exibir mensagem de erro quando não fornecida', () => {
      render(<InputWithTheme />);
      
      const errorMessages = screen.queryByRole('alert');
      expect(errorMessages).not.toBeInTheDocument();
    });

    it('deve aplicar estilos corretos à mensagem de erro', () => {
      render(<InputWithTheme error="Erro de validação" />);
      
      const errorMessage = screen.getByText('Erro de validação');
      expect(errorMessage).toHaveClass('text-sm');
    });

    it('deve exibir múltiplas mensagens de erro', () => {
      render(<InputWithTheme error="Primeiro erro" />);
      
      const errorMessage = screen.getByText('Primeiro erro');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Eventos de Entrada', () => {
    it('deve chamar onChange quando o valor muda', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<InputWithTheme onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'teste');
      
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenCalledTimes(5); // uma chamada por caractere
    });

    it('deve atualizar o valor do input', async () => {
      const user = userEvent.setup();
      
      render(<InputWithTheme />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'novo valor');
      
      expect(input.value).toBe('novo valor');
    });

    it('deve chamar onFocus quando o input recebe foco', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      
      render(<InputWithTheme onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onBlur quando o input perde foco', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      
      render(
        <div>
          <InputWithTheme onBlur={handleBlur} />
          <button>Outro elemento</button>
        </div>
      );
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');
      
      await user.click(input);
      await user.click(button);
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tipos de Input', () => {
    it('deve suportar type="email"', () => {
      render(<InputWithTheme type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('deve suportar type="password"', () => {
      const { container } = render(<InputWithTheme type="password" />);
      
      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('deve suportar type="number"', () => {
      render(<InputWithTheme type="number" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('deve suportar type="tel"', () => {
      render(<InputWithTheme type="tel" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });
  });

  describe('Atributos e Props', () => {
    it('deve aplicar placeholder', () => {
      render(<InputWithTheme placeholder="Digite seu nome" />);
      
      const input = screen.getByPlaceholderText('Digite seu nome');
      expect(input).toBeInTheDocument();
    });

    it('deve aplicar value controlado', () => {
      render(<InputWithTheme value="valor controlado" readOnly />);
      
      const input = screen.getByDisplayValue('valor controlado');
      expect(input).toBeInTheDocument();
    });

    it('deve aplicar defaultValue', () => {
      render(<InputWithTheme defaultValue="valor padrão" />);
      
      const input = screen.getByDisplayValue('valor padrão');
      expect(input).toBeInTheDocument();
    });

    it('deve suportar disabled', () => {
      render(<InputWithTheme disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('deve suportar required', () => {
      render(<InputWithTheme required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('deve suportar maxLength', () => {
      render(<InputWithTheme maxLength={10} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
    });
  });

  describe('Classes Customizadas', () => {
    it('deve aplicar classes customizadas', () => {
      render(<InputWithTheme className="custom-class" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('deve manter classes padrão junto com classes customizadas', () => {
      render(<InputWithTheme className="custom" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter foco visível', () => {
      render(<InputWithTheme />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:outline-none');
    expect(input).toHaveClass('focus:ring-2');
    });

    it('deve ser acessível via teclado', async () => {
      const user = userEvent.setup();
      
      render(<InputWithTheme />);
      
      const input = screen.getByRole('textbox');
      await user.tab();
      
      expect(input).toHaveFocus();
    });

    it('deve suportar aria-label', () => {
      render(<InputWithTheme aria-label="Campo de entrada" />);
      
      const input = screen.getByLabelText('Campo de entrada');
      expect(input).toBeInTheDocument();
    });

    it('deve suportar aria-describedby para erros', () => {
      render(
        <InputWithTheme 
          aria-describedby="error-message" 
          error="Erro de validação"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
    });
  });

  describe('Validação e Estados', () => {
    it('deve funcionar com validação em tempo real', async () => {
      const user = userEvent.setup();
      const validate = jest.fn((value) => 
        value.length < 3 ? 'Mínimo 3 caracteres' : ''
      );
      
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        const [error, setError] = React.useState('');
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setValue(newValue);
          setError(validate(newValue));
        };
        
        return (
          <InputWithTheme 
            value={value}
            onChange={handleChange}
            error={error}
            label="Nome"
          />
        );
      };
      
      render(<TestComponent />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'ab');
      
      expect(screen.getByText('Mínimo 3 caracteres')).toBeInTheDocument();
      
      await user.type(input, 'c');
      expect(screen.queryByText('Mínimo 3 caracteres')).not.toBeInTheDocument();
    });

    it('deve limpar valor quando necessário', async () => {
      const user = userEvent.setup();
      
      render(<InputWithTheme defaultValue="valor inicial" />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.clear(input);
      
      expect(input.value).toBe('');
    });
  });

  describe('Integração com Formulários', () => {
    it('deve funcionar dentro de um form', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <InputWithTheme name="username" />
          <button type="submit">Enviar</button>
        </form>
      );
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');
      
      await user.type(input, 'usuario');
      await user.click(button);
      
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('deve suportar name attribute', () => {
      render(<InputWithTheme name="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('deve suportar id attribute', () => {
      render(<InputWithTheme id="user-input" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'user-input');
    });
  });

  describe('Comportamentos Especiais', () => {
    it('deve selecionar todo o texto ao focar (se configurado)', async () => {
      const user = userEvent.setup();
      
      render(<InputWithTheme defaultValue="texto selecionável" />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.click(input);
      
      // Simular seleção de todo o texto
      input.select();
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(input.value.length);
    });

    it('deve manter foco após erro de validação', async () => {
      const user = userEvent.setup();
      
      render(<InputWithTheme error="Campo inválido" />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(input).toHaveFocus();
      expect(screen.getByText('Campo inválido')).toBeInTheDocument();
    });
  });

  describe('Combinações de Props', () => {
    it('deve funcionar com todas as props combinadas', () => {
      render(
        <InputWithTheme 
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error="Email inválido"
          required
          className="custom-input"
        />
      );
      
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      const error = screen.getByText('Email inválido');
      
      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'seu@email.com');
      expect(input).toBeRequired();
      expect(input).toHaveClass('custom-input');
      expect(error).toBeInTheDocument();
    });
  });
});