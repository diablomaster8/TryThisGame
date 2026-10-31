import * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import {
  CLUTCH,
  headAngles,
  headScale,
  headTall,
  type HeadsSpec,
} from '../render/sprites/creature-gen1b';
import { C, color } from '../render/sprites/palette';
import { V, type Prim } from '../samples/sculpted';
import type { Mark, PartSpec, PoseName, RigContext, SpeciesSpec } from '../samples/species';
import { boxOf, type Layout } from './art-species';

/**
 * The extra kit parts of the later first-generation pocket species (`CreatureSpec.gen1b`,
 * drawn in pixels by `render/sprites/creature-gen1b.ts`) sculpted in 3D. `artSpec` builds
 * the figure from the shared recipe and hands it here; each part adds primitives to the
 * head, the torso, a hand or the tail, or paints a mark, and the touched boxes are re-fitted.
 * Hard props (a bone, a leek, magnets, floating hands) carry a small blend so they stand
 * off the body instead of melting into it.
 */
type Colors = Record<string, string>;

const sphere = (a: THREE.Vector3, r: number, c: string, blend?: number): Prim => ({
  kind: 'sphere',
  a,
  r,
  color: c,
  ...(blend !== undefined ? { blend } : {}),
});
const ell = (a: THREE.Vector3, radii: THREE.Vector3, c: string, blend?: number): Prim => ({
  kind: 'ellipsoid',
  a,
  radii,
  r: 0,
  color: c,
  ...(blend !== undefined ? { blend } : {}),
});
const cap = (a: THREE.Vector3, b: THREE.Vector3, r: number, c: string, blend?: number): Prim => ({
  kind: 'capsule',
  a,
  b,
  r,
  color: c,
  ...(blend !== undefined ? { blend } : {}),
});
const cone = (
  a: THREE.Vector3,
  b: THREE.Vector3,
  r: number,
  r2: number,
  c: string,
  blend = 0.06,
): Prim => ({ kind: 'cone', a, b, r, r2, color: c, blend });

const CREAM = color(C.cream);
const WHITE = color(C.white);
const STEEL = '#9aa4b8';
const LEAF = color(C.leaf);
const GOLD = color(C.sunYellow);

/** A prim scaled about `from` by `k` and moved to `to`. */
function place(p: Prim, from: THREE.Vector3, k: THREE.Vector3, to: THREE.Vector3): Prim {
  const m = (v: THREE.Vector3) => v.clone().sub(from).multiply(k).add(to);
  return {
    ...p,
    a: m(p.a),
    ...(p.b ? { b: m(p.b) } : {}),
    r: p.r * k.x,
    ...(p.radii ? { radii: p.radii.clone().multiply(k) } : {}),
    ...(p.r2 !== undefined ? { r2: p.r2 * k.x } : {}),
  };
}

function placeMark(m: Mark, from: THREE.Vector3, k: THREE.Vector3, to: THREE.Vector3): Mark {
  const f = (v: THREE.Vector3) => v.clone().sub(from).multiply(k).add(to);
  return {
    ...m,
    a: f(m.a),
    ...(m.b ? { b: f(m.b) } : {}),
    ...(m.r !== undefined ? { r: m.r * k.x } : {}),
    ...(m.radii ? { radii: m.radii.clone().multiply(k) } : {}),
  };
}

/** A part moved bodily by `d`, its knee segment with it. */
function movePart(p: PartSpec, d: THREE.Vector3): PartSpec {
  const mv = (q: Prim): Prim => ({
    ...q,
    a: q.a.clone().add(d),
    ...(q.b ? { b: q.b.clone().add(d) } : {}),
  });
  const prims = p.prims.map(mv);
  const out: PartSpec = { ...p, pivot: p.pivot.clone().add(d), prims, box: boxOf(prims) };
  if (p.joint) {
    const jp = p.joint.prims.map(mv);
    out.joint = { ...p.joint, pivot: p.joint.pivot.clone().add(d), prims: jp, box: boxOf(jp) };
  }
  return out;
}

interface Slot3 {
  p: THREE.Vector3;
  /** Size against the main head. */
  k: number;
  /** Where its neck leaves the body, or null. */
  neck: THREE.Vector3 | null;
}

/** Every head's centre in body space, the main one first; the same arc as the pixel drawer. */
function headSlots3d(H: HeadsSpec, L: Layout, R0: THREE.Vector3, orb: boolean): Slot3[] {
  const h = L.head;
  const b = L.body;
  const size = (i: number) => (H.sizes[i] ?? 1) / (H.sizes[0] ?? 1);
  if (H.cluster)
    return CLUTCH.slice(0, H.count).map(([dx, dy, front], i) => ({
      p: V(dx * R0.x, h.y - dy * R0.y * 0.9, h.z - (front ? Math.abs(dx) * 0.2 : 0.9) * R0.z),
      k: size(i),
      neck: null,
    }));
  if (H.arms) {
    const out: Slot3[] = [{ p: V(0, h.y, h.z), k: 1, neck: null }];
    for (let i = 1; i < H.count; i++) {
      const d = i % 2 ? -1 : 1;
      out.push({
        p: V(d * (b.r.x + 0.8), b.y + b.r.y * 1.05, 0.45),
        k: size(i),
        neck: V(d * b.r.x * 0.8, b.y + b.r.y * 0.35, 0.05),
      });
    }
    return out;
  }
  const th = headAngles(H);
  const sp = (H.spread * Math.PI) / 180;
  const step = H.count > 1 ? sp / (H.count - 1) : 0;
  const touch = step > 0 ? (0.95 * R0.x) / Math.sin(step / 2) : 0;
  const O = orb ? V(0, h.y - touch, h.z) : V(0, b.y + b.r.y * 0.75, h.z * 0.3);
  const R = orb ? touch : Math.max(touch, h.y - O.y + H.neck * 1.1);
  return th.map((t, i) => ({
    p: V(Math.sin(t) * R, O.y + Math.cos(t) * R, O.z - (i === 0 ? 0 : 0.12)),
    k: size(i),
    neck: !orb && H.neck > 0 ? V(Math.sin(t) * 0.25, O.y, O.z) : null,
  }));
}

