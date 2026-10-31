import { afterEach, describe, expect, it } from 'vitest';
import { HOLLOW_R9D } from '../../src/config/dungeon-r9-d';
import { HOLLOW } from '../../src/config/tuning';
import {
  cellCentre,
  floorOf,
  floorOfRun,
  runFloor,
  WALL,
  type Floor,
} from '../../src/sim/dungeon';
import { actFloor } from '../../src/sim/dungeon-acts';
import { encounterSpec, setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { keyCells, reachMask } from '../../src/sim/dungeon-gaps';
import { guidePath } from '../../src/sim/dungeon-guide';
import { guideOn, hollowKid } from '../../src/sim/dungeon-kid';
import { pieceProblems, PIECES, STORY_PIECES } from '../../src/sim/dungeon-pieces';
import { holdAtShelves, shelfAt } from '../../src/sim/dungeon-shelves';
import { liveTraps } from '../../src/sim/dungeon-traps';
import { createEdu } from '../../src/sim/edu';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import {
  BEETLE_FLOORS,
  BEETLE_PIECES,
  BEETLE_STORY_SEED,
} from '../../src/sim/storyline-rules-beetle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { storylineWorld } from './storyline-driver';

// Lane B round 9, helper d: kid mode (R0188), raised shelves (R0191), authored Beetle Road
// floors (R0197) and the Cloister Gardens' pieces (R0144).

function world3(seed = 5): World {
  const world = createWorld(seed, 0);
  const rng = Rng.fromSeed(9);
  while (world.nubbins.length < 3)
    world.nubbins.push(createEgg(`extra-${world.nubbins.length}`, { x: 0, z: 0 }, rng));
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

afterEach(() => setEncounterHandler(null));

describe('kid mode (R0188)', () => {
  it('is off by default, on with the toggle, and always on in a Learning Grove', () => {
    const w = world3();
    expect(hollowKid(w)).toBe(false);
    expect(guideOn(w)).toBe(false);
    applyCommand(w, { kind: 'hollowKid', on: true }, []);
    expect(hollowKid(w)).toBe(true);
    // The guide defaults on in kid mode, and an explicit "off" sticks.
    expect(guideOn(w)).toBe(true);
    applyCommand(w, { kind: 'hollowGuide', on: false }, []);
    expect(guideOn(w)).toBe(false);
    applyCommand(w, { kind: 'hollowGuide', on: true }, []);
    expect(guideOn(w)).toBe(true);
    const edu = world3(6);
    edu.edu = createEdu(5);
    expect(hollowKid(edu)).toBe(true);
    applyCommand(edu, { kind: 'hollowKid', on: false }, []);
    expect(hollowKid(edu)).toBe(true);
  });

  it('gives a kid run small floors, no traps and gentle packs of one or two', () => {
    const w = world3();
    applyCommand(w, { kind: 'hollowKid', on: true }, []);
    applyCommand(w, { kind: 'enterDungeon', daily: false }, []);
    const run = w.dungeon!;
    expect(run.kid).toBe(true);
    const plain = floorOf(run.seed, run.depth, run.genVersion);
    const f = runFloor(w)!;
    expect(f.cols * f.rows).toBeLessThanOrEqual(
      (HOLLOW.v3.levels.standard.cols * HOLLOW.v3.levels.standard.rows) / 1.8,
    );
    expect(f.cols * f.rows).toBeLessThan(plain.cols * plain.rows);
    expect(guidePath(w)).not.toBeNull();
    for (let d = 1; d <= 8; d++) {
      const k = floorOf(run.seed, d, HOLLOW.genVersion, true);
      expect(k.traps ?? []).toEqual([]);
      for (const p of k.packs ?? []) {
        expect(p.members.length).toBeLessThanOrEqual(HOLLOW_R9D.kid.packMax);
        expect(p.members.every((m) => m.mods.length === 0)).toBe(true);
        expect(['champion', 'elite']).not.toContain(p.kind);
      }
    }
    // A boss level of an act: the boss comes alone.
    const boss = actFloor(77, 0, 3, 4, 'cosy', true);
    const bp = boss.packs!.find((p) => p.kind === 'boss')!;
    expect(bp.members.length).toBe(1);
    // Traps are never live, and fights get FIGHT's gentle flag.
    expect(liveTraps(w, plain)).toEqual([]);
    const pack = f.packs![0]!;
    expect(encounterSpec(w, f, pack, pack.cell).fight).toBe('gentle');
  });

  it('leaves a grown-up run as it was', () => {
    const w = world3();
    applyCommand(w, { kind: 'enterDungeon', daily: false }, []);
    expect(w.dungeon!.kid).toBeUndefined();
    expect(runFloor(w)).toBe(floorOf(w.dungeon!.seed, w.dungeon!.depth, w.dungeon!.genVersion));
  });
});

/** A version-4 floor with at least one shelf. */
function shelved(): { f: Floor; seed: number; depth: number } {
  for (let seed = 1; seed < 200; seed++) {
    const depth = 2 + (seed % 6);
    const f = floorOf(seed, depth);
    if (f.shelves?.length) return { f, seed, depth };
  }
  throw new Error('no shelf in 200 seeds');
}

describe('raised shelves (R0191)', () => {
  it('never put the stairs, the chest or the landmark behind a jump', () => {
    let shelves = 0;
    for (let seed = 1; seed <= 40; seed++) {
      for (const f of [floorOf(seed, 2 + (seed % 7)), actFloor(seed, seed % 2, 2 + (seed % 2), 4)]) {
        if (!f.shelves?.length) continue;
        shelves += f.shelves.length;
        const walled: Floor = { ...f, cells: f.cells.slice() };
        for (const s of f.shelves) for (const c of s.cells) walled.cells[c.y * f.cols + c.x] = WALL;
        const reach = reachMask(walled, f.stairsUp, false);
        const flat = reachMask(f, f.stairsUp, false);
        for (const c of keyCells(f)) {
          const i = c.y * f.cols + c.x;
          if (flat[i]) expect(reach[i], `${seed} key ${c.x},${c.y}`).toBe(1);
        }
        // Each shelf holds its find, a visible two steps up.
        for (const s of f.shelves) {
          const find = f.loot.find((l) => l.id === s.find)!;
          expect(shelfAt(f, find.cell)).toBeGreaterThanOrEqual(0);
        }
      }
    }
    expect(shelves).toBeGreaterThan(20);
  });

  it('needs a jump up, lets you drop off, and a flier lifts you once a floor', () => {
    const { f, seed, depth } = shelved();
    const w = world3();
    applyCommand(w, { kind: 'enterDungeon', daily: false }, []);
    const run = w.dungeon!;
    run.seed = seed;
    run.depth = depth;
    run.genVersion = HOLLOW.genVersion;
    expect(floorOfRun(run)).toBe(f);
    for (const n of w.nubbins) n.stats.fly.points = 0;
    const shelf = f.shelves![0]!;
    const top = shelf.cells[0]!;
    // A floor cell next to the shelf.
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
    // Walking up: held back.
    k.pos = { ...onto };
    k.y = 0;
    holdAtShelves(w, from.x, from.z, ev);
    expect(k.pos).toEqual(from);
    // Jumping up: allowed.
    k.pos = { ...onto };
    k.y = HOLLOW_R9D.shelves.climbHeight + 0.1;
    holdAtShelves(w, from.x, from.z, ev);
    expect(k.pos).toEqual(onto);
    // Dropping off: allowed on foot.
    k.pos = { ...from };
    k.y = 0;
    holdAtShelves(w, onto.x, onto.z, ev);
    expect(k.pos).toEqual(from);
    // A party Nubbin strong at Fly lifts the Keeper up, once on this floor.
    const flier = w.nubbins.find((n) => run.party.includes(n.id))!;
    flier.stats.fly.points = HOLLOW_R9D.fly.minLevel * 100;
    k.pos = { ...onto };
    holdAtShelves(w, from.x, from.z, ev);
    expect(k.pos).toEqual(onto);
    expect(ev).toContainEqual({ kind: 'hollowFlyLift', name: flier.name });
    k.pos = { ...onto };
    holdAtShelves(w, from.x, from.z, ev);
    expect(k.pos).toEqual(from);
  });

  it('only gives older floors shelves from version 4 on', () => {
    for (let seed = 1; seed <= 10; seed++) expect(floorOf(seed, 4, 3).shelves).toBeUndefined();
  });
});

describe('the Beetle Road on authored floors (R0197)', () => {
  it('loads each chapter’s authored piece', () => {
    for (const [chapter, depth] of Object.entries(BEETLE_FLOORS)) {
      const { world, events } = storylineWorld('beetle', 'marina');
      applyCommand(world, { kind: 'debugChapter', chapter: Number(chapter) }, events);
      const run = world.dungeon!;
      expect(run.depth).toBe(depth);
      expect(run.genVersion).toBe(HOLLOW.genVersion);
      const f = runFloor(world)!;
      const want = Object.values(BEETLE_PIECES[depth]!)[0]!;
      expect(f.layout!.pieces.map((p) => p.id), `chapter ${chapter}`).toContain(want);
      expect(f.packs).toEqual([]);
      // The authored exit holds the stairs down.
      if (BEETLE_PIECES[depth]!.exit) {
        const exit = f.layout!.pieces.find((p) => p.id === want)!;
        expect(exit.role).toBe('exit');
        const s = f.stairsDown!;
        expect(s.x >= exit.at.x && s.x < exit.at.x + exit.size[0]).toBe(true);
      }
      if (BEETLE_PIECES[depth]!.entry) {
        const e = f.layout!.pieces[0]!;
        expect(e.id).toBe(want);
      }
    }
  });

  it('keeps a story run saved on version 2 on its version-2 floors', () => {
    const { world, events } = storylineWorld('beetle', 'marina');
    applyCommand(world, { kind: 'debugChapter', chapter: 4 }, events);
    const run = world.dungeon!;
    run.genVersion = 2;
    const f = runFloor(world)!;
    expect(f.version).toBe(2);
    expect(f).toBe(floorOf(BEETLE_STORY_SEED, run.depth, 2));
    expect(f.layout).toBeUndefined();
  });
});

describe('the Cloister Gardens (R0144)', () => {
  it('has its own well-formed pieces, and Act II floors use them', () => {
    const cloister = PIECES.cloister!;
    for (const p of [...cloister, ...STORY_PIECES])
      expect([p.id, pieceProblems(p, HOLLOW.v3.slot - 2)]).toEqual([p.id, []]);
    for (let seed = 1; seed <= 6; seed++) {
      const f = actFloor(seed * 13, 1, 4, 4);
      expect(f.layout!.tileset).toBe('cloister');
      expect(f.layout!.pieces.every((p) => p.id.startsWith('cl-'))).toBe(true);
    }
  });
});
