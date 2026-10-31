/* global require, process, console, window, document, setTimeout */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * R0722 (KIDS-54): a headless smoke test of the Learning Grove in a phone viewport. It opens
 * the title, picks Learning Grove slot 1, taps the age-4 tile and "Start my Grove", answers
 * the entry prompt with Play, plays one game to its results card with real taps on the option
 * centres (checking nothing covers them), taps through a few story lines if one is open, and
 * opens the grown-up area past the sum gate. It fails on any page error, console error or
 * failed request, and on a missed step. Speech is stubbed and counted.
 *
 * Not part of `npm test` (it needs a browser and a running server):
 *   npm run dev -- --port 5173          (in another terminal)
 *   npm run smoke:kids -- http://localhost:5173/
 * Env: PLAYWRIGHT_CORE (module path), EDGE (browser executable), SMOKE_SHOTS (folder for
 * screenshots, optional), SMOKE_HEADED=1 to watch it.
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
const BASE = URL_ARG || process.env.SMOKE_URL || 'http://localhost:5173/';
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SHOTS = process.env.SMOKE_SHOTS || '';
const ROUNDS_MAX = 40;
const t0 = Date.now();

const errors = [];
const steps = [];
function step(name, ok, note = '') {
  steps.push({ name, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${note ? `  (${note})` : ''}`);
}

(async () => {
  const launch = { headless: process.env.SMOKE_HEADED !== '1', args: ['--ignore-gpu-blocklist'] };
  if (fs.existsSync(EDGE)) launch.executablePath = EDGE;
  const browser = await chromium.launch(launch);
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
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
    if (m.type() === 'error') errors.push(`console.error: ${m.text().slice(0, 300)}`);
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
  /** A real touch at an element's centre, after checking nothing sits on top of it. */
  const tapCentre = async (handle) => {
    const box = await handle.boundingBox();
    if (!box) return { tapped: false, covered: false };
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const covered = await handle.evaluate(
      (el, p) => {
        const top = document.elementFromPoint(p.x, p.y);
        return !!top && top !== el && !el.contains(top);
      },
      { x, y },
    );
    await page.touchscreen.tap(x, y);
    return { tapped: true, covered };
  };

  try {
    // 1. Title: Learning Grove, slot 1, age 4, Start my Grove.
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('text=Slot 1', { timeout: 90000 });
    const section = page.locator('.title-mode').filter({ hasText: 'Learning Grove' });
    const slot = section.first().locator('button:has-text("Slot 1")').first();
    step('title shows a Learning Grove slot', (await slot.count()) > 0);
    await slot.click();
    await page.waitForTimeout(600);
    const age4 = page
      .locator('button.title-age')
      .filter({ has: page.locator('.title-age-n', { hasText: /^4$/ }) })
      .first();
    const ageOk = (await age4.count()) > 0;
    step('age 4 tile', ageOk);
    if (ageOk) await age4.tap();
    await page.waitForTimeout(400);
    const nameIn = page.locator('input[type="text"]:visible').first();
    if (await nameIn.count()) await nameIn.fill('Maya');
    await shot('1-start-step');
    const start = page.locator('button:has-text("Start my Grove")').first();
    step('Start my Grove button', (await start.count()) > 0);
    await start.tap();
    let booted = false;
    for (let i = 0; i < 90 && !booted; i++) {
      await page.waitForTimeout(1000);
      booted = await w(
        () =>
          !!window.grove?.world ||
          ([...document.querySelectorAll('.topbar')].some((e) => e.offsetParent) &&
            ![...document.querySelectorAll('.title-mode')].some((e) => e.offsetParent)),
      );
    }
    step('Grove boots', booted);
    await page.waitForTimeout(3000);
    const band = await w(() => window.grove?.world?.edu?.band ?? null);
    step('is a Learning Grove save', band === null || band === 'sprout', band ?? 'no dev handle');
    await shot('2-grove');

    // 2. The entry prompt: Play (else the 🎓 button).
    let picker = false;
    if (await visible('.edu-entry-card')) {
      const play = page.locator('.edu-entry-btn').filter({ hasText: /Play/i }).first();
      if (await play.count()) await play.tap();
      await page.waitForTimeout(800);
      picker = await visible('.edu-pick');
      step('entry prompt → Play opens the games', picker);
    }
    if (!picker) {
      await w(() =>
        [...document.querySelectorAll('button')]
          .find((b) => b.textContent.includes('🎓') && b.offsetParent)
          ?.click(),
      );
      await page.waitForTimeout(800);
      picker = await visible('.edu-pick');
      step('the games picker opens', picker);
    }

    // 3. One game, played with real taps to the results card.
    if (picker) {
      const pick = page.locator('.edu-pick:visible').first();
      await tapCentre(pick);
      await page.waitForTimeout(2500);
      let taps = 0;
      let covered = 0;
      for (let k = 0; k < ROUNDS_MAX && !(await visible('.edu-results')); k++) {
        const next = page.locator('.edu-next:visible').first();
        if (await next.count()) {
          await tapCentre(next);
        } else {
          const opt = page.locator('.edu-option:visible:not([disabled]):not(.right)').first();
          if (!(await opt.count())) {
            await page.waitForTimeout(500);
            continue;
          }
          const r = await tapCentre(opt);
          if (r.tapped) taps++;
          if (r.covered) covered++;
        }
        await page.waitForTimeout(450);
      }
      await page.waitForTimeout(1500);
      const results = await visible('.edu-results');
      step('a game reaches its results card', results, `${taps} option taps`);
      step('nothing covers the options', covered === 0, `${covered} covered taps`);
      await shot('3-results');
      await w(() => [...document.querySelectorAll('.edu-results-btn')].pop()?.click());
      await page.waitForTimeout(500);
    }
    const said = await w(() => window.__said.length);
    step('speech was used', said > 0, `${said} lines said`);

    // 4. A story line or two, if a scene is open now.
    if (await visible('.dialogue-box')) {
      for (let i = 0; i < 10 && (await visible('.dialogue-box')); i++) {
        const choice = page.locator('.dialogue-choices .btn:visible').first();
        if (await choice.count()) await choice.tap();
        else await page.locator('.dialogue-box').first().tap();
        await page.waitForTimeout(400);
      }
      step('story lines advance', true);
    }

    // 5. The grown-up area past the gate (More → Grown-ups, a times-table sum).
    await w(() => {
      for (const m of document.querySelectorAll('.modal')) m.hidden = true;
    });
    await w(() =>
      [...document.querySelectorAll('.topbar button[aria-label="More"]')]
        .find((b) => b.offsetParent)
        ?.click(),
    );
    await page.waitForTimeout(400);
    const gu = page.locator('.edu-places-grownups:visible').first();
    if (await gu.count()) {
      await gu.tap();
      await page.waitForTimeout(500);
      const q = await w(() =>
        [...document.querySelectorAll('.help')]
          .map((h) => h.textContent ?? '')
          .find((t) => /×|times|\d+\s*[x×]\s*\d+/.test(t)),
      );
      const nums = (q ?? '').match(/\d+/g) ?? [];
      if (nums.length >= 2) {
        const input = page.locator('.edu-gate-input:visible').first();
        await input.fill(String(Number(nums[0]) * Number(nums[1])));
        await input.focus();
        await page.keyboard.down('Enter');
        await page.waitForTimeout(2500);
        await page.keyboard.up('Enter');
        await page.waitForTimeout(500);
      }
      // R0718: the area is four tabs; open Progress and look for the report.
      const progressTab = page.locator('.grown-up-tab:visible').filter({ hasText: 'Progress' });
      step(
        'grown-up area has four tabs',
        (await page.locator('.grown-up-tab:visible').count()) === 4,
      );
      if (await progressTab.count()) {
        await progressTab.first().tap();
        await page.waitForTimeout(400);
      }
      const inside = await w(() =>
        [...document.querySelectorAll('h3')].some((h) =>
          /Progress|Grown-up tips/.test(h.textContent ?? ''),
        ),
      );
      step(
        'grown-up gate opens the grown-up area',
        inside,
        nums.length >= 2 ? '' : `gate text: ${q}`,
      );
      await shot('4-grown-ups');
    } else step('grown-up area button', false, 'More → Grown-ups not found');
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
