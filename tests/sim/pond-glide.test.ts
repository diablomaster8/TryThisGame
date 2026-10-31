/**
 * R0027 / R0025 (lane A r10): the Fly perk's glide crosses the pond. From the top of the
 * little east hill a running double jump held into a glide clears the water and lands on the
 * far shore; a jump off the shore without the glide splashes down and puffs back, kid-safe, to the
 * last spot the Keeper stood ashore, with nothing lost.
 */
import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { keeperFooting, keeperJump, keeperLastSafe, updateKeeper } from '../../src/sim/keeper';
import { TERRACES } from '../../src/sim/terrain';
import { createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

const SUB = 1000 / 60;
const pond = GROVE.pond;
// The hill nearest the pond: (20, 4), 13 u from its centre.
const hill = TERRACES.reduce((a, b) =>
  Math.hypot(a.x - pond.x, a.z - pond.z) < Math.hypot(b.x - pond.x, b.z - pond.z) ? a : b,
);
const d = Math.hypot(pond.x - hill.x, pond.z - hill.z);
const u = { x: (pond.x - hill.x) / d, z: (pond.z - hill.z) / d };

function onTop(glide: boolean, shore = false): World {
  const w = createWorld(1, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  if (glide) {
    n.stage = 'adult';
    n.bond = true;
    n.form = {
      band: 'neutral',
      type: 'fly',
      second: null,
      leanAtEvolution: { swim: 0, fly: 0, run: 0, power: 0, normal: 0 },
    };
  } else n.stage = 'egg';
  const top = hill.tiers[hill.tiers.length - 1]!.r - 0.4;
  w.keeper.pos = shore
    ? { x: pond.x - u.x * (pond.r + 0.7), z: pond.z - u.z * (pond.r + 0.7) }
    : { x: hill.x + u.x * top, z: hill.z + u.z * top };
  w.keeper.y = keeperFooting(w, w.keeper.pos.x, w.keeper.pos.z).y;
  w.keeper.running = true;
  w.keeper.input = { x: u.x, z: u.z };
  return w;
}

/** Run up, jump, double jump at the top of the arc, hold all the way down. */
function leap(w: World): { events: SimEvent[]; ms: number } {
  const events: SimEvent[] = [];
  for (let i = 0; i < 6; i++) updateKeeper(w, SUB, events);
  keeperJump(w, true);
  let ms = 0;
  let second = false;
  while (ms < 6000) {
    updateKeeper(w, SUB, events);
    ms += SUB;
    if (!second && !w.keeper.grounded && w.keeper.vy <= 0) {
      keeperJump(w, false);
      keeperJump(w, true);
      second = true;
    }
    if (w.keeper.grounded && ms > 200) break;
  }
  return { events, ms };
}

describe('gliding over the pond (MOVE-27)', () => {
  it('the glide clears the water and lands on the far shore', () => {
    const w = onTop(true);
    const { events } = leap(w);
    expect(events.some((e) => e.kind === 'keeperPoofed')).toBe(false);
    const p = w.keeper.pos;
    // Past the pond's middle along the line of the leap, and ashore.
    expect((p.x - pond.x) * u.x + (p.z - pond.z) * u.z).toBeGreaterThan(0);
    expect(Math.hypot(p.x - pond.x, p.z - pond.z)).toBeGreaterThanOrEqual(pond.r + 0.5 - 0.05);
  });

  it('without the glide it splashes down and puffs back ashore at once (MOVE-25)', () => {
    const w = onTop(false, true);
    const shells = w.inventory.shells;
    const { events, ms } = leap(w);
    const poof = events.find((e) => e.kind === 'keeperPoofed');
    if (poof?.kind !== 'keeperPoofed') throw new Error('no poof');
    const safe = keeperLastSafe(w)!;
    expect(w.keeper.grounded).toBe(true);
    expect(Math.hypot(w.keeper.pos.x - safe.x, w.keeper.pos.z - safe.z)).toBeLessThan(0.6);
    expect(Math.hypot(poof.to.x - pond.x, poof.to.z - pond.z)).toBeGreaterThanOrEqual(
      pond.r + 0.5 - 0.05,
    );
    // Back on its feet the moment it touches the water: nothing lost, no wait.
    expect(ms).toBeLessThan(3000);
    expect(w.inventory.shells).toBe(shells);
  });
});
