# ***🎂 Documentação Unificada do Frontend — Anna Meyre Cakes***

*Este documento define toda a arquitetura, comportamento e experiência do frontend do sistema **Anna Meyre Cakes**, abrangendo a área pública (cliente) e a área administrativa.*

## ***1\. Visão Geral***

*O frontend do Anna Meyre Cakes é uma aplicação web mobile-first, focada em:*

* ***Configuração visual de pedidos:** Interface intuitiva para personalização.*  
* ***Experiência interativa 3D:** Visualização em tempo real do bolo configurado.*  
* ***Integração com WhatsApp:** Finalização de encomendas via API de mensagens.*  
* ***Gestão Administrativa:** Controlo total sobre produtos, configurações e estado da loja.*

## ***2\. Stack Tecnológica***

| *Tecnologia* | *Utilização* |
| :---- | :---- |
| ***React \+ Vite*** | *Framework principal e Tooling (TypeScript)* |
| ***TailwindCSS*** | *Estilização responsiva e utilitária* |
| ***Three.js \+ R3F*** | *Renderização e lógica do modelo 3D do bolo* |
| ***Zustand*** | *Gestão de estado global (Pedidos e Definições)* |
| ***React Hook Form \+ Zod*** | *Gestão de formulários e validação de esquemas* |
| ***Axios*** | *Comunicação com a API Backend* |

## ***3\. Identidade Visual (Design Tokens)***

### ***🎨 Paleta de Cores***

* ***Fundo:** Off-white / Creme (\#FBF7F4)*  
* ***Texto Principal:** Castanho avermelhado (\#8A4B3E)*  
* ***Botão Principal:** Rosa/Vermelho (\#E83F4FB)*  
* ***Bordas/Destaque:** Rosa queimado (\#B56A62)*  
* ***Cards:** Branco (\#FFFDFB)*

### ***🔤 Tipografia***

* ***Títulos:** Playfair Display / Cormorant*  
* ***Corpo de Texto:** Inter / Nunito Sans*

## ***4\. Arquitetura de Componentes e Layout***

*A aplicação utiliza uma estratégia de layouts distintos consoante o dispositivo:*

* ***MobileLayout:** Fluxo vertical contínuo, ideal para ecrãs pequenos.*  
* ***DesktopLayout:** Estrutura em duas colunas (Configurador à esquerda, Preview 3D fixo à direita).*

### ***Componentes Chave***

* *CakeScene: Contentor da cena Three.js.*  
* *CakeModel: Lógica de geometria e materiais dinâmicos do bolo.*  
* *OptionCard: Componente de seleção de sabores e tamanhos.*  
* *StoreStatusBanner: Alerta visual sobre o funcionamento da loja.*

## ***5\. Gestão de Estado (Zustand)***

*O estado da aplicação é dividido entre os dados da encomenda atual e as configurações globais da plataforma.*

*// Exemplo de Estrutura do OrderState*

*type OrderState \= {*

  *selectedDoughId?: string;*

  *selectedCakeSizeId?: string;*

  *selectedFilling1Id?: string;*

  *selectedFilling2Id?: string;*

  *selectedToppingId?: string;*

  *selectedSweetTypeId?: string;*

  *selectedSweetQuantity?: number; // 30, 50, 100*

  *selectedSweetFlavorIds: string\[\];*

  *customerName?: string;*

  *customerPhone?: string;*

  *desiredDate?: string;*

  *updateOrder: (data: Partial\<OrderState\>) \=\> void;*

  *resetOrder: () \=\> void;*

*};*

*// Definições Globais (Settings)*

*type Settings \= {*

  *whatsappNumber: string;*

  *storeStatus: "OPEN" | "CLOSED";*

*};*

## ***6\. Configurações e Visualizador 3D***

### ***Integração API***

*O frontend consome o endpoint GET /admin/settings para determinar:*

1. ***WhatsApp:** O número para onde a mensagem de confirmação será enviada.*  
2. ***Status:** Se a loja está aberta para novos pedidos.*

### ***Lógica do Bolo 3D***

*O modelo é atualizado em tempo real conforme as escolhas no Zustand:*

* ***Massa:** Altera a cor base do modelo.*  
* ***Recheios:** Camadas visíveis em cortes transversais ou transparências.*  
* ***Cobertura:** Altera o topo e as bordas exteriores.*

## ***7\. Regras de Interface e Negócio***

### ***🍬 Regras para Docinhos (Sweets)***

*A quantidade de sabores permitidos varia com a quantidade total:*

* ***30 unidades:** Permite 1 sabor.*  
* ***50 unidades:** Permite até 2 sabores.*  
* ***100 unidades:** Permite até 4 sabores.*

### ***🏪 Controlo da Loja (Store Control)***

| *Estado* | *Comportamento na UI* |
| :---- | :---- |
| ***OPEN*** | *Fluxo normal; Botões de checkout ativos.* |
| ***CLOSED*** | *Exibe StoreStatusBanner; Desativa botão de WhatsApp; Permite navegação mas bloqueia finalização.* |

***Mensagem Padrão:** "No momento não estamos a aceitar encomendas. Volte em breve 💕"*

## ***8\. Fluxo de Finalização de Pedido***

1. ***Validação:** O Zod valida se todos os campos obrigatórios e seleções mínimas foram preenchidos.*  
2. ***Verificação de Status:** Confirma se a loja ainda se encontra OPEN.*  
3. ***Persistência:** Envia um POST /orders para o backend para registo interno.*  
4. ***WhatsApp:***  
   * *Gera a mensagem formatada com todos os detalhes da encomenda.*  
   * *Abre o link: https://wa.me/${whatsappNumber}?text=${messageEncoded}.*

## ***9\. Área Administrativa (/admin)***

*O painel de administração permite a gestão operacional:*

* ***Toggle de Status:** Um componente Switch que altera globalmente o estado da loja.*  
* ***Definições:** Atualização do número de contacto (formato internacional 55...).*  
* ***Segurança:** Apenas utilizadores com permissão ADMIN ou OWNER podem alterar o estado da loja.*

## ***10\. Estrutura de Pastas Sugerida***

*src/*

*├── components/*

*│   ├── cake3d/        \# Lógica R3F e Modelos*

*│   ├── form/          \# Inputs, Selects e Validações*

*│   ├── summary/       \# Resumo da encomenda e preços*

*│   ├── ui/            \# Componentes genéricos (Botões, Cards)*

*│   └── status/        \# StoreStatusBanner*

*├── store/             \# orderStore.ts, settingsStore.ts*

*├── services/          \# api.ts e integração com backend*

*├── pages/             \# Home.tsx, Builder.tsx (Configurador)*

*└── utils/             \# Helpers de WhatsApp e validadores*

## ***11\. UX e Responsividade***

* ***Feedback Visual:** Skeleton loaders durante o carregamento de configurações.*  
* ***Estados de Erro:** Mensagens claras caso a API falhe ou a loja feche durante a navegação.*  
* ***Touch Friendly:** Áreas de clique (touch targets) otimizadas para dispositivos móveis, com pelo menos 44px de altura.*

