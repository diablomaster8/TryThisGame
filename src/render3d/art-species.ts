import * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import { color } from '../render/sprites/palette';
import { V, type Prim } from '../samples/sculpted';
import type { Mark, PartSpec, SpeciesSpec } from '../samples/species';
import { kitLayout, patchKitSpec } from './art-kit-digi';

/**
 * The pocket and digital lines in 3D. The pixel view draws them with a generic creature
 * drawer from a small recipe (`render/sprites/species-art.ts`: a body plan, ears, tail,
 * crest, wings, arms, legs, eyes, marks and a palette); this file reads the same recipe
 * and sculpts a figure in the species format, so every species in the sim has a 3D body
 * without a hand-made spec. Proportions follow the pixel drawer: babies small and round,
 * final forms tall. A hand-made spec can replace any of these later, by look key.
 */

export interface Layout {
  body: { y: number; r: THREE.Vector3 };
  head: { y: number; z: number; r: THREE.Vector3 };
  hipY: number;
  legLen: number;
}

/** Body and head placement per plan, in the format's units (a Nubbin stands about 3.1). */
function layout(plan: CreatureSpec['plan']): Layout {
  const kit = kitLayout(plan);
  if (kit) return kit;
  switch (plan) {
    case 'round':
      return {
        body: { y: 0.62, r: V(0.62, 0.55, 0.56) },
        head: { y: 1.55, z: 0.05, r: V(0.95, 0.86, 0.88) },
        hipY: 0.6,
        legLen: 0.3,
      };
    case 'tall':
      return {
        body: { y: 1.1, r: V(0.62, 0.9, 0.56) },
        head: { y: 2.45, z: 0.05, r: V(0.64, 0.6, 0.6) },
        hipY: 1.0,
        legLen: 0.7,
      };
    case 'shell':
      return {
        body: { y: 0.66, r: V(0.86, 0.58, 0.8) },
        head: { y: 1.45, z: 0.45, r: V(0.6, 0.56, 0.56) },
        hipY: 0.62,
        legLen: 0.32,
      };
    case 'serpent':
      return {
        body: { y: 0.42, r: V(0.62, 0.38, 0.9) },
        head: { y: 1.75, z: 0.35, r: V(0.6, 0.55, 0.62) },
        hipY: 0.42,
        legLen: 0,
      };
    case 'slug':
      return {
        body: { y: 0.42, r: V(0.72, 0.42, 1.0) },
        head: { y: 1.15, z: 0.5, r: V(0.58, 0.52, 0.55) },
        hipY: 0.42,
        legLen: 0,
      };
    case 'stalk':
      return {
        body: { y: 0.75, r: V(0.32, 0.72, 0.32) },
        head: { y: 2.0, z: 0, r: V(0.74, 0.68, 0.7) },
        hipY: 0.7,
        legLen: 0.25,
      };
    default:
      return {
        body: { y: 0.78, r: V(0.66, 0.68, 0.6) },
        head: { y: 1.98, z: 0.02, r: V(0.74, 0.68, 0.7) },
        hipY: 0.74,
        legLen: 0.4,
      };
  }
}

const sphere = (a: THREE.Vector3, r: number, c: string, tag?: string): Prim => ({
  kind: 'sphere',
  a,
  r,
  color: c,
  ...(tag ? { tag } : {}),
});
const ell = (a: THREE.Vector3, radii: THREE.Vector3, c: string, tag?: string): Prim => ({
  kind: 'ellipsoid',
  a,
  radii,
  r: 0,
  color: c,
  ...(tag ? { tag } : {}),
});
const cap = (a: THREE.Vector3, b: THREE.Vector3, r: number, c: string, tag?: string): Prim => ({
  kind: 'capsule',
  a,
  b,
  r,
  color: c,
  ...(tag ? { tag } : {}),
});
const cone = (
  a: THREE.Vector3,
  b: THREE.Vector3,
  r: number,
  r2: number,
  c: string,
  blend = 0.1,
): Prim => ({ kind: 'cone', a, b, r, r2, color: c, blend });

/** A box around prims, padded for the blend. */
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

/** Mirror a prim list across x (for the right-hand copy of a left part). */
const mirror = (ps: Prim[]): Prim[] =>
  ps.map((p) => ({
    ...p,
    a: V(-p.a.x, p.a.y, p.a.z),
    ...(p.b ? { b: V(-p.b.x, p.b.y, p.b.z) } : {}),
    ...(p.radii ? { radii: p.radii.clone() } : {}),
  }));

