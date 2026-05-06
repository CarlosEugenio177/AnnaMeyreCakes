# ***🗄️ Documentação de Banco de Dados — Anna Meyre Cakes***

*Este documento descreve a modelagem de dados do sistema **Anna Meyre Cakes**, utilizando **PostgreSQL** e **Prisma ORM**. A estrutura foi desenhada para suportar um catálogo dinâmico, pedidos altamente configuráveis e o controle operacional da confeitaria.*

## ***1\. Visão Geral***

*O banco de dados é o alicerce do sistema, sendo responsável por:*

* ***Catálogo Dinâmico:** Gestão de massas, recheios, coberturas e doces.*  
* ***Configurações Globais:** Controle de status da loja (Singleton pattern) e WhatsApp.*  
* ***Gestão de Pedidos:** Estrutura granular para bolos personalizados e kits de doces.*  
* ***Rastreabilidade:** Histórico de pagamentos e auditoria de regras de negócio (ex: limite de sabores).*

## ***2\. Dicionário de Enums***

*Os Enums garantem a integridade dos dados e padronizam os estados do sistema.*

| *Enum* | *Valores* | *Descrição* |
| :---- | :---- | :---- |
| ***OrderStatus*** | *NEW, WAITING\_DEPOSIT, DEPOSIT\_PAID, CONFIRMED, IN\_PRODUCTION, READY, DELIVERED, CANCELED* | *Fluxo de vida do pedido.* |
| ***ProductType*** | *CAKE, SWEET* | *Diferenciação de itens no pedido.* |
| ***UserRole*** | *OWNER, ADMIN* | *Níveis de acesso administrativo.* |
| ***PaymentMethod*** | *PIX, CASH, CARD, BANK\_TRANSFER, OTHER* | *Métodos aceitos.* |
| ***PaymentStatus*** | *PENDING, PAID, CANCELED* | *Status de cada transação financeira.* |
| ***StoreStatus*** | *OPEN, CLOSED* | *Controle operacional da loja.* |

## ***3\. Estrutura das Tabelas***

### ***3.1 Gestão de Acessos e Clientes***

* ***users:** Utilizadores do painel administrativo.*  
* ***customers:** Registo simplificado de clientes (chave única por telefone).*

### ***3.2 Catálogo (Insumos e Produtos)***

* ***doughs / fillings / toppings:** Tabelas de componentes para bolos com color\_hex para o frontend 3D.*  
* ***cake\_sizes:** Tabela de preços baseada no número de fatias.*  
* ***sweet\_types:** Categorias de docinhos (ex: Brigadeiros Gourmet).*  
* ***sweet\_flavors:** Sabores específicos vinculados a um tipo de doce.*

### ***3.3 Gestão de Pedidos (Arquitetura Granular)***

*A estrutura de pedidos é dividida em três níveis para máxima flexibilidade:*

1. ***orders:** Cabeçalho do pedido com totais e status.*  
2. ***order\_items:** Linhas do pedido (Um bolo, um kit de doces, etc).*  
3. ***Details (cake/sweet):** Especificações técnicas de cada item (FKs para massas, sabores escolhidos, etc).*

### ***3.4 Configurações (Singleton)***

* ***settings:** Tabela com registro único contendo o número do WhatsApp e o status atual da loja.*

## ***4\. Regras de Negócio Implementadas no Esquema***

### ***4.1 Validação de Docinhos (Sweets)***

*O campo max\_flavors é persistido em sweet\_order\_details no momento da criação do pedido.*

* ***30 un:** 1 sabor.*  
* ***50 un:** Até 2 sabores.*  
* ***100 un:** Até 4 sabores.*  
* *A persistência deste valor garante que, mesmo que as regras mudem no futuro, o histórico do pedido reflita a regra vigente na data da compra.*

### ***4.2 Integridade do Bolo***

*A tabela cake\_order\_details impõe a seleção obrigatória de:*

* *1 Massa, 1 Tamanho, 2 Recheios e 1 Cobertura.*

### ***4.3 Controle Operacional***

* *O backend deve consultar settings.store\_status antes de qualquer INSERT na tabela orders.*

## ***5\. Diagrama de Relacionamentos (ER)***

* ***Customer (1) ↔ (N) Orders***  
* ***Order (1) ↔ (N) OrderItems***  
* ***OrderItem (1) ↔ (1) CakeOrderDetails***  
* ***OrderItem (1) ↔ (1) SweetOrderDetails***  
* ***SweetOrderDetails (1) ↔ (N) SweetOrderFlavors***  
* ***Order (1) ↔ (N) PaymentRecords***

## ***6\. Índices e Performance***

*Para garantir a rapidez nas consultas, os seguintes índices e restrições únicas foram definidos:*

* *customers.phone: **UNIQUE** (Identificação rápida do cliente).*  
* *orders.order\_code: **UNIQUE** (Código amigável para rastreamento).*  
* *orders.customer\_id: **INDEX** (Filtragem de histórico do cliente).*  
* *order\_items.order\_id: **INDEX** (Recuperação de itens do pedido).*  
* *sweet\_flavors.sweet\_type\_id: **INDEX** (Listagem de sabores por categoria).*

## ***7\. Decisões de Modelagem***

1. ***Decoupling:** A separação de CakeOrderDetails e SweetOrderDetails evita tabelas com muitos campos nulos (sparse tables).*  
2. ***Auditoria:** O uso de Decimal para preços em vez de Float evita erros de arredondamento financeiro.*  
3. ***Flexibilidade:** A tabela settings permite que o proprietário mude o WhatsApp de atendimento sem necessidade de novo deploy de código.*
