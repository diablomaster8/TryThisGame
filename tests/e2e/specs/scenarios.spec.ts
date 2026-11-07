import { test, expect } from '../fixtures';

test('scenario campaign-ch:5 opens on chapter 5', async ({ page, grove }) => {
  await grove.open({ scenario: 'campaign-ch:5' });
  const ch = await page.evaluate(() => window.grove!.world.campaign?.chapter ?? null);
  expect(ch).toBe(5);
});

test('scenario hollow-floor:6 opens inside the Hollow', async ({ page, grove }) => {
  await grove.open({ scenario: 'hollow-floor:6' });
  const loc = await page.evaluate(() => window.grove!.world.location);
  expect(['dungeon', 'hollow']).toContain(loc);
});