/** The eyes (and a painted mouth) of an extra head, from the main head's face, scaled. */
function headFace(
  at: THREE.Vector3,
  k: THREE.Vector3,
  hc: THREE.Vector3,
  eyes: SpeciesSpec['eyes'],
  mouth: SpeciesSpec['mouth'],
  c: Colors,
  full: boolean,
): { prims: Prim[]; marks: Mark[] } {
  const prims: Prim[] = [];
  const marks: Mark[] = [];
  const er = eyes.r * k.x;
  const xs = eyes.x < 0.05 ? [0] : [-eyes.x, eyes.x];
  for (const x of xs) {
    const e = V(x, eyes.y, eyes.z).sub(hc).multiply(k).add(at);
    if (!full) {
      prims.push(sphere(e, 0.07, c.eye!, 0.01));
      continue;
    }
    // Painted, like the main face's crisp look: white, iris, glint, then the lid over them.
    // Rods through the skin along the view axis paint clean discs (an ellipsoid's distance
    // is too rough when it is this flat).
    const paint = (dx: number, dy: number, r: number, col: string): Mark => ({
      kind: 'capsule',
      a: e.clone().add(V(dx, dy, -er * 2)),
      b: e.clone().add(V(dx, dy, er * 2)),
      r,
      color: col,
      soft: 0,
    });
    marks.push(
      paint(0, 0, er, WHITE),
      paint(er * 0.08, -er * 0.12, er * 0.62, c.eye!),
      paint(-er * 0.22, er * 0.25, er * 0.22, WHITE),
    );
    // The main face's lid, so an angry or sleepy look carries over.
    if (eyes.lid > 0.2) marks.push(paint(0, er * 1.75, er * 1.05, eyes.lidColor));
  }
  if (full && mouth.width > 0.05) {
    const m = V(mouth.x, mouth.y, mouth.z).sub(hc).multiply(k).add(at);
    const w = mouth.width * k.x;
    marks.push({
      kind: 'capsule',
      a: m.clone().add(V(-w, 0, 0)),
      b: m.clone().add(V(w, 0, 0)),
      r: 0.035,
      color: c.outline!,
      soft: 0,
    });
  }
  return { prims, marks };
}

/** A snake's head on the end of an arm: open jaws, a fang each side, two eyes. */
function snakeHead(at: THREE.Vector3, k: number, col: string, c: Colors): Prim[] {
  const K = V(k, k, k);
  const q = (x: number, y: number, z: number) => at.clone().add(V(x, y, z).multiply(K));
  return [
    ell(q(0, 0.08, 0.05), V(0.3, 0.17, 0.42).multiply(K), col, 0.04),
    ell(q(0, -0.16, 0.08), V(0.25, 0.09, 0.36).multiply(K), col, 0.03),
    sphere(q(0, -0.05, 0.1), 0.15 * k, color(C.berry), 0.02),
    ...[-1, 1].flatMap((s) => [
      cone(q(s * 0.13, -0.02, 0.38), q(s * 0.12, -0.13, 0.38), 0.035 * k, 0.005, WHITE, 0.01),
      sphere(q(s * 0.16, 0.2, 0.18), 0.075 * k, WHITE, 0.01),
      sphere(q(s * 0.18, 0.21, 0.23), 0.045 * k, c.eye!, 0.005),
    ]),
  ];
}

/** The hand prim of an arm part, or the arm's far end. */
function handOf(part: PartSpec): THREE.Vector3 {
  const hand = part.prims.find((p) => p.tag === 'hand') ?? part.prims[0]!;
  return (hand.b ?? hand.a).clone();
}

