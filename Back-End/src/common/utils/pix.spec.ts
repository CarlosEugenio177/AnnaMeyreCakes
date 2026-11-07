import { buildPixPayload } from './pix';

describe('buildPixPayload', () => {
  it('matches the static BR Code example from the Banco Central manual', () => {
    expect(
      buildPixPayload({
        key: '123e4567-e12b-12d1-a456-426655440000',
        merchantName: 'Fulano de Tal',
        merchantCity: 'BRASILIA',
      }),
    ).toBe(
      '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D',
    );
  });

  it('includes amount and a sanitized txid', () => {
    const payload = buildPixPayload({
      key: '+5586999999999',
      merchantName: 'Anna Meyre Cakes',
      merchantCity: 'Teresina',
      amount: 115,
      txid: 'AMC-20261107-8555',
    });

    expect(payload).toContain('5406115.00');
    expect(payload).toContain('0515AMC202611078555');
    expect(payload).toMatch(/6304[0-9A-F]{4}$/);
  });

  it('removes accents and truncates merchant name and city', () => {
    const payload = buildPixPayload({
      key: 'anna@example.com',
      merchantName: 'Confeitaria Anna Meyre Cakes Ltda',
      merchantCity: 'São José do Rio Preto',
    });

    expect(payload).toContain('5925Confeitaria Anna Meyre Ca');
    expect(payload).toContain('6015Sao Jose do Rio');
  });
});
