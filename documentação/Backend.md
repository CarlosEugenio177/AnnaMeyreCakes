# **🚀 Documentação do Backend — Anna Meyre Cakes (Refatorado)**

Esta documentação define a arquitetura e implementação da API REST do sistema **Anna Meyre Cakes**, construída com NestJS. O backend centraliza as regras de negócio, validação de pedidos, gestão de catálogo e controlo operacional da loja.

## **1\. Stack Tecnológica**

* **Framework:** NestJS (Arquitetura modular)  
* **Linguagem:** TypeScript  
* **ORM:** Prisma  
* **Banco de Dados:** PostgreSQL  
* **Autenticação:** Passport.js \+ JWT  
* **Validação:** class-validator \+ class-transformer

## **2\. Estrutura de Pastas**

src/  
├── common/                \# Decorators, Filters, Guards, Interceptors, Pipes  
├── prisma/                \# Prisma Service e Configurações  
├── modules/                 
│   ├── auth/              \# Gestão de acesso (JWT)  
│   ├── users/             \# Utilizadores Administrativos  
│   ├── catalog/           \# Produtos e Insumos (Bolos e Doces)  
│   ├── orders/            \# Núcleo de Pedidos e Lógica de Preços  
│   ├── payments/          \# Registo de Pagamentos  
│   └── settings/          \# Configurações Globais (WhatsApp/Status)  
├── main.ts                  
└── app.module.ts          

## **3\. Módulos do Sistema**

### **3.1 CatalogModule**

Gere as opções disponíveis para o cliente no frontend:

* **Componentes do Bolo:** Massas (doughs), Recheios (fillings), Coberturas (toppings) e Tamanhos (cake\_sizes).  
* **Insumos:** color\_hex (para o modelo 3D) e extra\_price (para adicionais de recheios).

### **3.2 OrdersModule (O Coração do Sistema)**

Responsável por processar a intenção de compra do cliente.

* **Validação:** Verifica se a loja está OPEN antes de processar.  
* **Cálculo de Preço:**  
* Preço Final \= Preço Base (Tamanho) \+ Extra (Recheio 1\) \+ Extra (Recheio 2\).

### **3.3 SettingsModule**

Gerencia o estado global de operação da loja para evitar *hardcoding*:

* **whatsappNumber:** Número destino para notificações.  
* **storeStatus:** Switch global OPEN/CLOSED.

## **4\. Regras de Negócio**

### **4.1 Configuração Obrigatória (Bolo)**

Para um pedido ser válido, deve conter exatamente:

* 1 Massa, 1 Tamanho, 2 Recheios e 1 Cobertura.  
* **Restrição:** Proibido o uso de recheio tipo "chantilly" em camadas internas (regra de exemplo).

### **4.2 Lógica de Docinhos (Sweets)**

A validação de sabores é feita com base na quantidade total comprada:

* **30 un:** Máximo 1 sabor.  
* **50 un:** Máximo 2 sabores.  
* **100 un:** Máximo 4 sabores.

### **4.3 Controle de Fluxo (Store Status)**

Qualquer tentativa de POST /orders deve consultar o SettingsService. Se storeStatus \=== "CLOSED", a API deve retornar 403 Forbidden ou 400 Bad Request com a mensagem: "Loja fechada".

## **5\. Definição de Endpoints**

### **🌐 Áreas Públicas**

| Método | Endpoint | Descrição |
| :---- | :---- | :---- |
| GET | /catalog | Lista todo o catálogo (massas, recheios, etc) |
| POST | /orders | Cria um novo pedido após validações |

### **🔐 Áreas Administrativas (Protegidas por JWT)**

| Método | Endpoint | Descrição |
| :---- | :---- | :---- |
| POST | /auth/login | Autentica admin e retorna token |
| GET | /admin/orders | Lista todos os pedidos recebidos |
| PATCH | /admin/settings | Altera status da loja ou número WhatsApp |
| POST | /admin/orders/:id/payments | Regista entrada (50%) ou quitação |

## **6\. Modelagem de Dados (Prisma Schema)**

O banco de dados PostgreSQL utiliza a seguinte estrutura relacional simplificada:

* **settings:** id, whatsapp\_number, store\_status (enum), updated\_at.  
* **orders:** id, customer\_id, total\_price, status, desired\_date.  
* **cake\_order\_details:** FKs para massa, recheios e cobertura selecionados.  
* **payment\_records:** Histórico de transações vinculadas ao pedido.

## **7\. Exemplos de DTOs (Data Transfer Objects)**

### **UpdateSettingsDto**

export enum StoreStatus {  
  OPEN \= "OPEN",  
  CLOSED \= "CLOSED",  
}

export class UpdateSettingsDto {  
  @IsString()  
  whatsappNumber: string;

  @IsEnum(StoreStatus)  
  storeStatus: StoreStatus;  
}

## **8\. Tratamento de Erros**

A API segue os padrões HTTP:

* 400: Erro de validação de DTO (ex: sabores a mais nos docinhos).  
* 403: Loja fechada.  
* 404: Insumo do catálogo não encontrado.  
* 401: Token JWT inválido ou ausente.

## **9\. Scripts Úteis**

* npm run start:dev: Inicia servidor em modo watch.  
* npx prisma migrate dev: Aplica alterações no banco de dados.  
* npx prisma db seed: Popula o banco com as opções iniciais do catálogo.

