import { describe, expect, it } from 'vitest';
import { fliesLeg, flightY } from '../../src/sim/flight';
import { FLIGHT } from '../../src/config/tuning-look';
import type { Nubbin } from '../../src/sim/types';

const flier = (fly: number, sinceMs: number, stage = 'adult') =>
  ({
    seed: 12345,
    stage,
    pos: { x: 0, z: 0 },
    stats: { fly: { points: fly * 100 } },
    behavior: { state: 'wander', sinceMs, untilMs: sinceMs + 20000, target: { x: 6, z: 0 } },
  }) as unknown as Nubbin;

describe('short flights (LOOK-24)', () => {
  it('a Fly 80 adult flies some wander legs; a weak flier or a child never does', () => {
    const legs = Array.from({ length: 400 }, (_, i) => i * 7300);
    const flown = legs.filter((t) => fliesLeg(flier(80, t))).length;
    expect(flown / legs.length).toBeGreaterThan(FLIGHT.chance * 0.6);
    expect(flown / legs.length).toBeLessThan(FLIGHT.chance * 1.4);
    expect(legs.some((t) => fliesLeg(flier(40, t)))).toBe(false);
    expect(legs.some((t) => fliesLeg(flier(80, t, 'child')))).toBe(false);
  });

  it('rises, cruises at the flight height and glides down before landing', () => {
    const since = Array.from({ length: 400 }, (_, i) => i * 7300).find((t) =>
      fliesLeg(flier(80, t)),
    )!;
    const n = flier(80, since);
    expect(flightY(n, since)!.y).toBe(0);
    expect(flightY(n, since + 100)!.phase).toBe('rise');
    expect(flightY(n, since + 1000)).toEqual({ y: FLIGHT.height, phase: 'cruise' });
    // Nearly there: gliding, lower.
    n.pos = { x: 5.5, z: 0 };
    const g = flightY(n, since + 3000)!;
    expect(g.phase).toBe('glide');
    expect(g.y).toBeLessThan(FLIGHT.height);
    expect(g.y).toBeGreaterThan(0);
  });
});
