/**
 * The Fly perk's glide (R0027, MOVE-27): holding jump while falling drifts down slowly and
 * a little faster across, so a glide from 3 u up covers at least twice a plain fall's ground.
 */
import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { GLIDE } from '../../src/config/tuning-move';
import { keeperFooting, keeperGliding, updateKeeper } from '../../src/sim/keeper';
import { keeperPerks } from '../../src/sim/perks';
import { createWorld } from '../../src/sim/world';
import type { World } from '../../src/sim/types';

const SUB = 1000 / 60;

function flyer(perk: boolean): World {
  const w = createWorld(1, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  if (perk) {
    n.stage = 'adult';
    n.bond = true;
    n.form = {
      band: 'neutral',
      type: 'fly',
      second: null,
      leanAtEvolution: { swim: 0, fly: 0, run: 0, power: 0, normal: 0 },
    };
  } else n.stage = 'egg';
  // Out in the open, 3 u over the ground, walking east and holding jump.
  const p = { x: GROVE.keeperStart.x, z: GROVE.keeperStart.z };
  w.keeper.pos = { ...p };
  w.keeper.y = keeperFooting(w, p.x, p.z).y + 3;
  w.keeper.grounded = false;
  w.keeper.vy = 0;
  w.keeper.jumpHeld = true;
  w.keeper.input = { x: 1, z: 0 };
  return w;
}

/** Fall to the ground; how far it went across and how long it took. */
function fall(w: World): { dist: number; ms: number; glided: boolean } {
  const x0 = w.keeper.pos.x;
  let ms = 0;
  let glided = false;
  while (!w.keeper.grounded && ms < 5000) {
    updateKeeper(w, SUB, []);
    glided ||= keeperGliding(w);
    ms += SUB;
  }
  return { dist: w.keeper.pos.x - x0, ms, glided };
}

describe('the glide (MOVE-27)', () => {
  it('needs the Fly perk', () => {
    expect(keeperPerks(flyer(true)).glide).toBe(true);
    expect(keeperPerks(flyer(false)).glide).toBe(false);
  });

  it('a glide from 3 u covers twice the ground of a plain fall', () => {
    const plain = fall(flyer(false));
    const glide = fall(flyer(true));
    expect(plain.glided).toBe(false);
    expect(glide.glided).toBe(true);
    expect(glide.dist).toBeGreaterThan(plain.dist * 2);
    // Never longer than the glide's time plus the drop after it.
    expect(glide.ms).toBeLessThan(GLIDE.maxMs + 800);
  });

  it('letting go of jump ends the glide', () => {
    const w = flyer(true);
    for (let i = 0; i < 20; i++) updateKeeper(w, SUB, []);
    expect(keeperGliding(w)).toBe(true);
    w.keeper.jumpHeld = false;
    expect(keeperGliding(w)).toBe(false);
  });
});
