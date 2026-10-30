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
import { ACTS } from '../../src/config/dungeon-acts';
import { cosmetic } from '../../src/config/cosmetics';
import { HOLLOW_CAPE, HOLLOW_HATS } from '../../src/config/cosmetics-hollow';
import { bossWon } from '../../src/sim/dungeon-boss';
import { noteActTime, speedKey } from '../../src/sim/dungeon-speed';
import { goToLevel } from '../../src/sim/dungeon-travel';
import { foeLevel } from '../../src/sim/dungeon-density';
import { hollowTier, noteFinalBoss, setHollowTier, tiersOpen } from '../../src/sim/dungeon-tiers';
import { rollRarity } from '../../src/sim/gear';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import { generateV3 } from '../../src/sim/dungeon-gen-v3';
import { setEncounterHandler, swimFamily } from '../../src/sim/dungeon-encounters';
import { hatch } from '../../src/sim/lifecycle';
import type { DungeonRun, SimEvent, World } from '../../src/sim/types';
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

describe('difficulty tiers (R0179)', () => {
  it('levels foes and loot per tier', () => {
    const band = { act: 0, level: 1, boss: false } as const;
    expect(foeLevel({ ...band, difficulty: 'cosy' })).toBe(2);
    expect(foeLevel({ ...band, difficulty: 'brisk' })).toBe(37);
    expect(foeLevel({ ...band, difficulty: 'wild' })).toBe(72);
    expect(foeLevel({ act: 4, level: 9, boss: true, difficulty: 'wild' })).toBe(99);
    // Fancy-or-better share over many rolls: ×1, ×1.5, ×2.2.
    const share = (mul: number): number => {
      const rng = new Rng(77);
      let good = 0;
      for (let i = 0; i < 40_000; i++) {
        const r = rollRarity(rng, 0, mul);
        if (r === 'fancy' || r === 'legendary' || r === 'set') good++;
      }
      return good;
    };
    const base = share(1);
    expect(share(1.5) / base).toBeGreaterThan(1.35);
    expect(share(1.5) / base).toBeLessThan(1.65);
    expect(share(2.2) / base).toBeGreaterThan(1.95);
    // Packs on a Wild floor run bigger and higher than on Cosy.
    const cosy = actFloor(555, 0, actStartDepth(0) + 1, 4, 'cosy');
    const wild = actFloor(555, 0, actStartDepth(0) + 1, 4, 'wild');
    const top = (f: Floor) => Math.max(...f.packs!.flatMap((p) => p.members.map((m) => m.level)));
    expect(top(wild)).toBeGreaterThan(top(cosy) + 50);
  });

  it('opens Brisk after the last boss, keeps progress per tier, and goes back to Cosy', () => {
    const world = createWorld(3, 0);
    const events: SimEvent[] = [];
    expect(tiersOpen(world)).toEqual(['cosy']);
    expect(setHollowTier(world, 'brisk', events)).toBe(false);
    world.hollow.acts = ACTS.map(() => ({ bossDefeated: true, deepest: 3 }));
    world.hollow.waypoints = ['rootways.1'];
    noteFinalBoss(world, ACTS.length - 1, events);
    expect(tiersOpen(world)).toEqual(['cosy', 'brisk']);
    applyCommand(world, { kind: 'hollowTier', tier: 'brisk' }, events);
    expect(hollowTier(world)).toBe('brisk');
    expect(world.hollow.acts).toEqual([]);
    expect(world.hollow.waypoints).toEqual([]);
    // A Brisk act run carries its tier and makes Brisk floors.
    for (const n of world.nubbins) hatch(n, events, 0);
    applyCommand(world, { kind: 'enterAct', act: 0 }, events);
    expect(world.dungeon!.difficulty).toBe('brisk');
    applyCommand(world, { kind: 'leaveDungeon' }, events);
    world.dungeon = null;
    world.location = 'grove';
    // Back to Cosy: its progress is all there.
    applyCommand(world, { kind: 'hollowTier', tier: 'cosy' }, events);
    expect(world.hollow.acts.every((a) => a.bossDefeated)).toBe(true);
    expect(world.hollow.waypoints).toEqual(['rootways.1']);
    expect(world.hollow.difficulty).toBeUndefined();
    // And it survives a save.
    const back = deserialize(serialize(world, 0)).world;
    expect(back.hollow.tiersOpen).toEqual(['brisk']);
    expect(back.hollow.tierSaves?.brisk).toBeTruthy();
  });
});

