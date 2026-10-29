import { describe, expect, it } from 'vitest';
import { suggest } from '../../src/sim/battle/tactics/ai';
import { activeUnit, mapOf } from '../../src/sim/battle/tactics/engine';
import { tileAt } from '../../src/sim/battle/tactics/map';
import { TILE } from '../../src/sim/battle/tactics/types';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** The rumble room slice (recs FIGHT-65): a 3v3 grid bout kept in world.tactics. */
function party(n: number, points = 2500): World {
  const w = createWorld(5, 0);
  const events: SimEvent[] = [];
  const base = w.nubbins[0]!;
  while (w.nubbins.length < n)
    w.nubbins.push({ ...structuredClone(base), id: `nub-r${w.nubbins.length}` });
  w.nubbins.length = n;
  for (const nb of w.nubbins) {
    hatch(nb, events, 0);
    for (const k of STAT_KEYS) nb.stats[k].points = points;
  }
  return w;
}

/** Plays the Keeper's side with the suggested moves until the bout ends. */
function playOut(w: World, events: SimEvent[], cap = 400): void {
  for (let i = 0; i < cap && w.tactics && !w.tactics.result; i++) {
    const s = w.tactics;
    const u = activeUnit(s)!;
    for (const a of suggest(s)) applyCommand(w, { kind: 'tacticsAct', action: a }, events);
    if (w.tactics?.active === u.c.id)
      applyCommand(w, { kind: 'tacticsAct', action: { k: 'wait', face: u.face } }, events);
  }
}

describe('rumble room slice (R0257)', () => {
  it('starts a 10×10, 3v3 calmBoss bout with three terrains', () => {
    const w = party(3);
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'tacticsStart', depth: 2 }, events);
    const s = w.tactics!;
    expect(s).toBeDefined();
    const m = mapOf(s);
    expect(m.w).toBe(10);
    // Three Nubbins and the Keeper's piece (R0266), which never counts as a fighter.
    expect(s.units.filter((u) => u.c.side === 0 && !u.keeper)).toHaveLength(3);
    expect(s.units.filter((u) => u.keeper)).toHaveLength(1);
    expect(s.units.filter((u) => u.c.side === 1)).toHaveLength(3);
    expect(s.objective).toEqual({ kind: 'calmBoss', target: 'foe-0' });
    const kinds = new Set<number>();
    for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) kinds.add(tileAt(m, x, y));
    for (const k of kinds) expect([TILE.grass, TILE.wall, TILE.shallow, TILE.crystal]).toContain(k);
    expect(s.aura).toBeNull();
    expect(events.some((e) => e.kind === 'tacticsStart')).toBe(true);
  });

  it('two Nubbins bring the Keeper aura', () => {
    const w = party(2);
    applyCommand(w, { kind: 'tacticsStart' }, []);
    expect(w.tactics!.aura).toBe(w.keeper.alignment);
  });

  it('plays to the end, survives a save mid-bout and pays once', () => {
    const w = party(3);
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'tacticsStart', depth: 2 }, events);
    // A few turns in, save and load: the bout carries on exactly.
    playOut(w, events, 4);
    const back = deserialize(serialize(w, 0)).world;
    expect(JSON.stringify(back.tactics)).toBe(JSON.stringify(w.tactics));
    const shells0 = back.inventory.shells;
    playOut(back, events, 400);
    const s = back.tactics!;
    expect(s.result).not.toBeNull();
    const end = events.filter((e) => e.kind === 'tacticsEnd');
    expect(end).toHaveLength(1);
    if (s.result!.winner === 0) expect(back.inventory.shells).toBeGreaterThan(shells0);
    applyCommand(back, { kind: 'tacticsAct', action: { k: 'wait', face: 'n' } }, events);
    expect(events.filter((e) => e.kind === 'tacticsEnd')).toHaveLength(1);
    applyCommand(back, { kind: 'tacticsClose' }, events);
    expect(back.tactics).toBeUndefined();
  });

  it('a forfeit ends it without a prize', () => {
    const w = party(3);
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'tacticsStart' }, events);
    const shells = w.inventory.shells;
    applyCommand(w, { kind: 'tacticsForfeit' }, events);
    expect(w.tactics!.result?.reason).toBe('forfeit');
    expect(w.inventory.shells).toBe(shells);
  });
});
