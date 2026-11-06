/* global require, process, console, window, document, getComputedStyle */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Phone UX smoke (hot/mobile-a11y, 2026-11-06): on the main screens at 375x812 (and again at
 * 812x375 landscape with MOBILE_LANDSCAPE=1), no visible control is smaller than 44 px either
 * way, nothing pokes out of the viewport sideways, the page never scrolls horizontally, and
 * every control has an accessible name. It walks the real UI with real touches (no dev
 * handles, so it runs against a production build): title, a Free Grove slot, the bottom
 * action bar, the Roster, Races, Shop, Keeper and Settings panels (every Settings tab), and
 * the stats sheet. Strips that scroll on purpose (`.settings-tabs`, `.wm-tabs`) may extend
 * past the edge.
 *
 * Not part of `npm test` (it needs a browser and a running server):
 *   npm run preview -- --port 4173      (after npm run build)
 *   npm run smoke:mobile -- http://localhost:4173/
 * Env: PLAYWRIGHT_CORE (module path), EDGE (browser executable), SMOKE_SHOTS (screenshot
 * folder, optional), MOBILE_LANDSCAPE=1 for 812x375.
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
const BASE = URL_ARG || process.env.SMOKE_URL || 'http://localhost:4173/';
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SHOTS = process.env.SMOKE_SHOTS || '';
const LANDSCAPE = process.env.MOBILE_LANDSCAPE === '1';
const VIEW = LANDSCAPE ? { width: 812, height: 375 } : { width: 375, height: 812 };
const MIN = 44;

const problems = [];
const errors = [];
let screens = 0;

