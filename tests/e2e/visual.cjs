/* eslint-disable */
/* TECH-12 (slice): visual regression for both renderers, opt-in (needs a browser):
 *   npm run test:visual                 compare with tests/e2e/golden/
 *   npm run golden:update               re-shoot the goldens
 *   node tests/e2e/visual.cjs --self    shoot each scene twice and compare the two (determinism)
 * Same env as run.cjs (E2E_URL, PLAYWRIGHT_CORE, E2E_BROWSER). Each scene loads a
 * fixed-seed scenario (src/dev/scenarios.ts) with `?e2e&still&debug` at a fixed wall-clock
 * instant in UTC, freezes the frame (`grove.test.freeze()`: particles off, reduced motion,
 * noon, the 3D governor and the story-box render hold off, a game clock that steps 1/60 s a
 * frame and then stands still), shoots the canvas at DPR 1 and compares it per pixel in the
 * page with the golden. A frame fails above 0.5% changed pixels in Pixel and 2% in 3D; diff
 * images land in tests/e2e/out/. R0454 (r12-d3): with those, two shots of a scene match to
 * under 0.05% (3D adults) and 0.000% (the rest) on one machine. The goldens in
 * tests/e2e/golden/ were shot with headless Edge 156 on Windows (SwiftShader): another GPU
 * stack or browser build needs its own (`npm run golden:update` there). E2E_SCENE=<part of a
 * name> runs only matching scenes; E2E_STATE=1 prints the camera and world each shot saw. */
