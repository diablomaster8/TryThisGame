import { describe, expect, it } from 'vitest';
import { REGION_GATES, GATE_LEVEL } from '../../src/config/region-wild';
import { RIDGE_FLIGHTS, RIDGE_JUMPS } from '../../src/config/region-ridge';
import { REGIONS } from '../../src/config/regions';
import { SIM } from '../../src/config/tuning';
import { FLIGHT_ZONES } from '../../src/config/tuning-more/world-camera-terrain';
import { hatch } from '../../src/sim/lifecycle';
import { setPartner } from '../../src/sim/partners';
import { gateIsOpen } from '../../src/sim/region-gates';
import { ledgeAt, regionFlight } from '../../src/sim/region-moves';
import { layoutOf } from '../../src/sim/region-walk';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R12 lane D (WORLD-25, WORLD-36): jumping, jump routes, the vine wall and the ridge's flights. */

function run(world: World, steps: number, events: SimEvent[] = []): SimEvent[] {
  for (let i = 0; i < steps; i++) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

function into(w: World, to: 'wood' | 'ridge'): void {
  const e = REGIONS.grove.exits.find((x) => x.to === to)!;
  applyCommand(w, { kind: 'travel', exit: e.id }, []);
  expect(w.location).toBe(`region:${to}`);
}

function put(w: World, x: number, z: number): void {
  w.keeper.pos = { x, z };
  w.keeper.moveTarget = null;
  run(w, 3);
}

function jump(w: World): void {
  applyCommand(w, { kind: 'jump', down: true }, []);
}

/** Walk along +x/-z with the stick, jumping whenever on the ground, for `steps` steps. */
function hopAlong(w: World, input: { x: number; z: number }, steps: number, double = false): void {
  applyCommand(w, { kind: 'keeperInput', input }, []);
  for (let i = 0; i < steps; i++) {
    const k = w.keeper;
    if (k.grounded) jump(w);
    else if (double && k.vy < 0 && k.airJumps > 0) jump(w);
    run(w, 1);
  }
  applyCommand(w, { kind: 'keeperInput', input: { x: 0, z: 0 } }, []);
  run(w, 10);
}

describe('jumping in a drawn region', () => {
  it('jumps and lands on the same spot, with the events the renderers play', () => {
    const w = createWorld(7, 0);
    into(w, 'wood');
    put(w, 0, 40);
    jump(w);
    const ev = run(w, 2);
    expect(w.keeper.grounded).toBe(false);
    expect(w.keeper.y).toBeGreaterThan(0);
    run(w, 20, ev);
    expect(w.keeper.grounded).toBe(true);
    expect(w.keeper.y).toBe(0);
    expect(ev.some((e) => e.kind === 'keeperJumped')).toBe(true);
    expect(ev.some((e) => e.kind === 'keeperLanded')).toBe(true);
  });

  it('the stream stones: walking stops at the bank, hopping crosses', () => {
    const w = createWorld(7, 0);
    into(w, 'wood');
    put(w, 36.6, -3);
    applyCommand(w, { kind: 'keeperInput', input: { x: 1, z: 0 } }, []);
    run(w, 40);
    applyCommand(w, { kind: 'keeperInput', input: { x: 0, z: 0 } }, []);
    run(w, 5);
    expect(w.keeper.pos.x).toBeLessThan(38);
    put(w, 36.6, -3);
    hopAlong(w, { x: 1, z: 0.05 }, 40);
    expect(w.keeper.pos.x).toBeGreaterThan(42);
    expect(w.keeper.grounded).toBe(true);
  });

  it('a missed hop over the stream sets the Keeper back where it left the bank', () => {
    const w = createWorld(7, 0);
    into(w, 'wood');
    put(w, 36.6, -3);
    // A short hop (let go at once) straight across, aimed between the stones.
    applyCommand(w, { kind: 'keeperInput', input: { x: 1, z: 0.6 } }, []);
    run(w, 3);
    const from = { ...w.keeper.pos };
    jump(w);
    applyCommand(w, { kind: 'jump', down: false }, []);
    run(w, 1);
    applyCommand(w, { kind: 'keeperInput', input: { x: 1, z: 0.6 } }, []);
    const ev = run(w, 20);
    expect(w.keeper.grounded).toBe(true);
    // Back on the bank (never left standing in the water).
    expect(w.keeper.pos.x).toBeLessThan(38.2);
    expect(Math.hypot(w.keeper.pos.x - from.x, w.keeper.pos.z - from.z)).toBeLessThan(1.5);
    expect(ev.some((e) => e.kind === 'keeperLanded')).toBe(true);
  });

  it('the ridge double-jump shortcuts: a single jump cannot climb, a double reaches the terrace above', () => {
    for (const r of RIDGE_JUMPS) {
      const w = createWorld(7, 0);
      into(w, 'ridge');
      const l = layoutOf('ridge')!;
      const lower = (z: number) => l.spec.terraces!.find((t) => z >= t.z0 && z <= t.z1)!.y;
      put(w, r.from.x, r.from.z);
      expect(w.keeper.y).toBe(lower(r.from.z));
      // Single jumps only: stays below.
      hopAlong(w, { x: 0, z: -1 }, 60, false);
      expect(w.keeper.pos.z).toBeGreaterThan(r.ledges![0]!.z);
      // Double jumps: up the ledge and over the lip.
      put(w, r.from.x, r.from.z);
      hopAlong(w, { x: 0, z: -1 }, 80, true);
      expect(w.keeper.pos.z, r.id).toBeLessThan(r.to.z + 1);
      expect(w.keeper.y, r.id).toBe(lower(r.to.z));
      expect(ledgeAt('ridge', r.ledges![0]!.x, r.ledges![0]!.z)).toBe(r.ledges![0]!.y);
    }
  });
});

describe('the vine wall (WORLD-25)', () => {
  it('shuts the cross-cut until a Power partner pulls it down, then it is a shortcut', () => {
    const w = createWorld(41, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], w.timeMs);
    setPartner(w, 0, n.id);
    into(w, 'wood');
    const g = REGION_GATES.wood!.find((x) => x.id === 'vine-wall')!;
    // From the hollow tree's side the stick cannot push through the wall.
    put(w, 6, -9.8);
    applyCommand(w, { kind: 'keeperInput', input: { x: 0.88, z: -0.47 } }, []);
    run(w, 60);
    expect(Math.hypot(w.keeper.pos.x - g.x, w.keeper.pos.z - g.z)).toBeGreaterThanOrEqual(g.r);
    expect(w.keeper.pos.x).toBeLessThan(g.x);
    // A strong partner by the wall pulls it down, once.
    n.stats.power.points = GATE_LEVEL * 100;
    n.pos = { x: g.x - 2, z: g.z + 1 };
    applyCommand(w, { kind: 'keeperInput', input: { x: 0, z: 0 } }, []);
    const ev = run(w, 60);
    expect(gateIsOpen(w, 'wood', 'vine-wall')).toBe(true);
    expect(ev.filter((e) => e.kind === 'gateOpened')).toHaveLength(1);
    // Now a tap from the hollow tree reaches the mill side straight through.
    put(w, -12, 0);
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: 28, z: -18 } }, []);
    run(w, 200);
    expect(Math.hypot(w.keeper.pos.x - 28, w.keeper.pos.z + 18)).toBeLessThan(1.5);
  });
});

