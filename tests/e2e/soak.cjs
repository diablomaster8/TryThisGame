/* eslint-disable */
/* R0456 (TECH-14, r13-d4): the memory soak. Boots a Grove, lets it settle, then goes into the
 * Hollow and back 20 times (frames run on the test clock between each). After a first lap the
 * counts are the baseline: geometries and textures must stay within 10% of it, and the used JS
 * heap must grow by under 25%. Pixel runs the same trips and checks the heap only.
 *   npm run build && npx vite preview --port 4173 &
 *   E2E_URL=http://localhost:4173 node tests/e2e/soak.cjs      (E2E_MODE=3d|pixel, TRIPS=20)
 * Same env as run.cjs (PLAYWRIGHT_CORE, E2E_BROWSER). Exit 1 on a failed budget. */
const BASE = process.env.E2E_URL || 'http://localhost:4173';
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const TRIPS = Number(process.env.TRIPS || 20);
const WARM = Number(process.env.WARM || 8);
const GEO_TEX_GROWTH = 0.1;
const HEAP_GROWTH = 0.25;

async function soak(browser, mode) {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    timezoneId: 'UTC',
  });
  if (mode === '3d')
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('grove.graphics', '3d');
      } catch {}
    });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)));
  await page.goto(`${BASE}/?e2e&debug&scenario=fresh&seed=7`, {
    waitUntil: 'domcontentloaded',
    timeout: 120000,
  });
  await page.waitForFunction(() => window.grove && window.grove.test, null, { timeout: 120000 });
  await page.waitForFunction(() => !document.querySelector('.load-veil'), null, {
    timeout: 240000,
  });
  const sample = () =>
    page.evaluate(async () => {
      const g = window.grove;
      if (window.gc) window.gc();
      await new Promise((r) => setTimeout(r, 400));
      const r = g.scene3d && g.scene3d.renderer;
      const m = r ? r.info.memory : null;
      return {
        geo: m ? m.geometries : 0,
        tex: m ? m.textures : 0,
        heap: performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0,
      };
    });
  const trip = () =>
    page.evaluate(async () => {
      const g = window.grove;
      g.send({ kind: 'enterDungeon', daily: false });
      await g.test.frames(120);
      g.send({ kind: 'leaveDungeon' });
      await g.test.frames(120);
    });
  for (let i = 0; i < WARM; i++) await trip(); // the first laps build everything once
  const base = await sample();
  for (let i = 0; i < TRIPS; i++) await trip();
  const end = await sample();
  await ctx.close();
  const growth = (a, b) => (a ? (b - a) / a : 0);
  const bad = [];
  if (mode === '3d') {
    if (growth(base.geo, end.geo) > GEO_TEX_GROWTH)
      bad.push(`geometries ${base.geo} -> ${end.geo}`);
    if (growth(base.tex, end.tex) > GEO_TEX_GROWTH) bad.push(`textures ${base.tex} -> ${end.tex}`);
  }
  if (growth(base.heap, end.heap) > HEAP_GROWTH)
    bad.push(`heap ${base.heap.toFixed(0)} -> ${end.heap.toFixed(0)} MB`);
  if (errors.length) bad.push(`page errors: ${errors[0]}`);
  console.log(
    `${bad.length ? 'FAIL' : 'ok  '} soak ${mode}: ${JSON.stringify({ base, end })}${bad.length ? ' ' + bad.join('; ') : ''}`,
  );
  return bad.length === 0;
}

(async () => {
  const browser = await chromium.launch({
    ...(process.env.E2E_BROWSER ? { executablePath: process.env.E2E_BROWSER } : {}),
    headless: true,
    args: [
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--js-flags=--expose-gc',
      '--enable-precise-memory-info',
    ],
  });
  let ok = true;
  for (const mode of process.env.E2E_MODE ? [process.env.E2E_MODE] : ['pixel', '3d'])
    ok = (await soak(browser, mode)) && ok;
  await browser.close();
  process.exit(ok ? 0 : 1);
})();
