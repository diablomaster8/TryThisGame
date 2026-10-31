import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import local from './eslint-local-rules.js';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    // TECH-48: imports stay at the top (the `import/first` rule, kept local; see the file).
    // Tests are left out: a `vi.mock` block above the imports is the usual Vitest layout.
    files: ['src/**/*.ts'],
    plugins: { local },
    rules: { 'local/import-first': 'error' },
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
              group: [
                '../render/*',
                '../render3d/*',
                '../ui/*',
                '../input/*',
                '../platform/*',
                '../minigames/*',
                '../game',
                '../main',
              ],
              message:
                'sim/ must not depend on render, render3d, ui, input, platform, minigames or game.',
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
  {
    // TECH-40: render reads sim state and never changes it. Any assignment or ++/-- through
    // `world.` (up to three levels deep) in a renderer fails lint.
    files: ['src/render/**/*.ts', 'src/render3d/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...[
          'AssignmentExpression > MemberExpression.left',
          'UpdateExpression > MemberExpression.argument',
        ].flatMap((sel) =>
          ['object', 'object.object', 'object.object.object'].map((path) => ({
            selector: `${sel}[${path}.name='world']`,
            message: 'Renderers read the world and never write it (send a command instead).',
          })),
        ),
      ],
    },
  },
  {
    // TECH-40: unawaited promises (boot freezes came from unhandled `import()` chains). Typed
    // lint is slow, so it runs on the code only, not on the script data in src/content.
    files: ['src/**/*.ts'],
    ignores: ['src/content/**'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  prettier,
);
