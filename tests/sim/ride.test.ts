import { describe, expect, it } from 'vitest';
import { GROVE, KEEPER, NEEDS, RIDE, SIM, SWIM_TOW } from '../../src/config/tuning';
import { rideRefusal, rideSpeed } from '../../src/sim/ride';
import { deepAt } from '../../src/sim/swim-tow';
import type { Nubbin, NubbinType, Personality, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R0085 (WORLD-19) riding a Nubbin, and R0088 (WORLD-22) the swim tow across deep water. */
function setUp(): World {
  const world = createWorld(21, 0);
  stepWorld(world, SIM.stepMs);
  return world;
}

function adult(
  world: World,
  type: NubbinType,
  opts: { personality?: Personality; swim?: number; top?: number; affection?: number } = {},
): Nubbin {
  const n = world.nubbins[0]!;
  n.stage = 'adult';
  n.form = {
    band: 'neutral',
    type,
    second: null,
    leanAtEvolution: { normal: 0, swim: 0, fly: 0, run: 0, power: 0 },
  } as never;
  n.personality = opts.personality ?? 'cheerful';
  n.needs.affection = opts.affection ?? 80;
  n.needs.energy = 1;
  n.needs.hunger = 1;
  n.behavior.state = 'wander';
  n.stats.run.points = (opts.top ?? 40) * 100;
  n.stats.swim.points = (opts.swim ?? 0) * 100;
  n.pos = { ...world.keeper.pos };
  return n;
}

const step = (world: World, ms: number, events: SimEvent[] = []): SimEvent[] => {
  for (let t = 0; t < ms; t += SIM.stepMs) events.push(...stepWorld(world, SIM.stepMs));
  return events;
};

describe('Riding (R0085)', () => {
  it('needs an adult with affection 60 and a top stat of 30', () => {
    const world = setUp();
    const n = adult(world, 'run', { affection: 50 });
    expect(rideRefusal(world, n)).toBe('bond');
    n.needs.affection = 70;
    n.stats.run.points = 2000;
    expect(rideRefusal(world, n)).toBe('stat');
    n.stats.run.points = 3000;
    expect(rideRefusal(world, n)).toBeNull();
    n.stage = 'child';
    expect(rideRefusal(world, n)).toBe('adult');
  });

  it('paces by type: the speed table', () => {
    const table: Array<[NubbinType, boolean, number]> = [
      ['run', false, 2.0],
      ['run', true, 2.6],
      ['power', false, 1.6],
      ['swim', false, 1.4],
      ['fly', true, 1.5],
      ['normal', false, 1.6],
    ];
    for (const [type, running, want] of table) {
      const world = setUp();
      const n = adult(world, type);
      applyCommand(world, { kind: 'ride', nubbinId: n.id }, []);
      expect(world.ride?.nubbinId).toBe(n.id);
      expect(rideSpeed(world, running)).toBeCloseTo(want);
    }
  });

  it('a Run adult carries the Keeper edge to edge in 14 s or less', () => {
    const world = setUp();
    world.settings = { ...world.settings, autoRun: false };
    const n = adult(world, 'run');
    world.keeper.pos = { x: -44, z: 24 };
    n.pos = { ...world.keeper.pos };
    applyCommand(world, { kind: 'ride', nubbinId: n.id }, []);
    world.keeper.running = true;
    world.keeper.input = { x: 1, z: 0 };
    let t = 0;
    while (world.keeper.pos.x < 44 && t < 20_000) {
      stepWorld(world, SIM.stepMs);
      t += SIM.stepMs;
    }
    expect(world.keeper.pos.x).toBeGreaterThanOrEqual(44);
    expect(t).toBeLessThanOrEqual(14_000);
    // The carrier came along underneath.
    expect(Math.hypot(n.pos.x - world.keeper.pos.x, n.pos.z - world.keeper.pos.z)).toBeLessThan(
      1e-6,
    );
  });

  it('tires at twice the walking rate and asks to get down below 0.2', () => {
    const world = setUp();
    const n = adult(world, 'normal');
    applyCommand(world, { kind: 'ride', nubbinId: n.id }, []);
    world.keeper.pos = { x: 0, z: 30 };
    world.keeper.input = { x: 1, z: 0 };
    n.needs.energy = 0.5;
    step(world, 5_000);
    world.keeper.input = { x: -1, z: 0 };
    step(world, 5_000);
    const spent = 0.5 - n.needs.energy;
    // Walking alone would spend 10 s of the 40 min drain; riding spends double.
    expect(spent).toBeCloseTo((2 * 10_000) / NEEDS.energyFullToEmptyMs, 3);
    n.needs.energy = RIDE.tiredEnergy + 0.0001;
    const events = step(world, 2_000);
    expect(world.ride).toBeUndefined();
    expect(events.some((e) => e.kind === 'rideEnded' && e.reason === 'tired')).toBe(true);
  });

  it('a Lazy carrier sits for 2 s every 40 s until cheered', () => {
    const world = setUp();
    const n = adult(world, 'normal', { personality: 'lazy' });
    applyCommand(world, { kind: 'ride', nubbinId: n.id }, []);
    world.keeper.pos = { x: 0, z: 30 };
    let sat = 0;
    for (let t = 0; t < 41_000; t += SIM.stepMs) {
      world.keeper.input = { x: Math.floor(t / 4000) % 2 ? -1 : 1, z: 0 };
      n.needs.energy = 1;
      for (const e of stepWorld(world, SIM.stepMs)) if (e.kind === 'rideSat') sat++;
    }
    expect(sat).toBe(1);
    expect(rideSpeed(world, false)).toBe(0);
    applyCommand(world, { kind: 'rideCheer' }, []);
    expect(rideSpeed(world, false)).toBeCloseTo(RIDE.speed.normal);
  });

  it('a Learning Grove rides anything hatched, a child tows, and it costs no energy', () => {
    const world = setUp();
    world.edu = { band: 'sprout' } as World['edu'];
    const n = world.nubbins[0]!;
    n.stage = 'child';
    n.needs.energy = 0.5;
    n.behavior.state = 'wander';
    expect(rideRefusal(world, n)).toBeNull();
    applyCommand(world, { kind: 'ride', nubbinId: n.id }, []);
    expect(rideSpeed(world, false)).toBeCloseTo(RIDE.towSpeed);
    world.keeper.input = { x: 1, z: 0 };
    step(world, 3_000);
    // Only the ordinary drain applies.
    expect(n.needs.energy).toBeGreaterThan(0.5 - 4_000 / NEEDS.energyFullToEmptyMs);
  });

  it('getting down hands the Nubbin back to its own day', () => {
    const world = setUp();
    const n = adult(world, 'power');
    applyCommand(world, { kind: 'ride', nubbinId: n.id }, []);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'ride', nubbinId: null }, events);
    expect(world.ride).toBeUndefined();
    expect(events).toContainEqual({ kind: 'rideEnded', nubbinId: n.id, reason: 'down' });
    expect(rideSpeed(world, false)).toBeNull();
    expect(KEEPER.speed).toBeGreaterThan(0);
  });
});

