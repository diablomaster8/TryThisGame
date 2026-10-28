// MOVE-30: Nubbins jump from their Run and Fly. A spry adult hops up onto a rock top it
// walks into, a Lazy one walks round instead, and a Cheerful Nubbin hops for joy far more
// often than a Shy one (which hops only to back away from a Keeper landing near it).
import { describe, expect, it } from 'vitest';
import { EGG, SIM } from '../../src/config/tuning';
import { nubbinAirJumps, nubbinJump } from '../../src/sim/nubbin-hop';
import { contact, obstacles } from '../../src/sim/obstacles';
import type { Collider } from '../../src/sim/obstacles';
import type { Nubbin, Personality, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

function adultWorld(seed: number, personality: Personality, run: number): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 5; i++) stepWorld(w, SIM.stepMs);
  w.nubbins = [w.nubbins[0]!];
  const n = w.nubbins[0]!;
  n.stage = 'adult';
  n.personality = personality;
  n.stats.run.points = run * 100;
  n.stats.fly.points = 0;
  return { w, n };
}

/** A rock-like top Nubbins may stand on, well away from anything else. */
function aRock(w: World): Collider {
  const rock = obstacles(w).find(
    (c) =>
      c.flags.includes('standable') &&
      c.flags.includes('hop') &&
      !c.flags.includes('keeperOnly') &&
      c.shape.type === 'circle' &&
      c.top <= 0.6,
  );
  if (!rock) throw new Error('no rock top in the layout');
  return rock;
}

function wander(w: World, n: Nubbin, to: { x: number; z: number }): void {
  n.behavior.state = 'wander';
  n.behavior.sinceMs = w.timeMs;
  n.behavior.untilMs = w.timeMs + 60_000;
  n.behavior.target = { ...to };
}

describe('Nubbin hops (MOVE-30)', () => {
  it('jumps from Run and Fly, less as a child, and flaps with Fly 40', () => {
    const { n } = adultWorld(1, 'cheerful', 60);
    expect(nubbinJump(n)).toBeCloseTo(0.35 + 0.36, 5);
    n.stage = 'child';
    expect(nubbinJump(n)).toBeCloseTo((0.35 + 0.36) * 0.6, 5);
    expect(nubbinAirJumps(n)).toBe(0);
    n.stats.fly.points = 4000;
    expect(nubbinAirJumps(n)).toBe(1);
  });

  it('a Run-60 adult hops up onto a rock top it walks to', () => {
    const { w, n } = adultWorld(11, 'cheerful', 60);
    const rock = aRock(w);
    n.pos = { x: rock.x - 3, z: rock.z };
    wander(w, n, { x: rock.x, z: rock.z });
    let hops = 0;
    let top = 0;
    for (let i = 0; i < 200; i++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      for (const e of stepWorld(w, SIM.stepMs)) if (e.kind === 'nubbinHop') hops++;
      if (contact(rock, n.pos.x, n.pos.z, 0)) {
        top = n.y;
        // Arrived: it sits up there (as a Mischievous one does by itself).
        if (n.behavior.state === 'wander') {
          n.behavior.state = 'sit';
          n.behavior.untilMs = w.timeMs + 60_000;
        }
      }
    }
    expect(hops).toBeGreaterThan(0);
    expect(top).toBeCloseTo(rock.top, 2);
  });

  it('a Lazy one walks round the rock and never leaves the ground', () => {
    const { w, n } = adultWorld(12, 'lazy', 60);
    const rock = aRock(w);
    const r = rock.shape.type === 'circle' ? rock.shape.r : 0.5;
    n.pos = { x: rock.x - r - 2, z: rock.z };
    const to = { x: rock.x + r + 2, z: rock.z };
    wander(w, n, to);
    let highest = 0;
    let inside = 0;
    for (let i = 0; i < 300; i++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, SIM.stepMs);
      highest = Math.max(highest, n.y);
      if (contact(rock, n.pos.x, n.pos.z, 0)) inside++;
      if (n.behavior.state !== 'wander') break;
    }
    expect(highest).toBe(0);
    expect(inside).toBe(0);
  });

  it('a Cheerful Nubbin hops for joy over 3x as often as a Shy one', () => {
    const count = (personality: Personality): number => {
      const { w, n } = adultWorld(21, personality, 30);
      let hops = 0;
      // Twenty sim minutes, kept fed, rested and happy.
      for (let i = 0; i < (20 * 60_000) / SIM.stepMs; i++) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
        n.needs.happiness = 80;
        for (const e of stepWorld(w, SIM.stepMs)) if (e.kind === 'nubbinHop') hops++;
      }
      return hops;
    };
    const cheerful = count('cheerful');
    const shy = count('shy');
    expect(cheerful).toBeGreaterThan((3 * 20) / 60); // more than 3 an hour
    expect(cheerful).toBeGreaterThan(3 * Math.max(1, shy));
  }, 20_000);

  it('a Shy Nubbin hops back from the Keeper landing beside it', () => {
    const { w, n } = adultWorld(31, 'shy', 10);
    n.behavior.state = 'sit';
    n.behavior.untilMs = w.timeMs + 60_000;
    w.keeper.pos = { x: n.pos.x + 1, z: n.pos.z };
    const before = Math.hypot(n.pos.x - w.keeper.pos.x, n.pos.z - w.keeper.pos.z);
    stepWorld(w, SIM.stepMs, undefined, false);
    w.keeper.y = 0.5;
    w.keeper.vy = -1;
    w.keeper.grounded = false;
    let hopped = false;
    for (let i = 0; i < 30; i++) {
      for (const e of stepWorld(w, SIM.stepMs)) if (e.kind === 'nubbinHop') hopped = true;
    }
    expect(hopped).toBe(true);
    expect(Math.hypot(n.pos.x - w.keeper.pos.x, n.pos.z - w.keeper.pos.z)).toBeGreaterThan(before);
  });
});