export function applyGen1b3d(
  spec: SpeciesSpec,
  art: CreatureSpec,
  L: Layout,
  c: Colors,
): SpeciesSpec {
  const parts = art.gen1b ?? [];
  const H = art.heads && art.heads.count > 1 ? art.heads : null;
  if (parts.length === 0 && !H) return spec;
  const h = L.head;
  const b = L.body;
  const top = h.y + h.r.y;
  const head: Prim[] = [];
  const torso: Prim[] = [];
  const marks: Mark[] = [];
  const handProps: Array<(hand: THREE.Vector3, s: number) => Prim[]> = [];
  // Rings around the main head only: never copied onto the extra heads.
  const halo: Prim[] = [];
  let eyes = spec.eyes;
  let mouth = spec.mouth;
  const front = h.z + h.r.z;
  const orb = art.plan === 'round' && art.legs === 'none' && art.arms === 'none';
  for (const part of parts) {
    switch (part) {
      case 'shellPair':
        head.push(
          ell(
            V(0, h.y + 0.1, h.z - h.r.z * 0.55),
            V(h.r.x * 1.45, h.r.y * 1.4, 0.4),
            c.accent!,
            0.06,
          ),
          ...[-0.6, -0.3, 0, 0.3, 0.6].map((k) =>
            cap(
              V(k * h.r.x * 0.4, h.y - 0.1, h.z - h.r.z * 0.45),
              V(k * h.r.x * 1.6, top + 0.35, h.z - h.r.z * 0.45),
              0.06,
              c.accent2!,
              0.04,
            ),
          ),
        );
        break;
      case 'star5':
      case 'star10': {
        const R = h.r.x * 1.8;
        const ring = (turn: number, z: number, col: string) => {
          for (let i = 0; i < 5; i++) {
            const t = Math.PI / 2 + turn + (i * Math.PI * 2) / 5;
            head.push(
              cone(
                V(0, h.y, h.z + z),
                V(Math.cos(t) * R, h.y + Math.sin(t) * R, h.z + z),
                h.r.x * 0.42,
                0.08,
                col,
                0.1,
              ),
            );
          }
        };
        ring(0, -0.05, c.body!);
        if (part === 'star10') ring(Math.PI / 5, -0.35, c.shade!);
        break;
      }
      case 'gem':
        head.push(
          sphere(V(0, h.y, front - 0.12), 0.32, color(C.sunYellow), 0.03),
          sphere(V(0, h.y, front + 0.05), 0.22, color(C.ember), 0.02),
        );
        // The core is the face: no eyes or mouth of its own.
        eyes = { ...eyes, r: 0.02 };
        mouth = { ...mouth, width: 0.01 };
        break;
      case 'pearl':
        torso.push(sphere(V(0, h.y - h.r.y * 0.9, h.z * 0.6 + 0.3), 0.14, color(C.skyLight), 0.03));
        break;
      case 'aura':
        for (let i = 0; i < 9; i++) {
          const t = (i / 9) * Math.PI * 2 + 0.3;
          halo.push(
            sphere(
              V(Math.cos(t) * h.r.x * 1.25, h.y + Math.sin(t) * h.r.y * 1.25, h.z - 0.15),
              i % 2 ? 0.26 : 0.18,
              c.accent!,
              0.05,
            ),
          );
        }
        break;
      case 'boulders':
        // A serpent's boulders are its spine segments (art-serpent.ts).
        if (art.plan === 'serpent') break;
        for (const [x, y, z, r] of [
          [0.55, 0.42, -0.85, 0.42],
          [0.95, 0.55, -1.35, 0.36],
          [1.05, 0.75, -1.8, 0.3],
          [-0.5, 0.4, -0.5, 0.38],
        ] as const)
          torso.push(sphere(V(x, y, z), r, c.body!, 0.06));
        break;
      case 'backShell':
        if (art.plan === 'quad') {
          // LOOK-39: Lapras's grey dome sits on top of the back with a row of studs.
          torso.push(
            ell(
              V(0, b.y + b.r.y * 0.55, -b.r.z * 0.1),
              V(b.r.x * 1.15, b.r.y * 0.8, b.r.z * 0.9),
              c.accent!,
              0.06,
            ),
            ...[-0.5, 0, 0.5].flatMap((z) =>
              [-0.28, 0.28].map((x) =>
                sphere(V(x, b.y + b.r.y * 1.25, z * b.r.z), 0.1, c.accent2!, 0.04),
              ),
            ),
          );
          break;
        }
        torso.push(
          ell(
            V(0, b.y + b.r.y * 0.35, -b.r.z * 0.55),
            V(b.r.x * 1.2, b.r.y * 0.85, b.r.z * 0.8),
            c.accent!,
            0.06,
          ),
          ...[-0.3, 0, 0.3].map((x) =>
            sphere(V(x, b.y + b.r.y * 1.1, -b.r.z * 0.6), 0.12, c.accent2!, 0.04),
          ),
        );
        break;
      case 'palm':
        for (let i = 0; i < 5; i++) {
          const t = (i / 5) * Math.PI * 2;
          head.push(
            ell(
              V(Math.cos(t) * 0.45, top + 0.1 - (i % 2) * 0.06, h.z + Math.sin(t) * 0.45),
              V(0.34, 0.06, 0.18),
              LEAF,
              0.04,
            ),
          );
        }
        break;
      case 'lowerHalf':
        if (art.plan === 'round')
          marks.push({
            kind: 'ellipsoid',
            a: V(0, h.y - h.r.y * 0.98, h.z),
            radii: V(h.r.x * 1.3, h.r.y * 1.02, h.r.z * 1.3),
            color: c.accent2!,
            soft: 0,
          });
        else
          marks.push({
            kind: 'ellipsoid',
            a: V(0, b.y - b.r.y * 0.75, 0),
            radii: V(b.r.x * 1.4, b.r.y * 1.1, b.r.z * 1.4),
            color: c.accent2!,
            soft: 0,
          });
        break;
      case 'vines':
        for (let i = 0; i < 22; i++) {
          const t = i * 2.39996;
          const yk = 1 - (2 * (i + 0.5)) / 22;
          const rk = Math.sqrt(1 - yk * yk);
          const dir = V(Math.cos(t) * rk, yk, Math.sin(t) * rk);
          const p = V(h.r.x * dir.x, h.y + h.r.y * dir.y, h.z + h.r.z * dir.z);
          const tangent = V(-dir.z, 0.4, dir.x).normalize().multiplyScalar(0.3);
          if (dir.z > 0.75 && Math.abs(dir.y) < 0.35) continue; // keep the eyes clear
          head.push(cap(p, p.clone().add(tangent), 0.08, i % 3 ? c.shade! : c.accent!, 0.05));
        }
        break;
      case 'ruff':
      case 'spikeRuff': {
        const y = b.y + b.r.y * 0.85;
        const col = part === 'ruff' ? c.belly! : c.body!;
        for (let i = 0; i < 9; i++) {
          const t = -Math.PI * 0.1 + (i / 8) * Math.PI * 1.2;
          const p = V(Math.cos(t) * b.r.x * 0.85, y, Math.sin(t) * b.r.z * 0.6 + h.z * 0.5);
          if (part === 'ruff') torso.push(sphere(p, 0.2, col, 0.08));
          else
            torso.push(
              cone(
                p,
                p.clone().add(V(Math.cos(t) * 0.35, -0.1, Math.sin(t) * 0.35)),
                0.12,
                0.02,
                col,
              ),
            );
        }
        break;
      }
      case 'pouchBaby':
      case 'pouchEgg': {
        const z = b.r.z * 0.85;
        torso.push(ell(V(0, b.y - 0.08, z), V(b.r.x * 0.6, b.r.y * 0.42, 0.22), c.belly!, 0.06));
        if (part === 'pouchBaby')
          torso.push(
            // 1.3x the first cut, so the baby reads at a glance (LOOK-39).
            sphere(V(0, b.y + 0.2, z + 0.14), 0.31, c.body!, 0.03),
            sphere(V(-0.1, b.y + 0.24, z + 0.43), 0.05, c.eye!, 0.01),
            sphere(V(0.1, b.y + 0.24, z + 0.43), 0.05, c.eye!, 0.01),
          );
        else torso.push(ell(V(0, b.y + 0.05, z + 0.1), V(0.17, 0.22, 0.15), WHITE, 0.02));
        break;
      }
      case 'magnets':
        head.push(cap(V(0, top - 0.1, h.z), V(0, top + 0.3, h.z), 0.08, STEEL, 0.03));
        for (const s of [-1, 1]) {
          const x = s * (h.r.x + 0.18);
          head.push(
            cap(V(x, h.y + 0.28, h.z), V(x, h.y - 0.28, h.z), 0.1, STEEL, 0.03),
            sphere(V(x + s * 0.16, h.y + 0.3, h.z), 0.1, color(C.ember), 0.02),
            sphere(V(x + s * 0.16, h.y - 0.3, h.z), 0.1, color(C.water), 0.02),
          );
        }
        break;
      case 'cyclops':
        eyes = { ...eyes, x: 0, r: eyes.r * 1.5, y: h.y + 0.02 };
        mouth = { ...mouth, width: 0.01 };
        break;
      case 'skull':
        head.push(
          ell(
            V(0, h.y + h.r.y * 0.32, h.z + 0.02),
            V(h.r.x * 1.08, h.r.y * 0.76, h.r.z * 1.08),
            CREAM,
            0.04,
          ),
          ...[-1, 1].map((s) =>
            cone(
              V(s * h.r.x * 0.45, top - 0.1, h.z - 0.05),
              V(s * h.r.x * 0.7, top + 0.32, h.z - 0.1),
              0.12,
              0.03,
              CREAM,
            ),
          ),
        );
        break;
      case 'bone':
        handProps.push((hd) => [
          cap(
            hd.clone().add(V(0, 0.45, 0.12)),
            hd.clone().add(V(0, -0.35, 0.12)),
            0.07,
            CREAM,
            0.03,
          ),
          ...[0.45, -0.35].flatMap((y) =>
            [-0.07, 0.07].map((x) => sphere(hd.clone().add(V(x, y, 0.12)), 0.1, CREAM, 0.02)),
          ),
        ]);
        break;
      case 'staff':
        // LOOK-41: Angemon's staff, upright in the right hand.
        handProps.push((hd) => [
          cap(
            hd.clone().add(V(0, -0.95, 0.14)),
            hd.clone().add(V(0, 1.05, 0.14)),
            0.05,
            GOLD,
            0.02,
          ),
          sphere(hd.clone().add(V(0, 1.1, 0.14)), 0.1, STEEL, 0.02),
          sphere(hd.clone().add(V(0, -1.0, 0.14)), 0.1, STEEL, 0.02),
        ]);
        break;
      case 'mic':
        // LOOK-41: Etemon's microphone, tipped toward the mouth.
        handProps.push((hd) => [
          cap(
            hd.clone().add(V(0, -0.05, 0.14)),
            hd.clone().add(V(-0.08, 0.32, 0.2)),
            0.05,
            '#2a2440',
            0.02,
          ),
          sphere(hd.clone().add(V(-0.1, 0.42, 0.22)), 0.13, STEEL, 0.02),
        ]);
        break;
      case 'leek':
        handProps.push((hd) => [
          cap(
            hd.clone().add(V(0, -0.15, 0.12)),
            hd.clone().add(V(0.05, 0.3, 0.12)),
            0.06,
            WHITE,
            0.03,
          ),
          cap(
            hd.clone().add(V(0.05, 0.3, 0.12)),
            hd.clone().add(V(0.15, 0.75, 0.1)),
            0.06,
            LEAF,
            0.03,
          ),
          ell(hd.clone().add(V(0.2, 0.85, 0.1)), V(0.1, 0.2, 0.05), color(C.grass), 0.03),
        ]);
        break;
      case 'pendulum':
        handProps.push((hd) => [
          cap(hd, hd.clone().add(V(0, -0.45, 0.08)), 0.02, STEEL, 0.01),
          ell(hd.clone().add(V(0, -0.55, 0.1)), V(0.13, 0.13, 0.04), color(C.sunLight), 0.01),
        ]);
        break;
      case 'tongue':
        head.push(
          cap(
            V(0, h.y - h.r.y * 0.4, front - 0.1),
            V(0.08, h.y - h.r.y * 1.1, front + 0.2),
            0.09,
            color(C.rose),
            0.03,
          ),
          sphere(V(0.08, h.y - h.r.y * 1.15, front + 0.22), 0.13, color(C.rose), 0.02),
        );
        break;
      case 'beak':
        head.push(
          cone(V(0, h.y - 0.12, front - 0.15), V(0, h.y - 0.2, front + 0.4), 0.2, 0.03, c.accent!),
        );
        mouth = { ...mouth, width: 0.01 };
        break;
      case 'snout':
        head.push(
          cap(V(0, h.y - 0.18, front - 0.2), V(0, h.y - 0.22, front + 0.3), 0.14, c.body!, 0.06),
          sphere(V(0, h.y - 0.22, front + 0.42), 0.06, c.outline!, 0.01),
        );
        mouth = { ...mouth, width: 0.01 };
        break;
      case 'barbels':
        for (const s of [-1, 1])
          head.push(
            cap(
              V(s * 0.25, h.y - 0.3, front - 0.1),
              V(s * 0.8, h.y - 0.75, front - 0.05),
              0.04,
              c.accent2!,
              0.02,
            ),
          );
        break;
      case 'floatHands':
        for (const s of [-1, 1]) {
          const at = V(s * (Math.max(b.r.x, h.r.x * 0.8) + 0.65), b.y + 0.35, 0.25);
          torso.push(
            sphere(at, 0.22, c.body!, 0.02),
            ...[-0.1, 0.1].map((y) =>
              sphere(at.clone().add(V(s * 0.2, y, 0.02)), 0.08, c.body!, 0.02),
            ),
          );
        }
        break;
      case 'grin':
        marks.push({
          kind: 'ellipsoid',
          a: V(0, h.y - h.r.y * 0.4, front),
          radii: V(h.r.x * 0.6, 0.12, 0.35),
          color: WHITE,
          soft: 0,
        });
        break;
      case 'pincerHead':
        for (const s of [-1, 1])
          head.push(
            cone(
              V(s * 0.25, top - 0.15, h.z),
              V(s * 0.5, top + 0.85, h.z + 0.05),
              0.17,
              0.05,
              c.accent2!,
            ),
            cone(
              V(s * 0.4, top + 0.35, h.z),
              V(s * 0.2, top + 0.45, h.z + 0.05),
              0.06,
              0.02,
              c.accent2!,
            ),
          );
        break;
      case 'pincers':
      case 'bigPincer':
      case 'scythes':
      case 'fishTail':
        break; // handled below, on the arm and tail parts
      case 'gas':
      case 'float':
      case 'ghostHands':
        break; // handled below, as parts and extras hooks
      default:
        break;
    }
  }

  // Claws and blades replace the hands; held props hang from the right hand. A figure
  // with no arms carries them at its sides.
  const atHand = (hd: THREE.Vector3, s: number): Prim[] => {
    const add: Prim[] = [];
    if (parts.includes('pincers') || parts.includes('bigPincer')) {
      const k = parts.includes('bigPincer') && s > 0 ? 1.7 : 1;
      add.push(
        ell(hd.clone().add(V(0, 0.12 * k, 0.12)), V(0.26 * k, 0.16 * k, 0.3 * k), c.accent!, 0.05),
        ell(hd.clone().add(V(0, -0.13 * k, 0.15)), V(0.2 * k, 0.1 * k, 0.24 * k), c.accent!, 0.05),
      );
    }
    if (parts.includes('scythes'))
      add.push(cone(hd, hd.clone().add(V(s * 0.1, 0.6, 0.5)), 0.13, 0.02, c.belly!));
    if (s > 0) for (const prop of handProps) add.push(...prop(hd, s));
    return add;
  };
  let newParts = spec.parts.map((p) => ({ ...p, prims: [...p.prims] }));
  for (const s of [-1, 1]) {
    const arm = newParts.find((p) => p.name === (s > 0 ? 'armR' : 'armL'));
    if (arm) {
      const add = atHand(handOf(arm), s);
      if (add.length === 0) continue;
      arm.prims.push(...add);
      arm.box = boxOf(arm.prims);
    } else {
      const round = art.plan === 'round';
      const hd = V(
        s * (round ? h.r.x * 0.95 + 0.35 : b.r.x + 0.12),
        round ? h.y - h.r.y * 0.25 : b.y + 0.15,
        0.25,
      );
      torso.push(...atHand(hd, s));
    }
  }
  if (parts.includes('fishTail')) {
    const fin = (end: THREE.Vector3): Prim[] => [
      ell(end.clone().add(V(0, 0.22, -0.15)), V(0.06, 0.28, 0.2), c.accent!, 0.06),
      ell(end.clone().add(V(0, -0.18, -0.15)), V(0.06, 0.24, 0.2), c.accent!, 0.06),
    ];
    const tail = newParts.find((p) => p.name === 'tail');
    if (tail) {
      const last = tail.prims[tail.prims.length - 1]!;
      tail.prims.push(...fin((last.b ?? last.a).clone()));
      tail.box = boxOf(tail.prims);
    } else {
      // A ball's tail grows from the back of the ball, not from its hidden body.
      const root = orb
        ? V(0, h.y - h.r.y * 0.2, h.z - h.r.z * 0.9)
        : V(0, b.y - b.r.y * 0.2, -b.r.z * 0.85);
      const prims: Prim[] = [
        cap(root, root.clone().add(V(0, 0.05, -0.4)), 0.13, c.body!),
        ...fin(root.clone().add(V(0, 0.05, -0.45))),
      ];
      newParts = [
        ...newParts,
        { name: 'tail', pivot: root, prims, box: boxOf(prims), resolution: 56 },
      ];
    }
  }

  let headPrims = [...spec.head.prims, ...head];
  let torsoPrims = [...spec.torso.prims, ...torso];
  let allMarks = [...spec.marks, ...marks];
  let headPivot = spec.head.pivot;
  // Many heads (R0376): every head the same size, each its own part on its own neck.
  const hc = V(0, h.y, h.z);
  let mainAt = hc.clone();
  let mainR = h.r.clone();
  let low = h.y - h.r.y;
  const bobbers: Array<{ name: string; phase: number }> = [];
  if (H) {
    const k0 = headScale(H);
    const kv = V(k0, k0 * (headTall(H) ?? 1), k0);
    const R0 = h.r.clone().multiply(kv);
    const slots = headSlots3d(H, L, R0, orb);
    // The eye rig sits on the centre line, so with an even count the main head stays on it
    // and the rest of the figure moves over instead.
    const sx = slots[0]!.p.x;
    for (const sl of slots) {
      sl.p.x -= sx;
      sl.neck?.setX(sl.neck.x - sx);
    }
    if (sx !== 0) {
      const d = V(-sx, 0, 0);
      torsoPrims = torsoPrims.map((p) => ({
        ...p,
        a: p.a.clone().add(d),
        ...(p.b ? { b: p.b.clone().add(d) } : {}),
      }));
      newParts = newParts.map((p) => movePart(p, d));
    }
    const near = (v: THREE.Vector3) => v.distanceTo(hc) < h.r.x * 1.4;
    const template = headPrims;
    const main = slots[0]!;
    mainAt = main.p.clone();
    mainR = R0;
    headPrims = [
      ...headPrims.map((p) => place(p, hc, kv, mainAt)),
      ...halo.map((p) => place(p, hc, kv, mainAt)),
    ];
    allMarks = allMarks.map((m) =>
      near(m.a) ? placeMark(m, hc, kv, mainAt) : { ...m, a: m.a.clone().setX(m.a.x - sx) },
    );
    headPivot = mainAt.clone().add(spec.head.pivot.clone().sub(hc).multiply(kv));
    const at = (v: { y: number; z: number }) => V(0, v.y, v.z).sub(hc).multiply(kv).add(mainAt);
    const eAt = at(eyes);
    const mAt = at(mouth);
    const face0 = { eyes, mouth };
    eyes = { ...eyes, x: eyes.x * k0, y: eAt.y, z: eAt.z, r: eyes.r * k0 };
    mouth = { ...mouth, y: mAt.y, z: mAt.z, width: mouth.width * k0 };
    if (main.neck) torsoPrims.push(cap(main.neck, main.p, 0.24 * k0, c.body!, 0.08));
    low = main.p.y - R0.y;
    slots.forEach((sl, i) => {
      if (i === 0) return;
      const k = R0.clone().multiplyScalar(sl.k).divide(h.r);
      const prims: Prim[] = [];
      if (H.arms) {
        const col = i % 2 ? c.accent! : c.accent2!;
        if (sl.neck) torsoPrims.push(cap(sl.neck, sl.p, 0.16, col, 0.08));
        prims.push(...snakeHead(sl.p, sl.k, col, c));
      } else {
        if (sl.neck) torsoPrims.push(cap(sl.neck, sl.p, 0.24 * k0, c.body!, 0.08));
        prims.push(...template.map((p) => place(p, hc, k, sl.p)));
        const f = headFace(sl.p, k, hc, face0.eyes, face0.mouth, c, H.faces === 'full');
        prims.push(...f.prims);
        allMarks.push(...f.marks);
        if (H.cluster) allMarks.push(...eggCracks3d(sl.p, R0.clone().multiplyScalar(sl.k), c));
      }
      const name = `head${i + 1}`;
      newParts.push({
        name,
        pivot: sl.p.clone(),
        prims,
        box: boxOf(prims),
        resolution: 80,
      });
      bobbers.push({ name, phase: i / H.count });
      low = Math.min(low, sl.p.y - R0.y * sl.k);
    });
    if (H.cluster) allMarks.push(...eggCracks3d(mainAt, R0, c));
  } else headPrims = [...headPrims, ...halo];
  // A ghost's hands (R0416): big, apart from the body, each its own part so it can drift.
  const handNames: string[] = [];
  if (parts.includes('ghostHands'))
    for (const s of [-1, 1]) {
      const at = V(s * (Math.max(b.r.x, h.r.x * 0.8) + 0.95), b.y + 0.45, 0.3);
      const prims: Prim[] = [
        sphere(at, 0.35, c.body!, 0.03),
        sphere(at.clone().add(V(s * 0.05, 0.32, 0.06)), 0.12, c.body!, 0.03),
        ...[-0.17, 0, 0.17].map((y) =>
          sphere(at.clone().add(V(s * 0.33, y, 0.04)), 0.13, c.body!, 0.03),
        ),
      ];
      const name = s < 0 ? 'ghostL' : 'ghostR';
      handNames.push(name);
      newParts.push({ name, pivot: at.clone(), prims, box: boxOf(prims), resolution: 48 });
    }
  let dropY = 0;
  // A ball with no arms or legs is all head, as in the pixel view: the round plan's little
  // body tucks inside it and the whole figure drops until the ball (or the lowest of its
  // heads) rests on the ground.
  if (orb) {
    const dy = 0.02 - low;
    dropY = dy;
    const down = (v: THREE.Vector3) => V(v.x, v.y + dy, v.z);
    const move = (p: Prim): Prim => ({ ...p, a: down(p.a), ...(p.b ? { b: down(p.b) } : {}) });
    const body = spec.torso.prims[0]!;
    torsoPrims = [
      { ...body, a: mainAt.clone(), radii: mainR.clone().multiplyScalar(0.6) },
      ...torso,
    ].map(move);
    headPrims = headPrims.map(move);
    allMarks = allMarks.map((m) => ({ ...m, a: down(m.a), ...(m.b ? { b: down(m.b) } : {}) }));
    headPivot = down(headPivot);
    eyes = { ...eyes, y: eyes.y + dy };
    mouth = { ...mouth, y: mouth.y + dy };
    newParts = newParts.map((p) => {
      const prims = p.prims.map(move);
      return { ...p, pivot: down(p.pivot), prims, box: boxOf(prims) };
    });
  }
  if (H?.mound) {
    // The dirt the heads pop out of: a low dome on the ground round them all.
    const all = [...headPrims, ...newParts.flatMap((p) => p.prims)];
    const wide = Math.max(...all.map((p) => Math.abs(p.a.x) + (p.radii?.x ?? p.r))) * 1.08;
    const dirt = color(C.sandDeep);
    torsoPrims.push(
      ell(V(0, 0, mainAt.z), V(wide, 0.42, mainR.z * 1.5), dirt, 0.05),
      ...[-0.8, -0.3, 0.35, 0.85].map((x, i) =>
        sphere(
          V(x * wide, 0.12 + (i % 2) * 0.08, mainAt.z + mainR.z * 1.2),
          0.09,
          color(C.sand),
          0.02,
        ),
      ),
    );
  }
  const hooks: ExtrasHook[] = [];
  const bob = bobbers.length
    ? (rig: RigContext) => {
        // Each head bobs on its own neck, out of step with the others.
        const heads = bobbers.map((b) => ({
          ...b,
          g: rig.bones[b.name],
          y: rig.bones[b.name]?.position.y ?? 0,
        }));
        return (t: number, pose: PoseName) => {
          const amp = pose === 'sleep' ? 0.02 : 0.05;
          for (const b of heads) {
            if (!b.g) continue;
            const w = Math.PI * 2 * (t * HEAD_BOB_HZ + b.phase);
            b.g.position.y = b.y + Math.sin(w) * amp;
            b.g.rotation.z = Math.sin(w + 0.8) * 0.07;
            b.g.rotation.x = Math.sin(w * 0.5) * 0.04;
          }
          const main = rig.bones.head;
          if (main) main.position.y += Math.sin(Math.PI * 2 * t * HEAD_BOB_HZ) * amp;
        };
      }
    : null;
  if (bob) hooks.push(bob);
  if (parts.includes('gas'))
    hooks.push(
      gasShell(V(mainAt.x, mainAt.y + dropY, mainAt.z).sub(headPivot), mainR.x * 1.5, c.accent!),
    );
  if (handNames.length) hooks.push(orbitHands(handNames));
  const float = parts.includes('float');
  const yMax = Math.max(
    spec.shade.yMax,
    ...headPrims.map((p) => (p.b ?? p.a).y + 0.3),
    ...newParts
      .filter((p) => p.name.startsWith('head'))
      .flatMap((p) => p.prims.map((q) => (q.b ?? q.a).y + 0.3)),
  );
  return {
    ...spec,
    torso: { ...spec.torso, prims: torsoPrims, box: boxOf(torsoPrims) },
    head: { ...spec.head, pivot: headPivot, prims: headPrims, box: boxOf(headPrims) },
    parts: newParts,
    marks: allMarks,
    eyes,
    mouth,
    shade: { ...spec.shade, yMax },
    ...(hooks.length
      ? {
          extras: hooks
            .slice(1)
            .reduce((all, hk) => chainExtras(all, hk), chainExtras(spec.extras, hooks[0]!)),
        }
      : {}),
    // A ghost rides above the ground; the contact shadow fades with the height.
    ...(float ? { gait: 'hover' as const, hover: GHOST_HOVER } : {}),
    // Necks widen the torso's box; keep the contact shadow the body's own size.
    ...(H ? { footprint: spec.footprint ?? spec.torso.box[1].x * 0.85 } : {}),
  };
}

