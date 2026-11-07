/* global require, process, console, window, document, setTimeout */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * R0709 (KIDS-41): an automated accessibility check with axe-core on the main screens, at a
 * 375x812 phone and a 1280x800 desktop window. For each screen it injects axe-core, runs the
 * WCAG 2.0/2.1 A and AA rules (best-practice rules off) and FAILS on any violation whose impact
 * is serious or critical. Moderate and minor findings are printed as warnings only.
 *
 * Screens: (a) the title, (b) the Learning Grove age picker, (c) a started sprout Learning Grove
 * with its entry card, (d) the Play and learn games picker, (e) the grown-up area past the sum
 * gate, (f) the main game's Free Grove with Settings open and the Reading font set to
 * "Dyslexia-friendly (Lexend)" (which also proves the lazy font: no lexend woff2 request before
 * choosing it, one after).
 *
 * Only the game canvases are excluded from axe: they are drawing surfaces, not DOM content.
 * KNOWN_SKIPS (rule + selector, each with a reason) is for a violation that needs a design
 * decision; it never skips a whole rule.
 *
 * Not part of `npm test` (it needs a browser and a running server):
 *   npx vite --port 5173                (in another terminal)
 *   npm run smoke:a11y -- http://localhost:5173/
 * Env: PLAYWRIGHT_CORE (module path), EDGE (browser executable), SMOKE_HEADED=1 to watch,
 * A11Y_VIEWS=phone|desktop|both (default both).
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
const AXE_PATH = require.resolve('axe-core/axe.min.js');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const FAIL_IMPACTS = new Set(['serious', 'critical']);
/** { rule, selector (substring of an axe target), why }: a violation that needs a design decision. */
const KNOWN_SKIPS = [];
const t0 = Date.now();

