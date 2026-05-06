# ***🍰 Arquitetura — Anna Meyre Cakes***

*Este documento detalha a estrutura técnica e as diretrizes de desenvolvimento para o sistema de encomendas da Anna Meyre Cakes, focando em uma experiência interativa e multitelas.*

## ***1\. Visão Geral***

*O **Anna Meyre Cakes** é um sistema web fullstack especializado no gerenciamento de encomendas de confeitaria artesanal.*

*O diferencial competitivo reside na experiência de usuário: o cliente pode configurar seu bolo e visualizá-lo em um **modelo 3D interativo**, que reage em tempo real às escolhas de massa, recheios e coberturas. O sistema é concebido como **mobile-first**, mas possui uma interface desktop robusta em formato de configurador premium.*

## ***2\. Stack Tecnológica***

| *Camada* | *Tecnologias* |
| :---- | :---- |
| ***Frontend*** | *React, Vite, TypeScript, TailwindCSS* |
| ***Gráficos 3D*** | *React Three Fiber (R3F), Three.js* |
| ***Estado*** | *Zustand ou React Context* |
| ***Backend*** | *NestJS, TypeScript* |
| ***Persistência*** | *Prisma ORM, PostgreSQL* |
| ***Segurança*** | *JWT, class-validator, AuthGuard* |
| ***Comunicação*** | *Link de Integração WhatsApp (wa.me)* |

## ***3\. Arquitetura Geral***

*Cliente (Mobile/Desktop)*

        *↓*

*Frontend (React \+ R3F)*

        *↓*

*API (NestJS)*

        *↓*

*Prisma ORM*

        *↓*

*PostgreSQL*

## ***4\. Estratégia Multitelas (Adaptativa)***

*A aplicação utiliza uma base de código única com layouts adaptativos baseados em breakpoints:*

### ***Mobile (Fluxo Guiado)***

* *Foco em rolagem vertical.*  
* *Componentes empilhados: Header → Preview 3D → Etapas de Seleção → Resumo → Botão WhatsApp.*

### ***Desktop (Configurador Premium)***

* *Layout em "Painel de Controle".*  
* ***Esquerda:** Formulário de escolhas com rolagem independente.*  
* ***Direita:** Preview 3D fixo em área nobre, resumo detalhado e ações rápidas.*

## ***5\. O Bolo 3D (React Three Fiber)***

*O componente 3D é o núcleo visual do sistema.*

### ***Comportamentos e Mapeamento***

* ***Massa:** Altera a cor/textura da camada principal do cilindro.*  
* ***Recheios:** Camadas intermediárias visíveis em um "corte" ou representação lateral.*  
* ***Cobertura:** Altera o topo e as bordas externas.*  
* ***Interação:** Rotação automática suave, com suporte a drag-to-rotate no desktop.*

## ***6\. Responsabilidades do Backend (NestJS)***

*O backend atua como a **Fonte da Verdade (Source of Truth)**:*

* ***Catálogo Dinâmico:** Gerencia sabores e preços sem necessidade de alteração no código.*  
* ***Regras de Negócio: Validação da regra de docinhos conforme escala:***  
1. ***30 unidades → 1 sabor***  
2. ***50 unidades → até 2 sabores***  
3. ***100 unidades → até 4 sabores***   
* ***Cálculo de Preços:** Centraliza a lógica de valores para evitar divergências entre front e back.*  
* ***Gestão de Status:** Orquestra o ciclo de vida do pedido.*

***Configurações Dinâmicas:***

* *\- O número de WhatsApp deve ser configurável via painel administrativo.*  
* *\- O sistema não deve depender de valores fixos em código.*  
* *\- O backend deve fornecer esse dado via endpoint de settings.*


## ***6.1 Controle de Operação da Loja***

## **O sistema deve possuir um controle global de status operacional da loja:**

* ## Estados:

* ## OPEN → aceita pedidos

* ## CLOSED → bloqueia pedidos

## 

## **Responsabilidades:**

* ## \- O backend deve impedir a criação de pedidos quando a loja estiver CLOSED.

