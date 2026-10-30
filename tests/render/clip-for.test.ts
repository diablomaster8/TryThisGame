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
    expect(clipFor(inState(nubbin('adult', 0), 'thrown'))).toBe('tumble');
  });

  it('follows the 3D pose table for shelter, courting, performing, fetching and love', () => {
    // R0534: sheltering huddles (a sit) once there, never the sleep pose.
    expect(clipFor(inState(nubbin('adult'), 'shelter'))).toBe('sit');
    for (const s of ['court', 'perform', 'fetch'] as const)
      expect(clipFor(inState(nubbin('adult'), s))).toBe('happy');
    const n = inState(nubbin('adult'), 'react');
    n.behavior.reaction = 'love';
    expect(clipFor(n)).toBe('love');
    n.behavior.reaction = 'happy';
    expect(clipFor(n)).toBe('happy');
  });

  it('swims a paddle, breaststroke or crawl by Swim level (LOOK-23)', () => {
    expect(clipFor(inState(nubbin('child', 0, 5), 'swim'))).toBe('paddle');
    expect(clipFor(inState(nubbin('adult', 0, swimmer), 'swim'))).toBe('swim');
    expect(clipFor(inState(nubbin('adult', 0, 80), 'swim'))).toBe('crawl');
  });
});
