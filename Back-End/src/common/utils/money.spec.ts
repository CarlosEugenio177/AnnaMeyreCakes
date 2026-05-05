import { Decimal } from '@prisma/client/runtime/library';
import { decimalToNumber, toDecimal } from './money';

describe('money utils', () => {
  it('converts primitive values to Decimal', () => {
    expect(toDecimal(10.5).toNumber()).toBe(10.5);
  });

  it('converts Decimal values to numbers with two decimal precision', () => {
    expect(decimalToNumber(new Decimal(10.555))).toBe(10.56);
  });
});
