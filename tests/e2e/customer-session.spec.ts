import { expect, test } from '@playwright/test';
import { chooseRequiredCakeOptions, submitOrderAndWait } from '../helpers/builder-actions';
import { frontendUrl } from '../helpers/frontend';

test.describe('customer session flow', () => {
  test('new customer order creates session and returning visit is prefilled', async ({ page }) => {
    await page.addInitScript(() => {
      window.open = () => ({ closed: false } as Window);
    });

    await page.goto(`${frontendUrl}/builder`);
    await chooseRequiredCakeOptions(page);
    await page.getByTestId('contact-name-input').fill('Carlos E2E');
    await page.getByTestId('contact-phone-input').fill('(86) 94444-0001');
    await page.getByTestId('contact-email-input').fill('carlos-e2e@example.com');
    await page.getByTestId('contact-address-input').fill('Rua E2E, 123');
    await page.locator('input[type="date"]').fill(futureDate());
    await submitOrderAndWait(page);

    await expect(page.getByTestId('customer-greeting')).toContainText('Carlos E2E', { timeout: 10_000 });
    await page.reload();
    await expect(page.getByTestId('customer-greeting')).toContainText('Carlos E2E');
    await expect(page.getByTestId('contact-name-input')).toHaveValue('Carlos E2E');
    await expect(page.getByTestId('contact-phone-input')).toHaveValue('86944440001');
    await expect(page.getByTestId('customer-orders-link')).toBeVisible();
  });

  test('customer logout removes session and hides greeting', async ({ page }) => {
    await page.addInitScript(() => {
      window.open = () => ({ closed: false } as Window);
    });

    await page.goto(`${frontendUrl}/builder`);
    await chooseRequiredCakeOptions(page);
    await page.getByTestId('contact-name-input').fill('Cliente Logout');
    await page.getByTestId('contact-phone-input').fill('(86) 94444-0002');
    await page.getByTestId('contact-email-input').fill('logout@example.com');
    await page.getByTestId('contact-address-input').fill('Rua Logout, 123');
    await page.locator('input[type="date"]').fill(futureDate());
    await submitOrderAndWait(page);
    await expect(page.getByTestId('customer-greeting')).toBeVisible({ timeout: 10_000 });

    await page.getByTestId('customer-logout-button').click();
    await expect(page.getByTestId('customer-greeting')).toBeHidden();
    const me = await page.request.get('/api/customer/me');
    expect([401, 403]).toContain(me.status());
  });
});

function futureDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}
