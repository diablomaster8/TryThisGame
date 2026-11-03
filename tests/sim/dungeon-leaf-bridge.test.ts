import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { cellCentre, cellOf, CHASM, FLOOR, runFloor, type Floor } from '../../src/sim/dungeon';
import { assistBridges } from '../../src/sim/dungeon-falls';
import { createEdu } from '../../src/sim/edu';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0025 (round 11): in the sprout band, a leaf-bridge grows across a gap after two falls.

function underground(sprout: boolean) {
  const world = createWorld(8, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  if (sprout) world.edu = createEdu(5, 'sprout');
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  const run = world.dungeon!;
  run.depth = 4;
  run.graceUntilMs = 1e12;
  return world;
}

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

/** Step the Keeper into the gap cell; true when it fell (popped back to dry ground). */
function tryGap(
  world: ReturnType<typeof underground>,
  f: Floor,
  gap: { x: number; y: number },
  dry: { x: number; y: number },
): boolean {
  const k = world.keeper;
  k.pos = cellCentre(f, dry);
  stepWorld(world, SIM.stepMs);
  k.pos = cellCentre(f, gap);
  const out: SimEvent[] = [];
  for (let t = 0; t < 600; t += SIM.stepMs) {
    out.push(...stepWorld(world, SIM.stepMs));
    if (out.some((e) => e.kind === 'hollowFell')) break;
  }
  return out.some((e) => e.kind === 'hollowFell');
}

describe('the sprout leaf-bridge (R0025)', () => {
  it('the third try finds a bridge after two falls into the same gap', () => {
    const world = underground(true);
    const f = runFloor(world)!;
    const { dry, gap } = edge(f);
    expect(f.cells[gap.y * f.cols + gap.x]).toBe(CHASM);
    expect(assistBridges(f)).toHaveLength(0);
    expect(tryGap(world, f, gap, dry)).toBe(true);
    expect(tryGap(world, f, gap, dry)).toBe(true);
    expect(assistBridges(f).length).toBeGreaterThan(0);
    expect(tryGap(world, f, gap, dry)).toBe(false);
    expect(cellOf(f, world.keeper.pos)).toEqual(gap);
  });

  it('grows no bridge outside the sprout band', () => {
    const world = underground(false);
    const f = runFloor(world)!;
    const { dry, gap } = edge(f);
    for (let i = 0; i < 4; i++) expect(tryGap(world, f, gap, dry)).toBe(true);
    expect(assistBridges(f)).toHaveLength(0);
  });
});
