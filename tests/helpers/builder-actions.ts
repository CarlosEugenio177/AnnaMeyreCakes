import { expect, type Page } from '@playwright/test';

export async function chooseRequiredCakeOptions(page: Page) {
  await page.locator('[data-testid^="dough-option-"]').first().click();
  await page.locator('[data-testid^="size-option-"]').first().click();
  await page.locator('[data-testid^="filling-option-"]').nth(0).click();
  await page.locator('[data-testid^="filling-option-"]').nth(13).click();
  await page.locator('[data-testid^="topping-option-"]').first().click();
  await expect(page.getByTestId('order-total')).not.toContainText('R$ 0,00');
}

export async function submitOrderAndWait(page: Page) {
  const orderResponse = page.waitForResponse((response) =>
    response.url().endsWith('/orders') && response.request().method() === 'POST',
  );
  await page.getByTestId('finish-order-button').click();
  await expect((await orderResponse).ok()).toBeTruthy();
}
