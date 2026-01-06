# Pagana - Agente de Triagem Inteligente com IA

> Solução para o Desafio Técnico: Agente de Triagem Inteligente

O **Pagana** é um sistema *full stack* que implementa um assistente virtual inteligente capaz de realizar a triagem de clientes via chat. Utilizando Inteligência Artificial, o sistema identifica a intenção do usuário, mantém o contexto da conversa e encaminha a solicitação para o setor correto (Vendas, Suporte ou Financeiro), gerando resumos automáticos para os atendentes humanos.

## 🎯 Objetivo do Projeto

Criar um bot de atendimento que atue como uma primeira linha de contato, filtrando e encaminhando as solicitações com base em regras de negócio específicas, garantindo que o cliente seja atendido pelo departamento correto de forma eficiente.

### Funcionalidades Principais (Regras de Negócio)

* **🤖 Coleta de Intenção:** O bot inicia a conversa e identifica o motivo do contato.
* **🗂️ Classificação de Fila:** Encaminha para:
    * *Vendas:* Dúvidas, compras, preços.
    * *Suporte:* Reclamações, erros, problemas técnicos.
    * *Financeiro:* Pagamentos, estornos, notas fiscais, boletos.
* **🔄 Transferência Automática:** Encerra a participação do bot e transfere para um humano após identificar a intenção.
* **📝 Resumo Inteligente:** Gera um resumo do contexto para o atendente humano.
* **🔒 Bloqueio de Contexto:** A IA se recusa a falar sobre assuntos fora do escopo (ex: previsão do tempo), mantendo o foco no atendimento.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando uma arquitetura moderna, focada em performance e tipagem estática.

### Backend (Server)
* **Runtime:** [Bun](https://bun.sh/) (Rápido e compatível com Node.js)
* **Framework:** [Hono](https://hono.dev/) (Leve, rápido e com suporte a WebSockets)
* **Linguagem:** TypeScript
* **Banco de Dados:** MySQL
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **IA:** Google Gemini API (`@google/genai`)
* **WebSockets:** Comunicação em tempo real nativa do Hono.
* **Autenticação:** [Better Auth](https://www.better-auth.com/)

### Frontend (Client)
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Linguagem:** TypeScript
* **Estilos:** Tailwind CSS v4
* **UI Components:** Shadcn/ui (Radix UI)
* **Gerenciamento de Estado:** TanStack Query (React Query)
* **Formulários:** React Hook Form + Zod

### DevOps & Ferramentas
* **Containerização:** Docker & Docker Compose
* **Linting/Formatting:** [Biome](https://biomejs.dev/)

## 🛠️ Instalação e Execução

Você pode rodar o projeto de duas formas: utilizando **Docker** (recomendado) ou manualmente com **Bun**.

### Pré-requisitos
* Git
* Docker e Docker Compose (para execução via containers)
* Bun (caso queira rodar localmente sem Docker)
* Uma chave de API do Google Gemini (IA)

### 1. Configuração das Variáveis de Ambiente

Antes de iniciar, é necessário configurar as variáveis de ambiente.

1.  No diretório `server`, duplique o arquivo `.env.example` para `.env` e preencha os dados:
    ```env
    DATABASE_URL="mysql://user:password@db:3306/pagana" # Se usar Docker
    GEMINI_API_KEY="sua_chave_api_aqui"
    BETTER_AUTH_SECRET="um_segredo_aleatorio"
    BETTER_AUTH_URL="http://localhost:4000" # URL da API
    ```

2.  No diretório `client`, duplique o arquivo `.env.example` para `.env.local`:
    ```env
    NEXT_PUBLIC_API_URL="http://localhost:4000"
    BETTER_AUTH_URL="http://localhost:4000" # URL da API para o auth client
    ```

### 2. Execução com Docker (Recomendado)

Esta opção sobe o Cliente, o Servidor e o Banco de Dados MySQL automaticamente.

```bash
# Na raiz do projeto
docker-compose up --build

```

* **Frontend:** Acesse `http://localhost:3000`
* **Backend:** Acesse `http://localhost:4000`
* **Banco de Dados:** Porta `3306`

> **Nota:** As migrações do banco de dados (Drizzle) são executadas automaticamente ao iniciar o servidor (`server/src/index.ts`).

### 3. Execução Manual (Desenvolvimento)

Caso prefira rodar serviço a serviço:

**Banco de Dados:**
Suba apenas o MySQL pelo Docker:

```bash
docker-compose up db -d

```

**Backend:**

```bash
cd server
bun install
bun run db:migrate # Executar migrações
bun run dev

```

**Frontend:**

```bash
cd client
bun install
bun run dev

```

## 📂 Estrutura do Projeto

```
pagana/
├── client/                 # Frontend em Next.js
│   ├── app/                # Rotas e páginas (App Router)
│   ├── components/         # Componentes UI (Shadcn)
│   ├── lib/                # Utilitários e configurações (Auth client)
│   └── ...
├── server/                 # Backend em Hono
│   ├── drizzle/            # Migrações do Banco de Dados
│   ├── src/
│   │   ├── lib/            # Configurações (Auth, DB, AI)
│   │   ├── messages/       # Módulo de Mensagens (Chat)
│   │   ├── tickets/        # Módulo de Tickets (Atendimentos)
│   │   ├── index.ts        # Ponto de entrada e rotas
│   │   └── socket.ts       # Configuração do WebSocket
│   └── ...
├── compose.yml             # Orquestração Docker
└── README.md

```

## 📡 Documentação da API

O backend expõe as seguintes rotas principais:

### Mensagens & IA

* `POST /api/messages`: Envia uma mensagem do usuário para ser processada pela IA.
* `WS /api/ws`: Conexão WebSocket para troca de mensagens em tempo real.

### Tickets

* `GET /api/tickets`: Lista o histórico de atendimentos/tickets.

### Autenticação

* Rotas gerenciadas pelo **Better Auth** em `/api/auth/*`.

## ✅ Diferenciais Implementados

* **WebSockets:** Utilizados para uma experiência de chat fluida e em tempo real.
* **Docker:** Ambiente totalmente containerizado para fácil reprodução.
* **Monorepo:** Estrutura organizada separando responsabilidades de cliente e servidor.

## 🌐 Deploy em Produção

O projeto esta disponível para testes nos seguintes endereços:

* **Frontend (Vercel):** [https://pagana.vercel.app](https://pagana.vercel.app)
* **Backend (Railway):** [https://pagana-production.up.railway.app](https://pagana-production.up.railway.app)