describe('Swim tow (R0088)', () => {
  /** Walk the Keeper west to east straight across the pond's middle. */
  function cross(world: World): { x: number; events: SimEvent[] } {
    const p = GROVE.pond;
    world.keeper.pos = { x: p.x - p.r - 1.5, z: p.z };
    world.keeper.input = { x: 1, z: 0 };
    const events = step(world, 6_000);
    return { x: world.keeper.pos.x, events };
  }

  it('without a swimmer the shore is the limit, and a hint says why', () => {
    const world = setUp();
    adult(world, 'normal', { swim: 10, affection: 30 });
    const { x, events } = cross(world);
    expect(x).toBeLessThan(GROVE.pond.x - GROVE.pond.r + 0.5);
    expect(events.filter((e) => e.kind === 'swimHint')).toHaveLength(1);
  });

  it('a Swim-30 partner tows the Keeper across, paddling just ahead', () => {
    const world = setUp();
    const n = adult(world, 'normal', { swim: SWIM_TOW.minSwimLevel, affection: 30 });
    world.partners = [n.id, null];
    const p = GROVE.pond;
    world.keeper.pos = { x: p.x - p.r - 1.5, z: p.z };
    world.keeper.input = { x: 1, z: 0 };
    let towed = false;
    for (let t = 0; t < 8_000; t += SIM.stepMs) {
      stepWorld(world, SIM.stepMs);
      const k = world.keeper.pos;
      // Facing east: the swimmer paddles ahead while there is water ahead of the Keeper.
      if (deepAt(k.x, k.z) && deepAt(k.x + SWIM_TOW.lead, k.z)) {
        expect(n.behavior.state).toBe('swim');
        towed = true;
        expect(n.pos.x).toBeGreaterThan(world.keeper.pos.x);
      }
    }
    expect(towed).toBe(true);
    expect(world.keeper.pos.x).toBeGreaterThan(p.x + p.r);
  });
});
