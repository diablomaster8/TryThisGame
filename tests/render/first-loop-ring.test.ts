import { describe, expect, it } from 'vitest';
import { firstLoopSpot, firstRingPulse } from '../../src/render-common/first-loop-ring';
import { stepWorld, createWorld } from '../../src/sim/world';

// R0448 (TECH-06): the pulsing ring on the first loop's target, shared by both renderers.
describe('first-loop ring', () => {
  it('marks the egg, then the child for the pat and the name, then goes away', () => {
    const w = createWorld(5, 0);
    const egg = w.nubbins.find((n) => n.stage === 'egg')!;
    expect(firstLoopSpot(w)).toMatchObject({ kind: 'egg', x: egg.pos.x, z: egg.pos.z });
    egg.hatchRemainingMs = 0;
    stepWorld(w, 100);
    stepWorld(w, 100);
    expect(firstLoopSpot(w)?.kind).toBe('pat');
    w.diary!.firstPetMs = w.timeMs;
    w.diary!.firstFeedMs = w.timeMs;
    expect(firstLoopSpot(w)?.kind).toBe('name');
    w.diary!.firstNameMs = w.timeMs;
    expect(firstLoopSpot(w)?.kind).toBe('toss');
    w.diary!.firstTossMs = w.timeMs;
    // The guide is over; only the plain first-fruit cue may still ring the child.
    expect(['feed', undefined]).toContain(firstLoopSpot(w)?.kind);
  });

  it('is off once the guide is skipped and away from home', () => {
    const w = createWorld(5, 0);
    stepWorld(w, 100);
    expect(firstLoopSpot(w)).not.toBeNull();
    w.location = 'region:shore';
    expect(firstLoopSpot(w)).toBeNull();
    w.location = 'grove';
    w.diary!.loopSkipped = true;
    expect(firstLoopSpot(w)).toBeNull();
  });

  it('pulses, and holds steady under reduced motion', () => {
    const a = firstRingPulse(0, false);
    const b = firstRingPulse(275, false);
    expect(a.scale).not.toBeCloseTo(b.scale, 2);
    expect(firstRingPulse(0, true)).toEqual(firstRingPulse(275, true));
    expect(firstRingPulse(0, true).opacity).toBeGreaterThan(0.5);
  });
});