function part(name: string, pivot: THREE.Vector3, prims: Prim[], res = 56): PartSpec {
  return { name, pivot, prims, box: boxOf(prims), resolution: res };
}

/** Head-top features: ears and the crest, sculpted into the head so they move with it. */
function headFeatures(
  art: CreatureSpec,
  L: Layout,
  c: Record<string, string>,
): { prims: Prim[]; top: number } {
  const h = L.head;
  const top = h.y + h.r.y;
  const out: Prim[] = [];
  const side = (fn: (s: number) => Prim[]) => out.push(...fn(-1), ...fn(1));
  const ex = h.r.x * 0.62;
  switch (art.ears) {
    case 'tallPointed':
      side((s) => [
        cone(
          V(s * ex, top - 0.2, h.z),
          V(s * (ex + 0.35), top + 0.75, h.z - 0.05),
          0.24,
          0.04,
          c.body!,
        ),
        sphere(V(s * (ex + 0.33), top + 0.68, h.z - 0.05), 0.07, c.outline!),
      ]);
      break;
    case 'round':
    case 'roundBig': {
      const r = art.ears === 'roundBig' ? 0.36 : 0.24;
      side((s) => [ell(V(s * ex, top - 0.05, h.z - 0.05), V(r, r, r * 0.45), c.body!)]);
      break;
    }
    case 'prongs':
      side((s) => [
        cone(
          V(s * ex * 0.7, top - 0.1, h.z),
          V(s * (ex + 0.25), top + 0.45, h.z),
          0.1,
          0.04,
          c.accent!,
        ),
      ]);
      break;
    case 'horns':
      side((s) => [
        cone(
          V(s * ex * 0.8, top - 0.12, h.z),
          V(s * (ex + 0.4), top + 0.32, h.z - 0.1),
          0.14,
          0.03,
          c.accent2!,
        ),
      ]);
      break;
    case 'fins':
      side((s) => [
        ell(V(s * (h.r.x + 0.05), h.y + 0.05, h.z - 0.1), V(0.08, 0.34, 0.3), c.accent!),
      ]);
      break;
    case 'catTips':
      side((s) => [
        cone(V(s * ex, top - 0.18, h.z), V(s * (ex + 0.12), top + 0.3, h.z), 0.2, 0.04, c.body!),
      ]);
      break;
    case 'stubs':
      side((s) => [sphere(V(s * ex, top - 0.08, h.z), 0.16, c.body!)]);
      break;
    default:
      break;
  }
  const z = h.z;
  switch (art.crest) {
    case 'horn':
      out.push(
        cone(
          V(0, top - 0.15, z + h.r.z * 0.35),
          V(0, top + 0.5, z + h.r.z * 0.45),
          0.16,
          0.03,
          c.accent2!,
        ),
      );
      break;
    case 'twinHorns':
      side((s) => [
        cone(
          V(s * 0.22, top - 0.12, z + 0.2),
          V(s * 0.3, top + 0.42, z + 0.25),
          0.12,
          0.03,
          c.accent2!,
        ),
      ]);
      break;
    case 'helmet':
    case 'dome':
    case 'shellTop':
      out.push(
        ell(
          V(0, h.y + h.r.y * 0.35, z - 0.02),
          h.r
            .clone()
            .multiplyScalar(1.06)
            .setY(h.r.y * 0.75),
          c.accent!,
        ),
      );
      break;
    case 'flame':
      out.push(
        {
          ...cone(V(0, top - 0.2, z), V(0, top + 0.55, z - 0.1), 0.26, 0.03, c.accent!),
          glow: 0.8,
        },
        {
          ...cone(V(0.15, top - 0.2, z), V(0.25, top + 0.3, z - 0.1), 0.16, 0.03, c.accent2!),
          glow: 0.8,
        },
      );
      break;
    case 'hair':
      for (let i = -2; i <= 2; i++)
        out.push(
          sphere(V(i * 0.16, top - 0.02 + (2 - Math.abs(i)) * 0.06, z - 0.05), 0.2, c.accent!),
        );
      break;
    case 'forelock':
      out.push(
        cap(V(0, top - 0.05, z + 0.2), V(0.1, top - 0.25, z + h.r.z * 0.85), 0.13, c.accent!),
      );
      break;
    case 'spikesTop':
      for (let i = -1; i <= 1; i++)
        out.push(
          cone(
            V(i * 0.28, top - 0.18, z - 0.05),
            V(i * 0.42, top + 0.4 - Math.abs(i) * 0.12, z - 0.15),
            0.16,
            0.03,
            c.body!,
          ),
        );
      break;
    case 'petals':
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        out.push(
          ell(
            V(Math.cos(a) * 0.4, top + 0.02, z + Math.sin(a) * 0.4),
            V(0.26, 0.07, 0.26),
            c.accent!,
          ),
        );
      }
      break;
    case 'bow':
      side((s) => [ell(V(s * 0.24, top - 0.02, z + 0.1), V(0.22, 0.14, 0.08), c.accent!)]);
      break;
    case 'antenna':
      out.push(
        cap(V(0, top - 0.1, z), V(0.1, top + 0.45, z), 0.04, c.outline!),
        sphere(V(0.1, top + 0.5, z), 0.1, c.accent!),
      );
      break;
    default:
      break;
  }
  return { prims: out, top };
}

