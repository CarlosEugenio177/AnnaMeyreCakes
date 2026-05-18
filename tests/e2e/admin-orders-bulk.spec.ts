import { expect, test } from '@playwright/test';
import { authHeaders, getAdminOrderByCode, loginAdmin } from '../helpers/api-fixtures';
import { frontendUrl } from '../helpers/frontend';
import { createCustomerOrder } from '../helpers/order-fixtures';

test.describe('admin bulk order status flow', () => {
  test('admin selects visible orders and changes status in bulk from the UI', async ({ page, request }) => {
    const suffix = Date.now().toString();
    const first = await createCustomerOrder(request, `${suffix}01`);
    const second = await createCustomerOrder(request, `${suffix}02`);
    expect(first.response.ok()).toBeTruthy();
    expect(second.response.ok()).toBeTruthy();

    const login = await request.post('/admin/login', {
      data: {
        email: process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? 'admin@annameyrecakes.local',
        password: process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'admin123',
      },
    });
    expect(login.ok()).toBeTruthy();
    const session = await login.json();

    await page.addInitScript((adminSession) => {
      window.localStorage.setItem('amc_admin_token', adminSession.accessToken);
      window.localStorage.setItem('amc_admin_user', JSON.stringify(adminSession.user));
    }, session);

    await page.goto(`${frontendUrl}/admin/orders`);
    await page.getByPlaceholder('Buscar por codigo, cliente ou telefone').fill(suffix);
    await expect(page.getByTestId('orders-select-all')).toBeVisible();
    await page.getByTestId('orders-select-all').check();
    await expect(page.getByTestId('bulk-selected-count')).toContainText('2 pedido(s) selecionados');

    await expect(page.getByTestId('bulk-update-status-button')).toBeVisible();
    await page.getByTestId('bulk-update-status-button').dispatchEvent('click');
    await expect(page.getByText('2 pedido(s) atualizados para')).toBeVisible();
    await expect(page.getByTestId('bulk-selected-count')).toBeHidden();
  });

  test('bulk status endpoint requires admin authentication', async ({ request }) => {
    const response = await request.patch('/api/admin/orders/status', {
      data: { orderIds: ['not-authorized'], status: 'IN_PRODUCTION' },
    });

    expect([401, 403]).toContain(response.status());
  });

  test('bulk status endpoint updates selected orders', async ({ request }) => {
    const token = await loginAdmin(request);
    const suffix = Date.now().toString();
    const first = await createCustomerOrder(request, `${suffix}11`);
    const second = await createCustomerOrder(request, `${suffix}12`);
    const firstBody = await first.response.json();
    const secondBody = await second.response.json();
    const firstAdminOrder = await getAdminOrderByCode(request, firstBody.order.orderCode);
    const secondAdminOrder = await getAdminOrderByCode(request, secondBody.order.orderCode);

    const response = await request.patch('/api/admin/orders/status', {
      headers: authHeaders(token),
      data: {
        orderIds: [firstAdminOrder.id, secondAdminOrder.id],
        status: 'IN_PRODUCTION',
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.updatedCount).toBe(2);
    expect(body.orders).toHaveLength(2);
    expect(body.orders.every((order: { status: string }) => order.status === 'IN_PRODUCTION')).toBe(true);
  });
});
