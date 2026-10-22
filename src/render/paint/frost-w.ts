import { fbm, ridged } from './noise';
import { hex, mix, Raster } from './raster';

/**
 * M14: the Hush's frost as it lies on the ground under a lantern it put out: a ragged grey
 * ellipse, solid at the middle and dithered out across its rim, with pale crystals and a few
 * cracks. Static, so reduced motion draws it as it is; the pixel view only scales it up.
 */
export const FROST_PX = { w: 96, h: 64 };

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function paintFrostDecal(): Raster {
  const { w, h } = FROST_PX;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const grey = hex('#8f9bae');
  const mid = hex('#aeb9c9');
  const light = hex('#d3dbe6');
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = (x - w / 2) / (w / 2);
      const dy = (y - h / 2) / (h / 2);
      const wob = (fbm(x / 9, y / 9, 3, 331) - 0.5) * 0.45;
      const d = Math.sqrt(dx * dx + dy * dy) + wob;
      if (d > 1) continue;
      const t = (BAYER[(y % 4) * 4 + (x % 4)]! + 0.5) / 16;
      // Solid in the middle; the outer third thins out on the ordered dither.
      if (d > 0.62 && t < (d - 0.62) / 0.38) continue;
      let c = mix(grey, mid, Math.min(1, d * 1.1));
      if (ridged(x / 8, y / 6, 2, 337) > 0.86) c = light;
      else if (fbm(x / 2.5, y / 2.5, 2, 339) > 0.7) c = mix(c, light, 0.7);
      r.set(x, y, c);
    }
  r.tracking = false;
  return r;
}
