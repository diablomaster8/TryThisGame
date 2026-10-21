import { describe, expect, it } from 'vitest';
import {
  bandOf,
  childHint,
  nudgeAlignment,
  roundAlignment,
  winningType,
} from '../../src/sim/alignment';
import { eternalBandFor, evolve } from '../../src/sim/lifecycle';
import type { Nubbin, NubbinType, SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

// Alignment moves in steps of 0.01, so float drift must never push a Nubbin over a
// threshold it only reached (review 2026-10-18 B, Bugs 5 and 6).
function child(seed = 4): Nubbin {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  n.stage = 'child';
  n.alignment = 0;
  return n;
}

function acts(n: Nubbin, keeper: 'sun' | 'moon', count: number): void {
  for (let i = 0; i < count; i++) nudgeAlignment(n, keeper);
}

const lean = (scores: Partial<Record<NubbinType, number>>): Record<NubbinType, number> => ({
  normal: 0,
  swim: 0,
  fly: 0,
  run: 0,
  power: 0,
  ...scores,
});

describe('alignment thresholds at exactly ±0.50 and ±0.80', () => {
  it('50 kind acts are exactly 0.50: still Neutral; 51 reach Sun', () => {
    const n = child();
    acts(n, 'sun', 50);
    expect(n.alignment).toBe(0.5);
    expect(bandOf(n.alignment)).toBe('neutral');
    acts(n, 'sun', 1);
    expect(bandOf(n.alignment)).toBe('sun');
  });

  it('50 Moon acts are exactly -0.50: still Neutral; 51 reach Moon', () => {
    const n = child();
    acts(n, 'moon', 50);
    expect(n.alignment).toBe(-0.5);
    expect(bandOf(n.alignment)).toBe('neutral');
    acts(n, 'moon', 1);
    expect(bandOf(n.alignment)).toBe('moon');
  });

  it('exactly ±0.80 is not Eternal; ±0.81 is', () => {
    for (const keeper of ['sun', 'moon'] as const) {
      const n = child();
      n.rebirths = 2;
      acts(n, keeper, 80);
      expect(Math.abs(n.alignment)).toBe(0.8);
      expect(eternalBandFor(n, 'normal')).toBeNull();
      acts(n, keeper, 1);
      expect(eternalBandFor(n, 'normal')).toBe(keeper);
    }
  });

  it('a drifted value from an older save reads as its hundredth', () => {
    expect(bandOf(0.5000000000000002)).toBe('neutral');
    const n = child();
    n.rebirths = 2;
    n.alignment = 0.8000000000000005;
    expect(eternalBandFor(n, 'normal')).toBeNull();
    n.alignment = 0.10000000000000003;
    expect(eternalBandFor(n, 'normal')).toBe('neutral');
    expect(childHint(0.15 - 1e-12)).toBe('sun');
  });

  it('a Nubbin reborn twice, Normal, raised to exactly 0.80 by kind acts evolves without Eternal', () => {
    const n = child();
    n.rebirths = 2;
    n.typeLean = lean({ normal: 50 });
    acts(n, 'sun', 80);
    const events: SimEvent[] = [];
    evolve(n, events);
    expect(n.form?.band).toBe('sun');
    expect(n.form?.type).toBe('normal');
    expect(n.eternal).toBeFalsy();
    expect(events.some((e) => e.kind === 'eternal')).toBe(false);
  });
});

describe('Normal type lean counts in the winning type', () => {
  it('a strong Normal lean beats a small Swim lean', () => {
    expect(winningType(lean({ normal: 300, swim: 30 }))).toBe('normal');
  });

  it('Normal as the runner-up can still block a narrow lead', () => {
    expect(winningType(lean({ swim: 110, normal: 100 }))).toBe('normal');
    expect(winningType(lean({ swim: 200, normal: 100 }))).toBe('swim');
  });
});

describe('roundAlignment is symmetric about zero (review 2026-10-21, Bug 39)', () => {
  it('rounds halves away from zero on both sides', () => {
    expect(roundAlignment(0.105)).toBe(-roundAlignment(-0.105));
    expect(roundAlignment(0.125)).toBe(0.13);
    expect(roundAlignment(-0.125)).toBe(-0.13);
    expect(Object.is(roundAlignment(-0.001), 0)).toBe(true);
  });

  it('±0.105 give the same Eternal answer, and so do ±0.805 and ±0.095', () => {
    const n = child();
    n.rebirths = 2;
    for (const v of [0.105, 0.805, 0.095, 0.1, 0.81]) {
      n.alignment = v;
      const up = eternalBandFor(n, 'normal');
      n.alignment = -v;
      const down = eternalBandFor(n, 'normal');
      const flip = (b: typeof up): typeof up => (b === 'sun' ? 'moon' : b === 'moon' ? 'sun' : b);
      expect(down).toBe(flip(up));
    }
    n.alignment = -0.105;
    expect(eternalBandFor(n, 'normal')).toBeNull();
    n.alignment = 0.105;
    expect(eternalBandFor(n, 'normal')).toBeNull();
  });
});
