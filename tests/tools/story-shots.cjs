// The story screenshot recipe (campaign graphics 4, K50): the 84 frames the second pass's
// `final2` review used, in both renderers. Not in CI (GPU output varies); run by hand
// against a served build (`npm run build`, then `npx vite preview --port 5191`):
//
//   node tests/tools/story-shots.cjs <url> <playwright-core path> <outdir> [--golden] [--only <regex>]
//
// <url> is the game with `?debug` (e.g. http://localhost:5191/?debug). Frames are JPEGs
// named `<slug>-<pixel|3d>-<desk|phone>[-rm]-c<ch>-<0|1>.jpg`: frame 0 is the chapter's
// first frame after a debug jump, frame 1 after one advance. `--golden` shoots only the
// 16-frame reference set (docs/samples/golden/); `--only` keeps jobs whose tag matches.
// Compare a run with the reference set with tests/tools/story-shots-diff.cjs.
/* eslint-disable */
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const [url, pwPath, out] = args;
if (!url || !pwPath || !out) {
  console.log('usage: node story-shots.cjs <url> <playwright-core path> <outdir> [--golden] [--only <regex>]');
  process.exit(2);
}
const golden = args.includes('--golden');
const onlyAt = args.indexOf('--only');
const only = onlyAt >= 0 ? new RegExp(args[onlyAt + 1]) : null;
const { chromium } = require(pwPath);

const HAZEL = 'Hazel’s Grove';
/** The recipe: mode, slug, chapters, viewport, reduced motion. Both renderers each. */
const JOBS = [
  { mode: HAZEL, slug: 'hazel', chs: [1, 4, 9, 10, 11, 12], vp: 'desk' },
  { mode: 'The Hundred Days', slug: 'hundred', chs: [1, 9], vp: 'desk' },
  { mode: 'Logged In', slug: 'logged', chs: [4, 7], vp: 'desk' },
  { mode: 'The Beetle Road', slug: 'beetle', chs: [1, 3], vp: 'desk' },
  { mode: 'Dawn & Dusk', slug: 'dawn', chs: [1, 6], vp: 'desk' },
  { mode: HAZEL, slug: 'hazel', chs: [10, 12], vp: 'phone' },
  { mode: HAZEL, slug: 'hazel', chs: [10], vp: 'phone', rm: true },
  { mode: 'The Hundred Days', slug: 'hundred', chs: [1], vp: 'phone' },
  { mode: 'Logged In', slug: 'logged', chs: [1], vp: 'phone' },
  { mode: 'The Beetle Road', slug: 'beetle', chs: [1], vp: 'phone' },
  { mode: 'Dawn & Dusk', slug: 'dawn', chs: [1], vp: 'phone' },
];
/** The 16-frame reference set: these chapters' frame 0, in both renderers. */
const GOLDEN = [
  'hazel-desk-c1',
  'hazel-desk-c10',
  'hundred-desk-c1',
  'logged-desk-c4',
  'beetle-desk-c1',
  'dawn-desk-c1',
  'hazel-phone-c10',
  'hazel-phone-c12',
];

const tagOf = (j, gfx) => `${j.slug}-${gfx}-${j.vp}${j.rm ? '-rm' : ''}`;
const goldenHas = (j, ch) => !j.rm && GOLDEN.includes(`${j.slug}-${j.vp}-c${ch}`);

async function shoot(j, gfx) {
  const view = j.vp === 'phone' ? { width: 390, height: 844 } : { width: 1280, height: 720 };
  const chs = golden ? j.chs.filter((ch) => goldenHas(j, ch)) : j.chs;
  if (chs.length === 0) return 0;
  // A debug jump lands in the chapter's home location; Hazel's 11 and 12 still pass by 10.
  const route = golden && j.slug === 'hazel' && chs.some((c) => c > 10) ? [...new Set([10, ...chs])] : chs;
  const tag = tagOf(j, gfx);
  const b = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'],
  });
  const ctx = await b.newContext({ viewport: view, isMobile: j.vp === 'phone', hasTouch: j.vp === 'phone' });
  if (gfx === '3d')
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('grove.graphics', '3d');
      } catch {}
    });
  const p = await ctx.newPage();
  if (j.rm) await p.emulateMedia({ reducedMotion: 'reduce' });
  let errors = 0;
  p.on('pageerror', (e) => {
    errors++;
    console.log('ERR', e.message.slice(0, 200));
  });
  await p.goto(url);
  await p.waitForTimeout(4000);
  await p.click(`[aria-label="Start a new ${j.mode} in empty slot 1"]`);
  await p.waitForTimeout(1200);
  // Dawn & Dusk asks Dawn or Dusk first; then the Gardener Keeper. Only known options.
  for (let i = 0; i < 3; i++) {
    const btns = await p.$$eval('button', (bs) =>
      bs.map((x) => (x.getAttribute('aria-label') || x.textContent || '').trim()),
    );
    const pick =
      btns.find((t) => /^Gardener/.test(t)) || btns.find((t) => /^Dawn\b/.test(t) && !/Start a new/.test(t));
    if (!pick) break;
    await p.getByRole('button', { name: pick, exact: false }).first().click().catch(() => undefined);
    await p.waitForTimeout(1500);
    if (/^Gardener/.test(pick)) break;
  }
  await p.waitForTimeout(gfx === '3d' ? 25000 : 6000);
  const drain = async (n) => {
    for (let k = 0; k < n; k++) {
      const c = await p.$('.btn-choice');
      if (c) await c.evaluate((e) => e.click());
      else await p.keyboard.press('Enter');
      await p.waitForTimeout(250);
    }
  };
  await drain(30);
  let shots = 0;
  for (const ch of route) {
    await drain(30);
    await p.keyboard.press('Backquote');
    await p.waitForTimeout(600);
    const jb = await p.$(`[title="Jump to chapter ${ch}"]`);
    if (!jb) console.log('no jump', ch);
    else await jb.evaluate((e) => e.click());
    await p.waitForTimeout(400);
    await p.keyboard.press('Backquote');
    await p.waitForTimeout(gfx === '3d' ? 6000 : 3000);
    const keep = chs.includes(ch);
    for (const k of golden ? [0] : [0, 1]) {
      if (keep) {
        await p.screenshot({ path: path.join(out, `${tag}-c${ch}-${k}.jpg`), type: 'jpeg', quality: 80 });
        shots++;
      }
      await p.keyboard.press('Enter');
      await p.waitForTimeout(gfx === '3d' ? 2500 : 1200);
    }
    await drain(3);
  }
  console.log(tag, 'frames', shots, 'pageerrors', errors);
  await b.close();
  return shots;
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  let total = 0;
  for (const gfx of ['pixel', '3d'])
    for (const j of JOBS) {
      if (only && !only.test(tagOf(j, gfx))) continue;
      total += await shoot(j, gfx);
    }
  console.log('total frames', total);
})().catch((e) => {
  console.log('FAILED', e.message.split('\n')[0]);
  process.exit(1);
});
