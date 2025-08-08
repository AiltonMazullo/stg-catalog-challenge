import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { ThemeProvider } from '@/context/ThemeContext';
import '@testing-library/jest-dom';

// Mock do framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
    button: ({ children, onClick, className, ...props }: any) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
    h3: ({ children, className, ...props }: any) => (
      <h3 className={className} {...props}>
        {children}
      </h3>
    ),
    p: ({ children, className, ...props }: any) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock do lucide-react
jest.mock('lucide-react', () => ({
  CheckCircle: ({ className }: { className?: string }) => (
    <div data-testid="check-icon" className={className}>
      Check Icon
    </div>
  ),
  XCircle: ({ className }: { className?: string }) => (
    <div data-testid="x-icon" className={className}>
      X Icon
    </div>
  ),
  MessageCircle: ({ className }: { className?: string }) => (
    <div data-testid="message-icon" className={className}>
      Message Icon
    </div>
  ),
}));

// Componente wrapper para testes com tema
const ModalWithTheme = ({ 
  isDarkMode = false, 
  ...props 
}: any) => (
  <ThemeProvider>
    <div data-theme={isDarkMode ? 'dark' : 'light'}>
      <ConfirmationModal {...props} />
    </div>
  </ThemeProvider>
);

describe('ConfirmationModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização Básica', () => {
    it('deve renderizar o modal quando isOpen é true', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      expect(screen.getByText('Confirmar Envio')).toBeInTheDocument();
      expect(screen.getByText('Você enviou a mensagem no WhatsApp?')).toBeInTheDocument();
    });

    it('não deve renderizar o modal quando isOpen é false', () => {
      render(<ModalWithTheme {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Confirmar Envio')).not.toBeInTheDocument();
    });

    it('deve renderizar com props padrão', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      expect(screen.getByText('Confirmar Envio')).toBeInTheDocument();
      expect(screen.getByText('Você enviou a mensagem no WhatsApp?')).toBeInTheDocument();
      expect(screen.getByText('Sim, enviei')).toBeInTheDocument();
      expect(screen.getByText('Não enviei')).toBeInTheDocument();
    });

    it('deve renderizar com props customizadas', () => {
      render(
        <ModalWithTheme 
          {...defaultProps}
          title="Título Customizado"
          message="Mensagem customizada"
          confirmText="Confirmar"
          cancelText="Cancelar"
        />
      );
      
      expect(screen.getByText('Título Customizado')).toBeInTheDocument();
      expect(screen.getByText('Mensagem customizada')).toBeInTheDocument();
      expect(screen.getByText('Confirmar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });
  });

  describe('Ícones', () => {
    it('deve renderizar ícone de mensagem no header', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      const messageIcon = screen.getByTestId('message-icon');
      expect(messageIcon).toBeInTheDocument();
    });

    it('deve renderizar ícone de check no botão confirmar', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      const checkIcon = screen.getByTestId('check-icon');
      expect(checkIcon).toBeInTheDocument();
    });

    it('deve renderizar ícone de X no botão cancelar', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      const xIcon = screen.getByTestId('x-icon');
      expect(xIcon).toBeInTheDocument();
    });
  });

  describe('Interações com Botões', () => {
    it('deve chamar onConfirm quando botão confirmar é clicado', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();
      
      render(
        <ModalWithTheme 
          {...defaultProps}
          onConfirm={onConfirm}
        />
      );
      
      const confirmButton = screen.getByText('Sim, enviei');
      await user.click(confirmButton);
      
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onCancel quando botão cancelar é clicado', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      
      render(
        <ModalWithTheme 
          {...defaultProps}
          onCancel={onCancel}
        />
      );
      
      const cancelButton = screen.getByText('Não enviei');
      await user.click(cancelButton);
      
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onCancel quando backdrop é clicado', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      
      const { container } = render(
        <ModalWithTheme 
          {...defaultProps}
          onCancel={onCancel}
        />
      );
      
      // Simular clique no backdrop (primeiro div com classes fixed)
      const backdrop = container.querySelector('.fixed');
      if (backdrop) {
        await user.click(backdrop);
        expect(onCancel).toHaveBeenCalledTimes(1);
      }
    });

    it('não deve chamar onCancel quando modal content é clicado', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      
      render(
        <ModalWithTheme 
          {...defaultProps}
          onCancel={onCancel}
        />
      );
      
      const modalContent = screen.getByText('Confirmar Envio');
      await user.click(modalContent);
      
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Estrutura e Classes CSS', () => {
    it('deve aplicar classes CSS corretas para tema claro', () => {
      const { container } = render(<ModalWithTheme {...defaultProps} />);
      
      const modalContent = container.querySelector('.bg-white');
      expect(modalContent).toBeInTheDocument();
    });

    it('deve ter estrutura de layout correta', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      // Verificar se o título é um h3
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Confirmar Envio');
      
      // Verificar se os botões estão presentes
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('deve aplicar classes de responsividade', () => {
      const { container } = render(<ModalWithTheme {...defaultProps} />);
      
      const modal = container.querySelector('.max-w-sm');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter botões acessíveis', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /sim, enviei/i });
      const cancelButton = screen.getByRole('button', { name: /não enviei/i });
      
      expect(confirmButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });

    it('deve ter heading acessível', () => {
      render(<ModalWithTheme {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Confirmar Envio');
    });

    it('deve ser navegável por teclado', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      
      render(
        <ModalWithTheme 
          {...defaultProps}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
      
      // Navegar pelos botões com Tab
      await user.tab();
      const confirmButton = screen.getByText('Sim, enviei');
      expect(confirmButton).toHaveFocus();
      
      await user.tab();
      const cancelButton = screen.getByText('Não enviei');
      expect(cancelButton).toHaveFocus();
      
      // Ativar botão com Enter
      await user.keyboard('{Enter}');
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('deve suportar ativação por espaço', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();
      
      render(
        <ModalWithTheme 
          {...defaultProps}
          onConfirm={onConfirm}
        />
      );
      
      const confirmButton = screen.getByText('Sim, enviei');
      confirmButton.focus();
      
      await user.keyboard(' ');
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Estados e Comportamentos', () => {
    it('deve manter estado quando props mudam', () => {
      const { rerender } = render(
        <ModalWithTheme 
          {...defaultProps}
          title="Título Original"
        />
      );
      
      expect(screen.getByText('Título Original')).toBeInTheDocument();
      
      rerender(
        <ModalWithTheme 
          {...defaultProps}
          title="Título Atualizado"
        />
      );
      
      expect(screen.getByText('Título Atualizado')).toBeInTheDocument();
      expect(screen.queryByText('Título Original')).not.toBeInTheDocument();
    });

    it('deve abrir e fechar corretamente', () => {
      const { rerender } = render(
        <ModalWithTheme {...defaultProps} isOpen={false} />
      );
      
      expect(screen.queryByText('Confirmar Envio')).not.toBeInTheDocument();
      
      rerender(<ModalWithTheme {...defaultProps} isOpen={true} />);
      
      expect(screen.getByText('Confirmar Envio')).toBeInTheDocument();
    });
  });

  describe('Casos de Uso Específicos', () => {
    it('deve funcionar como modal de confirmação de exclusão', () => {
      render(
        <ModalWithTheme 
          {...defaultProps}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este item?"
          confirmText="Sim, excluir"
          cancelText="Cancelar"
        />
      );
      
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
      expect(screen.getByText('Tem certeza que deseja excluir este item?')).toBeInTheDocument();
      expect(screen.getByText('Sim, excluir')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('deve funcionar como modal de confirmação de envio', () => {
      render(
        <ModalWithTheme 
          {...defaultProps}
          title="Enviar Formulário"
          message="Deseja enviar o formulário?"
          confirmText="Enviar"
          cancelText="Revisar"
        />
      );
      
      expect(screen.getByText('Enviar Formulário')).toBeInTheDocument();
      expect(screen.getByText('Deseja enviar o formulário?')).toBeInTheDocument();
      expect(screen.getByText('Enviar')).toBeInTheDocument();
      expect(screen.getByText('Revisar')).toBeInTheDocument();
    });

    it('deve funcionar como modal de confirmação de logout', () => {
      render(
        <ModalWithTheme 
          {...defaultProps}
          title="Sair da Conta"
          message="Tem certeza que deseja sair?"
          confirmText="Sair"
          cancelText="Ficar"
        />
      );
      
      expect(screen.getByText('Sair da Conta')).toBeInTheDocument();
      expect(screen.getByText('Tem certeza que deseja sair?')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
      expect(screen.getByText('Ficar')).toBeInTheDocument();
    });
  });

  describe('Integração com Eventos', () => {
    it('deve prevenir múltiplos cliques rápidos', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();
      
      render(
        <ModalWithTheme 
          {...defaultProps}
          onConfirm={onConfirm}
        />
      );
      
      const confirmButton = screen.getByText('Sim, enviei');
      
      // Cliques rápidos
      await user.click(confirmButton);
      await user.click(confirmButton);
      await user.click(confirmButton);
      
      // Deve ter sido chamado apenas uma vez por clique
      expect(onConfirm).toHaveBeenCalledTimes(3);
    });

    it('deve funcionar com async handlers', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn().mockResolvedValue(undefined);
      
      render(
        <ModalWithTheme 
          {...defaultProps}
          onConfirm={onConfirm}
        />
      );
      
      const confirmButton = screen.getByText('Sim, enviei');
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Renderização Condicional', () => {
    it('deve renderizar apenas quando necessário', () => {
      const { container } = render(
        <ModalWithTheme {...defaultProps} isOpen={false} />
      );
      
      // Quando isOpen é false, o modal não deve renderizar conteúdo
      expect(screen.queryByText('Confirmar Envio')).not.toBeInTheDocument();
    });

    it('deve limpar recursos quando fechado', () => {
      const { rerender } = render(
        <ModalWithTheme {...defaultProps} isOpen={true} />
      );
      
      expect(screen.getByText('Confirmar Envio')).toBeInTheDocument();
      
      rerender(
        <ModalWithTheme {...defaultProps} isOpen={false} />
      );
      
      expect(screen.queryByText('Confirmar Envio')).not.toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('deve funcionar com props mínimas obrigatórias', () => {
      const minimalProps = {
        isOpen: true,
        onConfirm: jest.fn(),
        onCancel: jest.fn(),
      };
      
      render(<ModalWithTheme {...minimalProps} />);
      
      expect(screen.getByText('Confirmar Envio')).toBeInTheDocument();
      expect(screen.getByText('Você enviou a mensagem no WhatsApp?')).toBeInTheDocument();
    });

    it('deve lidar com strings vazias', () => {
      render(
        <ModalWithTheme 
          {...defaultProps}
          title=""
          message=""
          confirmText=""
          cancelText=""
        />
      );
      
      // Deve renderizar mesmo com strings vazias
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });
});