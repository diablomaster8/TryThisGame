import { describe, expect, it } from 'vitest';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { SimEvent } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

// R0330 (FUN-41): copycats, tugs over fruit and bumps in a 10-minute soak with 4 Nubbins.

describe('Nubbins playing together', () => {
  it('a 10-minute soak with four Nubbins shows each pair-state', () => {
    // Three seeds' soaks together show all three: any one seed's day moves whenever the idle
    // table does (R0524, R0528, and R0582's swim share in lane A r11).
    const seen = new Set<string>();
    for (const seed of [12, 13, 14]) {
      const w = createWorld(seed, 0);
      while (w.nubbins.length < 4)
        w.nubbins.push(
          createEgg(
            `n${w.nubbins.length}`,
            { x: w.nubbins.length, z: 2 },
            Rng.fromSeed(w.nubbins.length),
          ),
        );
      for (const n of w.nubbins) hatch(n, [], 0);
      for (let t = 0; t < 10 * 60 * 10; t++) {
        for (const n of w.nubbins) n.needs.energy = 1;
        for (const e of stepWorld(w, 100) as SimEvent[])
          if (e.kind === 'pairPlay') seen.add(e.play);
      }
    }
    expect([...seen].sort()).toEqual(['bump', 'copy', 'tug']);
  });
});