describe('the ridge flights (WORLD-36)', () => {
  function withFlyer(): World {
    const w = createWorld(41, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], w.timeMs);
    n.stats.fly.points = FLIGHT_ZONES.fly * 100;
    setPartner(w, 0, n.id);
    into(w, 'ridge');
    return w;
  }

  it('an updraft lifts the Keeper one terrace, only with a Fly partner', () => {
    const def = RIDGE_FLIGHTS.find((f) => f.kind === 'updraft')!;
    const w = createWorld(41, 0);
    into(w, 'ridge');
    put(w, def.at.x, def.at.z + 1.5);
    applyCommand(w, { kind: 'keeperInput', input: { x: 0, z: -1 } }, []);
    run(w, 12);
    expect(regionFlight(w)).toBeNull();
    const f = withFlyer();
    const y0 = f.keeper.y;
    put(f, def.at.x, def.at.z + 1.5);
    applyCommand(f, { kind: 'keeperInput', input: { x: 0, z: -1 } }, []);
    run(f, 12);
    expect(regionFlight(f)?.kind).toBe('updraft');
    applyCommand(f, { kind: 'keeperInput', input: { x: 0, z: 0 } }, []);
    run(f, 20);
    expect(regionFlight(f)).toBeNull();
    expect(f.keeper.y).toBeGreaterThan(y0 + 2);
    const end = def.path[def.path.length - 1]!;
    expect(Math.hypot(f.keeper.pos.x - end.x, f.keeper.pos.z - end.z)).toBeLessThan(0.5);
  });

  it('summit to the Grove by the glide line takes at most 25 s', () => {
    const w = withFlyer();
    put(w, 0, -66);
    const start = w.timeMs;
    const glide = RIDGE_FLIGHTS.find((f) => f.kind === 'glide')!;
    applyCommand(w, { kind: 'moveKeeperTo', pos: glide.at }, []);
    for (
      let i = 0;
      i < 400 && Math.hypot(w.keeper.pos.x - glide.at.x, w.keeper.pos.z - glide.at.z) > 0.6;
      i++
    )
      run(w, 1);
    // Step on along the line to set it off.
    applyCommand(w, { kind: 'keeperInput', input: { x: -0.05, z: 1 } }, []);
    run(w, 3);
    applyCommand(w, { kind: 'keeperInput', input: { x: 0, z: 0 } }, []);
    expect(regionFlight(w)?.kind).toBe('glide');
    for (let i = 0; i < 400 && regionFlight(w); i++) run(w, 1);
    expect(w.keeper.grounded).toBe(true);
    // Then on foot to the way home, and over it.
    const home = REGIONS.ridge.exits.find((e) => e.to === 'grove')!;
    applyCommand(
      w,
      {
        kind: 'moveKeeperTo',
        pos: { x: home.rect.x + home.rect.w / 2, z: home.rect.z + home.rect.h / 2 },
      },
      [],
    );
    for (let i = 0; i < 400 && w.location !== 'grove'; i++) run(w, 1);
    expect(w.location).toBe('grove');
    expect((w.timeMs - start) / 1000).toBeLessThanOrEqual(25);
  });
});
