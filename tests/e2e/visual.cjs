/* eslint-disable */
/* TECH-12 (slice): visual regression for both renderers, opt-in (needs a browser):
 *   npm run test:visual                 compare with tests/e2e/golden/
 *   npm run golden:update               re-shoot the goldens
 * Same env as run.cjs (E2E_URL, PLAYWRIGHT_CORE, E2E_BROWSER). Each scene loads a
 * fixed-seed scenario (src/dev/scenarios.ts) with `?e2e&debug`, freezes the frame
 * (`grove.test.freeze()`: particles off, reduced motion, a clock that barely runs), shoots
 * the canvas at DPR 1 and compares it per pixel in the page with the golden. A frame fails
 * above 0.5% changed pixels in Pixel and 2% in 3D; diff images land in tests/e2e/out/.
 * Software GL (SwiftShader) is deterministic on one machine image, so goldens are only
 * trusted from the CI image; locally a failure is a frame to look at. */
const fs = require('fs');
const path = require('path');
const BASE = process.env.E2E_URL || 'http://localhost:4173';
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const update = process.argv.includes('--update');
const GOLD = path.join(__dirname, 'golden');
const OUT = path.join(__dirname, 'out');
const LIMIT = { pixel: 0.005, '3d': 0.02 };
const SCENES = [
  { name: 'grove-egg', scenario: 'hatch-ready' },
  {
    name: 'grove-child',
    scenario: 'fresh',
    prep: "for (const n of g.world.nubbins) g.send({ kind: 'debugHatchNow', nubbinId: n.id });",
  },
  { name: 'adult-sun-power', scenario: 'child-about-to-evolve:sun:power', wait: 15000 },
  { name: 'adult-moon-swim', scenario: 'child-about-to-evolve:moon:swim', wait: 15000 },
  { name: 'eight-nubbins', scenario: 'eight-nubbins' },
  {
    name: 'grove-rain',
    scenario: 'fresh',
    prep: "g.send({ kind: 'debugWeather', weather: 'rain' });",
  },
];

(async () => {
  fs.mkdirSync(GOLD, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    ...(process.env.E2E_BROWSER ? { executablePath: process.env.E2E_BROWSER } : {}),
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  let failed = 0;
  for (const mode of process.env.E2E_MODE ? [process.env.E2E_MODE] : ['pixel', '3d']) {
    for (const sc of SCENES) {
      const ctx = await browser.newContext({
        viewport: { width: 800, height: 450 },
        deviceScaleFactor: 1,
      });
      if (mode === '3d')
        await ctx.addInitScript(() => {
          try {
            localStorage.setItem('grove.graphics', '3d');
          } catch {}
        });
      const page = await ctx.newPage();
      const file = `${sc.name}-${mode}.png`;
      try {
        await page.goto(`${BASE}/?e2e&debug&scenario=${sc.scenario}&seed=7`, {
          waitUntil: 'domcontentloaded',
          timeout: 120000,
        });
        await page.waitForFunction(() => window.grove && window.grove.test, null, {
          timeout: 120000,
        });
        await page.evaluate(`(() => { const g = window.grove; ${sc.prep || ''} })()`);
        if (sc.wait) await page.waitForTimeout(sc.wait);
        await page.evaluate(() => window.grove.test.freeze());
        await page.waitForTimeout(mode === '3d' ? 6000 : 2000);
        const shot = await page.locator('canvas').first().screenshot({ type: 'png' });
        const goldFile = path.join(GOLD, file);
        if (update || !fs.existsSync(goldFile)) {
          fs.writeFileSync(goldFile, shot);
          console.log(`gold ${file}`);
          continue;
        }
        const gold = fs.readFileSync(goldFile);
        const res = await page.evaluate(
          async ([a, b]) => {
            const load = (u) =>
              new Promise((ok, no) => {
                const i = new Image();
                i.onload = () => ok(i);
                i.onerror = no;
                i.src = u;
              });
            const [ia, ib] = await Promise.all([load(a), load(b)]);
            if (ia.width !== ib.width || ia.height !== ib.height) return { size: true };
            const px = (im) => {
              const c = document.createElement('canvas');
              c.width = im.width;
              c.height = im.height;
              const x = c.getContext('2d');
              x.drawImage(im, 0, 0);
              return x.getImageData(0, 0, im.width, im.height);
            };
            const A = px(ia),
              B = px(ib),
              D = new ImageData(ia.width, ia.height);
            let bad = 0;
            for (let i = 0; i < A.data.length; i += 4) {
              const d =
                Math.abs(A.data[i] - B.data[i]) +
                Math.abs(A.data[i + 1] - B.data[i + 1]) +
                Math.abs(A.data[i + 2] - B.data[i + 2]);
              if (d > 48) {
                bad++;
                D.data[i] = 255;
                D.data[i + 3] = 255;
              } else {
                D.data[i] = A.data[i] >> 2;
                D.data[i + 1] = A.data[i + 1] >> 2;
                D.data[i + 2] = A.data[i + 2] >> 2;
                D.data[i + 3] = 255;
              }
            }
            const c = document.createElement('canvas');
            c.width = D.width;
            c.height = D.height;
            c.getContext('2d').putImageData(D, 0, 0);
            return { frac: bad / (A.data.length / 4), diff: c.toDataURL('image/png') };
          },
          [
            'data:image/png;base64,' + shot.toString('base64'),
            'data:image/png;base64,' + gold.toString('base64'),
          ],
        );
        if (res.size || res.frac > LIMIT[mode]) {
          failed++;
          if (res.diff)
            fs.writeFileSync(
              path.join(OUT, 'diff-' + file),
              Buffer.from(res.diff.split(',')[1], 'base64'),
            );
          fs.writeFileSync(path.join(OUT, file), shot);
          console.log(
            `FAIL ${file}: ${res.size ? 'size changed' : (res.frac * 100).toFixed(2) + '% of pixels differ'}`,
          );
        } else console.log(`ok   ${file} (${(res.frac * 100).toFixed(3)}%)`);
      } catch (e) {
        failed++;
        console.log(`FAIL ${file}: ${String(e.message || e).slice(0, 200)}`);
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
