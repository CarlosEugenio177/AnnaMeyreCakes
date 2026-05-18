import { expect, test } from '@playwright/test';
import { frontendUrl } from '../helpers/frontend';
import { getAdminOrderByCode } from '../helpers/api-fixtures';
import { createCustomerOrder } from '../helpers/order-fixtures';

async function installAdminSession(page: import('@playwright/test').Page, request: import('@playwright/test').APIRequestContext) {
  const response = await request.post('/admin/login', {
    data: {
      email: process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? 'admin@annameyrecakes.local',
      password: process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'admin123',
    },
  });
  expect(response.ok()).toBeTruthy();
  const session = await response.json();

  await page.addInitScript((adminSession) => {
    window.localStorage.setItem('amc_admin_token', adminSession.accessToken);
    window.localStorage.setItem('amc_admin_user', JSON.stringify(adminSession.user));
  }, session);
}

test.describe('frontend route coverage', () => {
  test.describe.configure({ mode: 'serial' });

  test('public routes render without crashing', async ({ page }) => {
    await page.goto(`${frontendUrl}/`);
    await expect(page.getByRole('heading', { name: /monte seu bolo/i })).toBeVisible();

    await page.goto(`${frontendUrl}/builder`);
    await expect(page.getByTestId('builder-page')).toBeVisible();

    await page.goto(`${frontendUrl}/meus-pedidos`);
    await expect(page.getByRole('heading', { name: /meus pedidos/i })).toBeVisible();
  });

  test('admin routes block visitors and render for authenticated admin', async ({ page, request }) => {
    await page.goto(`${frontendUrl}/admin/orders`);
    await expect(page.getByTestId('admin-login-email')).toBeVisible();

    await installAdminSession(page, request);

    await page.goto(`${frontendUrl}/admin`);
    await expect(page.getByTestId('admin-dashboard')).toBeAttached();

    await page.goto(`${frontendUrl}/admin/orders`);
    await expect(page.getByRole('heading', { name: 'Pedidos' }).nth(1)).toBeVisible();

    await page.goto(`${frontendUrl}/admin/settings`);
    await expect(page.getByRole('heading', { name: 'Configuracoes' }).nth(1)).toBeVisible();
  });

  test('admin order detail route renders for an authenticated admin', async ({ page, request }) => {
    await installAdminSession(page, request);
    const { response } = await createCustomerOrder(request, Date.now().toString());
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    const adminOrder = await getAdminOrderByCode(request, body.order.orderCode);

    await page.goto(`${frontendUrl}/admin/orders/${adminOrder.id}`);
    await expect(page.getByRole('heading', { name: body.order.orderCode }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('tampered admin token does not unlock protected routes', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('amc_admin_token', 'token-adulterado');
      window.localStorage.setItem('amc_admin_user', JSON.stringify({ name: 'Fake', email: 'fake@example.com', role: 'ADMIN' }));
    });

    await page.goto(`${frontendUrl}/admin/orders`);
    await expect(page.getByRole('heading', { name: 'Pedidos' }).nth(1)).toBeVisible();
    await expect(page.getByText(/nao conseguimos carregar/i)).toBeVisible();
  });
});
