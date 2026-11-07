/* global require, process, console, window, document, setTimeout, caches, fetch, location, navigator, URL */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * R0721 (KIDS-53): the Learning Grove works offline once a slot has been made online. Against a
 * PRODUCTION build (the service worker does not run in the dev server) it:
 *   1. creates a sprout Learning Grove slot online (age 4, "Start my Grove"),
 *   2. waits for the edu pack to fill the worker's cache (every `edu` file of
 *      offline-manifest.json), which is what the grown-up area's "Ready for offline" row reads,
 *   3. reloads once online so the worker is in control, then calls context.setOffline(true),
 *   4. reloads the `?kids` picker offline, opens the child's Grove, plays one sprout game to its
 *      results card, opens Nova's postcard, checks a word clip's file is still served, and
 *      checks speech was attempted,
 *   5. fails on page errors, console errors and HTTP errors other than the expected network
 *      failures while offline.
 *
 * Not part of `npm test` (it needs a browser and a built site):
 *   npm run build
 *   npx vite preview --port 4173          (in another terminal)
 *   npm run smoke:kids-offline -- http://localhost:4173/
 * Env: PLAYWRIGHT_CORE (module path), EDGE (browser executable), SMOKE_SHOTS (screenshot
 * folder, optional), SMOKE_HEADED=1 to watch it.
 */
const path = require('path');
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
const BASE = (URL_ARG || process.env.SMOKE_URL || 'http://localhost:4173/').replace(/\/?$/, '/');
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SHOTS = process.env.SMOKE_SHOTS || '';
const FILL_MS = Number(process.env.SMOKE_FILL_MS) || 240000;
const ROUNDS_MAX = 40;
const t0 = Date.now();

