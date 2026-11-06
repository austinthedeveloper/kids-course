// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

/**
 * Dependency boundaries (EN-002, docs/architecture/ARCHITECTURE.md).
 *
 * Pure core modules hold the geometry and safety rules. They must stay free of
 * Angular, the canvas library, the DOM, storage and unseeded randomness so they
 * can be tested as plain TypeScript and never depend on presentation code.
 */
const PURE_CORE = ['src/app/core/{domain,geometry,validation,generator,safety,fixtures}/**/*.ts'];

const FRAMEWORK = {
  regex: '^(@angular/|rxjs($|/)|konva($|/)|ng2-konva($|/))',
  message: 'Pure core modules must not import Angular, RxJS or the canvas library.',
};
const OUTWARD = {
  regex: '(^|/)(features|shared|persistence)(/|$)',
  message: 'Pure core modules must not import features, shared UI or persistence.',
};
/** @param {string[]} layers @param {string} from */
const upward = (layers, from) => ({
  regex: `(^|/)(${layers.join('|')})(/|$)`,
  message: `core/${from} must not depend on: ${layers.join(', ')}.`,
});
/** @param {object[]} patterns */
const restrict = (...patterns) => ['error', { patterns }];

export default defineConfig(
  {
    ignores: [
      'dist/',
      '.angular/',
      'coverage/',
      'playwright-report/',
      'test-results/',
      'node_modules/',
      '.claude/',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'kc', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'kc', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
  },
  {
    files: PURE_CORE,
    rules: {
      'no-restricted-imports': restrict(FRAMEWORK, OUTWARD),
      'no-restricted-globals': [
        'error',
        ...[
          'window',
          'document',
          'navigator',
          'localStorage',
          'sessionStorage',
          'indexedDB',
          'fetch',
        ].map((name) => ({
          name,
          message: 'Pure core modules must not touch the DOM, storage or network.',
        })),
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Seed all randomness (ADR-0003).' },
      ],
    },
  },
  // Layering inside core, lowest first. Tests may import fixtures from anywhere.
  {
    files: ['src/app/core/domain/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': restrict(
        FRAMEWORK,
        OUTWARD,
        upward(['geometry', 'validation', 'generator', 'safety', 'fixtures'], 'domain'),
      ),
    },
  },
  {
    files: ['src/app/core/geometry/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': restrict(
        FRAMEWORK,
        OUTWARD,
        upward(['validation', 'generator', 'safety', 'fixtures'], 'geometry'),
      ),
    },
  },
  {
    files: ['src/app/core/validation/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': restrict(
        FRAMEWORK,
        OUTWARD,
        upward(['generator', 'safety', 'fixtures'], 'validation'),
      ),
    },
  },
  {
    files: ['src/app/core/fixtures/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': restrict(
        FRAMEWORK,
        OUTWARD,
        upward(['validation', 'generator', 'safety'], 'fixtures'),
      ),
    },
  },
);
