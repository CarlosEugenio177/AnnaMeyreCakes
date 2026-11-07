import { expect, test } from '@playwright/test';
import { adminUrl, frontendUrl } from '../helpers/frontend';

test.describe('admin auth flow', () => {
  test('invalid login shows error and valid login opens dashboard', async ({ page }) => {
    await page.goto(`${adminUrl}/login`);
    await page.getByTestId('admin-login-email').fill(process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? 'admin@annameyrecakes.local');
    await page.getByTestId('admin-login-password').fill('senha-errada');
    await page.getByTestId('admin-login-submit').click();
    await expect(page.getByText(/credenciais/i)).toBeVisible();

    await page.getByTestId('admin-login-password').fill(process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'admin123');
    await page.getByTestId('admin-login-submit').click();
    await expect(page.getByTestId('admin-dashboard')).toBeAttached({ timeout: 10_000 });
  });

  test('admin dashboard redirects to login without token', async ({ page }) => {
    await page.goto(`${adminUrl}`);
    await expect(page.getByTestId('admin-login-email')).toBeVisible();
  });

  test('admin panel is not reachable from public pages or the old /admin route', async ({ page }) => {
    await page.goto(`${frontendUrl}/`);
    expect(await page.locator('a[href*="admin"], a[href*="gestao"]').count()).toBe(0);
    await expect(page.getByRole('button', { name: /admin/i })).toHaveCount(0);

    for (const path of ['/admin', '/admin/login', '/admin/orders']) {
      await page.goto(`${frontendUrl}${path}`);
      await expect(page.getByRole('heading', { name: /monte seu bolo/i })).toBeVisible();
      await expect(page.getByTestId('admin-login-email')).toHaveCount(0);
    }
  });

  test('admin pages are marked as noindex', async ({ page }) => {
    await page.goto(adminUrl);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });
});
