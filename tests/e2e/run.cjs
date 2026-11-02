/* TECH-11: the browser half of the play harness. Opt-in, not part of `npm test`:
 *   npm run build && npx vite preview --port 4173 &   (or `npx vite --port 5173`)
 *   E2E_URL=http://localhost:4173 npm run test:e2e
 * playwright-core is not a project dependency (the lockfile stays small); install it where
 * you like (`npm i --no-save playwright-core`) or point PLAYWRIGHT_CORE at a copy. The
 * browser is Playwright's Chromium, or E2E_BROWSER=<path to msedge/chrome>. SwiftShader
 * (software GL) is on, so it runs anywhere. Env: E2E_PROJECT=pixel-desktop|pixel-phone|3d-desktop
 * (default: all three), E2E_ONLY=<regex of spec names>.
 * Specs boot with `?e2e&free&slot=N`, which exposes `window.grove` and `window.grove.test`
 * (src/dev/e2e-api.ts). Exit code 1 if any spec fails. */
const BASE = process.env.E2E_URL || 'http://localhost:4173';
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const PROJECTS = {
  'pixel-desktop': { w: 1280, h: 720, touch: false, gfx: 'pixel' },
  'pixel-phone': { w: 375, h: 812, touch: true, gfx: 'pixel' },
  '3d-desktop': { w: 1280, h: 720, touch: false, gfx: '3d' },
};
let slot = 0;

async function boot(browser, proj, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: proj.w, height: proj.h },
    deviceScaleFactor: proj.touch ? 2 : 1,
    isMobile: proj.touch,
    hasTouch: proj.touch,
  });
  if (opts.blockStorage) {
    await ctx.addInitScript(() => {
      const deny = () => {
        throw new DOMException('blocked', 'SecurityError');
      };
      Object.defineProperty(window, 'localStorage', { get: deny });
    });
  }
  if (proj.gfx === '3d')
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('grove.graphics', '3d');
      } catch {}
    });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 240)));
  page.on('pageerror', (e) => errors.push('PAGEERR ' + String(e).slice(0, 240)));
  const s = opts.slot ?? ++slot;
  await page.goto(`${BASE}/?e2e&free&slot=${s}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.grove && window.grove.test, null, { timeout: 120000 });
  return { ctx, page, errors };
}

const SPECS = {
  async 'first-loop'({ page }) {
    // Hatch, pet and feed inside 60 s of wall time.
    const t0 = Date.now();
    await page.evaluate(() => {
      const g = window.grove;
      for (const n of g.world.nubbins) g.send({ kind: 'debugHatchNow', nubbinId: n.id });
      g.send({ kind: 'debugGive', what: 'fruit', amount: 1 });
    });
    await page.waitForFunction(() => window.grove.world.nubbins.some((n) => n.stage === 'child'), null, { timeout: 20000 });
    const id = await page.evaluate(() => window.grove.world.nubbins.find((n) => n.stage === 'child').id);
    await page.evaluate((id) => {
      window.grove.send({ kind: 'pet', nubbinId: id });
      window.grove.send({ kind: 'feed', nubbinId: id });
    }, id);
    await page.waitForFunction(() => {
      const k = window.grove.test.events().map((e) => e.kind);
      return k.includes('petted') && k.includes('ate');
    }, null, { timeout: 40000 });
    if (Date.now() - t0 > 60000) throw new Error('first loop took over 60 s');
  },
  async reload({ page }) {
    await page.evaluate(() => window.grove.test.setTimeScale(10));
    await page.waitForTimeout(3000);
    const before = await page.evaluate(() => {
      window.grove.save();
      const w = window.grove.world;
      return JSON.stringify(w.nubbins.map((n) => [n.id, n.stage, n.name, n.seed]));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.grove && window.grove.test, null, { timeout: 120000 });
    const after = await page.evaluate(() =>
      JSON.stringify(window.grove.world.nubbins.map((n) => [n.id, n.stage, n.name, n.seed])),
    );
    if (before !== after) throw new Error('the Nubbins differ after a reload');
  },
  async 'blocked-storage'(_ctxs, proj, browser) {
    const { ctx, page, errors } = await boot(browser, proj, { blockStorage: true });
    await page.waitForTimeout(3000);
    const fatal = errors.filter((e) => /PAGEERR/.test(e));
    await ctx.close();
    if (fatal.length) throw new Error('crashed with storage blocked: ' + fatal[0]);
  },
  async console({ page, errors }) {
    await page.evaluate(() => window.grove.test.setTimeScale(10));
    const ms = Number(process.env.E2E_CONSOLE_MS || 20000);
    await page.waitForTimeout(ms);
    if (errors.length) throw new Error(`${errors.length} console errors: ${errors[0]}`);
  },
  async 'tap-targets'({ page }, proj) {
    if (proj.w > 500) return;
    const small = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('button, [role=button], select, input, a[href]')) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
        if (r.width < 44 || r.height < 44) bad.push(`${el.tagName}.${String(el.className).slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return bad;
    });
    if (small.length) throw new Error(`${small.length} controls under 44 px: ${small.slice(0, 5).join('; ')}`);
  },
};

(async () => {
  const only = process.env.E2E_ONLY ? new RegExp(process.env.E2E_ONLY) : null;
  const names = process.env.E2E_PROJECT ? [process.env.E2E_PROJECT] : Object.keys(PROJECTS);
  const browser = await chromium.launch({
    ...(process.env.E2E_BROWSER ? { executablePath: process.env.E2E_BROWSER } : {}),
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader'],
  });
  let failed = 0;
  for (const name of names) {
    const proj = PROJECTS[name];
    for (const [spec, fn] of Object.entries(SPECS)) {
      if (only && !only.test(spec)) continue;
      const t0 = Date.now();
      let env = null;
      try {
        if (spec !== 'blocked-storage') env = await boot(browser, proj);
        await fn(env ?? {}, proj, browser);
        console.log(`ok   ${name} ${spec} (${Date.now() - t0} ms)`);
      } catch (e) {
        failed++;
        console.log(`FAIL ${name} ${spec}: ${String(e.message || e).slice(0, 300)}`);
      } finally {
        if (env) await env.ctx.close();
      }
    }
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
