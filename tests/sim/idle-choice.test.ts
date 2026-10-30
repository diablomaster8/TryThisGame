import { describe, expect, it } from 'vitest';
import { IDLE_ACTIONS } from '../../src/config/tuning';
import { idleOdds, type IdleContext } from '../../src/sim/idle-choice';
import { idleMultipliers } from '../../src/sim/personality';

// R0524 (SOUL-05): the everyday idle pick is one weighted table.
const open: IdleContext = {
  keeperNear: true,
  wary: false,
  toy: true,
  shroom: true,
  canSwim: true,
  mult: idleMultipliers(null),
};

describe('R0524 idle choice table', () => {
  it('with everything open, keeps the old cascade shares', () => {
    const o = idleOdds(open);
    expect(o.greet).toBeCloseTo(0.35, 2);
    expect(o.play).toBeCloseTo(0.195, 2);
    expect(o.swim).toBeCloseTo(0.058, 2);
    expect(Object.values(o).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
  });

  it('doubling one row in the table moves that action as expected', () => {
    const base = idleOdds(open);
    const table = {
      ...IDLE_ACTIONS,
      sit: { ...IDLE_ACTIONS.sit, base: IDLE_ACTIONS.sit.base * 2 },
    };
    const more = idleOdds(open, table);
    const s = base.sit!;
    // Its weight doubles; the others are renormalised round it.
    expect(more.sit).toBeCloseTo((2 * s) / (1 + s), 6);
    expect(more.greet! / more.play!).toBeCloseTo(base.greet! / base.play!, 6);
  });

  it('personality moves the shares: lazy sits more, cheerful greets more', () => {
    const lazy = idleOdds({ ...open, mult: idleMultipliers('lazy') });
    const cheerful = idleOdds({ ...open, mult: idleMultipliers('cheerful') });
    expect(lazy.sit!).toBeGreaterThan(cheerful.sit!);
    expect(cheerful.greet!).toBeGreaterThan(lazy.greet!);
  });

  it('a wary Nubbin and an absent Keeper leave greet out; no toy, no play', () => {
    expect(idleOdds({ ...open, wary: true }).greet).toBeUndefined();
    expect(idleOdds({ ...open, keeperNear: false }).greet).toBeUndefined();
    expect(idleOdds({ ...open, toy: false }).play).toBeUndefined();
  });
});
