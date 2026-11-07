import { describe, expect, it } from 'vitest';
import { seasonSpots } from '../../src/sim/region-season-props';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

// R0118: jumping onto an autumn leaf pile in the Wood gives one rustle per minute.
describe('leaf pile jump-in (R0118)', () => {
  it('fires once, then waits out its cooldown', () => {
    const w = createWorld(3, 0);
    w.nubbins = [];
    applyCommand(w, { kind: 'travel', exit: 'grove-wood' }, []);
    w.debugSeason = 'autumn';
    const pile = seasonSpots('wood', 'autumn').find((s) => s.kind === 'leafpile')!;
    const ev: SimEvent[] = [];
    for (let i = 0; i < 3; i++) {
      w.keeper.pos = { x: pile.x, z: pile.z };
      w.keeper.y = 1;
      ev.push(...stepWorld(w, 100));
    }
    expect(ev.filter((e) => e.kind === 'regionGag' && e.id === 'leaf-jump')).toHaveLength(1);
  });
});
