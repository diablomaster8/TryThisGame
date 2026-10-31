/* global require, process, console, __dirname, window, document, performance, setTimeout */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * WORLD-45: the world perf probe. Boots slot 1 at the phone viewport in headless Edge, in Pixel
 * then Full 3D, skips the opening, teleports to each Grove landmark and the four corners,
 * waits 2.5 s and records draw calls, triangles, sprites drawn and culled, GPU memory, the
 * heap and the governor. Writes docs/logs/world-perf.json, prints a table, and exits 1 when a
 * 3D spot is over the phone PERF_BUDGET (read from src/config/tuning-world.ts) or a pixel spot
 * draws more than PIXEL_SPRITES sprites. Needs a dev server: `npm run dev` (or PROBE_URL).
 * Run: `npm run probe:world` (not part of `npm test`: it needs a browser).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require(
  process.env.PLAYWRIGHT_CORE || 'C:/Users/God/AppData/Local/Temp/node_modules/playwright-core',
);
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
// A phone builds its creatures on the 64 grid (`SCULPT_RES.steps`); headless desktop Edge would
// pick 104 and triple their triangles, so the probe asks for the phone's grid (0: let it pick).
const SCULPT = process.env.PROBE_SCULPT ?? '64';
const URL =
  (process.env.PROBE_URL || 'http://localhost:5173/?debug') +
  (Number(SCULPT) > 0 ? `&sculptRes=${SCULPT}` : '') +
  (process.env.PROBE_NOLOD ? '&nolod' : '');
