import type * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import { C, color } from '../render/sprites/palette';
import { QUAD_BABY_SIZE, quadOf } from '../render/sprites/creature-kit-digi';
import { V, type Prim } from '../samples/sculpted';
import type { PartSpec, SpeciesSpec } from '../samples/species';
import type { Layout } from './art-species';
import { DINO_LEAN_DEG } from '../config/tuning-look-r10e';

/**
 * The 3D side of the digital-line kit (render/sprites/creature-kit-digi.ts): layouts for
 * the four-legged and fish plans, and the extras (beak, sunglasses, tusks, mane, pincers,
 * drill nose, propeller, single eye, extra heads) sculpted onto the recipe's figure.
 * art-species.ts asks `kitLayout` first and hands its finished spec to `patchKitSpec`.
 */

export function kitLayout(art: CreatureSpec): Layout | null {
  const plan = art.plan;
  if (plan === 'quad') {
    // The stance sets the legs, neck and body width (LOOK-06); a dog is the old layout.
    const q = quadOf(art);
    const legs = q.legLen;
    const by = q.stance === 'seal' ? 0.5 : 0.35 + legs;
    const wide = q.stance === 'toad' ? 1.25 : q.stance === 'seal' ? 1.15 : 1;
    const baby = art.size < QUAD_BABY_SIZE ? 1.3 : 1;
    return {
      body: { y: by, r: V(0.6 * wide, 0.5, 0.95) },
      head: {
        y: by + 0.85 + q.neck * 0.9 + (q.stance === 'sit' ? 0.3 : 0),
        z: 0.95 + q.neck * 0.35,
        r: V(0.58, 0.54, 0.58).multiplyScalar(baby),
      },
      hipY: by,
      legLen: legs,
    };
  }
  if (plan === 'fish')
    return {
      body: { y: 0.9, r: V(0.85, 0.72, 1.25) },
      head: { y: 1.15, z: 0.55, r: V(0.74, 0.62, 0.74) },
      hipY: 0.9,
      legLen: 0,
    };
  return null;
}

const sphere = (a: THREE.Vector3, r: number, c: string): Prim => ({
  kind: 'sphere',
  a,
  r,
  color: c,
});
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
const cone = (a: THREE.Vector3, b: THREE.Vector3, r: number, r2: number, c: string): Prim => ({
  kind: 'cone',
  a,
  b,
  r,
  r2,
  color: c,
  blend: 0.06,
});

function boxOf(prims: Prim[], pad = 0.3): [THREE.Vector3, THREE.Vector3] {
  const min = V(Infinity, Infinity, Infinity);
  const max = V(-Infinity, -Infinity, -Infinity);
  const grow = (p: THREE.Vector3, r: THREE.Vector3) => {
    min.min(p.clone().sub(r));
    max.max(p.clone().add(r));
  };
  for (const q of prims) {
    const rr = Math.max(q.r, q.r2 ?? 0);
    if (q.kind === 'ellipsoid') grow(q.a, q.radii!);
    else if (q.kind === 'torus') grow(q.a, V(q.r + rr, rr, q.r + rr));
    else {
      grow(q.a, V(rr, rr, rr));
      if (q.b) grow(q.b, V(rr, rr, rr));
    }
  }
  return [min.subScalar(pad), max.addScalar(pad)];
}

const part = (name: string, pivot: THREE.Vector3, prims: Prim[], res = 48): PartSpec => ({
  name,
  pivot,
  prims,
  box: boxOf(prims),
  resolution: res,
});

