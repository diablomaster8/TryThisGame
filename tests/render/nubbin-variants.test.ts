import { describe, expect, it } from 'vitest';
import { ALL_VARIANTS, VARIANT_FAMILIES } from '../../src/samples/nubbin-variant-catalogue';
import {
  CHILD,
  mixHex,
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

  it('applies the type tells', () => {
    const swim = variant(CHILD, 'Swim', { type: 'swim', accent: '#112233' });
    expect(swim.parts.some((p) => p.name === 'earL')).toBe(true);
    const flipper = swim.parts.find((p) => p.name === 'armL')!.prims.find((p) => p.tag === 'hand');
    expect(flipper?.kind).toBe('ellipsoid');
    expect(flipper?.color).toBe('#112233');
    const fly = variant(CHILD, 'Fly', { type: 'fly' });
    expect(fly.wings!.size).toBeCloseTo(1.7);
    const run = variant(CHILD, 'Run', { type: 'run' });
    expect(run.head.prims.filter((p) => p.tag === 'quill').length).toBe(3);
    expect(run.head.prims.some((p) => p.tag === 'crown')).toBe(false);
    const runTouch = variant(CHILD, 'Run touch', { second: 'run' });
    expect(runTouch.head.prims.filter((p) => p.tag === 'quill').length).toBe(2);
    expect(runTouch.head.prims.some((p) => p.tag === 'crown')).toBe(true);
    const power = variant(CHILD, 'Power', { type: 'power' });
    expect(power.torso.prims[0]!.radii!.x).toBeGreaterThan(CHILD.torso.prims[0]!.radii!.x);
    expect(power.head.prims.filter((p) => p.tag === 'horn').length).toBe(2);
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mixHex('#ff0000', '#0000ff', 1)).toBe('#0000ff');
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

describe('nubbin variant geometry', () => {
  it('keeps every variant finite and within reach of the body', () => {
    const bad: string[] = [];
    const check = (id: string, where: string, v: { x: number; y: number; z: number }) => {
      for (const c of [v.x, v.y, v.z])
        if (!Number.isFinite(c) || Math.abs(c) > 6) bad.push(`${id} ${where} ${v.x},${v.y},${v.z}`);
    };
    for (const v of ALL_VARIANTS) {
      const parts = [v.spec.torso, v.spec.head, ...v.spec.parts];
      for (const part of parts) {
        check(v.id, 'box0', part.box[0]);
        check(v.id, 'box1', part.box[1]);
        for (const axis of ['x', 'y', 'z'] as const)
          if (part.box[0][axis] >= part.box[1][axis]) bad.push(`${v.id} box order ${axis}`);
        for (const p of part.prims) {
          check(v.id, p.tag ?? p.kind, p.a);
          if (p.b) check(v.id, p.tag ?? p.kind, p.b);
          if (p.radii) check(v.id, `${p.tag ?? p.kind} radii`, p.radii);
          if (!Number.isFinite(p.r) || p.r > 3) bad.push(`${v.id} r ${p.r}`);
        }
      }
      if (v.spec.wings && !(v.spec.wings.size > 0 && v.spec.wings.size < 5))
        bad.push(`${v.id} wings ${v.spec.wings.size}`);
    }
    expect(bad).toEqual([]);
  });
});
