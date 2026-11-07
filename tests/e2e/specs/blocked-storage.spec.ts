import { test, expect } from '../fixtures';

test('blocked storage: the game boots and keeps running', async ({ page, grove }) => {
  await grove.open({ blockStorage: true });
  await page.waitForTimeout(3000);
  expect(grove.errors.filter((e) => e.startsWith('PAGEERR'))).toEqual([]);
});
