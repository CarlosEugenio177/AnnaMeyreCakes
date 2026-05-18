import { expect, test } from '@playwright/test';
import { authHeaders, loginAdmin } from '../helpers/api-fixtures';

test.describe('admin catalog endpoint coverage', () => {
  test('admin can create, update and deactivate each catalog option type', async ({ request }) => {
    const token = await loginAdmin(request);
    const headers = authHeaders(token);
    const suffix = Date.now();

    const filling = await request.post('/admin/options/fillings', {
      headers,
      data: { name: `Recheio Cobertura ${suffix}`, colorHex: '#f7d5dc', extraPrice: 12 },
    });
    expect(filling.ok()).toBeTruthy();
    const fillingBody = await filling.json();
    const fillingUpdate = await request.patch(`/admin/options/fillings/${fillingBody.id}`, {
      headers,
      data: { name: `Recheio Cobertura ${suffix} Editado`, colorHex: '#f7d5dc', extraPrice: 14 },
    });
    expect(fillingUpdate.ok()).toBeTruthy();
    expect((await fillingUpdate.json()).extraPrice).toBeDefined();
    expect((await request.delete(`/admin/options/fillings/${fillingBody.id}`, { headers })).ok()).toBeTruthy();

    const topping = await request.post('/admin/options/toppings', {
      headers,
      data: { name: `Cobertura Cobertura ${suffix}`, colorHex: '#fff1f3' },
    });
    expect(topping.ok()).toBeTruthy();
    const toppingBody = await topping.json();
    expect((await request.patch(`/admin/options/toppings/${toppingBody.id}`, {
      headers,
      data: { name: `Cobertura Cobertura ${suffix} Editada`, colorHex: '#fff1f3' },
    })).ok()).toBeTruthy();
    expect((await request.delete(`/admin/options/toppings/${toppingBody.id}`, { headers })).ok()).toBeTruthy();

    const cakeSize = await request.post('/admin/options/cake-sizes', {
      headers,
      data: { slices: 99, price: 199 },
    });
    expect(cakeSize.ok()).toBeTruthy();
    const cakeSizeBody = await cakeSize.json();
    expect((await request.patch(`/admin/options/cake-sizes/${cakeSizeBody.id}`, {
      headers,
      data: { slices: 99, price: 209 },
    })).ok()).toBeTruthy();
    expect((await request.delete(`/admin/options/cake-sizes/${cakeSizeBody.id}`, { headers })).ok()).toBeTruthy();

    const sweetType = await request.post('/admin/options/sweet-types', {
      headers,
      data: { name: `Docinho Cobertura ${suffix}`, pricePer100: 180 },
    });
    expect(sweetType.ok()).toBeTruthy();
    const sweetTypeBody = await sweetType.json();
    expect((await request.patch(`/admin/options/sweet-types/${sweetTypeBody.id}`, {
      headers,
      data: { name: `Docinho Cobertura ${suffix} Editado`, pricePer100: 190 },
    })).ok()).toBeTruthy();

    const sweetFlavor = await request.post('/admin/options/sweet-flavors', {
      headers,
      data: { name: `Sabor Cobertura ${suffix}`, sweetTypeId: sweetTypeBody.id },
    });
    expect(sweetFlavor.ok()).toBeTruthy();
    const sweetFlavorBody = await sweetFlavor.json();
    expect((await request.patch(`/admin/options/sweet-flavors/${sweetFlavorBody.id}`, {
      headers,
      data: { name: `Sabor Cobertura ${suffix} Editado`, sweetTypeId: sweetTypeBody.id },
    })).ok()).toBeTruthy();
    expect((await request.delete(`/admin/options/sweet-flavors/${sweetFlavorBody.id}`, { headers })).ok()).toBeTruthy();
    expect((await request.delete(`/admin/options/sweet-types/${sweetTypeBody.id}`, { headers })).ok()).toBeTruthy();
  });
});
