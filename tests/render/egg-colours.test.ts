import { describe, expect, it } from 'vitest';
import {
  CHILD_NEUTRAL,
  drawChao,
  JEWEL_COLORS,
  lookOf,
  poseFor,
  VARIANT_COLORS,
  variantColors,
} from '../../src/render/sprites/chao';
import { EGG_PALETTES } from '../../src/render/sprites/egg';
import { EGG_COLOURS, JEWELS } from '../../src/samples/nubbin-variants-colour';
import { createEgg, EGG_COLORS, finishOf, JEWEL_EGG_COLORS } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';

/** More egg colours and the metal and glass finishes (LOOK-31). */
describe('egg colours and finishes', () => {
  it('every colour has a pixel egg, a pixel Nubbin and a 3D colour', () => {
    expect(EGG_COLORS.length).toBe(15);
    expect(JEWEL_EGG_COLORS.length).toBe(10);
    for (const c of EGG_COLORS) {
      expect(EGG_PALETTES[c], c).toBeDefined();
      if (c === 'plain') continue;
      expect(VARIANT_COLORS[c], c).toBeDefined();
      expect(
        EGG_COLOURS.some((e) => e.name === c),
        c,
      ).toBe(true);
    }
    for (const j of JEWEL_EGG_COLORS) {
      expect(JEWEL_COLORS[j], j).toBeDefined();
      expect(
        JEWELS.some((e) => e.name === j),
        j,
      ).toBe(true);
    }
  });

  it('an egg without a finish field, as in an old save, is plain or shiny', () => {
    const egg = createEgg('e', { x: 0, z: 0 }, new Rng(1), 'lime');
    expect('finish' in egg).toBe(false);
    expect(finishOf(egg)).toBe('plain');
    expect(finishOf({ ...egg, shiny: true })).toBe('shiny');
    expect(finishOf({ ...egg, finish: 'glass' })).toBe('glass');
  });

  it('metal changes the ramp and glass lets the ground through, outline kept', () => {
    const base = lookOf(variantColors(CHILD_NEUTRAL, 'gold'));
    const draw = (finish: 'metal' | 'glass' | null) =>
      drawChao('front', poseFor('idle', 0), { ...base, finish });
    const plain = draw(null);
    expect(Array.from(draw('metal').data)).not.toEqual(Array.from(plain.data));
    const glass = draw('glass');
    const filled = (d: Uint8Array) => d.reduce((n, v) => n + (v > 0 ? 1 : 0), 0);
    expect(filled(glass.data)).toBeLessThan(filled(plain.data) * 0.8);
    expect(filled(glass.data)).toBeGreaterThan(filled(plain.data) * 0.4);
  });
});
