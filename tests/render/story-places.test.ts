import { rampPath, TERRACES } from '../../src/sim/terrain';
import { describe, expect, it } from 'vitest';
import { markAt } from '../../src/config/stage-marks';
import { GROVE } from '../../src/config/tuning';
import { CG_C } from '../../src/config/tuning-c';
import { leafHinge, pennedSpots } from '../../src/render/corvin-layout';
import { NUMBER_CELL, numberAtlasSize, numberCell } from '../../src/render/number-atlas';
import type { StageFlags } from '../../src/render/scene-stage';
import { activeFx, coldGround, hazelHill } from '../../src/render/story-fx-state';

const flags = (o: Partial<StageFlags>): StageFlags => ({
  campaign: 'hazel',
  storyline: null,
  chapter: 1,
  storyChapter: null,
  half: null,
  vigilWave: null,
  vigilLull: false,
  vigilDone: false,
  pens: [false, false, false],
  corvin: null,
  location: 'grove',
  grove: 'main',
  place: null,
  sceneId: null,
  grave: false,
  tale: false,
  moon: null,
  inside: null,
  ...o,
});

describe("Corvin's numbers (H15)", () => {
  it('numbers the thirty penned Nubbins 1 to 30 in the order both views draw them', () => {
    const spots = pennedSpots();
    expect(spots.map((s) => s.n)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(spots[0]).toMatchObject({ x: -9, z: -6, pen: 0 });
    expect(spots[29]).toMatchObject({ x: 9, z: 0, pen: 2 });
  });

  it('keeps every number inside one atlas, each in its own cell', () => {
    const { width, height } = numberAtlasSize();
    const seen = new Set<string>();
    for (let n = 1; n <= CG_C.corvin.numbers.count; n++) {
      const { col, row } = numberCell(n);
      expect((col + 1) * NUMBER_CELL.w).toBeLessThanOrEqual(width);
      expect((row + 1) * NUMBER_CELL.h).toBeLessThanOrEqual(height);
      seen.add(`${col},${row}`);
    }
    expect(seen.size).toBe(CG_C.corvin.numbers.count);
  });

  it("hangs each pen's gate leaf on its own east wall", () => {
    const hinges = [0, 1, 2].map(leafHinge);
    for (const h of hinges) expect(h.x).toBe(CG_C.corvin.leaf.x);
    expect(new Set(hinges.map((h) => h.z)).size).toBe(3);
  });
});

describe('held effects (H6, N2)', () => {
  it("takes the staged scene's fx as they come", () => {
    const on = activeFx({ fx: ['fallsStill', 'goldWater'] }, flags({ chapter: 10 }));
    expect(on.has('fallsStill')).toBe(true);
    expect(on.has('goldWater')).toBe(true);
    expect(on.has('stoneGlow')).toBe(false);
  });

  it("holds breath through chapters 9 to 11 of Hazel's Grove and nowhere else", () => {
    expect(activeFx({}, flags({ chapter: 9 })).has('breath')).toBe(true);
    expect(activeFx({}, flags({ chapter: 11 })).has('breath')).toBe(true);
    expect(activeFx({}, flags({ chapter: 8 })).has('breath')).toBe(false);
    expect(activeFx({}, flags({ chapter: 12 })).has('breath')).toBe(false);
    expect(activeFx({}, flags({ campaign: 'hundred', chapter: 9 })).has('breath')).toBe(false);
  });

  it('lays footprints on chapters 9 and 10 only, and dresses the hill from chapter 1', () => {
    expect(coldGround(flags({ chapter: 9 }))).toBe(true);
    expect(coldGround(flags({ chapter: 10 }))).toBe(true);
    expect(coldGround(flags({ chapter: 11 }))).toBe(false);
    expect(hazelHill(flags({ chapter: 0 }))).toBe(false);
    expect(hazelHill(flags({ chapter: 6 }))).toBe(true);
    expect(hazelHill(flags({ campaign: 'logged', chapter: 6 }))).toBe(false);
  });
});

describe('the memorial hill (H7)', () => {
  const hill = GROVE.hills[0];

  it('winds its path from the hill path mark up to the crest', () => {
    const path = rampPath(TERRACES[0]!);
    const [x0, z0] = path[0]!;
    const start = markAt('grove', 'hill-path')!;
    expect(Math.hypot(hill.x + x0 - start.x, hill.z + z0 - start.z)).toBeLessThan(1.5);
    const [x1, z1] = path[path.length - 1]!;
    expect(Math.hypot(x1, z1)).toBeLessThan(hill.r * 0.5);
  });

  it("puts the flat stone and Briar's flower on the hill", () => {
    for (const name of ['flat-stone', 'briar']) {
      const m = markAt('grove', name)!;
      expect(Math.hypot(m.x - hill.x, m.z - hill.z)).toBeLessThan(hill.r);
    }
  });
});
