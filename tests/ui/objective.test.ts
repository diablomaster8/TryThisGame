import { describe, expect, it } from 'vitest';
import { groveSuggestion } from '../../src/ui/objective';
import { createWorld } from '../../src/sim/world';

describe('objective chip Grove suggestions (r1025 item 3)', () => {
  it('suggests hatching while every Nubbin is still an egg', () => {
    const w = createWorld(1, 0);
    expect(w.nubbins.length).toBeGreaterThan(0);
    expect(w.nubbins.every((n) => n.stage === 'egg')).toBe(true);
    expect(groveSuggestion(w)?.key).toBe('grove:hatch');
  });

  it('points at the Shop when the Grove has no Nubbin and no egg', () => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    const o = groveSuggestion(w);
    expect(o?.key).toBe('grove:none');
    expect(o?.action).toBe('shop');
  });

  it('suggests feeding a hungry hatchling, and nothing once all are fed', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    w.nubbins = [{ ...n, stage: 'child', needs: { ...n.needs, hunger: 0.05 } }];
    expect(groveSuggestion(w)?.key).toBe('grove:hungry');
    w.nubbins[0]!.needs.hunger = 1;
    expect(groveSuggestion(w)).toBeNull();
  });
});
