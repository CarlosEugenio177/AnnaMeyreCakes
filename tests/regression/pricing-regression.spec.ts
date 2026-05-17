import { expect, test } from '@playwright/test';
import { byName, bySlices, getPublicCatalog, numberValue } from '../helpers/api-fixtures';
import { makeOrderPayload } from '../helpers/order-fixtures';

test.describe('pricing regression', () => {
  test('backend calculates cake prices, filling extras, sweets, deposit and remaining totals', async ({ request }) => {
    const catalog = await getPublicCatalog(request);
    const size15 = bySlices(catalog.cakeSizes, 15);
    const size20 = bySlices(catalog.cakeSizes, 20);
    const zeroFillings = catalog.fillings.filter((filling) => numberValue(filling.extraPrice) === 0);
    const morango = byName(catalog.fillings, 'Morango');
    const nutella = byName(catalog.fillings, 'Nutella');
    const traditional = byName(catalog.sweetTypes, 'Docinhos tradicionais');
    const gourmet = byName(catalog.sweetTypes, 'Docinhos gourmet');

    expect(size15.price).toBeDefined();
    expect(size20.price).toBeDefined();

    const firstCakeResponse = await request.post('/orders', {
      data: makeOrderPayload(catalog, {
        customerPhone: `(86) 98888-${String(Date.now()).slice(-4)}`,
        cake: {
          doughId: catalog.doughs[0].publicId,
          cakeSizeId: size15.publicId,
          filling1Id: zeroFillings[0].publicId,
          filling2Id: zeroFillings[1].publicId,
          toppingId: catalog.toppings[0].publicId,
        },
      }),
    });
    expect(firstCakeResponse.ok()).toBeTruthy();
    const firstCake = await firstCakeResponse.json();
    expect(numberValue(firstCake.order.totalPrice)).toBe(numberValue(size15.price));

    const expectedCake20 = numberValue(size20.price) + numberValue(morango.extraPrice) + numberValue(nutella.extraPrice);
    const secondCakeResponse = await request.post('/orders', {
      data: makeOrderPayload(catalog, {
        customerPhone: `(86) 97777-${String(Date.now()).slice(-4)}`,
        cake: {
          doughId: catalog.doughs[0].publicId,
          cakeSizeId: size20.publicId,
          filling1Id: morango.publicId,
          filling2Id: nutella.publicId,
          toppingId: catalog.toppings[0].publicId,
        },
      }),
    });
    expect(secondCakeResponse.ok()).toBeTruthy();
    const secondCake = await secondCakeResponse.json();
    expect(numberValue(secondCake.order.totalPrice)).toBe(expectedCake20);

    const sweetResponse = await request.post('/orders', {
      data: makeOrderPayload(catalog, {
        customerPhone: `(86) 96666-${String(Date.now()).slice(-4)}`,
        cake: {
          doughId: catalog.doughs[0].publicId,
          cakeSizeId: size15.publicId,
          filling1Id: zeroFillings[0].publicId,
          filling2Id: zeroFillings[1].publicId,
          toppingId: catalog.toppings[0].publicId,
        },
        sweets: [
          {
            sweetTypeId: traditional.publicId,
            quantity: 50,
            sweetFlavorIds: traditional.flavors.slice(0, 2).map((flavor) => flavor.publicId),
          },
          {
            sweetTypeId: gourmet.publicId,
            quantity: 30,
            sweetFlavorIds: gourmet.flavors.slice(0, 1).map((flavor) => flavor.publicId),
          },
        ],
      }),
    });
    expect(sweetResponse.ok()).toBeTruthy();
    const sweetOrder = await sweetResponse.json();
    const expectedSweetTotal =
      numberValue(size15.price) +
      (numberValue(traditional.pricePer100) / 100) * 50 +
      (numberValue(gourmet.pricePer100) / 100) * 30;

    expect(numberValue(sweetOrder.order.totalPrice)).toBe(expectedSweetTotal);
    expect(numberValue(sweetOrder.order.depositPrice)).toBe(expectedSweetTotal / 2);
    expect(numberValue(sweetOrder.order.remainingPrice)).toBe(expectedSweetTotal / 2);
  });
});