const VIEWS = {
  phone: {
    name: '375x812',
    opts: {
      viewport: { width: 375, height: 812 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
  },
  desktop: { name: '1280x800', opts: { viewport: { width: 1280, height: 800 } } },
};

const errors = [];
const steps = [];
const failures = [];
const warnings = [];
function step(name, ok, note = '') {
  steps.push({ name, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${note ? `  (${note})` : ''}`);
}

async function runView(browser, view) {
  const ctx = await browser.newContext({ ...view.opts, bypassCSP: true });
  // bypassCSP: the page's CSP (script-src 'self') would block axe's injected inline script.
  await ctx.addInitScript(() => {
    const stub = {
      speak(u) {
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
  const lexend = [];
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${view.name} pageerror: ${String(e).slice(0, 200)}`));
  page.on('console', (m) => {
    // A 403 is reported (with its URL) by the response listener below, which skips the one
    // known dev-server case; the console line carries no URL, so it is skipped here.
    if (m.type() === 'error' && !/status of 403/.test(m.text()))
      errors.push(`${view.name} console.error: ${m.text().slice(0, 200)}`);
  });
  page.on('response', (r) => {
    // Dev-server only: this worktree's node_modules is a link to another checkout, which Vite's
    // file guard answers 403 for the font file (the request itself, which the Lexend step
    // counts, is still made). A production build and a plain checkout do not do this.
    if (r.status() === 403 && /@fontsource\/[a-z-]+\/files\/.*\.woff2/.test(r.url())) return;
    if (r.status() >= 400) errors.push(`${view.name} HTTP ${r.status()} ${r.url().slice(0, 160)}`);
  });
  page.on('request', (r) => {
    if (/lexend.*\.woff2/i.test(r.url())) lexend.push(r.url());
  });
  page.on('dialog', (d) => d.accept());
  const w = (fn, a) => page.evaluate(fn, a);
  const visible = (sel) =>
    w(
      (s) => [...document.querySelectorAll(s)].some((e) => e.offsetParent !== null && !e.hidden),
      sel,
    );

  /** Inject axe once per document, run it, and record the violations. */
  const axeCheck = async (label) => {
    await page.waitForTimeout(500);
    const hasAxe = await w(() => typeof window.axe !== 'undefined');
    if (!hasAxe) await page.addScriptTag({ path: AXE_PATH });
    const result = await page.evaluate(
      async (tags) =>
        // The canvases are drawing surfaces, not DOM content: nothing for axe to read there.
        window.axe.run(
          { exclude: [['canvas']] },
          { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] },
        ),
      TAGS,
    );
    const bad = [];
    for (const v of result.violations) {
      const nodes = v.nodes.filter(
        (n) => !KNOWN_SKIPS.some((k) => k.rule === v.id && n.target.join(' ').includes(k.selector)),
      );
      if (nodes.length === 0) continue;
      const fails = FAIL_IMPACTS.has(v.impact);
      const first = nodes.slice(0, 3).map((n) => n.target.join(' > '));
      let extra = '';
      if (v.id === 'color-contrast') {
        const d = nodes[0].any[0] && nodes[0].any[0].data;
        if (d)
          extra = `  e.g. ${d.fgColor} on ${d.bgColor} = ${d.contrastRatio}, needs ${d.expectedContrastRatio}`;
      }
      const line = `${v.id} [${v.impact}] x${nodes.length}: ${first.join(' | ')}${extra}`;
      if (fails) bad.push(line);
      else warnings.push(`${view.name} ${label}: ${line}`);
    }
    step(`${view.name} ${label}: no serious or critical axe violations`, bad.length === 0);
    for (const b of bad) {
      console.log(`      ${b}`);
      failures.push(`${view.name} ${label}: ${b}`);
    }
  };

  try {
    // (a) Title.
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('text=Slot 1', { timeout: 90000 });
    await axeCheck('title');

    // (b) Learning Grove age picker.
    const section = page.locator('.title-mode').filter({ hasText: 'Learning Grove' });
    await section.first().locator('button:has-text("Slot 1")').first().click();
    await page.waitForSelector('button.title-age', { timeout: 10000 });
    await page.waitForTimeout(600);
    await axeCheck('Learning Grove age picker');

    // (c) A started sprout Grove with its entry card.
    await page
      .locator('button.title-age')
      .filter({ has: page.locator('.title-age-n', { hasText: /^4$/ }) })
      .first()
      .click();
    await page.waitForTimeout(400);
    const nameIn = page.locator('input[type="text"]:visible').first();
    if (await nameIn.count()) await nameIn.fill('Maya');
    await page.locator('button:has-text("Start my Grove")').first().click();
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
    step(`${view.name} sprout Grove boots`, booted);
    for (let i = 0; i < 20 && !(await visible('.edu-entry-card')); i++)
      await page.waitForTimeout(500);
    step(`${view.name} entry card is showing`, await visible('.edu-entry-card'));
    await axeCheck('sprout Grove with entry card');

    // (d) The games picker.
    const play = page.locator('.edu-entry-btn').filter({ hasText: /Play/i }).first();
    if (await play.count()) await play.click();
    else
      await w(() =>
        [...document.querySelectorAll('button')]
          .find((b) => b.getAttribute('aria-label') === 'Play & learn' && b.offsetParent)
          ?.click(),
      );
    for (let i = 0; i < 20 && !(await visible('.edu-pick')); i++) await page.waitForTimeout(500);
    step(`${view.name} games picker opens`, await visible('.edu-pick'));
    await axeCheck('Play and learn games picker');

    // (e) The grown-up area past the gate (More, Grown-ups, a times-table sum).
    await w(() => {
      for (const m of document.querySelectorAll('.modal')) m.hidden = true;
    });
    await w(() =>
      [...document.querySelectorAll('.topbar button[aria-label*="More"]')]
        .find((b) => b.offsetParent)
        ?.click(),
    );
    await page.waitForTimeout(400);
    const gu = page.locator('.edu-places-grownups:visible').first();
    if (await gu.count()) {
      await gu.click();
      await page.waitForTimeout(500);
      const q = await w(() =>
        [...document.querySelectorAll('.help')]
          .map((h) => h.textContent ?? '')
          .find((t) => /×|times|\d+\s*[x×]\s*\d+/.test(t)),
      );
      const nums = (q ?? '').match(/\d+/g) ?? [];
      await axeCheck('grown-up sum gate');
      if (nums.length >= 2) {
        const input = page.locator('.edu-gate-input:visible').first();
        await input.fill(String(Number(nums[0]) * Number(nums[1])));
        await input.focus();
        await page.keyboard.down('Enter');
        await page.waitForTimeout(2500);
        await page.keyboard.up('Enter');
        await page.waitForTimeout(500);
      }
      const inside = await w(() => document.querySelectorAll('.grown-up-tab').length > 0);
      step(`${view.name} past the gate`, inside);
      await axeCheck('grown-up area');
      const tabs = await page.locator('.grown-up-tab:visible').count();
      for (let i = 1; i < tabs; i++) {
        await page.locator('.grown-up-tab:visible').nth(i).click();
        await axeCheck(`grown-up area tab ${i + 1}`);
      }
    } else step(`${view.name} grown-up button found`, false, 'More > Grown-ups not found');

    // (f) The main game's Free Grove, Settings open, Reading font set to Lexend.
    lexend.length = 0;
    await page.goto(`${BASE}?free&slot=3`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('.actionbar, #hud .topbar', { timeout: 120000 });
    await page.waitForTimeout(3500);
    await axeCheck('Free Grove HUD');
    await w(() =>
      [...document.querySelectorAll('.actionbar button, .topbar button')]
        .find(
          (e) => e.offsetParent && /settings/i.test(e.getAttribute('aria-label') || e.textContent),
        )
        ?.click(),
    );
    await page.waitForSelector('.settings-tabs', { timeout: 10000 });
    await page.waitForTimeout(500);
    step(
      `${view.name} no Lexend request before it is chosen`,
      lexend.length === 0,
      `${lexend.length}`,
    );
    // The Reading font row lives in one tab's pane: open that tab, then choose Lexend.
    const paneId = await w(() => {
      const row = [...document.querySelectorAll('label.field-row')].find((r) =>
        /Reading font/i.test(r.textContent || ''),
      );
      return row?.closest('[role="tabpanel"]')?.id ?? '';
    });
    if (paneId) await page.locator(`[aria-controls="${paneId}"]`).click();
    const fontSel = page
      .locator('label.field-row')
      .filter({ hasText: 'Reading font' })
      .locator('select')
      .first();
    await fontSel.selectOption({ label: 'Dyslexia-friendly (Lexend)' });
    for (let i = 0; i < 20 && lexend.length === 0; i++) await page.waitForTimeout(250);
    step(`${view.name} Lexend woff2 loads once chosen`, lexend.length > 0, `${lexend.length}`);
    await axeCheck('Free Grove Settings (Reading font Lexend)');
    const tabs = await page.locator('.settings-tab').count();
    for (let i = 0; i < tabs; i++) {
      await page
        .locator('.settings-tab')
        .nth(i)
        .evaluate((e) => e.click());
      await axeCheck(`Free Grove Settings tab ${i + 1} of ${tabs}`);
    }
  } catch (e) {
    step(`${view.name} run`, false, String(e).slice(0, 300));
  }
  await ctx.close();
}

(async () => {
  const launch = { headless: process.env.SMOKE_HEADED !== '1', args: ['--ignore-gpu-blocklist'] };
  if (fs.existsSync(EDGE)) launch.executablePath = EDGE;
  const browser = await chromium.launch(launch);
  const which = process.env.A11Y_VIEWS || 'both';
  const list =
    which === 'phone' ? ['phone'] : which === 'desktop' ? ['desktop'] : ['phone', 'desktop'];
  for (const k of list) await runView(browser, VIEWS[k]);
  await browser.close();
  const failed = steps.filter((s) => !s.ok);
  const uniq = [...new Set(warnings)];
  if (uniq.length) console.log(`\n${uniq.length} warning(s) (moderate or minor):`);
  for (const x of uniq) console.log(`WARN  ${x}`);
  for (const e of errors) console.log(`ERROR ${e}`);
  console.log(
    `\n${steps.length - failed.length}/${steps.length} steps passed, ${failures.length} serious/critical axe violation(s), ${errors.length} errors, ${((Date.now() - t0) / 1000).toFixed(1)} s`,
  );
  process.exit(failed.length > 0 || errors.length > 0 ? 1 : 0);
})();
