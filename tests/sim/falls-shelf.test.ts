/**
 * R0026 item 4 (lane A r10): the hidden keepsake on the shelf behind the waterfall. A plain
 * jump there does not reach it; a double jump finds it, once, into the keepsakes.
 */
import { describe, expect, it } from 'vitest';
import { FALLS_SHELF } from '../../src/config/tuning-move-r10';
import { fallsShelfSpot, keeperFooting, keeperJump, updateKeeper } from '../../src/sim/keeper';
import { blocked } from '../../src/sim/obstacles';
import { TERRACES } from '../../src/sim/terrain';
import { createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

const SUB = 1000 / 60;

/** On the second tier beside the falls (the shelf itself is inside the falls' solid face). */
function atShelf(): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  const at = fallsShelfSpot();
  const a = Math.PI / 3;
  const p = { x: at.x + Math.sin(a) * 1.2, z: at.z + Math.cos(a) * 1.2 };
  w.keeper.pos = p;
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  expect(blocked(p, w, 0.3, 'keeper', w.keeper.y)).toBe(false);
  expect(Math.abs(w.keeper.y - keeperFooting(w, at.x, at.z).y)).toBeLessThan(0.1);
  return w;
}

/** Jump in place; `double` presses again at the top of the arc. */
function hop(w: World, double: boolean): SimEvent[] {
  const ev: SimEvent[] = [];
  keeperJump(w, true);
  let again = !double;
  for (let ms = 0; ms < 3000; ms += SUB) {
    updateKeeper(w, SUB, ev);
    if (!again && !w.keeper.grounded && w.keeper.vy <= 0) {
      keeperJump(w, false);
      keeperJump(w, true);
      again = true;
    }
    if (w.keeper.grounded && ms > 200) break;
  }
  keeperJump(w, false);
  return ev;
}

describe('the waterfall shelf keepsake (MOVE-26)', () => {
  it('sits on hill 1’s second tier, behind the falls', () => {
    const at = fallsShelfSpot();
    const hill = TERRACES[1]!;
    const r = Math.hypot(at.x - hill.x, at.z - hill.z);
    expect(r).toBeLessThan(hill.tiers[1]!.r);
    expect(r).toBeGreaterThan(hill.tiers[2]!.r);
  });

  it('a plain jump misses it; a double jump finds it once', () => {
    const w = atShelf();
    const from = { ...w.keeper.pos };
    expect(hop(w, false).some((e) => e.kind === 'fallsKeepsake')).toBe(false);
    expect(w.inventory.keepsakes).not.toContain(FALLS_SHELF.keepsake);
    const found = hop(w, true).filter((e) => e.kind === 'fallsKeepsake');
    expect(found).toHaveLength(1);
    expect(w.inventory.keepsakes).toContain(FALLS_SHELF.keepsake);
    // It jumped where it stood: nothing pushed it off the tier.
    expect(Math.hypot(w.keeper.pos.x - from.x, w.keeper.pos.z - from.z)).toBeLessThan(0.3);
    expect(hop(w, true).some((e) => e.kind === 'fallsKeepsake')).toBe(false);
    expect(w.inventory.keepsakes.filter((k) => k === FALLS_SHELF.keepsake)).toHaveLength(1);
  });
});
