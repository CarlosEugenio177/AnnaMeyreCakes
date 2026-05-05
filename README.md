# Anna Meyre Cakes

Sistema fullstack para encomendas da confeitaria Anna Meyre Cakes, com configurador publico de bolo, visualizacao 3D ilustrativa, envio do pedido via WhatsApp e area administrativa para acompanhar pedidos e controlar o status da loja.

## Stack

- Frontend: React, Vite, TypeScript, TailwindCSS
- Estado e formularios: Zustand, React Hook Form, Zod
- 3D: React Three Fiber, Three.js, Drei
- Backend: NestJS, TypeScript, Prisma
- Banco: PostgreSQL
- Auth admin: JWT

## Requisitos

- Node.js 20+
- npm
- PostgreSQL local ou Docker Desktop

## Estrutura

```text
Back-End/     API NestJS, Prisma, migrations e seed
Front-End/    Aplicacao React/Vite
mockup/       Referencias visuais
logo/         Logo original do projeto
documentação/ Documentacao funcional e tecnica
```

## Configurando o backend

Entre na pasta do backend:

```bash
cd Back-End
npm install
```

Crie o arquivo de ambiente:

```bash
copy .env.example .env
```

Edite o `.env` com os dados do seu banco e WhatsApp:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/anna_meyre_cakes?schema=public"
JWT_SECRET="troque-este-segredo"
JWT_EXPIRES_IN="1d"
PORT="3000"
SEED_WHATSAPP_NUMBER="55DDDNUMERO"
SEED_ADMIN_EMAIL="admin@annameyrecakes.local"
SEED_ADMIN_PASSWORD="admin123456"
```

### Banco com Docker

Se tiver Docker Desktop instalado:

```bash
docker compose up -d
```

Use a `DATABASE_URL` do `.env.example`.

### Banco sem Docker

Crie um banco PostgreSQL chamado `anna_meyre_cakes` e ajuste a `DATABASE_URL` com seu usuario e senha.

Depois rode migrations e seed:

```bash
npm run prisma:migrate
npm run prisma:seed
```

Gerar Prisma Client, se necessario:

```bash
npm run prisma:generate
```

Rodar a API em desenvolvimento:

```bash
npm run start:dev
```

A API sobe em:

```text
http://localhost:3000
```

## Configurando o frontend

Em outro terminal:

```bash
cd Front-End
npm install
```

Para uso local no computador, rode:

```bash
npm run dev -- --port 5174
```

Para testar no celular na mesma rede Wi-Fi, crie `Front-End/.env.local`:

```env
VITE_API_URL="http://SEU_IP_LOCAL:3000"
```

Exemplo:

```env
VITE_API_URL="http://192.168.1.140:3000"
```

Rode o Vite expondo na rede:

```bash
npm run dev -- --host 0.0.0.0 --port 5174
```

Abra:

```text
http://localhost:5174
```

Ou no celular:

```text
http://SEU_IP_LOCAL:5174
```

## Build

Backend:

```bash
cd Back-End
npm run build
```

Frontend:

```bash
cd Front-End
npm run build
```

O build do frontend gera a pasta `Front-End/dist/`.

## Testes

Backend:

```bash
cd Back-End
npm run test
```

Com cobertura:

```bash
npm run test:cov
```

## Login admin de desenvolvimento

As credenciais sao criadas pelo seed:

```text
E-mail: admin@annameyrecakes.local
Senha: valor de SEED_ADMIN_PASSWORD
```

Se mudar `SEED_ADMIN_PASSWORD`, rode novamente:

```bash
cd Back-End
npm run prisma:seed
```

## Rotas principais

Publico:

- `GET /catalog`
- `GET /settings`
- `POST /orders`

Admin:

- `POST /auth/login`
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`
- `GET /admin/settings`
- `PATCH /admin/settings`

## Observacoes

- Nao commitar `.env`, `.env.local`, `node_modules`, `dist` ou arquivos `*.tsbuildinfo`.
- O numero de WhatsApp nao fica fixo no frontend; ele vem das configuracoes do backend.
- A loja pode estar `OPEN` ou `CLOSED`. Quando estiver `CLOSED`, o frontend permite navegar, mas bloqueia a finalizacao do pedido.
- O bolo 3D e meramente ilustrativo.
