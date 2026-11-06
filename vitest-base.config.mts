import { defineConfig } from 'vitest/config';

/**
 * Coverage floors for the pure core modules (EN-036), set just under the baseline measured on
 * 2026-11-05; see docs/planning/TEST_STRATEGY.md. Raise them as coverage grows, and never lower
 * them to get a change through. UI is covered by Playwright, so it has no floor here.
 */
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        'src/app/core/{domain,geometry,validation}/**/*.ts': {
          statements: 95,
          branches: 90,
          functions: 100,
          lines: 95,
        },
      },
    },
  },
});