describe('boss footing', () => {
  it('stands every act boss on dry floor, even where the dressing pooled water', () => {
    for (let act = 0; act < ACTS.length; act++)
      for (let s = 1; s <= 12; s++) {
        const f = actFloor(
          s * 7_717 + act,
          act,
          actStartDepth(act) + ACTS[act]!.levels.length - 1,
          4,
        );
        const b = f.packs!.find((p) => p.kind === 'boss')!;
        expect(f.cells[b.cell.y * f.cols + b.cell.x]).toBe(FLOOR);
      }
    const f = actFloor(376_560_671, 2, actStartDepth(2) + ACTS[2]!.levels.length - 1, 4);
    const b = f.packs!.find((p) => p.kind === 'boss')!;
    expect(f.cells[b.cell.y * f.cols + b.cell.x]).toBe(FLOOR);
  });
});

describe('Hollow keepsakes (R0206)', () => {
  it('gives each act boss its hat once and the cape with the fifth', () => {
    const world = createWorld(4, 0);
    const events: SimEvent[] = [];
    const run = { act: 0 } as DungeonRun;
    for (let act = 0; act < ACTS.length; act++) {
      run.act = act;
      bossWon(world, run, 10, new Rng(act + 1), events);
      bossWon(world, run, 10, new Rng(act + 9), events);
      expect(world.inventory.hats.filter((h) => h === HOLLOW_HATS[act])).toHaveLength(1);
      expect(world.inventory.hats.includes(HOLLOW_CAPE)).toBe(act === ACTS.length - 1);
    }
    expect(events.filter((e) => e.kind === 'hollowWearable')).toHaveLength(6);
    for (const id of [...HOLLOW_HATS, HOLLOW_CAPE]) {
      const c = cosmetic(id)!;
      expect(c.px?.length).toBeGreaterThan(0);
      expect(c.mesh?.length).toBeGreaterThan(0);
    }
  });
});

describe('speed runs (R0187)', () => {
  it('splits per level and keeps the best per act and tier', () => {
    const world = createWorld(6, 0);
    const events: SimEvent[] = [];
    for (const n of world.nubbins) hatch(n, events, 0);
    applyCommand(world, { kind: 'hollowSpeedRun', on: true }, events);
    const trip = (wait: number): SimEvent[] => {
      const out: SimEvent[] = [];
      world.dungeon = null;
      world.location = 'grove';
      applyCommand(world, { kind: 'enterAct', act: 0 }, out);
      const run = world.dungeon!;
      goToLevel(world, run, actStartDepth(0), 'up', out);
      for (let i = 0; i < 2; i++) {
        run.packs = [];
        run.strays = [];
        run.graceUntilMs = 0;
        out.push(...step(world, wait));
        const f = runFloor(world)!;
        world.keeper.pos = cellCentre(f, f.stairsDown!);
        run.pending = 'down';
        run.pendingPos = { ...world.keeper.pos };
        world.keeper.moveTarget = run.pendingPos;
        out.push(...step(world, 200));
      }
      noteActTime(world, run, out);
      return out;
    };
    const first = trip(2000);
    expect(first.filter((e) => e.kind === 'speedSplit')).toHaveLength(2);
    const rec = world.hollow.records![speedKey(0, 'cosy')]!;
    expect(rec.splits).toHaveLength(2);
    const best = rec.bestMs;
    const slow = trip(4000);
    expect(slow.find((e) => e.kind === 'speedFinish')).toMatchObject({ best: false });
    expect(world.hollow.records![speedKey(0, 'cosy')]!.bestMs).toBe(best);
    const split = slow.find((e) => e.kind === 'speedSplit');
    expect(split && split.kind === 'speedSplit' && split.delta! > 0).toBe(true);
    applyCommand(world, { kind: 'hollowSpeedRun', on: false }, events);
    expect(world.hollow.speedRun).toBeUndefined();
    expect(world.hollow.records).toBeTruthy();
  });
});