/** Runs in the page: the measurements the checks read. */
function measure(minSize) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const SCROLLERS = '.settings-tabs, .wm-tabs, .title-ages';
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    for (let p = el; p; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.display === 'none' || s.visibility === 'hidden' || p.hidden) return false;
      if (p !== el && parseFloat(s.opacity) === 0) return false;
    }
    if (getComputedStyle(el).pointerEvents === 'none') return false;
    return r.bottom > 0 && r.right > 0 && r.left < vw && r.top < vh;
  };
  const name = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    const c = [...el.classList].slice(0, 2).join('.');
    if (c) s += `.${c}`;
    const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ');
    return t ? `${s} "${t.slice(0, 22)}"` : s;
  };
  const small = [];
  const off = [];
  const unnamed = [];
  const sel =
    'button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab]';
  for (const el of document.querySelectorAll(sel)) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    const lab = el.closest('label');
    const lr = lab ? lab.getBoundingClientRect() : null;
    const labelOk = lr && lr.width >= minSize - 0.5 && lr.height >= minSize - 0.5;
    const isRange = el.type === 'range';
    const tooSmall = isRange
      ? r.height < minSize - 0.5
      : r.width < minSize - 0.5 || r.height < minSize - 0.5;
    if (tooSmall && !labelOk)
      small.push(`${name(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
    const inScroller = !!el.closest(SCROLLERS);
    if (!inScroller && (r.right > vw + 1 || r.left < -1)) off.push(name(el));
    const label = (
      el.getAttribute('aria-label') ||
      el.getAttribute('aria-labelledby') ||
      el.textContent ||
      el.getAttribute('title') ||
      ''
    ).trim();
    const labelled = label || (el.labels && el.labels.length > 0);
    if (!labelled) unnamed.push(name(el));
  }
  const de = document.documentElement;
  const hscroll = de.scrollWidth > vw + 1 || document.body.scrollWidth > vw + 1;
  return { small, off, unnamed, hscroll, sw: de.scrollWidth, vw };
}

(async () => {
  const launch = { headless: process.env.SMOKE_HEADED !== '1', args: ['--ignore-gpu-blocklist'] };
  if (fs.existsSync(EDGE)) launch.executablePath = EDGE;
  const browser = await chromium.launch(launch);
  const ctx = await browser.newContext({
    viewport: VIEW,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 200)}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text().slice(0, 200)}`);
  });
  page.on('dialog', (d) => d.accept());

  const check = async (label) => {
    await page.waitForTimeout(400);
    const m = await page.evaluate(measure, MIN);
    screens++;
    const bad = [];
    if (m.hscroll) bad.push(`horizontal scroll (${m.sw} > ${m.vw})`);
    for (const s of m.small) bad.push(`under ${MIN}px: ${s}`);
    for (const s of m.off) bad.push(`off the edge: ${s}`);
    for (const s of m.unnamed) bad.push(`no accessible name: ${s}`);
    console.log(`${bad.length ? 'FAIL' : 'PASS'}  ${label}`);
    for (const b of bad) {
      console.log(`      ${b}`);
      problems.push(`${label}: ${b}`);
    }
    if (SHOTS) {
      fs.mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({ path: path.join(SHOTS, `${label.replace(/\W+/g, '-')}.png`) });
    }
  };
  const closePanel = async () => {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('.modal:not([hidden]) button, .sheet button')].find(
        (e) =>
          e.offsetParent && /close|×|✕/i.test(`${e.getAttribute('aria-label')} ${e.textContent}`),
      );
      if (b) b.click();
    });
    await page.waitForTimeout(400);
  };

  try {
    // Title.
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('.title-mode', { timeout: 120000 });
    await check('title');

    // A Free Grove slot (the sandbox, so no story gates), straight to play.
    await page.goto(`${BASE}?free&slot=3`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('.actionbar, #hud .topbar', { timeout: 120000 });
    await page.waitForTimeout(3500);
    await check('grove hud');

    // The bottom action bar, one panel at a time, by the buttons' accessible names.
    const panels = [
      ['Roster', /^Roster$/i],
      ['Races', /^Races$/i],
      ['Shop', /^Shop$/i],
      ['Keeper', /keeper/i],
      ['More', /^More$/i],
    ];
    for (const [label, re] of panels) {
      const ok = await page.evaluate((src) => {
        const rx = new RegExp(src, 'i');
        const b = [...document.querySelectorAll('.actionbar button, .topbar button')].find(
          (e) => e.offsetParent && rx.test((e.getAttribute('aria-label') || e.textContent).trim()),
        );
        if (b) b.click();
        return !!b;
      }, re.source);
      if (!ok) {
        const seen = await page.evaluate(() =>
          [...document.querySelectorAll('.actionbar button, .topbar button')]
            .map(
              (e) =>
                `${e.offsetParent ? '' : '(hidden) '}${e.getAttribute('aria-label') || e.textContent}`,
            )
            .join(' | '),
        );
        problems.push(`${label}: its action bar button was not found (saw: ${seen})`);
        console.log(`FAIL  ${label}: button not found (saw: ${seen})`);
        continue;
      }
      await check(label.toLowerCase());
      await closePanel();
      await page.keyboard.press('Escape').catch(() => {});
    }

    // The debug panel (backtick): it holds the narrow text fields and selects the audit caught.
    await page.keyboard.press('Backquote');
    await page.waitForSelector('.debug:not([hidden])', { timeout: 5000 }).catch(() => {});
    await check('debug panel');
    await page.keyboard.press('Backquote');
    await page.waitForTimeout(300);

    // Settings, every tab.
    await page.evaluate(() =>
      [...document.querySelectorAll('.actionbar button, .topbar button')]
        .find(
          (e) => e.offsetParent && /settings/i.test(e.getAttribute('aria-label') || e.textContent),
        )
        ?.click(),
    );
    await page.waitForSelector('.settings-tabs', { timeout: 10000 });
    const tabs = await page.locator('.settings-tab').count();
    for (let i = 0; i < tabs; i++) {
      await page
        .locator('.settings-tab')
        .nth(i)
        .evaluate((e) => e.click());
      await check(`settings tab ${i + 1} of ${tabs}`);
    }
    await closePanel();

    // The stats sheet of the first egg (tap it through the sim handle if the build has one).
    const opened = await page.evaluate(() => {
      const g = window.grove;
      if (!g || !g.world || !g.world.nubbins[0] || !window.groveUi) return false;
      window.groveUi.sheet.open(g.world.nubbins[0].id);
      return true;
    });
    if (opened) await check('stats sheet');
  } catch (e) {
    problems.push(`smoke stopped: ${String(e).slice(0, 300)}`);
  }
  await browser.close();
  for (const e of errors) problems.push(e);
  console.log(`\n${VIEW.width}x${VIEW.height}: ${screens} screens, ${problems.length} problem(s)`);
  process.exit(problems.length ? 1 : 0);
})();