const errors = [];
const steps = [];
let offline = false;
function step(name, ok, note = '') {
  steps.push({ name, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${note ? `  (${note})` : ''}`);
}

/** Network noise that is expected, and only while the context is offline. */
const EXPECTED_OFFLINE = /ERR_INTERNET_DISCONNECTED|ERR_NETWORK_CHANGED|Failed to load resource/i;

(async () => {
  const launch = { headless: process.env.SMOKE_HEADED !== '1', args: ['--ignore-gpu-blocklist'] };
  if (fs.existsSync(EDGE)) launch.executablePath = EDGE;
  const browser = await chromium.launch(launch);
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    serviceWorkers: 'allow',
  });
  await ctx.addInitScript(() => {
    window.__said = [];
    const stub = {
      speak(u) {
        window.__said.push(u.text);
        setTimeout(() => u.onend && u.onend(), 5);
      },
      cancel() {},
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
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 300)}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (offline && EXPECTED_OFFLINE.test(m.text())) return;
    errors.push(`console.error${offline ? ' (offline)' : ''}: ${m.text().slice(0, 300)}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url().slice(0, 200)}`);
  });
  page.on('dialog', (d) => d.accept());
  const w = (fn, a) => page.evaluate(fn, a);
  const shot = async (name) => {
    if (!SHOTS) return;
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `${name}.png`) });
  };
  const visible = (sel) =>
    w(
      (s) => [...document.querySelectorAll(s)].some((e) => e.offsetParent !== null && !e.hidden),
      sel,
    );
  const tapCentre = async (handle) => {
    const box = await handle.boundingBox();
    if (!box) return false;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    return true;
  };

  /** How many of the edu pack's files the worker's cache holds (the "Ready for offline" test). */
  const eduHeld = () =>
    w(async () => {
      const base = new URL(document.baseURI).pathname.replace(/[^/]*$/, '');
      const m = await fetch(`${base}offline-manifest.json`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      const files = m?.packs?.edu?.files ?? [];
      if (!files.length) return { held: 0, of: 0 };
      let held = 0;
      for (const key of await caches.keys()) {
        if (!key.startsWith('grove-')) continue;
        const cache = await caches.open(key);
        const hits = await Promise.all(
          files.map((f) => cache.match(new URL(f, location.origin + base).href)),
        );
        held = Math.max(held, hits.filter(Boolean).length);
      }
      return { held, of: files.length };
    });

  try {
    // 1. Create a sprout slot online.
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('text=Slot 1', { timeout: 90000 });
    const section = page.locator('.title-mode').filter({ hasText: 'Learning Grove' });
    await section.first().locator('button:has-text("Slot 1")').first().click();
    await page.waitForTimeout(600);
    const age4 = page
      .locator('button.title-age')
      .filter({ has: page.locator('.title-age-n', { hasText: /^4$/ }) })
      .first();
    step('age 4 tile', (await age4.count()) > 0);
    await age4.tap();
    await page.waitForTimeout(400);
    const nameIn = page.locator('input[type="text"]:visible').first();
    if (await nameIn.count()) await nameIn.fill('Maya');
    await page.locator('button:has-text("Start my Grove")').first().tap();
    let booted = false;
    for (let i = 0; i < 120 && !booted; i++) {
      await page.waitForTimeout(1000);
      booted = await w(
        () =>
          !!window.grove?.world ||
          ([...document.querySelectorAll('.topbar')].some((e) => e.offsetParent) &&
            ![...document.querySelectorAll('.title-mode')].some((e) => e.offsetParent)),
      );
    }
    step('sprout Learning Grove slot created online', booted);

    // 2. The service worker registers and the edu pack fills the cache.
    const swUp = await w(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((r) => setTimeout(() => r(null), 60000)),
      ]);
      return !!reg?.active;
    });
    step('service worker active (production build)', swUp);
    let held = { held: 0, of: 0 };
    const fillStart = Date.now();
    while (Date.now() - fillStart < FILL_MS) {
      held = await eduHeld();
      if (held.of > 0 && held.held >= held.of) break;
      await page.waitForTimeout(2000);
    }
    step(
      'edu pack is in the cache ("Ready for offline")',
      held.of > 0 && held.held >= held.of,
      `${held.held}/${held.of} files, ${((Date.now() - fillStart) / 1000).toFixed(0)} s`,
    );

    // 3. One more online load so the worker controls the page, then go offline.
    await page.goto(`${BASE}?kids`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('.kids-pick-tile', { timeout: 60000 });
    const controlled = await w(() => !!navigator.serviceWorker?.controller);
    step('worker controls the page before going offline', controlled);
    await ctx.setOffline(true);
    offline = true;
    await page.goto(`${BASE}?kids`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    const tile = await page
      .waitForSelector('.kids-pick-tile', { timeout: 60000 })
      .then(() => true)
      .catch(() => false);
    step('offline reload shows the child picker', tile);
    await shot('1-offline-picker');
    if (!tile) throw new Error('offline reload did not load the app');
    await tapCentre(page.locator('.kids-pick-tile').first());
    let up = false;
    for (let i = 0; i < 90 && !up; i++) {
      await page.waitForTimeout(1000);
      up = await w(() => !!window.grove?.world || !!document.querySelector('.topbar'));
    }
    step('offline: the Grove boots', up);
    await page.waitForTimeout(3000);

    // 4a. A sprout round: entry prompt Play (else the picker button), then a game to its results.
    if (await visible('.edu-entry-card')) {
      const play = page.locator('.edu-entry-btn').filter({ hasText: /Play/i }).first();
      if (await play.count()) await play.tap();
      await page.waitForTimeout(800);
    }
    if (!(await visible('.edu-pick'))) {
      await w(() =>
        [...document.querySelectorAll('button')]
          .find((b) => b.getAttribute('aria-label') === 'Play & learn' && b.offsetParent)
          ?.click(),
      );
      await page.waitForTimeout(800);
    }
    const picker = await visible('.edu-pick');
    step('offline: the games picker opens', picker);
    await shot('2-offline-picker');

    // 4b. Nova's postcard: the real button, not the "connect once" picture card.
    const missing = await visible('.edu-postcard-missing');
    step('offline: the postcard button is the real one (chunk loaded)', picker && !missing);
    const card = page.locator('.edu-pick:visible').filter({ hasText: /💌/ }).first();
    if (await card.count()) {
      await tapCentre(card);
      await page.waitForTimeout(1200);
      step('offline: the postcard opens', await visible('.lang-postcard'));
      await shot('3-offline-postcard');
      // A word clip: the course words need a met word, so check the clip file is served from
      // the cache, and play the first word tile when the postcard shows one.
      const tileCount = await page.locator('.lang-tile:visible, .lang-row:visible').count();
      if (tileCount > 0)
        await tapCentre(page.locator('.lang-tile:visible, .lang-row:visible').first());
      const clip = await w(async () => {
        const base = new URL(document.baseURI).pathname.replace(/[^/]*$/, '');
        try {
          const r = await fetch(`${base}audio/lang/placeholder.wav`);
          return r.ok ? (await r.arrayBuffer()).byteLength : -1;
        } catch {
          return -1;
        }
      });
      step('offline: a word clip file is still served', clip > 0, `${clip} bytes`);
      await w(() => {
        for (const m of document.querySelectorAll('.modal')) m.hidden = true;
      });
      await page.waitForTimeout(400);
      if (!(await visible('.edu-pick'))) {
        await w(() =>
          [...document.querySelectorAll('button')]
            .find((b) => b.getAttribute('aria-label') === 'Play & learn' && b.offsetParent)
            ?.click(),
        );
        await page.waitForTimeout(800);
      }
    } else step('offline: the postcard opens', false, 'no postcard tile in the picker');

    if (await visible('.edu-pick')) {
      const pick = page
        .locator('.edu-picker .edu-grid:visible')
        .last()
        .locator('.edu-pick')
        .first();
      await tapCentre(pick);
      await page.waitForTimeout(2500);
      let taps = 0;
      for (let k = 0; k < ROUNDS_MAX && !(await visible('.edu-results')); k++) {
        const next = page.locator('.edu-next:visible').first();
        if (await next.count()) await tapCentre(next);
        else {
          const opt = page
            .locator('.edu-card .edu-option:visible:not([disabled]):not(.right)')
            .first();
          if (!(await opt.count())) {
            await page.waitForTimeout(500);
            continue;
          }
          if (await tapCentre(opt)) taps++;
        }
        await page.waitForTimeout(450);
      }
      await page.waitForTimeout(1500);
      step(
        'offline: a sprout round reaches its results card',
        await visible('.edu-results'),
        `${taps} taps`,
      );
      await shot('4-offline-results');
    } else step('offline: a sprout round reaches its results card', false, 'no game tiles');

    const said = await w(() => window.__said.length);
    step('offline: speech was attempted', said > 0, `${said} lines said`);
  } catch (e) {
    step('smoke run', false, String(e).slice(0, 300));
  }

  await browser.close();
  const failed = steps.filter((s) => !s.ok);
  for (const e of errors) console.log(`ERROR ${e}`);
  console.log(
    `\n${steps.length - failed.length}/${steps.length} steps passed, ${errors.length} errors, ${((Date.now() - t0) / 1000).toFixed(1)} s`,
  );
  process.exit(failed.length > 0 || errors.length > 0 ? 1 : 0);
})();
