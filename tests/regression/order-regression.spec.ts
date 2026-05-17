import { expect, test } from '@playwright/test';
import { authHeaders, getPublicCatalog, loginAdmin } from '../helpers/api-fixtures';
import { makeOrderPayload } from '../helpers/order-fixtures';

test.describe('order and session regression', () => {
  test('orders use normalized phone, reuse customer and keep immutable contact snapshots', async ({ request }) => {
    const catalog = await getPublicCatalog(request);
    const token = await loginAdmin(request);
    const suffix = String(Date.now()).slice(-4);
    const phoneA = `(86) 99999-${suffix}`;
    const phoneB = `86 99999 ${suffix}`;

    const firstPayload = makeOrderPayload(catalog, {
      customerName: 'Cliente Snapshot Antigo',
      customerPhone: phoneA,
      customerEmail: `antigo-${suffix}@example.com`,
      customerAddress: 'Endereco antigo',
    });
    const firstResponse = await request.post('/orders', { data: firstPayload });
    expect(firstResponse.ok()).toBeTruthy();
    const firstOrder = (await firstResponse.json()).order;

    const secondPayload = makeOrderPayload(catalog, {
      customerName: 'Cliente Snapshot Novo',
      customerPhone: phoneB,
      customerEmail: `novo-${suffix}@example.com`,
      customerAddress: 'Endereco novo',
    });
    const secondResponse = await request.post('/orders', { data: secondPayload });
    expect(secondResponse.ok()).toBeTruthy();
    const secondOrder = (await secondResponse.json()).order;

    expect(firstOrder.customerId).toBe(secondOrder.customerId);
    expect(secondOrder.customer.name).toBe('Cliente Snapshot Novo');
    expect(firstOrder.contactSnapshot).toEqual(
      expect.objectContaining({
        name: 'Cliente Snapshot Antigo',
        phone: phoneA.replace(/\D/g, ''),
        email: `antigo-${suffix}@example.com`,
        address: 'Endereco antigo',
      }),
    );

    const adminOrderResponse = await request.get(`/admin/orders/${firstOrder.id}`, {
      headers: authHeaders(token),
    });
    expect(adminOrderResponse.ok()).toBeTruthy();
    const adminOrder = await adminOrderResponse.json();
    expect(adminOrder.customer.name).toBe('Cliente Snapshot Novo');
    expect(adminOrder.contactSnapshot.name).toBe('Cliente Snapshot Antigo');
  });

  test('customer session cookie is httpOnly, opaque and invalidated on logout', async ({ playwright }) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000',
    });
    const catalog = await getPublicCatalog(context);

    const response = await context.post('/orders', {
      data: makeOrderPayload(catalog, {
        customerName: 'Cliente Sessao',
        customerPhone: '(86) 95555-1212',
        customerEmail: 'sessao@example.com',
        customerAddress: 'Endereco sessao',
      }),
    });
    expect(response.ok()).toBeTruthy();

    const storage = await context.storageState();
    const cookie = storage.cookies.find((item) => item.name === 'amc_customer_session');
    expect(cookie).toBeTruthy();
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.value).not.toContain('sessao@example.com');
    expect(cookie?.value).not.toContain('955551212');

    const meResponse = await context.get('/api/customer/me');
    expect(meResponse.ok()).toBeTruthy();

    const logoutResponse = await context.delete('/customer/session');
    expect(logoutResponse.ok()).toBeTruthy();

    const afterLogout = await context.get('/api/customer/me');
    expect([401, 403]).toContain(afterLogout.status());
    await context.dispose();
  });
});
