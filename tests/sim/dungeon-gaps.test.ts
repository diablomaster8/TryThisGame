import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { actFloor } from '../../src/sim/dungeon-acts';
import {
  cellCentre,
  cellOf,
  CHASM,
  FLOOR,
  floorOf,
  runFloor,
  WATER,
  type Floor,
} from '../../src/sim/dungeon';
import { jumpNooks, keyCells, keysReachable, reachMask } from '../../src/sim/dungeon-gaps';
import { navMask } from '../../src/sim/dungeon-nav';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0031 (MOVE-31): deep water, chasm cuts and jump-only nooks on version-4 floors, and the
// kid-safe fall back to dry ground.

const G = HOLLOW.gaps;

describe('Hollow platforming generator (R0031)', () => {
  it('keeps the stairs, chest, landmark and waypoint reachable under the floor rule, 500 seeds', () => {
    let deepFloors = 0;
    let nooks = 0;
    for (let s = 0; s < 500; s++) {
      const depth = 1 + (s % 6);
      const f = floorOf(7000 + s * 104_729, depth, 4);
      expect(f.version).toBe(4);
      // Floors 1–2 on foot alone, deeper with the double jump.
      expect(keysReachable(f, depth), `seed ${s} depth ${depth}`).toBe(true);
      if (depth < G.nookFromDepth) {
        const walk = reachMask(f, f.stairsUp, false);
        for (const c of keyCells(f)) expect(walk[c.y * f.cols + c.x]).toBe(1);
      }
      if (depth < G.fromDepth) expect(f.cells.includes(CHASM)).toBe(false);
      if (depth >= G.nookFromDepth) {
        deepFloors++;
        nooks += jumpNooks(f);
      }
    }
    expect(nooks / deepFloors).toBeGreaterThanOrEqual(3);
  }, 120_000);

  it('strands no dry cell, and every nook holds a find reachable only by a jump', () => {
    for (let s = 0; s < 20; s++) {
      const depth = 3 + (s % 4);
      const f = floorOf(500 + s * 31, depth, 4);
      const jump = reachMask(f, f.stairsUp, true);
      const walk = reachMask(f, f.stairsUp, false);
      for (let i = 0; i < f.cells.length; i++) if (f.cells[i] === FLOOR) expect(jump[i]).toBe(1);
      const behindJump = f.loot.filter((l) => !walk[l.cell.y * f.cols + l.cell.x]);
      expect(behindJump.length).toBeGreaterThanOrEqual(jumpNooks(f));
    }
  });

  it('gives shallow floors a walking way round every gap', () => {
    for (let s = 0; s < 30; s++) {
      const f = floorOf(900 + s * 17, 2, 4);
      const walk = reachMask(f, f.stairsUp, false);
      for (let i = 0; i < f.cells.length; i++) if (f.cells[i] === FLOOR) expect(walk[i]).toBe(1);
    }
  });

  it('leaves version-3 floors as they were', () => {
    const f = floorOf(4242, 5, 3);
    expect(f.version).toBe(3);
    expect(f.cells.includes(CHASM)).toBe(false);
    expect(f.gaps).toBeUndefined();
    // Their crossings stay open to walkers over the water.
    const dry = navMask(f, false);
    for (const cr of f.crossings) for (const c of cr.cells) expect(dry[c.y * f.cols + c.x]).toBe(1);
  });

  it('cuts act floors too, and keeps a saved version-3 act floor flat', () => {
    const v4 = actFloor(77, 0, 3, 4);
    const v3 = actFloor(77, 0, 3, 3);
    expect(v4.gaps!.length).toBeGreaterThan(0);
    expect(v3.cells.includes(CHASM)).toBe(false);
    // Deep water is never open to a non-swimmer's path.
    const dry = navMask(v4, false);
    for (let i = 0; i < v4.cells.length; i++)
      if (v4.cells[i] === WATER || v4.cells[i] === CHASM) expect(dry[i]).toBe(0);
  });
});

function underground(seed = 8) {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  world.inventory.shells = 55;
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  return world;
}

/** A dry cell beside a chasm cell, and the chasm cell. */
function edge(f: Floor): { dry: { x: number; y: number }; gap: { x: number; y: number } } {
  for (const g of f.gaps ?? [])
    for (const c of g.cells)
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const d = { x: c.x + dx, y: c.y + dy };
        if (f.cells[d.y * f.cols + d.x] === FLOOR) return { dry: d, gap: c };
      }
  throw new Error('no gap');
}

describe('falling in the Hollow (R0031, MOVE-25)', () => {
  it('pops a Keeper who steps into a chasm back to dry ground within 0.6 s, losing nothing', () => {
    const world = underground();
    const run = world.dungeon!;
    run.depth = 4;
    run.graceUntilMs = 1e12;
    const f = runFloor(world)!;
    const { dry, gap } = edge(f);
    const k = world.keeper;
    k.pos = cellCentre(f, dry);
    stepWorld(world, SIM.stepMs);
    const before = JSON.stringify(world.inventory);
    k.pos = cellCentre(f, gap);
    const out: SimEvent[] = [];
    for (let t = 0; t < 600 && cellOf(f, k.pos).x === gap.x && cellOf(f, k.pos).y === gap.y;) {
      out.push(...stepWorld(world, SIM.stepMs));
      t += SIM.stepMs;
    }
    expect(f.cells[cellOf(f, k.pos).y * f.cols + cellOf(f, k.pos).x]).toBe(FLOOR);
    expect(out.some((e) => e.kind === 'hollowFell' && !e.water)).toBe(true);
    expect(JSON.stringify(world.inventory)).toBe(before);
  });

  it('lets a Keeper in the air pass over a gap without falling', () => {
    const world = underground();
    const run = world.dungeon!;
    run.depth = 4;
    run.graceUntilMs = 1e12;
    const f = runFloor(world)!;
    const { dry, gap } = edge(f);
    const k = world.keeper;
    k.pos = cellCentre(f, dry);
    stepWorld(world, SIM.stepMs);
    k.pos = cellCentre(f, gap);
    k.grounded = false;
    k.y = 0.6;
    k.vy = 3;
    const out = stepWorld(world, SIM.stepMs);
    expect(out.some((e) => e.kind === 'hollowFell')).toBe(false);
    expect(cellOf(f, k.pos)).toEqual(gap);
  });
});
