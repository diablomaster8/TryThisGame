import { describe, expect, it } from 'vitest';
import { LANE_GATES, LANE_TRAINERS } from '../../src/config/region-lane';
import { REGIONS } from '../../src/config/regions';
import { SIM } from '../../src/config/tuning';
import { regionOf } from '../../src/sim/regions';
import { TRAINERS } from '../../src/sim/trainers';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R12 lane D (WORLD-33): the neighbourhood lane, walked from the Grove's gate to a garden. */

function step(w: World): SimEvent[] {
  const ev = stepWorld(w, SIM.stepMs);
  // The game irises and sends `travel` for a loaded way; the test does the same at once.
  for (const e of ev)
    if (e.kind === 'exitReached') applyCommand(w, { kind: 'travel', exit: e.exit }, ev);
  return ev;
}

describe('the lane (WORLD-33)', () => {
  it('has one garden gate per trainer, in order, every 12 u', () => {
    expect([...LANE_TRAINERS]).toEqual(TRAINERS.map((t) => t.id));
    for (let i = 1; i < LANE_GATES.length; i++)
      expect(LANE_GATES[i]!.z - LANE_GATES[i - 1]!.z).toBe(12);
  });

  it('the Grove gate opens onto the lane; the fifth gate is 15–25 s on foot and leads into that garden', () => {
    const w = createWorld(9, 0);
    applyCommand(w, { kind: 'travel', exit: 'grove-gate' }, []);
    expect(w.location).toBe('region:lane');
    expect(regionOf(w.location)).toBe('lane');
    const fifth = LANE_GATES[4]!;
    const exit = REGIONS.lane.exits.find((e) => e.id === `lane-${fifth.id}`)!;
    const t0 = w.timeMs;
    applyCommand(
      w,
      {
        kind: 'moveKeeperTo',
        pos: { x: exit.rect.x + exit.rect.w / 2, z: exit.rect.z + exit.rect.h / 2 },
      },
      [],
    );
    for (let i = 0; i < 400 && w.location === 'region:lane'; i++) step(w);
    expect(w.location).toBe(`visit:${fifth.id}`);
    const s = (w.timeMs - t0) / 1000;
    expect(s).toBeGreaterThanOrEqual(15);
    expect(s).toBeLessThanOrEqual(25);
    // The way home from a garden is still the lane's top gate to the Grove.
    applyCommand(w, { kind: 'travel', exit: 'lane-gate' }, []);
    expect(w.location).toBe('grove');
  });

  it('the lane walks back to the Grove through its top gate', () => {
    const w = createWorld(9, 0);
    applyCommand(w, { kind: 'travel', exit: 'grove-gate' }, []);
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 0, z: -59 } }, []);
    for (let i = 0; i < 100 && w.location !== 'grove'; i++) step(w);
    expect(w.location).toBe('grove');
  });

  it('a visit sent with a garden still goes straight in (the Visit menu)', () => {
    const w = createWorld(9, 0);
    applyCommand(w, { kind: 'travel', exit: 'grove-gate', sub: 'visit:luna' }, []);
    expect(w.location).toBe('visit:luna');
    expect(w.keeper.pos).toEqual({ x: 0, z: 4 });
  });
});

describe('R0112: the Visit menu walks the lane to a neighbour gate', () => {
  it('visitWalk from the Grove arrives on the lane and walks into the fifth garden in 15–30 s', () => {
    const w = createWorld(9, 0);
    const fifth = LANE_GATES[4]!;
    const t0 = w.timeMs;
    applyCommand(w, { kind: 'visitWalk', trainer: fifth.id }, []);
    expect(w.location).toBe('region:lane');
    expect(w.keeper.moveTarget).not.toBeNull();
    for (let i = 0; i < 500 && w.location === 'region:lane'; i++) step(w);
    expect(w.location).toBe(`visit:${fifth.id}`);
    const s = (w.timeMs - t0) / 1000;
    expect(s).toBeGreaterThanOrEqual(15);
    expect(s).toBeLessThanOrEqual(30);
  });

  it('the plain visit command is still the quick way in, and a walk from a garden goes via the lane', () => {
    const w = createWorld(9, 0);
    applyCommand(w, { kind: 'visit', trainer: 'luna' }, []);
    expect(w.location).toBe('visit:luna');
    applyCommand(w, { kind: 'visitWalk', trainer: 'fern' }, []);
    expect(w.location).toBe('region:lane');
    for (let i = 0; i < 500 && w.location === 'region:lane'; i++) step(w);
    expect(w.location).toBe('visit:fern');
  });

  it('an unknown trainer changes nothing', () => {
    const w = createWorld(9, 0);
    applyCommand(w, { kind: 'visitWalk', trainer: 'nobody' }, []);
    expect(w.location).toBe('grove');
  });
});
