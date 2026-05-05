import { Decimal } from '@prisma/client/runtime/library';

export function toDecimal(value: number | string | Decimal): Decimal {
  return new Decimal(value);
}

export function decimalToNumber(value: Decimal): number {
  return Number(value.toFixed(2));
}
