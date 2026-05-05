import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  it('returns the active catalog groups', async () => {
    const prisma = {
      dough: { findMany: jest.fn().mockResolvedValue(['dough']) },
      filling: { findMany: jest.fn().mockResolvedValue(['filling']) },
      topping: { findMany: jest.fn().mockResolvedValue(['topping']) },
      cakeSize: { findMany: jest.fn().mockResolvedValue(['size']) },
      sweetType: { findMany: jest.fn().mockResolvedValue(['sweet']) },
      $transaction: jest.fn((queries: Promise<unknown>[]) =>
        Promise.all(queries),
      ),
    };

    await expect(
      new CatalogService(prisma as never).getCatalog(),
    ).resolves.toEqual({
      doughs: ['dough'],
      fillings: ['filling'],
      toppings: ['topping'],
      cakeSizes: ['size'],
      sweetTypes: ['sweet'],
    });
  });
});
