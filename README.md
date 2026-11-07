# Anna Meyre Cakes

Sistema de encomendas da confeitaria Anna Meyre Cakes: o cliente monta o bolo (massa, tamanho, dois recheios, cobertura e docinhos opcionais), o pedido é salvo e enviado pelo WhatsApp, e a confeiteira acompanha tudo em uma área administrativa.

## Stack

- Frontend: React 19, Vite, TypeScript, TailwindCSS, Zustand, React Hook Form, Zod
- Backend: NestJS 11, Prisma 6, PostgreSQL
- Auth admin: JWT (Bearer). Sessão do cliente: cookie httpOnly
- Testes: Jest (unitários do backend) e Playwright (E2E, contrato, segurança, regressão)

## Estrutura

```text
api/           Função serverless da Vercel (encaminha /api/* para o NestJS)
Back-End/      API NestJS, schema Prisma, migrations e seed
Front-End/     Aplicação React/Vite
tests/         Testes Playwright
documentação/  Especificação original do produto
vercel.json    Configuração de build e rotas da Vercel
```

Toda a API fica sob o prefixo `/api`. Em produção, frontend e API são servidos pelo mesmo domínio; em desenvolvimento, o Vite repassa `/api` para o Nest em `localhost:3000`.

## Rodando localmente

Requisito: **apenas Node.js 20+**. Não precisa de Docker nem de PostgreSQL instalado: o projeto usa um PostgreSQL embutido (pacote npm `embedded-postgres`), que roda direto pelo Node e guarda os dados em `.pgdata/`.

Primeira vez:

```bash
npm install
npm --prefix Back-End install
npm --prefix Front-End install
npm run setup
```

O `setup` cria o `Back-End/.env`, sobe o banco local, aplica as migrations e roda o seed (admin, configurações e cardápio). No final ele mostra o login do painel.

Depois, sempre que for trabalhar:

```bash
npm run dev
```

Isso sobe banco, API e frontend juntos (Ctrl+C desliga tudo):

- Loja: http://localhost:5173 (no celular, na mesma rede Wi-Fi: `http://SEU_IP:5173`)
- Painel: http://localhost:5173/gestao (login: `admin@annameyrecakes.local` / `admin123456`, definidos no `Back-End/.env`)
- API: http://localhost:3000/api

Para zerar o banco local, desligue o `npm run dev`, apague a pasta `.pgdata/` e rode `npm run setup` de novo. Se o `DATABASE_URL` do `.env` apontar para outro servidor (ex.: um banco na nuvem), o banco embutido não é iniciado.

## Testes

```bash
npm test                  # unitários do backend (Jest)
npm run test:e2e          # E2E + contrato da API (Playwright)
npm run test:regression
npm run test:security
npm run test:all          # tudo
```

Os testes Playwright precisam do banco migrado e com seed (`npm run setup`). Eles sobem banco, API e frontend sozinhos se não estiverem rodando. Defina `SEED_ADMIN_PASSWORD` (ou `E2E_ADMIN_PASSWORD`) no ambiente com a senha usada no seed.

## Deploy na Vercel

O repositório é publicado como **um único projeto** na Vercel: o frontend vira site estático e a API NestJS roda como função serverless em `/api`. O `vercel.json` já define instalação, build, saída e rotas; não mude o Root Directory (deixe a raiz do repositório).

1. **Banco PostgreSQL:** crie um banco gerenciado (Neon ou Supabase, por exemplo, pelo Marketplace da Vercel). Você vai precisar de duas URLs: uma **com pool** (para a aplicação) e uma **direta** (para as migrations).
2. **Importe o repositório** na Vercel (Add New → Project). O framework fica como "Other", que é o esperado.
3. **Variáveis de ambiente** (Settings → Environment Variables):

   | Variável | Valor |
   | --- | --- |
   | `DATABASE_URL` | URL com pool do banco |
   | `DIRECT_URL` | URL direta do banco |
   | `JWT_SECRET` | um segredo longo e aleatório |
   | `JWT_EXPIRES_IN` | ex.: `1d` |
   | `DEFAULT_WHATSAPP_NUMBER` | número da loja, ex.: `5586999999999` |
   | `VITE_ADMIN_PATH` | caminho secreto do painel, ex.: `/painel-x7k2q9` |