/** Add the kit plan's legs or flukes and the recipe's extras to a generated spec. */
export function patchKitSpec(
  art: CreatureSpec,
  L: Layout,
  c: Record<string, string>,
  spec: SpeciesSpec,
): SpeciesSpec {
  const extras = art.extras ?? [];
  if (art.plan !== 'quad' && art.plan !== 'fish' && extras.length === 0) return spec;
  const b = L.body;
  const h = L.head;
  const top = h.y + h.r.y;
  const fz = h.z + h.r.z;
  const head: Prim[] = [...spec.head.prims];
  const torso: Prim[] = [...spec.torso.prims];
  const parts: PartSpec[] = [...spec.parts];
  let gait = spec.gait;
  let eyes = spec.eyes;
  if (art.plan === 'quad') {
    gait = 'quadruped';
    const q = quadOf(art);
    const x = b.r.x * 0.6;
    const zs = b.r.z * 0.55;
    const legTop = b.y - b.r.y * 0.3;
    const legR = q.stance === 'toad' ? 0.22 : q.stance === 'horse' ? 0.14 : 0.17;
    for (const [name, sx, sz] of [
      ['legFL', -1, 1],
      ['legFR', 1, 1],
      ['legBL', -1, -1],
      ['legBR', 1, -1],
    ] as const) {
      const p = V(sx * x, legTop, sz * zs);
      let prims: Prim[];
      if (q.stance === 'seal') {
        // Flippers: wide flat paddles at the chest, a smaller pair at the tail.
        const at = V(sx * (b.r.x + 0.1), 0.1, sz * zs);
        prims = [ell(at, V(sz > 0 ? 0.32 : 0.22, 0.07, sz > 0 ? 0.26 : 0.18), c.shade!)];
      } else if (q.stance === 'sit' && sz < 0) {
        // Seated: the hind legs fold into haunches on the ground.
        prims = [ell(V(sx * (x + 0.1), 0.28, sz * zs), V(0.3, 0.26, 0.4), c.body!)];
      } else
        prims = [
          cap(p, V(sx * x, 0.2, sz * zs + 0.04), legR, c.body!),
          ell(V(sx * x, 0.12, sz * zs + 0.1), V(legR + 0.03, 0.12, legR + 0.09), c.shade!),
        ];
      parts.push(part(name, p, prims));
    }
    // Seated, the chest stands up over the front legs and the rump settles back.
    if (q.stance === 'sit')
      torso.push(
        sphere(V(0, b.y + 0.3, zs * 0.7), b.r.x * 0.9, c.body!),
        sphere(V(0, b.y - 0.15, -zs), b.r.x * 1.05, c.body!),
      );
    // The neck, when the head stands up on one (a horse, Lapras).
    if (q.neck > 0.15)
      torso.push(
        cap(
          V(0, b.y + b.r.y * 0.4, b.r.z * 0.6),
          V(0, h.y - h.r.y * 0.5, h.z - 0.1),
          0.26,
          c.body!,
        ),
      );
    // The muzzle, out in front of the face, with a paler underside.
    if (q.snout > 0) {
      const sz = 0.18 + q.snout * 0.55;
      head.push(
        ell(
          V(0, h.y - h.r.y * 0.3, fz - 0.12 + sz * 0.5),
          V(h.r.x * 0.55, h.r.y * 0.4, sz),
          c.body!,
        ),
        ell(
          V(0, h.y - h.r.y * 0.48, fz - 0.15 + sz * 0.5),
          V(h.r.x * 0.45, h.r.y * 0.22, sz * 0.9),
          c.belly!,
        ),
      );
    }
  }
  if (art.plan === 'fish') {
    const root = V(0, b.y + 0.05, -b.r.z * 0.85);
    parts.push(
      part('tail', root, [
        cap(root, V(0, b.y + 0.3, -b.r.z - 0.45), 0.24, c.body!),
        ell(V(0, b.y + 0.42, -b.r.z - 0.62), V(0.62, 0.08, 0.3), c.shade!),
      ]),
    );
    for (const s of [-1, 1])
      torso.push(ell(V(s * (b.r.x + 0.05), b.y - 0.35, 0.4), V(0.35, 0.07, 0.22), c.shade!));
    torso.push(
      ell(V(0, b.y - b.r.y * 0.35, 0.25), V(b.r.x * 0.82, b.r.y * 0.55, b.r.z * 0.85), c.belly!),
    );
  }
  const cream = color(C.cream);
  for (const x of extras) {
    switch (x) {
      case 'dinoSnout':
        // Greymon's long muzzle (LOOK-08), with a paler jaw.
        head.push(
          ell(V(0, h.y - h.r.y * 0.25, fz + 0.12), V(h.r.x * 0.5, h.r.y * 0.38, 0.42), c.body!),
          ell(V(0, h.y - h.r.y * 0.45, fz + 0.1), V(h.r.x * 0.42, h.r.y * 0.2, 0.38), c.belly!),
        );
        break;
      case 'skullHelmet': {
        // The brown skull cap over the top of the head, two horns curving forward, a nose horn.
        const bark = color(C.bark);
        head.push(
          ell(
            V(0, h.y + h.r.y * 0.6, h.z - 0.02),
            V(h.r.x * 1.08, h.r.y * 0.48, h.r.z * 1.08),
            bark,
          ),
        );
        for (const s of [-1, 1])
          head.push(
            cone(
              V(s * h.r.x * 0.72, h.y + h.r.y * 0.7, h.z - 0.05),
              V(s * h.r.x * 1.1, h.y + h.r.y * 1.45, h.z + 0.3),
              0.14,
              0.03,
              cream,
            ),
          );
        head.push(
          cone(
            V(0, h.y + h.r.y * 0.05, fz + 0.2),
            V(0, h.y + h.r.y * 0.4, fz + 0.38),
            0.1,
            0.02,
            cream,
          ),
        );
        break;
      }
      case 'ribs':
        // SkullGreymon's rib cage: bone hoops round the chest.
        for (let i = 0; i < 3; i++)
          torso.push({
            kind: 'torus',
            a: V(0, b.y + 0.25 - i * 0.25, 0.05),
            r: b.r.x * 1.0,
            r2: 0.06,
            color: color(C.white),
          });
        break;
      case 'beak':
        head.push(
          cone(V(0, h.y - 0.12, fz - 0.15), V(0, h.y - 0.25, fz + 0.38), 0.2, 0.03, c.accent2!),
        );
        break;
      case 'shades':
        for (const s of [-1, 1])
          head.push(ell(V(s * h.r.x * 0.4, h.y + 0.04, fz - 0.08), V(0.25, 0.16, 0.12), '#1a1626'));
        head.push(
          cap(V(-0.2, h.y + 0.08, fz - 0.04), V(0.2, h.y + 0.08, fz - 0.04), 0.05, '#1a1626'),
        );
        break;
      case 'tusks':
        for (const s of [-1, 1])
          head.push(
            cone(
              V(s * 0.24, h.y - h.r.y * 0.45, fz - 0.15),
              V(s * (h.r.x * 0.8), h.y + 0.2, fz + 0.12),
              0.1,
              0.02,
              cream,
            ),
          );
        break;
      case 'mane':
        head.push(ell(V(0, h.y, h.z - 0.18), V(h.r.x * 1.45, h.r.y * 1.4, h.r.z * 0.6), c.accent!));
        break;
      case 'pincers':
        for (const s of [-1, 1])
          head.push(
            cone(
              V(s * 0.22, top - 0.12, h.z + 0.1),
              V(s * 0.75, top + 0.65, h.z + 0.3),
              0.13,
              0.03,
              c.accent!,
            ),
            cone(
              V(s * 0.55, top + 0.3, h.z + 0.22),
              V(s * 0.3, top + 0.42, h.z + 0.3),
              0.06,
              0.02,
              c.accent!,
            ),
          );
        break;
      case 'drill': {
        // On a muzzled quad (Rhyhorn) the horn stands up off the snout, clear of it (LOOK-39).
        const snout = art.plan === 'quad' ? quadOf(art).snout : 0;
        if (snout > 0) {
          const sz = 0.18 + snout * 0.55;
          head.push(
            cone(
              V(0, h.y - h.r.y * 0.05, fz - 0.12 + sz),
              V(0, h.y + h.r.y * 0.55, fz + sz * 1.25),
              0.17,
              0.02,
              c.accent2!,
            ),
          );
        } else
          head.push(
            cone(V(0, h.y - 0.1, fz - 0.2), V(0, h.y - 0.15, fz + 0.55), 0.24, 0.02, c.accent2!),
          );
        break;
      }
      case 'propeller':
        head.push(
          cap(V(0, top - 0.08, h.z), V(0, top + 0.32, h.z), 0.05, c.outline!),
          ell(V(0, top + 0.34, h.z), V(0.75, 0.04, 0.12), c.accent!),
        );
        break;
      case 'sideHeads':
        for (const s of [-1, 1]) {
          const at = V(s * (b.r.x + 0.35), b.y + b.r.y * 0.45, 0.2);
          torso.push(
            cap(V(s * b.r.x * 0.8, b.y + b.r.y * 0.3, 0.05), at, 0.13, c.body!),
            sphere(at, 0.3, s < 0 ? c.accent! : c.accent2!),
            ell(
              at.clone().add(V(0, -0.06, 0.25)),
              V(0.18, 0.13, 0.2),
              s < 0 ? c.accent! : c.accent2!,
            ),
          );
        }
        break;
      case 'monoEye':
        eyes = { ...eyes, x: 0, r: eyes.r * 1.5 };
        break;
    }
  }
  const out: SpeciesSpec = {
    ...spec,
    gait,
    eyes,
    parts,
    torso: { prims: torso, box: boxOf(torso) },
    head: { ...spec.head, prims: head, box: boxOf(head) },
  };
  // The Greymon line (a snout under a skull helmet, or SkullGreymon's ribs) leans; Charizard's
  // snout alone does not.
  const greymon =
    extras.includes('dinoSnout') && (extras.includes('skullHelmet') || extras.includes('ribs'));
  return greymon ? leanForward(out, L, c.body!, DINO_LEAN_DEG) : out;
}

