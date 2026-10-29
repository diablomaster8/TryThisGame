import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { actFloor } from '../../src/sim/dungeon-acts';
import { cellCentre, cellOf, FLOOR, floorOf, runFloor } from '../../src/sim/dungeon';
import { hollowSpeed, trapArmed, type TrapKind } from '../../src/sim/dungeon-traps';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0161: funny, telegraphed traps that never take anything, re-arm after 20 s, and stay out of
// the Learning Grove.

const T = HOLLOW.traps;

function underground(seed = 8) {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  world.inventory.shells = 40;
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  const run = world.dungeon!;
  run.graceUntilMs = 1e15;
  run.strays = [];
  return world;
}

/** Turn the floor's first trap into `kind` and walk the Keeper onto it from the west. */
function stepOn(world: ReturnType<typeof underground>, kind: TrapKind): SimEvent[] {
  const f = runFloor(world)!;
  const t = f.traps![0]!;
  t.kind = kind;
  world.keeper.pos = cellCentre(f, { x: t.cell.x - 1, y: t.cell.y });
  world.keeper.moveTarget = null;
  stepWorld(world, SIM.stepMs);
  world.keeper.pos = cellCentre(f, t.cell);
  return stepWorld(world, SIM.stepMs);
}

describe('traps (R0161)', () => {
  it('puts two to five on dry ground with dry ground round them, ice only in Act IV', () => {
    for (let s = 0; s < 40; s++) {
      const f = floorOf(6_000 + s * 811, 1 + (s % 6), 4);
      expect(f.traps!.length).toBeGreaterThanOrEqual(T.perLevel[0]);
      expect(f.traps!.length).toBeLessThanOrEqual(T.perLevel[1]);
      for (const t of f.traps!) {
        expect(f.cells[t.cell.y * f.cols + t.cell.x]).toBe(FLOOR);
        expect(t.kind).not.toBe('ice');
      }
    }
    const kinds = new Set<string>();
    for (let s = 0; s < 30; s++)
      for (const t of actFloor(s * 13, 3, 30, 4).traps ?? []) kinds.add(t.kind);
    expect(kinds.has('ice')).toBe(true);
  }, 60_000);

  it('springs every kind once, takes nothing, and re-arms after 20 s', () => {
    for (const kind of ['whoopee', 'sticky', 'leaves', 'sneeze', 'bell', 'ice'] as TrapKind[]) {
      const world = underground();
      const before = JSON.stringify(world.inventory);
      const out = stepOn(world, kind);
      expect(out.filter((e) => e.kind === 'trapSprung')).toHaveLength(1);
      expect(JSON.stringify(world.inventory)).toBe(before);
      const run = world.dungeon!;
      const f = runFloor(world)!;
      const t = f.traps![0]!;
      expect(trapArmed(run, t.id)).toBe(false);
      // Standing on it again springs nothing until it re-arms.
      world.keeper.pos = cellCentre(f, t.cell);
      world.keeper.grounded = true;
      world.keeper.y = 0;
      const again: SimEvent[] = [];
      for (let ms = 0; ms < T.rearmMs - 500; ms += SIM.stepMs) {
        world.keeper.pos = cellCentre(f, { x: t.cell.x + 3, y: t.cell.y });
        again.push(...stepWorld(world, SIM.stepMs));
      }
      expect(again.some((e) => e.kind === 'trapSprung')).toBe(false);
      for (let ms = 0; ms < 1000; ms += SIM.stepMs) stepWorld(world, SIM.stepMs);
      expect(trapArmed(run, t.id)).toBe(true);
    }
  });

  it('gives each kind its effect', () => {
    let world = underground();
    stepOn(world, 'sticky');
    expect(hollowSpeed(world)).toBeCloseTo(1 - T.stickySlow);
    world = underground();
    const f = runFloor(world)!;
    const t = f.traps![0]!;
    stepOn(world, 'leaves');
    // Walked on from the west, slid back west.
    expect(cellOf(f, world.keeper.pos).x).toBeLessThan(t.cell.x);
    world = underground();
    stepOn(world, 'whoopee');
    expect(world.keeper.grounded).toBe(false);
    world = underground();
    for (const p of world.dungeon!.packs ?? []) p.state = 'idle';
    const out = stepOn(world, 'bell');
    expect(out.some((e) => e.kind === 'packNoticed')).toBe(true);
  });

  it('springs none in the Learning Grove', () => {
    const world = underground();
    world.edu = { band: 'sprout' } as never;
    const out = stepOn(world, 'whoopee');
    expect(out.some((e) => e.kind === 'trapSprung')).toBe(false);
    expect(world.dungeon!.noTraps).toBe(true);
  });

  it('lets a quick party Nubbin spot a trap ahead', () => {
    const world = underground();
    const run = world.dungeon!;
    const n = world.nubbins.find((x) => run.party.includes(x.id))!;
    n.stats.run.points = 100 * T.scoutRun;
    const f = runFloor(world)!;
    const t = f.traps![0]!;
    world.keeper.pos = cellCentre(f, { x: t.cell.x - 2, y: t.cell.y });
    const out = stepWorld(world, SIM.stepMs);
    expect(out.some((e) => e.kind === 'trapSpotted')).toBe(true);
    expect(run.trapsSpotted).toContain(t.id);
  });
});
