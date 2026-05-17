import { expect, test } from '@playwright/test';
import { frontendUrl } from '../helpers/frontend';

test.describe('admin auth flow', () => {
  test('invalid login shows error and valid login opens dashboard', async ({ page }) => {
    await page.goto(`${frontendUrl}/admin/login`);
    await page.getByTestId('admin-login-email').fill(process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? 'admin@annameyrecakes.local');
    await page.getByTestId('admin-login-password').fill('senha-errada');
    await page.getByTestId('admin-login-submit').click();
    await expect(page.getByText(/credenciais/i)).toBeVisible();

    await page.getByTestId('admin-login-password').fill(process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'admin123');
    await page.getByTestId('admin-login-submit').click();
    await expect(page.getByTestId('admin-dashboard')).toBeAttached({ timeout: 10_000 });
  });

  test('admin dashboard redirects to login without token', async ({ page }) => {
    await page.goto(`${frontendUrl}/admin/dashboard`);
    await expect(page.getByTestId('admin-login-email')).toBeVisible();
  });
});