/**
 * LOOK-08 (lane E r10): the Greymon line's forward lean. The sculpt has no rotated forms, so
 * the lean is a shear: everything above the hips moves forward by its height over them times
 * tan(lean), the head, face, arms and wings with it, and a chest form along the leaning line
 * joins the trunk to the head. The legs stay planted and the tail stays behind for balance.
 */
export function leanForward(spec: SpeciesSpec, L: Layout, body: string, deg: number): SpeciesSpec {
  const t = Math.tan((deg * Math.PI) / 180);
  const hip = L.hipY;
  const dz = (y: number) => Math.max(0, y - hip) * t;
  const shear = (p: THREE.Vector3) => p.setZ(p.z + dz(p.y));
  const prim = (q: Prim): Prim => {
    const a = shear(q.a.clone());
    return { ...q, a, ...(q.b ? { b: shear(q.b.clone()) } : {}) };
  };
  const b = L.body;
  const torso = [
    ...spec.torso.prims,
    // The chest along the lean, so the trunk reads as one slanted column.
    ell(V(0, b.y + b.r.y * 0.5, 0.05), V(b.r.x * 0.85, b.r.y * 0.6, b.r.z * 0.9), body),
  ].map(prim);
  const head = spec.head.prims.map(prim);
  const parts = spec.parts.map((p) => {
    if (p.name.startsWith('leg') || p.name.startsWith('tail')) return p;
    const prims = p.prims.map(prim);
    return { ...p, pivot: shear(p.pivot.clone()), prims, box: boxOf(prims) };
  });
  return {
    ...spec,
    torso: { prims: torso, box: boxOf(torso) },
    head: { ...spec.head, pivot: shear(spec.head.pivot.clone()), prims: head, box: boxOf(head) },
    parts,
    eyes: { ...spec.eyes, z: spec.eyes.z + dz(spec.eyes.y) },
    mouth: { ...spec.mouth, z: spec.mouth.z + dz(spec.mouth.y) },
    ...(spec.wings ? { wings: { ...spec.wings, z: spec.wings.z + dz(spec.wings.y) } } : {}),
  };
}