function arms(art: CreatureSpec, L: Layout, c: Record<string, string>): PartSpec[] {
  if (art.arms === 'none') return [];
  const b = L.body;
  const sx = b.r.x * 0.88;
  const sy = b.y + b.r.y * 0.35;
  const long = art.arms === 'long' || art.arms === 'tentacles';
  const reach = long ? 0.75 : 0.42;
  const armColor = art.arms === 'metal' ? '#9aa4b8' : c.body!;
  const hand = V(-(sx + reach * 0.55), sy - reach, 0.18);
  const prims: Prim[] = [
    cap(V(-sx, sy, 0.08), hand, art.arms === 'tentacles' ? 0.1 : 0.14, armColor, 'arm'),
  ];
  if (art.arms === 'boxing')
    prims.push(sphere(hand.clone().add(V(0, 0, 0.05)), 0.27, c.accent!, 'hand'));
  else if (art.arms === 'claws')
    for (let i = -1; i <= 1; i++)
      prims.push(cone(hand, hand.clone().add(V(i * 0.1, -0.2, 0.18)), 0.07, 0.015, c.belly!, 0.05));
  else prims.push(sphere(hand, art.arms === 'tentacles' ? 0.11 : 0.17, armColor, 'hand'));
  return [part('armL', V(-sx, sy, 0.08), prims), part('armR', V(sx, sy, 0.08), mirror(prims))];
}

function legs(art: CreatureSpec, L: Layout, c: Record<string, string>): PartSpec[] {
  if (art.legs === 'none' || L.legLen === 0) return [];
  const b = L.body;
  const x = b.r.x * 0.5;
  const top = b.y - b.r.y * 0.45;
  const len = art.legs === 'long' ? L.legLen * 1.4 : L.legLen;
  const footY = 0.14;
  const prims: Prim[] = [
    cap(V(-x, Math.max(top, footY + len), 0.06), V(-x, footY + 0.08, 0.12), 0.17, c.body!, 'leg'),
    ell(V(-x, footY, 0.2), V(0.24, 0.14, 0.32), c.shade!, 'foot'),
  ];
  const pivot = V(-x, Math.max(top, footY + len), 0.06);
  return [part('legL', pivot, prims, 48), part('legR', V(x, pivot.y, pivot.z), mirror(prims), 48)];
}

