import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { cellCentre, enterDungeon, runFloor } from '../../src/sim/dungeon';
import { guardianKey, guardianOpen, guardianEnded } from '../../src/sim/dungeon-guardian';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 11 (R0260, FIGHT-72): the Hollow's depth-5 guardian hall starts lane C's
// calmBoss bout when the Keeper walks in.

function runAt(depth: number, seed = 5): World {
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

function hall(w: World) {
  const f = runFloor(w)!;
  return cellCentre(f, f.stairsDown!);
}

describe('floor-5 guardian (R0260)', () => {
  it('starts a calmBoss tactics bout on the guardian source when the Keeper walks into the hall', () => {
    const w = runAt(5);
    const f = runFloor(w)!;
    expect(guardianOpen(w.dungeon!, f)).toBe(true);
    w.keeper.pos = hall(w);
    const out = stepWorld(w, SIM.stepMs);
    expect(w.tactics?.objective.kind).toBe('calmBoss');
    expect(w.tactics?.context).toMatchObject({ source: 'guardian', key: guardianKey(w.dungeon!) });
    expect(out.some((e) => e.kind === 'guardianHall' && e.phase === 'start')).toBe(true);
  });

  it('does not start on other depths or outside the hall', () => {
    const w4 = runAt(4);
    w4.keeper.pos = hall(w4);
    stepWorld(w4, SIM.stepMs);
    expect(w4.tactics).toBeFalsy();
    const w = runAt(5);
    stepWorld(w, SIM.stepMs);
    expect(w.tactics).toBeFalsy();
  });

  it('waits for a step out after a loss, and a win books the hall once', () => {
    const w = runAt(5);
    const run = w.dungeon!;
    w.keeper.pos = hall(w);
    stepWorld(w, SIM.stepMs);
    expect(w.tactics).toBeTruthy();
    const key = guardianKey(run);
    const lost: SimEvent[] = [];
    guardianEnded(
      w,
      [
        {
          kind: 'tacticsEnd',
          source: 'guardian',
          key,
          winner: 1,
          reason: 'objective',
          shells: 0,
          essence: null,
        } as SimEvent,
      ],
      lost,
    );
    expect(lost[0]).toMatchObject({ kind: 'guardianHall', phase: 'lost' });
    expect(run.guardian?.wait).toBe(key);
    expect(run.guardian?.done).toEqual([]);
    const won: SimEvent[] = [];
    const end = {
      kind: 'tacticsEnd',
      source: 'guardian',
      key,
      winner: 0,
      reason: 'objective',
      shells: 0,
      essence: null,
    } as SimEvent;
    guardianEnded(w, [end], won);
    guardianEnded(w, [end], won);
    expect(run.guardian?.done).toEqual([key]);
    expect(guardianOpen(run, runFloor(w)!)).toBe(false);
  });

  it('the guardianStart command starts the same bout only at depth 5', () => {
    const w = runAt(5);
    const ids = w.nubbins.map((n) => n.id);
    applyCommand(w, { kind: 'guardianStart', depth: 4, key: 'k', ids }, []);
    expect(w.tactics).toBeFalsy();
    applyCommand(w, { kind: 'guardianStart', depth: 5, key: 'k', ids }, []);
    expect(w.tactics?.objective.kind).toBe('calmBoss');
  });
});
