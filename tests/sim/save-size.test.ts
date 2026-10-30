import { describe, expect, it } from 'vitest';
import { EGG, SIM } from '../../src/config/tuning';
import { serialize } from '../../src/sim/save';
import { createWorld, stepWorld } from '../../src/sim/world';

/** TECH-56: save size budgets, so a slot stays far inside a browser's ~5 MB. */
describe('save size', () => {
  it('a fresh Grove saves in 12 kB or less', () => {
    const w = createWorld(1, 0);
    expect(serialize(w, 0).length).toBeLessThanOrEqual(12 * 1024);
  });

  it('an hour of play with two hatchlings stays under 64 kB', () => {
    const w = createWorld(1, 0);
    for (let i = 0; i < (EGG.hatchMs + 60 * 60_000) / SIM.stepMs; i += 10)
      stepWorld(w, SIM.stepMs * 10);
    expect(serialize(w, 0).length).toBeLessThanOrEqual(64 * 1024);
  });
});
