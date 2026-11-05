import { describe, expect, it } from 'vitest';
import { soulLookKind } from '../../src/render/soul-looks';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { addTrust } from '../../src/sim/trust';
import { stepShadowSoul } from '../../src/sim/shadow-soul';
import { createWorld, dropFruit, stepWorld, withRng } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

// R0566 (SOUL-49), lane A r11: a wary Shadow shows its own quirks, and the bond hugs.
function shadowWorld(seed: number) {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  evolve(n, [], w);
  n.shadow = true;
  n.bond = false;
  n.trust = 10;
  return { w, n };
}

describe('R0566 Shadow quirks', () => {
  it('a wary Shadow shows at least two distinct quirks in 10 minutes', () => {
    for (const seed of [4, 5]) {
      const { w, n } = shadowWorld(seed);
      const seen = new Set<string>();
      for (let t = 0; t < 10 * 600; t++) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
        n.trust = 10;
        // The Keeper strolls about the meadow; now and then a fruit falls.
        w.keeper.pos = { x: Math.sin(t / 900) * 6, z: Math.cos(t / 700) * 6 };
        if (t % 1200 === 0)
          withRng(w, (rng) => dropFruit(w, w.trees[t % w.trees.length]!, rng, []));
        stepWorld(w, 100);
        const id = n.behavior.itemId ?? '';
        if (id === 'sulk' || id === 'watchFar' || id.startsWith('hoard'))
          seen.add(id.split(':')[0]!);
      }
      expect(seen.size, `seed ${seed}: ${[...seen].join(',')}`).toBeGreaterThanOrEqual(2);
    }
  }, 60_000);

  it('bonding again walks up to the Keeper, hesitates, then hugs', () => {
    const { w, n } = shadowWorld(6);
    n.behavior.state = 'wander';
    w.keeper.pos = { x: n.pos.x + 4, z: n.pos.z };
    const events: SimEvent[] = [];
    addTrust(n, 100, events);
    expect(events.some((e) => e.kind === 'shadowBonded')).toBe(true);
    // The step after the bond (its events) starts the walk-up hug.
    stepShadowSoul(w, events, false);
    expect(n.behavior.itemId).toBe('bondHug');
    expect(n.behavior.target).not.toBeNull();
    let arrived = false;
    for (let t = 0; t < 60 && !arrived; t++) {
      n.needs.hunger = 1;
      stepWorld(w, 100);
      arrived = n.behavior.itemId === 'bondHug' && !n.behavior.target;
    }
    expect(soulLookKind(n)).toBe('bondHug');
    expect(arrived).toBe(true);
  });
});
