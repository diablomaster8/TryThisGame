import { afterEach, describe, expect, it } from 'vitest';
import { SECRETS } from '../../src/config/dungeon-r9-b';
import { SET_PIECES } from '../../src/config/dungeon-items-r8';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { titlesEarned } from '../../src/sim/achievements';
import { bestAllyAction } from '../../src/sim/battle';
import { cellCentre, FLOOR, runFloor } from '../../src/sim/dungeon';
import { actProgress } from '../../src/sim/dungeon-acts';
import {
  setEncounterHandler,
  startEncounter,
  type EncounterSpec,
} from '../../src/sim/dungeon-encounters';
import { fieldFloor } from '../../src/sim/dungeon-outdoor';
import { canEnterSecret, secretPackWon } from '../../src/sim/dungeon-secret-levels';
import { enterTown, zoneStairs } from '../../src/sim/dungeon-zones';
import { canUseAcorn } from '../../src/sim/dungeon-travel';
import { waypointHere } from '../../src/sim/dungeon-levels';
import { ensureGear } from '../../src/sim/gear';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import type { BarrowSlot, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 9, helper b: the Moo Meadow (R0189), its wheelbarrow recipe (R0177) and the
// Pillow Fort with the Pillow Trio (R0183).

const CAMP = 4;

/** A household that has beaten every act boss, standing in Act V's camp. */
function atCamp(seed = 4): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) hatch(n, events, 0);
  for (let a = 0; a <= 4; a++) actProgress(w, a).bossDefeated = true;
  w.hollow.camp.questsPaid.push(1);
  expect(enterTown(w, CAMP, new Rng(seed), [])).toBe(true);
  w.dungeon!.graceUntilMs = 0;
  return w;
}

const key = (id: string): BarrowSlot => ({ kind: 'key', id });

function mix(w: World, slots: BarrowSlot[]): SimEvent[] {
  const events: SimEvent[] = [];
  applyCommand(w, { kind: 'wheelbarrowMix', slots }, events);
  return events;
}

function enter(w: World, where: 'moo' | 'fort'): SimEvent[] {
  const events: SimEvent[] = [];
  applyCommand(w, { kind: 'enterHollowSecret', where }, events);
  return events;
}

/** A win over a pack on the current floor, through the real encounter path. */
function win(w: World, packId: string): { spec: EncounterSpec; events: SimEvent[] } {
  let seen: EncounterSpec | null = null;
  setEncounterHandler((_w, spec) => {
    seen = spec;
    return 'won';
  });
  const f = runFloor(w)!;
  const pack = w.dungeon!.packs!.find((p) => p.id === packId)!;
  const events: SimEvent[] = [];
  startEncounter(w, f, pack, new Rng(3), events);
  return { spec: seen!, events };
}

afterEach(() => setEncounterHandler(null));

describe('the Moo Meadow recipe (R0177, R0189)', () => {
  it('the Act V boss leaves the keepsakes, one of each held at most', () => {
    const w = atCamp();
    const run = w.dungeon!;
    const boss = { kind: 'boss', members: [], id: 'pack-boss' } as never;
    const events: SimEvent[] = [];
    secretPackWon(w, { ...run, act: 3 }, boss, new Rng(1), events);
    expect(w.gear?.keys?.teaspoon).toBeUndefined();
    secretPackWon(w, run, boss, new Rng(1), events);
    secretPackWon(w, run, boss, new Rng(1), events);
    expect(w.gear!.keys).toMatchObject({ teaspoon: 1, bell: 1 });
    expect(events.filter((e) => e.kind === 'hollowItems' && e.what === 'secret')).toHaveLength(1);
  });

  it("Gran's Teaspoon and a milk bell open the portal once a trip; bad mixes take nothing", () => {
    const w = atCamp();
    const g = ensureGear(w);
    g.keys = { teaspoon: 1, bell: 1 };
    // One keepsake alone, or with something else, is no mix.
    expect(mix(w, [key('teaspoon')])).toEqual([{ kind: 'hollowItems', what: 'noMix', id: '' }]);
    expect(g.keys).toEqual({ teaspoon: 1, bell: 1 });
    // Before the Act V boss, the pair does nothing either.
    actProgress(w, 4).bossDefeated = false;
    mix(w, [key('teaspoon'), key('bell')]);
    expect(g.mooMeadow).toBeUndefined();
    actProgress(w, 4).bossDefeated = true;
    const events = mix(w, [key('teaspoon'), key('bell')]);
    expect(g.mooMeadow).toBe('open');
    expect(g.keys).toEqual({ teaspoon: 0, bell: 0 });
    expect(g.recipes).toContain('moo-meadow');
    expect(events).toContainEqual({ kind: 'hollowItems', what: 'moo', id: 'moo-meadow' });
    // Through it and back: the trip's visit is spent, so a second pair does not open it again.
    enter(w, 'moo');
    zoneStairs(w, w.dungeon!, 'up', []);
    g.keys = { teaspoon: 1, bell: 1 };
    mix(w, [key('teaspoon'), key('bell')]);
    expect(g.mooMeadow).toBeUndefined();
    expect(g.keys).toEqual({ teaspoon: 1, bell: 1 });
  });
});

