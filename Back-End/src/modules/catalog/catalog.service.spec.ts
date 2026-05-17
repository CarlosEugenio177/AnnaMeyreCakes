import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  it('returns the active catalog groups', async () => {
    const prisma = {
      dough: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'dough-id', name: 'Branca', colorHex: '#fff' },
        ]),
      },
      filling: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'filling-id', name: 'Morango', extraPrice: 30, colorHex: '#f00' },
        ]),
      },
      topping: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'topping-id', name: 'Ninho', colorHex: '#eee' },
        ]),
      },
      cakeSize: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'size-id', slices: 15, price: 140 },
        ]),
      },
      sweetType: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'sweet-id',
            name: 'Tradicional',
            pricePer100: 140,
            flavors: [{ id: 'flavor-id', name: 'Brigadeiro', sweetTypeId: 'sweet-id' }],
          },
        ]),
      },
      $transaction: jest.fn((queries: Promise<unknown>[]) =>
        Promise.all(queries),
      ),
    };

    await expect(
      new CatalogService(prisma as never).getCatalog(),
    ).resolves.toEqual({
      doughs: [{ publicId: 'dough-id', name: 'Branca', colorHex: '#fff' }],
      fillings: [
        {
          publicId: 'filling-id',
          name: 'Morango',
          extraPrice: 30,
          colorHex: '#f00',
        },
      ],
      toppings: [{ publicId: 'topping-id', name: 'Ninho', colorHex: '#eee' }],
      cakeSizes: [{ publicId: 'size-id', slices: 15, price: 140 }],
      sweetTypes: [
        {
          publicId: 'sweet-id',
          name: 'Tradicional',
          pricePer100: 140,
          flavors: [
            {
              publicId: 'flavor-id',
              name: 'Brigadeiro',
              sweetTypePublicId: 'sweet-id',
            },
          ],
        },
      ],
    });
  });
});
