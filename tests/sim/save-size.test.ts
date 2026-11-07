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

describe('save size, long saves (R0497)', () => {
  it('100 placed decor items stay under 96 kB', () => {
    const w = createWorld(1, 0);
    const kinds = ['nursery', 'bench', 'flowerbed', 'fence'] as const;
    for (let i = 0; i < 100; i++)
      w.placed.push({
        id: `bot-${i}`,
        kind: kinds[i % kinds.length]!,
        pos: { x: -30 + (i % 20) * 3, z: -30 + Math.floor(i / 20) * 3 },
      });
    const kb = serialize(w, 0).length / 1024;
    console.info(`save size: 100 decor ${kb.toFixed(1)} kB`);
    expect(kb).toBeLessThanOrEqual(96);
  });
});
