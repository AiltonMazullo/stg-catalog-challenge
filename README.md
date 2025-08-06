# STG Catalog Challenge

## ✨ Sobre o Projeto

O **STG Catalog** é um sistema completo de e-commerce desenvolvido como parte do desafio técnico da **STG Company**. A aplicação permite que usuários se autentiquem, naveguem por um catálogo de produtos, adicionem itens ao carrinho e finalizem pedidos via **integração com WhatsApp**.

O projeto foi desenvolvido com foco em **modularidade, responsividade e experiência do usuário**, utilizando ferramentas modernas e Inteligência Artificial para acelerar e qualificar o processo de desenvolvimento.

## 🚀 Tecnologias Utilizadas

- **TypeScript** — Tipagem estática robusta para JavaScript
- **React + Next.js (App Router)** — Framework para aplicações web modernas com SSR e rotas seguras
- **Supabase** — Backend-as-a-service (Auth + banco de dados)
- **Tailwind CSS** — Estilização moderna e responsiva com utilitários
- **Lucide React** — Pacote de ícones elegante e leve
- **Vercel** — Deploy instantâneo e otimizado para Next.js

## 🤖 IA Utilizada

Durante o desenvolvimento, contei com o apoio de ferramentas de Inteligência Artificial para otimizar a produtividade, qualidade do código e design:

- **ChatGPT (OpenAI)** — Geração de Prompts para obter sempre os melhores resultados e auxilio no desenvolvimento do README
- **DeepSeek** — Auxílio na resolução de erros, refatoramento e organização de ideias
- **TRAE IDE** — Suporte de código, estrutura de pastas e boas práticas em tempo real (Usada para substituir o Cursor com - custo e + eficácia)
- **Figma AI** — Protótipo visual do sistema via IA, responsivo e moderno

Protótipo visual com Figma: [Figma STG E-commerce Protótipo](https://www.figma.com/make/68DP6frWCkJ6elIfsCeyle/STG-E-commerce-Prot%C3%B3tipo?t=ITl7EZuhu8VuKSM6-1)

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

### 🔐 Autenticação (Supabase)
- [x] Login com email/senha
- [x] Registro de novos usuários
- [x] Autenticação Registro e Login
- [ ] Logout funcional
- [x] Proteção de rotas privadas
- [ ] Recuperação de senha 

### 🛍️ Catálogo
- [x] Grid responsivo com 12+ produtos
- [x] Busca por filtro e nome
- [x] Visualização detalhada (Nome, descrição, preço, imagem) do produto via modal ao clicar no nome do produto
- [x] Adicionar ao carrinho

### 🛒 Carrinho de Compras
- [x] Listagem dos produtos
- [x] Editar quantidades
- [x] Remover itens
- [ ] Finalizar pedido via WhatsApp

### 📣 Integração WhatsApp
- [ ] Geração de mensagem formatada
- [ ] Redirecionamento automático para wa.me
- [ ] Limpeza do carrinho após envio

### 🕺 Diferenciais Extras
- [ ] Testes Unitários
- [ ] PWA
- [ ] Confirmação de pedido antes do envio
- [x] Design responsivo (mobile/tablet/desktop)
- [x] Dark mode
- [ ] Histórico de pedidos 

## 🌌 Observações Finais

Este projeto representa um ecossistema completo de e-commerce, com foco em escalabilidade, usabilidade e uso consciente de Inteligência Artificial. Ele explora diferenciais que enriquecem a experiência do usuário e demonstram meu comprometimento com qualidade.

---

**Desafio Técnico - Ailton Rodrigues Mazullo Neto**  
Desenvolvedor FullStack com foco em **TypeScript e IACODE**  
Email: ailtonrodriguesdev@gmail.com
Telefone: +55 81 9 9239-2899

