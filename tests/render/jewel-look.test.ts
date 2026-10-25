/**
 * Jewel eggs and jewel Nubbins in the pixel renderer: every jewel has its own palette from
 * the shared 48 colours, keeps it through every stage, takes two-tone and shiny on top (as 3D), and
 * the egg and the Nubbin both carry a gem finish.
 */
import { describe, expect, it } from 'vitest';
import {
  adultColors,
  CHILD_NEUTRAL,
  drawChao,
  eternalColors,
  JEWEL_COLORS,
  lookOf,
  poseFor,
  variantColors,
} from '../../src/render/sprites/chao';
import { drawEgg, EGG_PALETTES } from '../../src/render/sprites/egg';
import { C, PALETTE } from '../../src/render/sprites/palette';
import { JEWEL_EGG_COLORS } from '../../src/sim/nubbin';

describe('jewel looks', () => {
  it('has a distinct in-palette look for each of the seven jewels', () => {
    expect(Object.keys(JEWEL_COLORS).sort()).toEqual([...JEWEL_EGG_COLORS].sort());
    const bodies = new Set<string>();
    for (const j of Object.values(JEWEL_COLORS)) {
      for (const c of [j.body, j.shade, j.belly, j.tip]) {
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThan(PALETTE.length);
      }
      bodies.add(`${j.body}:${j.shade}`);
    }
    expect(bodies.size).toBe(7);
    for (const name of JEWEL_EGG_COLORS) expect(EGG_PALETTES[name]).toBeDefined();
  });

  it('takes two-tone and shiny on top of the stone, as the 3D look does', () => {
    for (const name of JEWEL_EGG_COLORS) {
      const j = JEWEL_COLORS[name]!;
      const c = variantColors(CHILD_NEUTRAL, name, true, 'gold');
      // The stone stays the body; the second colour takes the belly and tips; shiny the rim.
      expect(c.body).toBe(j.body);
      expect(c.shade).toBe(j.shade);
      expect(c.belly).toBe(C.sunYellow);
      expect(c.tip).toBe(C.sunYellow);
      expect(c.outline).toBe(C.white);
      // A jewel may be the second colour too.
      expect(variantColors(CHILD_NEUTRAL, 'gold', false, name).belly).toBe(j.body);
    }
  });

  it('keeps the stone through every stage, whatever the band', () => {
    for (const name of JEWEL_EGG_COLORS) {
      const j = JEWEL_COLORS[name]!;
      const looks = [
        variantColors(CHILD_NEUTRAL, name, true),
        variantColors(adultColors('sun', 'fly'), name, false, null, 'sun'),
        variantColors(adultColors('moon', 'power'), name, false, null, 'moon'),
        variantColors(eternalColors('neutral'), name),
      ];
      for (const c of looks) {
        expect(c.body).toBe(j.body);
        expect(c.belly).toBe(j.belly);
        expect(c.tip).toBe(j.tip);
      }
    }
  });

  it('draws the egg as a cut gem and the Nubbin with a gem finish', () => {
    // A jewel egg is not just the plain egg recoloured: its glints and cut lines sit elsewhere.
    const white = (pc: { data: ArrayLike<number> }) =>
      Array.from(pc.data, (v) => (v === C.white + 1 ? 1 : 0)).join('');
    expect(white(drawEgg('idle', 'ruby'))).not.toBe(white(drawEgg('idle', 'rose')));
    const colours = variantColors(CHILD_NEUTRAL, 'sapphire');
    const plain = drawChao('front', poseFor('idle', 0), lookOf(colours));
    const gem = drawChao('front', poseFor('idle', 0), { ...lookOf(colours), gem: true });
    expect(Array.from(gem.data)).not.toEqual(Array.from(plain.data));
  });
});
