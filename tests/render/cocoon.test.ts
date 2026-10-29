import { describe, expect, it } from 'vitest';
import { cocoonPalette } from '../../src/render/sprites/egg';
import { cocoonKey, cocoonPulse } from '../../src/render/sprites/cocoon';
import type { Nubbin } from '../../src/sim/types';

describe('cocoons (LOOK-25)', () => {
  it('tells the three kinds and the three evolving bands apart by colour', () => {
    const bodies = [
      cocoonPalette('rebirth').body,
      cocoonPalette('depart').body,
      cocoonPalette('evolve', 'sun').body,
      cocoonPalette('evolve', 'moon').body,
      cocoonPalette('evolve', 'neutral').body,
    ];
    expect(new Set(bodies).size).toBe(5);
  });

  it('keys an evolving cocoon by band and an adult one by its form', () => {
    const n = {
      species: 'chao',
      cocoonKind: 'evolve',
      alignment: 0.8,
      form: null,
    } as unknown as Nubbin;
    expect(cocoonKey(n)).toBe('cocoon:evolve:sun:child');
    const r = { ...n, cocoonKind: 'rebirth', form: { type: 'fly', second: null } } as Nubbin;
    expect(cocoonKey(r)).toBe('cocoon:rebirth:-:fly:-');
  });

  it('breathes between 1 and 1.03', () => {
    expect(cocoonPulse(0)).toBeCloseTo(1);
    expect(cocoonPulse(625)).toBeCloseTo(1.03);
  });
});
