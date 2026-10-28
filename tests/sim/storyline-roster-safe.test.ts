import { describe, expect, it } from 'vitest';
import { freshCampaignState as freshState } from '../../src/sim/campaign';
import { degenerationTarget } from '../../src/sim/degeneration';
import { counter } from '../../src/sim/storyline-checks';
import { startStoryline } from '../../src/sim/storyline';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { c } from './campaign-driver';
import { storylineWorld } from './storyline-driver';

function grownWorld(): ReturnType<typeof createWorld> {
  const world = createWorld(31, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins)
    applyCommand(world, { kind: 'debugHatchNow', nubbinId: n.id }, events);
  for (const n of world.nubbins) {
    n.stage = 'adult';
    n.ageMs = 1e7;
  }
  return world;
}

describe('separate lines add to the roster, never replace it', () => {
  for (const id of ['hundred', 'logged', 'dawn', 'dusk']) {
    it(`${id} keeps every existing Nubbin`, () => {
      const world = grownWorld();
      const before = world.nubbins.map((n) => n.id);
      expect(before.length).toBeGreaterThan(0);
      const events: SimEvent[] = [];
      applyCommand(world, { kind: 'storylineStart', id }, events);
      const after = world.nubbins.map((n) => n.id);
      for (const b of before) expect(after).toContain(b);
      if (id === 'hundred') expect(after.length).toBe(before.length + 1);
      if (id === 'logged') expect(after.length).toBe(before.length + 3);
      const cast = String(c(world).flags.cast ?? '');
      if (id === 'hundred' || id === 'logged')
        for (const x of cast.split(',')) expect(after).toContain(x);
    });
  }

  it('Dawn and Dusk never revert a Nubbin that was already grown when the line began', () => {
    const world = grownWorld();
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'storylineStart', id: 'dawn' }, events);
    const grown = world.nubbins.map((n) => n.id);
    expect(String(c(world).flags['dd-before']).split(',')).toEqual(grown);
    expect(degenerationTarget(world, new Set(grown))).toBeUndefined();
    expect(degenerationTarget(world)).toBeDefined();
  });
});

describe('line counters read the change since the line began', () => {
  it('departures before Logged In do not count', () => {
    const world = createWorld(31, 0);
    const state = freshState(0);
    state.flags['n:departed'] = 3;
    expect(counter(state, 'departed')).toBe(3);
    startStoryline(world, state, 'logged', []);
    expect(counter(state, 'departed')).toBe(0);
    state.flags['n:departed'] = 4;
    expect(counter(state, 'departed')).toBe(1);
    // Old saves have no baseline: treated as 0.
    const old = freshState(0);
    old.flags['n:departed'] = 2;
    expect(counter(old, 'departed')).toBe(2);
    expect(storylineWorld('logged').world.nubbins.length).toBeGreaterThanOrEqual(3);
  });
});
