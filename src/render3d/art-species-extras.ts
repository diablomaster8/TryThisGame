import type * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import type { Extra } from '../render/sprites/creature-extras';
import { C, color } from '../render/sprites/palette';
import { V, type Prim } from '../samples/sculpted';

/**
 * The 3D twins of the pixel drawer's extra kit parts (render/sprites/creature-extras.ts):
 * a bulb or a shell on the back, a beak, a bill, a fan of tails, a mushroom cap... Each
 * kind becomes a few SDF primitives, sculpted into the torso (back and body parts) or the
 * head (face and head-top parts, so they turn with it); wings are flat lobes sculpted
 * into the back, so they read from every side. Coordinates follow art-species.ts: +z is the face, +y up, a Nubbin about 3.1.
 * A blend of 0 would divide by zero in `smin`, so the helpers floor it at 0.01.
 */

/** The placement art-species.ts computes per body plan (the parts this file needs). */
export interface ExtrasLayout {
  body: { y: number; r: THREE.Vector3 };
  head: { y: number; z: number; r: THREE.Vector3 };
}

export interface ExtraPrims {
  torso: Prim[];
  head: Prim[];
}

const sphere = (a: THREE.Vector3, r: number, c: string, blend?: number): Prim => ({
  kind: 'sphere',
  a,
  r,
  color: c,
  ...(blend !== undefined ? { blend: Math.max(0.01, blend) } : {}),
});
const ell = (a: THREE.Vector3, radii: THREE.Vector3, c: string, blend?: number): Prim => ({
  kind: 'ellipsoid',
  a,
  radii,
  r: 0,
  color: c,
  ...(blend !== undefined ? { blend: Math.max(0.01, blend) } : {}),
});
const cap = (a: THREE.Vector3, b: THREE.Vector3, r: number, c: string, blend?: number): Prim => ({
  kind: 'capsule',
  a,
  b,
  r,
  color: c,
  ...(blend !== undefined ? { blend: Math.max(0.01, blend) } : {}),
});
const cone = (
  a: THREE.Vector3,
  b: THREE.Vector3,
  r: number,
  r2: number,
  c: string,
  blend = 0.06,
): Prim => ({ kind: 'cone', a, b, r, r2, color: c, blend });

/** Every extra on a recipe as primitives. Empty when the recipe has none. */
export function extraPrims(art: CreatureSpec, L: ExtrasLayout): ExtraPrims {
  const out: ExtraPrims = { torso: [], head: [] };
  for (const e of art.addons ?? []) addExtra(out, art, L, e);
  return out;
}

