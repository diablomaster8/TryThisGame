/**
 * TECH-11: the standing browser smoke run, on @playwright/test.
 *
 *   npm run test:e2e                      builds, serves `vite preview` and runs every non-soak spec
 *   E2E_URL=http://localhost:5821 npm run test:e2e   reuse a server you already started
 *   npm run test:e2e:soak                 the 10-minute soak (nightly job only; playwright.soak.config.ts)
 *
 * Env: E2E_PORT (default 4173), E2E_NO_BUILD=1 (serve an existing dist/), E2E_PROJECT is just
 * `--project=<name>`, E2E_BROWSER=<path to msedge/chrome> for a machine without Playwright's
 * Chromium (CI installs it with `npx playwright install --with-deps chromium`).
 * The 3d project runs software GL (SwiftShader), so it works with no GPU.
 */
import { defineConfig } from '@playwright/test';
import type { GroveOptions } from './fixtures';

const port = Number(process.env['E2E_PORT'] ?? 4173);
const external = process.env['E2E_URL'];
const baseURL = external ?? `http://localhost:${port}`;
const executablePath = process.env['E2E_BROWSER'];

const launchOptions = {
  ...(executablePath ? { executablePath } : {}),
  args: [
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--js-flags=--expose-gc',
    '--enable-precise-memory-info',
  ],
};

export function makeConfig(soak: boolean): ReturnType<typeof defineConfig<GroveOptions>> {
  return defineConfig<GroveOptions>({
    testDir: './specs',
    // The soak runs alone, in the nightly job; every other run skips it.
    ...(soak ? { grep: /@soak/ } : { grepInvert: /@soak/ }),
    fullyParallel: false,
    workers: Number(process.env['E2E_WORKERS'] ?? 1),
    retries: process.env['CI'] ? 1 : 0,
    timeout: soak ? 20 * 60_000 : 90_000,
    expect: { timeout: 20_000 },
    reporter: process.env['CI'] ? [['list'], ['github']] : 'list',
    outputDir: '../../.cache/e2e-results',
    // The preview build ships a strict CSP; waitForFunction needs eval, so the specs bypass it.
    use: { baseURL, launchOptions, bypassCSP: true, trace: 'retain-on-failure' },
    projects: [
      { name: 'pixel-desktop', use: { viewport: { width: 1280, height: 720 }, gfx: 'pixel' } },
      {
        name: 'pixel-phone',
        use: {
          viewport: { width: 375, height: 812 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          gfx: 'pixel',
        },
      },
      { name: '3d-desktop', use: { viewport: { width: 1280, height: 720 }, gfx: '3d' } },
    ],
    ...(external
      ? {}
      : {
          webServer: {
            command: `${process.env['E2E_NO_BUILD'] ? '' : 'npm run build && '}npx vite preview --port ${port} --strictPort`,
            url: baseURL,
            reuseExistingServer: !process.env['CI'],
            timeout: 5 * 60_000,
          },
        }),
  });
}

export default makeConfig(false);
