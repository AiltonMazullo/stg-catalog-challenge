import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/card';
import { ThemeProvider } from '@/context/ThemeContext';
import '@testing-library/jest-dom';

// Componente wrapper para testes com tema
const CardWithTheme = ({ 
  isDarkMode = false, 
  children,
  ...props 
}: any) => (
  <ThemeProvider>
    <div data-theme={isDarkMode ? 'dark' : 'light'}>
      <Card {...props}>{children}</Card>
    </div>
  </ThemeProvider>
);

describe('Card Component', () => {
  describe('Renderização Básica do Card', () => {
    it('deve renderizar o card corretamente', () => {
      render(
        <CardWithTheme>
          <div>Conteúdo do card</div>
        </CardWithTheme>
      );
      
      const cardContent = screen.getByText('Conteúdo do card');
      expect(cardContent).toBeInTheDocument();
    });

    it('deve aplicar classes CSS básicas', () => {
      const { container } = render(
        <CardWithTheme>
          Conteúdo
        </CardWithTheme>
      );
      
      const card = container.querySelector('.rounded-lg');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-md');
      expect(card).toHaveClass('overflow-hidden');
    });

    it('deve aplicar tema claro por padrão', () => {
      const { container } = render(
        <CardWithTheme>
          Conteúdo
        </CardWithTheme>
      );
      
      const card = container.querySelector('.bg-white');
      expect(card).toHaveClass('bg-white');
    });

    it('deve aplicar classes customizadas', () => {
      const { container } = render(
        <CardWithTheme className="custom-class">
          Conteúdo
        </CardWithTheme>
      );
      
      const card = container.querySelector('.custom-class');
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('bg-white');
    });
  });

  describe('Card.Header', () => {
    it('deve renderizar o header corretamente', () => {
      render(
        <CardWithTheme>
          <Card.Header>Título do Card</Card.Header>
        </CardWithTheme>
      );
      
      const header = screen.getByText('Título do Card');
      expect(header).toBeInTheDocument();
    });

    it('deve aplicar classes CSS básicas ao header', () => {
      const { container } = render(
        <CardWithTheme>
          <Card.Header>
            Header
          </Card.Header>
        </CardWithTheme>
      );
      
      const header = container.querySelector('.border-b');
      expect(header).toHaveClass('px-6');
      expect(header).toHaveClass('py-4');
      expect(header).toHaveClass('border-b');
    });

    it('deve aplicar tema claro ao header por padrão', () => {
      const { container } = render(
        <CardWithTheme>
          <Card.Header>
            Header
          </Card.Header>
        </CardWithTheme>
      );
      
      const header = container.querySelector('.border-gray-200');
      expect(header).toHaveClass('border-gray-200');
    });

    it('deve aplicar classes customizadas ao header', () => {
      const { container } = render(
        <CardWithTheme>
          <Card.Header className="custom-header">
            Header
          </Card.Header>
        </CardWithTheme>
      );
      
      const header = container.querySelector('.custom-header');
      expect(header).toHaveClass('custom-header');
      expect(header).toHaveClass('px-6');
      expect(header).toHaveClass('py-4');
    });

    it('deve renderizar elementos complexos no header', () => {
      render(
        <CardWithTheme>
          <Card.Header>
            <h2>Título</h2>
            <button>Ação</button>
          </Card.Header>
        </CardWithTheme>
      );
      
      const title = screen.getByRole('heading', { level: 2 });
      const button = screen.getByRole('button');
      
      expect(title).toHaveTextContent('Título');
      expect(button).toHaveTextContent('Ação');
    });
  });

  describe('Card.Body', () => {
    it('deve renderizar o body corretamente', () => {
      render(
        <CardWithTheme>
          <Card.Body>Conteúdo principal</Card.Body>
        </CardWithTheme>
      );
      
      const body = screen.getByText('Conteúdo principal');
      expect(body).toBeInTheDocument();
    });

    it('deve aplicar classes CSS básicas ao body', () => {
      render(
        <CardWithTheme>
          <Card.Body>
            Body
          </Card.Body>
        </CardWithTheme>
      );
      
      const body = screen.getByText('Body');
      expect(body).toHaveClass('px-6');
      expect(body).toHaveClass('py-4');
    });

    it('deve aplicar classes customizadas ao body', () => {
      const { container } = render(
        <CardWithTheme>
          <Card.Body className="custom-body">
            Body
          </Card.Body>
        </CardWithTheme>
      );
      
      const body = container.querySelector('.custom-body');
      expect(body).toHaveClass('custom-body');
      expect(body).toHaveClass('px-6');
      expect(body).toHaveClass('py-4');
    });

    it('deve renderizar conteúdo complexo no body', () => {
      render(
        <CardWithTheme>
          <Card.Body>
            <p>Parágrafo 1</p>
            <p>Parágrafo 2</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </Card.Body>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Parágrafo 1')).toBeInTheDocument();
      expect(screen.getByText('Parágrafo 2')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Card.Footer', () => {
    it('deve renderizar o footer corretamente', () => {
      render(
        <CardWithTheme>
          <Card.Footer>Rodapé do card</Card.Footer>
        </CardWithTheme>
      );
      
      const footer = screen.getByText('Rodapé do card');
      expect(footer).toBeInTheDocument();
    });

    it('deve aplicar classes CSS básicas ao footer', () => {
      const { container } = render(
        <CardWithTheme>
          <Card.Footer>
            Footer
          </Card.Footer>
        </CardWithTheme>
      );
      
      const footer = container.querySelector('.border-t');
      expect(footer).toHaveClass('px-6');
      expect(footer).toHaveClass('py-4');
      expect(footer).toHaveClass('border-t');
    });

    it('deve aplicar tema claro ao footer por padrão', () => {
      const { container } = render(
        <CardWithTheme>
          <Card.Footer>
            Footer
          </Card.Footer>
        </CardWithTheme>
      );
      
      const footer = container.querySelector('.border-gray-200');
      expect(footer).toHaveClass('border-gray-200');
    });

    it('deve aplicar classes customizadas ao footer', () => {
      const { container } = render(
        <CardWithTheme>
          <Card.Footer className="custom-footer">
            Footer
          </Card.Footer>
        </CardWithTheme>
      );
      
      const footer = container.querySelector('.custom-footer');
      expect(footer).toHaveClass('custom-footer');
      expect(footer).toHaveClass('px-6');
      expect(footer).toHaveClass('py-4');
    });

    it('deve renderizar botões e ações no footer', () => {
      render(
        <CardWithTheme>
          <Card.Footer>
            <button>Cancelar</button>
            <button>Confirmar</button>
          </Card.Footer>
        </CardWithTheme>
      );
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      const confirmButton = screen.getByRole('button', { name: /confirmar/i });
      
      expect(cancelButton).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();
    });
  });

  describe('Composição Completa do Card', () => {
    it('deve renderizar card completo com header, body e footer', () => {
      render(
        <CardWithTheme>
          <Card.Header>
            <h3>Título do Card</h3>
          </Card.Header>
          <Card.Body>
            <p>Este é o conteúdo principal do card.</p>
          </Card.Body>
          <Card.Footer>
            <button>Ação</button>
          </Card.Footer>
        </CardWithTheme>
      );
      
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Título do Card');
      expect(screen.getByText('Este é o conteúdo principal do card.')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Ação');
    });

    it('deve funcionar com apenas alguns subcomponentes', () => {
      render(
        <CardWithTheme>
          <Card.Header>Apenas Header</Card.Header>
          <Card.Body>Apenas Body</Card.Body>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Apenas Header')).toBeInTheDocument();
      expect(screen.getByText('Apenas Body')).toBeInTheDocument();
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
    });

    it('deve funcionar com conteúdo direto sem subcomponentes', () => {
      render(
        <CardWithTheme>
          <div>Conteúdo direto</div>
          <p>Sem usar subcomponentes</p>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Conteúdo direto')).toBeInTheDocument();
      expect(screen.getByText('Sem usar subcomponentes')).toBeInTheDocument();
    });
  });

  describe('Estrutura e Hierarquia', () => {
    it('deve manter a ordem correta dos subcomponentes', () => {
      render(
        <CardWithTheme>
          <Card.Header>Header</Card.Header>
          <Card.Body>Body</Card.Body>
          <Card.Footer>Footer</Card.Footer>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('deve permitir aninhamento de cards', () => {
      render(
        <CardWithTheme>
          <Card.Body>
            <CardWithTheme>
              <Card.Body>Card aninhado</Card.Body>
            </CardWithTheme>
          </Card.Body>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Card aninhado')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ser acessível com conteúdo semântico', () => {
      render(
        <CardWithTheme>
          <Card.Header>
            <h2>Título Acessível</h2>
          </Card.Header>
          <Card.Body>
            <p>Descrição acessível do conteúdo.</p>
          </Card.Body>
          <Card.Footer>
            <button aria-label="Confirmar ação">OK</button>
          </Card.Footer>
        </CardWithTheme>
      );
      
      const heading = screen.getByRole('heading', { level: 2 });
      const button = screen.getByLabelText('Confirmar ação');
      
      expect(heading).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('deve suportar atributos ARIA', () => {
      render(
        <CardWithTheme 
          role="article" 
          aria-labelledby="card-title"
        >
          <Card.Header>
            <h2 id="card-title">Título do Artigo</h2>
          </Card.Header>
          <Card.Body>
            Conteúdo do artigo
          </Card.Body>
        </CardWithTheme>
      );
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Título do Artigo');
      expect(screen.getByText('Conteúdo do artigo')).toBeInTheDocument();
    });
  });

  describe('Casos de Uso Práticos', () => {
    it('deve funcionar como card de produto', () => {
      render(
        <CardWithTheme>
          <Card.Header>
            <h3>Produto Exemplo</h3>
            <span>R$ 99,99</span>
          </Card.Header>
          <Card.Body>
            <img src="/produto.jpg" alt="Produto" />
            <p>Descrição do produto aqui.</p>
          </Card.Body>
          <Card.Footer>
            <button>Adicionar ao Carrinho</button>
            <button>Ver Detalhes</button>
          </Card.Footer>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Produto Exemplo')).toBeInTheDocument();
      expect(screen.getByText('R$ 99,99')).toBeInTheDocument();
      expect(screen.getByAltText('Produto')).toBeInTheDocument();
      expect(screen.getByText('Descrição do produto aqui.')).toBeInTheDocument();
      expect(screen.getByText('Adicionar ao Carrinho')).toBeInTheDocument();
      expect(screen.getByText('Ver Detalhes')).toBeInTheDocument();
    });

    it('deve funcionar como card de notificação', () => {
      render(
        <CardWithTheme>
          <Card.Header>
            <strong>Notificação</strong>
            <button aria-label="Fechar">×</button>
          </Card.Header>
          <Card.Body>
            <p>Sua ação foi realizada com sucesso!</p>
          </Card.Body>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Notificação')).toBeInTheDocument();
      expect(screen.getByLabelText('Fechar')).toBeInTheDocument();
      expect(screen.getByText('Sua ação foi realizada com sucesso!')).toBeInTheDocument();
    });

    it('deve funcionar como card de formulário', () => {
      render(
        <CardWithTheme>
          <Card.Header>
            <h2>Login</h2>
          </Card.Header>
          <Card.Body>
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Senha" />
            </form>
          </Card.Body>
          <Card.Footer>
            <button type="submit">Entrar</button>
            <a href="/forgot">Esqueci minha senha</a>
          </Card.Footer>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByText('Esqueci minha senha')).toBeInTheDocument();
    });
  });

  describe('Responsividade e Layout', () => {
    it('deve manter estrutura em diferentes tamanhos', () => {
      const { container } = render(
        <CardWithTheme className="w-full max-w-md">
          <Card.Header>Header Responsivo</Card.Header>
          <Card.Body>Conteúdo que se adapta</Card.Body>
          <Card.Footer>Footer Responsivo</Card.Footer>
        </CardWithTheme>
      );
      
      expect(screen.getByText('Header Responsivo')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo que se adapta')).toBeInTheDocument();
      expect(screen.getByText('Footer Responsivo')).toBeInTheDocument();
    });
  });
});