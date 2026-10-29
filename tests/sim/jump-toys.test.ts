import { describe, expect, it } from 'vitest';
import { GROVE, JUMP_TOYS, SIM } from '../../src/config/tuning';
import { JUMP } from '../../src/config/tuning-sim';
import { shroomHopY, updateBehavior } from '../../src/sim/behavior';
import { buyDecor, placeDecor, placeRefusal, springBouncedAt } from '../../src/sim/decorate';
import { keeperFooting, updateKeeper } from '../../src/sim/keeper';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';
import { Rng } from '../../src/sim/rng';

// MOVE-57: the spring mushroom and the hay bale, bought and placed like decor.

const SPOT = { x: -20, z: -2 };

function withToy(kind: 'springShroom' | 'hayBale'): World {
  const w = createWorld(3, 0);
  w.inventory.shells = 200;
  const ev: SimEvent[] = [];
  expect(buyDecor(w, kind, ev)).toBe(true);
  expect(w.inventory.shells).toBe(200 - JUMP_TOYS.prices[kind]);
  w.nubbins = [];
  expect(placeDecor(w, kind, SPOT, ev)).toBe(true);
  return w;
}

describe('jump toys (MOVE-57)', () => {
  it('bounces a Keeper landing on the spring mushroom 2.2× a jump high', () => {
    const w = withToy('springShroom');
    const k = w.keeper;
    const top = keeperFooting(w, SPOT.x, SPOT.z).y;
    k.pos = { ...SPOT };
    k.grounded = false;
    k.y = top + 1.5;
    k.vy = -2;
    const ev: SimEvent[] = [];
    let peak = -Infinity;
    let bounced = false;
    for (let i = 0; i < 240; i++) {
      updateKeeper(w, 1000 / 60, ev);
      if (ev.some((e) => e.kind === 'springBounced')) bounced = true;
      if (bounced) peak = Math.max(peak, k.y);
      w.timeMs += 1000 / 60;
    }
    expect(bounced).toBe(true);
    expect(peak - top).toBeGreaterThan(JUMP.height * 1.8);
    expect(springBouncedAt(w, w.placed[0]!.id)).toBeGreaterThan(-Infinity);
  });

  it('a hay bale is a plain top to stand on', () => {
    const w = withToy('hayBale');
    const ground = keeperFooting(createWorld(3, 0), SPOT.x, SPOT.z).y;
    const top = keeperFooting(w, SPOT.x, SPOT.z).y;
    expect(top - ground).toBeCloseTo(JUMP_TOYS.colliders.hayBale.top, 1);
  });

  it('a Nubbin plays on the mushroom and bounces on its cap', () => {
    const w = withToy('springShroom');
    const fresh = createWorld(3, 0);
    const n = fresh.nubbins[0]!;
    hatch(n, [], 0);
    n.pos = { x: SPOT.x + 2, z: SPOT.z };
    w.nubbins = [n];
    const rng = new Rng(5);
    const ev: SimEvent[] = [];
    let hopped = false;
    for (let i = 0; i < 3000 && !hopped; i++) {
      w.timeMs += SIM.stepMs;
      if (n.behavior.state !== 'play') n.behavior.untilMs = 0;
      updateBehavior(n, w, SIM.stepMs, rng, ev);
      const y = shroomHopY(w, n, w.timeMs + 250);
      if (y !== null && y > JUMP_TOYS.colliders.springShroom.top) hopped = true;
    }
    expect(hopped).toBe(true);
    for (let i = 0; i < 20; i++) {
      w.timeMs += SIM.stepMs;
      updateBehavior(n, w, SIM.stepMs, rng, ev);
    }
    expect(ev.some((e) => e.kind === 'springBounced' && e.nubbinId === n.id)).toBe(true);
    expect(n.y).toBe(0);
  });

  it('never goes under a house', () => {
    const w = createWorld(3, 0);
    const c = GROVE.buildings.cottage;
    expect(placeRefusal(w, 'springShroom', { x: c.x, z: c.z })).not.toBeNull();
    expect(placeRefusal(w, 'hayBale', { x: c.x, z: c.z })).not.toBeNull();
  });
});