describe('the Moo Meadow level (R0189)', () => {
  it('is a small sunny field with friendly folk, Moo Crew herds and the Cow Queen', () => {
    const w = atCamp();
    ensureGear(w).mooMeadow = 'open';
    expect(canEnterSecret(w, 'moo')).toBe(true);
    enter(w, 'moo');
    const run = w.dungeon!;
    expect(run.zone).toBe('moo');
    expect(w.gear!.mooMeadow).toBeUndefined();
    const f = runFloor(w)!;
    // The outdoor generator's look (open sky in both renderers), no way down, no cave mouths.
    expect(f.zone).toBe('field');
    expect([f.cols, f.rows]).toEqual([SECRETS.moo.field.cols, SECRETS.moo.field.rows]);
    expect(f.stairsDown).toBeNull();
    expect(f.mouths).toEqual([]);
    expect(f.wildSpots.length).toBeGreaterThanOrEqual(SECRETS.moo.field.wildlife[0]);
    for (const s of f.wildSpots) expect(SECRETS.moo.friends).toContain(s.species);
    const herds = f.packs!.filter((p) => p.family === 'moo-crew' && p.kind === 'normal');
    expect(herds.length).toBeGreaterThanOrEqual(SECRETS.moo.herds[0]);
    for (const h of herds) {
      expect(h.members.length).toBeGreaterThanOrEqual(8);
      expect(h.members.length).toBeLessThanOrEqual(12);
      expect(f.cells[h.cell.y * f.cols + h.cell.x]).toBe(FLOOR);
    }
    expect(f.packs!.filter((p) => p.unique === 'cow-queen')).toHaveLength(1);
    // No waypoint stone and no acorn here: the way out is the stairs up to the camp.
    expect(waypointHere(run)).toBeNull();
    expect(canUseAcorn(w)).toBe(false);
  });

  it('the herds moo-ve along; the Cow Queen leaves a Picnic piece and her bonnet', () => {
    const w = atCamp();
    ensureGear(w).mooMeadow = 'open';
    enter(w, 'moo');
    const f = runFloor(w)!;
    const herd = f.packs!.find((p) => p.family === 'moo-crew' && p.kind === 'normal')!;
    const h = win(w, herd.id);
    expect(h.events).toContainEqual({ kind: 'hollowItems', what: 'herd', id: herd.id });
    const shells = w.inventory.shells;
    const q = win(w, 'pack-unique-cow-queen');
    expect(q.spec.kind).toBe('unique');
    expect(w.inventory.hats).toContain('moo-bonnet');
    const moo = SET_PIECES.filter((p) => p.set === 'moo').map((p) => p.id);
    expect(w.gear!.items.some((it) => it.setPiece && moo.includes(it.setPiece))).toBe(true);
    expect(w.inventory.shells - shells).toBeGreaterThanOrEqual(SECRETS.bonus['cow-queen']!);
    expect(w.hollow.uniquesBeaten).toContain('cow-queen');
  });

  it('the stairs up go home to the camp, and home from there works', () => {
    const w = atCamp();
    ensureGear(w).mooMeadow = 'open';
    enter(w, 'moo');
    expect(zoneStairs(w, w.dungeon!, 'up', [])).toBe(true);
    expect(w.dungeon!.zone).toBe('town');
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'leaveDungeon' }, events);
    expect(w.location).toBe('grove');
    expect(w.dungeon).toBeNull();
  });

  it('leaves the act fields as they were (the generator is shared)', () => {
    const a = fieldFloor(77, 1);
    const b = fieldFloor(77, 1);
    expect(a).toBe(b);
    expect([a.cols, a.rows]).toEqual([128, 96]);
    expect(a.mouths!.length).toBeGreaterThan(0);
  });
});

