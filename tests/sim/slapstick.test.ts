import { describe, expect, it } from 'vitest';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { startToddle } from '../../src/sim/slapstick';
import { createWorld, stepWorld } from '../../src/sim/world';

// R0299 (FUN-10): distracted walks bonk into trunks now and then, with no harm done.

describe('walking bonks', () => {
  it('a 10-minute soak with two Nubbins has at least two natural bonks, no stat change', () => {
    const w = createWorld(11, 0);
    for (const n of w.nubbins) hatch(n, [], 0);
    // Keep them fed and rested so the soak is all wandering.
    const ev: SimEvent[] = [];
    let happyDrop = 0;
    for (let t = 0; t < 10 * 60 * 10; t++) {
      for (const n of w.nubbins) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
      }
      const before = w.nubbins.map((n) => n.needs.happiness);
      const out = stepWorld(w, 100);
      for (const e of out) {
        ev.push(e);
        if (e.kind === 'bonked') {
          const i = w.nubbins.findIndex((n) => n.id === e.nubbinId);
          happyDrop += Math.max(0, before[i]! - w.nubbins[i]!.needs.happiness);
        }
      }
    }
    const bonks = ev.filter((e) => e.kind === 'bonked' && e.by === 'obstacle');
    expect(bonks.length).toBeGreaterThanOrEqual(2);
    expect(happyDrop).toBeLessThan(0.5);
  });

  it('goal met: the newest Nubbin toddles off and plops down within 10 s (R0305)', () => {
    const w = createWorld(5, 0);
    for (const n of w.nubbins) hatch(n, [], 0);
    expect(startToddle(w, w.timeMs)).toBe(true);
    const newest = [...w.nubbins].sort((a, b) => a.ageMs - b.ageMs)[0]!;
    let plop = false;
    for (let t = 0; t < 100 && !plop; t++)
      plop = stepWorld(w, 100).some(
        (e) => e.kind === 'reaction' && e.nubbinId === newest.id && e.reaction === 'dizzy',
      );
    expect(plop).toBe(true);
  });
});

// R0365 (FUN-76): the Slapstick setting off stops the distracted bonks in the sim.
describe('the Slapstick setting', () => {
  it('off: a 10-minute soak has no distracted bonks', () => {
    const w = createWorld(11, 0);
    w.settings.slapstick = 'off';
    for (const n of w.nubbins) hatch(n, [], 0);
    let bonks = 0;
    for (let t = 0; t < 10 * 60 * 10; t++) {
      for (const n of w.nubbins) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
      }
      for (const e of stepWorld(w, 100)) if (e.kind === 'bonked' && e.by === 'obstacle') bonks++;
    }
    expect(bonks).toBe(0);
  });
});
