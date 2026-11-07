import { test, expect } from '../fixtures';

/**
 * R0456/TECH-11: a 10-minute session. After a one-minute warm-up the used JS heap (after a forced GC)
 * is the baseline; at the end it may not be more than 25% above it. Tagged @soak: the PR run skips
 * it, the nightly job runs it with E2E_SOAK=1. E2E_SOAK_MS shortens it for a local check.
 */
const HEAP_GROWTH = 0.25;

test('soak: heap grows at most 25% over a 10-minute session @soak', async ({ page, grove }) => {
  test.skip(page.viewportSize()!.width < 500, 'desktop projects only');
  const total = Number(process.env['E2E_SOAK_MS'] ?? 10 * 60_000);
  const warm = Math.min(60_000, total / 5);
  test.setTimeout(total + 5 * 60_000);
  await grove.open({ scenario: 'eight-nubbins' });
  await page.waitForFunction(() => !document.querySelector('.load-veil'), null, {
    timeout: 240_000,
  });
  await page.evaluate(() => window.grove!.test.setTimeScale(10));
  const heap = () =>
    page.evaluate(async () => {
      window.gc?.();
      await new Promise((r) => setTimeout(r, 400));
      const m = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      return m ? m.usedJSHeapSize / 1048576 : 0;
    });
  const trip = () =>
    page.evaluate(async () => {
      const g = window.grove!;
      g.send({ kind: 'enterDungeon', daily: false });
      await g.test.frames(120);
      g.send({ kind: 'leaveDungeon' });
      await g.test.frames(120);
    });
  const run = async (ms: number): Promise<void> => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      await trip();
      await page.waitForTimeout(15_000);
    }
  };
  await run(warm);
  const base = await heap();
  await run(total - warm);
  const end = await heap();
  console.log(`soak heap ${base.toFixed(0)} -> ${end.toFixed(0)} MB`);
  expect(base, 'performance.memory unavailable').toBeGreaterThan(0);
  expect(end).toBeLessThanOrEqual(base * (1 + HEAP_GROWTH));
  expect(grove.errors.filter((e) => e.startsWith('PAGEERR'))).toEqual([]);
});
