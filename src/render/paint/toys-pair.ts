import { hex, Raster, rimObjects, shade } from './raster';

/**
 * R0574: the pixel look of the new toys (seesaw in three tilts, sandbox, drum, bubble
 * wand), painted on the same 32 px frame as the older toys in `decor.ts`.
 */
const PPU = 32;

function begin(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** A seesaw: tilt is -1 (left end down), 0 (level) or 1 (right end down). */
function seesaw(tilt: -1 | 0 | 1): Raster {
  const r = begin(PPU, PPU);
  const plank = hex('#d89a4a');
  const cy = 20;
  // The plank: a thick line from one end to the other, tilted by `tilt` * 5 px.
  for (let x = 2; x <= 29; x++) {
    const y = cy + Math.round(((x - 15.5) / 13.5) * tilt * 5);
    r.rect(x, y - 1, 1, 3, plank);
    r.rect(x, y - 1, 1, 1, shade(plank, 1.25));
  }
  // Seats at the ends.
  const ly = cy + Math.round(-tilt * 5);
  const ry = cy + Math.round(tilt * 5);
  r.rect(1, ly - 3, 4, 2, hex('#e04a6a'));
  r.rect(27, ry - 3, 4, 2, hex('#3a6ea8'));
  // The post.
  r.rect(13, cy + 2, 5, 8, hex('#7a4f2d'));
  r.rect(10, cy + 9, 11, 2, hex('#5a3a1f'));
  return finish(r);
}

function sandbox(): Raster {
  const r = begin(PPU, PPU);
  const wood = hex('#9a6a3a');
  r.rect(3, 14, 26, 12, hex('#e8cf8a'));
  for (let x = 4; x < 28; x += 3) r.rect(x, 16 + (x % 5), 2, 1, hex('#d6b96c'));
  r.rect(3, 12, 26, 3, wood);
  r.rect(3, 12, 26, 1, shade(wood, 1.3));
  r.rect(3, 25, 26, 3, shade(wood, 0.75));
  r.rect(3, 12, 3, 16, shade(wood, 0.9));
  r.rect(26, 12, 3, 16, shade(wood, 0.8));
  // A little heap and a bucket.
  r.disc(14, 19, 3.2, hex('#f0dba0'));
  r.rect(20, 17, 4, 4, hex('#e04a3a'));
  r.rect(20, 17, 4, 1, shade(hex('#e04a3a'), 1.3));
  return finish(r);
}

function drum(): Raster {
  const r = begin(PPU, PPU);
  const body = hex('#c0503a');
  r.rect(7, 12, 18, 13, body);
  for (let y = 12; y < 25; y++) r.rect(7, y, 3, 1, shade(body, 1.2));
  r.rect(22, 12, 3, 13, shade(body, 0.7));
  r.disc(16, 12, 9, hex('#f3e2b6'));
  r.rect(7, 24, 18, 2, hex('#e0b84a'));
  r.rect(7, 12, 18, 1, hex('#e0b84a'));
  // Sticks.
  r.line(10, 3, 15, 11, hex('#7a4f2d'));
  r.line(22, 3, 17, 11, hex('#7a4f2d'));
  return finish(r);
}

function bubbleWand(): Raster {
  const r = begin(PPU, PPU);
  r.line(16, 29, 16, 15, hex('#7a4f2d'));
  r.disc(16, 12, 5, hex('#cfeaff'), 0.55);
  r.disc(16, 12, 4.2, hex('#9ad0ff'), 0.4);
  for (const [x, y, s] of [
    [8, 6, 3],
    [24, 4, 2.4],
    [22, 14, 2],
    [10, 15, 1.6],
  ] as const) {
    r.disc(x, y, s, hex('#9ad0ff'));
    r.disc(x, y, s - 1, hex('#e8f6ff'));
    r.set(x - 1, y - 1, hex('#ffffff'));
  }
  return finish(r);
}

/** Every new toy frame, keyed as the sprite batch looks them up. */
export const PAIR_TOY_FRAMES: Record<string, () => Raster> = {
  seesaw: () => seesaw(0),
  'seesaw-l': () => seesaw(-1),
  'seesaw-r': () => seesaw(1),
  sandbox,
  drum,
  bubbleWand,
};
