import { placeDecorations, type Decoration } from '../render/decor';
import { cyl, sph, type Parts } from './prop-kit';
import { groveHeight, WATER_LEVEL } from './terrain';

/**
 * R0132 (WORLD-66): the pixel view's ground decoration (`render/decor.ts`) beyond the heart of
 * the Grove, in Full 3D from the same seeded list: tufts, flowers, reeds, mushrooms, pebbles and
 * stumps on the outer ring, so a spot like the north wood holds the same things in both views.
 * Added to the outer ring's merged `plain` mesh (`outer-ring.ts`), so it costs no draw call.
 */
const INNER = 28;

type Put = (
  geo: ReturnType<typeof cyl>,
  x: number,
  y: number,
  z: number,
  color: string,
  sx?: number,
  sy?: number,
) => void;

const MAKE: Partial<Record<Decoration['frame'], (put: Put, k: number) => void>> = {
  tuft: (put, k) => {
    for (let i = 0; i < 3; i++)
      put(
        cyl(0, 0.05, 0.38, 4),
        Math.cos(i * 2.1) * 0.08,
        0.19,
        Math.sin(i * 2.1) * 0.08,
        '#5d9a3c',
        1,
        0.8 + k * 0.4,
      );
  },
  tallgrass: (put, k) => {
    for (let i = 0; i < 4; i++)
      put(
        cyl(0, 0.045, 0.8, 4),
        Math.cos(i * 1.6) * 0.1,
        0.4,
        Math.sin(i * 1.6) * 0.1,
        '#6aa642',
        1,
        0.8 + k * 0.5,
      );
  },
  reed: (put, k) => {
    for (let i = 0; i < 3; i++)
      put(
        cyl(0.012, 0.025, 1.2, 4),
        (i - 1) * 0.12,
        0.6,
        ((i * 5) % 3) * 0.05,
        '#9aa85a',
        1,
        0.8 + k * 0.4,
      );
    put(sph(0.05, 5, 4), 0, 1.2, 0.04, '#6a4a2a', 1, 2.2);
  },
  daisy: (put) => {
    put(cyl(0.01, 0.01, 0.3, 4), 0, 0.15, 0, '#5a9a3a');
    put(sph(0.09, 6, 4), 0, 0.31, 0, '#f6f2e6', 1, 0.35);
    put(sph(0.04, 5, 4), 0, 0.33, 0, '#f2c84a');
  },
  bluebell: (put) => {
    put(cyl(0.01, 0.012, 0.34, 4), 0, 0.17, 0, '#5a9a3a');
    put(sph(0.05, 5, 4), 0.03, 0.34, 0, '#6a7ad8', 1, 1.2);
    put(sph(0.045, 5, 4), -0.03, 0.28, 0, '#7a8ae0', 1, 1.2);
  },
  mushroom: (put) => {
    put(cyl(0.04, 0.055, 0.18, 5), 0, 0.09, 0, '#f3ead2');
    put(sph(0.13, 6, 4), 0, 0.19, 0, '#d8483c', 1, 0.6);
  },
  pebble: (put) => {
    put(sph(0.16, 5, 4), 0, 0.05, 0, '#a8a49a', 1, 0.5);
    put(sph(0.09, 5, 4), 0.2, 0.03, 0.06, '#8d887e', 1, 0.5);
  },
  stump: (put) => {
    put(cyl(0.34, 0.4, 0.42, 7), 0, 0.21, 0, '#7a5230');
    put(cyl(0.3, 0.3, 0.03, 7), 0, 0.43, 0, '#d9a76a');
  },
};

/** Add the outer ring's decoration (|x| or |z| past the heart) to `P`'s plain mesh. */
export function addOuterDecor(P: Parts): number {
  let n = 0;
  placeDecorations().forEach((d, i) => {
    const make = MAKE[d.frame];
    if (!make || d.flat) return;
    if (Math.max(Math.abs(d.x), Math.abs(d.z)) < INNER) return;
    const y = groveHeight(d.x, d.z);
    if (y < WATER_LEVEL + 0.05) return;
    const k = ((i * 37) % 10) / 10;
    const put: Put = (geo, x, py, z, color, sx = 1, sy = 1) =>
      P.add('plain', geo, [d.x + x, y + py, d.z + z], color, [0, 0, 0], [sx, sy, sx]);
    make(put, k);
    n++;
  });
  return n;
}
