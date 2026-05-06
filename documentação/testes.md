# **Documento de Testes End-to-End:**

# **Anna Meyre Cakes**

## **1\. Visão Geral**

Este documento define os testes fim-a-fim do sistema Anna Meyre Cakes, cobrindo o fluxo completo entre:

* Frontend  
* Backend  
* Banco de dados  
* Área administrativa  
* WhatsApp

O objetivo é garantir que o cliente consiga montar e enviar um pedido corretamente, e que a administradora consiga gerir a loja, pedidos, catálogo e pagamentos.

## **2\. Stack Recomendada**

* **Playwright**: Para automação de browsers e testes mobile/desktop.  
* **TypeScript**: Tipagem estática para maior robustez dos testes.  
* **PostgreSQL de teste**: Base de dados isolada para evitar poluição de dados reais.  
* **Prisma seed/reset**: Para garantir um estado limpo antes de cada suíte.

## **3\. Escopo dos Testes**

Os testes cobrem: Home pública, Configurador de bolo, Bolo 3D, Docinhos, Checkout, Criação de pedido, WhatsApp, Painel administrativo, Configurações da loja, Pagamentos e Responsividade.

## **4\. Ambientes**

* **Local**: Desenvolvimento.  
* **Test**: Banco isolado para execução de E2E.  
* **Staging**: Validação final antes da produção.

## **5\. Cenários E2E**

### **5.1 Home Pública**

* **CT-01 — Carregar Home**: Validar a presença do logótipo, chamada principal e botão de ação.  
* **CT-02 — Iniciar Pedido**: Verificar se o clique em "Começar pedido" redireciona para o configurador.

### **5.2 Configurações Globais**

* **CT-03 — Loja aberta**: Garantir que o botão de finalizar pedido está disponível se storeStatus \= OPEN.  
* **CT-04 — Loja fechada**: Bloquear pedidos e exibir mensagem de aviso se storeStatus \= CLOSED.  
* **CT-05 — WhatsApp dinâmico**: Validar se o link wa.me utiliza o número configurado no backend.

### **5.3 Configurador de Bolo**

* **CT-06 — Selecionar massa**: A opção deve ficar marcada e o modelo 3D deve refletir a cor.  
* **CT-07 — Selecionar tamanho**: O resumo deve atualizar o preço estimado em tempo real.  
* **CT-08 — Selecionar dois recheios**: O resumo e o modelo 3D (camadas) devem ser atualizados.  
* **CT-09 — Validação de campos**: Impedir finalização sem os campos obrigatórios selecionados.

### **5.4 Bolo 3D**

* **CT-10 — Renderização**: Garantir que o Canvas 3D é carregado com o configurador.  
* **CT-11 — Atualização de Estado**: Validar se o CakeModel reage a mudanças de massa/recheio.

### **5.5 Docinhos**

* **CT-12 — 30 docinhos**: Permitir apenas 1 sabor; bloquear o segundo.  
* **CT-13 — 50 docinhos**: Permitir até 2 sabores; bloquear o terceiro.  
* **CT-14 — 100 docinhos**: Permitir até 4 sabores; bloquear o quinto.

### **5.6 Checkout**

* **CT-15 — Dados do cliente**: Validar obrigatoriedade de Nome, Telefone e Data.  
* **CT-16 — Antecedência mínima**: Bloquear datas com menos de 3 dias de antecedência.  
* **CT-17 — Criar pedido**: Validar o POST /orders e o retorno do orderCode.

### **5.7 WhatsApp**

* **CT-18 — Mensagem formatada**: Validar se a string contém código, nome, data, resumo, valor e sinal de 50%.  
* **CT-19 — Redirecionamento**: Abrir wa.me com a mensagem codificada após sucesso no banco.

### **5.8 Admin — Autenticação**

* **CT-20 — Login Válido**: Garantir acesso ao dashboard após login com credenciais corretas.  
* **CT-21 — Proteção de Rota**: Redirecionar para /login se o utilizador não estiver autenticado.

### **5.9 Admin — Pedidos**

* **CT-22 — Listagem**: Visualizar todos os pedidos existentes no banco.  
* **CT-23 — Status em PT**: Validar se WAITING\_DEPOSIT aparece como "Aguardando entrada".  
* **CT-24 — Atualizar status**: Alterar status no backend e refletir na interface admin.

### **5.10 Admin — Configurações**

* **CT-25 — Alterar WhatsApp**: Salvar novo número e validar uso em novos pedidos.  
* **CT-26/27 — Controle de Loja**: Abrir e fechar a loja e validar impacto imediato no frontend público.

### **5.11 Admin — Catálogo**

* **CT-28 — Desativar item**: Itens desativados não devem aparecer no configurador.  
* **CT-29 — Novo sabor**: Novos cadastros devem aparecer imediatamente no catálogo público.

### **5.12 Admin — Pagamentos**

* **CT-30 — Registrar entrada**: Validar atualização para DEPOSIT\_PAID após registro manual do admin.

### **5.13 Responsividade**

* **CT-31 — Mobile**: Layout vertical e touch targets adequados.  
* **CT-32 — Desktop**: Exibição em colunas (Configurador vs Modelo 3D).

## **6\. Estrutura de Ficheiros**

tests/

  e2e/

    public-home.spec.ts

    cake-builder.spec.ts

    cake-3d.spec.ts

    sweets-rules.spec.ts

    checkout.spec.ts

    whatsapp.spec.ts

    admin-auth.spec.ts

    admin-orders.spec.ts

    admin-settings.spec.ts

    admin-catalog.spec.ts

    admin-payments.spec.ts

    responsive.spec.ts

## **7\. Dados de Teste (Seed)**

A seed de teste deve conter:

* 1 utilizador admin.  
* 1 configuração de settings (Loja OPEN, WhatsApp fake).  
* Catálogo completo: Massas, recheios, coberturas, tamanhos e sabores de docinhos.

## **8\. Boas Práticas**

* Resetar o banco antes de cada suíte importante.  
* Mockar apenas a abertura do WhatsApp (não o backend).  
* Priorizar o fluxo crítico (Caminho Feliz).

## **9\. Critérios de Sucesso**

O sistema é estável quando o cliente cria o pedido, a loja respeita o estado (Open/Closed), as regras de sabores são cumpridas e o admin gere o fluxo financeiro corretamente.

