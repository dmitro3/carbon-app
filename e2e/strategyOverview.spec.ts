import { test, expect } from '@playwright/test';

test('Strategy overview snapshot', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.locator('#strategies').isVisible();
  await expect(page).toHaveScreenshot('strategy-overview.png');
});