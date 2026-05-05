export const sweetQuantities = [30, 50, 100] as const;

export type SweetQuantity = (typeof sweetQuantities)[number];

export function getMaxSweetFlavors(quantity?: number) {
  if (quantity === 30) {
    return 1;
  }
  if (quantity === 50) {
    return 2;
  }
  if (quantity === 100) {
    return 4;
  }

  return 0;
}

export function getSweetRuleText(quantity?: number) {
  const max = getMaxSweetFlavors(quantity);
  return max > 0 ? `${quantity} unidades permitem até ${max} sabor(es).` : 'Escolha 30, 50 ou 100 unidades.';
}
