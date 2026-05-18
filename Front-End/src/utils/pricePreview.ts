import type { Catalog, SweetSelection } from '../types';

export const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: string | number | undefined) {
  return currency.format(toNumber(value));
}

export function toNumber(value: string | number | undefined) {
  if (typeof value === 'number') {
    return value;
  }

  return Number(value ?? 0);
}

export function calculatePricePreview(params: {
  catalog?: Catalog | null;
  cakeSizeId?: string;
  filling1Id?: string;
  filling2Id?: string;
  sweets: SweetSelection[];
}) {
  const { catalog, cakeSizeId, filling1Id, filling2Id, sweets } = params;
  const cakeSize = catalog?.cakeSizes.find((item) => item.id === cakeSizeId);
  const filling1 = catalog?.fillings.find((item) => item.id === filling1Id);
  const filling2 = catalog?.fillings.find((item) => item.id === filling2Id);

  const cakeTotal =
    toNumber(cakeSize?.price) + toNumber(filling1?.extraPrice) + toNumber(filling2?.extraPrice);

  const sweetTotal = sweets.reduce((total, sweet) => {
    const sweetType = catalog?.sweetTypes.find((item) => item.id === sweet.sweetTypeId);
    const unitPrice = toNumber(sweetType?.pricePer100) / 100;
    return total + unitPrice * sweet.quantity;
  }, 0);

  const total = cakeTotal + sweetTotal;
  const deposit = total / 2;

  return {
    cakeTotal,
    sweetTotal,
    total,
    deposit,
    remaining: total - deposit,
  };
}