/** How fast the heads of a many-headed species bob, cycles per second. */
const HEAD_BOB_HZ = 0.9;

type ExtrasHook = NonNullable<SpeciesSpec['extras']>;

/** Run a new extras hook after any the spec already had. */
function chainExtras(prev: SpeciesSpec['extras'], next: ExtrasHook): ExtrasHook {
  if (!prev) return next;
  return (rig) => {
    const a = prev(rig);
    const b = next(rig);
    return (t, pose) => {
      if (a) a(t, pose);
      if (b) b(t, pose);
    };
  };
}

/** Painted zigzag cracks on an egg's crown. */
function eggCracks3d(at: THREE.Vector3, R: THREE.Vector3, c: Colors): Mark[] {
  const pts = [
    [-0.55, 0.62],
    [-0.2, 0.5],
    [0.15, 0.68],
    [0.5, 0.55],
  ].map(([x, y]) => {
    const z = Math.sqrt(Math.max(0, 1 - x! * x! - y! * y!));
    return at.clone().add(V(x! * R.x, y! * R.y, z * R.z));
  });
  return pts.slice(1).map((b, i) => ({
    kind: 'capsule' as const,
    a: pts[i]!,
    b,
    r: 0.03,
    color: c.outline!,
    soft: 0,
  }));
}

