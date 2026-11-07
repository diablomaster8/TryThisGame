import { test, expect } from '../fixtures';

/** The PWA (service worker, production build only) boots with the network gone. */
test('offline: the PWA boots after one online load', async ({ page, context, grove }) => {
  await grove.open({ scenario: 'fresh' });
  // The worker precaches the shell on install; wait until it controls this page.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, {
    timeout: 60_000,
  });
  // Let the precache finish before the network goes.
  await page.waitForTimeout(5000);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.grove?.test, null, { timeout: 120_000 });
  const nubbins = await page.evaluate(() => window.grove!.world.nubbins.length);
  expect(nubbins).toBeGreaterThan(0);
  expect(grove.errors.filter((e) => e.startsWith('PAGEERR'))).toEqual([]);
});
