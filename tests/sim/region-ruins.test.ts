import { describe, expect, it } from 'vitest';
import { regionLayout, walkableAt } from '../../src/config/region-layout';
import { RUINS_SPEC, ruinsState } from '../../src/config/region-ruins';
import { WOOD_SPEC } from '../../src/config/region-wood';
import { planRegionWalk } from '../../src/sim/region-walk';
import type { CampaignState, SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function campaign(chapter: number, ending: string | null = null): CampaignState {
  return { chapter, ending, flags: {} } as unknown as CampaignState;
}

/** Freeze an object and everything under it, so any write throws. */
function deepFreeze<T>(o: T): T {
  if (o && typeof o === 'object') {
    for (const v of Object.values(o)) deepFreeze(v);
    Object.freeze(o);
  }
  return o;
}

// WORLD-37 (R11 d7): the ruins.
describe('the ruins (WORLD-37)', () => {
  it('reads its three chapter states from the campaign and never writes it', () => {
    expect(ruinsState(null)).toBe('sealed');
    const states = [3, 9, 10, 12].map((c) => {
      const cs = deepFreeze(campaign(c));
      const before = JSON.stringify(cs);
      const s = ruinsState(cs);
      expect(JSON.stringify(cs)).toBe(before);
      return s;
    });
    expect(states).toEqual(['sealed', 'sealed', 'thawed', 'thawed']);
    expect(ruinsState(deepFreeze(campaign(13, 'open')))).toBe('relit');
    expect(ruinsState(deepFreeze(campaign(12, 'hearth')))).toBe('relit');
  });

  it('is reached from the Wood’s mill by its lane, and walked to the temple up the stair', () => {
    const wood = regionLayout(WOOD_SPEC);
    expect(planRegionWalk(wood, { x: 41, z: 6 }, { x: 54, z: 0 }).length).toBeGreaterThan(0);
    const l = regionLayout(RUINS_SPEC);
    const gate = { x: -29, z: 0 };
    expect(walkableAt(l, gate.x, gate.z)).toBe(true);
    // The wall between the courts is walked only up the stair.
    expect(walkableAt(l, 12, -4)).toBe(false);
    expect(walkableAt(l, 0, -4)).toBe(true);
    for (const p of [
      { x: 0, z: -27 },
      { x: 20, z: -18 },
      { x: 18, z: 18 },
      { x: -18, z: 22 },
    ])
      expect(planRegionWalk(l, gate, p).length, `${p.x},${p.z}`).toBeGreaterThan(0);
  });

  it('is shut from the Learning Grove and open otherwise', () => {
    const world = createWorld(9, 0);
    world.nubbins = [];
    applyCommand(world, { kind: 'travel', exit: 'grove-wood' }, []);
    expect(world.location).toBe('region:wood');
    const kid = structuredClone(world);
    kid.edu = { band: 'reader' } as never;
    const ev: SimEvent[] = [];
    applyCommand(kid, { kind: 'travel', exit: 'wood-ruins' }, ev);
    expect(kid.location).toBe('region:wood');
    expect(ev).toContainEqual({ kind: 'travelRefused', exit: 'wood-ruins', reason: 'locked' });
    applyCommand(world, { kind: 'travel', exit: 'wood-ruins' }, []);
    expect(world.location).toBe('region:ruins');
  });
});
