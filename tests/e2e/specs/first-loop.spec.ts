import { test, expect } from '../fixtures';

test('first loop: hatch, pet and feed inside 60 s', async ({ page, grove }) => {
  await grove.open({ scenario: 'hatch-ready' });
  const t0 = Date.now();
  await page.evaluate(() => {
    const g = window.grove!;
    for (const n of g.world.nubbins) g.send({ kind: 'debugHatchNow', nubbinId: n.id });
    g.send({ kind: 'debugGive', what: 'fruit', amount: 1 });
  });
  await page.waitForFunction(
    () => window.grove!.world.nubbins.some((n: { stage: string }) => n.stage === 'child'),
    null,
    { timeout: 20_000 },
  );
  const id = await page.evaluate(
    () => window.grove!.world.nubbins.find((n: { stage: string }) => n.stage === 'child').id,
  );
  const saw = (kind: string) =>
    page.waitForFunction(
      (k) => window.grove!.test.events().some((e: { kind: string }) => e.kind === k),
      kind,
      { timeout: 30_000 },
    );
  // The Keeper holds one intent at a time: pet first, then feed.
  await page.evaluate((nid) => window.grove!.send({ kind: 'pet', nubbinId: nid }), id);
  await saw('petted');
  await page.evaluate((nid) => window.grove!.send({ kind: 'feed', nubbinId: nid }), id);
  await saw('ate');
  expect(Date.now() - t0).toBeLessThan(60_000);
});

test('first loop: a tap on the hatched Nubbin lands on a real canvas position', async ({
  page,
  grove,
}) => {
  await grove.open({ scenario: 'hatch-ready' });
  await page.evaluate(() => {
    const g = window.grove!;
    for (const n of g.world.nubbins) g.send({ kind: 'debugHatchNow', nubbinId: n.id });
  });
  await page.waitForFunction(
    () => window.grove!.world.nubbins.some((n: { stage: string }) => n.stage === 'child'),
    null,
    { timeout: 20_000 },
  );
  const id = await page.evaluate(
    () => window.grove!.world.nubbins.find((n: { stage: string }) => n.stage === 'child').id,
  );
  const pt = await page.evaluate((nid) => window.grove!.test.worldToScreen(nid), id);
  expect(pt).not.toBeNull();
  const vp = page.viewportSize()!;
  expect(pt!.x).toBeGreaterThan(0);
  expect(pt!.x).toBeLessThan(vp.width);
  expect(pt!.y).toBeGreaterThan(0);
  expect(pt!.y).toBeLessThan(vp.height);
});
