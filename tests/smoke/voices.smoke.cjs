/* global require, process, console, window, document */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Hot fix: the read-aloud switches (Settings → Sound). A headless smoke test, run in Pixel and
 * Full 3D at a desktop size and at 375x812. In each it starts a new story, then checks:
 *   - with the switches untouched, story lines make NO speech call (the bug was the opposite);
 *   - the four Sound rows (Music, Sound effects, Story voices, Read everything else aloud)
 *     each have an icon and a 44 px tap target, and the two voice rows start unchecked;
 *   - turning Story voices on speaks the next line, and turning it off cuts speech at once
 *     (a `cancel()`) and the following lines are silent;
 *   - the choice survives a reload (save value, and the box on reopening Settings), and the
 *     other voice switch stays off.
 * It fails on any page error, console error or failed request. Speech is stubbed and counted.
 *
 * Not part of `npm test` (it needs a browser and a running server):
 *   npm run dev -- --port 5173          (in another terminal)
 *   node tests/smoke/voices.smoke.cjs http://localhost:5173/
 * Env: PLAYWRIGHT_CORE (module path), EDGE (browser executable).
 */
const fs = require('fs');

function loadPlaywright() {
  const tries = [
    process.env.PLAYWRIGHT_CORE,
    'playwright-core',
    'C:/Users/God/AppData/Local/Temp/node_modules/playwright-core',
  ].filter(Boolean);
  for (const t of tries) {
    try {
      return require(t);
    } catch {
      // Try the next place.
    }
  }
  throw new Error('playwright-core not found: set PLAYWRIGHT_CORE to its folder');
}

