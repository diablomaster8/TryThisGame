import { describe, expect, it } from 'vitest';
import { quipBeat, startQuip } from '../../src/render/evolve-quip';
import { EVOLVE_QUIPS } from '../../src/config/strings-fun-r7';
import { EVOLVE_QUIP } from '../../src/config/tuning';

// R0354 (FUN-65): the comic beat after the evolution card.
describe('R0354 evolution quips', () => {
  it('every adult type has its own line in every band', () => {
    for (const band of ['main', 'reader', 'sprout'] as const) {
      const lines = Object.values(EVOLVE_QUIPS[band]);
      expect(Object.keys(EVOLVE_QUIPS[band]).sort()).toEqual([
        'fly',
        'normal',
        'power',
        'run',
        'swim',
      ]);
      expect(new Set(lines).size).toBe(5);
    }
    expect(EVOLVE_QUIPS.main.fly).toMatch(/flaps once and surprises itself/);
    expect(EVOLVE_QUIPS.main.power).toMatch(/lifts the bench/);
  });

  it('plays look, a full turn, a wobble and a sit, then ends; reduced motion only sits', () => {
    const Q = EVOLVE_QUIP;
    startQuip('a', 1000);
    expect(quipBeat('a', 1000 + 100, false)?.phase).toBe('look');
    const mid = quipBeat('a', 1000 + Q.lookMs + Q.turnMs / 2, false)!;
    expect(mid.phase).toBe('turn');
    expect(mid.turn).toBeCloseTo(Math.PI, 1);
    expect(quipBeat('a', 1000 + Q.lookMs + Q.turnMs + 10, false)?.phase).toBe('wobble');
    expect(quipBeat('a', 1000 + Q.lookMs + Q.turnMs + Q.wobbleMs + 10, false)?.phase).toBe('sit');
    expect(quipBeat('a', 1000 + 100_000, false)).toBeNull();
    startQuip('b', 0);
    expect(quipBeat('b', 1500, true)).toEqual({ phase: 'sit', turn: 0 });
  });
});
