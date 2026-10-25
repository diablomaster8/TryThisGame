import * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import { C, color } from '../render/sprites/palette';
import { V, type Prim } from '../samples/sculpted';
import type { Mark, PartSpec, SpeciesSpec } from '../samples/species';
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

/** A small extra head with bead eyes and, for the birds, a beak. */
function miniHead(at: THREE.Vector3, r: THREE.Vector3, c: Colors, beak: boolean): Prim[] {
  const out: Prim[] = [ell(at, r, c.body!, 0.05)];
  for (const s of [-1, 1])
    out.push(sphere(at.clone().add(V(s * r.x * 0.38, r.y * 0.1, r.z * 0.88)), 0.07, c.eye!, 0.01));
  if (beak)
    out.push(
      cone(
        at.clone().add(V(0, -r.y * 0.15, r.z * 0.8)),
        at.clone().add(V(0, -r.y * 0.25, r.z * 1.5)),
        0.13,
        0.02,
        c.accent!,
      ),
    );
  return out;
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
  if (parts.length === 0) return spec;
  const h = L.head;
  const b = L.body;
  const top = h.y + h.r.y;
  const head: Prim[] = [];
  const torso: Prim[] = [];
  const marks: Mark[] = [];
  const handProps: Array<(hand: THREE.Vector3, s: number) => Prim[]> = [];
  const beak = parts.includes('beak');
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
          head.push(
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
        for (const [x, y, z, r] of [
          [0.55, 0.42, -0.85, 0.42],
          [0.95, 0.55, -1.35, 0.36],
          [1.05, 0.75, -1.8, 0.3],
          [-0.5, 0.4, -0.5, 0.38],
        ] as const)
          torso.push(sphere(V(x, y, z), r, c.body!, 0.06));
        break;
      case 'backShell':
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
      case 'twin':
      case 'triple': {
        const r = h.r.clone().multiplyScalar(part === 'triple' ? 0.62 : 0.7);
        const sides = part === 'twin' ? [1] : [-1, 1];
        for (const s of sides)
          head.push(
            ...miniHead(
              V(s * (h.r.x + r.x * 0.75), h.y + (part === 'triple' ? 0.35 : 0), h.z - 0.1),
              r,
              c,
              beak,
            ),
          );
        break;
      }
      case 'cluster':
        for (const [x, y, z] of [
          [-0.95, -0.35, 0.15],
          [0.95, -0.35, 0.15],
          [-0.6, 0.55, -0.3],
          [0.6, 0.55, -0.3],
          [0, 0.85, -0.4],
        ] as const)
          head.push(...miniHead(V(x, h.y + y, h.z + z), V(0.42, 0.48, 0.42), c, false));
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
            sphere(V(0, b.y + 0.15, z + 0.12), 0.24, c.body!, 0.03),
            sphere(V(-0.08, b.y + 0.18, z + 0.34), 0.04, c.eye!, 0.01),
            sphere(V(0.08, b.y + 0.18, z + 0.34), 0.04, c.eye!, 0.01),
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
  // A ball with no arms or legs is all head, as in the pixel view: the round plan's little
  // body tucks inside it and the whole figure drops until the ball rests on the ground.
  if (orb) {
    const dy = h.r.y + 0.02 - h.y;
    const down = (v: THREE.Vector3) => V(v.x, v.y + dy, v.z);
    const move = (p: Prim): Prim => ({ ...p, a: down(p.a), ...(p.b ? { b: down(p.b) } : {}) });
    const body = spec.torso.prims[0]!;
    torsoPrims = [
      { ...body, a: V(0, h.y, h.z), radii: h.r.clone().multiplyScalar(0.6) },
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
  const yMax = Math.max(spec.shade.yMax, ...headPrims.map((p) => (p.b ?? p.a).y + 0.3));
  return {
    ...spec,
    torso: { ...spec.torso, prims: torsoPrims, box: boxOf(torsoPrims) },
    head: { ...spec.head, pivot: headPivot, prims: headPrims, box: boxOf(headPrims) },
    parts: newParts,
    marks: allMarks,
    eyes,
    mouth,
    shade: { ...spec.shade, yMax },
  };
}
