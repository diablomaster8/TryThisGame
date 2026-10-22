// Compare a story-shots run with the reference set (campaign graphics 4, K50). Not in CI:
// GPU output varies, so a low score is a frame for a human to look at, not a failure.
//
//   node tests/tools/story-shots-diff.cjs <shots dir> <playwright-core path> [golden dir] [threshold]
//
// For each frame in the golden dir (default docs/samples/golden/) with a same-named frame in
// the shots dir, it computes SSIM on a grey copy scaled to 320 px wide (8x8 windows), in a
// headless Edge page (the browser decodes the JPEGs, so no image package is needed), and
// flags every frame under the threshold (default 0.9). Exits 1 when any is flagged.
/* eslint-disable */
const fs = require('fs');
const path = require('path');

const [shots, pwPath, goldenArg, thArg] = process.argv.slice(2);
if (!shots || !pwPath) {
  console.log('usage: node story-shots-diff.cjs <shots dir> <playwright-core path> [golden dir] [threshold]');
  process.exit(2);
}
const goldenDir = goldenArg || path.join(__dirname, '..', '..', 'docs', 'samples', 'golden');
const threshold = thArg ? Number(thArg) : 0.9;
const { chromium } = require(pwPath);

/** Runs in the page: SSIM of two images given as data URLs. */
function ssimInPage([a, b]) {
  const load = (src) =>
    new Promise((ok, fail) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = fail;
      im.src = src;
    });
  const grey = (im, w, h) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const x = c.getContext('2d');
    x.drawImage(im, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h).data;
    const g = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    return g;
  };
  return Promise.all([load(a), load(b)]).then(([ia, ib]) => {
    const w = 320;
    const h = Math.max(8, Math.round((ia.height / ia.width) * w));
    const ga = grey(ia, w, h);
    const gb = grey(ib, w, h);
    const C1 = (0.01 * 255) ** 2;
    const C2 = (0.03 * 255) ** 2;
    let sum = 0;
    let n = 0;
    for (let y = 0; y + 8 <= h; y += 4)
      for (let x = 0; x + 8 <= w; x += 4) {
        let ma = 0, mb = 0;
        for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
          ma += ga[(y + j) * w + x + i];
          mb += gb[(y + j) * w + x + i];
        }
        ma /= 64;
        mb /= 64;
        let va = 0, vb = 0, cov = 0;
        for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
          const da = ga[(y + j) * w + x + i] - ma;
          const db = gb[(y + j) * w + x + i] - mb;
          va += da * da;
          vb += db * db;
          cov += da * db;
        }
        va /= 63;
        vb /= 63;
        cov /= 63;
        sum += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
        n++;
      }
    return n ? sum / n : 1;
  });
}

(async () => {
  const names = fs.readdirSync(goldenDir).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  const b = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  });
  const p = await b.newPage();
  const data = (f) => {
    const mime = /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${fs.readFileSync(f).toString('base64')}`;
  };
  let flagged = 0;
  let missing = 0;
  for (const name of names) {
    const other = path.join(shots, name);
    if (!fs.existsSync(other)) {
      console.log('missing ', name);
      missing++;
      continue;
    }
    const s = await p.evaluate(ssimInPage, [data(path.join(goldenDir, name)), data(other)]);
    const low = s < threshold;
    if (low) flagged++;
    console.log(`${low ? 'LOOK    ' : 'ok      '}${s.toFixed(3)}  ${name}`);
  }
  await b.close();
  console.log(`${names.length} reference frames, ${flagged} under ${threshold}, ${missing} missing`);
  process.exit(flagged > 0 ? 1 : 0);
})().catch((e) => {
  console.log('FAILED', e.message.split('\n')[0]);
  process.exit(2);
});
