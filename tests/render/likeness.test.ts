import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { sdf, type Prim } from '../../src/samples/sculpted';
import { ALL_VARIANTS } from '../../src/samples/nubbin-variant-catalogue';
import { CHILD, NEUTRAL_ADULT, paletteOf } from '../../src/samples/nubbin-variants';
import { CHILD_PART_SCALE, withCritterParts } from '../../src/samples/nubbin-critter-parts';
import type { SpeciesSpec } from '../../src/samples/species';
import {
  CHARACTER_LOOKS,
  CHILD_NEUTRAL,
  drawChao,
  lookOf,
  poseFor,
} from '../../src/render/sprites/chao';
import { C, color } from '../../src/render/sprites/palette';
import { LINEUP_LOOKS } from '../../src/samples/nubbin-variants-lineup';
import { NUBBIN_SPEC } from '../../src/samples/species-data';

/**
 * Likeness checks on the Chao-line 3D specs (LOOK-67): small data tests that catch the
 * regressions found by eye before, such as the crown shade painting over the yellow tip.
 */

/** Points on a tip prim's surface that the rest of the head does not cover. */
function exposedTipPoints(spec: SpeciesSpec, tip: Prim): THREE.Vector3[] {
  const others = spec.head.prims.filter((p) => p !== tip);
  const rx = tip.radii?.x ?? tip.r;
  const ry = tip.radii?.y ?? tip.r;
  const rz = tip.radii?.z ?? tip.r;
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < 12; i++)
    for (let j = 0; j < 24; j++) {
      const th = ((i + 0.5) / 12) * Math.PI;
      const ph = (j / 24) * Math.PI * 2;
      const p = new THREE.Vector3(
        tip.a.x + rx * Math.sin(th) * Math.cos(ph),
        tip.a.y + ry * Math.cos(th),
        tip.a.z + rz * Math.sin(th) * Math.sin(ph),
      );
      if (others.every((o) => sdf(p, o) > 0.02)) out.push(p);
    }
  return out;
}

