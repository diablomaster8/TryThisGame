import { describe, expect, it } from 'vitest';
import { shakeHintEgg } from '../../src/ui/shake-hint';
import type { World } from '../../src/sim/types';

/** TECH-62: the ghost hand shows over a selected egg until it is first shaken. */
describe('shake hint', () => {
  const egg = (o: Record<string, unknown> = {}) =>
    ({ id: 'a', behavior: { state: 'idle' }, stage: 'egg', hatchRemainingMs: 1000, ...o }) as never;
  const w = (n: never, selected: string | null = 'a', carrying: string | null = null) =>
    ({ nubbins: [n], selected, keeper: { carrying } }) as unknown as World;

  it('shows for a selected, unready, unshaken egg on the ground', () => {
    expect(shakeHintEgg(w(egg()))).not.toBeNull();
  });

  it('hides when not selected, carried, held, ready, shaken or hatched', () => {
    expect(shakeHintEgg(w(egg(), null))).toBeNull();
    expect(shakeHintEgg(w(egg(), 'a', 'a'))).toBeNull();
    expect(shakeHintEgg(w(egg({ behavior: { state: 'held' } })))).toBeNull();
    expect(shakeHintEgg(w(egg({ hatchRemainingMs: 0 })))).toBeNull();
    expect(shakeHintEgg(w(egg({ eggShakes: 1 })))).toBeNull();
    expect(shakeHintEgg(w(egg({ stage: 'child' })))).toBeNull();
  });
});
