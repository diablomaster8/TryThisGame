/** TECH-11: shared fixtures for the browser specs. Every spec boots through `grove.open`. */
import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export interface GroveOptions {
  /** Which renderer the project exercises. */
  gfx: 'pixel' | '3d';
}

export interface OpenOptions {
  /** A dev scenario (src/dev/scenarios.ts); without one the page opens a free slot. */
  scenario?: string;
  /** Block localStorage before the page loads. */
  blockStorage?: boolean;
  /** Extra query flags, such as `still`. */
  query?: string;
}

export interface GroveFixture {
  /** Page errors and console errors seen since the page opened. */
  errors: string[];
  open(opts?: OpenOptions): Promise<void>;
}

let slot = 0;

export const test = base.extend<GroveOptions & { grove: GroveFixture }>({
  gfx: ['pixel', { option: true }],
  grove: async ({ page, gfx }, use) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 240));
    });
    page.on('pageerror', (e) => errors.push('PAGEERR ' + String(e).slice(0, 240)));
    await use({
      errors,
      async open(opts = {}) {
        if (opts.blockStorage)
          await page.addInitScript(() => {
            Object.defineProperty(window, 'localStorage', {
              get() {
                throw new DOMException('blocked', 'SecurityError');
              },
            });
          });
        if (gfx === '3d')
          await page.addInitScript(() => {
            try {
              localStorage.setItem('grove.graphics', '3d');
            } catch {
              /* storage blocked */
            }
          });
        const extra = opts.query ? `&${opts.query}` : '';
        const url = opts.scenario
          ? `/?e2e&debug&scenario=${encodeURIComponent(opts.scenario)}&seed=7${extra}`
          : `/?e2e&free&slot=${++slot}${extra}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 });
        await ready(page);
      },
    });
  },
});

/** Waits for the `?e2e` hooks the game installs once it has booted. */
export async function ready(page: Page): Promise<void> {
  await page.waitForFunction(() => window.grove?.test, null, { timeout: 120_000 });
}

export { expect };
