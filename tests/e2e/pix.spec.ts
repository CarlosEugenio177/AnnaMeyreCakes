import { expect, test, type APIRequestContext } from '@playwright/test';
import { authHeaders, loginAdmin } from '../helpers/api-fixtures';
import { chooseRequiredCakeOptions, submitOrderAndWait } from '../helpers/builder-actions';
import { frontendUrl } from '../helpers/frontend';
import { createCustomerOrder } from '../helpers/order-fixtures';

const pix = { pixKey: '+5586999990000', pixMerchantName: 'Anna Meyre Cakes', pixMerchantCity: 'Teresina' };

async function setPix(request: APIRequestContext, values: typeof pix | { pixKey: string; pixMerchantName: string; pixMerchantCity: string }) {
  const token = await loginAdmin(request);
  const response = await request.patch('/api/admin/settings', { headers: authHeaders(token), data: values });
  expect(response.ok()).toBeTruthy();
}

// Estes testes alteram a configuracao global de Pix, entao rodam em sequencia.
test.describe.serial('pix deposit', () => {
  test.afterAll(async ({ request }) => {
    await setPix(request, { pixKey: '', pixMerchantName: '', pixMerchantCity: '' });
  });

  test('order response carries a valid Pix copy-and-paste code for the 50% deposit', async ({ request }) => {
    await setPix(request, pix);

    const { response } = await createCustomerOrder(request, `pix-${Date.now()}`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    expect(body.pix.amount).toBe(body.order.depositPrice);
    expect(body.pix.code).toMatch(/^000201/);
    expect(body.pix.code).toContain('br.gov.bcb.pix');
    expect(body.pix.code).toContain(pix.pixKey);
    expect(body.pix.code).toContain(`54${String(body.order.depositPrice.toFixed(2).length).padStart(2, '0')}${body.order.depositPrice.toFixed(2)}`);
    expect(body.pix.code).toMatch(/6304[0-9A-F]{4}$/);
  });

  test('customer sees the Pix QR code on the confirmation screen', async ({ page, request }) => {
    await setPix(request, pix);
    await page.goto(`${frontendUrl}/builder`);
    await chooseRequiredCakeOptions(page);
    await page.getByTestId('contact-name-input').fill('Cliente Pix');
    await page.getByTestId('contact-phone-input').fill('(86) 94444-0009');
    await page.locator('input[type="date"]').fill(futureDate());
    await submitOrderAndWait(page);

    await expect(page.getByTestId('pix-payment')).toBeVisible();
    await expect(page.getByAltText('QR Code do Pix')).toBeVisible();
    await expect(page.getByLabel('Código Pix copia e cola')).toHaveValue(/^000201.*br\.gov\.bcb\.pix/);
    await expect(page.getByTestId('whatsapp-link')).toHaveAttribute('href', /https:\/\/wa\.me\//);
  });

  test('without Pix configured the order has no Pix charge', async ({ request }) => {
    await setPix(request, { pixKey: '', pixMerchantName: '', pixMerchantCity: '' });
    const { response } = await createCustomerOrder(request, `nopix-${Date.now()}`);
    expect((await response.json()).pix).toBeNull();
  });
});

function futureDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}
