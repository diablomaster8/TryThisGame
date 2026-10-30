import { afterEach, describe, expect, it } from 'vitest';
import { PARTY_R8 } from '../../src/config/dungeon-party-r8';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { HOLLOW_R8_TEXT } from '../../src/config/strings-hollow-r8-party';
import {
  cellCentre,
  cellOf,
  exploredMask,
  FLOOR,
  runFloor,
  WATER,
  type Floor,
} from '../../src/sim/dungeon';
import { recommendedParty } from '../../src/sim/dungeon-party';
import { setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { findPath, footprints, guidePath } from '../../src/sim/dungeon-guide';
import { noteStoryScroll, todayShareText } from '../../src/sim/dungeon-log';
import {
  autoRole,
  fetchRadiusOf,
  hollowPartySize,
  lightBonus,
  mayFetch,
  roleOf,
  stepScout,
} from '../../src/sim/dungeon-roles';
import { ghostTrail, noteActTime, noteTrail } from '../../src/sim/dungeon-speed';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 8, "party and run UI": roles (R0167), picker (R0168), the boss scroll (R0207),
// the guide (R0208), the ghost line (R0187) and today's share line (R0185).

function world4(seed = 5): World {
  const world = createWorld(seed, 0);
  const rng = Rng.fromSeed(9);
  while (world.nubbins.length < 4)
    world.nubbins.push(createEgg(`extra-${world.nubbins.length}`, { x: 0, z: 0 }, rng));
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

function underground(seed = 8): World {
  const world = world4(seed);
  applyCommand(world, { kind: 'enterDungeon', daily: false }, []);
  world.dungeon!.graceUntilMs = 0;
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

function level(n: Nubbin, stat: 'swim' | 'fly' | 'run' | 'power' | 'stamina', lv: number) {
  n.stats[stat].points = lv * 100;
}

afterEach(() => setEncounterHandler(null));

describe('party roles (R0167)', () => {
  it('picks a role from the best stat, and Mischievous Nubbins scout', () => {
    const [a, b, c, d] = world4().nubbins as [Nubbin, Nubbin, Nubbin, Nubbin];
    level(a, 'fly', 20);
    level(b, 'power', 20);
    level(c, 'swim', 20);
    level(d, 'run', 10);
    expect([a, b, c, d].map(autoRole)).toEqual(['light', 'fight', 'swim', 'fetch']);
    level(d, 'run', PARTY_R8.roles.scout.minRun);
    expect(autoRole(d)).toBe('scout');
    level(a, 'run', 0);
    a.personality = 'mischievous';
    expect(autoRole(a)).toBe('scout');
  });

  it('a tap changes the role, saves, and clears back to automatic', () => {
    const world = world4();
    const n = world.nubbins[0]!;
    applyCommand(world, { kind: 'setHollowRole', id: n.id, role: 'fight' }, []);
    expect(roleOf(world, n)).toBe('fight');
    const back = deserialize(serialize(world, 0)).world;
    expect(back.hollow.roles?.[n.id]).toBe('fight');
    applyCommand(world, { kind: 'setHollowRole', id: n.id, role: null }, []);
    expect(roleOf(world, n)).toBe(autoRole(n));
  });

  it('three come along, four once Act II is cleared', () => {
    const world = world4();
    expect(hollowPartySize(world)).toBe(3);
    applyCommand(world, { kind: 'enterDungeon', daily: false }, []);
    expect(world.dungeon!.party).toHaveLength(3);
    applyCommand(world, { kind: 'leaveDungeon' }, []);
    world.hollow.acts[1] = { ...world.hollow.acts[1]!, bossDefeated: true };
    expect(hollowPartySize(world)).toBe(4);
  });

  it('a Light Nubbin widens what the Keeper sees', () => {
    const plain = underground();
    const lit = underground();
    const allFetch = (w: World) =>
      (w.hollow.roles = Object.fromEntries(w.dungeon!.party.map((id) => [id, 'fetch' as const])));
    allFetch(plain);
    allFetch(lit);
    lit.hollow.roles![lit.dungeon!.party[0]!] = 'light';
    expect(lightBonus(lit, lit.dungeon!)).toBe(PARTY_R8.roles.light.explore);
    expect(lightBonus(plain, plain.dungeon!)).toBe(0);
    step(plain, SIM.stepMs);
    step(lit, SIM.stepMs);
    const seen = (w: World) =>
      exploredMask(w.dungeon!, runFloor(w)!).reduce((s: number, v: number) => s + v, 0);
    expect(seen(lit)).toBeGreaterThan(seen(plain));
  });

  it('Fetch reaches further with Run, Lazy stays close', () => {
    const world = world4();
    const n = world.nubbins[0]!;
    world.hollow.roles = { [n.id]: 'fetch' };
    level(n, 'run', 30);
    expect(fetchRadiusOf(world, n)).toBeCloseTo(DUNGEON.fetchRadius + 3);
    world.hollow.roles = { [n.id]: 'fight' };
    expect(fetchRadiusOf(world, n)).toBe(DUNGEON.fetchRadius);
    n.personality = 'lazy';
    expect(fetchRadiusOf(world, n)).toBe(PARTY_R8.roles.lazyFetch);
  });

  it('only a Swim Nubbin goes for loot on an island', () => {
    const world = world4();
    const [swimmer, other] = world.nubbins as [Nubbin, Nubbin];
    world.hollow.roles = { [swimmer.id]: 'swim', [other.id]: 'fetch' };
    // Dry, dry, water, dry, dry: the right-hand pair is an island.
    const f = {
      cols: 5,
      rows: 1,
      cells: Uint8Array.from([FLOOR, FLOOR, WATER, FLOOR, FLOOR]),
    } as unknown as Floor;
    world.keeper.pos = cellCentre(f, { x: 0, y: 0 });
    expect(cellOf(f, world.keeper.pos)).toEqual({ x: 0, y: 0 });
    expect(mayFetch(world, f, swimmer, { x: 4, y: 0 })).toBe(true);
    expect(mayFetch(world, f, other, { x: 4, y: 0 })).toBe(false);
    expect(mayFetch(world, f, other, { x: 1, y: 0 })).toBe(true);
  });

  it('a Fight Nubbin walks at the front of the party', () => {
    const world = world4();
    const ids = world.nubbins.map((n) => n.id);
    world.hollow.roles = Object.fromEntries(ids.map((id) => [id, 'fetch' as const]));
    world.hollow.roles[ids[2]!] = 'fight';
    applyCommand(world, { kind: 'setHollowParty', ids: [ids[0]!, ids[1]!, ids[2]!] }, []);
    applyCommand(world, { kind: 'enterDungeon', daily: false }, []);
    expect(world.dungeon!.party[0]).toBe(ids[2]);
  });

  it('a Scout calls out a pack once, before it notices', () => {
    for (const seed of [8, 9, 10, 11]) {
      const world = underground(seed);
      const run = world.dungeon!;
      const pack = run.packs?.find((p) => p.state === 'idle' && !p.asleep);
      if (!pack) continue;
      world.hollow.roles = { [run.party[0]!]: 'scout' };
      pack.pos = { x: world.keeper.pos.x + 2 * DUNGEON.cell, z: world.keeper.pos.z };
      const events: SimEvent[] = [];
      stepScout(world, run, events);
      stepScout(world, run, events);
      expect(events.filter((e) => e.kind === 'scoutSpotted')).toHaveLength(1);
      return;
    }
    throw new Error('no floor with an idle pack');
  });

  it('"Recommended" covers different roles first', () => {
    const world = world4();
    const [a, b, c, d] = world.nubbins as [Nubbin, Nubbin, Nubbin, Nubbin];
    level(a, 'power', 30);
    level(b, 'power', 29);
    level(c, 'fly', 5);
    level(d, 'swim', 5);
    const pick = recommendedParty(world);
    expect(pick).toHaveLength(3);
    expect(pick).toContain(a.id);
    expect(pick).not.toContain(b.id);
  });
});

describe('the "Story so far" scroll (R0207)', () => {
  it('unrolls once per act and never in chapters 9 to 11', () => {
    const world = world4();
    const events: SimEvent[] = [];
    noteStoryScroll(world, 0, events);
    noteStoryScroll(world, 0, events);
    expect(events).toEqual([{ kind: 'storyScroll', act: 0 }]);
    world.campaign = { ...(world.campaign ?? {}), chapter: 10 } as World['campaign'];
    noteStoryScroll(world, 1, events);
    expect(events).toHaveLength(1);
    expect(world.hollow.scrolls).toEqual([0]);
  });

  it('every act has 3 to 6 short lines', () => {
    for (const lines of Object.values(HOLLOW_R8_TEXT.scroll)) {
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines.length).toBeLessThanOrEqual(6);
      for (const l of lines) expect(l.length).toBeLessThanOrEqual(160);
    }
    expect(Object.keys(HOLLOW_R8_TEXT.scroll)).toHaveLength(5);
  });
});

describe('Show me the way (R0208)', () => {
  it('is off by default, then leads to the unexplored and to the stairs once seen', () => {
    const world = underground();
    expect(guidePath(world)).toBeNull();
    applyCommand(world, { kind: 'hollowGuide', on: true }, []);
    const f = runFloor(world)!;
    const path = guidePath(world)!;
    expect(path).not.toBeNull();
    const k = cellOf(f, world.keeper.pos);
    expect(path.cells[0]).toBe(k.y * f.cols + k.x);
    expect(path.goal).toBe('explore');
    expect(footprints(path).length).toBeGreaterThan(0);
    // Seen everything: the stairs down are the goal.
    const all = new Uint8Array(f.cells.length).fill(1);
    const way = findPath(f, all, k.y * f.cols + k.x);
    expect(way?.goal).toBe('stairs');
    const d = f.stairsDown!;
    expect(way!.cells[way!.cells.length - 1]).toBe(d.y * f.cols + d.x);
  });

  it('follows the Keeper on the next step (well within 250 ms)', () => {
    const world = underground();
    applyCommand(world, { kind: 'hollowGuide', on: true }, []);
    const f = runFloor(world)!;
    const first = guidePath(world)!;
    const next = first.cells[Math.min(3, first.cells.length - 1)]!;
    world.keeper.pos = cellCentre(f, { x: next % f.cols, y: Math.floor(next / f.cols) });
    step(world, SIM.stepMs);
    const k = cellOf(f, world.keeper.pos);
    expect(guidePath(world)!.cells[0]).toBe(k.y * f.cols + k.x);
  });
});

describe('the ghost line (R0187)', () => {
  it("a speed run's best keeps its path per level for the next run", () => {
    const world = underground();
    world.hollow.speedRun = true;
    const run = world.dungeon!;
    run.act = 0;
    const f = runFloor(world)!;
    noteTrail(world, run, f);
    world.keeper.pos = { x: world.keeper.pos.x + DUNGEON.cell, z: world.keeper.pos.z };
    noteTrail(world, run, f);
    noteTrail(world, run, f);
    noteActTime(world, run, []);
    expect(ghostTrail(world, run)).toHaveLength(2);
    world.hollow.speedRun = false;
    expect(ghostTrail(world, run)).toHaveLength(0);
  });
});

describe("today's share line (R0185)", () => {
  it('reads today only', () => {
    const world = world4();
    expect(todayShareText(world, HOLLOW_R8_TEXT.shareText, '2026-10-30')).toBeNull();
    world.hollow.today = { day: '2026-10-30', deepest: 3, bestMs: 372_000, finds: 41 };
    const line = todayShareText(world, HOLLOW_R8_TEXT.shareText, '2026-10-30')!;
    expect(line).toContain('3');
    expect(line).toContain('6:12');
    expect(line).toContain('41');
    expect(todayShareText(world, HOLLOW_R8_TEXT.shareText, '2026-10-31')).toBeNull();
  });
});
