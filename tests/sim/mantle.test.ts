import { describe, expect, it } from 'vitest';
import { placeDecor } from '../../src/sim/decorate';
import { keeperFooting, keeperMantle, updateKeeper } from '../../src/sim/keeper';
import { colliderTopY, obstacles } from '../../src/sim/obstacles';
import { groveHeight } from '../../src/sim/terrain';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// MOVE-50: a jump that comes up a little short of a lip mantles onto it.

const SUB = 1000 / 60;

/** A world with one bench whose seat is raised to `lip` over the ground, the Keeper 1 u south. */
function lipWorld(lip: number): { w: World; top: number; z: number } {
  const w = createWorld(1, 0);
  w.nubbins = [];
  w.settings.gentleJumps = false;
  const at = { x: -4, z: 9 };
  w.inventory.decor.bench = 1;
  expect(placeDecor(w, 'bench', at, [], 0)).toBe(true);
  const bench = obstacles(w).find((c) => c.id.startsWith('decor') && c.top === 0.44)!;
  (bench as { top: number }).top = lip;
  const top = colliderTopY(bench);
  expect(top - groveHeight(bench.x, bench.z)).toBeCloseTo(lip, 5);
  const k = w.keeper;
  k.pos = { x: bench.x, z: bench.z - 1 };
  k.y = keeperFooting(w, k.pos.x, k.pos.z).y;
  k.grounded = true;
  return { w, top, z: bench.z };
}

describe('the ledge mantle (MOVE-50)', () => {
  it('a 0.95 jump at a 1.2 lip mantles up over 250 ms', () => {
    const { w, top } = lipWorld(1.2);
    const events: SimEvent[] = [];
    let seen = false;
    const k = w.keeper;
    k.input = { x: 0, z: 1 };
    applyCommand(w, { kind: 'jump', down: true }, events);
    let mantleSteps = 0;
    let peak = -Infinity;
    for (let i = 0; i < 120 && !(k.grounded && Math.abs(k.y - top) < 1e-3); i++) {
      updateKeeper(w, SUB, events);
      if (keeperMantle(w) !== null) {
        seen = true;
        mantleSteps++;
      } else if (!seen) peak = Math.max(peak, k.y - groveHeight(k.pos.x, k.pos.z));
    }
    expect(seen).toBe(true);
    // The jump's own arc stayed under the lip; the mantle took about 250 ms (15 substeps).
    expect(peak).toBeLessThan(1.2);
    expect(mantleSteps).toBeGreaterThanOrEqual(13);
    expect(mantleSteps).toBeLessThanOrEqual(16);
    expect(k.grounded).toBe(true);
    expect(k.y).toBeCloseTo(top, 3);
    expect(events.some((e) => e.kind === 'keeperLanded')).toBe(true);
  });

  it('a 1.4 lip is out of reach: the jump falls back cleanly, no mantle', () => {
    const { w, top, z } = lipWorld(1.4);
    const events: SimEvent[] = [];
    let mantled = false;
    w.keeper.input = { x: 0, z: 1 };
    applyCommand(w, { kind: 'jump', down: true }, events);
    for (let i = 0; i < 90; i++) {
      updateKeeper(w, SUB, events);
      if (keeperMantle(w) !== null) mantled = true;
    }
    expect(mantled).toBe(false);
    expect(w.keeper.grounded).toBe(true);
    expect(w.keeper.y).toBeLessThan(top - 1);
    expect(w.keeper.pos.z).toBeLessThan(z - 0.3);
  });
});
