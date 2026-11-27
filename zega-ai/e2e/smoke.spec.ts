import { test, expect } from '@playwright/test';

test('about page renders without backend', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: /About Zega-AI/i })).toBeVisible();
});

test('preferences renders language options', async ({ page }) => {
  await page.goto('/preferences');
  await expect(page.getByText('English')).toBeVisible();
});
