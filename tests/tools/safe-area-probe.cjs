/* global require, process, console, window, document, getComputedStyle, setTimeout */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * R0518 (TECH-77): the installed-iPhone safe-area probe. Headless browsers report zero
 * safe-area insets, so the probe overrides the `--safe-*` variables every inset rule reads
 * (style.css `:root`) with a notched phone's insets (47 px top, 34 px bottom by default),
 * boots the Free Grove at 390x844 portrait (and 844x390 landscape, with the insets on the
 * sides), opens the HUD's main panels in turn and fails if any visible control's box enters
 * an inset. Needs a server: `npx vite preview` or `npm run dev` (PROBE_URL).
 * Run: `node tests/tools/safe-area-probe.cjs` (not part of `npm test`: it needs a browser).
 */
const { chromium } = require(
  process.env.PLAYWRIGHT_CORE || 'C:/Users/God/AppData/Local/Temp/node_modules/playwright-core',
);
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.PROBE_URL || 'http://localhost:5173/?free';
const TOP = Number(process.env.SAFE_TOP || 47);
const BOTTOM = Number(process.env.SAFE_BOTTOM || 34);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Every visible control whose box crosses an inset, as readable lines. */
function overlaps(insets) {
  const out = [];
  const W = window.innerWidth;
  const H = window.innerHeight;
  // Panels count too: a tall card under the notch shows its scrolled rows there.
  const sel =
    'button, a[href], input, select, textarea, [role="button"], [tabindex="0"], .modal-card, .dialogue-box';
  for (const elx of document.querySelectorAll(sel)) {
    const r = elx.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const cs = getComputedStyle(elx);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    if (elx.closest('[hidden]') || elx.closest('[aria-hidden="true"]')) continue;
    // Off-screen (a scrolled list, a parked drawer) is not "under the notch".
    if (r.bottom <= 0 || r.top >= H || r.right <= 0 || r.left >= W) continue;
    const hit = [];
    if (r.top < insets.top - 0.5) hit.push(`top ${Math.round(r.top)}`);
    if (r.bottom > H - insets.bottom + 0.5) hit.push(`bottom ${Math.round(H - r.bottom)}`);
    if (r.left < insets.left - 0.5) hit.push(`left ${Math.round(r.left)}`);
    if (r.right > W - insets.right + 0.5) hit.push(`right ${Math.round(W - r.right)}`);
    if (!hit.length) continue;
    // A scrolled-in row inside a panel is clipped by its scroller, which is the real box.
    let p = elx.parentElement;
    let clipped = false;
    while (p && p !== document.body) {
      const ps = getComputedStyle(p);
      if (/(auto|scroll|hidden)/.test(ps.overflowY + ps.overflowX)) {
        const pr = p.getBoundingClientRect();
        if (r.top < pr.top - 1 || r.bottom > pr.bottom + 1) clipped = true;
        break;
      }
      p = p.parentElement;
    }
    if (clipped) continue;
    const name = (elx.getAttribute('aria-label') || elx.textContent || elx.className || '').trim();
    out.push(
      `${elx.tagName.toLowerCase()}.${String(elx.className).split(' ')[0]} "${name.slice(0, 30)}": ${hit.join(', ')}`,
    );
  }
  return out;
}

async function run(browser, width, height, insets) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    hasTouch: true,
    isMobile: true,
  });
  await ctx.addInitScript((i) => {
    const css =
      `:root{--safe-top:${i.top}px!important;--safe-bottom:${i.bottom}px!important;` +
      `--safe-left:${i.left}px!important;--safe-right:${i.right}px!important}`;
    const add = () => {
      const s = document.createElement('style');
      s.textContent = css;
      document.head.appendChild(s);
    };
    if (document.head) add();
    else document.addEventListener('DOMContentLoaded', add);
  }, insets);
  const page = await ctx.newPage();
  await page.goto(URL);
  await wait(12000);
  const found = {};
  const look = async (label) => {
    const o = await page.evaluate(overlaps, insets);
    if (o.length) found[label] = o;
  };
  await look('grove');
  // The main panels: More, then each top-bar button that opens a modal, one at a time.
  const tops = await page.evaluate(() =>
    [...document.querySelectorAll('#hud .topbar button, #hud [aria-label="More"]')]
      .map((b) => b.getAttribute('aria-label'))
      .filter(Boolean),
  );
  for (const label of tops) {
    const b = page.locator(`#hud [aria-label="${label}"]`).first();
    if (!(await b.isVisible().catch(() => false))) continue;
    await b.click({ timeout: 3000 }).catch(() => undefined);
    await wait(800);
    await look(label);
    await page.keyboard.press('Escape');
    await wait(300);
  }
  await ctx.close();
  return found;
}

(async () => {
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const portrait = await run(browser, 390, 844, { top: TOP, bottom: BOTTOM, left: 0, right: 0 });
  const landscape = await run(browser, 844, 390, { top: 0, bottom: 21, left: TOP, right: TOP });
  await browser.close();
  let bad = 0;
  for (const [name, res] of [
    ['portrait', portrait],
    ['landscape', landscape],
  ]) {
    const keys = Object.keys(res);
    console.log(`${name}: ${keys.length ? 'controls in an inset' : 'clear'}`);
    for (const k of keys) {
      bad += res[k].length;
      console.log(`  [${k}]`);
      for (const line of res[k]) console.log(`    ${line}`);
    }
  }
  process.exit(bad ? 1 : 0);
})();
