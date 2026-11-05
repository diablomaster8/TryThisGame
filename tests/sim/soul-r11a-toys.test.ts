import { describe, expect, it } from 'vitest';
import { TOYS } from '../../src/config/tuning';
import { buyToy, placeToy } from '../../src/sim/craft';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { isPairToy, rockTilt, stepToyPairs } from '../../src/sim/toy-pair';
import { favouredToy } from '../../src/sim/toy-soul';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

// R0574 (SOUL-57): seesaw, sandbox, drum and bubble wand.
function twoNubbins(seed: number): World {
  const w = createWorld(seed, 0);
  while (w.nubbins.length < 2) w.nubbins.push(createEgg('n1', { x: 1, z: 2 }, Rng.fromSeed(7)));
  for (const n of w.nubbins) hatch(n, [], 0);
  return w;
}

function put(w: World, toy: 'seesaw' | 'sandbox' | 'drum' | 'bubbleWand'): void {
  w.inventory.shells = 1000;
  const ev: SimEvent[] = [];
  expect(buyToy(w, toy, ev)).toBe(true);
  expect(placeToy(w, toy, { x: 2, z: 2 }, ev)).toBe(true);
}

describe('R0574 new toys', () => {
  it('each is in the shop at its price and can be placed', () => {
    for (const k of ['seesaw', 'sandbox', 'drum', 'bubbleWand'] as const) {
      expect(TOYS.prices[k]).toBeGreaterThan(0);
      put(twoNubbins(1), k);
    }
    expect(isPairToy('seesaw') && isPairToy('sandbox')).toBe(true);
    expect(isPairToy('drum')).toBe(false);
  });

  it('a pair toy draws a Nubbin more when a partner is already on it', () => {
    const w = twoNubbins(3);
    put(w, 'seesaw');
    const [a, b] = w.nubbins as [(typeof w.nubbins)[0], (typeof w.nubbins)[0]];
    const alone = favouredToy(w, a, 0)!.keen;
    b.behavior.state = 'play';
    b.behavior.itemId = w.items[0]!.id;
    b.behavior.target = null;
    expect(favouredToy(w, a, 0)!.keen).toBeGreaterThan(alone * 5);
  });

  it('two players pair up: players = 2, friendship rises, the seesaw rocks', () => {
    const w = twoNubbins(3);
    put(w, 'seesaw');
    const toy = w.items[0]!;
    for (const n of w.nubbins) {
      n.behavior.state = 'play';
      n.behavior.itemId = toy.id;
      n.behavior.target = null;
      n.pos = { x: toy.pos.x, z: toy.pos.z };
    }
    for (let i = 0; i < 100; i++) stepToyPairs(w, 100);
    const [a, b] = w.nubbins;
    expect(toy.players).toBe(2);
    expect(a!.friends?.[b!.id]).toBeGreaterThan(0);
    expect(Math.abs(a!.pos.x - b!.pos.x)).toBeGreaterThan(0.8);
    const tilts = [0, 300, 600, 900].map((t) => rockTilt(toy, t));
    expect(Math.max(...tilts)).toBeGreaterThan(0.5);
    expect(Math.min(...tilts)).toBeLessThan(-0.5);
    // One leaves: it stops rocking.
    b!.behavior.state = 'wander';
    stepToyPairs(w, 100);
    expect(toy.players).toBe(1);
    expect(rockTilt(toy, 300)).toBe(0);
  });

  it('in live play two Nubbins and a seesaw end up playing together', () => {
    let together = 0;
    for (const seed of [4, 5, 6]) {
      const w = twoNubbins(seed);
      put(w, 'seesaw');
      for (let t = 0; t < 20 * 60 * 10; t++) {
        for (const n of w.nubbins) {
          n.needs.energy = 1;
          n.needs.hunger = 1;
        }
        stepWorld(w, 100);
        if (w.items.find((i) => i.kind === 'toy')?.players === 2) together++;
      }
    }
    expect(together).toBeGreaterThan(0);
  }, 60_000);
});