4. **Deploy.** Em deploys de produção o build roda `prisma migrate deploy` automaticamente. Deploys de preview não rodam migrations.
5. **Seed inicial (uma vez):** para criar o usuário admin e o catálogo, rode o seed da sua máquina apontando para o banco de produção:

   ```bash
   cd Back-End
   DATABASE_URL="<url direta>" DIRECT_URL="<url direta>" SEED_ADMIN_EMAIL="voce@email.com" SEED_ADMIN_PASSWORD="<senha forte>" SEED_WHATSAPP_NUMBER="5586999999999" npm run prisma:seed
   ```

   No PowerShell, defina as variáveis antes com `$env:NOME="valor"`.

Depois disso, acesse `https://SEU-DOMINIO` + o valor de `VITE_ADMIN_PATH` para entrar no painel. Salve esse endereço nos favoritos de quem usa o painel.

## Rotas da API

Públicas:

- `GET /api/catalog`
- `GET /api/settings`
- `POST /api/orders`: cria o pedido e abre a sessão do cliente (cookie)

Cliente (cookie de sessão):

- `GET /api/customer/me`
- `GET /api/customer/orders`, `GET /api/customer/orders/:id`, `GET /api/customer/orders/:id/reorder`
- `DELETE /api/customer/session`

Admin (Bearer token):

- `POST /api/auth/login`
- `GET /api/admin/orders`, `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`, `PATCH /api/admin/orders/status` (em lote)
- `POST /api/admin/orders/:id/payments`
- `GET /api/admin/settings`, `PATCH /api/admin/settings`
- `GET /api/admin/options` e CRUD em `/api/admin/options/{doughs,fillings,toppings,cake-sizes,sweet-types,sweet-flavors}`

## Pix da entrada (50%)

Cada pedido gera um **Pix copia-e-cola + QR Code** com o valor exato da entrada, direto na chave Pix da loja (BR Code estático no padrão do Banco Central). Não há gateway nem taxa.

1. No painel, em **Configurações → Pix da entrada**, informe a chave Pix, o nome do recebedor e a cidade.
2. Ao finalizar o pedido, o cliente vê o QR Code e o código para copiar. Ele também encontra o Pix depois, em "Meus pedidos", enquanto a entrada não for confirmada.
3. Quando o dinheiro cair, abra o pedido no painel e clique em **Confirmar entrada**. O status passa para "Entrada paga".

Como o Pix estático não avisa o site sozinho, a confirmação é manual (um clique). Sem Pix configurado, o pagamento é combinado pelo WhatsApp, como antes.

## Painel escondido

O painel não tem nenhum link no site e não fica em `/admin`: ele vive no caminho definido por `VITE_ADMIN_PATH` (padrão `/gestao`, só para desenvolvimento). Quem acessar `/admin` ou qualquer rota desconhecida vê a página inicial, e as telas do painel são marcadas como `noindex` para não aparecerem no Google.

- Em produção, **sempre** defina um `VITE_ADMIN_PATH` próprio e difícil de adivinhar. Por ser uma variável de build, mudar o valor exige um novo deploy.
- Esconder o caminho evita que clientes encontrem a tela, mas a proteção de verdade é o login: todas as rotas `/api/admin/*` exigem token válido.
- Nos testes E2E, use `E2E_ADMIN_PATH` com o mesmo valor (padrão `/gestao`).

## Observações

- O número do WhatsApp não fica no frontend; ele vem das configurações (editáveis no painel).
- Com a loja `CLOSED`, o cliente pode navegar e montar o bolo, mas a finalização fica bloqueada (no frontend e na API).
- Datas de entrega exigem 3 dias de antecedência, calculados no fuso de São Paulo.
- O catálogo pode ser gerenciado pela API admin, mas ainda não existe tela para isso no painel.
- A especificação em `documentação/` prevê uma visualização 3D do bolo que não foi implementada.
