import { describe, expect, it } from 'vitest';
import { buildScenario, SCENARIOS } from '../../src/dev/scenarios';
import { deserialize, serialize } from '../../src/sim/save';
import type { World } from '../../src/sim/types';
import { stepWorld } from '../../src/sim/world';

/** TECH-46: the dev scenarios build what their names promise, and as a loadable save. */

const WALL = Date.UTC(2026, 9, 31, 9);
const run = (w: World, ms: number) => {
  for (let t = 0; t < ms; t += 100) stepWorld(w, 100, WALL + t);
};

describe('dev scenarios (TECH-46)', () => {
  it.each(SCENARIOS)('%s builds a world that saves and loads', (name) => {
    const w = buildScenario(name, 3, WALL)!;
    expect(w).toBeTruthy();
    expect(() => deserialize(serialize(w, WALL))).not.toThrow();
  });

  it('knows nothing it was not given', () => {
    expect(buildScenario('no-such-thing', 1, WALL)).toBe(null);
  });

  it('eight-nubbins is eight adults', () => {
    const w = buildScenario('eight-nubbins', 4, WALL)!;
    expect(w.nubbins.map((n) => n.stage)).toEqual(Array(8).fill('adult'));
  });

  it.each([
    ['sun', 'fly'],
    ['moon', 'power'],
    ['neutral', 'normal'],
  ] as const)('child-about-to-evolve:%s:%s evolves into that form', (band, type) => {
    const w = buildScenario(`child-about-to-evolve:${band}:${type}`, 5, WALL)!;
    run(w, 45_000);
    const n = w.nubbins[0]!;
    expect(n.stage).toBe('adult');
    expect(n.form?.band).toBe(band);
    expect(n.form?.type).toBe(type);
  });

  it('eternal-ready becomes an Eternal on evolving', () => {
    const w = buildScenario('eternal-ready', 6, WALL)!;
    run(w, 45_000);
    expect(w.nubbins[0]!.eternal).toBeTruthy();
  });

  it('end-of-life-away waits for the Keeper', () => {
    const w = buildScenario('end-of-life-away', 7, WALL)!;
    expect(w.nubbins[0]!.awaitingKeeper).toBe(true);
  });
});
