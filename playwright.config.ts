import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests (docs/planning/TEST_STRATEGY.md).
 * Set E2E_BASE_URL to run against a deployed build instead of the local dev server.
 */
const baseURL = process.env['E2E_BASE_URL'] ?? 'http://localhost:4200';
const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: process.env['E2E_BASE_URL']
    ? undefined
    : {
        command: 'npm run start -- --port 4200',
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});
