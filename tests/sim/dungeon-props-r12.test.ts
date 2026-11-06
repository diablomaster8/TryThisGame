import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { floorOf, runFloor, type Floor } from '../../src/sim/dungeon';
import { floorProps, propStandAt } from '../../src/sim/dungeon-props';
import { setPieces } from '../../src/sim/dungeon-set-pieces';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0032 (round 12): crystals are solid where no walker is walled out, torches stay wall
// sconces (soft), and the parked cart can be jumped onto and stood on.

describe('crystals', () => {
  it('some are solid, and a solid one never sits in a corridor or at a junction', () => {
    let solid = 0;
    let soft = 0;
    for (let s = 1; s <= 80; s++) {
      const f: Floor = floorOf(s * 7919, 1 + (s % 7));
      const props = floorProps(f).filter((p) => p.kind === 'crystal');
      solid += props.length;
      soft += f.crystals.length - props.length;
      for (const p of props) {
        const c = f.crystals.find(
          (q) =>
            Math.abs((q.x - f.cols / 2 + 0.5) * 1.5 - p.x) < 1e-6 &&
            Math.abs((q.y - f.rows / 2 + 0.5) * 1.5 - p.z) < 1e-6,
        );
        expect(c).toBeDefined();
      }
    }
    expect(solid).toBeGreaterThan(0);
    expect(soft).toBeGreaterThan(0);
  });

  it('torches stay soft: no torch collider kind exists', () => {
    const f = floorOf(4242, 3);
    expect(floorProps(f).some((p) => (p.kind as string) === 'torch')).toBe(false);
  });
});

function cartWorld(): { world: World; f: Floor } {
  for (let seed = 1; seed < 400; seed++) {
    const world = createWorld(seed, 0);
    applyCommand(world, { kind: 'enterDungeon', daily: false }, []);
    applyCommand(world, { kind: 'dungeonGo', to: 'down' }, []);
    const f = runFloor(world);
    if (f && setPieces(f).cart) return { world, f };
  }
  throw new Error('no floor with a cart');
}

describe('the parked cart (jump onto it)', () => {
  it('only a body with its feet up passes over; standing height is the cart top', () => {
    const { f } = cartWorld();
    const cart = setPieces(f).cart!;
    const at = { x: cart.x, z: cart.z };
    expect(propStandAt(f, at, 0)).toBe(0);
    expect(propStandAt(f, at, HOLLOW.props.cartTop)).toBe(HOLLOW.props.cartTop);
    expect(propStandAt(f, { x: cart.x + 3, z: cart.z }, HOLLOW.props.cartTop)).toBe(0);
  });

  it('a jump from beside the cart lands on top and stays; walking off drops to the floor', () => {
    const { world, f } = cartWorld();
    const run = world.dungeon!;
    run.packs = [];
    run.strays = [];
    const cart = setPieces(f).cart!;
    const k = world.keeper;
    // Approach from several sides; at least one open side must give a clean landing.
    let landed = false;
    for (let a = 0; a < 8 && !landed; a++) {
      const ang = (a * Math.PI) / 4;
      const sx = cart.x + Math.sin(ang) * 0.95;
      const sz = cart.z + Math.cos(ang) * 0.95;
      k.pos = { x: sx, z: sz };
      k.y = 0;
      k.vy = 0;
      k.grounded = true;
      k.moveTarget = null;
      const dir = { x: -Math.sin(ang), z: -Math.cos(ang) };
      applyCommand(world, { kind: 'keeperInput', input: dir }, []);
      applyCommand(world, { kind: 'jump', down: true }, []);
      let top = 0;
      const events: SimEvent[] = [];
      for (let t = 0; t < 1200; t += SIM.stepMs) {
        events.push(...stepWorld(world, SIM.stepMs));
        if (t === 100) applyCommand(world, { kind: 'jump', down: false }, []);
        top = Math.max(top, k.y);
        if (k.grounded && k.y > 0.5) break;
      }
      if (k.grounded && Math.abs(k.y - HOLLOW.props.cartTop) < 0.02) landed = true;
      applyCommand(world, { kind: 'keeperInput', input: { x: 0, z: 0 } }, []);
    }
    expect(landed).toBe(true);
    // Keep walking the same way: off the far side, the Keeper falls back to the floor.
    const out = { x: k.pos.x - cart.x, z: k.pos.z - cart.z };
    applyCommand(world, { kind: 'keeperInput', input: { x: -out.x, z: -out.z } }, []);
    for (let t = 0; t < 2500; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
    expect(k.y).toBeLessThan(0.05);
  });
});
