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
      baseURL: process.env.E2E_API_URL ?? 'http://localhost:3000',
    });

    const { response, payload } = await createCustomerOrder(context);
    expect(response.ok()).toBeTruthy();

    const meResponse = await context.get('/api/customer/me');
    expect(meResponse.ok()).toBeTruthy();
    const body = await meResponse.json();

    assertNoForbiddenFields(body, {
      allowedFields: [
        'phone',
        'email',
        'address',
        '$.customer.phone',
        '$.customer.email',
        '$.customer.address',
      ],
    });
    expect(body.customer).toEqual({
      name: payload.customerName,
      phone: payload.customerPhone.replace(/\D/g, ''),
      email: payload.customerEmail,
      address: payload.customerAddress,
    });

    await context.dispose();
  });

  test('admin endpoints without admin session return 401 or 403', async ({ request }) => {
    for (const endpoint of ['/admin/orders', '/admin/settings', '/admin/options']) {
      const response = await request.get(endpoint);
      expect([401, 403]).toContain(response.status());

      const body = await response.json().catch(() => ({}));
      assertNoForbiddenFields(body);
    }
  });
});
