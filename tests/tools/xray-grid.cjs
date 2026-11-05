/* R0019 (round 13): the Pixel x-ray sweep over every tree, building, rock, scenery piece and fence post.
 * Run with the dev server up: node tests/tools/xray-grid.cjs <port> <w> <h> <rows.json>  (375 812 and 1280 800).
 * The Keeper stands 0.9 and 1.7 u behind each footprint; 3 frames each (normal, x-ray off, Keeper not
 * drawn). Exits 1 when any on-screen probe hides the Keeper even with the x-ray on. Needs playwright-core
 * and Edge as in recs-2026-10-27/tools/r4-d-lib.cjs. Result 2026-11-05: 256/256 at 375x812, 258/258 at 1280x800 (244 and 235 without). */
const { boot } = require(process.env.GROVE_BOOT_LIB || 'C:/Users/God/Downloads/Test Des/recs-2026-10-27/tools/r4-d-lib.cjs');
const PORT = process.argv[2] || '5193';
const W = +(process.argv[3] || 375), H = +(process.argv[4] || 812);
(async () => {
  const { browser, page, logs } = await boot('px', { w: W, h: H, url: `http://localhost:${PORT}/?debug` });
  const out = { rows: [], errors: [] };
  try {
    await page.evaluate(async () => {
      const g = window.grove;
      const b = g.view.batch;
      window.__mode = 'normal';
      const od = b.draw.bind(b), om = b.markXray.bind(b);
      b.draw = (d) => {
        const k = g.world.keeper.pos;
        const isK = window.__mode === 'nokeeper' && d.mode === 'billboard' && Math.abs(d.x - k.x) < 0.06 && Math.abs(d.z - k.z) < 0.06;
        window.__skipped = isK;
        if (isK) return;
        return od(d);
      };
      b.markXray = (c) => { if (window.__mode === 'normal') om(c); };
      const T = await import('/src/config/tuning.ts'); const SC = await import('/src/render/scenery.ts');
      window.__spots = [
        ...g.world.trees.map((t) => ({ kind: 'tree', x: t.pos.x, z: t.pos.z })),
        ...SC.SCENERY.filter((q) => !String(q.kind).startsWith('log')).map((q) => ({ kind: 's-' + q.kind, x: q.x, z: q.z })),
        ...SC.fenceSpots().map((f) => ({ kind: 'fence', x: f.x, z: f.z })),
        ...Object.entries(T.GROVE.buildings).map(([id, bb]) => ({ kind: id, x: bb.x, z: bb.z, r: bb.r })),
        ...T.GROVE.rocks.map((r) => ({ kind: 'rock', x: r.x, z: r.z, r: r.r })),
              ];
    });
    const spots = await page.evaluate(() => window.__spots);
    const shot = async () => (await page.screenshot({ scale: 'css' })).toString('base64');
    const diff = (a, b, box) => page.evaluate(async ([a, b, box]) => {
      const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height;
      const x = c.getContext('2d', { willReadFrequently: true });
      const sc = ia.width / innerWidth;
      const rd = (im) => { x.clearRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0); const [x0, y0, x1, y1] = box.map((v) => Math.round(v * sc)); return x.getImageData(Math.max(0, x0), Math.max(0, y0), Math.max(1, x1 - x0), Math.max(1, y1 - y0)).data; };
      const da = rd(ia), db = rd(ib);
      let n = 0;
      for (let i = 0; i < da.length; i += 4) if (Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])) > 36) n++;
      return Math.round(n / (sc * sc));
    }, [a, b, box]);
    for (const s of spots) {
      for (const d of [0.9, 1.7]) {
        const info = await page.evaluate(async ([s, d]) => {
          const g = window.grove;
          const cam = g.camera.camera;
          const tg = g.camera.target;
          let fx = tg.x - cam.position.x, fz = tg.z - cam.position.z;
          const l = Math.hypot(fx, fz) || 1; fx /= l; fz /= l;
          const k = g.world.keeper;
          const dd = d + (s.r || 0); k.pos.x = s.x + fx * dd; k.pos.z = s.z + fz * dd; k.moveTarget = null; k.intent = null;
          k.input.x = 0; k.input.z = 0;
          await new Promise((r) => setTimeout(r, 450));
          cam.updateMatrixWorld();
          const m = cam.matrixWorldInverse.elements, P = cam.projectionMatrix.elements;
          const p = { x: k.pos.x, y: 0.7, z: k.pos.z };
          const vx = m[0] * p.x + m[4] * p.y + m[8] * p.z + m[12];
          const vy = m[1] * p.x + m[5] * p.y + m[9] * p.z + m[13];
          const vz = m[2] * p.x + m[6] * p.y + m[10] * p.z + m[14];
          const cx = P[0] * vx + P[4] * vy + P[8] * vz + P[12], cy = P[1] * vx + P[5] * vy + P[9] * vz + P[13], cw = P[3] * vx + P[7] * vy + P[11] * vz + P[15];
          const c = g.canvas.getBoundingClientRect();
          return { x: c.left + ((cx / cw + 1) / 2) * c.width, y: c.top + ((1 - cy / cw) / 2) * c.height, W: innerWidth, H: innerHeight };
        }, [s, d]);
        const box = [info.x - 28, info.y - 40, info.x + 28, info.y + 30];
        const onScreen = info.x > 0 && info.x < info.W && info.y > 0 && info.y < info.H;
        if (!onScreen) { out.rows.push({ ...s, d, onScreen }); continue; }
        const frames = {};
        for (const mode of ['normal', 'noxray', 'nokeeper']) {
          await page.evaluate((m) => { window.__mode = m; }, mode);
          await page.waitForTimeout(160);
          frames[mode] = await shot();
        }
        await page.evaluate(() => { window.__mode = 'normal'; });
        const vis = await diff(frames.normal, frames.nokeeper, box);
        const share = await diff(frames.normal, frames.noxray, box);
        const plain = await diff(frames.noxray, frames.nokeeper, box);
        out.rows.push({ kind: s.kind, d, onScreen, visible: vis, withoutXray: plain, xrayAdds: share });
      }
    }
  } catch (e) { out.errors.push(String(e).slice(0, 300)); }
  out.consoleErrors = logs.filter((l) => /error|PAGEERR/i.test(l)).slice(0, 6);
  const rows = out.rows.filter((r) => r.onScreen);
  const T = 25;
  out.summary = {
    probes: out.rows.length, onScreen: rows.length,
    visibleWithXray: rows.filter((r) => r.visible > T).length,
    visibleWithoutXray: rows.filter((r) => r.withoutXray > T).length,
    xrayAddsPixels: rows.filter((r) => r.xrayAdds > T).length,
    hiddenEvenWithXray: rows.filter((r) => r.visible <= T).length,
  };
  console.log(JSON.stringify(out.summary), JSON.stringify(out.errors), JSON.stringify(out.consoleErrors));
  require('fs').writeFileSync(process.argv[5] || 'xray-rows.json', JSON.stringify(out.rows));
  await browser.close();
  if (out.summary.hiddenEvenWithXray > 0 || out.errors.length) process.exitCode = 1;
})();