function tail(art: CreatureSpec, L: Layout, c: Record<string, string>): PartSpec[] {
  if (art.tail === 'none') return [];
  const b = L.body;
  const root = V(0, b.y - b.r.y * 0.2, -b.r.z * 0.85);
  const at = (x: number, y: number, z: number) => root.clone().add(V(x, y, z));
  let prims: Prim[];
  switch (art.tail) {
    case 'lightning':
    case 'lightningCurl':
      prims = [
        cap(at(0, 0, 0), at(0, 0.35, -0.3), 0.1, c.body!),
        cap(at(0, 0.35, -0.3), at(0, 0.3, -0.55), 0.13, c.body!),
        cap(at(0, 0.3, -0.55), at(0, 0.85, -0.8), 0.17, c.body!),
        ell(
          at(0, 0.95, -0.85),
          V(0.08, 0.3, 0.26),
          art.tail === 'lightningCurl' ? c.accent! : c.body!,
        ),
      ];
      break;
    case 'curl':
      prims = [
        cap(at(0, 0, 0), at(0, 0.25, -0.4), 0.1, c.body!),
        cap(at(0, 0.25, -0.4), at(0, 0.6, -0.35), 0.1, c.body!),
        sphere(at(0, 0.62, -0.2), 0.12, c.accent!),
      ];
      break;
    case 'ball':
      prims = [
        cap(at(0, 0, 0), at(0, 0.2, -0.3), 0.07, c.body!),
        sphere(at(0, 0.3, -0.42), 0.2, c.accent!),
      ];
      break;
    case 'flame':
      prims = [
        cap(at(0, 0, 0), at(0, 0.3, -0.45), 0.12, c.body!),
        { ...cone(at(0, 0.32, -0.5), at(0, 0.75, -0.55), 0.2, 0.03, c.accent!), glow: 1 },
      ];
      break;
    case 'spiky':
      prims = [
        cap(at(0, 0, 0), at(0, 0.1, -0.55), 0.14, c.body!),
        ...[0.15, 0.32, 0.48].map((k) =>
          cone(at(0, 0.08, -k), at(0, 0.32, -k - 0.08), 0.08, 0.02, c.accent2!, 0.05),
        ),
      ];
      break;
    case 'long':
      prims = [
        cap(at(0, 0, 0), at(0, 0.1, -0.6), 0.14, c.body!),
        cap(at(0, 0.1, -0.6), at(0, 0.35, -0.95), 0.1, c.body!),
      ];
      break;
    case 'club':
      prims = [
        cap(at(0, 0, 0), at(0, 0.05, -0.5), 0.12, c.body!),
        sphere(at(0, 0.1, -0.62), 0.24, c.accent2!),
      ];
      break;
    default:
      prims = [sphere(at(0, 0.05, -0.08), 0.2, c.body!)];
  }
  return [part('tail', root, prims, 56)];
}

function marks(art: CreatureSpec, L: Layout, c: Record<string, string>): Mark[] {
  const h = L.head;
  const b = L.body;
  const out: Mark[] = [];
  for (const m of art.marks) {
    switch (m) {
      case 'cheeks':
        for (const s of [-1, 1])
          out.push({
            kind: 'sphere',
            a: V(s * h.r.x * 0.62, h.y - h.r.y * 0.22, h.z + h.r.z * 0.72),
            r: 0.17,
            color: c.accent!,
            soft: 0.02,
          });
        break;
      case 'belly':
      case 'chest':
        out.push({
          kind: 'ellipsoid',
          a: V(0, b.y + (m === 'chest' ? b.r.y * 0.3 : -b.r.y * 0.05), b.r.z * 0.8),
          radii: V(b.r.x * 0.62, b.r.y * 0.6, 0.3),
          color: c.belly!,
          soft: 0.04,
        });
        break;
      case 'stripes':
        for (let i = 0; i < 3; i++)
          out.push({
            kind: 'capsule',
            a: V(-b.r.x, b.y + 0.3 - i * 0.28, -b.r.z * 0.7),
            b: V(b.r.x, b.y + 0.3 - i * 0.28, -b.r.z * 0.7),
            r: 0.07,
            color: c.accent2!,
            soft: 0,
          });
        break;
      case 'star':
        out.push({
          kind: 'sphere',
          a: V(0, h.y + h.r.y * 0.45, h.z + h.r.z * 0.88),
          r: 0.12,
          color: c.accent2!,
          soft: 0.02,
        });
        break;
      case 'spots':
        for (const [x, y] of [
          [-0.3, 0.2],
          [0.25, 0.35],
          [0.05, -0.1],
          [-0.15, 0.5],
        ] as const)
          out.push({
            kind: 'sphere',
            a: V(x * b.r.x * 2, b.y + y * b.r.y, -b.r.z * 0.8),
            r: 0.12,
            color: c.accent2!,
            soft: 0.02,
          });
        break;
      case 'eyeMask':
        out.push({
          kind: 'ellipsoid',
          a: V(0, h.y + 0.05, h.z + h.r.z * 0.7),
          radii: V(h.r.x * 1.05, 0.17, 0.32),
          color: c.outline!,
          soft: 0.02,
        });
        break;
      case 'zigzag':
        for (let i = 0; i < 3; i++)
          out.push({
            kind: 'capsule',
            a: V(-0.25 + i * 0.25, b.y + (i % 2 ? 0.1 : -0.1), b.r.z * 0.9),
            b: V(i * 0.25, b.y + (i % 2 ? -0.1 : 0.1), b.r.z * 0.9),
            r: 0.05,
            color: c.accent!,
            soft: 0,
          });
        break;
    }
  }
  return out;
}

