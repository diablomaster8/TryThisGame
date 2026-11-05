import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { cellCentre, cellOf, FLOOR, isWalkable, runFloor } from '../../src/sim/dungeon';
import { slotTarget } from '../../src/sim/dungeon-follow';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0048 (round 11): partners follow from slots behind the Keeper and pop back when lost.

function hollowWorld(seed: number): World {
  const world = createWorld(seed, 0);
  const rng = Rng.fromSeed(seed);
  while (world.nubbins.length < 3)
    world.nubbins.push(createEgg(`extra-${world.nubbins.length}`, { x: 0, z: 0 }, rng));
  for (const n of world.nubbins) {
    hatch(n, [], 0);
    n.needs.energy = 100;
  }
  applyCommand(world, { kind: 'enterDungeon', daily: false }, []);
  applyCommand(world, { kind: 'dungeonGo', to: 'down' }, []);
  return world;
}

describe('polite following in the Hollow (R0048)', () => {
  it('slots sit about a slot radius behind the Keeper, on open ground, apart from each other', () => {
    const world = hollowWorld(3);
    const f = runFloor(world)!;
    world.keeper.facing = 0.4;
    const spots = [0, 1, 2].map((i) => slotTarget(world, f, i));
    for (const p of spots) {
      const d = Math.hypot(p.x - world.keeper.pos.x, p.z - world.keeper.pos.z);
      expect(d).toBeLessThanOrEqual(HOLLOW.follow.slotRadius + 1e-6);
      const c = cellOf(f, p);
      expect(isWalkable(f, c.x, c.y)).toBe(true);
    }
    const [a, b] = spots;
    expect(Math.hypot(a!.x - b!.x, a!.z - b!.z)).toBeGreaterThan(0.1);
  });

  it('three partners never stand in the Keeper or a wall over 5 minutes of walking', () => {
    let bad = 0;
    let walls = 0;
    let samples = 0;
    const streak: Record<string, number> = {};
    for (const seed of [3, 4, 5]) {
      const world = hollowWorld(seed);
      const f = runFloor(world)!;
      const run = world.dungeon!;
      const rng = new Rng(seed);
      const open: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < f.rows; y++)
        for (let x = 0; x < f.cols; x++) if (f.cells[y * f.cols + x] === FLOOR) open.push({ x, y });
      for (let t = 0; t < 300_000; t += SIM.stepMs) {
        if (world.location !== 'dungeon' || world.dungeon !== run) break;
        run.packs = [];
        run.strays = [];
        if (t % 4000 === 0) {
          const c = open[rng.int(0, open.length - 1)]!;
          applyCommand(world, { kind: 'moveKeeperTo', pos: cellCentre(f, c) }, []);
        }
        stepWorld(world, SIM.stepMs);
        if (t < 5000) continue;
        for (const id of run.party) {
          const n = world.nubbins.find((x) => x.id === id)!;
          const c = cellOf(f, n.pos);
          samples++;
          const k = world.keeper.pos;
          if (!isWalkable(f, c.x, c.y)) walls++;
          // Standing in the Keeper means staying there; the Keeper running through for a step or
          // two while a follower steps aside does not count.
          const near = Math.hypot(n.pos.x - k.x, n.pos.z - k.z) < 0.25;
          streak[id] = near ? (streak[id] ?? 0) + 1 : 0;
          if (streak[id] === 5) bad++;
        }
      }
    }
    expect(samples).toBeGreaterThan(1000);
    expect(walls).toBe(0);
    expect(bad).toBe(0);
  }, 60_000);

  it('a follower far off and out of sight pops to the Keeper after three seconds', () => {
    const world = hollowWorld(6);
    const f = runFloor(world)!;
    const run = world.dungeon!;
    run.packs = [];
    run.strays = [];
    const k = world.keeper.pos;
    // Any open cell further than the pop distance with rock between.
    let far: { x: number; z: number } | null = null;
    for (let y = 0; y < f.rows && !far; y++)
      for (let x = 0; x < f.cols && !far; x++) {
        if (f.cells[y * f.cols + x] !== FLOOR) continue;
        const p = cellCentre(f, { x, y });
        if (Math.hypot(p.x - k.x, p.z - k.z) <= HOLLOW.follow.popDistance + 2) continue;
        far = p;
      }
    if (!far) return;
    const n = world.nubbins.find((x) => x.id === run.party[0])!;
    n.pos = { ...far };
    for (let t = 0; t < 3600; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
    const d = Math.hypot(n.pos.x - k.x, n.pos.z - k.z);
    expect(d).toBeLessThan(HOLLOW.follow.popDistance);
  });
});
