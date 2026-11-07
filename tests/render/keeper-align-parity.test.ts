import { describe, expect, it } from 'vitest';
import { childLean, leanStep } from '../../src/render/sprites/child-hint';
import { MOON_KEEPER, SUN_KEEPER } from '../../src/render/sprites/keeper';
import { PALETTE } from '../../src/render/sprites/palette';
import { CHILD_HINT } from '../../src/config/tuning';
import { KEEPER_MOON, KEEPER_POSES, KEEPER_SUN } from '../../src/render3d/art/keeper-spec';

/** R0455 (TECH-13): the alignment-hint and Keeper-look rows of docs/renderer-parity.md. */
const lum = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16);
  return 0.3 * ((n >> 16) & 255) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255);
};

describe('alignment hints, Pixel and 3D', () => {
  it('both read one lean: same band, zero together, full together', () => {
    for (let a = -1; a <= 1.0001; a += 0.05) {
      const lean = childLean(a);
      // Pixel draws two palette steps (sheets.ts), 3D blends `steps3d` (creature-pool.ts).
      const px = leanStep(lean, 2);
      const d3 = leanStep(lean, CHILD_HINT.steps3d);
      expect(px === 0).toBe(d3 === 0);
      expect(px === 0).toBe(Math.abs(a) < CHILD_HINT.from);
      if (px > 0) expect(lean.band).toBe(a > 0 ? 'sun' : 'moon');
      if (Math.abs(a) >= CHILD_HINT.to) {
        expect(px).toBe(2);
        expect(d3).toBe(CHILD_HINT.steps3d);
      }
    }
  });

  it('is symmetric about neutral and never goes backwards as the lean grows', () => {
    let last = 0;
    for (let a = 0; a <= 1; a += 0.02) {
      expect(leanStep(childLean(-a), 4)).toBe(leanStep(childLean(a), 4));
      const s = leanStep(childLean(a), 4);
      expect(s).toBeGreaterThanOrEqual(last);
      last = s;
    }
  });
});

describe('Keeper look, Pixel and 3D', () => {
  const px = (i: number): string => PALETTE[i]!;

  it('wears the Sun and Moon outfits as the same pair: Moon darker, Sun carries the sun badge', () => {
    expect(SUN_KEEPER.hatStyle).toBe('sun');
    expect(MOON_KEEPER.hatStyle).toBe('hood');
    expect(KEEPER_SUN.emblem).toBe('sun');
    expect(KEEPER_MOON.emblem).toBe('moon');
    expect(lum(px(MOON_KEEPER.shirt))).toBeLessThan(lum(px(SUN_KEEPER.shirt)));
    expect(lum(KEEPER_MOON.tee)).toBeLessThan(lum(KEEPER_SUN.tee));
    expect(lum(px(MOON_KEEPER.pants))).toBeLessThan(lum(px(SUN_KEEPER.pants)));
    expect(lum(KEEPER_MOON.vest)).toBeLessThan(lum(KEEPER_SUN.vest));
  });

  it('shares the same skin family: warm, light, the same grandchild-free base', () => {
    expect(lum(px(SUN_KEEPER.skin))).toBeGreaterThan(130);
    expect(lum(KEEPER_SUN.skin)).toBeGreaterThan(130);
  });

  it('3D animates the poses the game asks of the Keeper', () => {
    for (const p of ['idle', 'walk', 'pet', 'carry', 'throw', 'sleep'] as const)
      expect(KEEPER_POSES).toContain(p);
  });
});