const ROOT = path.join(__dirname, '..', '..');
const tuning = fs.readFileSync(path.join(ROOT, 'src/config/tuning-world.ts'), 'utf8');
const m = /phone: \{ calls: ([\d_]+), tris: ([\d_]+)/.exec(tuning);
const BUDGET = { calls: Number(m[1].replace(/_/g, '')), tris: Number(m[2].replace(/_/g, '')) };
const PIXEL_SPRITES = 500;
const ALL_SPOTS = [
  ['heart', 0, 4],
  ['bridge', 9.6, -4.2],
  ['well', 3, 10],
  ['falls', 12.4, -10.4],
  ['cottage', -7, 12],
  ['dojo', 18, -2],
  ['school', -3, -16],
  ['oldTree', -8, -3],
  ['southBend', 11, 20],
  ['westHill', -12, 13],
  ['northWood', -28, -30],
  ['eastRidge', 30, -24],
  ['southMarsh', 6, 38],
  ['westMeadow', -32, 16],
  ['farOrchard', 26, 34],
  ['cornerNW', -44, -44],
  ['cornerNE', 44, -44],
  ['cornerSW', -44, 44],
  ['cornerSE', 44, 44],
  ['village', -21, 39],
];
// PROBE_SPOTS=heart,cornerSE probes only those; PROBE_BREAKDOWN=1 adds each spot's draw calls
// and triangles by category (creature, its hulls, shadow pass, scenery groups).
const SPOTS = process.env.PROBE_SPOTS
  ? ALL_SPOTS.filter((s) => process.env.PROBE_SPOTS.split(',').includes(s[0]))
  : ALL_SPOTS;
const BREAKDOWN = !!process.env.PROBE_BREAKDOWN;
// PROBE_SURVEY=1 probes at the survey zoom (R0073, zoom index -1) instead of the phone default.
const SURVEY = !!process.env.PROBE_SURVEY;
// PROBE_BREAKDOWN=all prints every category, not only the top 14.
const ALL_CATS = process.env.PROBE_BREAKDOWN === 'all';

/**
 * Close whatever dialogue is up (the opening, a discovery card): a story scene stages the
 * camera, and while one is open the view ignores the Keeper. Done once the box has stayed
 * closed for a second.
 */
async function clearDialogue(page) {
  const open = () => page.evaluate(() => !!document.querySelector('.dialogue')?.offsetParent);
  let shut = 0;
  for (let i = 0; i < 200 && shut < 4; i++) {
    if (!(await open())) {
      shut++;
      await page.waitForTimeout(250);
      continue;
    }
    shut = 0;
    const ch = page.locator('.btn-choice:visible');
    const sk = page.locator('.dialogue :text("Skip"):visible');
    // R0304's hands-on lines (the stuck gate, the cup) hide Skip; a synthetic click pushes,
    // and the gate gives on the second push.
    const act = await page.evaluate(() => {
      const b = document.querySelector('.line-act-btn');
      if (b) b.click();
      return !!b;
    });
    if (act) {
      await page.waitForTimeout(400);
      continue;
    }
    if (await ch.count())
      await ch
        .first()
        .click()
        .catch(() => {});
    else if (await sk.count())
      await sk
        .first()
        .click()
        .catch(() => {});
    else
      await page
        .locator('.dialogue-box')
        .click({ force: true })
        .catch(() => {});
    await page.waitForTimeout(150);
  }
}

async function probe(TAG) {
  const browser = await chromium.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') logs.push(msg.text().slice(0, 200));
  });
  page.on('pageerror', (e) => logs.push('PAGEERR ' + String(e).slice(0, 200)));
  page.on('dialog', (d) => d.accept());
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await page.waitForSelector('text=Slot 1', { timeout: 120000 });
  await page.locator('.title-graphics select').selectOption(TAG === 'px' ? 'pixel' : '3d');
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Slot 1")').first().click();
  await page.waitForTimeout(1500);
  await page.locator('button:visible', { hasText: 'Gardener' }).first().click();
  await page.waitForFunction(() => window.grove && window.grove.world, null, { timeout: 120000 });
  await page.waitForFunction(() => /[0-9]+ fps/.test(document.body.innerText), null, {
    timeout: 240000,
  });
  await page.waitForTimeout(TAG === '3d' ? 8000 : 2500);
  await clearDialogue(page);
  for (const id of await page.evaluate(() =>
    window.grove.world.nubbins.filter((n) => n.stage === 'egg').map((n) => n.id),
  ))
    await page.evaluate((id) => window.grove.send({ kind: 'debugHatchNow', nubbinId: id }), id);
  if (SURVEY) await page.evaluate(() => window.grove.camera.setZoom(-1));
  // PROBE_SEASON=spring|summer|autumn|winter forces the season first (R0118's dressing).
  if (process.env.PROBE_SEASON)
    await page.evaluate(
      (season) => window.grove.send({ kind: 'debugSeason', season }),
      process.env.PROBE_SEASON,
    );
  const rows = [];
  for (const [name, x, z] of SPOTS) {
    await page.evaluate(([x, z]) => window.grove.send({ kind: 'teleport', pos: { x, z } }), [x, z]);
    // Software GL can take most of a second per 3D frame: wait for fresh frames after the
    // teleport (the first few settle the camera), not only a fixed time.
    await page.waitForTimeout(500);
    await clearDialogue(page);
    // The camera eases after the Keeper: wait until it aims near them.
    await page
      .waitForFunction(
        () => {
          const g = window.grove;
          const k = g.world.keeper.pos;
          return Math.hypot(g.camera.target.x - k.x, g.camera.target.z - k.z) < 6;
        },
        null,
        { timeout: 30000 },
      )
      .catch(() => {});
    const f0 = await page.evaluate(() => window.grove.scene3d?.geoFrames ?? 0);
    await page.waitForTimeout(1500);
    await page
      .waitForFunction(
        (f) => !window.grove.scene3d || window.grove.scene3d.geoFrames >= f,
        f0 + 24,
        {
          timeout: 90000,
        },
      )
      .catch(() => {});
    if (ALL_CATS) await page.evaluate(() => (window.__probeAll = true));
    const cats =
      BREAKDOWN && TAG === '3d'
        ? await page.evaluate(async () => {
            const g = window.grove;
            const r = g.pipeline.renderer;
            const rigs = g.scene3d.creatureLod.rigs;
            // What a draw belongs to: the shadow pass, a creature rig (hull or body), or the
            // first named ancestor (or the geometry's type) for scenery.
            const cat = (scene, geo, obj, cam) =>
              (cam && cam.isOrthographicCamera && scene ? 'ortho:' : '') + cat0(scene, geo, obj);
            const cat0 = (scene, geo, obj) => {
              let o = obj;
              let named = '';
              while (o) {
                if (rigs.has(o))
                  return (
                    (scene ? '' : 'shadow:') + (obj.userData.hull ? 'creature-hull' : 'creature')
                  );
                if (!named && o.name) named = o.name;
                if (!named && o.userData && o.userData.cat) named = o.userData.cat;
                o = o.parent;
              }
              return (
                (scene ? '' : 'shadow:') +
                (named ||
                  (obj.isInstancedMesh ? 'inst:' : '') +
                    geo.type +
                    // PROBE_BREAKDOWN=all: tell unnamed meshes apart by material and size.
                    (window.__probeAll
                      ? `@${obj.material?.type}#${geo.attributes.position?.count ?? 0}`
                      : ''))
              );
            };
            const acc = {};
            const orig = r.renderBufferDirect;
            r.renderBufferDirect = function (camera, scene, geo, mat, obj, group) {
              const k = cat(scene, geo, obj, camera);
              const n =
                (group
                  ? group.count
                  : geo.index
                    ? geo.index.count
                    : (geo.attributes.position?.count ?? 0)) / 3;
              const t = Math.round(n * (obj.isInstancedMesh ? obj.count : 1));
              const a = (acc[k] = acc[k] || [0, 0]);
              a[0]++;
              a[1] += t;
              return orig.call(this, camera, scene, geo, mat, obj, group);
            };
            const f0 = g.scene3d.geoFrames;
            while (g.scene3d.geoFrames < f0 + 10) await new Promise((res) => setTimeout(res, 100));
            r.renderBufferDirect = orig;
            const fr = g.scene3d.geoFrames - f0;
            return Object.entries(acc)
              .map(([k, [c, t]]) => [k, Math.round(c / fr), Math.round(t / fr)])
              .sort((a, b) => b[1] - a[1]);
          })
        : null;
    if (cats) {
      console.log(`-- ${name}: category, calls, tris (per frame)`);
      for (const c of cats.filter((c, i) => ALL_CATS || i < 14 || c[2] > 20000))
        console.log('   ', c.join('	'));
    }
    rows.push({
      mode: TAG,
      spot: name,
      ...(await page.evaluate((f0) => {
        const g = window.grove;
        const r = g.pipeline.renderer.info;
        const s = g.scene3d;
        // Instances drawn: every visible instanced mesh's count (WORLD-14 caps them).
        const instances = (root) => {
          let n = 0;
          root.traverseVisible((o) => {
            if (o.isInstancedMesh) n += o.count;
          });
          return n;
        };
        const heap = performance.memory
          ? Math.round(performance.memory.usedJSHeapSize / 1e6)
          : null;
        // 3D: the mean and the worst of the last 60 frames (a shadow redraw lands on some
        // frames only); the budget is judged on the mean.
        const fresh = s ? Math.min(60, s.geoFrames - f0 - 4) : 0;
        const geo = s ? s.frameGeo.slice(-Math.max(1, fresh)) : [];
        const mean = (i) => Math.round(geo.reduce((a, f) => a + f[i], 0) / geo.length);
        const max = (i) => Math.max(...geo.map((f) => f[i]));
        return {
          calls: s ? mean(0) : r.render.calls,
          tris: s ? mean(1) : r.render.triangles,
          maxCalls: s ? max(0) : null,
          maxTris: s ? max(1) : null,
          inView: s ? s.creatureLod.inView : null,
          far: s ? s.creatureLod.far : null,
          proxied: s ? s.creatureLod.proxied : null,
          instances: s ? instances(s.scene) : null,
          sprites: s ? null : g.view.batch.drawn,
          culled: s ? null : g.view.batch.culled,
          geometries: r.memory.geometries,
          textures: r.memory.textures,
          heapMB: heap,
          lod: s ? s.lodBias : null,
          gov: s ? `${s.governor.ratio}/cpu${s.governor.cpuLevel}` : null,
          frames: s ? fresh : null,
          aimOff: Math.round(
            Math.hypot(
              g.camera.target.x - g.world.keeper.pos.x,
              g.camera.target.z - g.world.keeper.pos.z,
            ),
          ),
        };
      }, f0)),
    });
  }
  await browser.close();
  return { rows, errors: logs };
}

(async () => {
  const t0 = Date.now();
  const all = [];
  const errors = {};
  for (const mode of (process.env.PROBE_MODES || 'px,3d').split(',')) {
    const r = await probe(mode);
    all.push(...r.rows);
    errors[mode] = r.errors;
  }
  const over = all.filter((r) =>
    r.mode === '3d' ? r.calls > BUDGET.calls || r.tris > BUDGET.tris : r.sprites > PIXEL_SPRITES,
  );
  const out = path.join(ROOT, 'docs/logs/world-perf.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(
    out,
    JSON.stringify(
      {
        when: new Date().toISOString(),
        budget: BUDGET,
        pixelSprites: PIXEL_SPRITES,
        rows: all,
        errors,
      },
      null,
      2,
    ) + '\n',
  );
  console.table(all);
  console.log(
    `${all.length} spots in ${Math.round((Date.now() - t0) / 1000)} s; over budget: ${over.length}`,
  );
  for (const r of over)
    console.log(`  OVER ${r.mode} ${r.spot}: calls ${r.calls} tris ${r.tris} sprites ${r.sprites}`);
  process.exit(over.length ? 1 : 0);
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(2);
});
