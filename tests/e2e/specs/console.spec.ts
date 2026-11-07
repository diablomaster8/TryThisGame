import { test, expect } from '../fixtures';

/** Eight Nubbins at x10 for three minutes (E2E_CONSOLE_MS shortens it for a local run). */
test('console: zero errors over a scripted session at x10', async ({ page, grove }, info) => {
  // The full three minutes on one project keeps the pull-request run short; the others get 30 s.
  const full = info.project.name === 'pixel-desktop';
  const ms = Number(process.env['E2E_CONSOLE_MS'] ?? (full ? 180_000 : 30_000));
  test.setTimeout(ms + 120_000);
  await grove.open({ scenario: 'eight-nubbins' });
  await page.evaluate(() => window.grove!.test.setTimeScale(10));
  const t0 = Date.now();
  let i = 0;
  while (Date.now() - t0 < ms) {
    // A scripted wander: tap a Nubbin on the canvas now and then, then let it run.
    const pt = await page.evaluate((k) => {
      const g = window.grove!;
      const ns = g.world.nubbins;
      return ns.length ? g.test.worldToScreen(ns[k % ns.length].id) : null;
    }, i++);
    const vp = page.viewportSize()!;
    if (pt && pt.x > 0 && pt.y > 0 && pt.x < vp.width && pt.y < vp.height)
      await page.mouse.click(pt.x, pt.y);
    await page.waitForTimeout(Math.min(5000, Math.max(0, ms - (Date.now() - t0))));
  }
  expect(grove.errors).toEqual([]);
});
