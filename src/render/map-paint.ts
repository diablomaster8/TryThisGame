/**
 * The drawn map's picture (WORLD-02): the Grove's own ground painter run at a few pixels per
 * unit, with the hills, the buildings and the stream's pond marked on top. Pure: it returns
 * pixels and knows nothing about the DOM, so both renderers' map uses the same picture.
 */
import { GROVE } from '../config/tuning';
import type { TileKind } from '../sim/types';
import { paintGround, type GroundPixels, type GroundSeason } from './ground';

/** Map pixels per world unit. */
export const MAP_PPU = 3;

/** World → map pixel (the map's origin is the Grove's north-west corner). */
export function toMapPx(v: number): number {
  return (v + GROVE.size / 2) * MAP_PPU;
}

const HILL = [92, 74, 52];
const ROOF = [146, 70, 52];

function blendDisc(
  p: GroundPixels,
  cx: number,
  cz: number,
  r: number,
  rgb: readonly number[],
  a: number,
  ring = false,
): void {
  const x0 = Math.max(0, Math.floor(toMapPx(cx - r)));
  const x1 = Math.min(p.width - 1, Math.ceil(toMapPx(cx + r)));
  const z0 = Math.max(0, Math.floor(toMapPx(cz - r)));
  const z1 = Math.min(p.height - 1, Math.ceil(toMapPx(cz + r)));
  const rp = r * MAP_PPU;
  for (let y = z0; y <= z1; y++) {
    for (let x = x0; x <= x1; x++) {
      const d = Math.hypot(x + 0.5 - toMapPx(cx), y + 0.5 - toMapPx(cz));
      if (d > rp || (ring && d < rp - 1.5)) continue;
      const i = (y * p.width + x) * 4;
      for (let c = 0; c < 3; c++)
        p.rgba[i + c] = Math.round(p.rgba[i + c]! * (1 - a) + rgb[c]! * a);
    }
  }
}

/** Paint the Grove's map: the ground, then a contour ring per hill and a roof per building. */
export function paintGroveMap(tiles: Record<string, TileKind>, season: GroundSeason): GroundPixels {
  const p = paintGround(7, tiles, MAP_PPU, season);
  for (const h of GROVE.hills) {
    blendDisc(p, h.x, h.z, h.r, HILL, 0.18);
    blendDisc(p, h.x, h.z, h.r, HILL, 0.55, true);
    blendDisc(p, h.x, h.z, h.r * 0.6, HILL, 0.35, true);
  }
  for (const b of Object.values(GROVE.buildings)) blendDisc(p, b.x, b.z, b.r * 0.8, ROOF, 0.85);
  return p;
}
