import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { bandFor } from '../../src/render/cave-bands';
import { cellCentre, elevationAt, floorOf, isWalkable } from '../../src/sim/dungeon';
import type { HollowCtx } from '../../src/render3d/hollow-ctx';
import { mainPath, pathBaker, standAt } from '../../src/render3d/hollow-dress-path';

const ctx = { band: bandFor(1) } as unknown as HollowCtx;

describe('Hollow dressing plan', () => {
  it('walks the main path from the way up to the way down, one step at a time', () => {
    for (const seed of [1, 7, 42]) {
      const f = floorOf(seed, 2);
      const path = mainPath(f);
      expect(path[0]).toEqual(f.stairsUp);
      expect(path[path.length - 1]).toEqual(f.stairsDown ?? f.chest);
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1]!;
        const b = path[i]!;
        expect(Math.abs(a.x - b.x) + Math.abs(a.y - b.y)).toBe(1);
        expect(isWalkable(f, b.x, b.y)).toBe(true);
      }
    }
  });

  it('wears the path paler and leaves the rest of the floor alone', () => {
    const f = floorOf(7, 2);
    const bake = pathBaker(f, ctx);
    const on = cellCentre(f, mainPath(f)[5]!);
    const base = new THREE.Color(0.1, 0.1, 0.1);
    bake(on.x, 0, on.z, 1, base, new THREE.Color());
    expect(base.r).toBeGreaterThan(0.1);
    // A wall face (normal sideways) is never worn.
    const side = new THREE.Color(0.1, 0.1, 0.1);
    bake(on.x, 0, on.z, 0, side, new THREE.Color());
    expect(side.r).toBe(0.1);
  });

  it('stands actors on the deck of a crossing and on the floor elsewhere', () => {
    for (let seed = 1; seed < 60; seed++) {
      const f = floorOf(seed, 3);
      const cr = f.crossings[0];
      if (!cr) continue;
      const mid = cellCentre(f, cr.cells[Math.floor(cr.cells.length / 2)]!);
      expect(standAt(f, mid.x, mid.z)).toBeGreaterThan(elevationAt(f, mid));
      const up = cellCentre(f, f.stairsUp);
      expect(standAt(f, up.x, up.z)).toBeCloseTo(elevationAt(f, up), 5);
      return;
    }
    throw new Error('no floor with a crossing in the seeds tried');
  });
});
