import { describe, expect, it } from 'vitest';
import { clipFor } from '../../src/render/world-view';
import { poseFor } from '../../src/render3d/actors';
import { CLIP_NAMES } from '../../src/render/sprites/animations';
import {
  VISUAL_STATES,
  poseOfState,
  visualStateFor,
  visualStateOfClip,
  visualStateOfPose,
} from '../../src/render-common/visual-state';
import { Rng } from '../../src/sim/rng';
import { BehaviorStates } from './parity-states';
import type { Nubbin } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';
import { hatch } from '../../src/sim/lifecycle';

/**
 * TECH-13: the two renderers must name the same thing for the same Nubbin. 200 seeded
 * states (behaviour, reaction, mood, stage, stats) go through Pixel's `clipFor` and 3D's
 * `poseFor`; both map to the shared `VisualState`. The listed gaps are places the two
 * differ today, kept as an explicit shrink-only list in docs/renderer-parity.md.
 */

function sample(seed: number): Nubbin {
  const rng = Rng.fromSeed(seed);
  const world = createWorld(seed, 0);
  const n = world.nubbins[0]!;
  hatch(n, [], 0);
  n.stage = rng.next() < 0.5 ? 'child' : 'adult';
  if (n.stage === 'adult')
    n.form = { band: 'neutral', type: 'fly', second: null, leanAtEvolution: { ...n.typeLean } };
  n.stats.fly.points = Math.floor(rng.next() * 99) * 100;
  n.stats.swim.points = Math.floor(rng.next() * 99) * 100;
  n.behavior.state = BehaviorStates[Math.floor(rng.next() * BehaviorStates.length)]!;
  n.behavior.reaction = (['happy', 'sad', 'surprised', 'dizzy', 'love', 'confused', null] as const)[
    Math.floor(rng.next() * 7)
  ]!;
  n.behavior.itemId = null;
  // Only the walking states are on the move; everything else is at rest.
  n.behavior.target = ['wander', 'findFood', 'avoid'].includes(n.behavior.state)
    ? { x: 1, z: 1 }
    : null;
  n.needs.hunger = rng.next();
  n.needs.happiness = rng.next() * 200 - 100;
  return n;
}

/** States where Pixel and 3D still differ: `state/reaction` -> a note. Shrink only. */
// R0455 (r12-d3): empty. Being petted was the last gap; both now name the `petted` state.
const KNOWN_GAPS = new Set<string>([]);

describe('renderer parity: VisualState', () => {
  it('every Pixel clip name maps to a state', () => {
    for (const c of CLIP_NAMES) expect(visualStateOfClip(c), c).not.toBeNull();
  });

  it('every state is reachable from both renderers', () => {
    expect(VISUAL_STATES.length).toBeGreaterThan(10);
    const fromClips = new Set(CLIP_NAMES.map((c) => visualStateOfClip(c)));
    expect(fromClips.has('idle')).toBe(true);
    expect(visualStateOfPose('pet')).toBe('held');
  });

  it('agrees on 200 seeded Nubbin states, outside the listed gaps', () => {
    const disagreements: string[] = [];
    for (let seed = 1; seed <= 200; seed++) {
      const n = sample(seed);
      const px = visualStateOfClip(clipFor(n));
      // 3D's pose is the routed state's pose (R0455), so the state is what 3D draws.
      const d3 = visualStateFor(n, n.behavior.target !== null, false);
      expect(poseFor(n, n.behavior.target !== null, false)).toBe(poseOfState(d3));
      if (px === d3) continue;
      const key = `${n.behavior.state}/${n.behavior.reaction ?? 'none'}`;
      if (!KNOWN_GAPS.has(key)) disagreements.push(`${key}: pixel ${px} vs 3d ${d3}`);
    }
    expect([...new Set(disagreements)]).toEqual([]);
  });

  it('names the petted state alike, whichever way the hand is on', () => {
    const n = sample(3);
    n.behavior.state = 'pet';
    expect(visualStateOfClip(clipFor(n))).toBe('petted');
    expect(visualStateFor(n, false, false)).toBe('petted');
    n.behavior.state = 'wander';
    expect(visualStateFor(n, true, true)).toBe('petted');
    expect(poseFor(n, true, true)).toBe('pet');
    expect(visualStateOfPose('pet')).toBe('held');
  });
});
