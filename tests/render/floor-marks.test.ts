import { describe, expect, it } from 'vitest';
import { INTERIOR_IDS, markAt } from '../../src/config/stage-marks';
import { floorMarks } from '../../src/render/floor-marks';
import { wallsShown } from '../../src/render/interior-layout';
import { cellCentre, floorOf, FLOOR, cellAt, type Floor } from '../../src/sim/dungeon';
import { BEETLE_FLOORS, BEETLE_STORY_SEED } from '../../src/sim/storyline-rules-beetle';

/** The open cell under a world point. */
function cellUnder(f: Floor, x: number, z: number): number {
  const a = cellCentre(f, { x: 0, y: 0 });
  const s = cellCentre(f, { x: 1, y: 0 }).x - a.x;
  return cellAt(f, Math.floor(x / s + f.cols / 2), Math.floor(z / s + f.rows / 2));
}

describe('K16 floor marks', () => {
  for (const depth of Object.values(BEETLE_FLOORS)) {
    it(`stands the Beetle Road's cast on open, distinct ground at depth ${depth}`, () => {
      const f = floorOf(BEETLE_STORY_SEED, depth);
      const m = floorMarks(f);
      const names = ['keeper', 'guardhouse-bench', 'banner-1', 'cart', 'guardhouse-counter'];
      const spots = new Set<string>();
      for (const n of names) {
        const mk = m[n]!;
        expect(mk, n).toBeDefined();
        expect(cellUnder(f, mk.x, mk.z), n).toBe(FLOOR);
        spots.add(`${mk.x},${mk.z}`);
      }
      expect(spots.size).toBe(names.length);
      expect(m['floor-up']).toBeDefined();
      expect(Object.keys(m).filter((k) => k.startsWith('floor-room-')).length).toBe(f.rooms.length);
    });
  }
});

describe('K10 interiors', () => {
  it('gives every interior a Keeper mark, a grid and the same marks in any location', () => {
    for (const id of INTERIOR_IDS) {
      for (const n of [`keeper-inside-${id}`, `in-${id}-b1`, `in-${id}-f3`]) {
        expect(markAt('grove', n), n).toBeDefined();
        expect(markAt('corvin', n)).toEqual(markAt('grove', n));
        expect(markAt('dungeon', n)).toEqual(markAt('grove', n));
      }
    }
  });

  it('leaves out the wall between the camera and the room', () => {
    // From the south: the south wall goes; north, east and west stay.
    expect(wallsShown({ x: 0, z: 1 })).toEqual([true, true, false, true]);
    // From the south-east corner: both near walls go.
    expect(wallsShown({ x: 1, z: 1 })).toEqual([true, false, false, true]);
  });
});
