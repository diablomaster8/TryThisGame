import type { CanvasTexture } from 'three';
import { GROVE } from '../config/tuning';
import { Rng } from '../sim/rng';
import { BUILDINGS, SCENERY } from './scenery';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';

/** Design pixels per world unit on the ground texture (physical is twice that). */
export const GROUND_PPU = 8;

/**
 * The Grove floor as one texture, in the top-down RPG manner: dense three-tone grass
 * with tufts and flower clusters, rounded dirt paths with a lit centre and a dark rim,
 * a sandy shore with a wet band around the pond and the waterfall pool, shadow under
 * the trees, pads under the buildings and a crop plot by the cottage. Drawn once from a
 * fixed seed; the plane maps to it 1:1.
 */
export function makeGroundTexture(seed = 7): CanvasTexture {
  const size = GROVE.size * GROUND_PPU;
  const pc = new PixelCanvas(size, size);
  const rng = new Rng(seed);
  const half = GROVE.size / 2;
  const toPx = (w: number) => (w + half) * GROUND_PPU;
  const isDirt = (x: number, y: number) => {
    const c = pc.get(x, y);
    return c === C.sand || c === C.sandDeep || c === C.sandLight || c === C.darkBark;
  };

  // Base grass with broad light and dark drifts.
  pc.rect(0, 0, size, size, C.grass);
  for (let i = 0; i < 200; i++) {
    const x = rng.float(0, size);
    const y = rng.float(0, size);
    const r = rng.float(8, 26);
    pc.ellipse(x, y, r, r * rng.float(0.5, 0.9), rng.chance(0.55) ? C.leaf : C.leafLight);
  }
  for (let i = 0; i < 40; i++) {
    const x = rng.float(0, size);
    const y = rng.float(0, size);
    const r = rng.float(5, 14);
    pc.ellipse(x, y, r, r * 0.7, C.grass);
  }

  // Shore: a sand ring around the pond with a wet, darker inner band.
  const pond = GROVE.pond;
  const shore = (wx: number, wz: number, r: number) => {
    const cx = toPx(wx);
    const cy = toPx(wz);
    pc.ellipse(cx, cy, (r + 1.3) * GROUND_PPU, (r + 1.3) * GROUND_PPU, C.sandLight);
    pc.ellipse(cx, cy, (r + 0.9) * GROUND_PPU, (r + 0.9) * GROUND_PPU, C.sand);
    pc.ellipse(cx, cy, (r + 0.45) * GROUND_PPU, (r + 0.45) * GROUND_PPU, C.sandDeep);
    // Ragged outer edge.
    for (let i = 0; i < 90; i++) {
      const a = rng.float(0, Math.PI * 2);
      const d = (r + 1.3) * GROUND_PPU + rng.float(-1.5, 2.5);
      pc.disc(
        cx + Math.cos(a) * d,
        cy + Math.sin(a) * d,
        rng.float(1, 2.4),
        rng.chance(0.5) ? C.sandLight : C.leafDeep,
      );
    }
  };
  shore(pond.x, pond.z, pond.r);
  shore(GROVE.waterfall.x - 3.6, GROVE.waterfall.z + 5.6, 1.6);
  // Banks along the stream: sand, a wet band, a dark-grass edge.
  const bank = (points: ReadonlyArray<{ x: number; z: number }>) => {
    const w = GROVE.river.width;
    const stampAlong = (radius: number, colour: number, jitter: number) => {
      for (let i = 0; i + 1 < points.length; i++) {
        const a = points[i]!;
        const b = points[i + 1]!;
        const steps = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) * 4);
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          pc.disc(
            toPx(a.x + (b.x - a.x) * t) + rng.float(-jitter, jitter),
            toPx(a.z + (b.z - a.z) * t) + rng.float(-jitter, jitter),
            radius * GROUND_PPU,
            colour,
          );
        }
      }
    };
    stampAlong(w / 2 + 1.5, C.leafDeep, 1.4);
    stampAlong(w / 2 + 1.1, C.sandLight, 1.0);
    stampAlong(w / 2 + 0.7, C.sand, 0.6);
    stampAlong(w / 2 + 0.35, C.sandDeep, 0.3);
  };
  bank(GROVE.river.inflow);
  bank(GROVE.river.outflow);
  // Scree at the foot of each hill.
  for (const h of GROVE.hills) {
    const cx = toPx(h.x);
    const cy = toPx(h.z);
    for (let i = 0; i < 160; i++) {
      const a = rng.float(0, Math.PI * 2);
      const d = (h.r + rng.float(0.1, 1.3)) * GROUND_PPU;
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d;
      pc.disc(x, y, rng.float(0.6, 1.6), rng.chance(0.6) ? C.leafDeep : C.sandDeep);
      if (rng.chance(0.3)) pc.dot(x, y, C.greyLight);
    }
  }

  // Dirt paths: discs along a polyline; a lit centre, a darker rim, then a grass rim.
  const path = (points: Array<{ x: number; z: number }>, width: number) => {
    const stamp = (w: number, colour: number, jitter: number) => {
      for (let i = 0; i + 1 < points.length; i++) {
        const a = points[i]!;
        const b = points[i + 1]!;
        const steps = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) * 4);
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const x = toPx(a.x + (b.x - a.x) * t) + rng.float(-jitter, jitter);
          const y = toPx(a.z + (b.z - a.z) * t) + rng.float(-jitter, jitter);
          pc.disc(x, y, w * GROUND_PPU * 0.5, colour);
        }
      }
    };
    // Pale tan in the middle, a thin darker rim, a thin dark-grass edge.
    stamp(width + 0.3, C.leafDeep, 0.9);
    stamp(width, C.sandDeep, 0.6);
    stamp(width * 0.9, C.sand, 0.4);
    stamp(width * 0.7, C.sandLight, 0.25);
  };
  const start = GROVE.keeperStart;
  const [t1, t2] = GROVE.trees;
  const bridge = GROVE.bridge;
  path([start, { x: pond.x - pond.r - 1.4, z: pond.z - 1 }], 1.7);
  path([start, { x: t1.x + 1.6, z: t1.z + 1.6 }], 1.2);
  path([start, { x: 3, z: -3 }, { x: bridge.x - 1.6, z: bridge.z - 0.6 }], 1.2);
  path(
    [
      { x: bridge.x + 1.6, z: bridge.z + 0.6 },
      { x: 13.5, z: -6.5 },
      { x: BUILDINGS.dojo!.x - 1, z: BUILDINGS.dojo!.z + 1.8 },
    ],
    1.0,
  );
  path(
    [
      { x: 3, z: -3 },
      { x: t2.x - 1.6, z: t2.z + 1.6 },
      { x: BUILDINGS.school!.x + 0.5, z: BUILDINGS.school!.z + 2 },
    ],
    1.0,
  );
  path(
    [start, { x: -3, z: 9 }, { x: BUILDINGS.cottage!.x + 0.5, z: BUILDINGS.cottage!.z - 1.8 }],
    1.1,
  );
  path(
    [
      { x: -3, z: 9 },
      { x: BUILDINGS.well!.x - 1.2, z: BUILDINGS.well!.z },
    ],
    0.8,
  );
  path(
    [
      { x: -8, z: -2 },
      { x: -13, z: 6 },
      { x: GROVE.trees[2]!.x + 1.8, z: GROVE.trees[2]!.z + 1.4 },
    ],
    0.9,
  );

  // Stone pads under the buildings and the well.
  for (const [id, b] of Object.entries(BUILDINGS)) {
    const cx = toPx(b.x);
    const cy = toPx(b.z) + (id === 'well' ? 0 : 0.6 * GROUND_PPU);
    const rw = (id === 'well' ? 1.4 : 2.8) * GROUND_PPU;
    pc.ellipse(cx, cy, rw + 2, rw * 0.55 + 2, C.leafDeep);
    pc.ellipse(cx, cy, rw, rw * 0.55, C.greyDeep);
    pc.ellipse(cx, cy - 1, rw - 2, rw * 0.55 - 2, C.greyLight);
    for (let i = 0; i < 14; i++) {
      pc.dot(cx + rng.float(-rw + 3, rw - 3), cy + rng.float(-rw * 0.4, rw * 0.4), C.greyDeep);
    }
  }

  // A crop plot by the cottage: dark soil rows with sprouts.
  {
    const px0 = toPx(BUILDINGS.cottage!.x - 3);
    const py0 = toPx(BUILDINGS.cottage!.z + 3);
    const w = 4 * GROUND_PPU;
    const h = 3 * GROUND_PPU;
    pc.rect(px0 - 1, py0 - 1, w + 2, h + 2, C.leafDeep);
    pc.rect(px0, py0, w, h, C.darkBark);
    for (let row = 0; row < 4; row++) {
      const y = py0 + 2 + row * 6;
      pc.rect(px0 + 1, y, w - 2, 2, C.bark);
      for (let x = px0 + 3; x < px0 + w - 2; x += 4) {
        pc.dot(x, y - 0.5, C.sprout);
        pc.dot(x + 0.5, y - 1, C.leafLight);
        pc.dot(x - 0.5, y - 1, C.leaf);
      }
    }
  }

  // Dense tufts: a V of two or three fine pixels, three tones, everywhere on grass.
  for (let i = 0; i < 3200; i++) {
    const x = rng.int(1, size - 2);
    const y = rng.int(1, size - 2);
    if (isDirt(x, y) || pc.get(x, y) === C.greyLight) continue;
    const roll = rng.next();
    const c = roll < 0.4 ? C.leafLight : roll < 0.75 ? C.forest : C.sprout;
    pc.dot(x, y + 0.5, c);
    pc.dot(x + 0.5, y, c);
    pc.dot(x + 1, y + 0.5, c);
    if (rng.chance(0.3)) pc.dot(x + 0.5, y - 0.5, c);
  }
  // Clover and flower clusters.
  for (let i = 0; i < 150; i++) {
    const x = rng.float(2, size - 2);
    const y = rng.float(2, size - 2);
    if (isDirt(Math.round(x), Math.round(y))) continue;
    const flower = rng.chance(0.55);
    if (flower) {
      const colour = rng.pick([C.white, C.sunYellow, C.blush, C.skyLight, C.roseLight]);
      for (let k = 0; k < rng.int(3, 6); k++) {
        const fx = x + rng.float(-2.5, 2.5);
        const fy = y + rng.float(-1.8, 1.8);
        pc.dot(fx, fy, colour);
        pc.dot(fx + 0.5, fy, colour);
        pc.dot(fx, fy + 0.5, C.leaf);
      }
    } else {
      for (const [dx, dy] of [
        [0, -0.6],
        [-0.6, 0.4],
        [0.6, 0.4],
      ] as const) {
        pc.ellipse(x + dx, y + dy, 0.55, 0.45, C.leafDeep);
      }
    }
  }
  // Shade under the trees and the damp band at the water's edge.
  const shade = (wx: number, wz: number, r: number, count: number) => {
    const cx = toPx(wx);
    const cy = toPx(wz);
    for (let i = 0; i < count; i++) {
      const a = rng.float(0, Math.PI * 2);
      const d = r * GROUND_PPU * rng.float(0.2, 1.05);
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d * 0.6;
      if (isDirt(Math.round(x), Math.round(y))) continue;
      pc.disc(x, y, rng.float(0.6, 1.5), C.leafDeep);
    }
  };
  for (const t of GROVE.trees) shade(t.x, t.z + 0.6, 2.4, 220);
  for (const s of SCENERY) {
    if (s.kind === 'bush' || s.kind === 'bush2') shade(s.x, s.z + 0.3, 1.2, 50);
  }
  // Pebbles along the paths and on the shore.
  for (let i = 0; i < 600; i++) {
    const x = rng.int(0, size - 1);
    const y = rng.int(0, size - 1);
    const under = pc.get(x, y);
    if (under === C.sand || under === C.sandDeep) {
      pc.dot(x, y, rng.chance(0.5) ? C.greyLight : C.sandLight);
      if (rng.chance(0.4)) pc.dot(x + 0.5, y, C.greyDeep);
    }
  }

  const texture = pc.toTexture();
  texture.flipY = true;
  return texture;
}
