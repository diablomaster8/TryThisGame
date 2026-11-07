import { ACTS } from '../../config/dungeon-acts';
import { TILE_LOOKS, type TileLook } from '../../config/tuning-more/dungeon-tour-tiles';
import type { Floor } from '../../sim/dungeon';
import { openSky } from '../cave-bands';
import { fbm, ridged, vnoise } from './noise';
import { hash, mix, shade, type RGB } from './raster';

/**
 * Per-act tile looks for the Pixel Hollow (R0144, lane B r10): each act's tileset paints its
 * own ground and wall pattern over the colours its look already gives (`ACT_LOOKS`):
 * Cloister flagstones and clipped hedge, Sandglass ripples and cut blocks, Frostbell ice
 * with cracks and icicles, the Gloom's ash and cinder. Pure functions of a pixel, called
 * by the painters in `dungeon.ts` while they paint a floor's texture, once per floor.
 */

/** The tile look a floor wears: its tileset's, in an act's caves; null above ground. */
export function tileLookOf(f: Floor | null | undefined): TileLook | null {
  if (!f || openSky(f)) return null;
  const tileset = f.layout?.tileset ?? (f.act !== undefined ? ACTS[f.act]?.tileset : undefined);
  const look = tileset ? TILE_LOOKS[tileset] : undefined;
  return look && look.amount > 0 ? look : null;
}

const WHITE: RGB = [1, 1, 1];
const ICE: RGB = [0.82, 0.92, 1];
const ASH: RGB = [0.55, 0.53, 0.52];
const EMBER: RGB = [1, 0.62, 0.3];

const grey = (c: RGB): RGB => {
  const l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
  return [l, l, l];
};

/** A dry floor pixel at texture pixel (px, py), cell position (cx, cy) in cells. */
export function floorTile(
  look: TileLook,
  c: RGB,
  px: number,
  py: number,
  cx: number,
  cy: number,
): RGB {
  const k = look.amount;
  switch (look.floor) {
    case 'flags': {
      // Flagstones two to a cell, staggered by row, each its own tone, with dark joints.
      const fy = cy * 2;
      const row = Math.floor(fy);
      const fx = cx * 2 + (row % 2) * 0.5;
      const col = Math.floor(fx);
      const joint = Math.min(fx - col, 1 - (fx - col), fy - row, 1 - (fy - row));
      let out = shade(c, 0.9 + hash(col, row, 71) * 0.22);
      if (joint < 0.06) out = shade(out, 1 - 0.45 * k);
      else if (joint < 0.11) out = mix(out, WHITE, 0.1 * k);
      return out;
    }
    case 'sand': {
      // Wind ripples, bending with the noise, and the odd dark grain.
      const ripple = Math.sin((px + py * 0.35 + fbm(px / 30, py / 30, 2, 72) * 26) / 2.6);
      let out = shade(c, 1 + ripple * 0.09 * k);
      if (ripple > 0.85) out = mix(out, WHITE, 0.12 * k);
      if (hash(px, py, 73) < 0.012) out = shade(out, 0.7);
      return out;
    }
    case 'ice': {
      // Pale ice, bright crack lines and a soft diagonal sheen.
      let out = mix(c, ICE, 0.35 * k);
      if (ridged(px / 14, py / 14, 2, 74) > 0.86) out = mix(out, WHITE, 0.55 * k);
      const sheen = Math.sin((px - py) / 9 + vnoise(px / 40, py / 40, 75) * 3);
      if (sheen > 0.9) out = mix(out, WHITE, 0.2 * k);
      return out;
    }
    case 'ash': {
      // Grey ash in soft drifts, and a rare warm ember speck to find.
      let out = mix(c, grey(c), 0.35 * k);
      out = mix(out, ASH, fbm(px / 18, py / 18, 2, 76) * 0.3 * k);
      if (hash(px >> 1, py >> 1, 77) < 0.004) out = mix(out, EMBER, 0.7);
      return out;
    }
    default:
      return c;
  }
}

/** A wall-face pixel at (x, y) of a `w`×`h` face texture (wraps left to right). */
export function wallTile(look: TileLook, c: RGB, x: number, y: number, w: number): RGB {
  const k = look.amount;
  switch (look.wall) {
    case 'hedge': {
      // Clipped hedge: leafy clumps of light and shade over the band's moss.
      const leaf = fbm(x / 5, y / 5, 3, 81);
      let out = shade(c, 0.75 + leaf * 0.5 * k);
      if (hash(x, y, 82) > 0.97) out = mix(out, WHITE, 0.25 * k);
      return out;
    }
    case 'blocks': {
      // Cut stone courses, every other course staggered; dark mortar and a lit top edge.
      const course = Math.floor(y / 16);
      const along = (x + (course % 2) * 12) % 24;
      const inY = y % 16;
      let out = shade(
        c,
        0.92 + hash(Math.floor((x + (course % 2) * 12) / 24) % (w / 24), course, 83) * 0.16,
      );
      if (inY < 1.5 || along < 1.5) out = shade(out, 1 - 0.4 * k);
      else if (inY < 3) out = mix(out, WHITE, 0.12 * k);
      return out;
    }
    case 'icicles': {
      // Icicles hanging from the lip: long pale streaks thinning downward.
      const len = 18 + hash(x >> 1, 0, 84) * 50;
      const t = y / len;
      let out = mix(c, ICE, 0.25 * k);
      if (t < 1 && hash(x >> 1, 1, 85) > 0.45) out = mix(out, WHITE, (1 - t) * 0.6 * k);
      return out;
    }
    case 'cinder': {
      // Grey cinder with faint warm flecks.
      let out = mix(c, grey(c), 0.4 * k);
      if (hash(x, y, 86) > 0.992) out = mix(out, EMBER, 0.5);
      return out;
    }
    default:
      return c;
  }
}
