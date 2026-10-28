/* global require, process, console, __dirname, window, document, performance */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * WORLD-45: the world perf probe. Boots slot 1 at the phone viewport in headless Edge, in Pixel
 * then Full 3D, skips the opening, teleports to each Grove landmark and the four corners,
 * waits 2.5 s and records draw calls, triangles, sprites drawn and culled, GPU memory, the
 * heap and the governor. Writes docs/logs/world-perf.json, prints a table, and exits 1 when a
 * 3D spot is over the phone PERF_BUDGET (read from src/config/tuning-world.ts) or a pixel spot
 * draws more than PIXEL_SPRITES sprites. Needs a dev server: `npm run dev` (or PROBE_URL).
 * Run: `npm run probe:world` (not part of `npm test`: it needs a browser).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require(
  process.env.PLAYWRIGHT_CORE || 'C:/Users/God/AppData/Local/Temp/node_modules/playwright-core',
);
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.PROBE_URL || 'http://localhost:5173/?debug';
const ROOT = path.join(__dirname, '..', '..');
const tuning = fs.readFileSync(path.join(ROOT, 'src/config/tuning-world.ts'), 'utf8');
const m = /phone: \{ calls: ([\d_]+), tris: ([\d_]+)/.exec(tuning);
const BUDGET = { calls: Number(m[1].replace(/_/g, '')), tris: Number(m[2].replace(/_/g, '')) };
const PIXEL_SPRITES = 500;
const SPOTS = [
  ['heart', 0, 4],
  ['bridge', 9.6, -4.2],
  ['well', 3, 10],
  ['falls', 12.4, -10.4],
  ['cottage', -7, 12],
  ['dojo', 18, -2],
  ['school', -3, -16],
  ['oldTree', -8, -3],
  ['southBend', 11, 20],
  ['westHill', -12, 13],
  ['northWood', -28, -30],
  ['eastRidge', 30, -24],
  ['southMarsh', 6, 38],
  ['westMeadow', -32, 16],
  ['farOrchard', 26, 34],
  ['cornerNW', -44, -44],
  ['cornerNE', 44, -44],
  ['cornerSW', -44, 44],
  ['cornerSE', 44, 44],
];

async function probe(TAG) {
  const browser = await chromium.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') logs.push(msg.text().slice(0, 200));
  });
  page.on('pageerror', (e) => logs.push('PAGEERR ' + String(e).slice(0, 200)));
  page.on('dialog', (d) => d.accept());
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await page.waitForSelector('text=Slot 1', { timeout: 120000 });
  await page.locator('.title-graphics select').selectOption(TAG === 'px' ? 'pixel' : '3d');
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Slot 1")').first().click();
  await page.waitForTimeout(1500);
  await page.locator('button:visible', { hasText: 'Gardener' }).first().click();
  await page.waitForFunction(() => window.grove && window.grove.world, null, { timeout: 120000 });
  await page.waitForFunction(() => /[0-9]+ fps/.test(document.body.innerText), null, {
    timeout: 240000,
  });
  await page.waitForTimeout(TAG === '3d' ? 8000 : 2500);
  for (let i = 0; i < 150; i++) {
    const vis = await page.evaluate(() => !!document.querySelector('.dialogue')?.offsetParent);
    if (!vis) break;
    const ch = page.locator('.btn-choice:visible');
    if (await ch.count()) await ch.first().click();
    else
      await page
        .locator('.dialogue-box')
        .click({ force: true })
        .catch(() => {});
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(800);
  for (let i = 0; i < 40; i++) {
    const sk = page.locator('button:visible', { hasText: 'Skip' });
    const vis = await page.evaluate(() => !!document.querySelector('.dialogue')?.offsetParent);
    if (!vis) {
      await page.waitForTimeout(500);
      if (!(await page.evaluate(() => !!document.querySelector('.dialogue')?.offsetParent))) break;
      continue;
    }
    if (await sk.count())
      await sk
        .first()
        .click()
        .catch(() => {});
    else
      await page
        .locator('.dialogue-box')
        .click({ force: true })
        .catch(() => {});
    await page.waitForTimeout(300);
  }
  for (const id of await page.evaluate(() =>
    window.grove.world.nubbins.filter((n) => n.stage === 'egg').map((n) => n.id),
  ))
    await page.evaluate((id) => window.grove.send({ kind: 'debugHatchNow', nubbinId: id }), id);
  const rows = [];
  for (const [name, x, z] of SPOTS) {
    await page.evaluate(([x, z]) => window.grove.send({ kind: 'teleport', pos: { x, z } }), [x, z]);
    await page.waitForTimeout(2500);
    rows.push({
      mode: TAG,
      spot: name,
      ...(await page.evaluate(() => {
        const g = window.grove;
        const r = g.pipeline.renderer.info;
        const s = g.scene3d;
        const heap = performance.memory
          ? Math.round(performance.memory.usedJSHeapSize / 1e6)
          : null;
        return {
          calls: r.render.calls,
          tris: r.render.triangles,
          sprites: s ? null : g.view.batch.drawn,
          culled: s ? null : g.view.batch.culled,
          geometries: r.memory.geometries,
          textures: r.memory.textures,
          heapMB: heap,
          lod: s ? s.lodBias : null,
          gov: s ? `${s.governor.ratio}/cpu${s.governor.cpuLevel}` : null,
        };
      })),
    });
  }
  await browser.close();
  return { rows, errors: logs };
}

(async () => {
  const t0 = Date.now();
  const all = [];
  const errors = {};
  for (const mode of ['px', '3d']) {
    const r = await probe(mode);
    all.push(...r.rows);
    errors[mode] = r.errors;
  }
  const over = all.filter((r) =>
    r.mode === '3d' ? r.calls > BUDGET.calls || r.tris > BUDGET.tris : r.sprites > PIXEL_SPRITES,
  );
  const out = path.join(ROOT, 'docs/logs/world-perf.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(
    out,
    JSON.stringify(
      {
        when: new Date().toISOString(),
        budget: BUDGET,
        pixelSprites: PIXEL_SPRITES,
        rows: all,
        errors,
      },
      null,
      2,
    ) + '\n',
  );
  console.table(all);
  console.log(
    `${all.length} spots in ${Math.round((Date.now() - t0) / 1000)} s; over budget: ${over.length}`,
  );
  for (const r of over)
    console.log(`  OVER ${r.mode} ${r.spot}: calls ${r.calls} tris ${r.tris} sprites ${r.sprites}`);
  process.exit(over.length ? 1 : 0);
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(2);
});
