import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { sdf, type Prim } from '../../src/samples/sculpted';
import { ALL_VARIANTS } from '../../src/samples/nubbin-variant-catalogue';
import { paletteOf } from '../../src/samples/nubbin-variants';
import type { SpeciesSpec } from '../../src/samples/species';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from '../../src/render/sprites/chao';
import { C } from '../../src/render/sprites/palette';

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