const fs = require('fs');
const path = require('path');
const BASE = process.env.E2E_URL || 'http://localhost:4173';
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const update = process.argv.includes('--update');
// R0454 (r12-d3): shoot every scene a second time in a fresh page and diff it against the
// first, the check that a golden set can be trusted (no goldens are read or written).
const self = process.argv.includes('--self');
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
  // R0454 (r13-d4): six more looks, the type and alignment spread and the other weather and seasons.
  { name: 'adult-neutral-fly', scenario: 'child-about-to-evolve:neutral:fly', wait: 15000 },
  { name: 'adult-sun-swim', scenario: 'child-about-to-evolve:sun:swim', wait: 15000 },
  { name: 'adult-moon-run', scenario: 'child-about-to-evolve:moon:run', wait: 15000 },
  { name: 'adult-neutral-normal', scenario: 'child-about-to-evolve:neutral:normal', wait: 15000 },
  {
    name: 'grove-snow',
    scenario: 'fresh',
    prep: "g.send({ kind: 'debugSeason', season: 'winter' }); g.send({ kind: 'debugWeather', weather: 'snow' });",
  },
  {
    name: 'grove-autumn',
    scenario: 'fresh',
    prep: "g.send({ kind: 'debugSeason', season: 'autumn' });",
  },
];
// The phone portrait view (375x812) is shot for the first six scenes the rest at
// the desktop size only.
const CORE = [
  'grove-egg',
  'grove-child',
  'adult-sun-power',
  'adult-moon-swim',
  'eight-nubbins',
  'grove-rain',
];
const VIEWS = {
  desktop: { width: 800, height: 450, suffix: '' },
  phone: { width: 375, height: 812, suffix: '-phone' },
};
const SHOTS = SCENES.flatMap((s) =>
  (CORE.includes(s.name) ? ['desktop', 'phone'] : ['desktop']).map((v) => ({ ...s, view: v })),
);

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
    for (const [round, sc] of self
      ? SHOTS.flatMap((s) => [
          [0, s],
          [1, s],
        ])
      : SHOTS.map((s) => [1, s])) {
      if (
        process.env.E2E_SCENE &&
        !(sc.name + VIEWS[sc.view].suffix).includes(process.env.E2E_SCENE)
      )
        // The long-wait adults drift on the phone in 3D (windmill sails and tree sway, 4.3% between
        // runs against a 2% limit), so they are shot at the desktop size only there.
        if (mode === '3d' && sc.wait && sc.view === 'phone') continue;
      continue;
      const ctx = await browser.newContext({
        viewport: { width: VIEWS[sc.view].width, height: VIEWS[sc.view].height },
        // R0454: one zone and (below) one wall-clock instant, so the sky, the season and any
        // dated festival are the same on every run.
        timezoneId: 'UTC',
        bypassCSP: true, // newer playwright-core evaluates waitForFunction strings; the page's own CSP is checked by run.cjs
        deviceScaleFactor: 1,
      });
      if (mode === '3d')
        await ctx.addInitScript(() => {
          try {
            localStorage.setItem('grove.graphics', '3d');
          } catch {}
        });
      const page = await ctx.newPage();
      const file = `${sc.name}-${mode}${VIEWS[sc.view].suffix}.png`;
      try {
        await page.clock.setFixedTime(new Date('2026-06-21T12:00:00Z'));
        // `still`: every frame is exactly 1/60 s of game time from the first (main.ts).
        await page.goto(`${BASE}/?e2e&still&debug&scenario=${sc.scenario}&seed=7`, {
          waitUntil: 'domcontentloaded',
          timeout: 120000,
        });
        await page.waitForFunction(() => window.grove && window.grove.test, null, {
          timeout: 120000,
        });
        // R0454: past the loading veil (the sim holds while it is up), so the shot is the Grove.
        await page.waitForFunction(() => !document.querySelector('.load-veil'), null, {
          timeout: 240000,
        });
        await page.evaluate(`(() => { const g = window.grove; ${sc.prep || ''} })()`);
        // A wait is game time, run as ×10 frames of 1/60 s, so it ends on the same step anywhere.
        if (sc.wait)
          await page.evaluate(async (ms) => {
            const t = window.grove.test;
            t.setTimeScale(10);
            await t.frames(Math.ceil(ms / 10 / (1000 / 60)));
            t.setTimeScale(1);
          }, sc.wait);
        await page.evaluate(() => window.grove.test.freeze());
        // R0454: the frame clock settles in fixed steps, then holds; shoot once it holds.
        await page.waitForFunction(() => window.grove.test.frozen(), null, { timeout: 180000 });
        await page.waitForTimeout(300);
        // The fps readout and the toasts sit over the canvas and run on the real clock.
        await page.addStyleTag({ content: '.fps, .toast { visibility: hidden !important; }' });
        if (process.env.E2E_STATE)
          console.log(
            await page.evaluate(() => {
              const g = window.grove;
              const c = g.camera;
              const r = (v) => Math.round(v * 1000) / 1000;
              return JSON.stringify({
                yaw: r(c.currentYaw),
                vh: r(c.viewHeight ?? 0),
                k: [r(g.world.keeper.pos.x), r(g.world.keeper.pos.z)],
                n: g.world.nubbins.map((n) => [r(n.pos.x), r(n.pos.z)]),
                t: g.world.clock ?? g.world.timeMs,
                px: g.pixelGov ? g.pixelGov.level : null,
                wh: (() => {
                  const s = JSON.stringify(g.world);
                  let h = 0;
                  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
                  return [s.length, h, g.world.season, g.world.lastWallMs];
                })(),
                cam: g.scene3d ? g.scene3d.camera.position.toArray().map(r) : null,
                s3: g.scene3d
                  ? [
                      g.scene3d.camTarget.toArray().map(r),
                      r(g.scene3d.blend),
                      r(g.scene3d.yawOffset),
                      r(g.scene3d.hillClear.k),
                      r(g.scene3d.hillClear.lift),
                      g.scene3d.lastShot && [
                        g.scene3d.lastShot.kind,
                        r(g.scene3d.lastShot.x),
                        r(g.scene3d.lastShot.z),
                        r(g.scene3d.lastShot.distance),
                      ],
                      g.camera.target && [r(g.camera.target.x), r(g.camera.target.z)],
                      g.scene3d.lastMs,
                      g.renderPaused,
                    ]
                  : null,
              });
            }),
          );
        const shot = await page.locator('canvas').first().screenshot({ type: 'png' });
        const goldFile = self ? path.join(OUT, 'self-' + file) : path.join(GOLD, file);
        if (self && !round) {
          fs.writeFileSync(goldFile, shot);
          continue;
        }
        if (!self && (update || !fs.existsSync(goldFile))) {
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
