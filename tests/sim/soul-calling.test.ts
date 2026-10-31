import { describe, expect, it } from 'vitest';
import { hatch } from '../../src/sim/lifecycle';
import { callingFor } from '../../src/sim/calling';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

// R0559 (SOUL-42): a neglected child asks for attention before every lonely slip.

describe('R0559 calling for attention', () => {
  it('asks before every lonely slip, and walks over to the Keeper', () => {
    for (const seed of [1, 2, 3]) {
      const w = createWorld(seed, 0);
      const n = w.nubbins[0]!;
      w.nubbins = [n];
      hatch(n, [], 0);
      n.ageMs = 700_000;
      w.keeper.pos = { x: n.pos.x + 6, z: n.pos.z + 2 };
      let asked = false;
      let closest = Infinity;
      let slips = 0;
      for (let t = 0; t < 25 * 600; t++) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
        n.needs.affection = 5;
        for (const e of stepWorld(w, 100) as SimEvent[]) {
          if (e.kind !== 'slip' || e.slip !== 'lonely') continue;
          expect(asked, `seed ${seed}, slip ${slips}`).toBe(true);
          asked = false;
          slips++;
        }
        const id = n.behavior.itemId;
        if (id === 'callKeeper' || id === 'tug') asked = true;
        closest = Math.min(closest, Math.hypot(n.pos.x - w.keeper.pos.x, n.pos.z - w.keeper.pos.z));
      }
      expect(slips).toBeGreaterThanOrEqual(2);
      expect(closest).toBeLessThan(2.5);
    }
  }, 60_000);

  it('a cared-for child makes no call; answering ends it', () => {
    const w = createWorld(4, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    n.ageMs = 700_000;
    n.slipTimers = { lonely: 70_000 };
    expect(callingFor(n)).toBe('lonely');
    n.needs.affection = 40;
    stepWorld(w, 100);
    expect(callingFor(n)).toBeNull();
    n.slipTimers = { hungry: 10_000 };
    expect(callingFor(n)).toBeNull();
    n.slipTimers = { sleepy: 61_000 };
    expect(callingFor(n)).toBe('sleepy');
  });
});
