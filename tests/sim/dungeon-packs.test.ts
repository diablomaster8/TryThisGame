import { afterEach, describe, expect, it } from 'vitest';
import { DUNGEON, HOLLOW, SIM } from '../../src/config/tuning';
import { cellCentre, cellDist, floorOf, runFloor } from '../../src/sim/dungeon';
import { generateV3 } from '../../src/sim/dungeon-gen-v3';
import { autoResolve, setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0146: monster packs on version-3 floors that notice, chase and hand off to a fight.

function underground(seed = 8): World {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  world.dungeon!.graceUntilMs = 0;
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

/** Stand the Keeper `cells` away from a pack, on its home cell's row where open. */
function nearPack(world: World, cells: number): string {
  const f = runFloor(world)!;
  const spec = f.packs![0]!;
  const home = cellCentre(f, spec.cell);
  world.keeper.pos = { x: home.x + cells * DUNGEON.cell * 0.7, z: home.z };
  world.dungeon!.packs!.find((p) => p.id === spec.id)!.pos = { ...home };
  return spec.id;
}

afterEach(() => setEncounterHandler(null));

describe('monster packs (R0146)', () => {
  it('never start within 8 cells of the entry, on any level', () => {
    for (const level of ['small', 'standard', 'big'] as const)
      for (let s = 1; s <= 40; s++) {
        const f = generateV3(s * 7919, 4, { level, tileset: 'rootways', boss: false });
        const want = HOLLOW.v3.levels[level].packs;
        expect(f.packs!.length).toBeGreaterThanOrEqual(want[0]);
        expect(f.packs!.length).toBeLessThanOrEqual(want[1]);
        for (const p of f.packs!) {
          expect(cellDist(p.cell, f.stairsUp)).toBeGreaterThanOrEqual(8);
          expect(p.members.length).toBeGreaterThanOrEqual(2);
          expect(p.aggroRadius).toBe(5);
          expect(p.leash).toBe(12);
        }
      }
  }, 30_000);

  it('wait out the arrival grace, then notice the Keeper with a "!" and chase', () => {
    const world = underground();
    world.dungeon!.graceUntilMs = world.timeMs + 5000;
    const id = nearPack(world, 4);
    // Hold the Keeper still beside the pack through the grace: nothing notices.
    const during = step(world, 2000);
    expect(during.some((e) => e.kind === 'packNoticed')).toBe(false);
    world.dungeon!.graceUntilMs = 0;
    setEncounterHandler(() => null);
    const out = step(world, 300);
    expect(out).toContainEqual({ kind: 'packNoticed', packId: id });
    const pack = world.dungeon!.packs!.find((p) => p.id === id)!;
    expect(pack.state).toBe('chase');
    const before = Math.hypot(pack.pos.x - world.keeper.pos.x, pack.pos.z - world.keeper.pos.z);
    step(world, 1500);
    const after = Math.hypot(pack.pos.x - world.keeper.pos.x, pack.pos.z - world.keeper.pos.z);
    expect(after).toBeLessThan(before);
  });

  it('starts an encounter on contact, auto-resolves it with the stub, and the pack is gone', () => {
    const world = underground();
    const id = nearPack(world, 0.5);
    const shells = world.inventory.shells;
    // A strong party always wins against the stub's clamp: force a win.
    setEncounterHandler(() => 'won');
    const out = step(world, 2000);
    expect(out).toContainEqual({ kind: 'encounterStarted', packId: id });
    const beaten = out.find((e) => e.kind === 'packBeaten');
    expect(beaten).toMatchObject({ packId: id });
    expect(world.dungeon!.packs!.find((p) => p.id === id)!.state).toBe('beaten');
    expect(world.inventory.shells).toBeGreaterThan(shells);
    expect(world.dungeon!.encounter).toBeUndefined();
  });

  it('the auto-resolve stub (no fighters to hand) resolves a bump by itself, seeded', () => {
    setEncounterHandler(autoResolve);
    const a = underground(31);
    const b = underground(31);
    nearPack(a, 0.5);
    nearPack(b, 0.5);
    const ea = step(a, 2000).filter((e) => e.kind === 'packBeaten' || e.kind === 'partyGiggles');
    const eb = step(b, 2000).filter((e) => e.kind === 'packBeaten' || e.kind === 'partyGiggles');
    expect(ea.length).toBe(1);
    expect(ea).toEqual(eb);
  });

  it('a loss sends everyone to the stairs up with the haul kept, and the pack home', () => {
    const world = underground();
    const id = nearPack(world, 0.5);
    world.dungeon!.haul = { shells: 40, items: 3 };
    setEncounterHandler(() => 'lost');
    const out = step(world, 1000);
    expect(out).toContainEqual({ kind: 'partyGiggles', packId: id });
    const f = runFloor(world)!;
    const up = cellCentre(f, f.stairsUp);
    expect(Math.hypot(world.keeper.pos.x - up.x, world.keeper.pos.z - up.z)).toBeLessThan(1.5);
    expect(world.dungeon!.haul).toEqual({ shells: 40, items: 3 });
    expect(world.dungeon!.packs!.find((p) => p.id === id)!.state).not.toBe('beaten');
    expect(world.dungeon!.graceUntilMs).toBeGreaterThan(world.timeMs);
  });

  it('waits for an interactive fight, holds the floor still, and finishes on encounterDone', () => {
    const world = underground();
    const id = nearPack(world, 0.5);
    setEncounterHandler(() => null);
    step(world, 1000);
    expect(world.dungeon!.encounter).toEqual({ packId: id });
    const strays = JSON.stringify(world.dungeon!.strays.map((s) => s.pos));
    step(world, 1000);
    expect(JSON.stringify(world.dungeon!.strays.map((s) => s.pos))).toBe(strays);
    // A save mid-fight comes back mid-fight.
    const back = deserialize(serialize(world, 0)).world;
    expect(back.dungeon!.encounter).toEqual({ packId: id });
    expect(back.dungeon!.packs).toEqual(world.dungeon!.packs);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'encounterDone', outcome: 'won' }, events);
    expect(events.some((e) => e.kind === 'packBeaten')).toBe(true);
    expect(world.dungeon!.encounter).toBeUndefined();
  });

  it("hands the fight a 9×7 board with the floor's heights", () => {
    const world = underground();
    nearPack(world, 0.5);
    let spec: unknown = null;
    setEncounterHandler((_w, s) => {
      spec = s;
      return 'fled';
    });
    const out = step(world, 1000);
    expect(out.some((e) => e.kind === 'packFled')).toBe(true);
    const s = spec as {
      arena: { w: number; h: number; cells: number[]; elevation: number[] };
      canFlee: boolean;
    };
    expect(s.arena.w).toBe(9);
    expect(s.arena.h).toBe(7);
    expect(s.arena.cells.length).toBe(63);
    expect(s.arena.elevation.length).toBe(63);
    expect(s.canFlee).toBe(true);
  });

  it('older floors have no packs', () => {
    expect(floorOf(3, 1, 2).packs).toBeUndefined();
  });
});
