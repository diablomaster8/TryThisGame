import { fbm } from './noise';
import { hex, mix, Raster } from './raster';

/**
 * Campaign graphics 4, package d4, pixel painters: the Hush's fog puff (K17), a dithered
 * diagonal light band (K22) and the puddles (K34). Each is a small raster with a hard,
 * ordered-dither edge, drawn into the sprite batch like the other decals. Static: reduced
 * motion draws them as they are.
 */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x: number, y: number): number => (BAYER[(y % 4) * 4 + (x % 4)]! + 0.5) / 16;

export const FOG_PX = { w: 64, h: 28 };

/** K17: a flat-bottomed puff of ground fog, pale grey, dithered out across its top and rim. */
export function paintFogPuff(): Raster {
  const { w, h } = FOG_PX;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const light = hex('#dfe6ef');
  const mid = hex('#b9c4d3');
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = (x - w / 2) / (w / 2);
      const dy = (y - h * 0.72) / (h * 0.72);
      const wob = (fbm(x / 8, y / 6, 3, 521) - 0.5) * 0.5;
      const d = Math.sqrt(dx * dx + Math.max(0, dy) ** 2 * 1.3 + Math.min(0, dy) ** 2 * 2.2) + wob;
      if (d > 1) continue;
      // Solid at the core; the rim thins out on the ordered dither.
      if (d > 0.4 && bayer(x, y) < (d - 0.4) / 0.6) continue;
      r.set(x, y, mix(light, mid, Math.min(1, d * 0.9 + (y / h) * 0.25)));
    }
  r.tracking = false;
  return r;
}

export const RAY_PX = { w: 40, h: 72 };

/** K22: a soft diagonal shaft of morning light, dithered at its edges, brighter at its head. */
export function paintLightBand(): Raster {
  const { w, h } = RAY_PX;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const warm = hex('#ffd480');
  const pale = hex('#ffeaa6');
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      // A band leaning right as it goes down.
      const cx = w * 0.3 + (y / h) * w * 0.4;
      const d = Math.abs(x - cx) / (w * 0.26);
      const along = 1 - y / h;
      const dens = (1 - d) * (0.45 + 0.55 * along) + (fbm(x / 6, y / 9, 2, 531) - 0.5) * 0.25;
      if (dens <= 0.05) continue;
      if (bayer(x, y) > dens * 1.25) continue;
      r.set(x, y, mix(pale, warm, d));
    }
  r.tracking = false;
  return r;
}

export const PUDDLE_PX = { w: 40, h: 22 };

/** K34: a puddle seen from above: a dark, wet ellipse with a pale sky glint and a ragged rim. */
export function paintPuddle(seed: number): Raster {
  const { w, h } = PUDDLE_PX;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const rim = hex('#3d4a52');
  const water = hex('#5b7c96');
  const sky = hex('#a9c6dc');
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = (x - w / 2) / (w / 2);
      const dy = (y - h / 2) / (h / 2);
      const wob = (fbm(x / 6, y / 5, 3, 541 + seed) - 0.5) * 0.4;
      const d = Math.sqrt(dx * dx + dy * dy) + wob;
      if (d > 1) continue;
      if (d > 0.82 && bayer(x, y) < (d - 0.82) / 0.18) continue;
      let c = d > 0.78 ? rim : mix(water, sky, Math.max(0, 0.7 - d) * 0.6);
      // A short pale glint where the sky shows in the water.
      if (y === Math.round(h * 0.38) && Math.abs(dx + 0.25) < 0.28 && d < 0.7) c = sky;
      r.set(x, y, c);
    }
  r.tracking = false;
  return r;
}
