import { expect, test } from '@playwright/test';
import { assertNoForbiddenFields } from '../helpers/api-contract';
import { createCustomerOrder } from '../helpers/order-fixtures';

test.describe('public API contract security', () => {
  test('GET /api/public/catalog returns only public DTO fields', async ({ request }) => {
    const response = await request.get('/api/public/catalog');

    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    assertNoForbiddenFields(body);
    expect(body.doughs[0]).toEqual(
      expect.objectContaining({
        publicId: expect.any(String),
        name: expect.any(String),
      }),
    );
  });

  test('GET /api/public/settings returns only public settings', async ({ request }) => {
    const response = await request.get('/api/public/settings');

    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    assertNoForbiddenFields(body);
    expect(Object.keys(body).sort()).toEqual(['storeStatus', 'whatsappNumber']);
  });

  test('GET /api/customer/me without session never returns personal data', async ({ request }) => {
    const response = await request.get('/api/customer/me');

    expect([401, 403, 204]).toContain(response.status());

    if (response.status() !== 204) {
      const body = await response.json().catch(() => ({}));
      assertNoForbiddenFields(body);
    }
  });

  test('GET /api/customer/me with session returns only the authenticated customer contact DTO', async ({ playwright }) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000',
    });

    const { response, payload } = await createCustomerOrder(context);
    expect(response.ok()).toBeTruthy();

    for (const endpoint of ['/api/customer/me', '/customer/me']) {
      const meResponse = await context.get(endpoint);
      expect(meResponse.ok(), endpoint).toBeTruthy();
      const body = await meResponse.json();

      assertNoForbiddenFields(body, {
        allowedFields: [
          'phone',
          'email',
          'address',
        ],
      });
      expect(body).toEqual({
        name: payload.customerName,
        phone: payload.customerPhone.replace(/\D/g, ''),
        email: payload.customerEmail,
        address: payload.customerAddress,
      });
    }

    await context.dispose();
  });

  test('admin endpoints without admin session return 401 or 403', async ({ request }) => {
    for (const endpoint of ['/api/admin/orders', '/api/admin/settings', '/api/admin/options']) {
      const response = await request.get(endpoint);
      expect([401, 403]).toContain(response.status());

      const body = await response.json().catch(() => ({}));
      assertNoForbiddenFields(body);
    }

    const bulkResponse = await request.patch('/api/admin/orders/status', {
      data: { orderIds: ['blocked'], status: 'IN_PRODUCTION' },
    });
    expect([401, 403]).toContain(bulkResponse.status());
  });
});
