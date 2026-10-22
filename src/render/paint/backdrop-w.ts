import { fbm, ridged } from './noise';
import { hash, hex, mix, Raster, rimObjects, shade } from './raster';

/**
 * M8: Corvin's backdrop hill with a feathered foot. The stock card (paint/story-art.ts)
 * ends in a hard horizontal line a few rows under its snow, which shows as a straight cut
 * across the field. This copy paints the same ridge, snow cap and slate flank, but its lowest
 * rows thin out on an ordered dither and take the floor's snow colour, so the hill settles
 * into the field instead of standing on a shelf.
 */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export const HILL_FEATHER = 30;

export function paintFeatheredHill(): Raster {
  const w = 384;
  const h = 96;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const floor = hex('#e8f1f9');
  for (let x = 0; x < w; x++) {
    const win = Math.pow(Math.sin((Math.PI * (x + 0.5)) / w), 0.7);
    const top = h - 6 - (6 + (fbm(x / 60, 0, 3, 7) * 56 + Math.sin(x / 33) * 6 + 14)) * win;
    for (let y = Math.max(0, Math.floor(top)); y < h; y++) {
      const depth = y - top;
      const snow = depth < 9 + fbm(x / 8, y / 8, 2, 9) * 8;
      let c = snow
        ? mix(hex('#e8f1f9'), hex('#c6d8e6'), depth / 18)
        : mix(hex('#5e7689'), hex('#3a4d5e'), (y - top) / 60);
      if (!snow && ridged(x / 9, y / 9, 2, 3) > 0.8) c = shade(c, 0.85);
      // The foot: across the last rows the hill takes the floor's colour and drops pixels on
      // an ordered dither plus a little noise, so there is no single edge to find.
      const into = (y - (h - HILL_FEATHER)) / HILL_FEATHER;
      if (into > 0) {
        const t = (BAYER[(y % 4) * 4 + (x % 4)]! + 0.5) / 16;
        const keep = 1 - into * into * (0.85 + hash(x >> 2, y >> 1, 12) * 0.3);
        if (t > keep) continue;
        c = mix(c, floor, Math.min(1, into * 0.9));
      }
      r.set(x, y, c);
    }
  }
  r.tracking = false;
  rimObjects(r);
  return r;
}
