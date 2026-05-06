# Checkpoint do Projeto - Anna Meyre Cakes

Data do checkpoint: 2026-05-04

## Objetivo

Foi criado o frontend mobile-first do sistema **Anna Meyre Cakes**, um cardapio digital e fluxo de encomendas para bolos artesanais. A primeira entrega e um MVP funcional sem backend, permitindo montar um pedido completo e enviar a mensagem formatada pelo WhatsApp.

## Direcao visual usada

- Interface mobile-first, com largura maxima parecida com uma tela de celular.
- No desktop, o app fica centralizado em uma moldura mobile.
- Paleta baseada na marca: creme `#F7F0C8`, vermelho `#E2292F`, rosa claro, branco e cinzas suaves.
- Visual delicado, artesanal, feminino e elegante, seguindo os mockups das pastas `mockup/` e `logo/`.
- Cards arredondados, sombras suaves, bastante respiro vertical e botoes grandes em formato pill.

## Stack implementada

- React
- Vite
- TailwindCSS
- TypeScript

O frontend foi criado em:

```txt
Front-End/
```

## Estrutura principal criada

```txt
Front-End/
  src/
    components/
      Card.tsx
      Logo.tsx
      OptionCard.tsx
      OrderSummary.tsx
      SectionTitle.tsx
      WhatsAppButton.tsx
    data/
      menu.ts
    pages/
      CakeBuilder.tsx
      Home.tsx
    utils/
      price.ts
      whatsapp.ts
    App.tsx
    index.css
    main.tsx
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
```

## Funcionalidades entregues

- Tela inicial com logo, titulo **Monte seu bolo**, subtitulo e botao **Comecar pedido**.
- Formulario de bolo com selecao de massa:
  - Branca
  - Chocolate
  - Mista
- Selecao de tamanho:
  - 15 fatias - R$ 140,00
  - 20 fatias - R$ 180,00
  - 30 fatias - R$ 220,00
  - 40 fatias - R$ 260,00
- Selecao obrigatoria de 2 recheios.
- Regra de adicional automatico:
  - Nutella adiciona R$ 30,00
  - Morango adiciona R$ 30,00
  - Geleia de morango adiciona R$ 30,00
  - Se dois recheios especiais forem escolhidos, soma R$ 60,00
- Selecao de cobertura:
  - Acetato
  - Brigadeiro de chocolate
  - Brigadeiro de ninho
- Aviso visivel: **Nao trabalhamos com chantilly.**
- Docinhos opcionais:
  - 100 docinhos tradicionais - R$ 140,00
  - 100 docinhos gourmet - R$ 180,00
- Dados do cliente:
  - nome
  - WhatsApp
  - data desejada
  - observacoes
- Resumo do pedido com:
  - tipo de pedido
  - massa
  - tamanho
  - recheios
  - cobertura
  - docinhos
  - adicionais
  - valor total
  - entrada de 50%
  - observacoes
- Botao final **Enviar pedido pelo WhatsApp** com link `wa.me`.

## Regras comerciais aplicadas

- Encomendas somente pelo WhatsApp.
- Pagamento de 50% de entrada.
- Pedido deve ser feito ate 3 dias antes.
- Nao trabalha com chantilly.
- Cada bolo tem 3 discos de massa e 2 recheios.

## Numero do WhatsApp

O numero configurado para receber os pedidos esta em:

```txt
Front-End/src/data/menu.ts
```

Constante atual:

```ts
export const WHATSAPP_NUMBER = '558698017387';
```

Esse formato e exigido pelo `wa.me`: codigo do pais + DDD + numero, somente digitos.

Numero humano correspondente:

```txt
+55 86 9801-7387
```

## Arquivos importantes

- `Front-End/src/data/menu.ts`: dados do cardapio e numero do WhatsApp.
- `Front-End/src/utils/price.ts`: calculo de adicional, total e entrada.
- `Front-End/src/utils/whatsapp.ts`: geracao da mensagem e link `wa.me`.
- `Front-End/src/pages/Home.tsx`: tela inicial.
- `Front-End/src/pages/CakeBuilder.tsx`: fluxo completo de montagem do pedido.
- `Front-End/src/components/Logo.tsx`: logo SVG recriada baseada na referencia visual.
- `Front-End/tailwind.config.js`: cores, fontes e sombras da identidade visual.

## Validacoes realizadas

Instalacao de dependencias:

```bash
npm.cmd install
```

Build de producao:

```bash
npm.cmd run build
```

Resultado: build concluido com sucesso.

Tambem foi iniciado um servidor local temporario em `http://localhost:5173`, testado com HTTP 200, e depois desligado a pedido do usuario.

## Como rodar novamente

Entrar na pasta do frontend:

```bash
cd Front-End
```

Instalar dependencias, se necessario:

```bash
npm.cmd install
```

Rodar em desenvolvimento:

```bash
npm.cmd run dev -- --port 5173
```

Abrir no computador:

```txt
http://localhost:5173
```

Para abrir no celular, o celular precisa estar no mesmo Wi-Fi do computador. O IP identificado anteriormente foi:

```txt
http://192.168.1.131:5173
```

Observacao: esse IP pode mudar se a rede reiniciar.

## Observacoes tecnicas

- O projeto nao esta em um repositorio Git inicializado na raiz no momento do checkpoint.
- O build gerou arquivos temporarios de TypeScript, como `tsconfig.tsbuildinfo` e `tsconfig.node.tsbuildinfo`.
- O servidor Vite estava desligado no momento deste checkpoint.
- O arquivo `vite.config.js`/`vite.config.d.ts`, caso apareca no editor, provavelmente foi gerado a partir do build/cache de TypeScript ou tooling; a configuracao fonte editavel e `vite.config.ts`.

## Proximos passos sugeridos

- Revisar se o numero do WhatsApp esta correto no formato final desejado.
- Ajustar textos acentuados se quiser uma versao 100% com acentos na interface e mensagem.
- Criar testes unitarios para `price.ts` e `whatsapp.ts`.
- Adicionar imagens reais de bolos/docinhos se houver material da confeitaria.
- Preparar deploy estatico quando o MVP visual for aprovado.
