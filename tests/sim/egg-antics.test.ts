import { describe, expect, it } from 'vitest';
import { applyCommand, createWorld } from '../../src/sim/world';
import { eggAntics } from '../../src/render/egg-antics';
import { EGG, EGG_ANTICS } from '../../src/config/tuning';
import type { SimEvent } from '../../src/sim/types';

// R0351 (FUN-62): the waiting egg's antics, read the same way by both renderers.
describe('R0351 egg antics', () => {
  it('the third shake pokes a foot out, and it goes back in', () => {
    const w = createWorld(5, 0);
    const egg = w.nubbins.find((n) => n.stage === 'egg')!;
    w.keeper.carrying = egg.id;
    const feet: boolean[] = [];
    for (let i = 0; i < 3; i++) {
      w.timeMs += EGG.shakeCooldownMs + 10;
      const events: SimEvent[] = [];
      applyCommand(w, { kind: 'shakeHeld' }, events);
      const e = events.find((x) => x.kind === 'eggShaken');
      expect(e).toBeTruthy();
      feet.push(e?.kind === 'eggShaken' && e.foot === true);
    }
    expect(feet).toEqual([false, false, true]);
    expect(eggAntics(egg, w.timeMs + 100, 0, 0).foot).toBe(true);
    expect(eggAntics(egg, w.timeMs + EGG_ANTICS.footMs + 1, 0, 0).foot).toBe(false);
  });

  it('wobbles on its own every 20 s and hops only in its last 30 s', () => {
    const egg = {
      stage: 'egg' as const,
      eggShakes: 0,
      lastShakeMs: -1e9,
      hatchRemainingMs: 90_000,
    };
    expect(eggAntics(egg, 0, 100, 0).wobble).not.toBe(0);
    expect(eggAntics(egg, 0, 5_000, 0).wobble).toBe(0);
    expect(eggAntics(egg, 0, 20_100, 0).wobble).not.toBe(0);
    expect(eggAntics(egg, 0, 100, 0).hop).toBe(0);
    expect(eggAntics({ ...egg, hatchRemainingMs: 20_000 }, 0, 130, 0).hop).toBeGreaterThan(0);
    // Reduced motion keeps the foot but drops the wobble and hop.
    expect(eggAntics({ ...egg, hatchRemainingMs: 20_000 }, 0, 130, 0, true)).toEqual({
      foot: false,
      wobble: 0,
      hop: 0,
    });
  });
});
