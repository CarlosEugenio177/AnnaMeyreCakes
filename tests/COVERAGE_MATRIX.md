# Matriz de Cobertura — Anna Meyre Cakes

Esta matriz registra as rotas de frontend e endpoints reais encontrados no projeto, com foco em regressão e segurança.

## Rotas Frontend

| Área | Rota | Tipo | Teste existente | Status |
|------|------|------|----------------|--------|
| Público | `/` | E2E rota | `tests/e2e/frontend-routes.spec.ts` | coberto |
| Público | `/builder` | E2E fluxo | `tests/e2e/builder.spec.ts`, `tests/e2e/frontend-routes.spec.ts` | coberto |
| Cliente | `/meus-pedidos` | E2E rota/histórico | `tests/e2e/customer-orders.spec.ts`, `tests/e2e/frontend-routes.spec.ts` | coberto |
| Admin | `/admin/login` | E2E auth | `tests/e2e/admin-auth.spec.ts` | coberto |
| Admin | `/admin` | E2E rota protegida | `tests/e2e/admin-auth.spec.ts`, `tests/e2e/frontend-routes.spec.ts` | coberto |
| Admin | `/admin/dashboard` | E2E rota protegida | `tests/e2e/admin-auth.spec.ts`, `tests/e2e/frontend-routes.spec.ts` | coberto |
| Admin | `/admin/orders` | E2E rota + bulk status | `tests/e2e/admin-orders-bulk.spec.ts`, `tests/e2e/frontend-routes.spec.ts` | coberto |
| Admin | `/admin/orders/:id` | E2E detalhe | `tests/e2e/frontend-routes.spec.ts` | coberto |
| Admin | `/admin/settings` | E2E rota protegida | `tests/e2e/frontend-routes.spec.ts` | coberto |

## Endpoints Públicos

| Área | Endpoint | Tipo | Teste existente | Status |
|------|----------|------|----------------|--------|
| API Pública | `GET /catalog` | Contrato público legado | `tests/security/api-security.spec.ts` | coberto |
| API Pública | `GET /api/public/catalog` | Contrato/security | `tests/e2e/public-api-security.spec.ts`, `tests/security/api-security.spec.ts`, `tests/regression/catalog-regression.spec.ts` | coberto |
| API Pública | `GET /settings` | Contrato público legado | `tests/security/api-security.spec.ts` | coberto |
| API Pública | `GET /api/public/settings` | Contrato/security | `tests/e2e/public-api-security.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Pedidos | `POST /orders` | E2E/regressão/security | `tests/e2e/customer-session.spec.ts`, `tests/regression/pricing-regression.spec.ts`, `tests/regression/order-regression.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Auth | `POST /auth/login` | E2E frontend admin | `tests/e2e/admin-auth.spec.ts` | coberto |
| Auth | `POST /admin/login` | API auth/admin fixtures | `tests/e2e/admin-crud.spec.ts`, `tests/e2e/admin-orders-bulk.spec.ts`, `tests/security/api-security.spec.ts` | coberto |

## Endpoints Cliente

