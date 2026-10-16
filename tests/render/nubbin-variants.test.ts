import { describe, expect, it } from 'vitest';
import { ALL_VARIANTS, VARIANT_FAMILIES } from '../../src/samples/nubbin-variant-catalogue';
import {
  CHILD,
  MOON_ADULT,
  NUBBIN_COLORS,
  paletteOf,
  SUN_ADULT,
  variant,
} from '../../src/samples/nubbin-variants';
import { NUBBIN_SPEC } from '../../src/samples/species-data';

/**
 * The variant helper must never touch the base it derives from, must recolour every
 * primitive by role, and the catalogue must stay unique and complete.
 */
describe('nubbin variants', () => {
  it('derives without mutating the base', () => {
    const bodyBefore = NUBBIN_SPEC.torso.prims[0]!.color;
    const hipBefore = NUBBIN_SPEC.hipY;
    const v = variant(NUBBIN_SPEC, 'Test', { colors: { body: '#123456' }, type: 'run' });
    expect(v.torso.prims[0]!.color).toBe('#123456');
    expect(v.hipY).toBeGreaterThan(hipBefore);
    expect(NUBBIN_SPEC.torso.prims[0]!.color).toBe(bodyBefore);
    expect(NUBBIN_SPEC.hipY).toBe(hipBefore);
    expect(NUBBIN_SPEC.parts.length).toBe(v.parts.length);
  });

  it('recolours every body primitive and remembers the palette', () => {
    const v = variant(CHILD, 'Test', { colors: { body: '#abcdef', tip: '#fedcba' } });
    const colours = new Set<string>();
    for (const part of [v.torso, v.head, ...v.parts])
      for (const p of part.prims) colours.add(p.color);
    expect(colours.has(NUBBIN_COLORS.body)).toBe(false);
    expect(colours.has(NUBBIN_COLORS.tip)).toBe(false);
    expect(colours.has('#abcdef')).toBe(true);
    expect(paletteOf(v).body).toBe('#abcdef');
    // A variant of a variant maps from the derived palette, not the base's.
    const w = variant(v, 'Test 2', { colors: { body: '#000001' } });
    expect(w.torso.prims[0]!.color).toBe('#000001');
    expect(w.eyes.iris).toBe(v.eyes.iris);
  });

  it('gives the Sun and Moon templates their crowns, balls and wings', () => {
    expect(SUN_ADULT.ball?.shape).toBe('halo');
    expect(SUN_ADULT.wings?.shape).toBe('feather');
    expect(MOON_ADULT.ball?.shape).toBe('spikes');
    expect(MOON_ADULT.wings?.shape).toBe('bat');
    const hook = MOON_ADULT.head.prims.filter((p) => p.tag === 'crown');
    expect(hook.length).toBe(2);
  });

  it('applies the type silhouette', () => {
    const swim = variant(CHILD, 'Swim', { type: 'swim' });
    expect(swim.parts.some((p) => p.name === 'earL')).toBe(true);
    const fly = variant(CHILD, 'Fly', { type: 'fly' });
    expect(fly.wings!.size).toBeCloseTo(1.7);
    const power = variant(CHILD, 'Power', { type: 'power' });
    expect(power.torso.prims[0]!.radii!.x).toBeGreaterThan(CHILD.torso.prims[0]!.radii!.x);
    const none = variant(CHILD, 'Gone', { ball: null, wings: null });
    expect(none.ball).toBeUndefined();
    expect(none.wings).toBeUndefined();
  });

  it('lists every family with unique ids', () => {
    expect(VARIANT_FAMILIES.child.length).toBe(3);
    expect(VARIANT_FAMILIES.first.length).toBe(15);
    expect(VARIANT_FAMILIES.second.length).toBe(60);
    expect(VARIANT_FAMILIES.special.length).toBeGreaterThanOrEqual(3);
    expect(VARIANT_FAMILIES.colour.length).toBeGreaterThanOrEqual(21);
    const ids = ALL_VARIANTS.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const v of ALL_VARIANTS) {
      expect(v.id).toMatch(/^[a-z0-9-]+$/);
      expect(v.spec.name.length).toBeGreaterThan(0);
    }
  });
});
