import { describe, expect, it } from 'vitest';
import { HOLLOW_R9D } from '../../src/config/dungeon-r9-d';
import { DUNGEON, HOLLOW } from '../../src/config/tuning';
import { cellCentre, floorOf, FLOOR, runFloor, WALL } from '../../src/sim/dungeon';
import { keyCells, keysReachable, reachMask } from '../../src/sim/dungeon-gaps';
import { shelfAt, shelfRise } from '../../src/sim/dungeon-shelves';
import { holdAtShelves } from '../../src/sim/dungeon-shelves';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function world3(seed = 5): World {
  const world = createWorld(seed, 0);
  const rng = Rng.fromSeed(9);
  while (world.nubbins.length < 3)
    world.nubbins.push(createEgg(`extra-${world.nubbins.length}`, { x: 0, z: 0 }, rng));
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

// R0031 (lane A r13): terrace ledges, 0.5 u plateaus kept off the critical path.

describe('terrace ledges (R0031)', () => {
  it('never close the walking way to the stairs, keys or any other floor, 500 seeds', () => {
    let ledges = 0;
    for (let s = 0; s < 500; s++) {
      const depth = 2 + (s % 5);
      const f = floorOf(9100 + s * 104_729, depth, 4);
      const led = (f.shelves ?? []).filter((x) => x.ledge);
      ledges += led.length;
      const closed = new Set<number>();
      for (const sh of f.shelves ?? []) for (const c of sh.cells) closed.add(c.y * f.cols + c.x);
      // Wall every raised block: all remaining dry floor the walk reached before still is.
      const saved = f.cells.slice();
      const before = reachMask(f, f.stairsUp, false);
      for (const i of closed) f.cells[i] = WALL;
      const after = reachMask(f, f.stairsUp, false);
      f.cells.set(saved);
      for (let i = 0; i < before.length; i++)
        if (before[i] && !closed.has(i)) expect(after[i], `seed ${s} cell ${i}`).toBe(1);
      for (const c of keyCells(f)) expect(closed.has(c.y * f.cols + c.x)).toBe(false);
      expect(keysReachable(f, depth), `seed ${s}`).toBe(true);
      for (const sh of led) {
        expect(sh.find).toBe('');
        for (const c of sh.cells) {
          expect(f.cells[c.y * f.cols + c.x]).toBe(FLOOR);
          expect(shelfRise(f, c)).toBeCloseTo(HOLLOW_R9D.ledges.riseSteps * DUNGEON.elev.step);
        }
      }
    }
    // Most floors carry at least one.
    expect(ledges).toBeGreaterThan(300);
  }, 180_000);

  it('leaves the floors before depth 2 and version 3 floors flat', () => {
    for (let s = 0; s < 40; s++) {
      expect((floorOf(500 + s, 1, 4).shelves ?? []).some((x) => x.ledge)).toBe(false);
      expect((floorOf(500 + s, 4, 3).shelves ?? []).some((x) => x.ledge)).toBe(false);
    }
  });

  it('is a jump up and a free walk down', () => {
    let seed = 1;
    let f = floorOf(seed, 3);
    while (!f.shelves?.some((x) => x.ledge)) f = floorOf(++seed, 3);
    const ledge = f.shelves!.find((x) => x.ledge)!;
    const top = ledge.cells[0]!;
    const w = world3();
    applyCommand(w, { kind: 'enterDungeon', daily: false }, []);
    const run = w.dungeon!;
    run.seed = seed;
    run.depth = 3;
    run.genVersion = HOLLOW.genVersion;
    expect(runFloor(w)).toBe(f);
    for (const n of w.nubbins) n.stats.fly.points = 0;
    // Closed to a walker from below in the nav mask? Open cells are only the ledge's neighbours.
    const below = [
      { x: top.x - 1, y: top.y },
      { x: top.x + 1, y: top.y },
      { x: top.x, y: top.y - 1 },
      { x: top.x, y: top.y + 1 },
    ].find((c) => f.cells[c.y * f.cols + c.x] !== WALL && shelfAt(f, c) < 0)!;
    const from = cellCentre(f, below);
    const onto = cellCentre(f, top);
    const k = w.keeper;
    const ev: SimEvent[] = [];
    k.pos = { ...onto };
    k.y = 0;
    holdAtShelves(w, from.x, from.z, ev);
    expect(k.pos).toEqual(from);
    k.pos = { ...onto };
    k.y = HOLLOW_R9D.shelves.climbHeight + 0.1;
    holdAtShelves(w, from.x, from.z, ev);
    expect(k.pos).toEqual(onto);
    k.pos = { ...from };
    k.y = 0;
    holdAtShelves(w, onto.x, onto.z, ev);
    expect(k.pos).toEqual(from);
  });
});