describe('Chao likeness (3D specs)', () => {
  const chao = ALL_VARIANTS.filter((v) => v.spec.head.prims.some((p) => p.tag === 'tip'));

  it('has Chao variants to check', () => {
    expect(chao.length).toBeGreaterThan(20);
  });

  it('paints every tip in its band tip colour and never under a mark', () => {
    const bad: string[] = [];
    for (const v of chao) {
      const tip = paletteOf(v.spec).tip;
      for (const t of v.spec.head.prims.filter((p) => p.tag === 'tip')) {
        // The children and templates wear the band's tip; adults take the type hue there.
        if (v.family === 'child' && t.color !== tip)
          bad.push(`${v.id}: tip ${t.color}, band tip ${tip}`);
        const pts = exposedTipPoints(v.spec, t);
        if (pts.length === 0) bad.push(`${v.id}: tip hidden inside the head`);
        for (const m of v.spec.marks) {
          const soft = m.soft ?? 0.06;
          const mark = { ...m, r: m.r ?? 0, tag: 'mark' } as Prim;
          const worst = Math.min(...pts.map((p) => sdf(p, mark)));
          if (worst < soft) bad.push(`${v.id}: mark ${m.color} reaches the tip`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('Chao likeness (pixel)', () => {
  it('rocks the head a pixel on the walk contact frames (the waddle)', () => {
    expect(poseFor('walk', 0).rock).toBe(1);
    expect(poseFor('walk', 3).rock).toBe(-1);
    expect(poseFor('walk', 1).rock ?? 0).toBe(0);
    const look = lookOf(CHILD_NEUTRAL);
    const a = drawChao('front', { ...poseFor('walk', 0), rock: 0 }, look);
    const b = drawChao('front', poseFor('walk', 0), look);
    let diff = 0;
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) if (a.get(x, y) !== b.get(x, y)) diff++;
    expect(diff).toBeGreaterThan(4);
  });

  it('wears no belly patch or cheek blush at rest, and blushes when loved', () => {
    const look = lookOf(CHILD_NEUTRAL);
    const count = (c: number, pose: string) => {
      const pc = drawChao('front', poseFor(pose as 'idle', 0), look);
      let n = 0;
      for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (pc.get(x, y) === c) n++;
      return n;
    };
    expect(count(C.roseLight, 'idle')).toBe(0);
    expect(count(C.roseLight, 'love')).toBeGreaterThan(0);
    const two = drawChao(
      'front',
      poseFor('idle', 0),
      lookOf({ ...CHILD_NEUTRAL, bellyPatch: C.white }),
    );
    const plain = drawChao('front', poseFor('idle', 0), look);
    let patch = 0;
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) if (two.get(x, y) !== plain.get(x, y)) patch++;
    expect(patch).toBeGreaterThan(10);
  });
});

describe('child critter parts (LOOK-66)', () => {
  it('draws the same part smaller on a child than on its adult form', () => {
    const parts = { ears: 'rabbit-ears', tail: null, arms: null, back: null };
    const ink = (pc: { get(x: number, y: number): number }) => {
      let n = 0;
      for (let y = 0; y < 14; y++) for (let x = 0; x < 32; x++) if (pc.get(x, y) === C.pale) n++;
      return n;
    };
    const child = drawChao('front', poseFor('idle', 0), lookOf(CHILD_NEUTRAL, null, null, parts));
    const adult = drawChao(
      'front',
      poseFor('idle', 0),
      lookOf(CHILD_NEUTRAL, 'normal', null, parts),
    );
    expect(ink(child)).toBeLessThan(ink(adult));
  });

  it('shrinks a child spec’s sculpted parts about their pivots', () => {
    const child = withCritterParts(CHILD, { ears: 'rabbit-ears' });
    const adult = withCritterParts(NEUTRAL_ADULT, { ears: 'rabbit-ears' });
    const size = (s: SpeciesSpec) =>
      s.parts.filter((p) => p.name.startsWith('ear')).flatMap((p) => p.prims)[0]!;
    const r = (q: Prim) => q.radii?.x ?? q.r;
    expect(r(size(child)) / r(size(adult))).toBeCloseTo(CHILD_PART_SCALE);
  });
});

describe('likeness suite (LOOK-67)', () => {
  it('keeps the Chao head 1.25-1.45x the body width', () => {
    // Power forms widen the body on purpose (their tell), so they are left out.
    for (const v of ALL_VARIANTS.filter((x) => x.family !== 'special' && !x.id.includes('power'))) {
      const head = v.spec.head.prims.find((p) => p.tag === 'head');
      const body = v.spec.torso.prims.find((p) => p.tag === 'belly');
      if (!head?.radii || !body?.radii) continue;
      const k = head.radii.x / body.radii.x;
      expect(k, v.id).toBeGreaterThanOrEqual(1.25);
      expect(k, v.id).toBeLessThanOrEqual(1.45);
    }
  });

  it('gives the child the same wing and tip colour in pixel and 3D', () => {
    // CIE76 colour difference in Lab (D65).
    const lab = (hex: string) => {
      const c = new THREE.Color(hex); // linear RGB
      const x = (c.r * 0.4124 + c.g * 0.3576 + c.b * 0.1805) / 0.95047;
      const y = c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
      const z = (c.r * 0.0193 + c.g * 0.1192 + c.b * 0.9505) / 1.08883;
      const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
      return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))] as const;
    };
    const dE = (a: string, b: string) => {
      const p = lab(a);
      const q = lab(b);
      return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    };
    expect(dE(color(CHILD_NEUTRAL.wing), NUBBIN_SPEC.wings!.color)).toBeLessThanOrEqual(8);
    const tip = NUBBIN_SPEC.head.prims.find((p) => p.tag === 'tip')!.color;
    expect(dE(color(CHILD_NEUTRAL.tip), tip)).toBeLessThanOrEqual(8);
  });

  it('has every character look in both modes', () => {
    const pixel = Object.keys(CHARACTER_LOOKS).sort();
    const sculpted = LINEUP_LOOKS.map((v) => v.id).sort();
    expect(pixel).toEqual(sculpted);
  });
});
