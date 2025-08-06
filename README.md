# STG Catalog Challenge

Esse projeto é um desafio prático para vaga de Desenvolvedor (a) FullStack - Com foco em TypeScript e IACODE - STG SOLUCOES DIGITAIS LTDA

Email e senha para testes (Login e senha do projeto e do Gmail - caso queira testar funcionalidades como troca de email, nome ou senha (É necessário entrar no gmail)):

Email - teste054325@gmail.com
senha - @Teste_supabase054325

## ✨ Sobre o Projeto

O **STG Catalog** é um sistema completo de e-commerce desenvolvido como parte do desafio técnico da **STG Company**. A aplicação permite que usuários se autentiquem, naveguem por um catálogo de produtos, adicionem itens ao carrinho e lista de favoritos e finalizem pedidos via **integração com WhatsApp**.

O projeto foi desenvolvido com foco em **modularidade, responsividade e experiência do usuário**, utilizando ferramentas modernas e Inteligência Artificial para acelerar e qualificar o processo de desenvolvimento.

## 🚀 Tecnologias Utilizadas

- **TypeScript** — Tipagem estática robusta para JavaScript
- **React + Next.js (App Router)** — Framework para aplicações web modernas com SSR e rotas seguras
- **Supabase** — Backend-as-a-service (Auth + banco de dados)
- **Tailwind CSS** — Estilização moderna e responsiva com utilitários
- **Lucide React** — Pacote de ícones elegante e leve
- **Vercel** — Deploy instantâneo e otimizado para Next.js
- **WhatsApp API** — Integração para finalização de pedidos via wa.me

## 🤖 IA Utilizada

Durante o desenvolvimento, utilizei ferramentas de Inteligência Artificial de forma estratégica para acelerar o desenvolvimento mantendo alta qualidade:

### **Ferramentas Utilizadas:**

- **ChatGPT (OpenAI)** — 30% do desenvolvimento
  - Geração de prompts otimizados para outras IAs
  - Estruturação inicial de componentes React
  - Auxílio na documentação e README
  - Resolução de problemas específicos de TypeScript

- **DeepSeek** — 25% do desenvolvimento
  - Refatoramento de código para melhor performance
  - Implementação de padrões de design avançados
  - Otimização de queries e estruturas de dados
  - Resolução de bugs complexos

- **TRAE IDE** — 35% do desenvolvimento
  - Suporte de código em tempo real durante toda a codificação
  - Sugestões de melhores práticas React/Next.js
  - Autocomplete inteligente e detecção de erros
  - Estruturação de pastas e arquitetura do projeto

- **Figma AI** — Design e Prototipagem
  - Criação do protótipo visual responsivo
  - Definição de paleta de cores e componentes
  - Layout mobile-first e desktop

### **Código Manual vs IA:**

**Escrito Manualmente (40%):**
- Lógica de negócio específica do e-commerce
- Integração com Supabase e configurações
- Estados complexos e Context API
- Validações e tratamento de erros específicos
- Integração WhatsApp personalizada

**Gerado/Assistido por IA (60%):**
- Estrutura inicial dos componentes
- Estilização com Tailwind CSS
- Tipagens TypeScript complexas
- Padrões de código repetitivos
- Documentação e comentários

**Revisão e Adaptação:**
Todo código gerado por IA foi cuidadosamente revisado, testado e adaptado às necessidades específicas do projeto. A IA acelerou o desenvolvimento, mas a arquitetura e decisões técnicas foram 100% humanas.

