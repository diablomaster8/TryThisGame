import { describe, expect, it } from 'vitest';
import { strayGait, tipLift, wobble } from '../../src/render/stray-gait';
import type { DungeonStray } from '../../src/sim/types';

// R0326 (FUN-37): strays tiptoe up to a Keeper with Shells and wobble off loaded.

const stray = (over: Partial<DungeonStray> = {}): DungeonStray => ({
  id: 's',
  pos: { x: 0, z: 0 },
  target: { x: 1, z: 0 },
  cooldownMs: 0,
  ...over,
});

describe('stray gait', () => {
  it('tiptoes near a Keeper with Shells, walks otherwise', () => {
    expect(strayGait(stray(), { x: 2, z: 0 }, 10)).toBe('tiptoe');
    expect(strayGait(stray(), { x: 20, z: 0 }, 10)).toBe('walk');
    expect(strayGait(stray(), { x: 2, z: 0 }, 0)).toBe('walk');
    expect(strayGait(stray({ shooed: true }), { x: 2, z: 0 }, 10)).toBe('walk');
  });

  it('wobbles while it carries Shells, even fleeing', () => {
    expect(strayGait(stray({ carrying: 3, cooldownMs: 900 }), { x: 2, z: 0 }, 10)).toBe('wobble');
  });

  it('holds still under reduced motion', () => {
    expect(tipLift(1234, true)).toBe(0);
    expect(wobble(1234, true)).toBe(0);
    expect(tipLift(80, false)).toBeGreaterThan(0);
  });
});
