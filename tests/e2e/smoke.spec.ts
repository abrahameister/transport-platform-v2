import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Web Shells & Accessibility E2E Smoke Tests', () => {
  // Public routes — always accessible without auth
  const publicRoutes = [
    { path: '/', titleSnippet: 'Transport Platform V2' },
    { path: '/sign-in', titleSnippet: 'Transport Platform V2' },
    { path: '/client', titleSnippet: 'Corporate Client Shell' },
    { path: '/passenger', titleSnippet: 'Passenger Shell' },
  ];

  for (const { path, titleSnippet } of publicRoutes) {
    test(`Public route "${path}" loads cleanly, renders landmark and passes axe scan`, async ({ page }) => {
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

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(titleSnippet);

      expect(consoleErrors).toEqual([]);

      const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  // Protected routes — must redirect to sign-in when unauthenticated
  const protectedRoutes = ['/platform', '/operator'];

  for (const path of protectedRoutes) {
    test(`Protected route "${path}" redirects unauthenticated user to /sign-in`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });

      // Either a redirect that resolves to sign-in (200) or the route returns 200 showing sign-in
      const finalUrl = page.url();
      const isOnSignIn = finalUrl.includes('/sign-in');
      const isRedirected = response?.status() === 200 && isOnSignIn;
      const isForbidden = response?.status() === 403;

      expect(isRedirected || isForbidden).toBe(true);

      if (isOnSignIn) {
        // Verify the sign-in page is well-formed
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
      }
    });
  }

  test('Sign-in page has accessible form with labeled inputs', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    // Verify email input has associated label
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();

    // Verify password input has associated label
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await expect(passwordInput).toBeVisible();

    // Verify submit button is present and has accessible name
    const submitBtn = page.locator('button[type="submit"], button:has-text("Iniciar Sesión")').first();
    await expect(submitBtn).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

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
