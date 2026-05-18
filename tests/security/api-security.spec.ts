import { expect, test, type APIRequestContext } from '@playwright/test';
import { assertNoForbiddenFields } from '../helpers/api-contract';
import { authHeaders, ensureStoreOpen, getAdminOrderByCode, getPublicCatalog, loginAdmin } from '../helpers/api-fixtures';
import { createCustomerOrder, makeOrderPayload } from '../helpers/order-fixtures';

const protectedGetEndpoints = [
  '/api/admin/orders',
  '/api/admin/options',
  '/api/admin/settings',
  '/admin/orders',
  '/admin/options',
  '/admin/settings',
];

const dangerousFields = {
  role: 'ADMIN',
  isAdmin: true,
  customerId: 'outro-id',
  adminId: 'x',
  passwordHash: 'x',
  totalPrice: 1,
  createdAt: '2020-01-01',
};

async function createOrderAndReadBody(request: APIRequestContext) {
  const { response } = await createCustomerOrder(request, Date.now().toString());
  expect(response.ok()).toBeTruthy();
  return response.json();
}

test.describe('api security coverage', () => {
  test('all mapped admin read endpoints require admin authentication', async ({ request }) => {
    for (const endpoint of protectedGetEndpoints) {
      const response = await request.get(endpoint);
      expect([401, 403], endpoint).toContain(response.status());
    }
  });

  test('customer session cannot access admin endpoints', async ({ playwright }) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000',
    });
    const { response } = await createCustomerOrder(context, Date.now().toString());
    expect(response.ok()).toBeTruthy();

    for (const endpoint of protectedGetEndpoints) {
      const adminResponse = await context.get(endpoint);
      expect([401, 403], endpoint).toContain(adminResponse.status());
    }

    await context.dispose();
  });

  test('admin mutation endpoints reject dangerous mass-assignment fields', async ({ request }) => {
    const token = await loginAdmin(request);
    const orderBody = await createOrderAndReadBody(request);
    const adminOrder = await getAdminOrderByCode(request, orderBody.order.orderCode);

    const cases = [
      request.patch('/admin/settings', {
        headers: authHeaders(token),
        data: { whatsappNumber: '5586999999999', ...dangerousFields },
      }),
      request.post('/admin/options/doughs', {
        headers: authHeaders(token),
        data: { name: `Massa Segura ${Date.now()}`, colorHex: '#f4caca', ...dangerousFields },
      }),
      request.patch(`/admin/orders/${adminOrder.id}/status`, {
        headers: authHeaders(token),
        data: { status: 'IN_PRODUCTION', ...dangerousFields },
      }),
      request.patch('/api/admin/orders/status', {
        headers: authHeaders(token),
        data: { orderIds: [adminOrder.id], status: 'IN_PRODUCTION', ...dangerousFields },
      }),
      request.post(`/admin/orders/${adminOrder.id}/payments`, {
        headers: authHeaders(token),
        data: { amount: 10, paymentMethod: 'PIX', ...dangerousFields },
      }),
    ];

    for (const pendingResponse of cases) {
      const response = await pendingResponse;
      expect(response.status()).toBe(400);
    }
  });

  test('public order creation rejects mass-assignment and recalculates server price', async ({ request }) => {
    await ensureStoreOpen(request);
    const catalog = await getPublicCatalog(request);
    const payload = makeOrderPayload(catalog, dangerousFields);
    const rejected = await request.post('/orders', { data: payload });
    expect(rejected.status()).toBe(400);

    const accepted = await request.post('/orders', {
      data: makeOrderPayload(catalog, { totalPrice: undefined }),
    });
    expect(accepted.ok()).toBeTruthy();
    const body = await accepted.json();
    assertNoForbiddenFields(body.order);
    expect(Number(body.order.totalPrice)).toBeGreaterThan(1);
  });

  test('inactive and invalid catalog options cannot be used in new orders', async ({ request }) => {
    await ensureStoreOpen(request);
    const token = await loginAdmin(request);
    const catalog = await getPublicCatalog(request);

    const createResponse = await request.post('/admin/options/doughs', {
      headers: authHeaders(token),
      data: { name: `Massa Inativa ${Date.now()}`, colorHex: '#eeeeee', isActive: false },
    });
    expect(createResponse.ok()).toBeTruthy();
    const inactive = await createResponse.json();

    const inactiveResponse = await request.post('/orders', {
      data: makeOrderPayload(catalog, {
        cake: {
          doughId: inactive.id,
          cakeSizeId: catalog.cakeSizes[0].publicId,
          filling1Id: catalog.fillings[0].publicId,
          filling2Id: catalog.fillings[1]?.publicId ?? catalog.fillings[0].publicId,
          toppingId: catalog.toppings[0].publicId,
        },
      }),
    });
    expect([400, 404]).toContain(inactiveResponse.status());

    const invalidResponse = await request.post('/orders', {
      data: makeOrderPayload(catalog, {
        cake: {
          doughId: '00000000-0000-4000-8000-000000000000',
          cakeSizeId: catalog.cakeSizes[0].publicId,
          filling1Id: catalog.fillings[0].publicId,
          filling2Id: catalog.fillings[1]?.publicId ?? catalog.fillings[0].publicId,
          toppingId: catalog.toppings[0].publicId,
        },
      }),
    });
    expect([400, 404]).toContain(invalidResponse.status());
  });

  test('customer can only read their own orders', async ({ playwright }) => {
    const firstContext = await playwright.request.newContext({ baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000' });
    const secondContext = await playwright.request.newContext({ baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000' });

    const first = await createCustomerOrder(firstContext, `${Date.now()}31`);
    const second = await createCustomerOrder(secondContext, `${Date.now()}32`);
    expect(first.response.ok()).toBeTruthy();
    expect(second.response.ok()).toBeTruthy();

    const firstBody = await first.response.json();
    const secondBody = await second.response.json();
    assertNoForbiddenFields(firstBody.order);
    assertNoForbiddenFields(secondBody.order);

    const ownOrders = await firstContext.get('/customer/orders');
    expect(ownOrders.ok()).toBeTruthy();
    assertNoForbiddenFields(await ownOrders.json());

    const ownOrder = await firstContext.get(`/customer/orders/${firstBody.order.publicId}`);
    expect(ownOrder.ok()).toBeTruthy();
    assertNoForbiddenFields(await ownOrder.json());

    const forbidden = await firstContext.get(`/customer/orders/${secondBody.order.publicId}`);
    expect([401, 403, 404]).toContain(forbidden.status());

    await firstContext.dispose();
    await secondContext.dispose();
  });

  test('authenticated customer can read reorder payload only for their own order', async ({ playwright }) => {
    const firstContext = await playwright.request.newContext({ baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000' });
    const secondContext = await playwright.request.newContext({ baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000' });

    const first = await createCustomerOrder(firstContext, `${Date.now()}51`);
    const second = await createCustomerOrder(secondContext, `${Date.now()}52`);
    expect(first.response.ok()).toBeTruthy();
    expect(second.response.ok()).toBeTruthy();

    const firstBody = await first.response.json();
    const secondBody = await second.response.json();

    const ownReorder = await firstContext.get(`/customer/orders/${firstBody.order.publicId}/reorder`);
    expect(ownReorder.ok()).toBeTruthy();

    const foreignReorder = await firstContext.get(`/customer/orders/${secondBody.order.publicId}/reorder`);
    expect([401, 403, 404]).toContain(foreignReorder.status());

    await firstContext.dispose();
    await secondContext.dispose();
  });

  test('customer session cookie is httpOnly, opaque, and tampered cookies do not authenticate', async ({ playwright }) => {
    const context = await playwright.request.newContext({ baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000' });
    const { response, payload } = await createCustomerOrder(context, `${Date.now()}41`);
    expect(response.ok()).toBeTruthy();

    const storage = await context.storageState();
    const cookie = storage.cookies.find((item) => item.name === 'amc_customer_session');
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.value).not.toContain(payload.customerPhone.replace(/\D/g, ''));
    expect(cookie?.value).not.toContain(payload.customerEmail ?? '');

    const tampered = await playwright.request.newContext({
      baseURL: process.env.E2E_API_URL ?? 'http://127.0.0.1:3000',
      extraHTTPHeaders: { Cookie: 'amc_customer_session=token-adulterado' },
    });
    const me = await tampered.get('/api/customer/me');
    expect([401, 403]).toContain(me.status());

    await context.dispose();
    await tampered.dispose();
  });

  test('public DTO endpoints do not leak forbidden fields', async ({ request }) => {
    for (const endpoint of ['/catalog', '/api/public/catalog']) {
      const catalog = await request.get(endpoint);
      expect(catalog.ok(), endpoint).toBeTruthy();
      assertNoForbiddenFields(await catalog.json());
    }

    for (const endpoint of ['/settings', '/api/public/settings']) {
      const settings = await request.get(endpoint);
      expect(settings.ok(), endpoint).toBeTruthy();
      assertNoForbiddenFields(await settings.json());
    }
  });

  test('admin settings endpoints return settings DTO instead of raw singleton record', async ({ request }) => {
    const token = await loginAdmin(request);

    for (const endpoint of ['/admin/settings', '/api/admin/settings']) {
      const response = await request.get(endpoint, {
        headers: authHeaders(token),
      });
      expect(response.ok(), endpoint).toBeTruthy();
      const body = await response.json();
      expect(Object.keys(body).sort()).toEqual(['storeStatus', 'whatsappNumber']);
      assertNoForbiddenFields(body);
    }
  });
});
