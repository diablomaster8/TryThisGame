import type { CanvasTexture } from 'three';
import { GROVE } from '../config/tuning';
import { Rng } from '../sim/rng';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';

/** Pixels per world unit on the ground texture. */
export const GROUND_PPU = 8;

/**
 * The Grove floor as one texture: grass with seeded patches of lighter and darker
 * green, a worn dirt path from the Keeper's start to the pond and both trees, and
 * pebbles along the way. Drawn once; the plane maps to it 1:1.
 */
export function makeGroundTexture(seed = 7): CanvasTexture {
  const size = GROVE.size * GROUND_PPU;
  const pc = new PixelCanvas(size, size);
  const rng = new Rng(seed);
  const half = GROVE.size / 2;
  const toPx = (w: number) => (w + half) * GROUND_PPU;

  pc.rect(0, 0, size, size, C.grass);

  // Soft patches: blobs of lighter and darker grass.
  for (let i = 0; i < 70; i++) {
    const x = rng.float(0, size);
    const y = rng.float(0, size);
    const r = rng.float(6, 22);
    pc.ellipse(x, y, r, r * rng.float(0.5, 0.9), rng.chance(0.5) ? C.leaf : C.leafLight);
  }
  for (let i = 0; i < 30; i++) {
    const x = rng.float(0, size);
    const y = rng.float(0, size);
    const r = rng.float(4, 12);
    pc.ellipse(x, y, r, r * 0.7, C.grass);
  }

  // Dirt path: a polyline, stamped with discs so the edges are ragged.
  const path = (points: Array<{ x: number; z: number }>, width: number) => {
    for (let i = 0; i + 1 < points.length; i++) {
      const a = points[i]!;
      const b = points[i + 1]!;
      const steps = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) * 3);
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = toPx(a.x + (b.x - a.x) * t) + rng.float(-1, 1);
        const y = toPx(a.z + (b.z - a.z) * t) + rng.float(-1, 1);
        pc.disc(x, y, width * GROUND_PPU * rng.float(0.4, 0.55), C.sandDeep);
      }
    }
    for (let i = 0; i + 1 < points.length; i++) {
      const a = points[i]!;
      const b = points[i + 1]!;
      const steps = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) * 3);
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = toPx(a.x + (b.x - a.x) * t);
        const y = toPx(a.z + (b.z - a.z) * t);
        pc.disc(x, y, width * GROUND_PPU * 0.32, C.sand);
      }
    }
  };
  const start = GROVE.keeperStart;
  const pond = GROVE.pond;
  const [t1, t2] = GROVE.trees;
  path([start, { x: pond.x - pond.r - 1.2, z: pond.z - 1 }], 1.1);
  path([start, { x: t1.x + 1.5, z: t1.z + 1.5 }], 0.9);
  path([start, { x: t2.x - 1.5, z: t2.z + 1.5 }], 0.9);

  // Blade clusters: little V shapes in the lighter and darker greens.
  for (let i = 0; i < 420; i++) {
    const x = rng.int(1, size - 2);
    const y = rng.int(1, size - 2);
    const under = pc.get(x, y);
    if (under === C.sand || under === C.sandDeep) continue;
    const c = rng.chance(0.5) ? C.leafLight : rng.chance(0.5) ? C.forest : C.sprout;
    pc.dot(x, y + 0.5, c);
    pc.dot(x + 0.5, y, c);
    pc.dot(x + 1, y + 0.5, c);
  }
  // Clover patches: three-leaf clusters in the shade.
  for (let i = 0; i < 40; i++) {
    const x = rng.float(2, size - 2);
    const y = rng.float(2, size - 2);
    if (pc.get(Math.round(x), Math.round(y)) === C.sand) continue;
    for (const [dx, dy] of [
      [0, -0.6],
      [-0.6, 0.4],
      [0.6, 0.4],
    ] as const) {
      pc.ellipse(x + dx, y + dy, 0.55, 0.45, C.leafDeep);
    }
  }
  // Damp, darker grass around the pond and the waterfall pool.
  const shade = (wx: number, wz: number, r: number) => {
    const cx = toPx(wx);
    const cy = toPx(wz);
    for (let i = 0; i < 260; i++) {
      const a = rng.float(0, Math.PI * 2);
      const d = r * GROUND_PPU * rng.float(0.78, 1.12);
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d;
      if (pc.get(Math.round(x), Math.round(y)) === C.sand) continue;
      pc.disc(x, y, rng.float(0.5, 1.4), C.leafDeep);
    }
  };
  shade(pond.x, pond.z, pond.r + 0.8);
  shade(GROVE.waterfall.x - 3.6, GROVE.waterfall.z + 5.6, 2.2);
  // Worn rims along the paths.
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      if (pc.get(x, y) !== C.sandDeep) continue;
      const touchesGrass =
        pc.get(x - 1, y) === C.grass ||
        pc.get(x + 1, y) === C.grass ||
        pc.get(x, y - 1) === C.grass ||
        pc.get(x, y + 1) === C.grass;
      if (touchesGrass && rng.chance(0.6)) pc.px(x, y, C.leafDeep);
    }
  }

  // Pebbles and flowers in the grass.
  for (let i = 0; i < 180; i++) {
    const x = rng.int(0, size - 1);
    const y = rng.int(0, size - 1);
    const under = pc.get(x, y);
    if (under === C.sand || under === C.sandDeep) {
      pc.px(x, y, C.greyLight);
      continue;
    }
    const roll = rng.next();
    if (roll < 0.45) pc.px(x, y, C.sprout);
    else if (roll < 0.7) pc.px(x, y, C.forest);
    else if (roll < 0.85) {
      pc.px(x, y, C.white);
      pc.px(x + 1, y, C.cream);
    } else {
      pc.px(x, y, C.sunYellow);
    }
  }

  const texture = pc.toTexture();
  texture.flipY = true;
  return texture;
}