* ## \- O frontend deve refletir esse estado, bloqueando o botão de envio e exibindo mensagem ao usuário.

* ## \- O estado da loja deve ser configurável via painel administrativo.

## **Controle Operacional:**

* ## \- Gerenciar estado OPEN/CLOSED da loja.

* ## \- Garantir bloqueio de pedidos quando necessário. 

## Esse controle é essencial para gestão de demanda e pausas operacionais. 

## ***7\. Modelo de Dados (Entidades)***

* *users: Usuários administrativos.*  
* *customers: Dados de contato e histórico.*  
* *orders: Cabeçalho (data, totais, status).*  
* *order\_items: Itens do pedido (Bolo ou Docinhos).*  
* *cake\_order\_details: Configuração específica do bolo (massa, recheios).*  
* *sweet\_order\_flavors: Sabores selecionados para os docinhos.*  
* *doughs, fillings, toppings, cake\_sizes: Tabelas de catálogo.*  
* *payment\_records: Histórico de pagamentos (entrada e saldo).*  
* *settings: Configurações globais do sistema (whatsapp\_number, store\_status).*

## ***8\. Módulos e Funcionalidades***

### ***8.1 Docinhos (Regra de Validação)***

*O backend deve garantir que:*

* ***Validação***   
  1. ***30 unidades → 1 sabor***  
  2. ***50 unidades → até 2 sabores***  
  3. ***100 unidades → até 4 sabores*** 

***Qualquer valor fora dessas quantidades deve ser rejeitado pelo backend.***

* *Essa regra é validada no momento da criação do pedido (POST /orders).*

### ***8.2 Pagamentos***

* *Registro obrigatório de **50% de entrada**.*  
* *Fluxo: NEW → WAITING\_DEPOSIT → DEPOSIT\_PAID.*

### ***8.3 Painel Administrativo***

* *Visualização de pedidos em tempo real.*  
* *Gestão de estoque de sabores (ativar/desativar itens do catálogo conforme disponibilidade).*

## ***9\. Fluxo Principal do Pedido***

1. *Cliente configura o produto no frontend (visualizando o 3D).*  
2. *↓*  
3. *Frontend consulta configurações (ex: status da loja e número do WhatsApp).*  
4. *↓*  
5. *Se loja estiver CLOSED:*  
6. *→ Bloqueia envio e informa usuário.*  
7. *↓*  
8. *Frontend envia pedido para API.*  
9. *↓*  
10. *Backend valida regras e status da loja.*  
11. *↓*  
12. *Backend salva o pedido e retorna ID \+ resumo.*  
13. *↓*  
14. *Frontend gera link WhatsApp com número dinâmico.*  
15. *↓*  
16. *Cliente envia mensagem.*  
17. *↓*  
18. *Admin gerencia no painel.* 

## ***10\. Estrutura de Pastas Sugerida***

### ***Frontend***

*src/*

 *├── components/*

 *│    ├── cake3d/      \# Canvas, Lights, Cake Model*

 *│    ├── form/        \# Stepper, Inputs*

 *│    ├── summary/     \# Calculadora visual*

 *├── store/            \# Zustand orderStore*

 *├── services/         \# Axios/API integration*

### ***Backend***

*src/*

 *├── modules/*

 *│    ├── catalog/     \# Sabores, Massas, Preços*

 *│    ├── orders/      \# Lógica de pedidos e validações*

 *│    ├── auth/        \# Segurança Admin*

 *├── prisma/           \# Schema e Migrations*

## ***11\. Endpoints de API (Principais)***

* *GET /catalog: Retorna todas as opções ativas.*  
* *POST /orders: Criação de novo pedido (valida regras e status da loja).*  
* *PATCH /admin/orders/:id/status: Atualização do ciclo de vida.*  
* *POST /auth/login: Acesso administrativo.*  
* *GET /admin/settings: Retorna configurações globais (WhatsApp, status da loja).*  
* *PATCH /admin/settings: Atualiza configurações globais.* 

*Atualizado em: Maio de 2026*

*![][image1]*
