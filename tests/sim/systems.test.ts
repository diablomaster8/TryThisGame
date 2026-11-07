import { describe, expect, it } from 'vitest';
import { orderSystems, runSystems, type SimSystem } from '../../src/sim/systems';
import { SYSTEMS, createWorld } from '../../src/sim/world';

/** TECH-34: the step's system registry. */
const ALWAYS = { live: true, offline: true, coarse: true };
const sys = (id: string, order: number, rng: boolean): SimSystem =>
  rng
    ? { id, order, runs: ALWAYS, rng: true, step: () => undefined }
    : { id, order, runs: ALWAYS, rng: false, step: () => undefined };

describe('step systems', () => {
  it('keeps the order the hand-written step had', () => {
    expect(SYSTEMS.map((s) => s.id).slice(0, 6)).toEqual([
      'trees',
      'items',
      'nubbins',
      'keeper',
      'prop-reach',
      'hop-lesson',
    ]);
    expect(SYSTEMS.at(-1)!.id).toBe('old-soul-calm');
    expect(SYSTEMS.length).toBe(52);
  });

  it('every system declares live, offline and coarse behaviour', () => {
    for (const s of SYSTEMS) {
      expect(typeof s.runs.live, s.id).toBe('boolean');
      expect(typeof s.runs.offline, s.id).toBe('boolean');
      expect(typeof s.runs.coarse, s.id).toBe('boolean');
    }
  });

  it('the Keeper and battle-move systems are live play only', () => {
    const live = SYSTEMS.filter((s) => !s.runs.offline).map((s) => s.id);
    expect(live).toEqual([
      'keeper',
      'prop-reach',
      'hop-lesson',
      'hop-course',
      'keeper-idle',
      'soul-fav-spots',
      'battle-moves',
    ]);
  });

  it('refuses a duplicate id or order, and an rng system after a plain one', () => {
    expect(() => orderSystems([sys('a', 1, true), sys('a', 2, true)])).toThrow(/Duplicate system/);
    expect(() => orderSystems([sys('a', 1, true), sys('b', 1, true)])).toThrow(/Duplicate order/);
    expect(() => orderSystems([sys('a', 1, false), sys('b', 2, true)])).toThrow(/rng/);
  });

  it('everyMs runs a system once per interval with the dt it waited', () => {
    const seen: number[] = [];
    const slow: SimSystem = {
      id: 'slow',
      order: 1,
      runs: ALWAYS,
      rng: false,
      everyMs: 1000,
      step: (c) => seen.push(c.dtMs),
    };
    const w = createWorld(1, 0);
    const ctx = { world: w, dtMs: 100, wallMs: 0, offline: false, countPlay: true, events: [] };
    for (let i = 0; i < 25; i++) runSystems([slow], ctx, (_w, fn) => fn(null as never));
    expect(seen).toEqual([100, 1000, 1000]);
  });
});
