export const WHATSAPP_NUMBER = 'NUMBER_HERE';

export const cakeBases = ['Branca', 'Chocolate', 'Mista'] as const;

export const cakeSizes = [
  { label: '15 fatias', price: 140 },
  { label: '20 fatias', price: 180 },
  { label: '30 fatias', price: 220 },
  { label: '40 fatias', price: 260 },
] as const;

export const fillings = [
  'Brigadeiro branco',
  'Brigadeiro chocolate',
  'Brigadeiro de oreo',
  'Brigadeiro de coco',
  'Brigadeiro de limao',
  'Brigadeiro castanha',
  'Brigadeiro de ninho',
  'Pacoca de amendoim',
  'Romeu e Julieta',
  'Nutella',
  'Morango',
  'Geleia de morango',
] as const;

export const specialFillings = ['Nutella', 'Morango', 'Geleia de morango'] as const;

export const toppings = ['Acetato', 'Brigadeiro de chocolate', 'Brigadeiro de ninho'] as const;

export const sweetOptions = [
  {
    id: 'traditional',
    label: '100 docinhos tradicionais',
    flavors: ['ninho', 'brigadeiro', 'beijinho', 'casadinho'],
    price: 140,
  },
  {
    id: 'gourmet',
    label: '100 docinhos gourmet',
    flavors: [
      'castanha',
      'ninho com Nutella',
      'Romeu e Julieta',
      'torta de limao',
      'uvinha',
      'brigadeiro meio amargo',
    ],
    price: 180,
  },
] as const;

export type CakeBase = (typeof cakeBases)[number];
export type CakeSize = (typeof cakeSizes)[number];
export type Filling = (typeof fillings)[number];
export type Topping = (typeof toppings)[number];
export type SweetOption = (typeof sweetOptions)[number];

export type CustomerData = {
  name: string;
  whatsapp: string;
  desiredDate: string;
  notes: string;
};

export type Order = {
  base: CakeBase;
  size: CakeSize;
  fillings: Filling[];
  topping: Topping;
  sweets: SweetOption | null;
  customer: CustomerData;
};
