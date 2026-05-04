import { specialFillings, type Filling, type SweetOption, type CakeSize } from '../data/menu';

export const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function calculateFillingExtra(selectedFillings: Filling[]) {
  return selectedFillings.filter((filling) =>
    specialFillings.includes(filling as (typeof specialFillings)[number]),
  ).length * 30;
}

export function calculateOrderTotal(size: CakeSize, selectedFillings: Filling[], sweets: SweetOption | null) {
  const sweetsPrice = sweets?.price ?? 0;

  return size.price + calculateFillingExtra(selectedFillings) + sweetsPrice;
}

export function calculateDeposit(total: number) {
  return total / 2;
}
