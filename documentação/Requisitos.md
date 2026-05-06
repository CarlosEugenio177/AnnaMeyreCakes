# **Documento de Requisitos : Anna Meyre Cakes**

Este documento formaliza os requisitos funcionais e não funcionais do sistema **Anna Meyre Cakes**, estabelecendo as diretrizes para o desenvolvimento da plataforma de encomendas de confeitaria artesanal com visualização 3D.

## **1\. Visão do Produto**

O **Anna Meyre Cakes** é um configurador de encomendas focado na experiência do usuário e na automação do processo de venda. O sistema transforma a escolha de sabores em uma experiência visual interativa, facilitando a tomada de decisão do cliente e organizando a gestão da confeiteira.

## **2\. Perfis de Usuário**

* **Cliente:** Usuário final que acessa o sistema para personalizar e solicitar uma encomenda via celular ou desktop.  
* **Administrador (Confeiteira):** Responsável por gerenciar o catálogo, processar pedidos, alterar status de produção e confirmar pagamentos.

## **3\. Requisitos Funcionais (RF)**

### **3.1 Gestão de Catálogo**

* **RF-01:** O sistema deve listar opções dinâmicas de massas, recheios e coberturas.  
* **RF-02:** O sistema deve permitir o cadastro de tamanhos de bolo com preços específicos.  
* **RF-03:** O sistema deve gerenciar tipos de docinhos (Tradicionais e Gourmet) e seus respectivos sabores.  
* **RF-04:** O Admin deve poder ativar/desativar qualquer item do catálogo instantaneamente.

### **3.2 Configurador de Pedidos**

* **RF-05:** O cliente deve selecionar obrigatoriamente 1 massa, 1 tamanho, 2 recheios e 1 cobertura para bolos.  
* **RF-06:** O cliente deve poder adicionar múltiplos tipos de docinhos ao carrinho.  
* **RF-07:** O sistema deve validar a quantidade mínima e o limite de sabores para docinhos.  
* **RF-08:** O sistema deve calcular automaticamente o valor total, o sinal de 50% e o saldo restante.

### **3.3 Experiência 3D**

* **RF-09:** O sistema deve renderizar um modelo 3D interativo do bolo.  
* **RF-10:** O modelo 3D deve atualizar suas cores e texturas em tempo real conforme as seleções de massa e cobertura.  
* **RF-11:** O sistema deve permitir a rotação do modelo 3D para visualização completa.

### **3.4 Processamento de Pedido e WhatsApp**

* **RF-12:** O sistema deve exigir Nome, Telefone e Data de Entrega do cliente.  
* **RF-13:** O sistema deve salvar o pedido no banco de dados **antes** de redirecionar para o WhatsApp.  
* **RF-14:** O sistema deve gerar um link de WhatsApp (wa.me) com uma mensagem estruturada contendo o código do pedido e o resumo das escolhas.  
* RF-15: O sistema deve respeitar o status operacional da loja (OPEN ou CLOSED).  
* RF-16: Quando a loja estiver CLOSED, o sistema deve impedir a finalização de pedidos.  
* RF-17: O sistema deve exibir uma mensagem informando que a loja está temporariamente fechada.  
* RF-18: O Administrador deve poder alterar o status da loja (OPEN/CLOSED) via painel administrativo.   
* RF-19: O número de WhatsApp utilizado para envio de pedidos deve ser configurável pelo Administrador.  
* RF-20: O sistema não deve utilizar número fixo em código.  
* RF-21: O sistema deve utilizar o número configurado dinamicamente para gerar o link wa.me.


## **4\. Requisitos Não Funcionais (RNF)**

* **RNF-01 (Responsividade):** O sistema deve ser **Mobile-First**, garantindo usabilidade total em smartphones.  
* **RNF-02 (Performance):** O carregamento do motor 3D não deve impedir a interação com o formulário.  
* **RNF-03 (Segurança):** O acesso ao painel administrativo deve ser protegido por autenticação JWT.  
* **RNF-04 (Escalabilidade):** A arquitetura deve permitir a adição de novos produtos (ex: kits festa) sem refatoração do banco.

## **5\. Regras de Negócio (RN)**

### **5.1 Estrutura do Bolo**

* **RN-01:** Cada bolo é composto por 3 discos de massa e 2 camadas de recheio.  
* **RN-02:** Não há opção de cobertura em "Chantilly" no catálogo oficial.  
* **RN-03:** Recheios especiais (ex: Nutella, Morango) possuem um acréscimo fixo ao valor base do tamanho.

### **5.2 Escala de Docinhos**

* **RN-04:** A quantidade mínima para docinhos é de 30 unidades.  
* **RN-05:** As quantidades válidas são 30, 50 ou 100 unidades.  
* **RN-06:** O limite de sabores segue a escala:  
* 30 unidades → 1 sabor.  
* 50 unidades → até 2 sabores.  
* 100 unidades → até 4 sabores. 

### **5.3 Prazos e Pagamentos**

* **RN-06:** A data de entrega deve respeitar uma antecedência mínima de **3 dias**.  
* **RN-07:** Todo pedido exige um pagamento de entrada de **50%** para ser confirmado (status DEPOSIT\_PAID).

### **5.4 Prazos e Pagamentos**

* RN-08: A loja pode estar em estado OPEN ou CLOSED.  
* RN-09: Quando CLOSED, nenhum pedido pode ser criado.  
* RN-10: O bloqueio deve ocorrer tanto no frontend quanto no backend. 


## **6\. Ciclo de Vida do Pedido (Status)**

1. **NEW: Criado pelo cliente.**  
2. **WAITING\_DEPOSIT: Aguardando sinal.**  
3. **DEPOSIT\_PAID: Sinal confirmado.**  
4. **CONFIRMED: Pedido confirmado após validação.**  
5. **IN\_PRODUCTION: Sendo produzido.**  
6. **READY: Pronto para entrega/retirada.**  
7. **DELIVERED: Concluído.**  
8. **CANCELED: Cancelado.** 

## **6\. Exibição de Status (Frontend)** 

Os status são mantidos em inglês no backend, porém devem ser exibidos em português no frontend conforme mapeamento:

1. NEW → Novo  
2. WAITING\_DEPOSIT → Aguardando entrada  
3. DEPOSIT\_PAID → Entrada paga  
4. CONFIRMED → Confirmado  
5. IN\_PRODUCTION → Em produção  
6. READY → Pronto  
7. DELIVERED → Entregue  
8. CANCELED → Cancelado 

## **8\. Critérios de Aceitação (Exemplos)**

### **Caso 1: Validação de Sabores de Docinhos**

* **Dado** que o cliente selecionou 50 docinhos;  
* **Quando** ele tentar selecionar o 3º sabor;  
* **Então** o sistema deve desabilitar as outras opções ou exibir um aviso de "Limite Atingido".

### **Caso 2: Finalização de Pedido**

* **Dado** que todos os campos obrigatórios do bolo e dados pessoais estão preenchidos;  
* **Quando** o cliente clicar em "Finalizar Pedido";  
* **Então** o registro deve ser criado no banco com status NEW e o WhatsApp deve ser aberto em uma nova aba.

### **Caso 3: Loja Fechada**

* ### Dado que a loja está com status CLOSED;

* ### Quando o cliente tentar finalizar um pedido;

* ### Então o sistema deve bloquear a ação e exibir uma mensagem informando que não está aceitando pedidos no momento. 

*Documento Versão 1.0 — Anna Meyre Cakes*

