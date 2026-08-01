import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Web Shells & Accessibility E2E Smoke Tests', () => {
  const routes = [
    { path: '/', titleSnippet: 'Transport Platform V2' },
    { path: '/platform', titleSnippet: 'Platform Shell' },
    { path: '/operator', titleSnippet: 'Transporter Shell' },
    { path: '/client', titleSnippet: 'Corporate Client Shell' },
    { path: '/passenger', titleSnippet: 'Passenger Shell' },
    { path: '/sign-in', titleSnippet: 'Iniciar Sesión' },
  ];

  for (const { path, titleSnippet } of routes) {
    test(`Route "${path}" loads cleanly, renders landmark and passes automated axe accessibility scan`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!text.includes('404') && !text.includes('Failed to load resource')) {
            consoleErrors.push(text);
          }
        }
      });

      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      // Verify principal heading (h1) is visible and contains expected title text
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(titleSnippet);

      // Verify zero console errors
      expect(consoleErrors).toEqual([]);

      // Automated basic WCAG accessibility check with AxeBuilder
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['color-contrast']) // Color contrast evaluated per theme token contract
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('404 page renders properly for invalid routes with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('404') && !text.includes('Failed to load resource')) {
          consoleErrors.push(text);
        }
      }
    });

    const response = await page.goto('/non-existent-route-xyz');
    expect(response?.status()).toBe(404);

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('404');
    expect(consoleErrors).toEqual([]);
  });
});
