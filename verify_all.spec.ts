import { test, expect } from '@playwright/test';

test('verify changes', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Bypass onboarding
  await page.evaluate(() => {
    localStorage.setItem('_cap_is_onboarding_complete', 'true');
    localStorage.setItem('isOnyxAuthenticated', 'true');
    // Also set a default profile to avoid issues
    localStorage.setItem('onyx-auth-storage', JSON.stringify({
      state: {
        user: { id: 'test-user', name: 'Test User' },
        profile: {
          currency: 'MGA',
          strategicPath: 'investor',
          totalXp: 1000,
          level: 1,
          tier: 'Bronze'
        }
      }
    }));
  });

  await page.reload();
  await page.waitForTimeout(2000);

  // Take screenshot of Home
  await page.screenshot({ path: 'verify-home.png' });

  // Navigate to Budget - try multiple ways to find the button
  const budgetBtn = page.getByRole('button', { name: /budget/i }).first() || page.locator('nav >> text=Budget');
  await budgetBtn.click().catch(() => page.click('text=Budget'));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify-budget.png' });

  // Navigate to Growth
  const growthBtn = page.getByRole('button', { name: /growth/i }).first() || page.locator('nav >> text=Growth');
  await growthBtn.click().catch(() => page.click('text=Growth'));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify-growth.png' });

  // Open New Transaction
  await page.goto('http://localhost:3000/history'); // Go to history to find FAB usually
  await page.waitForTimeout(5000);
  await page.locator('button').filter({ has: page.locator('svg') }).last().click().catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-new-transaction.png' });
});
