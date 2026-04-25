import { test, expect } from '@playwright/test';

test('verify changes', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Bypass onboarding and auth
  await page.evaluate(() => {
    // We use a simpler approach since bypass in verify_all.spec.ts didn't work as expected
    localStorage.setItem('_cap_is_onboarding_complete', 'true');
    localStorage.setItem('isOnyxAuthenticated', 'true');

    // We need to inject the state into Zustand's storage key if it uses one
    const authState = {
      state: {
        currentUser: { id: 1, name: 'Test User', role: 'Elite', tier: 'Platinum', path: 'Investor' },
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        isLoading: false
      },
      version: 0
    };
    localStorage.setItem('auth-storage', JSON.stringify(authState));
  });

  await page.reload();
  await page.waitForTimeout(3000);

  // Take screenshot of Home
  await page.screenshot({ path: 'verify-home.png' });

  // Navigate to Budget
  await page.click('text=Budget');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-budget.png' });

  // Navigate to Growth
  await page.click('text=Growth');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-growth.png' });

  // Navigate back to Home
  await page.click('text=Home');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-home-back.png' });
});
