import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';

/** Every visible control is at least 44 px (CLAUDE.md), checked on phones at 375x812. */
async function undersized(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const bad: string[] = [];
    for (const el of document.querySelectorAll('button, [role=button], select, input, a[href]')) {
      // A checkbox or radio is tapped through its label, so the label's box is the target.
      const hit = el instanceof HTMLInputElement ? (el.closest('label') ?? el) : el;
      const r = hit.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none')
        continue;
      if (r.width < 44 || r.height < 44)
        bad.push(
          `${el.tagName}.${String(el.className).slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        );
    }
    return bad;
  });
}

test.describe('tap targets at 375x812', () => {
  test.beforeEach(({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 500, 'phone viewport only');
  });

  test('HUD', async ({ page, grove }) => {
    await grove.open({ scenario: 'eight-nubbins' });
    expect(await undersized(page), 'HUD controls under 44 px').toEqual([]);
  });

  test('stats sheet', async ({ page, grove }) => {
    await grove.open({ scenario: 'eight-nubbins' });
    const id = await page.evaluate(() => window.grove!.world.nubbins[0].id);
    // A real tap on the canvas, at the position the camera puts that Nubbin.
    const pt = await page.evaluate((n) => window.grove!.test.worldToScreen(n), id);
    expect(pt).not.toBeNull();
    await page.mouse.click(pt!.x, pt!.y);
    await page.waitForTimeout(800);
    expect(await undersized(page), 'sheet controls under 44 px').toEqual([]);
  });

  for (const [name, locator] of [
    ['shop', 'button[aria-label="Shop"]'],
    ['roster', 'button[aria-label="Roster"]'],
    ['settings', 'button[aria-label="Settings"]'],
    ['journal', 'button:has-text("📖")'],
  ] as const) {
    test(name, async ({ page, grove }) => {
      await grove.open({ scenario: 'eight-nubbins' });
      // The scenario's opening narration sits over the dock, so open the panel with the button's own click.
      await page.locator(locator).first().dispatchEvent('click');
      await page.waitForTimeout(800);
      expect(await undersized(page), `${name} controls under 44 px`).toEqual([]);
    });
  }
});
