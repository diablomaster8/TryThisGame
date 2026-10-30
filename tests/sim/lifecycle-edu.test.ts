import { describe, expect, it } from 'vitest';
import { runEndOfLife } from '../../src/sim/lifecycle';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { World } from '../../src/sim/types';

/** R0691 (KIDS-23): every end of life is a rebirth in a sprout save. */
function unhappyAdult(world: World) {
  const n = world.nubbins[0]!;
  n.stage = 'adult';
  n.happinessSum = -50 * 100;
  n.happinessSamples = 100;
  n.needs.affection = 5;
  return n;
}

describe('Learning Grove end of life (R0691)', () => {
  it('a sprout save with average happiness −50 is reborn; a main save departs', () => {
    const kid = createWorld(1, 0);
    applyCommand(kid, { kind: 'eduStart', age: 4 }, []);
    const a = unhappyAdult(kid);
    runEndOfLife(a, kid, false, []);
    expect(a.cocoonKind).toBe('rebirth');

    const main = createWorld(1, 0);
    const b = unhappyAdult(main);
    runEndOfLife(b, main, false, []);
    expect(b.cocoonKind).toBe('depart');
  });

  it('a reader save departs unless the grown-up switched it on', () => {
    const w = createWorld(2, 0);
    applyCommand(w, { kind: 'eduStart', age: 6, band: 'reader' }, []);
    const a = unhappyAdult(w);
    runEndOfLife(a, w, false, []);
    expect(a.cocoonKind).toBe('depart');
    const w2 = createWorld(2, 0);
    applyCommand(w2, { kind: 'eduStart', age: 6, band: 'reader' }, []);
    applyCommand(w2, { kind: 'eduSetAlwaysReborn', on: true }, []);
    const b = unhappyAdult(w2);
    runEndOfLife(b, w2, false, []);
    expect(b.cocoonKind).toBe('rebirth');
  });
});
