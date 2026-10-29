import { describe, expect, it } from 'vitest';
import { NEEDS } from '../../src/config/tuning';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { createWorld, dropFruit, withRng } from '../../src/sim/world';

// R0300 (FUN-11): shaking a tree over a Nubbin drops the fruit on its head.

function under(hungry: boolean) {
  const w = createWorld(4, 0);
  const n = w.nubbins[0]!;
  hatch(n, [], 0);
  w.nubbins = [n];
  const tree = w.trees[0]!;
  n.pos = { x: tree.pos.x + 1, z: tree.pos.z };
  n.needs.hunger = hungry ? NEEDS.hungryThreshold / 2 : 1;
  return { w, n, tree };
}

describe('fruit on heads', () => {
  it('three shakes over a full Nubbin: one bonk and a look of outrage', () => {
    const { w, n, tree } = under(false);
    const ev: SimEvent[] = [];
    for (let i = 0; i < 3; i++) {
      withRng(w, (rng) => dropFruit(w, tree, rng, ev));
      w.timeMs += 2000;
    }
    expect(ev.filter((e) => e.kind === 'bonked')).toEqual([
      { kind: 'bonked', nubbinId: n.id, by: 'fruit' },
    ]);
    expect(ev.some((e) => e.kind === 'reaction' && e.reaction === 'surprised')).toBe(true);
  });

  it('a hungry Nubbin eats it on the spot', () => {
    const { w, n, tree } = under(true);
    const ev: SimEvent[] = [];
    const fruit = withRng(w, (rng) => dropFruit(w, tree, rng, ev));
    expect(n.behavior.state).toBe('findFood');
    expect(n.behavior.itemId).toBe(fruit.id);
    expect(Math.hypot(fruit.pos.x - n.pos.x, fruit.pos.z - n.pos.z)).toBeLessThan(0.5);
  });
});
