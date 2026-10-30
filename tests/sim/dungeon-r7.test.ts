import { afterEach, describe, expect, it } from 'vitest';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { HOLLOW_R7 } from '../../src/config/tuning-dungeon';
import {
  cellCentre,
  FLOOR,
  floorOf,
  isWalkable,
  runFloor,
  WALL,
  type Floor,
} from '../../src/sim/dungeon';
import { arenaFor } from '../../src/sim/dungeon-arena';
import { actFloor } from '../../src/sim/dungeon-acts';
import { roomHasContent, roomNeighbours, roomPieces } from '../../src/sim/dungeon-rooms';
import { isCommonSpecies, SPECIES } from '../../src/sim/species';
import { actStartDepth } from '../../src/config/dungeon-acts';
import { ACT_WILD } from '../../src/config/dungeon-wild';
import { generateV3 } from '../../src/sim/dungeon-gen-v3';
import { setEncounterHandler, swimFamily } from '../../src/sim/dungeon-encounters';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 7: aggro telegraph and leash (R0200).

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

afterEach(() => setEncounterHandler(null));

describe('aggro and leash (R0200)', () => {
  it('a walking Keeper who strolls into a pack is caught within 6 s', () => {
    for (const seed of [8, 9, 10]) {
      const world = underground(seed);
      const f = runFloor(world)!;
      const spec = f.packs![0]!;
      const home = cellCentre(f, spec.cell);
      const pack = world.dungeon!.packs!.find((p) => p.id === spec.id)!;
      // Start on open floor three cells off, in whichever direction has some.
      const off = [
        [3, 0],
        [-3, 0],
        [0, 3],
        [0, -3],
        [2, 2],
        [-2, -2],
      ].find(([dx, dy]) => isWalkable(f, spec.cell.x + dx!, spec.cell.y + dy!))!;
      world.keeper.pos = cellCentre(f, { x: spec.cell.x + off[0]!, y: spec.cell.y + off[1]! });
      pack.pos = { ...home };
      delete pack.asleep;
      world.keeper.running = false;
      world.keeper.moveTarget = { ...home };
      let caught = -1;
      setEncounterHandler(() => {
        caught = world.timeMs;
        return null;
      });
      const t0 = world.timeMs;
      for (let t = 0; t < 6000 && caught < 0; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
      expect(caught).toBeGreaterThanOrEqual(0);
      expect(caught - t0).toBeLessThanOrEqual(6000);
    }
  });

  it('a running Keeper always gets away: the pack gives up after its chase and shows a "?"', () => {
    const world = underground();
    const f = runFloor(world)!;
    const spec = f.packs![0]!;
    const pack = world.dungeon!.packs!.find((p) => p.id === spec.id)!;
    const home = cellCentre(f, spec.cell);
    pack.pos = { ...home };
    world.keeper.pos = { x: home.x + 2 * DUNGEON.cell, z: home.z };
    setEncounterHandler(() => {
      throw new Error('caught');
    });
    step(world, 200);
    expect(pack.state).toBe('chase');
    // Run ahead of it: the Keeper's run is faster than the chase, so keep the gap it opens.
    let gap = 3;
    for (let t = 0; t < 9000; t += SIM.stepMs) {
      const dx = world.keeper.pos.x - pack.pos.x;
      const dz = world.keeper.pos.z - pack.pos.z;
      const d = Math.hypot(dx, dz) || 1;
      gap = Math.max(gap, d);
      world.keeper.pos = { x: pack.pos.x + (dx / d) * gap, z: pack.pos.z + (dz / d) * gap };
      stepWorld(world, SIM.stepMs);
      if (pack.state !== 'chase') break;
    }
    expect(pack.state).toBe('home');
    expect(pack.gaveUpMs).toBeDefined();
    // It doesn't turn straight round on the way home.
    world.keeper.pos = { ...pack.pos };
    world.keeper.pos.x += 0.5 * DUNGEON.cell;
    const later = step(world, HOLLOW_R7.aggro.ignoreMs - 500);
    expect(later.some((e) => e.kind === 'packNoticed')).toBe(false);
  });

  it('a Shy party Nubbin keeps the party a cell further from notice', () => {
    const at = (shy: boolean): boolean => {
      const world = underground();
      if (shy) for (const n of world.nubbins) n.personality = 'shy';
      const f = runFloor(world)!;
      const spec = f.packs![0]!;
      const home = cellCentre(f, spec.cell);
      const pack = world.dungeon!.packs!.find((p) => p.id === spec.id)!;
      pack.pos = { ...home };
      delete pack.asleep;
      world.keeper.pos = { x: home.x, z: home.z + (spec.aggroRadius - 0.5) * DUNGEON.cell };
      setEncounterHandler(() => null);
      const pos = { ...world.keeper.pos };
      let noticed = false;
      for (let t = 0; t < 400; t += SIM.stepMs) {
        world.keeper.pos = { ...pos };
        pack.pos = { ...home };
        noticed ||= stepWorld(world, SIM.stepMs).some((e) => e.kind === 'packNoticed');
      }
      return noticed;
    };
    expect(at(false)).toBe(true);
    expect(at(true)).toBe(false);
  });

  it('only swim-type families chase through water', () => {
    expect(swimFamily('penguinling')).toBe(true);
    expect(swimFamily('no-such-family')).toBe(false);
  });
});

describe("Gran's Picnic (R0204)", () => {
  it('rests the party once per level on the rug, and wakes a napper', () => {
    const world = underground();
    const run = world.dungeon!;
    run.packs = [];
    run.strays = [];
    const f = runFloor(world)!;
    expect(f.nook).toBeTruthy();
    const party = run.party.map((id) => world.nubbins.find((n) => n.id === id)!);
    for (const n of party) {
      n.needs.energy = 0.2;
      n.needs.happiness = 0;
    }
    party[0]!.behavior.state = 'nap';
    const rug = cellCentre(f, f.nook!.rug[0]!);
    const sit = (ms: number): SimEvent[] => {
      const out: SimEvent[] = [];
      for (let t = 0; t < ms; t += SIM.stepMs) {
        world.keeper.pos = { ...rug };
        world.keeper.moveTarget = null;
        out.push(...stepWorld(world, SIM.stepMs));
      }
      return out;
    };
    expect(sit(4000).some((e) => e.kind === 'picnicRest')).toBe(false);
    expect(sit(1500).filter((e) => e.kind === 'picnicRest')).toHaveLength(1);
    for (const n of party) {
      expect(n.needs.energy).toBeGreaterThan(0.99);
      expect(n.needs.happiness).toBeGreaterThanOrEqual(HOLLOW_R7.picnic.happy - 1);
      expect(n.behavior.state).not.toBe('nap');
    }
    for (const n of party) n.needs.energy = 0.2;
    expect(sit(8000).some((e) => e.kind === 'picnicRest')).toBe(false);
    expect(party[1]!.needs.energy).toBeLessThan(0.5);
  });
});

describe('the Deep Hollow (R0205)', () => {
  it('goes on to floor 99 and no further', () => {
    const world = underground();
    const run = world.dungeon!;
    const down = (): SimEvent[] => {
      run.packs = [];
      run.strays = [];
      world.keeper.pos = cellCentre(runFloor(world)!, runFloor(world)!.stairsUp);
      run.graceUntilMs = 0;
      run.pending = 'down';
      run.pendingPos = { ...world.keeper.pos };
      world.keeper.moveTarget = run.pendingPos;
      return step(world, 200);
    };
    run.depth = HOLLOW_R7.deepMax - 1;
    down();
    expect(run.depth).toBe(HOLLOW_R7.deepMax);
    expect(world.hollow.best).toBe(HOLLOW_R7.deepMax);
    expect(runFloor(world)!.stairsDown).toBeTruthy();
    expect(down().some((e) => e.kind === 'deepBottom')).toBe(true);
    expect(run.depth).toBe(HOLLOW_R7.deepMax);
  });
});

describe('tactics boards from the floor (R0195)', () => {
  it('every pack gets a board at least 60% walkable with both sides joined, over 500 boards', () => {
    let boards = 0;
    for (let s = 1; boards < 500; s++) {
      const level = s % 3 === 0 ? 'standard' : 'small';
      const tileset = ['rootways', 'cloister', 'sandglass', 'frostbell', 'gloom'][s % 5]!;
      const f = generateV3(s * 4243, 1 + (s % 9), { level, tileset, boss: s % 7 === 0 });
      for (const p of f.packs ?? []) {
        const a = arenaFor(f, p.cell);
        boards++;
        const n = a.w * a.h;
        expect([a.w, a.h]).toEqual([9, 7]);
        const walk = a.cells.filter((c, i) => c !== WALL && !a.props.includes(i)).length;
        expect(walk).toBeGreaterThanOrEqual(n * 0.6);
        expect(a.height.every((h) => h >= 0 && h <= 2)).toBe(true);
        const { party, foe } = a.spawnSides;
        expect(party.length).toBeGreaterThanOrEqual(3);
        expect(foe.length).toBeGreaterThanOrEqual(3);
        // Walk from a party cell: every foe cell is reachable on standable floor.
        const ok = (i: number) => a.cells[i] === FLOOR && !a.props.includes(i);
        const seen = new Set([party[0]!]);
        const todo = [party[0]!];
        while (todo.length) {
          const i = todo.pop()!;
          for (const j of [i - 1, i + 1, i - a.w, i + a.w]) {
            if (j < 0 || j >= n || seen.has(j) || !ok(j)) continue;
            if (Math.abs((j % a.w) - (i % a.w)) > 1) continue;
            seen.add(j);
            todo.push(j);
          }
        }
        for (const i of [...party, ...foe]) expect(seen.has(i)).toBe(true);
      }
    }
  }, 60_000);
});

describe('fights in place (R0196)', () => {
  it('puts the Keeper and party back exactly where they stood, then gives a breath', () => {
    const world = underground();
    const run = world.dungeon!;
    const f = runFloor(world)!;
    const spec = f.packs![0]!;
    const pack = run.packs!.find((p) => p.id === spec.id)!;
    delete pack.asleep;
    world.keeper.pos = cellCentre(f, spec.cell);
    pack.pos = { ...world.keeper.pos };
    setEncounterHandler(() => null);
    step(world, 100);
    expect(run.encounter?.packId).toBe(spec.id);
    const before = JSON.stringify({
      k: world.keeper.pos,
      p: run.party.map((id) => world.nubbins.find((n) => n.id === id)!.pos),
    });
    step(world, 1000);
    // Something nudges them mid-fight (a camera pan, a stray tap): the return restores them.
    world.keeper.pos.x += 2;
    applyCommand(world, { kind: 'encounterDone', outcome: 'won' }, []);
    const after = JSON.stringify({
      k: world.keeper.pos,
      p: run.party.map((id) => world.nubbins.find((n) => n.id === id)!.pos),
    });
    expect(after).toBe(before);
    expect(run.encounter).toBeUndefined();
    // Another pack right beside the Keeper waits out the breath.
    const other = run.packs!.find((p) => p.id !== spec.id)!;
    delete other.asleep;
    other.state = 'idle';
    const quiet: SimEvent[] = [];
    for (let t = 0; t < HOLLOW_R7.aggro.afterFightMs - 200; t += SIM.stepMs) {
      other.pos = { x: world.keeper.pos.x + 2, z: world.keeper.pos.z };
      quiet.push(...stepWorld(world, SIM.stepMs));
    }
    expect(quiet.some((e) => e.kind === 'packNoticed')).toBe(false);
  });
});

describe('no bare rooms and nursery nooks (R0201, R0198)', () => {
  const floors = (): Floor[] => {
    const out: Floor[] = [];
    for (let s = 1; s <= 30; s++) {
      out.push(floorOf(s * 77, 1 + (s % 8)));
      out.push(actFloor(s * 31, s % 5, actStartDepth(s % 5) + (s % 3), 4));
    }
    return out;
  };

  it('fills ≥ 90% of rooms, never packs neighbouring rooms, never three in a row', () => {
    let rooms = 0;
    let filled = 0;
    for (const f of floors()) {
      const L = f.layout!;
      for (const i of roomPieces(f)) {
        rooms++;
        if (roomHasContent(f, i)) filled++;
      }
      const roams = (i: number) =>
        !!f.packs?.some((p) => p.room === i && !p.guard && !p.unique && p.kind !== 'boss');
      for (const i of roomPieces(f))
        if (roams(i)) for (const j of roomNeighbours(f, i)) expect(roams(j)).toBe(false);
      // The critical path, entry to exit, by the pieces' links.
      const exit = L.pieces.findIndex((p) => p.role === 'exit' || p.role === 'boss');
      const prev = new Map<number, number>([[0, -1]]);
      const q = [0];
      while (q.length) {
        const i = q.shift()!;
        for (const [a, b] of L.links) {
          const j = a === i ? b : b === i ? a : -1;
          if (j >= 0 && !prev.has(j)) {
            prev.set(j, i);
            q.push(j);
          }
        }
      }
      const path: number[] = [];
      for (let i = exit; i >= 0; i = prev.get(i)!) path.unshift(i);
      const onPath = path.filter((i) => L.pieces[i]!.role !== 'corridor');
      for (let i = 0; i + 2 < onPath.length; i++)
        expect(roams(onPath[i]!) && roams(onPath[i + 1]!) && roams(onPath[i + 2]!)).toBe(false);
    }
    expect(filled / rooms).toBeGreaterThanOrEqual(0.9);
  }, 60_000);

  it('gives each act its own wild pool, at least 5 babies found nowhere else', () => {
    const babies = new Set(
      SPECIES.filter((s) => s.stage === 'baby' && isCommonSpecies(s)).map((s) => s.id),
    );
    ACT_WILD.forEach((pool, act) => {
      for (const id of pool) expect(babies.has(id)).toBe(true);
      const others = new Set(ACT_WILD.filter((_, j) => j !== act).flat());
      expect(pool.filter((id) => !others.has(id)).length).toBeGreaterThanOrEqual(5);
    });
    for (let s = 1; s <= 20; s++) {
      const act = s % 5;
      const f = actFloor(s * 131, act, actStartDepth(act), 4);
      for (const w of f.wildSpots) expect(ACT_WILD[act]).toContain(w.species);
    }
  });

  it('scans a nursery nook after 3 s of standing quietly, 1 s with a Shy friend', () => {
    const time = (shy: boolean): number => {
      let world = underground(20);
      for (let s = 21; !world.dungeon!.wild.some((x) => x.nook); s++) world = underground(s);
      if (shy) for (const n of world.nubbins) n.personality = 'shy';
      const run = world.dungeon!;
      run.packs = [];
      run.strays = [];
      run.graceUntilMs = 0;
      const w = run.wild.find((x) => x.nook)!;
      expect(w).toBeTruthy();
      world.keeper.pos = { x: w.pos.x + 1, z: w.pos.z };
      world.keeper.moveTarget = null;
      for (let t = 0; t < 6000; t += SIM.stepMs) {
        world.keeper.pos = { x: w.pos.x + 1, z: w.pos.z };
        if (stepWorld(world, SIM.stepMs).some((e) => e.kind === 'wildScanned')) return t;
      }
      return -1;
    };
    const calm = time(false);
    const shy = time(true);
    expect(calm).toBeGreaterThanOrEqual(HOLLOW_R7.nook.quietMs - 200);
    expect(calm).toBeLessThanOrEqual(HOLLOW_R7.nook.quietMs + 200);
    expect(shy).toBeGreaterThanOrEqual(HOLLOW_R7.nook.shyMs - 200);
    expect(shy).toBeLessThanOrEqual(HOLLOW_R7.nook.shyMs + 200);
  });
});