| Área | Endpoint | Tipo | Teste existente | Status |
|------|----------|------|----------------|--------|
| Cliente | `GET /customer/me` | Sessão frontend | `tests/e2e/customer-session.spec.ts` | coberto |
| Cliente | `GET /api/customer/me` | Contrato/security | `tests/e2e/public-api-security.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Cliente | `DELETE /customer/session` | Logout/cookie | `tests/e2e/customer-session.spec.ts`, `tests/regression/order-regression.spec.ts` | coberto |
| Cliente | `GET /customer/orders` | Histórico | `tests/e2e/customer-orders.spec.ts` | coberto |
| Cliente | `GET /customer/orders/:id` | Isolamento | `tests/security/api-security.spec.ts` | coberto |
| Cliente | `GET /customer/orders/:id/reorder` | Payload de repetir pedido | `tests/security/api-security.spec.ts` | coberto |

## Endpoints Admin

| Área | Endpoint | Tipo | Teste existente | Status |
|------|----------|------|----------------|--------|
| Admin pedidos | `GET /admin/orders` | Auth + UI | `tests/e2e/frontend-routes.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Admin pedidos | `GET /api/admin/orders` | Auth | `tests/e2e/public-api-security.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Admin pedidos | `GET /admin/orders/:id` | Detalhe | `tests/e2e/frontend-routes.spec.ts`, `tests/regression/order-regression.spec.ts` | coberto |
| Admin pedidos | `PATCH /admin/orders/:id/status` | Status individual/security | `tests/security/api-security.spec.ts` | coberto |
| Admin pedidos | `PATCH /admin/orders/status` | Bulk status | `tests/e2e/admin-orders-bulk.spec.ts` | coberto |
| Admin pedidos | `PATCH /api/admin/orders/status` | Bulk status API/security | `tests/e2e/admin-orders-bulk.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Admin pagamentos | `POST /admin/orders/:id/payments` | Security/mass assignment | `tests/security/api-security.spec.ts` | coberto |
| Admin settings | `GET /admin/settings` | Auth/UI | `tests/e2e/frontend-routes.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Admin settings | `PATCH /admin/settings` | Security/mass assignment | `tests/security/api-security.spec.ts` | coberto |
| Admin settings | `GET /api/admin/settings` | Auth | `tests/e2e/public-api-security.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Admin catálogo | `GET /admin/options` | Auth | `tests/security/api-security.spec.ts` | coberto |
| Admin catálogo | `GET /api/admin/options` | Auth | `tests/e2e/public-api-security.spec.ts`, `tests/security/api-security.spec.ts` | coberto |
| Admin massas | `POST/PATCH/DELETE /admin/options/doughs` | CRUD | `tests/e2e/admin-crud.spec.ts`, `tests/regression/catalog-regression.spec.ts` | coberto |
| Admin recheios | `POST/PATCH/DELETE /admin/options/fillings` | CRUD | `tests/security/admin-catalog-crud.spec.ts` | coberto |
| Admin coberturas | `POST/PATCH/DELETE /admin/options/toppings` | CRUD | `tests/security/admin-catalog-crud.spec.ts` | coberto |
| Admin tamanhos | `POST/PATCH/DELETE /admin/options/cake-sizes` | CRUD | `tests/security/admin-catalog-crud.spec.ts` | coberto |
| Admin tipos de docinho | `POST/PATCH/DELETE /admin/options/sweet-types` | CRUD | `tests/security/admin-catalog-crud.spec.ts` | coberto |
| Admin sabores de docinho | `POST/PATCH/DELETE /admin/options/sweet-flavors` | CRUD | `tests/security/admin-catalog-crud.spec.ts` | coberto |

## Observações de Segurança

| Tema | Cobertura | Status |
|------|-----------|--------|
| Endpoint público não vaza campos proibidos | `assertNoForbiddenFields` em `tests/helpers/api-contract.ts` | coberto |
| Admin sem token recebe `401/403` | `public-api-security.spec.ts`, `api-security.spec.ts` | coberto |
| Cliente comum não acessa admin | `api-security.spec.ts` | coberto |
| Cliente não acessa pedido de outro cliente | `api-security.spec.ts` | coberto |
| Pedido público não confia em preço enviado | `pricing-regression.spec.ts`, `api-security.spec.ts` | coberto |
| Opções inativas/IDs inválidos não geram pedido | `catalog-regression.spec.ts`, `api-security.spec.ts` | coberto |
| Cookie do cliente é HTTP-only e opaco | `order-regression.spec.ts`, `api-security.spec.ts` | coberto |
| Cookie admin HTTP-only | O admin atual usa JWT em `localStorage`, não cookie | não aplicável |
| Token adulterado não autentica admin | `frontend-routes.spec.ts` | coberto |
| Mass assignment rejeitado | `api-security.spec.ts` | coberto |
