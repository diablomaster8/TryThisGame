import { describe, expect, it } from 'vitest';
import { DUNGEON, HOLLOW, SIM } from '../../src/config/tuning';
import { suggest } from '../../src/sim/battle/tactics/ai';
import { activeUnit } from '../../src/sim/battle/tactics/engine';
import { cellCentre, enterDungeon, floorOf, runFloor } from '../../src/sim/dungeon';
import { HOLLOW_BATTLE_SOURCE } from '../../src/sim/dungeon-encounters';
import { reachMask } from '../../src/sim/dungeon-gaps';
import { rumbleEnded, rumbleKey, rumbleRoomOf } from '../../src/sim/dungeon-rumble';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0257 and R0282: rumble rooms on real Hollow floors, through lane C's tactics slice.
// R0281: a stray that bumps the Keeper asks for Calm or a snack before it snatches.

/** A run on `seed` at `depth` of the endless Hollow, with a strong hatched party. */
function runOn(seed: number, depth: number): World {
  const w = createWorld(11, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) {
    hatch(n, events, 0);
    for (const k of STAT_KEYS) n.stats[k].points = 2500;
  }
  enterDungeon(w, false, new Rng(3), events, { seed, depth });
  const run = w.dungeon!;
  run.genVersion = HOLLOW.genVersion;
  delete run.story;
  run.strays = [];
  run.packs = [];
  run.graceUntilMs = 0;
  return w;
}

/** The first seed whose depth-2 floor has a rumble room. */
function rumbleSeed(): number {
  for (let s = 1; s < 400; s++) if (rumbleRoomOf(floorOf(s, 2), s, 2)) return s;
  throw new Error('no rumble floor');
}

describe('rumble rooms (R0257, R0282)', () => {
  it('marks about a third of floors, and the stairs never need the room', () => {
    let floors = 0;
    let marked = 0;
    for (let s = 1; s <= 200; s++) {
      const f = floorOf(s * 7919, 2 + (s % 5));
      const rr = rumbleRoomOf(f, s * 7919, 2 + (s % 5));
      floors++;
      if (!rr) continue;
      marked++;
      const r = f.rooms[rr.room]!;
      const cells = f.cells.slice();
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++) cells[y * f.cols + x] = 0;
      const down = f.stairsDown!;
      expect(reachMask({ ...f, cells }, f.stairsUp, true)[down.y * f.cols + down.x]).toBe(1);
      expect(rr.door.length).toBeGreaterThan(0);
    }
    expect(marked / floors).toBeGreaterThan(0.28);
    expect(marked / floors).toBeLessThan(0.38);
  }, 60_000);

  it('never marks depth 1', () => {
    for (let s = 1; s <= 60; s++) expect(rumbleRoomOf(floorOf(s, 1), s, 1)).toBeNull();
  });

  it('starts a tactics bout on walking in, survives a reload, and books the room once', () => {
    const seed = rumbleSeed();
    const w = runOn(seed, 2);
    const run = w.dungeon!;
    const f = runFloor(w)!;
    const rr = rumbleRoomOf(f, seed, 2)!;
    w.keeper.pos = cellCentre(f, rr.centre);
    const out = stepWorld(w, SIM.stepMs);
    expect(out).toContainEqual({
      kind: 'rumbleRoom',
      phase: 'start',
      prefix: rr.prefix,
      loot: null,
    });
    expect(w.tactics).toBeTruthy();
    const ctx = w.tactics!.context;
    expect(ctx.kind === 'encounter' && ctx.source).toBe(HOLLOW_BATTLE_SOURCE);
    expect(ctx.kind === 'encounter' && ctx.key).toBe(rumbleKey(run));
    // The champion pack's prefix is on its foes.
    const foes = w.tactics!.units.filter((u) => u.c.side === 1);
    if (rr.prefix === 'sticky')
      expect(foes.every((u) => u.c.moves.includes('bear-hug'))).toBe(true);
    // The floor holds still: the keeper does not walk while the board is up.
    w.keeper.moveTarget = { x: 0, z: 0 };
    stepWorld(w, SIM.stepMs);
    expect(w.keeper.moveTarget).toBeNull();
    // A reload mid-bout keeps the board and the run.
    const back = deserialize(serialize(w, 0)).world;
    expect(back.tactics?.units.length).toBe(w.tactics!.units.length);
    expect(back.dungeon?.rumble?.wait).toBe(rumbleKey(run));
    // Play it out on the AI's suggestions.
    const events: SimEvent[] = [];
    for (let i = 0; i < 400 && back.tactics && !back.tactics.result; i++) {
      const s = back.tactics;
      const u = activeUnit(s)!;
      for (const a of suggest(s)) applyCommand(back, { kind: 'tacticsAct', action: a }, events);
      if (back.tactics?.active === u.c.id)
        applyCommand(back, { kind: 'tacticsAct', action: { k: 'wait', face: u.face } }, events);
    }
    const end = events.find((e) => e.kind === 'rumbleRoom');
    expect(end && end.kind === 'rumbleRoom' && end.phase).toMatch(/won|lost/);
    if (end?.kind === 'rumbleRoom' && end.phase === 'won')
      expect(back.dungeon!.rumble!.done).toContain(rumbleKey(back.dungeon!));
    applyCommand(back, { kind: 'tacticsClose' }, events);
    expect(back.tactics).toBeUndefined();
  });

  it('a win pays the chest and the haul; a second win is not booked twice', () => {
    const seed = rumbleSeed();
    const w = runOn(seed, 2);
    const run = w.dungeon!;
    const end: SimEvent = {
      kind: 'tacticsEnd',
      source: HOLLOW_BATTLE_SOURCE,
      key: rumbleKey(run),
      winner: 0,
      reason: 'objective',
      shells: 40,
      essence: 'swim',
    } as SimEvent;
    const events: SimEvent[] = [];
    const before = run.haul.shells;
    rumbleEnded(w, [end], events);
    const won = events.find((e) => e.kind === 'rumbleRoom');
    expect(won?.kind === 'rumbleRoom' && won.phase).toBe('won');
    expect(won?.kind === 'rumbleRoom' && won.loot).toBeTruthy();
    expect(run.haul.shells).toBeGreaterThanOrEqual(before + 40);
    expect(run.rumble!.done).toEqual([rumbleKey(run)]);
    rumbleEnded(w, [end], events);
    expect(run.rumble!.done).toEqual([rumbleKey(run)]);
    // A won room never starts again.
    const f = runFloor(w)!;
    w.keeper.pos = cellCentre(f, rumbleRoomOf(f, seed, 2)!.centre);
    delete run.rumble!.wait;
    stepWorld(w, SIM.stepMs);
    expect(w.tactics).toBeUndefined();
  });
});

