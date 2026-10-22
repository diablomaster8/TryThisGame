import { fbm, vnoise } from './noise';
import { hex, mix, Raster, rimObjects } from './raster';

/**
 * M7: the two pieces that put the mill wheel in the stream. A wooden sluice (posts, a
 * crossbeam, a slanted board with the stream spilling off its lip) stands upstream of the
 * wheel, and a strip of white foam lies on the water under the paddles. Both are painted
 * still: they read as moving water without moving, so reduced motion has nothing to skip.
 */
const WOODS = ['#2e1f14', '#4a3320', '#6b4a2c', '#8b6540', '#a98354'].map(hex);

export const SLUICE_PX = { w: 56, h: 48 };
export const FOAM_PX = { w: 72, h: 44 };

export function paintSluice(): Raster {
  const { w, h } = SLUICE_PX;
  const r = new Raster(w, h, null);
  r.tracking = true;
  // Two posts and the beam across them.
  for (const x of [8, w - 14]) {
    r.rect(x, 8, 5, h - 12, WOODS[1]!);
    r.rect(x, 8, 2, h - 12, WOODS[2]!);
    r.rect(x + 4, 8, 1, h - 12, WOODS[0]!);
  }
  r.rect(4, 6, w - 8, 5, WOODS[2]!);
  r.rect(4, 6, w - 8, 1, WOODS[4]!);
  r.rect(4, 10, w - 8, 1, WOODS[0]!);
  // The sluice board, raised a hand: the dark slot under it where the water pushes through.
  r.rect(13, 12, w - 27, 8, WOODS[3]!);
  r.rect(13, 12, w - 27, 1, WOODS[4]!);
  r.rect(13, 19, w - 27, 1, WOODS[0]!);
  r.rect(15, 20, w - 31, 5, hex('#1c2c40'));
  // The spill: the stream coming off the lip in pale streaks and a splash at the foot.
  const water = hex('#7cc0ee');
  const pale = hex('#eef9ff');
  for (let y = 24; y < h - 3; y++)
    for (let x = 15; x < w - 15; x++) {
      const streak = fbm(x / 2.2, y / 7, 2, 311);
      if (streak < 0.38 - (y - 24) * 0.004) continue;
      const wob = Math.round((vnoise(y / 5, x / 9, 313) - 0.5) * 2);
      r.set(x + wob, y, mix(water, pale, Math.min(1, (streak - 0.38) * 3 + (y - 24) / 30)));
    }
  for (let x = 12; x < w - 12; x++) {
    const n = vnoise(x / 3, 5, 317);
    r.set(x, h - 4 + Math.round(n), pale);
    if (n > 0.5) r.set(x, h - 5, pale);
  }
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** White foam churned under the paddles, as it lies on the water seen from above. */
export function paintMillFoam(): Raster {
  const { w, h } = FOAM_PX;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const white = hex('#ffffff');
  const pale = hex('#cfeaff');
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = (x - w / 2) / (w / 2);
      const dy = (y - h / 2) / (h / 2);
      const d = dx * dx + dy * dy;
      if (d > 1) continue;
      const n = fbm(x / 3.5, y / 3, 3, 321);
      // Thick at the middle (the paddles), broken into flecks and lines at the rim.
      if (n + (1 - d) * 0.55 < 0.78) continue;
      // A dithered edge: every other pixel drops out across the outer fifth.
      if (d > 0.7 && (x + y) % 2 === 0) continue;
      r.set(x, y, n > 0.62 ? white : pale);
    }
  r.tracking = false;
  return r;
}