/** A sculpted species from the pixel drawer's recipe. */
export function artSpec(name: string, art: CreatureSpec): SpeciesSpec {
  const L = layout(art.plan);
  const c: Record<string, string> = {
    body: color(art.colors.body),
    shade: color(art.colors.shade),
    belly: color(art.colors.belly),
    accent: color(art.colors.accent),
    accent2: color(art.colors.accent2),
    eye: color(art.colors.eye),
    outline: color(art.colors.outline),
  };
  const b = L.body;
  const h = L.head;
  const torso: Prim[] = [ell(V(0, b.y, 0), b.r, c.body!, 'belly')];
  if (art.plan === 'shell')
    torso.push(
      ell(
        V(0, b.y + 0.18, -0.12),
        b.r
          .clone()
          .multiplyScalar(1.08)
          .setY(b.r.y * 0.95),
        c.accent!,
        'shell',
      ),
    );
  if (art.plan === 'serpent')
    torso.push(
      cap(V(0, b.y, 0.2), V(0, h.y - h.r.y * 0.6, h.z * 0.6), 0.32, c.body!, 'neck'),
      cap(V(0, 0.32, -0.7), V(0.6, 0.28, -1.1), 0.24, c.body!),
    );
  else if (art.plan === 'stalk')
    torso.push(...[-1, 1].map((s) => ell(V(s * 0.42, 0.12, 0.05), V(0.36, 0.08, 0.2), c.accent!)));
  else torso.push(sphere(V(0, b.y + b.r.y * 0.85, h.z * 0.5), 0.28, c.body!, 'neck'));
  const feature = headFeatures(art, L, c);
  const headPrims: Prim[] = [ell(V(0, h.y, h.z), h.r, c.body!, 'head'), ...feature.prims];
  const pivotY = Math.min(h.y - h.r.y * 0.55, b.y + b.r.y * 0.9);
  const eyeR = art.eyes === 'big' || art.eyes === 'cute' || art.eyes === 'stalk' ? 0.25 : 0.19;
  const wings = art.wings === 'none' ? null : art.wings;
  return patchKitSpec(art, L, c, {
    name,
    scale: 0.78,
    gait: 'biped',
    hipY: L.hipY,
    blend: 0.22,
    surface: {
      detail: 'smooth',
      amount: 0.1,
      bump: 0.15,
      roughness: art.arms === 'metal' ? 0.4 : 0.62,
      sheen: 0.5,
      sheenColor: c.belly!,
    },
    torso: { prims: torso, box: boxOf(torso) },
    head: {
      name: 'head',
      pivot: V(0, pivotY, h.z * 0.5),
      prims: headPrims,
      box: boxOf(headPrims),
      resolution: 80,
    },
    parts: [...arms(art, L, c), ...legs(art, L, c), ...tail(art, L, c)],
    shade: { top: 1.1, bottom: 0.72, yMax: feature.top + 0.3 },
    marks: marks(art, L, c),
    eyes: {
      x: h.r.x * 0.4,
      y: h.y + 0.04,
      z: h.z + h.r.z * 0.9,
      r: eyeR,
      iris: c.eye === '#0d0a1a' ? '#2a2440' : c.eye!,
      lidColor: c.body!,
      yaw: 0,
      lid: art.eyes === 'angry' ? 0.35 : art.eyes === 'closed' ? 0.85 : 0.1,
      irisScale: art.eyes === 'dot' ? 0.95 : 0.8,
      pitch: 0,
      tall: art.eyes === 'cute' ? 1.18 : 1.05,
    },
    mouth: {
      x: 0,
      y: h.y - h.r.y * 0.36,
      z: h.z + h.r.z * 0.95,
      width: 0.18,
      lip: c.outline!,
      teeth: art.eyes === 'angry',
      tongue: '#ff8aa0',
      pitch: 0,
    },
    ...(wings
      ? {
          wings: {
            x: 0.42,
            y: b.y + b.r.y * 0.45,
            z: -b.r.z * 0.85,
            size: wings === 'small' ? 0.8 : 1.15,
            color: wings === 'feather' ? c.belly! : c.accent!,
            shape:
              wings === 'bat'
                ? ('bat' as const)
                : wings === 'feather'
                  ? ('feather' as const)
                  : ('fairy' as const),
          },
        }
      : {}),
    notes: 'Generated from the pixel creature recipe by render3d/art-species.ts.',
  });
}
