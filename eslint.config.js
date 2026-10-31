import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    // R0500: reduced motion is read through platform/motion.ts only, so the setting and the
    // system query are always combined the same way.
    files: ['src/**/*.ts'],
    ignores: ['src/platform/motion.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[arguments.0.value=/prefers-reduced-motion/]',
          message: 'Use reducedMotion() from platform/motion.ts.',
        },
      ],
    },
  },
  {
    files: ['tests/**/*.ts', 'vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['public/sw.js'],
    languageOptions: { globals: { ...globals.serviceworker } },
  },
  {
    // Architecture rule: sim/ holds game rules only. No DOM, no Three.js.
    files: ['src/sim/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['three', 'three/*'], message: 'sim/ must not import Three.js.' },
            {
              group: ['../render/*', '../ui/*', '../input/*'],
              message: 'sim/ must not depend on render, ui or input.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'navigator',
        'localStorage',
        'sessionStorage',
        'requestAnimationFrame',
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Use the seeded generator in sim/rng.ts.' },
      ],
    },
  },
  prettier,
);
