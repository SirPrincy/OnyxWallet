import { test, expect } from '@playwright/test';

test('verify premium semantics on home and drawer', async ({ page }) => {
  // Mock data
  const mockUser = {
    id: 'test-user-id',
    name: 'Jules Expert',
    role: 'investor',
    tier: 'Onyx Legend',
    status: 'active',
    lastActive: new Date().toISOString(),
    image: null,
    color: '#D4AF37',
    currency: 'EUR',
    monthlySalary: 5000,
    salaryDay: 1,
    autoAddSalary: true
  };

  await page.addInitScript((user) => {
    window.localStorage.setItem('_cap_is_onboarding_complete', '"true"');
    window.localStorage.setItem('_cap_is_setup_complete', '"true"');
    window.localStorage.setItem('_cap_is_onyx_authenticated', '"true"');
    window.localStorage.setItem('_cap_onyx_current_user', JSON.stringify(user));
    window.localStorage.setItem('_cap_is_passcode_enabled', '"false"');
  }, mockUser);

  await page.goto('http://localhost:3000/');

  // Wait for the app to initialize and load the dashboard
  // We look for the "Private Reserve" text which is on the Home screen
  await page.waitForSelector('text=Private Reserve', { timeout: 15000 });

  // Take screenshot of Home
  await page.screenshot({ path: '/home/jules/verification/home_premium.png', fullPage: true });

  // Open Navigation Drawer
  await page.click('button[aria-label="menu"]');
  await page.waitForSelector('text=Settings'); // Wait for drawer to be visible

  // Take screenshot of Drawer
  await page.screenshot({ path: '/home/jules/verification/drawer_premium.png' });

  // Check for premium terms
  const homeContent = await page.content();
  // "Capital Inflow" instead of "Salary" is in category list, but on Home we might see "Private Reserve"
  // Let's check for the Level display
  expect(homeContent).toContain('Lvl');

  console.log('Verification screenshots captured successfully.');
});
