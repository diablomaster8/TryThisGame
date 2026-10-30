import type * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import { BIRD_RIBBON, birdOf } from '../render/sprites/creature-bird';
import { V, type Prim } from '../samples/sculpted';
import type { PartSpec, SpeciesSpec } from '../samples/species';
import type { Layout } from './art-species';

/**
 * The bird plan in 3D (LOOK-39), from the same recipe as `render/sprites/creature-bird.ts`:
 * an upright egg body, a small head on a long neck, thin legs with three toes, a wing span
 * about 2.5 times the body, and the tail streamers: a long ribbon, a spiky fan, or a fan of
 * glowing flame cones. The fire bird's wings also carry a flame fan along their tops.
 */
export function birdLayout(art: CreatureSpec): Layout | null {
  if (art.plan !== 'bird') return null;
  return {
    body: { y: 1.15, r: V(0.5, 0.62, 0.56) },
    head: { y: 2.55, z: 0.42, r: V(0.42, 0.4, 0.44) },
    hipY: 1.05,
    legLen: 0.6,
  };
}

const ell = (a: THREE.Vector3, radii: THREE.Vector3, c: string): Prim => ({
  kind: 'ellipsoid',
  a,
  radii,
  r: 0,
  color: c,
});
const cap = (a: THREE.Vector3, b: THREE.Vector3, r: number, c: string): Prim => ({
  kind: 'capsule',
  a,
  b,
  r,
  color: c,
});
const cone = (
  a: THREE.Vector3,
  b: THREE.Vector3,
  r: number,
  r2: number,
  c: string,
  glow = 0,
): Prim => ({ kind: 'cone', a, b, r, r2, color: c, blend: 0.06, ...(glow ? { glow } : {}) });

const FLAME_CORE = '#ffe27a';

/** Swap the generic legs and tail for the bird's, add the neck and the big raised wings. */
export function birdPatch(
  art: CreatureSpec,
  L: Layout,
  c: Record<string, string>,
  spec: SpeciesSpec,
  boxOf: (p: Prim[]) => [THREE.Vector3, THREE.Vector3],
): SpeciesSpec {
  if (art.plan !== 'bird') return spec;
  const o = birdOf(art);
  const b = L.body;
  const h = L.head;
  const part = (name: string, pivot: THREE.Vector3, prims: Prim[]): PartSpec => ({
    name,
    pivot,
    prims,
    box: boxOf(prims),
    resolution: 48,
  });
  const torso = [
    ...spec.torso.prims,
    // The long neck, leaning forward to the small head.
    cap(V(0, b.y + b.r.y * 0.55, 0.12), V(0, h.y - h.r.y * 0.6, h.z * 0.85), 0.2, c.body!),
    // A pale breast.
    ell(V(0, b.y + 0.05, b.r.z * 0.55), V(b.r.x * 0.75, b.r.y * 0.7, 0.2), c.belly!),
  ];
  // Thin legs with three forward toes and a back one.
  const legs = [-1, 1].map((sx) => {
    const top = V(sx * 0.24, b.y - b.r.y * 0.6, 0.05);
    const foot = V(sx * 0.26, 0.08, 0.1);
    const prims: Prim[] = [
      cap(top, V(sx * 0.25, b.y - b.r.y * 0.9, 0.05), 0.13, c.body!),
      cap(V(sx * 0.25, b.y - b.r.y * 0.9, 0.05), foot, 0.055, c.shade!),
      ...[-0.5, 0, 0.5].map((k) =>
        cap(foot, foot.clone().add(V(k * 0.16, -0.03, 0.24)), 0.04, c.shade!),
      ),
      cap(foot, foot.clone().add(V(0, -0.03, -0.14)), 0.035, c.shade!),
    ];
    return part(sx < 0 ? 'legL' : 'legR', top, prims);
  });
  const root = V(0, b.y - b.r.y * 0.35, -b.r.z * 0.8);
  const at = (x: number, y: number, z: number) => root.clone().add(V(x, y, z));
  let tail: Prim[];
  if (o.tail === 'ribbon') {
    // Twice the body's height: back and down to the ground in flat waves.
    const len = b.r.y * 2 * BIRD_RIBBON;
    const pts = [
      at(0, 0, 0),
      at(0.05, -0.3, -len * 0.22),
      at(-0.1, -0.65, -len * 0.42),
      at(0.12, -0.85, -len * 0.62),
      at(-0.05, -0.9, -len * 0.8),
    ];
    tail = pts
      .slice(1)
      .map((p, i) =>
        ell(
          p.clone().lerp(pts[i]!, 0.5),
          V(0.2 - i * 0.02, 0.05, len * 0.13),
          i % 2 ? c.accent2! : c.body!,
        ),
      );
  } else {
    const flame = o.tail === 'flame';
    tail = [-0.45, 0, 0.45].flatMap((k) => {
      const tip = at(k * 0.8, 0.45 - Math.abs(k) * 0.4, -1.05);
      const out = [
        cone(
          at(k * 0.1, 0, -0.05),
          tip,
          flame ? 0.22 : 0.14,
          0.02,
          flame ? c.accent! : c.body!,
          flame ? 1 : 0,
        ),
      ];
      if (flame)
        out.push(cone(at(k * 0.1, 0, -0.1), at(k * 0.5, 0.25, -0.7), 0.12, 0.02, FLAME_CORE, 1));
      return out;
    });
  }
  // The fire bird's wings: a fan of flame cones along each wing top (they stay still while
  // the rig's wing beats under them, which reads as fire, not feathers).
  if (o.wing === 'flame')
    for (const sx of [-1, 1])
      for (let k = 0; k < 4; k++) {
        const base = V(sx * (0.35 + k * 0.28), b.y + b.r.y * 0.5 + k * 0.12, -b.r.z * 0.7);
        const tip = base.clone().add(V(sx * 0.25, 0.55 - k * 0.05, -0.15));
        torso.push(cone(base, tip, 0.14, 0.02, k % 2 ? c.accent! : FLAME_CORE, 1));
      }
  // Zapdos's jagged feathers: a ruff of spikes round the neck base.
  if (o.wing === 'jagged')
    for (let k = 0; k < 6; k++) {
      const th = (k / 6) * Math.PI * 2;
      const base = V(Math.cos(th) * 0.25, b.y + b.r.y * 0.75, Math.sin(th) * 0.25);
      torso.push(
        cone(
          base,
          base.clone().add(V(Math.cos(th) * 0.35, 0.12, Math.sin(th) * 0.35)),
          0.09,
          0.01,
          c.body!,
        ),
      );
    }
  const parts = [
    ...spec.parts.filter((p) => !p.name.startsWith('leg') && p.name !== 'tail'),
    ...legs,
    part('tail', root, tail),
  ];
  return {
    ...spec,
    torso: { prims: torso, box: boxOf(torso) },
    parts,
    ...(spec.wings
      ? {
          wings: {
            ...spec.wings,
            // Span about 2.5× the body, held raised; the ice bird's are pale feathers.
            size: 1.75,
            raise: 0.3,
            y: b.y + b.r.y * 0.55,
            color: o.wing === 'flame' ? c.accent! : o.wing === 'jagged' ? c.shade! : c.belly!,
          },
        }
      : {}),
  };
}
