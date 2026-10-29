/* global require, process, console, window */
/* eslint-disable @typescript-eslint/no-require-imports */
/*
 * Contact sheets of the art species (pocket and digital lines) in both renderers, for the
 * likeness reviews (R0408). Needs a running dev server and a headless Chromium-family browser.
 *
 *   node tests/tools/contact-sheet.cjs <baseUrl> [outDir] [--family=pocket|digi]
 *        [--stage=baby|grown|champion|final] [--per=16] [--angles] [--silhouette] [--toon]
 *
 * Writes <outDir>/pixel-<family>.png (the `?sprites&family=` grid) and
 * <outDir>/3d-<family>-<n>.png (the stage's `&creature=art` line-up, `per` figures a page).
 * PLAYWRIGHT_CORE and EDGE_PATH override where playwright-core and the browser are found.
 */
const fs = require('fs');
const path = require('path');

const PW =
  process.env.PLAYWRIGHT_CORE || 'C:/Users/God/AppData/Local/Temp/node_modules/playwright-core';
const EDGE =
  process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}`));
const value = (name, fallback) => {
  const a = flag(name);
  return a && a.includes('=') ? a.split('=')[1] : fallback;
};
const plain = args.filter((a) => !a.startsWith('--'));
const base = (plain[0] || 'http://localhost:5173').replace(/\/$/, '');
const out = plain[1] || 'docs/samples/contact-sheets';
const families = flag('family') ? [value('family')] : ['pocket', 'digi'];
const stage = value('stage', '');
const per = Number(value('per', '16')) || 16;
const extra = ['angles', 'silhouette', 'toon']
  .filter((f) => flag(f))
  .map((f) => `&${f}`)
  .join('');

(async () => {
  const { chromium } = require(PW);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const stageQ = stage ? `&stage=${stage}` : '';
  for (const family of families) {
    await page.goto(`${base}/?sprites&family=${family}${stageQ}`);
    await page.waitForSelector('figure', { timeout: 30000 });
    // The gallery scrolls inside a fixed #app: let it grow so a full-page shot takes it all.
    await page.addStyleTag({
      content: '#app{position:static!important;height:auto!important;overflow:visible!important}',
    });
    const pixel = path.join(out, `pixel-${family}.png`);
    await page.screenshot({ path: pixel, fullPage: true });
    console.log('wrote', pixel);
    for (let offset = 0, n = 1; ; offset += per, n++) {
      const url = `${base}/?aaa=1&creature=art&family=${family}${stageQ}&max=${per}&offset=${offset}&pose=idle${extra}`;
      await page.goto(url, { waitUntil: 'commit', timeout: 120000 });
      await page.waitForFunction(() => window.groveStage, null, { timeout: 120000 });
      const count = await page.evaluate(() => window.groveStage.cast.length);
      if (!count) break;
      // Let the figures settle into the idle pose and the labels find their feet.
      await page.waitForTimeout(2500);
      const file = path.join(out, `3d-${family}-${n}.png`);
      await page.screenshot({ path: file });
      console.log('wrote', file, `(${count} figures)`);
      if (count < per * (flag('angles') ? 4 : 1)) break;
    }
  }
  await browser.close();
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  }
})();