describe('the Pillow Fort (R0183)', () => {
  it('keys → mix → fort → the Pillow Trio → crown, title, back to camp', () => {
    const w = atCamp();
    const g = ensureGear(w);
    g.keys = { giggles: 1, yawns: 1, brrr: 1 };
    mix(w, [key('giggles'), key('yawns'), key('brrr')]);
    expect(g.pillowFort).toBe('open');
    expect(canEnterSecret(w, 'moo')).toBe(false);
    enter(w, 'fort');
    const run = w.dungeon!;
    expect(run.zone).toBe('fort');
    const f = runFloor(w)!;
    expect(f.zone).toBe('side');
    expect(f.stairsDown).toBeNull();
    // Three mini-bosses at once, and nothing else on the floor.
    expect(f.packs).toHaveLength(1);
    const trio = f.packs![0]!;
    expect(trio.unique).toBe('pillow-trio');
    expect(trio.members.map((m) => m.species)).toEqual([...SECRETS.fort.trio]);
    // The fort stays open after a loss.
    setEncounterHandler(() => 'lost');
    startEncounter(w, f, run.packs![0]!, new Rng(1), []);
    expect(g.pillowFort).toBe('open');
    const shells = w.inventory.shells;
    const { spec, events } = win(w, trio.id);
    // Handed to the fight as one pack of three, the party's size.
    expect(spec.members).toHaveLength(3);
    expect(spec.party).toHaveLength(run.party.length);
    expect(spec.kind).toBe('unique');
    expect(events).toContainEqual({ kind: 'hollowItems', what: 'secret', id: 'trio' });
    expect(events).toContainEqual({ kind: 'hollowWearable', id: 'pillow-crown' });
    expect(w.inventory.hats).toContain('pillow-crown');
    expect(titlesEarned(w)).toContain('Pillow Champion');
    expect(g.pillowFort).toBeUndefined();
    expect(w.inventory.shells - shells).toBeGreaterThanOrEqual(SECRETS.bonus['pillow-trio']!);
    // A second win pays no bonus and gives no second crown.
    expect(waypointHere(run)).toBeNull();
    zoneStairs(w, run, 'up', []);
    expect(run.zone).toBe('town');
    expect(canEnterSecret(w, 'fort')).toBe(false);
  });

  it('a level-appropriate party beats the trio on Brisk on the real battle core', () => {
    let wins = 0;
    const seeds = [3, 5, 8, 13, 21, 34];
    for (const seed of seeds) {
      const w = atCamp(seed);
      w.hollow.difficulty = 'brisk';
      w.dungeon!.difficulty = 'brisk';
      // An Act V party: every stat at level 40.
      for (const n of w.nubbins)
        for (const s of Object.values(n.stats)) s.points = Math.max(s.points, 4000);
      ensureGear(w).pillowFort = 'open';
      enter(w, 'fort');
      const f = runFloor(w)!;
      const trio = f.packs![0]!;
      const home = cellCentre(f, trio.cell);
      w.keeper.pos = { x: home.x + 0.3 * DUNGEON.cell, z: home.z };
      w.dungeon!.packs![0]!.pos = { ...home };
      w.dungeon!.graceUntilMs = 0;
      for (let t = 0; t < 2000 && !w.battle; t += SIM.stepMs) stepWorld(w, SIM.stepMs);
      expect(w.battle).toBeTruthy();
      for (let i = 0; i < 600 && w.battle && !w.battle.result; i++)
        applyCommand(w, { kind: 'battleAct', action: bestAllyAction(w.battle) }, []);
      stepWorld(w, SIM.stepMs);
      if (w.hollow.uniquesBeaten.includes('pillow-trio')) wins++;
    }
    expect(wins).toBeGreaterThanOrEqual(seeds.length / 2);
  });
});
