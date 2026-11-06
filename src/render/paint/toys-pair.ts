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

/** A skipping rope: phase 0 is the loop over the top, 1 is it sweeping the ground. */
function rope(phase: 0 | 1): Raster {
  const r = begin(PPU, PPU);
  const cord = hex('#e8c44a');
  const handle = hex('#c0503a');
  r.rect(2, 20, 3, 6, handle);
  r.rect(27, 20, 3, 6, handle);
  for (let x = 4; x <= 27; x++) {
    const t = (x - 4) / 23;
    const lift = Math.sin(t * Math.PI);
    const y = phase === 0 ? 21 - Math.round(lift * 15) : 22 + Math.round(lift * 4);
    r.rect(x, y, 1, 2, cord);
  }
  return finish(r);
}

function rubberDuck(): Raster {
  const r = begin(PPU, PPU);
  const yellow = hex('#f6d33a');
  r.disc(15, 21, 8, yellow);
  r.disc(21, 12, 5, yellow);
  r.rect(25, 12, 5, 2, hex('#f08a2a'));
  r.set(22, 10, hex('#222222'));
  r.disc(12, 20, 3.5, shade(yellow, 0.88));
  r.rect(9, 17, 3, 1, shade(yellow, 1.25));
  return finish(r);
}

function kite(): Raster {
  const r = begin(PPU, PPU);
  const sail = hex('#e04a6a');
  for (let y = 2; y <= 18; y++) {
    const half = y < 9 ? y - 2 : Math.round((18 - y) * 0.8);
    r.rect(16 - half, y, half * 2 + 1, 1, y % 2 ? sail : shade(sail, 1.15));
  }
  r.line(16, 2, 16, 18, hex('#fff3d0'));
  r.line(16, 18, 12, 24, hex('#7a4f2d'));
  r.line(12, 24, 17, 29, hex('#7a4f2d'));
  r.rect(10, 25, 4, 2, hex('#3a6ea8'));
  r.rect(15, 28, 4, 2, hex('#f6d33a'));
  return finish(r);
}

function crayonBox(): Raster {
  const r = begin(PPU, PPU);
  const box = hex('#3a8a5a');
  r.rect(5, 15, 22, 11, box);
  r.rect(5, 15, 22, 1, shade(box, 1.3));
  r.rect(5, 25, 22, 1, shade(box, 0.7));
  const cols = ['#e04a3a', '#f6d33a', '#3a6ea8', '#a06ad8', '#f08a2a'];
  cols.forEach((c, i) => {
    r.rect(7 + i * 4, 8 - (i % 2) * 2, 3, 8, hex(c));
    r.rect(7 + i * 4, 6 - (i % 2) * 2, 3, 2, shade(hex(c), 1.3));
  });
  r.rect(9, 19, 14, 3, hex('#fff3d0'));
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
  skippingRope: () => rope(0),
  'skippingRope-b': () => rope(1),
  rubberDuck,
  kite,
  crayonBox,
};
