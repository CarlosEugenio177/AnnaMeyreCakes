import { expect, test } from '@playwright/test';
import { frontendUrl } from '../helpers/frontend';

test.describe('builder flow', () => {
  test('builder loads, selections update summary, and finish button is visible', async ({ page }) => {
    await page.goto(`${frontendUrl}/builder`);

    await expect(page.getByTestId('builder-page')).toBeVisible();
    await expect(page.getByTestId('order-summary')).toBeVisible();
    await expect(page.getByTestId('finish-order-button')).toBeVisible();

    const dough = page.locator('[data-testid^="dough-option-"]').first();
    const size = page.locator('[data-testid^="size-option-"]').nth(1);
    const filling = page.locator('[data-testid^="filling-option-"]').first();
    const secondFilling = page.locator('[data-testid^="filling-option-"]').nth(1);

    await expect(dough).toBeVisible();
    await expect(size).toBeVisible();
    await expect(filling).toBeVisible();

    const totalBefore = await page.getByTestId('order-total').innerText();
    await dough.click();
    await size.click();
    await filling.click();
    await secondFilling.click();
    const totalAfter = await page.getByTestId('order-total').innerText();

    expect(totalAfter).not.toBe('');
    expect(totalAfter).not.toBe(totalBefore);
  });
});