function addExtra(out: ExtraPrims, art: CreatureSpec, L: ExtrasLayout, e: Extra): void {
  const b = L.body;
  const h = L.head;
  const col = art.colors;
  const c = color(e.c ?? col.accent);
  const c2 = color(e.c2 ?? col.accent2);
  const body = color(col.body);
  const T = out.torso;
  const H = out.head;
  const top = h.y + h.r.y;
  const front = h.z + h.r.z;
  const backZ = -b.r.z;
  const sides = [-1, 1];
  // Where back parts sit: behind the head on a one-piece (round) body, else on the back.
  const m =
    art.plan === 'round'
      ? { y: h.y - h.r.y * 0.3, z: h.z - h.r.z * 0.85, s: h.r.x }
      : { y: b.y + b.r.y * 0.45, z: -b.r.z * 0.9, s: b.r.x };
  switch (e.kind) {
    case 'bulb': {
      // Big and high on the back, at the head's base, so it shows over the shoulders from the
      // game camera's front three-quarter look-down (LOOK-10).
      const r = Math.max(0.5, h.r.x * 1.05);
      const quad = art.plan === 'quad';
      const at = quad
        ? V(0, Math.max(b.y + b.r.y * 0.7 + r * 0.45, h.y - h.r.y * 0.9), -b.r.z * 0.25)
        : V(0, m.y + m.s * 0.35, m.z - m.s * 0.15);
      T.push(sphere(at, quad ? r : Math.max(0.45, m.s * 0.78), c));
      for (const s of sides)
        T.push(
          cap(
            V(s * r * 0.3, at.y - r * 0.55, at.z - r * 0.6),
            V(s * r * 0.3, at.y + r * 0.6, at.z - r * 0.3),
            0.05,
            c2,
            0.03,
          ),
        );
      break;
    }
    case 'bud': {
      const by = m.y + m.s * 0.55;
      T.push(ell(V(0, by, m.z - 0.1), V(0.32, 0.45, 0.32), c));
      T.push(cone(V(0, by + 0.3, m.z - 0.1), V(0, by + 0.8, m.z - 0.1), 0.2, 0.02, c));
      for (const s of sides) {
        T.push(ell(V(s * 0.6, by - 0.25, m.z - 0.05), V(0.55, 0.1, 0.3), c2, 0.05));
        T.push(ell(V(0, by - 0.25, m.z - 0.1 + s * 0.5), V(0.28, 0.1, 0.45), c2, 0.05));
      }
      break;
    }
    case 'bloom': {
      const cy = m.y + m.s * 0.85;
      const cz = m.z - 0.15;
      for (let i = 0; i < 5; i++) {
        const t = (i / 5) * Math.PI * 2 + Math.PI / 2;
        const px = Math.cos(t) * 0.62;
        const pz = cz + Math.sin(t) * 0.55;
        T.push(ell(V(px, cy, pz), V(0.42, 0.17, 0.38), c, 0.05));
        T.push(sphere(V(px * 1.1, cy + 0.15, pz), 0.08, color(C.pale), 0.02));
      }
      T.push(sphere(V(0, cy + 0.08, cz), 0.24, c2, 0.04));
      for (const s of sides)
        T.push(ell(V(s * 1.0, cy - 0.3, cz), V(0.6, 0.09, 0.28), color(C.forest), 0.04));
      break;
    }
    case 'backShell':
      // A full dome on the back, a rim that shows round the sides from the front, and a
      // cream plastron on the belly (LOOK-10).
      T.push(ell(V(0, b.y, backZ * 0.55), V(b.r.x * 1.14, b.r.y * 1.1, b.r.z * 0.8), c));
      T.push(ell(V(0, b.y, -0.05), V(b.r.x * 1.32, b.r.y * 1.08, 0.18), c2, 0.04));
      T.push(
        ell(
          V(0, b.y - b.r.y * 0.05, b.r.z * 0.72),
          V(b.r.x * 0.68, b.r.y * 0.82, 0.22),
          color(C.cream),
          0.03,
        ),
      );
      break;
    case 'cannons':
      // Over the shoulders, beside the head, pointing forward.
      for (const s of sides)
        T.push(
          cap(
            V(s * h.r.x * 0.9, b.y + b.r.y * 0.75, backZ * 0.5),
            V(s * h.r.x * 0.95, b.y + b.r.y * 0.85, b.r.z * 0.45),
            0.14,
            color(C.lilacGrey),
            0.04,
          ),
        );
      break;
    case 'backSpikes':
      for (let i = 0; i < 3; i++) {
        const y = m.y + m.s * (0.6 - i * 0.6);
        for (const s of i === 1 ? [0] : sides) {
          const a = V(s * 0.22, y, m.z);
          T.push(cone(a, V(s * 0.3, y + 0.2, m.z - 0.45), 0.13, 0.01, c));
        }
      }
      break;
    case 'mushrooms':
      for (const s of sides) {
        const p = V(s * m.s * 0.55, m.y + m.s * 0.75, m.z - 0.05);
        T.push(cap(V(p.x * 0.7, p.y - 0.3, p.z + 0.1), p, 0.07, color(C.cream), 0.04));
        T.push(ell(p, V(0.34, 0.2, 0.34), c, 0.04));
        T.push(sphere(p.clone().add(V(s * 0.1, 0.16, 0.08)), 0.06, c2, 0.02));
      }
      break;
    case 'hood':
      H.push(
        ell(V(0, h.y - h.r.y * 0.05, h.z - h.r.z * 0.45), V(h.r.x * 1.9, h.r.y * 1.5, 0.18), body),
      );
      for (const s of sides)
        H.push(
          ell(
            V(s * h.r.x * 1.35, h.y - h.r.y * 0.05, h.z - h.r.z * 0.25),
            V(0.2, 0.3, 0.06),
            c,
            0.02,
          ),
        );
      break;
    case 'foxTails': {
      const n = e.n ?? 6;
      // A 120° fan behind, each tail 0.9 of the body's length, the tips curled up (LOOK-10).
      const root = V(0, b.y - b.r.y * 0.2, backZ * 0.85);
      const len = Math.max(1.2, b.r.z * 1.8);
      for (let i = 0; i < n; i++) {
        const t = -1.05 + (2.1 * (i + 0.5)) / n;
        const mid = root.clone().add(V(Math.sin(t) * len * 0.4, len * 0.25, -len * 0.35));
        const end = root
          .clone()
          .add(V(Math.sin(t) * len * 0.75, len * 0.55, -len * 0.55 * Math.cos(t)));
        T.push(cap(root, mid, 0.14, body, 0.06));
        T.push(cap(mid, end, 0.16, body, 0.06));
        T.push(sphere(end, 0.2, body, 0.05));
        T.push(sphere(end.clone().add(V(Math.sin(t) * 0.1, 0.16, 0.08)), 0.14, c2, 0.03));
      }
      break;
    }
    case 'butterflyWings':
    case 'insectWings': {
      // Flat lobes on the back, sculpted in so they read from every side.
      const k = e.kind === 'butterflyWings' ? 1 : 0.65;
      for (const s of sides) {
        T.push(ell(V(s * 0.8 * k, m.y + 0.45 * k, m.z - 0.1), V(0.62 * k, 0.5 * k, 0.07), c, 0.04));
        T.push(
          ell(V(s * 0.55 * k, m.y - 0.25 * k, m.z - 0.08), V(0.4 * k, 0.34 * k, 0.07), c, 0.04),
        );
        T.push(
          ell(V(s * 1.0 * k, m.y + 0.7 * k, m.z - 0.14), V(0.2 * k, 0.16 * k, 0.04), c2, 0.02),
        );
      }
      break;
    }
    case 'angelWings':
      // LOOK-41: the second and third pairs of Angemon's six, feathered lobes on the back.
      for (const s of sides) {
        T.push(
          ell(V(s * (b.r.x + 0.45), b.y + b.r.y * 1.1, backZ - 0.05), V(0.38, 0.75, 0.06), c, 0.04),
          ell(V(s * (b.r.x + 0.3), b.y + b.r.y * 1.55, backZ - 0.1), V(0.08, 0.35, 0.05), c2, 0.02),
          ell(
            V(s * (b.r.x + 0.35), b.y - b.r.y * 0.35, backZ - 0.05),
            V(0.32, 0.42, 0.06),
            c,
            0.04,
          ),
        );
      }
      break;
    case 'batWings2':
      for (const s of sides)
        T.push(
          ell(V(s * (b.r.x + 0.5), b.y - b.r.y * 0.2, backZ * 0.5), V(0.55, 0.2, 0.06), c, 0.05),
        );
      break;
    case 'trio':
      for (const s of sides) {
        const p = V(s * h.r.x * 0.95, h.y - h.r.y * 0.45, h.z - 0.05);
        T.push(ell(p, h.r.clone().multiplyScalar(0.72), body, 0.03));
        T.push(sphere(V(p.x, p.y - 0.12, p.z + h.r.z * 0.72), 0.1, c, 0.02));
        for (const k of sides)
          T.push(
            sphere(V(p.x + k * 0.13, p.y + 0.1, p.z + h.r.z * 0.66), 0.05, color(col.eye), 0.01),
          );
      }
      break;
    case 'fourArms':
      for (let i = 0; i < (e.n ?? 1); i++) {
        const round = art.plan === 'round';
        const y = round ? h.y - h.r.y * 0.25 - i * 0.32 : b.y - b.r.y * 0.1 - i * 0.32;
        const x0 = round ? h.r.x * 0.85 : b.r.x * 0.85;
        for (const s of sides) {
          const hand = V(s * (x0 + 0.55), y - 0.3, 0.2);
          T.push(cap(V(s * x0, y, 0.05), hand, 0.13, body, 0.06));
          T.push(sphere(hand, 0.17, body, 0.04));
        }
      }
      break;
    case 'leafArms':
      for (const s of sides)
        T.push(ell(V(s * (b.r.x + 0.4), b.y + 0.1, 0.05), V(0.45, 0.07, 0.2), c, 0.05));
      break;
    case 'lances':
      for (const s of sides)
        T.push(
          cone(
            V(s * (b.r.x + 0.25), b.y + 0.15, 0.15),
            V(s * (b.r.x + 0.4), b.y - 0.75, 0.25),
            0.14,
            0.01,
            c,
          ),
        );
      break;
    case 'beak':
    case 'longBeak': {
      const len = e.kind === 'longBeak' ? 0.75 : 0.32;
      H.push(
        cone(
          V(0, h.y - h.r.y * 0.2, front - 0.12),
          V(0, h.y - h.r.y * 0.38, front + len),
          0.16,
          0.02,
          c,
        ),
      );
      break;
    }
    case 'bill':
      H.push(ell(V(0, h.y - h.r.y * 0.32, front - 0.02), V(h.r.x * 0.45, 0.1, 0.3), c, 0.04));
      break;
    case 'nose':
      H.push(sphere(V(0, h.y - h.r.y * 0.15, front - 0.04), 0.12, c, 0.03));
      break;
    case 'snout':
      H.push(ell(V(0, h.y - h.r.y * 0.2, front - 0.04), V(0.22, 0.15, 0.12), c, 0.03));
      for (const s of sides)
        H.push(sphere(V(s * 0.07, h.y - h.r.y * 0.2, front + 0.07), 0.035, c2, 0.01));
      break;
    case 'buckTeeth':
      H.push(ell(V(0, h.y - h.r.y * 0.5, front - 0.07), V(0.09, 0.1, 0.05), c, 0.01));
      break;
    case 'fangs':
      for (const s of sides)
        H.push(
          cone(
            V(s * 0.08, h.y - h.r.y * 0.38, front - 0.08),
            V(s * 0.08, h.y - h.r.y * 0.6, front - 0.06),
            0.04,
            0.005,
            '#ffffff',
            0.01,
          ),
        );
      break;
    case 'gape':
      H.push(
        ell(V(0, h.y - h.r.y * 0.3, front - 0.12), V(h.r.x * 0.5, h.r.y * 0.36, 0.12), c, 0.02),
      );
      H.push(
        ell(V(0, h.y - h.r.y * 0.48, front - 0.06), V(h.r.x * 0.3, h.r.y * 0.12, 0.08), c2, 0.01),
      );
      break;
    case 'whiskers':
      for (const s of sides)
        for (const dy of [0, -0.1])
          H.push(
            cap(
              V(s * h.r.x * 0.55, h.y - h.r.y * 0.3 + dy, front - 0.2),
              V(s * h.r.x * 1.25, h.y - h.r.y * 0.3 + dy * 2, front - 0.3),
              0.02,
              c,
              0,
            ),
          );
      break;
    case 'moustache':
      for (const s of sides)
        H.push(
          cap(
            V(s * 0.08, h.y - h.r.y * 0.35, front - 0.03),
            V(s * 0.4, h.y - h.r.y * 1.0, front - 0.15),
            0.05,
            c,
            0.02,
          ),
        );
      break;
    case 'coin':
      H.push(ell(V(0, h.y + h.r.y * 0.55, h.z + h.r.z * 0.8), V(0.17, 0.17, 0.06), c, 0.02));
      break;
    case 'bucketHat':
      // A snowman's bucket hat (Yukidarumon, LOOK-41): a flat brim, a straight crown, a band.
      H.push(
        ell(V(0, top - 0.06, h.z), V(h.r.x * 1.2, 0.07, h.r.z * 1.2), c, 0.02),
        ell(V(0, top + 0.22, h.z), V(h.r.x * 0.8, 0.3, h.r.z * 0.8), c, 0.03),
        ell(V(0, top + 0.04, h.z), V(h.r.x * 0.84, 0.07, h.r.z * 0.84), c2, 0.01),
      );
      break;
    case 'cap':
      H.push(
        ell(V(0, h.y + h.r.y * 0.45, h.z), V(h.r.x * 1.35, h.r.y * 0.55, h.r.z * 1.3), c, 0.05),
      );
      for (const [x, z] of [
        [-0.4, 0.3],
        [0.35, 0.1],
        [0, -0.35],
        [0.1, 0.55],
      ] as const)
        H.push(sphere(V(x, h.y + h.r.y * 0.95, h.z + z), 0.09, c2, 0.02));
      break;
    case 'leafTuft': {
      const n = e.n ?? 5;
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0 : -0.9 + (1.8 * i) / (n - 1);
        H.push(
          cone(
            V(0, top - 0.08, h.z),
            V(Math.sin(t) * 0.55, top + 0.75, h.z + (i % 2 ? -0.15 : 0.1)),
            0.16,
            0.03,
            i % 2 ? c2 : c,
            0.08,
          ),
        );
      }
      break;
    }
    case 'bigFlower':
      for (let i = 0; i < 5; i++) {
        const t = (i / 5) * Math.PI * 2;
        H.push(
          ell(
            V(Math.cos(t) * 0.55, top + 0.12, h.z + Math.sin(t) * 0.55),
            V(0.46, 0.2, 0.38),
            c,
            0.05,
          ),
        );
        H.push(sphere(V(Math.cos(t) * 0.62, top + 0.3, h.z + Math.sin(t) * 0.55), 0.07, c2, 0.02));
      }
      H.push(sphere(V(0, top + 0.08, h.z), 0.16, color(col.outline), 0.03));
      break;
    case 'flowers':
      for (const s of sides) {
        H.push(sphere(V(s * 0.38, top + 0.2, h.z), 0.22, c, 0.05));
        H.push(sphere(V(s * 0.38, top + 0.24, h.z + 0.18), 0.08, c2, 0.02));
      }
      break;
    case 'plume':
      H.push(
        cone(V(0, top - 0.05, h.z - 0.05), V(0, top + 0.85 * art.size, h.z - 0.65), 0.15, 0.02, c),
      );
      H.push(
        cone(
          V(0.08, top - 0.08, h.z - 0.15),
          V(0.12, top + 0.5 * art.size, h.z - 0.95),
          0.12,
          0.02,
          c2,
        ),
      );
      break;
    case 'hairs':
      for (const x of [-0.1, 0, 0.1])
        H.push(cap(V(x * 0.5, top - 0.05, h.z), V(x * 1.6, top + 0.4, h.z), 0.03, c, 0.01));
      break;
    case 'antennae':
      for (const s of sides) {
        const tip = V(s * 0.45, top + 0.7, h.z + 0.15);
        H.push(cap(V(s * 0.15, top - 0.05, h.z + 0.1), tip, 0.04, c, 0.02));
        H.push(sphere(tip, 0.09, c2, 0.02));
      }
      break;
    case 'mane':
      T.push(
        ell(V(0, b.y + b.r.y * 0.8, b.r.z * 0.35), V(b.r.x * 0.95, 0.32, b.r.z * 0.8), c, 0.08),
      );
      H.push(sphere(V(0, top - 0.02, h.z - 0.05), 0.24, c, 0.06));
      break;
    case 'swirl': {
      const round = art.plan === 'round';
      const p = round ? V(0, h.y - h.r.y * 0.45, h.z + h.r.z * 0.78) : V(0, b.y, b.r.z * 0.9);
      const r = round ? h.r.x * 0.38 : b.r.x * 0.6;
      const into = round ? H : T;
      into.push(ell(p, V(r, r, 0.12), c2, 0.02));
      for (let i = 0; i < 12; i++) {
        const t = i * 0.75;
        const rr = r * (0.85 - i * 0.065);
        into.push(
          sphere(V(p.x + Math.cos(t) * rr, p.y + Math.sin(t) * rr, p.z + 0.1), 0.045, c, 0.01),
        );
      }
      break;
    }
    case 'gems':
      for (const s of sides)
        H.push(sphere(V(s * h.r.x * 0.72, h.y, h.z + h.r.z * 0.62), 0.14, c, 0.02));
      H.push(sphere(V(0, h.y - h.r.y * 0.6, front - 0.1), 0.1, c, 0.02));
      break;
    case 'heart':
      // Painted as a mark instead, over the belly (art-species.ts `marks`).
      break;
    case 'tubes':
      // LOOK-41: Andromon's red tubes, loops down each side of the chest.
      for (const s of sides)
        T.push(
          cap(
            V(s * b.r.x * 0.7, b.y + b.r.y * 0.55, b.r.z * 0.6),
            V(s * b.r.x * 0.95, b.y, b.r.z * 0.55),
            0.07,
            c,
            0.02,
          ),
          cap(
            V(s * b.r.x * 0.95, b.y, b.r.z * 0.55),
            V(s * b.r.x * 0.65, b.y - b.r.y * 0.55, b.r.z * 0.6),
            0.07,
            c,
            0.02,
          ),
        );
      break;
    case 'drool':
      H.push(ell(V(0.08, h.y - h.r.y * 0.62, front - 0.02), V(0.05, 0.12, 0.05), c, 0.02));
      break;
    case 'belt':
      T.push(ell(V(0, b.y - b.r.y * 0.45, 0), V(b.r.x * 1.03, 0.1, b.r.z * 1.03), c, 0.02));
      break;
    case 'pads':
      for (const s of sides)
        T.push(sphere(V(s * b.r.x * 0.85, b.y + b.r.y * 0.75, 0), 0.26, c, 0.06));
      break;
    case 'plates':
      for (const dy of [-0.15, 0.15, 0.45])
        H.push(ell(V(0, h.y - h.r.y * dy, h.z), V(h.r.x * 1.01, 0.035, h.r.z * 1.01), c, 0));
      break;
    case 'rocks':
      for (const [x, y, z] of [
        [-0.6, 0.3, 0.5],
        [0.55, 0.45, 0.45],
        [0.7, -0.2, 0.3],
        [-0.5, -0.35, 0.6],
        [0, 0.75, 0.2],
      ] as const) {
        // On a shelled body the rocks stud the shell; otherwise the head.
        if (art.plan === 'shell')
          T.push(
            sphere(V(x * b.r.x * 1.05, b.y + 0.2 + y * b.r.y, -z * b.r.z * 0.9), 0.18, c, 0.04),
          );
        else H.push(sphere(V(x * h.r.x, h.y + y * h.r.y, h.z + z * h.r.z), 0.16, c, 0.04));
      }
      break;
    case 'skirt':
      T.push(
        cone(
          V(0, b.y + b.r.y * 0.1, 0),
          V(0, b.y - b.r.y * 0.95, 0),
          b.r.x * 0.9,
          b.r.x * 1.45,
          c,
          0.05,
        ),
      );
      break;
    case 'spoons':
      for (const s of sides) {
        const x = s * (b.r.x + 0.45);
        T.push(cap(V(x, b.y - 0.25, 0.3), V(x, b.y + 0.4, 0.35), 0.035, c, 0));
        T.push(ell(V(x, b.y + 0.52, 0.36), V(0.09, 0.13, 0.05), c, 0));
      }
      break;
    case 'stem':
      if (art.plan === 'stalk')
        T.push(ell(V(0, b.y, 0), b.r.clone().multiplyScalar(1.04), c, 0.03));
      break;
  }
}
