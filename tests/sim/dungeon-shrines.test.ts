import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { cellCentre, exploredMask, floorOf, FLOOR, runFloor } from '../../src/sim/dungeon';
import {
  buffLeft,
  PLACED_KINDS,
  shrinePower,
  shrineShells,
  shrineSight,
  shrineSpeed,
  type ShrineKind,
} from '../../src/sim/dungeon-shrines';
import { sightRadius } from '../../src/sim/dungeon-sight';
import { battleHandler, setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0159: shrines on version-4 floors, used by walking onto them, buffs on the sim clock.

const S = HOLLOW.shrines;

function underground(seed = 8) {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  const run = world.dungeon!;
  run.graceUntilMs = 1e15;
  for (const p of run.packs ?? []) p.state = 'beaten';
  run.strays = [];
  return world;
}

/** Make the floor's first shrine the given kind and walk the Keeper onto it. */
function useShrine(world: ReturnType<typeof underground>, kind: ShrineKind): SimEvent[] {
  const f = runFloor(world)!;
  const s = f.shrines![0]!;
  s.kind = kind;
  world.dungeon!.shrinesUsed = [];
  world.keeper.pos = cellCentre(f, s.cell);
  return stepWorld(world, SIM.stepMs);
}

describe('shrines (R0159)', () => {
  it('puts one to three on every version-4 level, on dry ground, apart', () => {
    for (let s = 0; s < 60; s++) {
      const f = floorOf(2_000 + s * 977, 1 + (s % 6), 4);
      const list = f.shrines!;
      expect(list.length).toBeGreaterThanOrEqual(1);
      expect(list.length).toBeLessThanOrEqual(3);
      for (const x of list) {
        expect(f.cells[x.cell.y * f.cols + x.cell.x]).toBe(FLOOR);
        expect(PLACED_KINDS).toContain(x.kind);
      }
    }
  }, 60_000);

  it('applies and expires every timed kind on the sim clock, and pauses in a fight', () => {
    for (const kind of PLACED_KINDS) {
      const secs = S.seconds[kind];
      if (secs === 0) continue;
      const world = underground();
      const out = useShrine(world, kind);
      expect(out.some((e) => e.kind === 'shrineUsed' && e.shrine === kind)).toBe(true);
      const run = world.dungeon!;
      expect(buffLeft(run, kind)).toBeGreaterThan(secs * 1000 - 500);
      // Move off the shrine, then a fight holds the clock still.
      world.keeper.pos = cellCentre(runFloor(world)!, runFloor(world)!.stairsUp);
      // A fight that waits for an answer, on a real pack.
      setEncounterHandler(() => null);
      run.encounter = { packId: runFloor(world)!.packs![0]!.id };
      const held = buffLeft(run, kind);
      for (let t = 0; t < 5000; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
      expect(buffLeft(run, kind)).toBe(held);
      delete run.encounter;
      setEncounterHandler(battleHandler);
      const ends: SimEvent[] = [];
      for (let t = 0; t < secs * 1000 + 500; t += SIM.stepMs)
        ends.push(...stepWorld(world, SIM.stepMs));
      expect(buffLeft(run, kind)).toBe(0);
      expect(ends.some((e) => e.kind === 'shrineFaded' && e.shrine === kind)).toBe(true);
    }
  });

  it('gives each buff its effect', () => {
    const world = underground();
    const run = world.dungeon!;
    useShrine(world, 'sunny');
    expect(shrineShells(run)).toBeCloseTo(1 + S.sunny);
    useShrine(world, 'bouncy');
    expect(shrineSpeed(world)).toBeCloseTo(1 + S.bouncy);
    useShrine(world, 'glowy');
    expect(shrineSight(run)).toBe(S.glowySight);
    expect(sightRadius(run)).toBe(sightRadius() + S.glowySight);
    const party = world.nubbins.filter((n) => run.party.includes(n.id));
    for (const n of party) n.needs.happiness = 0;
    useShrine(world, 'snuggly');
    expect(shrinePower(world)).toBeCloseTo(1 + S.snugglyPower);
    for (const n of party) expect(n.needs.happiness).toBe(S.snugglyHappy);
    for (const n of party) n.needs.energy = n.needs.hunger = 10;
    useShrine(world, 'picnic');
    for (const n of party) expect([n.needs.energy, n.needs.hunger]).toEqual([100, 100]);
    useShrine(world, 'secret');
    expect(exploredMask(run, runFloor(world)!).every((v) => v === 1)).toBe(true);
  });

  it('uses each shrine once', () => {
    const world = underground();
    const out = useShrine(world, 'picnic');
    expect(out.filter((e) => e.kind === 'shrineUsed')).toHaveLength(1);
    const again: SimEvent[] = [];
    for (let t = 0; t < 2000; t += SIM.stepMs) again.push(...stepWorld(world, SIM.stepMs));
    expect(again.some((e) => e.kind === 'shrineUsed')).toBe(false);
  });
});
