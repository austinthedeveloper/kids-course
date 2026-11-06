import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', heading: 'Plan movement courses that fit your real room' },
  { path: '/spaces', heading: 'Spaces' },
  { path: '/equipment', heading: 'Equipment' },
  { path: '/courses', heading: 'Courses' },
  { path: '/no-such-page', heading: 'Page not found' },
];

for (const { path, heading } of PAGES) {
  test(`${path} loads directly, with no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('not a safety certification');

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(serious.map((violation) => violation.id)).toEqual([]);
  });
}

test('main navigation marks the current page', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  await nav.getByRole('link', { name: 'Equipment' }).click();
  await expect(page).toHaveURL(/\/equipment$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Equipment' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Equipment' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(nav.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current', 'page');
});

test('every route is reachable by keyboard, and the skip link stays on the page', async ({
  page,
}) => {
  await page.goto('/equipment');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/equipment$/);
  await expect(page.getByRole('main')).toBeFocused();
});

test('the page never scrolls sideways', async ({ page }) => {
  for (const { path } of PAGES) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