/** How high a floating ghost rides, in body units (a Nubbin stands about 3.1). */
const GHOST_HOVER = 0.75;
/** How far a ghost's detached hands drift round their rest point, in body units. */
const HAND_ORBIT = 0.1;

/** A soft white puff for the gas ring: alpha only, tinted by the material. */
function gasTexture(): THREE.DataTexture {
  const n = 32;
  const data = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const r = Math.hypot(x + 0.5 - n / 2, y + 0.5 - n / 2) / (n / 2);
      // A soft round puff, gone at the rim.
      const a = r >= 1 ? 0 : (1 - r * r) ** 2;
      const i = (y * n + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(Math.min(1, a) * 255);
    }
  const tex = new THREE.DataTexture(data, n, n);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * The gas round a ghost's head (R0416): a ring of eight soft puffs, merged into one mesh
 * (one draw call), alpha-blended with no depth write (additive washed out to white over
 * the bright grass). The ring always
 * faces the camera and sits a little behind the head's centre, so it haloes the
 * silhouette from any side without crossing the face; it turns and breathes slowly.
 */
function gasShell(at: THREE.Vector3, radius: number, tint: string): ExtrasHook {
  return (rig) => {
    const head = rig.bones.head;
    if (!head) return;
    const pos: number[] = [];
    const uvs: number[] = [];
    const index: number[] = [];
    const puff = radius * 0.42;
    const ring = radius - puff * 0.75;
    for (let i = 0; i < 8; i++) {
      const t = (i / 8) * Math.PI * 2;
      const cx = Math.cos(t) * ring;
      const cy = Math.sin(t) * ring;
      const base = pos.length / 3;
      for (const [x, y] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ] as const) {
        pos.push(cx + x * puff, cy + y * puff, 0);
        uvs.push((x + 1) / 2, (y + 1) / 2);
      }
      index.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(index);
    const mat = new THREE.MeshBasicMaterial({
      map: gasTexture(),
      color: new THREE.Color(tint),
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      fog: false,
    });
    const gas = new THREE.Mesh(geo, mat);
    gas.renderOrder = 2;
    gas.frustumCulled = false;
    head.add(gas);
    const centre = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const toCam = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const spinQ = new THREE.Quaternion();
    const zAxis = new THREE.Vector3(0, 0, 1);
    let spin = 0;
    let breath = 1;
    // Billboard at draw time: the renderer builds the model-view matrix right after this.
    gas.onBeforeRender = (_r, _s, camera) => {
      head.getWorldScale(scale);
      centre.copy(at);
      head.localToWorld(centre);
      toCam.setFromMatrixPosition(camera.matrixWorld).sub(centre).normalize();
      centre.addScaledVector(toCam, -radius * 0.35 * scale.x);
      q.copy(camera.quaternion).multiply(spinQ.setFromAxisAngle(zAxis, spin));
      gas.matrixWorld.compose(centre, q, scale.multiplyScalar(breath));
    };
    return (t) => {
      spin = t * 0.35;
      breath = 1 + Math.sin(t * 1.7) * 0.05;
      mat.opacity = 0.75 + Math.sin(t * 2.3) * 0.12;
    };
  };
}

/** A ghost's detached hands drift in small circles, each out of step with the other. */
function orbitHands(names: readonly string[]): ExtrasHook {
  return (rig) => {
    const hands = names.map((n, i) => ({
      g: rig.bones[n],
      at: rig.bones[n]?.position.clone() ?? new THREE.Vector3(),
      s: i % 2 ? 1 : -1,
    }));
    return (t) => {
      for (const h of hands) {
        if (!h.g) continue;
        const w = Math.PI * 2 * (t * 0.6 + (h.s > 0 ? 0.5 : 0));
        h.g.position.set(
          h.at.x + Math.cos(w) * HAND_ORBIT * h.s,
          h.at.y + Math.sin(w) * HAND_ORBIT,
          h.at.z + Math.sin(w) * HAND_ORBIT * 0.5,
        );
        h.g.rotation.z = Math.sin(w) * 0.15 * h.s;
      }
    };
  };
}
