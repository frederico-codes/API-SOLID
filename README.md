# API SOLID (Gympass-like)

API REST desenvolvida seguindo os princípios de **SOLID** e **Clean Architecture**, aplicando Domain-Driven Design (DDD) em uma aplicação de check-ins em academias, inspirada no modelo de negócio do Gympass.

## 🚀 Tecnologias

- **[Node.js](https://nodejs.org)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Fastify](https://fastify.dev/)** — framework web
- **[Prisma ORM](https://www.prisma.io/)** — acesso ao banco de dados
- **[PostgreSQL](https://www.postgresql.org/)** — banco de dados relacional
- **[Zod](https://zod.dev/)** — validação de schemas
- **[@fastify/jwt](https://github.com/fastify/fastify-jwt)** — autenticação via JSON Web Token
- **[@fastify/cookie](https://github.com/fastify/fastify-cookie)** — suporte a cookies (refresh token)
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** — hash de senhas
- **[dayjs](https://day.js.org/)** — manipulação de datas
- **[Vitest](https://vitest.dev/)** — testes unitários e E2E
- **[Supertest](https://www.npmjs.com/package/supertest)** — testes de requisições HTTP
- **[tsup](https://tsup.egoist.dev/)** — build para produção
- **[ESLint](https://eslint.org/)** (config `@rocketseat/eslint-config`) — padronização de código
- **Docker** — orquestração do banco de dados

## 📐 Arquitetura

O projeto segue uma arquitetura em camadas, com forte separação de responsabilidades:

```
src/
├── app.ts                  # Configuração da aplicação Fastify (plugins, rotas, error handler)
├── server.ts                # Ponto de entrada HTTP
├── env/                      # Validação de variáveis de ambiente com Zod
├── lib/                      # Bibliotecas compartilhadas (instância do Prisma Client)
├── http/
│   ├── controllers/          # Controllers HTTP organizados por domínio (users, gyms, check-ins)
│   └── middlewares/           # Middlewares (autenticação JWT, verificação de papel/role)
├── repositories/              # Contratos (interfaces) de repositórios + implementações
│   ├── in-memory/              # Implementações em memória (usadas em testes unitários)
│   └── prisma/                  # Implementações com Prisma (usadas em produção/E2E)
├── use-cases/                 # Regras de negócio (Casos de Uso), independentes de framework
│   ├── errors/                  # Erros de domínio customizados
│   └── factories/                # Factories para instanciar casos de uso com suas dependências
└── utils/                     # Funções utilitárias (cálculo de distância, helpers de teste)
```

Essa organização permite:

- **Inversão de dependência**: os casos de uso dependem de interfaces de repositório, não de implementações concretas (Prisma).
- **Testabilidade**: repositórios em memória permitem testes unitários rápidos e isolados do banco de dados.
- **Baixo acoplamento**: controllers HTTP apenas orquestram validação de entrada (Zod) e chamada ao caso de uso correspondente via factory.

## ✨ Funcionalidades

### Usuários

- Cadastro de usuário (`Member` por padrão)
- Autenticação (login) com emissão de **access token** (JWT) e **refresh token** (cookie `httpOnly`)
- Renovação de sessão via refresh token
- Consulta do perfil do usuário autenticado

### Academias (Gyms)

- Cadastro de academia (restrito a usuários com papel **ADMIN**)
- Busca de academias por nome (com paginação)
- Listagem de academias próximas, com base em latitude/longitude

### Check-ins

- Registro de check-in em uma academia (com validação de distância máxima e limite de um check-in por dia)
- Histórico de check-ins do usuário (com paginação)
- Métricas de check-ins do usuário
- Validação de check-in (restrito a usuários com papel **ADMIN**), respeitando prazo máximo de validação

## 🔐 Autenticação e Autorização

- Autenticação via **JWT** (`@fastify/jwt`), com token de acesso de curta duração (`10m`) e refresh token (`7d`) entregue em cookie `httpOnly`.
- Controle de acesso baseado em papéis (**RBAC**) com dois perfis: `ADMIN` e `MEMBER`.
- Middlewares dedicados:
  - `verify-jwt`: garante que o usuário está autenticado.
  - `verify-user-role`: garante que o usuário autenticado possui o papel exigido pela rota.

## 🗄️ Modelo de Dados

Definido em [prisma/schema.prisma](prisma/schema.prisma):

- **User**: `id`, `email`, `name`, `password_hash`, `role` (`ADMIN` | `MEMBER`), `created_at`
- **Gym**: `id`, `title`, `description`, `phone`, `latitude`, `longitude`
- **CheckIn**: `id`, `created_at`, `validated_at`, relacionamento com `User` e `Gym`

## 🧪 Testes

O projeto possui duas suítes de teste, separadas por projeto no Vitest:

- **Unitários** (`unit`): testam os casos de uso isoladamente, utilizando repositórios em memória.
- **E2E** (`e2e`): testam os endpoints HTTP de ponta a ponta, utilizando um banco de dados PostgreSQL real via Prisma (com ambiente de teste dedicado em `prisma/vitest-environment-prisma`).

```bash
# Testes unitários
npm run test
npm run test:watch

# Testes E2E
npm run test:e2e
npm run test:e2e:watch

# Cobertura de testes
npm run test:coverage

# Interface visual do Vitest
npm run test:ui
```

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js
- Docker (para o banco de dados PostgreSQL)

### Passo a passo

1. Clone o repositório e instale as dependências:

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente (crie um arquivo `.env` na raiz do projeto):

   ```env
   DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"
   JWT_SECRET="uma-chave-secreta"
   PORT=3333
   NODE_ENV=dev
   ```

3. Suba o banco de dados PostgreSQL com Docker:

   ```bash
   docker-compose up -d
   ```

4. Execute as migrations do Prisma:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie a aplicação em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

### Build para produção

```bash
npm run build
npm run start
```

## 📜 Scripts disponíveis

| Script                 | Descrição                                             |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`           | Inicia o servidor em modo desenvolvimento (watch mode) |
| `npm run build`         | Gera o build de produção com `tsup`                    |
| `npm run start`         | Executa o build de produção                            |
| `npm run lint`          | Executa o linter                                       |
| `npm run lint:fix`      | Executa o linter e corrige problemas automaticamente   |
| `npm run test`          | Executa os testes unitários                            |
| `npm run test:e2e`      | Executa os testes E2E                                  |
| `npm run test:watch`    | Executa os testes unitários em modo watch              |
| `npm run test:e2e:watch`| Executa os testes E2E em modo watch                    |
| `npm run test:coverage` | Gera relatório de cobertura de testes                  |
| `npm run test:ui`       | Abre a interface visual do Vitest                       |

## 📄 Licença

Este projeto está sob a licença ISC.
