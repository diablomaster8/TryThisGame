/**
 * Which clip a Nubbin plays: strong fliers flap as they move, strong swimmers swim a
 * stroke, and everyone else in the pond wades with the walk clip.
 */
import { describe, expect, it } from 'vitest';
import { MOTION_CLIPS, STATS } from '../../src/config/tuning';
import { clipFor } from '../../src/render/world-view';
import { hatch } from '../../src/sim/lifecycle';
import type { Nubbin, SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

function nubbin(stage: 'child' | 'adult', fly = 0, swim = 0): Nubbin {
  const world = createWorld(7, 0);
  const n = world.nubbins[0]!;
  const events: SimEvent[] = [];
  hatch(n, events, 0);
  if (stage === 'adult') {
    n.stage = 'adult';
    n.form = { band: 'neutral', type: 'fly', second: null, leanAtEvolution: { ...n.typeLean } };
  }
  n.stats.fly.points = fly * STATS.pointsPerLevel;
  n.stats.swim.points = swim * STATS.pointsPerLevel;
  return n;
}

function inState(n: Nubbin, state: Nubbin['behavior']['state']): Nubbin {
  n.behavior.state = state;
  return n;
}

describe('clipFor', () => {
  const strong = MOTION_CLIPS.flapLevel;
  const swimmer = MOTION_CLIPS.swimLevel;

  it('flaps for a strong flier on the move, walks otherwise', () => {
    expect(clipFor(inState(nubbin('adult', strong), 'wander'))).toBe('flap');
    expect(clipFor(inState(nubbin('adult', strong), 'findFood'))).toBe('flap');
    expect(clipFor(inState(nubbin('adult', strong - 1), 'wander'))).toBe('walk');
    expect(clipFor(inState(nubbin('child', 99), 'wander'))).toBe('walk');
  });

  it('flutters when a strong flier is thrown', () => {
    expect(clipFor(inState(nubbin('adult', strong), 'thrown'))).toBe('flap');
    expect(clipFor(inState(nubbin('adult', 0), 'thrown'))).toBe('surprised');
  });

  it('swims only for a strong swimmer; the rest wade', () => {
    expect(clipFor(inState(nubbin('adult', 0, swimmer), 'swim'))).toBe('swim');
    expect(clipFor(inState(nubbin('adult', 0, swimmer - 1), 'swim'))).toBe('walk');
    expect(clipFor(inState(nubbin('child', 0, 99), 'swim'))).toBe('walk');
  });
});
