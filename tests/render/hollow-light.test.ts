import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { GROVE3D } from '../../src/config/tuning';
import { bandFor } from '../../src/render/cave-bands';
import { cellAt, cellCentre, floorOf, FLOOR, WALL } from '../../src/sim/dungeon';
import type { HollowCtx } from '../../src/render3d/hollow-ctx';
import { lightBaker, litTorches, mushroomSpots, torchSpots } from '../../src/render3d/hollow-light';

/** The Hollow's baked light, sconce start state and mushroom spots (art pass items 5, 6, 15). */
const ctxFor = (depth: number) => ({ band: bandFor(depth) }) as unknown as HollowCtx;
const find = (pred: (f: ReturnType<typeof floorOf>) => boolean) => {
  for (let s = 1; s < 400; s++) {
    const f = floorOf(s, 3);
    if (pred(f)) return f;
  }
  throw new Error('no floor');
};

describe('sconce start state', () => {
  it('is seeded, keeps one torch lit and leaves some cold', () => {
    let cold = 0;
    for (let s = 1; s < 60; s++) {
      const f = floorOf(s, 2);
      const a = litTorches(f);
      expect(a.length).toBe(f.torches.length);
      if (a.length) expect(a.some(Boolean)).toBe(true);
      expect(litTorches(floorOf(s, 2))).toEqual(a);
      cold += a.filter((x) => !x).length;
    }
    expect(cold).toBeGreaterThan(0);
  });

  it('always lights the torch nearest the stairs', () => {
    const f = find((x) => x.torches.length >= 3);
    const near = f.torches
      .map((t, i) => ({ i, d: Math.hypot(t.x - f.stairsUp.x, t.y - f.stairsUp.y) }))
      .sort((a, b) => a.d - b.d)[0]!.i;
    expect(litTorches(f)[near]).toBe(true);
  });
});

describe('lightBaker', () => {
  const f = find((x) => x.torches.length >= 2 && litTorches(x).some((l) => !l));
  const bake = lightBaker(f, ctxFor(3));
  const at = (x: number, y: number, z: number) => {
    const base = new THREE.Color(0, 0, 0);
    const torch = new THREE.Color(0, 0, 0);
    bake(x, y, z, 1, base, torch);
    return { base, torch };
  };
  const spots = torchSpots(f);

  it('puts warm light into the torch output near a lit torch, fading with distance', () => {
    const i = litTorches(f).findIndex(Boolean);
    const s = spots[i]!;
    const near = at(s.x, s.ground + GROVE3D.cave.light.sconce.height, s.wallZ + 0.6).torch;
    const far = at(s.x, s.ground + 1, s.wallZ + 3).torch;
    expect(near.r).toBeGreaterThan(far.r);
    expect(near.r).toBeGreaterThan(0.1);
    expect(near.r).toBeGreaterThanOrEqual(near.b);
    expect(at(s.x + 500, 1, s.wallZ).torch.r).toBe(0);
  });

  it('gives nothing for a cold sconce until it is lit, then lights it', () => {
    const lit = litTorches(f);
    const i = lit.findIndex((l) => !l);
    const s = spots[i]!;
    // Keep other sources out of the reading by sampling right at the cold torch only if alone.
    const probe = () => at(s.x, s.ground + 1.4, s.wallZ + 0.4).torch.r;
    const before = probe();
    lit[i] = true;
    const after = probe();
    expect(after).toBeGreaterThan(before);
    lit[i] = false;
  });

  it('tints the base colour near a crystal, not the torch output', () => {
    const c = cellCentre(f, f.crystals[0]!);
    const g = f.elevation[f.crystals[0]!.y * f.cols + f.crystals[0]!.x] ?? 0;
    const r = at(c.x, g + 0.7, c.z);
    expect(r.base.b).toBeGreaterThan(0.05);
  });
});

describe('mushroomSpots', () => {
  it('are seeded, capped, spaced and on open floor beside a wall', () => {
    for (let s = 1; s < 25; s++) {
      const f = floorOf(s, 4);
      const a = mushroomSpots(f);
      expect(mushroomSpots(f)).toEqual(a);
      expect(a.length).toBeLessThanOrEqual(GROVE3D.cave.light.mushroom.max);
      for (const m of a) {
        const cx = Math.floor((m.x - m.dx * 0.5) / 1.5 + f.cols / 2);
        const cy = Math.floor((m.z - m.dz * 0.5) / 1.5 + f.rows / 2);
        expect(cellAt(f, cx, cy)).toBe(FLOOR);
        expect(cellAt(f, cx + m.dx, cy + m.dz)).toBe(WALL);
      }
    }
  });
});
