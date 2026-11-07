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
 * folder, optional), MOBILE_LANDSCAPE=1 for 812x375, GRAPHICS=3d for Full 3D.
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
const GRAPHICS_3D = process.env.GRAPHICS === '3d';
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
  if (GRAPHICS_3D) {
    await ctx.addInitScript(() => {
      try {
        window.localStorage.setItem('grove.graphics', '3d');
      } catch {
        // Storage blocked: the smoke then runs in Pixel.
      }
    });
  }
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
    await page.goto(`${BASE}?free&slot=3&e2e&debug`, {
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });
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

    // The map (the compass opens it): the place labels must not sit on top of each other.
    await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .find((e) => e.offsetParent && /^compass/i.test(e.getAttribute('aria-label') || ''))
        ?.click(),
    );
    await page.waitForSelector('.wm-view', { timeout: 10000 }).catch(() => {});
    await check('map');
    const overlaps = await page.evaluate(() => {
      const chips = [...document.querySelectorAll('.wm-chips > *')].filter((e) => {
        const r = e.getBoundingClientRect();
        return e.offsetParent && r.width > 0 && r.height > 0;
      });
      const out = [];
      for (let i = 0; i < chips.length; i++) {
        for (let j = i + 1; j < chips.length; j++) {
          const a = chips[i].getBoundingClientRect();
          const b = chips[j].getBoundingClientRect();
          const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (w > 3 && h > 3) {
            const t = (e) => (e.textContent || '').trim().slice(0, 18);
            out.push(
              `"${t(chips[i])}" and "${t(chips[j])}" overlap ${Math.round(w)}x${Math.round(h)}`,
            );
          }
        }
      }
      return { n: chips.length, out };
    });
    console.log(`${overlaps.out.length ? 'FAIL' : 'PASS'}  map labels (${overlaps.n} on the map)`);
    for (const o of overlaps.out) {
      console.log(`      ${o}`);
      problems.push(`map labels: ${o}`);
    }
    await closePanel();
    await page.keyboard.press('Escape').catch(() => {});

    // The debug panel (backtick): it holds the narrow text fields and selects the audit caught.
    await page.keyboard.press('Backquote');
    await page
      .waitForSelector('.debug:not([hidden])', { timeout: 5000 })
      .catch(() => problems.push('debug panel: it did not open on the backtick (needs ?debug)'));
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

    // ---- A party, then a dojo bout and the Hollow (round 2) ----
    // `?e2e` gives the production build `window.grove`; the debug panel starts the bout.
    const hasGrove = await page.evaluate(() => !!(window.grove && window.grove.world));
    if (!hasGrove) {
      problems.push('window.grove is missing: the battle and Hollow steps need the ?e2e handle');
    } else {
      await page.evaluate(() => {
        const g = window.grove;
        for (const n of g.world.nubbins) {
          if (n.stage === 'egg') g.send({ kind: 'debugHatchNow', nubbinId: n.id });
        }
      });
      await page.waitForTimeout(3000);
      // Hatch and guide pop-ups sit over everything: dismiss them like a player would.
      const dismiss = async () => {
        for (let k = 0; k < 6; k++) {
          const did = await page.evaluate(() => {
            const rx = /^(close|skip|i know how to play|ok|got it|not now|later)\b/i;
            const b = [...document.querySelectorAll('button')].find(
              (e) =>
                e.getClientRects().length > 0 &&
                !e.closest('.debug, .battle-screen, .bs-prebout, .hollow-bar, .hollow-phone-bar') &&
                rx.test((e.textContent || '').replace(/[^\w ]/g, '').trim()),
            );
            if (b) b.click();
            return !!b;
          });
          if (!did) break;
          await page.waitForTimeout(500);
        }
      };
      await dismiss();

      // A dojo bout, from Debug > Battle: the sheet, the fight, and its side panels.
      await page.keyboard.press('Backquote');
      await page
        .waitForSelector('.debug:not([hidden])', { timeout: 5000 })
        .catch(() => problems.push('bout: the debug panel did not open'));
      await page.evaluate(() => {
        const det = document.querySelector('.debug-battle');
        if (det) det.open = true;
        const b = [...document.querySelectorAll('.debug-battle button')].find(
          (e) => e.textContent === 'Dojo T1',
        );
        if (b) b.click();
      });
      await page.keyboard.press('Backquote');
      await page.waitForSelector('.bs-prebout', { timeout: 10000 }).catch(() => {});
      await check('bout sheet');
      const playReach = await page.evaluate(() => {
        const b = [...document.querySelectorAll('.bs-prebout button')].find((e) =>
          /let.s play/i.test(e.textContent),
        );
        if (!b) return 'no "Let\'s play" button';
        const r = b.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= window.innerHeight
          ? ''
          : `"Let's play" is off the screen (${Math.round(r.top)}..${Math.round(r.bottom)} of ${window.innerHeight})`;
      });
      console.log(
        `${playReach ? 'FAIL' : 'PASS'}  bout sheet: start button on screen${playReach ? ` (${playReach})` : ''}`,
      );
      if (playReach) problems.push(`bout sheet: ${playReach}`);
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('.bs-prebout button')].find((e) =>
          /let.s play/i.test(e.textContent),
        );
        if (b) b.click();
      });
      await page.waitForSelector('.battle-screen .bs-tile', { timeout: 10000 }).catch(() => {});
      await check('battle');
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('.battle-screen button')].find((e) =>
          /^types/i.test((e.textContent || '').trim()),
        );
        if (b) b.click();
      });
      await check('battle types card');
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('button')].find(
          (e) => e.getClientRects().length > 0 && /^got it/i.test((e.textContent || '').trim()),
        );
        if (b) b.click();
      });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('.bs-tile')].find(
          (e) => e.getClientRects().length > 0 && !e.disabled,
        );
        if (b) b.click();
      });
      await page.waitForTimeout(3500);
      await check('battle after a move');
      // Leave the bout: Back, then whatever asks to confirm.
      for (let k = 0; k < 4; k++) {
        await page.evaluate(() => {
          // The confirmation's primary button leaves; otherwise Back asks first.
          const yes = document.querySelector('.bs-confirm:not([hidden]) .btn-primary');
          const back = [...document.querySelectorAll('.battle-screen button')].find(
            (e) => e.getClientRects().length > 0 && /back/i.test(e.textContent || ''),
          );
          const b = yes || back;
          if (b) b.click();
        });
        await page.waitForTimeout(700);
      }

      // The Hollow: the floor bar, the corner map, the phone bar and the engage button.
      await dismiss();
      await page.evaluate(() => window.grove.send({ kind: 'enterDungeon', daily: false }));
      await page
        .waitForSelector('.hollow-bar', { state: 'visible', timeout: 30000 })
        .catch(() => {});
      await page.waitForTimeout(GRAPHICS_3D ? 8000 : 3000);
      await dismiss();
      await check('hollow hud');
      const hollowOverlaps = await page.evaluate(() => {
        const rect = (sel) => {
          const e = [...document.querySelectorAll(sel)].find((x) => x.getClientRects().length > 0);
          return e ? e.getBoundingClientRect() : null;
        };
        const bar = rect('.hollow-bar');
        const pairs = [
          ['floor bar', bar],
          ['compass', rect('.compass')],
          ['corner map', rect('.hollow-map:not([hidden])')],
        ];
        const out = [];
        const over = (a, b) =>
          Math.min(a.right, b.right) - Math.max(a.left, b.left) > 3 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 3;
        for (let i = 0; i < pairs.length; i++) {
          for (let j = i + 1; j < pairs.length; j++) {
            const a = pairs[i][1];
            const b = pairs[j][1];
            if (a && b && over(a, b)) out.push(`${pairs[i][0]} sits on the ${pairs[j][0]}`);
          }
        }
        const fab = [...document.querySelectorAll('.hollow-engage-fab')].find(
          (x) => x.getClientRects().length > 0,
        );
        if (fab) {
          const r = fab.getBoundingClientRect();
          const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height - 4);
          if (top && top !== fab && !fab.contains(top)) {
            const what = `${top.tagName.toLowerCase()}.${[...top.classList].join('.')}`;
            out.push(`the engage button is covered by ${what}`);
          }
        }
        return out;
      });
      console.log(
        `${hollowOverlaps.length ? 'FAIL' : 'PASS'}  hollow hud: nothing sits on anything`,
      );
      for (const o of hollowOverlaps) {
        console.log(`      ${o}`);
        problems.push(`hollow hud: ${o}`);
      }
      const phoneBtn = async (re) =>
        page.evaluate((src) => {
          const rx = new RegExp(src, 'i');
          const b = [...document.querySelectorAll('.hollow-phone-bar button')].find(
            (e) => e.getClientRects().length > 0 && rx.test(e.textContent || ''),
          );
          if (b) b.click();
          return !!b;
        }, re.source);
      if (await phoneBtn(/map/)) {
        await check('hollow map');
        await phoneBtn(/map/);
      }
      if (await phoneBtn(/more/)) {
        await check('hollow more');
        await phoneBtn(/less|more/);
      }
      await page.evaluate(() => window.grove.send({ kind: 'leaveDungeon' }));
      await page.waitForTimeout(1500);
    }

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
