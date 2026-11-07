/**
 * R0109 (WORLD-23): flying zones. From the ridge lookout (the 16,-16 hill's top) a glide
 * with a Fly-30 partner lands at the planned spot within 1 unit; steering moves it only
 * sideways; a Learning Grove rides the rail; an updraft lifts the Keeper two levels; and
 * nothing flies without a Fly partner.
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { FLIGHT_ZONES } from '../../src/config/tuning-more/world-camera-terrain';
import { FLIGHT_SPOTS, glideLanding, keeperFlight } from '../../src/sim/flight-zones';
import { terraceAt } from '../../src/sim/height';
import { keeperFooting } from '../../src/sim/keeper';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Vec2, World } from '../../src/sim/types';

const GLIDE = FLIGHT_SPOTS.find((z) => z.kind === 'glide')!;
const LIFT = FLIGHT_SPOTS.find((z) => z.kind === 'updraft')!;

function world(fly: number): World {
  const w = createWorld(5, 0);
  const n = w.nubbins[0]!;
  n.stage = 'adult';
  n.stats.fly.points = fly * 100;
  w.partners = [n.id, null];
  w.nubbins = [n];
  return w;
}

/** Stand back from a zone's spot and walk into it along its heading. */
function walkIn(w: World, z: (typeof FLIGHT_SPOTS)[number]): void {
  const p: Vec2 = { x: z.at.x - z.dir.x * 1.5, z: z.at.z - z.dir.z * 1.5 };
  w.keeper.pos = p;
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.vy = 0;
  w.keeper.grounded = true;
  w.keeper.input = { ...z.dir };
}

/** Step until the flight is over (or never started); returns whether one ran. */
function fly(w: World, input: (t: number) => Vec2 | null): boolean {
  let flew = false;
  for (let s = 0; s < 400; s++) {
    stepWorld(w, SIM.stepMs);
    const f = keeperFlight(w);
    if (f) {
      flew = true;
      const i = input(f.t);
      if (i) w.keeper.input = i;
    } else if (flew) return true;
  }
  return flew;
}

describe('flying zones (WORLD-23)', () => {
  it('glides from the ridge lookout to the planned spot with a Fly-30 partner', () => {
    expect(terraceAt('grove', GLIDE.at.x, GLIDE.at.z)).toBe(4);
    const plan = glideLanding(GLIDE);
    expect(Math.hypot(plan.x - GLIDE.at.x, plan.z - GLIDE.at.z)).toBeCloseTo(
      4 * FLIGHT_ZONES.perLevel,
      6,
    );
    const w = world(30);
    walkIn(w, GLIDE);
    expect(fly(w, () => ({ x: 0, z: 0 }))).toBe(true);
    const k = w.keeper;
    expect(Math.hypot(k.pos.x - plan.x, k.pos.z - plan.z)).toBeLessThanOrEqual(1);
    expect(k.grounded).toBe(true);
    expect(terraceAt('grove', k.pos.x, k.pos.z)).toBe(0);
  });

  it('steers only sideways, and not at all on the Learning Grove rail', () => {
    const left: Vec2 = { x: -GLIDE.dir.z, z: GLIDE.dir.x };
    const w = world(30);
    walkIn(w, GLIDE);
    fly(w, () => left);
    const side = glideLanding(GLIDE, FLIGHT_ZONES.steerMax);
    expect(Math.hypot(w.keeper.pos.x - side.x, w.keeper.pos.z - side.z)).toBeLessThanOrEqual(1);
    // The Learning Grove's fence keeps a kid off the hills, so the rail is set once airborne
    // (and lifted just before the landing, so the fence does not move the Keeper after).
    const kid = world(30);
    walkIn(kid, GLIDE);
    fly(kid, (t) => {
      if (t > 0.95) {
        kid.edu = null;
        return { x: 0, z: 0 };
      }
      kid.edu ??= { age: 8 } as never;
      return left;
    });
    const plan = glideLanding(GLIDE);
    expect(Math.hypot(kid.keeper.pos.x - plan.x, kid.keeper.pos.z - plan.z)).toBeLessThanOrEqual(1);
  });

  it('lifts the Keeper two levels on an updraft', () => {
    const w = world(30);
    walkIn(w, LIFT);
    expect(terraceAt('grove', w.keeper.pos.x, w.keeper.pos.z)).toBe(0);
    expect(fly(w, () => null)).toBe(true);
    expect(terraceAt('grove', w.keeper.pos.x, w.keeper.pos.z)).toBe(FLIGHT_ZONES.liftLevels);
    expect(w.keeper.grounded).toBe(true);
  });

  it('never flies without a Fly partner', () => {
    const w = world(29);
    walkIn(w, GLIDE);
    expect(fly(w, () => null)).toBe(false);
    const u = world(10);
    walkIn(u, LIFT);
    expect(fly(u, () => null)).toBe(false);
    expect(terraceAt('grove', u.keeper.pos.x, u.keeper.pos.z)).toBe(0);
  });
});