describe("the stray's choice (R0281)", () => {
  function strayRun(): World {
    const w = createWorld(8, 0);
    const events: SimEvent[] = [];
    for (const n of w.nubbins) hatch(n, events, 0);
    w.inventory.shells = 55;
    w.inventory.fruit = 0;
    applyCommand(w, { kind: 'enterDungeon', daily: false }, events);
    w.dungeon!.graceUntilMs = 0;
    for (const p of w.dungeon!.packs ?? []) p.state = 'beaten';
    return w;
  }

  /** Glues the Keeper to the first stray until it asks; returns the stray's id. */
  function bump(w: World): string {
    const s = w.dungeon!.strays[0]!;
    for (let t = 0; t < 5000; t += SIM.stepMs) {
      w.keeper.pos = { x: s.pos.x + 0.3, z: s.pos.z };
      if (stepWorld(w, SIM.stepMs).some((e) => e.kind === 'strayAsk')) return s.id;
    }
    throw new Error('the stray never asked');
  }

  it('ignored for the ask time, it snatches as before', () => {
    const w = strayRun();
    bump(w);
    const out: SimEvent[] = [];
    for (let t = 0; t <= HOLLOW.strayChoice.askMs; t += SIM.stepMs)
      out.push(...stepWorld(w, SIM.stepMs));
    expect(out).toContainEqual({ kind: 'strayStartled', shells: DUNGEON.straySnatch });
    expect(w.inventory.shells).toBe(55 - DUNGEON.straySnatch);
  });

  it('calmed in a bout, it gives back 1.5 times what it would have taken', () => {
    const w = strayRun();
    const id = bump(w);
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'strayCalm', id }, events);
    expect(w.battle).toBeTruthy();
    expect(w.dungeon!.strayBout?.id).toBe(id);
    const ctx = w.battle!.context;
    expect(ctx.kind === 'encounter' && ctx.foes[0]!.shadow).toBe(true);
    // R0256: a reload mid-bout keeps the bout and the stray waiting on it.
    const saved = deserialize(serialize(w, 0)).world;
    expect(saved.battle?.context).toEqual(w.battle!.context);
    expect(saved.dungeon?.strayBout).toEqual(w.dungeon!.strayBout);
    // Nothing is snatched while the bout is on.
    for (let t = 0; t < 5000; t += SIM.stepMs) stepWorld(w, SIM.stepMs);
    expect(w.inventory.shells).toBe(55);
    // The party calms it (the bout's own result, as a timed turn would leave it).
    w.battle!.result = { winner: 0, reason: 'friends' };
    const out = stepWorld(w, SIM.stepMs);
    const back = Math.round(DUNGEON.straySnatch * HOLLOW.strayChoice.payback);
    expect(out).toContainEqual({ kind: 'strayCalmed', ok: true, shells: back });
    expect(w.inventory.shells).toBe(55 + back);
    expect(w.dungeon!.strays.some((s) => s.id === id)).toBe(false);
  });

  it('a calm bout given up snatches after all', () => {
    const w = strayRun();
    const id = bump(w);
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'strayCalm', id }, events);
    applyCommand(w, { kind: 'battleForfeit' }, events);
    expect(events).toContainEqual({ kind: 'strayCalmed', ok: false, shells: 0 });
    expect(w.inventory.shells).toBe(55 - DUNGEON.straySnatch);
  });
});
