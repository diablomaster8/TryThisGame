import { test, expect } from '../fixtures';
import { ready } from '../fixtures';

test('reload: the save is identical after a reload', async ({ page, grove }) => {
  await grove.open({ scenario: 'fresh' });
  await page.evaluate(() => window.grove!.test.setTimeScale(10));
  await page.waitForTimeout(3000);
  const snap = () =>
    page.evaluate(() =>
      JSON.stringify(
        window.grove!.world.nubbins.map((n: Record<string, unknown>) => [
          n['id'],
          n['stage'],
          n['name'],
          n['seed'],
        ]),
      ),
    );
  await page.evaluate(() => window.grove!.save());
  const before = await snap();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ready(page);
  expect(await snap()).toBe(before);
});
