/**
 * The sim's ground model (R0010) against what the renderers draw: the 3D terrain mesh
 * and the Pixel hill terraces. If these drift, creatures stand above or inside the ground.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { Rng } from '../../src/sim/rng';
import {
  deckY,
  groundAt,
  pixelTierHeight,
  pixelTiers,
  hillHeight,
  hillTerrace,
  riverDistance,
  WATER_LEVEL,
} from '../../src/sim/terrain';
import { TERRAIN_SEGS, TERRAIN_SIZE, terrainArrays } from '../../src/render3d/terrain-shape';

describe('sim terrain', () => {
  // R0010's bar is the mesh's own vertices; between them the mesh is a coarser linear
  // fit (0.5 u cells against the sim's 0.25 u height tiles), checked separately below.
  const mesh = terrainArrays();
  const row = TERRAIN_SEGS + 1;
  const cell = TERRAIN_SIZE / TERRAIN_SEGS;
  const half = TERRAIN_SIZE / 2;
  const vy = (ix: number, iz: number): number => mesh.position[(iz * row + ix) * 3 + 1]!;
  // Where the bed dips under the water the feet rest on the surface the 3D water draws.
  const drawn = (y: number): number => Math.max(y, WATER_LEVEL);

  it('agrees with the 3D terrain mesh vertices within 0.05 u at 10,000 seeded points', () => {
    const rng = Rng.fromSeed('terrain-r0010');
    let worst = 0;
    for (let n = 0; n < 10_000; n++) {
      const v = rng.int(0, row * row - 1);
      const x = mesh.position[v * 3]!;
      const z = mesh.position[v * 3 + 2]!;
      // The bridge deck stands over the terrain (R0002), checked below.
      if (deckY(x, z) !== null) continue;
      worst = Math.max(worst, Math.abs(groundAt(null, x, z).y - drawn(mesh.position[v * 3 + 1]!)));
    }
    expect(worst).toBeLessThan(0.05);
  });

  it('stays within 0.25 u of the drawn triangles between vertices', () => {
    // The plane splits each cell along (ix, iz+1)-(ix+1, iz); check that before relying on it.
    expect([mesh.index[0], mesh.index[1], mesh.index[2]]).toEqual([0, row, 1]);
    expect(mesh.position[0]).toBeCloseTo(-half, 4);
    expect(mesh.position[2]).toBeCloseTo(-half, 4);
    const rng = Rng.fromSeed('terrain-r0010-between');
    let worst = 0;
    let over = 0;
    for (let n = 0; n < 10_000; n++) {
      const gx = rng.float(0.001, TERRAIN_SEGS - 0.001);
      const gz = rng.float(0.001, TERRAIN_SEGS - 0.001);
      const ix = Math.floor(gx);
      const iz = Math.floor(gz);
      const fx = gx - ix;
      const fz = gz - iz;
      const a = vy(ix, iz);
      const b = vy(ix, iz + 1);
      const c = vy(ix + 1, iz + 1);
      const d = vy(ix + 1, iz);
      const tri =
        fx + fz <= 1
          ? a + (d - a) * fx + (b - a) * fz
          : c + (b - c) * (1 - fx) + (d - c) * (1 - fz);
      if (deckY(gx * cell - half, gz * cell - half) !== null) continue;
      // A terrace cliff's eased face is steeper than the mesh's half-unit cells can follow;
      // feet only cross it on the way down, so the bar is for the cells clear of a face.
      const corners = [
        [ix, iz],
        [ix + 1, iz],
        [ix, iz + 1],
        [ix + 1, iz + 1],
      ].map(([i, j]) => [i! * cell - half, j! * cell - half] as const);
      const hard = corners.map(([x, z]) => hillHeight(x, z, false));
      if (
        Math.max(...hard) - Math.min(...hard) > 0.3 ||
        corners.some(([x, z]) => Math.abs(hillHeight(x, z, true) - hillHeight(x, z, false)) > 1e-6)
      )
        continue;
      const e = Math.abs(groundAt(null, gx * cell - half, gz * cell - half).y - drawn(tri));
      worst = Math.max(worst, e);
      if (e > 0.05) over++;
    }
    // The few misses are on the steep rim corners, stream banks and the ramps' banks (MOVE-09),
    // where two linear fits of the same curve part most.
    expect(worst).toBeLessThan(0.25);
    expect(over).toBeLessThan(40);
  });

  it('matches the Pixel terraces exactly (MOVE-09)', () => {
    for (const h of GROVE.hills) {
      const t = hillTerrace(h);
      let base = 0;
      expect(pixelTiers(h)).toEqual(
        t.tiers.map((tier) => {
          const row = [tier.r, tier.top - base, base];
          base = tier.top;
          return row;
        }),
      );
      // Steps are a jump's worth or less, and the top is the hill's height.
      for (const [, height] of pixelTiers(h)) expect(height).toBeLessThanOrEqual(0.9 + 1e-9);
      expect(pixelTierHeight(h.x, h.z)).toBeCloseTo(h.h, 9);
      // Pixel stands figures on the sim's hard shelves.
      expect(pixelTierHeight(h.x + h.r * 0.99, h.z + 0.001)).toBeGreaterThan(0);
    }
    const rng = Rng.fromSeed('terrain-pixel');
    for (let n = 0; n < 10_000; n++) {
      const x = rng.float(-GROVE.size / 2, GROVE.size / 2);
      const z = rng.float(-GROVE.size / 2, GROVE.size / 2);
      expect(pixelTierHeight(x, z)).toBe(hillHeight(x, z, false));
    }
  });

  it('reads the pond and the stream as water, and dry meadow as not', () => {
    const p = GROVE.pond;
    expect(groundAt(null, p.x, p.z)).toEqual({ y: WATER_LEVEL, surface: 'water' });
    for (const line of [GROVE.river.inflow, GROVE.river.outflow]) {
      const a = line[0]!;
      const b = line[1]!;
      const mx = (a.x + b.x) / 2;
      const mz = (a.z + b.z) / 2;
      // Skip a midpoint the pond already covers; the stream itself is the point here.
      if (Math.hypot(mx - p.x, mz - p.z) < p.r + 1) continue;
      expect(riverDistance(mx, mz)).toBeLessThan(0.01);
      expect(groundAt(null, mx, mz).surface).toBe('water');
    }
    const rng = Rng.fromSeed('terrain-dry');
    for (let n = 0; n < 2000; n++) {
      const x = rng.float(-40, 40);
      const z = rng.float(-40, 40);
      const g = groundAt(null, x, z);
      if (g.surface === 'water') expect(g.y).toBe(WATER_LEVEL);
      else expect(g.y).toBeGreaterThanOrEqual(WATER_LEVEL);
    }
  });

  it('imports nothing from three, the DOM or Math.random', () => {
    const src = readFileSync(new URL('../../src/sim/terrain.ts', import.meta.url), 'utf8');
    expect(src).not.toMatch(/from\s+['"]three/);
    expect(src).not.toMatch(/from\s+['"]\.\.\/render/);
    expect(src).not.toMatch(/Math\.random|document\.|window\./);
  });
});
