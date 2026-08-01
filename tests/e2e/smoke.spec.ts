import { test, expect } from '@playwright/test';

test.describe('Web Shells Smoke Tests', () => {
  test('1. Root foundation status page loads cleanly', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Transport Platform V2');
    await expect(page.getByText('System Foundation Status')).toBeVisible();
    expect(consoleErrors).toHaveLength(0);
  });

  test('2. Platform Shell loads correctly', async ({ page }) => {
    await page.goto('/platform');
    await expect(page.getByText('Platform Shell')).toBeVisible();
    await expect(page.getByText('Foundation shell — funcionalidad pendiente de Sprint posterior.')).toBeVisible();
  });

  test('3. Transporter Shell loads correctly', async ({ page }) => {
    await page.goto('/operator');
    await expect(page.getByText('Transporter Shell')).toBeVisible();
    await expect(page.getByText('Foundation shell — funcionalidad pendiente de Sprint posterior.')).toBeVisible();
  });

  test('4. Corporate Client Shell loads correctly', async ({ page }) => {
    await page.goto('/client');
    await expect(page.getByText('Corporate Client Shell')).toBeVisible();
    await expect(page.getByText('Foundation shell — funcionalidad pendiente de Sprint posterior.')).toBeVisible();
  });

  test('5. Passenger Shell loads correctly', async ({ page }) => {
    await page.goto('/passenger');
    await expect(page.getByText('Passenger Shell')).toBeVisible();
    await expect(page.getByText('Foundation shell — funcionalidad pendiente de Sprint posterior.')).toBeVisible();
  });

  test('6. 404 page renders for invalid routes', async ({ page }) => {
    await page.goto('/invalid-non-existing-route');
    await expect(page.getByText('404 — Página no encontrada')).toBeVisible();
  });
});
