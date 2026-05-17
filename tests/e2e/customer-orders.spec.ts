import { expect, test } from '@playwright/test';
import { chooseRequiredCakeOptions, submitOrderAndWait } from '../helpers/builder-actions';
import { frontendUrl } from '../helpers/frontend';

test.describe('customer orders flow', () => {
  test('authenticated customer sees their order history', async ({ page }) => {
    await page.addInitScript(() => {
      window.open = () => ({ closed: false } as Window);
    });

    await page.goto(`${frontendUrl}/builder`);
    await chooseRequiredCakeOptions(page);
    await page.getByTestId('contact-name-input').fill('Cliente Historico');
    await page.getByTestId('contact-phone-input').fill('(86) 94444-0003');
    await page.getByTestId('contact-email-input').fill('historico@example.com');
    await page.getByTestId('contact-address-input').fill('Rua Historico, 123');
    await page.locator('input[type="date"]').fill(futureDate());
    await submitOrderAndWait(page);
    await expect(page.getByTestId('customer-greeting')).toBeVisible({ timeout: 10_000 });

    await page.getByTestId('customer-orders-link').click();
    await expect(page).toHaveURL(/\/meus-pedidos/);
    await expect(page.getByText(/AMC-/).first()).toBeVisible();
    await expect(page.getByText(/Pedido recebido|Confirmado|Aguardando entrada/).first()).toBeVisible();
    await expect(page.getByText(/Total/).first()).toBeVisible();
  });
});

function futureDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}
