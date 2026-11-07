import { expect, type Page } from '@playwright/test';

export async function chooseRequiredCakeOptions(page: Page) {
  await page.locator('[data-testid^="dough-option-"]').first().click();
  await page.locator('[data-testid^="size-option-"]').first().click();
  // Lista unica de recheios (ja vem com 2 escolhidos): clicar em outro troca o 2o recheio.
  await page.locator('[data-testid^="filling-option-"]').nth(2).click();
  await page.locator('[data-testid^="filling-option-"]').nth(3).click();
  await page.locator('[data-testid^="topping-option-"]').first().click();
  await expect(page.getByTestId('order-total')).not.toContainText('R$ 0,00');
}

export async function submitOrderAndWait(page: Page) {
  const orderResponse = page.waitForResponse((response) =>
    response.url().endsWith('/api/orders') && response.request().method() === 'POST',
  );
  await page.getByTestId('finish-order-button').click();
  await expect((await orderResponse).ok()).toBeTruthy();
  await expect(page.getByTestId('order-confirmation')).toBeVisible();
}