Protótipo visual com Figma que serviu de inspiração para a criação do projeto final: [Figma STG E-commerce Protótipo](https://www.figma.com/make/68DP6frWCkJ6elIfsCeyle/STG-E-commerce-Prot%C3%B3tipo?t=ITl7EZuhu8VuKSM6-1)

## ⚡ Como Rodar Localmente

```bash
# 1. Clone o repositório
$ git clone https://github.com/AiltonMazullo/stg-catalog-challenge

# 2. Acesse a pasta do projeto
$ cd stg-catalog-challenge

# 3. Instale as dependências
$ npm install

# 4. Configure variáveis de ambiente (arquivo .env.local)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...

# 5. Rode o projeto localmente
$ npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 🔗 Links Importantes

- [Deploy da Aplicação (Vercel)](https://stg-catalog-challenge.vercel.app)
- [Repositório no GitHub](https://github.com/AiltonMazullo/stg-catalog-challenge)

## 📃 Checklist de Funcionalidades

### 🔒 **Funcionalidades Obrigatórias**

#### ✅ **Sistema de Autenticação Completo (Supabase)**
- [x] **Tela de login e registro:** Formulários com validação completa
- [x] **Autenticação via email/senha:** Sistema robusto do Supabase
- [x] **Logout funcional:** Limpeza completa da sessão
- [x] **Proteção de rotas:** Middleware automático (usuários não logados não acessam o catálogo)
- [x] **Recuperação de senha:** Via email com Supabase Auth (diferencial implementado)
- [x] **Reset de senha:** Fluxo completo de redefinição
- [x] **Persistência de sessão:** Mantém usuário logado
- [x] **Validação de email:** Confirmação obrigatória

#### ✅ **Catálogo de Produtos Funcional**
- [x] **Listagem de produtos:** Grid responsivo com imagem, nome, preço e descrição
- [x] **Busca/filtro por nome:** Sistema de busca em tempo real
- [x] **Visualização detalhada:** Modal com informações completas do produto
- [x] **Adicionar produto ao carrinho:** Botão funcional em cada produto
- [x] **Visualizar carrinho:** Lista com produtos selecionados
- [x] **Interface responsiva:** Design otimizado para desktop e mobile
- [x] **Filtros por categoria:** Filtros dinâmicos funcionais
- [x] **Paginação:** Navegação entre páginas
- [x] **Loading states:** Indicadores visuais de carregamento
- [x] **Tratamento de erros:** Fallbacks para falhas de API

#### ✅ **Carrinho de Compras Completo**
- [x] **Adicionar produtos:** Funcionalidade completa
- [x] **Remover produtos:** Remoção individual e total
- [x] **Alterar quantidades:** Controles + e - funcionais
- [x] **Cálculo de totais:** Subtotal, total e quantidade
- [x] **Persistência:** Mantém carrinho entre sessões
- [x] **Validação de estoque:** Controle de quantidade máxima
- [x] **Estados vazios:** Mensagens quando carrinho vazio

#### ✅ **Finalização via WhatsApp**
- [x] **Botão "Finalizar Pedido":** Disponível no carrinho
- [x] **Gerar mensagem formatada:** Template estruturado com produtos
- [x] **Redirecionar para wa.me:** Link automático com pedido
- [x] **Limpar carrinho após envio:** Funcionalidade implementada
- [x] **Dados do pedido:** Lista completa de produtos
- [x] **Informações de contato:** Dados do usuário incluídos
- [x] **Cálculos corretos:** Valores e quantidades precisos

### 🌟 **Funcionalidades Bônus/Diferenciais**

#### ✅ **Funcionalidades Bônus Implementadas**
- [x] **Histórico de pedidos do usuário:** Sistema completo de registro de compras
- [x] **Lista de desejos além do carrinho:** Sistema completo de favoritos/wishlist
- [x] **Dark mode toggle:** Alternância de tema claro/escuro
- [x] **Filtros avançados (categoria):** Filtros dinâmicos por categoria
- [x] **Interface responsiva avançada:** Mobile-first approach otimizado

#### ✅ **Diferenciais Técnicos Implementados**
- [x] **Context API para gerenciamento de estado global:** Implementado em todo projeto
- [x] **Custom hooks bem estruturados:** Hooks reutilizáveis
- [x] **Error boundary para tratamento de erros:** Tratamento gracioso
- [x] **SEO otimizado (Next.js):** Meta tags e estrutura semântica
- [x] **Performance otimizada:** Lazy loading e memoização
- [x] **TypeScript Strict:** Tipagem rigorosa em 100% do código
- [x] **Middleware personalizado:** Proteção automática de rotas
- [x] **Services Layer:** Separação clara de responsabilidades

#### ✅ **Diferenciais UX/UI Implementados**
- [x] **Skeleton loading durante carregamentos:** Estados de loading elegantes
- [x] **Toast notifications para feedback:** Notificações visuais
- [x] **Animações suaves (Framer Motion):** Transições CSS otimizadas
- [x] **Design responsivo avançado:** Breakpoints otimizados
- [x] **Estados de loading e erro:** Feedback visual completo
- [x] **Busca em tempo real:** Sistema de busca instantânea

## 📁 Estrutura do Projeto

O projeto segue uma arquitetura bem organizada e escalável, com separação clara de responsabilidades:

```
src/
├── app/                          # App Router do Next.js 13+
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── forgot-password/      # Página de recuperação de senha
│   │   ├── login/                # Página de login
│   │   ├── register/             # Página de registro
│   │   └── reset-password/       # Página de redefinição de senha
│   ├── (protected)/              # Grupo de rotas protegidas
│   │   ├── cart/                 # Página do carrinho de compras
│   │   ├── favorite/             # Página de lista de desejos
│   │   ├── orders/               # Página de histórico de pedidos
│   │   ├── products/             # Página do catálogo de produtos
│   │   └── settings/             # Página de configurações do usuário
│   ├── globals.css               # Estilos globais da aplicação
│   ├── layout.tsx                # Layout raiz da aplicação
│   ├── not-found.tsx             # Página 404 personalizada
│   └── page.tsx                  # Página inicial (redirecionamento)
├── components/                   # Componentes reutilizáveis
│   ├── ProtectedRoute.tsx        # HOC para proteção de rotas
│   └── ui/                       # Componentes de interface base
│       ├── button.tsx            # Componente de botão customizado
│       ├── card.tsx              # Componente de card reutilizável
│       └── input.tsx             # Componente de input customizado
├── context/                      # Contextos React para estado global
│   ├── AuthContext.tsx           # Gerenciamento de autenticação
│   ├── CartContext.tsx           # Gerenciamento do carrinho
│   ├── FavoriteList.tsx          # Gerenciamento de favoritos
│   ├── OrderContext.tsx          # Gerenciamento de pedidos
│   └── ThemeContext.tsx          # Gerenciamento de tema (dark/light)
├── middleware.ts                 # Middleware de autenticação do Next.js
├── models/                       # Configurações e modelos de dados
│   └── supabase.ts               # Configuração do cliente Supabase
├── services/                     # Camada de serviços e APIs
│   ├── products.api.ts           # Serviços relacionados a produtos
│   └── user.api.ts               # Serviços relacionados a usuários
└── types/                        # Definições de tipos TypeScript
    └── index.ts                  # Tipos globais da aplicação
```

## 🌌 Observações Finais

Este projeto representa um ecossistema completo de e-commerce, com foco em escalabilidade, usabilidade e uso consciente de Inteligência Artificial. Ele explora diferenciais que enriquecem a experiência do usuário e demonstram meu comprometimento com qualidade.

---

**Desafio Técnico - Ailton Rodrigues Mazullo Neto**  
Desenvolvedor FullStack com foco em **TypeScript e IACODE**  
Email: ailtonrodriguesdev@gmail.com
Telefone: +55 81 992392899