const { chromium } = loadPlaywright();
const URL_ARG = process.argv.slice(2).find((a) => /^https?:\/\//.test(a));
const BASE = URL_ARG || process.env.SMOKE_URL || 'http://localhost:5173/';
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const CONFIGS = [
  {
    name: 'pixel desktop',
    graphics: 'pixel',
    viewport: { width: 1280, height: 800 },
    mobile: false,
  },
  { name: 'pixel 375x812', graphics: 'pixel', viewport: { width: 375, height: 812 }, mobile: true },
  { name: '3d desktop', graphics: '3d', viewport: { width: 1280, height: 800 }, mobile: false },
  { name: '3d 375x812', graphics: '3d', viewport: { width: 375, height: 812 }, mobile: true },
];
const ONLY = process.env.SMOKE_ONLY;

let failed = 0;
function step(cfg, name, ok, note = '') {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${cfg}] ${name}${note ? `  (${note})` : ''}`);
}

async function run(browser, cfg) {
  const errors = [];
  const ctx = await browser.newContext({
    viewport: cfg.viewport,
    isMobile: cfg.mobile,
    hasTouch: cfg.mobile,
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript((graphics) => {
    try {
      window.localStorage.setItem('grove.graphics', graphics);
    } catch {
      // Storage blocked: the test will say so.
    }
    window.__said = [];
    window.__cancels = 0;
    const stub = {
      speak(u) {
        window.__said.push(u.text);
        setTimeout(() => u.onend && u.onend(), 5);
      },
      cancel() {
        window.__cancels++;
      },
      pause() {},
      resume() {},
      getVoices() {
        return [];
      },
      addEventListener() {},
      removeEventListener() {},
      speaking: false,
      pending: false,
      paused: false,
    };
    Object.defineProperty(window, 'speechSynthesis', { value: stub, configurable: true });
  }, cfg.graphics);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 300)}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text().slice(0, 300)}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url().slice(0, 200)}`);
  });
  const w = (fn, a) => page.evaluate(fn, a);
  const said = () => w(() => window.__said.length);
  const cancels = () => w(() => window.__cancels);
  const tap = async (loc) => (cfg.mobile ? loc.tap() : loc.click());

  const advance = async (n) => {
    for (let i = 0; i < n; i++) {
      const box = page.locator('.dialogue-box:visible').first();
      if (!(await box.count())) break;
      await tap(box);
      await page.waitForTimeout(450);
    }
  };
  const openSoundTab = async () => {
    await w(() =>
      [...document.querySelectorAll('button')]
        .find((b) => b.offsetParent && /settings/i.test(b.innerText + b.getAttribute('aria-label')))
        ?.click(),
    );
    await page.waitForTimeout(500);
    await w(() =>
      [...document.querySelectorAll('.settings-tab')]
        .find((b) => /sound/i.test(b.innerText))
        ?.click(),
    );
    await page.waitForTimeout(300);
  };
  const closeSettings = async () => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    // Fall back to any visible close button.
    await w(() => {
      const open = [...document.querySelectorAll('.modal, .settings-modal')].some(
        (e) => e.offsetParent,
      );
      if (open)
        [...document.querySelectorAll('button')]
          .find((b) => b.offsetParent && /^(close|done|✕|×)/i.test(b.innerText.trim()))
          ?.click();
    });
    await page.waitForTimeout(300);
  };
  const row = (label) => page.locator('.check-row').filter({ hasText: label }).first();

  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForSelector('text=Slot 1', { timeout: 180000 });
    await tap(page.locator('.title-mode').nth(0).locator('button:has-text("New story")').first());
    await page.waitForSelector('button:has-text("Sun Keeper")', { timeout: 60000 });
    await tap(page.locator('button:has-text("Sun Keeper")').first());
    await page.waitForSelector('.dialogue-box', { state: 'visible', timeout: 180000 });
    step(cfg.name, 'story dialogue opens', true);

    // 1. Default: nothing is read aloud.
    await advance(2);
    step(
      cfg.name,
      'no speech call with the switches untouched',
      (await said()) === 0,
      `said=${await said()}`,
    );
    const defaults = await w(() => {
      const s = window.grove.world.settings;
      return { story: s.voicesStory, ui: s.voicesUi };
    });
    step(
      cfg.name,
      'voices are unset (default) in the save',
      defaults.story === undefined && defaults.ui === undefined,
    );

    // 2. The Sound rows.
    await openSoundTab();
    for (const [label, icon] of [
      ['Music', '🎵'],
      ['Sound effects', '🔔'],
      ['Story voices', '📖'],
      ['Read everything else aloud', '🗣'],
    ]) {
      const r = row(label);
      const found = (await r.count()) > 0;
      const box = found ? await r.boundingBox() : null;
      const text = found ? await r.innerText() : '';
      step(
        cfg.name,
        `row "${label}" has its icon and a 44px target`,
        found && text.includes(icon) && !!box && box.height >= 44,
        box ? `h=${Math.round(box.height)}` : 'missing',
      );
    }
    const checked = async (label) => row(label).locator('input').isChecked();
    step(
      cfg.name,
      'both voice switches start off',
      !(await checked('Story voices')) && !(await checked('Read everything else aloud')),
    );

    // 3. Story voices on: the next line is spoken.
    await row('Story voices').locator('input').check();
    await page.waitForTimeout(300);
    await closeSettings();
    const before = await said();
    await advance(8);
    step(
      cfg.name,
      'story voices on speaks the next lines',
      (await said()) > before,
      `said ${before}→${await said()}`,
    );

    // 4. Off again: speech is cut at once, later lines are silent.
    await openSoundTab();
    const c0 = await cancels();
    await row('Story voices').locator('input').uncheck();
    await page.waitForTimeout(300);
    step(cfg.name, 'turning story voices off cancels speech', (await cancels()) > c0);
    await closeSettings();
    const mid = await said();
    await advance(8);
    step(
      cfg.name,
      'no speech after turning story voices off',
      (await said()) === mid,
      `said=${await said()}`,
    );

    // 5. Persist across a reload: turn it on, reload, check it is still on and the other off.
    await openSoundTab();
    await row('Story voices').locator('input').check();
    await page.waitForTimeout(300);
    await closeSettings();
    await w(() => window.grove.save && window.grove.save());
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForSelector('.title-continue, :text("Slot 1")', { timeout: 180000 });
    const cont = page.locator('.title-continue').first();
    if (await cont.count()) await tap(cont);
    else
      await tap(page.locator('.title-mode').nth(0).locator('button:has-text("Continue")').first());
    for (let i = 0; i < 120 && !(await w(() => !!window.grove?.world)); i++)
      await page.waitForTimeout(1000);
    const persisted = await w(() => {
      const s = window.grove.world.settings;
      return { story: s.voicesStory, ui: s.voicesUi };
    });
    step(
      cfg.name,
      'story voices persisted across the reload',
      persisted.story === true && persisted.ui === undefined,
      JSON.stringify(persisted),
    );
    await page.waitForTimeout(1500);
    await openSoundTab();
    step(
      cfg.name,
      'the reopened Settings shows story on, everything else off',
      (await checked('Story voices')) && !(await checked('Read everything else aloud')),
    );

    step(
      cfg.name,
      'no page or console errors',
      errors.length === 0,
      errors.slice(0, 3).join(' | '),
    );
  } catch (e) {
    step(cfg.name, 'run completed', false, String(e).slice(0, 300));
  }
  await ctx.close();
}

(async () => {
  const launch = { headless: true, args: ['--ignore-gpu-blocklist'] };
  if (fs.existsSync(EDGE)) launch.executablePath = EDGE;
  const browser = await chromium.launch(launch);
  for (const cfg of CONFIGS) if (!ONLY || cfg.name.includes(ONLY)) await run(browser, cfg);
  await browser.close();
  console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`);
  process.exit(failed === 0 ? 0 : 1);
})();
