import type * as THREE from 'three';
import { PART_STYLES, type PartStyle } from '../render/sprites/parts';
import { C, color, mixHex } from '../render/sprites/palette';
import { ALL_PART_SLOTS, partStepScale, type PartStep } from '../render/sprites/part-size';
import { PART_SIZE } from '../config/tuning-look';
import type { AnyPartSlot, NubbinParts } from '../sim/types';
import { V, type Prim } from './sculpted';
import type { Mark } from './species';
import { variant, type Slot } from './nubbin-variants';
import type { PartSpec, SpeciesSpec } from './species';
import { NUBBIN_SPEC } from './species-data';

/**
 * Critter parts in 3D: the sculpted counterpart of the pixel drawer's `PART_STYLES`. Each part
 * id maps to a shape, a colour and an accent (palette indices); every shape here is a few plain
 * primitives, so a part goes through the sculpt workers and the geometry cache like any body
 * part and needs no named rule. Parts are placed from the spec they are added to (the head's
 * dome, the shoulders, the belly), so they sit right on a grown head, a lifted Run form or a
 * character look. Ears hang as `earL`/`earR` (one crest or tuft as `earCrest`), the tail as
 * `tail` and arms as `armL`/`armR`, so the stock poses flick, wag and swing them; a back part
 * replaces the little wings, as in the pixel view. R0401's slots: legs re-shape the stock
 * legs' feet (the knee and the foot planting stay), wings hang as `wingL`/`wingR` in place of
 * the little wings, and a horn or face piece is sculpted into the head so it turns with it
 * (a mask is a mark).
 */

/** Slot order in a `~parts:` look-key modifier (the pixel sheet key uses the same order). */
export const PART_SLOTS: readonly AnyPartSlot[] = ALL_PART_SLOTS;

type Vec = THREE.Vector3;

interface Ellipse {
  c: Vec;
  rx: number;
  ry: number;
  rz: number;
}

/** The ellipsoid a part list is built around: the prim with this tag, else the box. */
function ellipseOf(prims: Prim[], tag: string, box: [Vec, Vec]): Ellipse {
  const p = prims.find((q) => q.tag === tag);
  if (p?.radii) return { c: p.a, rx: p.radii.x, ry: p.radii.y, rz: p.radii.z };
  if (p) return { c: p.a, rx: p.r, ry: p.r, rz: p.r };
  const [lo, hi] = box;
  const c = lo.clone().add(hi).multiplyScalar(0.5);
  return { c, rx: (hi.x - lo.x) * 0.37, ry: (hi.y - lo.y) * 0.3, rz: (hi.z - lo.z) * 0.35 };
}

export const headDome = (spec: SpeciesSpec): Ellipse =>
  ellipseOf(spec.head.prims, 'head', spec.head.box);
export const bellyOf = (spec: SpeciesSpec): Ellipse =>
  ellipseOf(spec.torso.prims, 'belly', spec.torso.box);

/** A box around the primitives with room for the blend and the marching margin. */
function boxOf(prims: Prim[], pad = 0.2): [Vec, Vec] {
  const lo = V(Infinity, Infinity, Infinity);
  const hi = V(-Infinity, -Infinity, -Infinity);
  for (const p of prims) {
    const r =
      p.kind === 'torus' ? p.r + (p.r2 ?? 0.1) : Math.max(p.r, p.kind === 'cone' ? (p.r2 ?? 0) : 0);
    const e = p.radii ? p.radii.clone() : V(r, r, r);
    e.addScalar(pad);
    for (const at of p.b ? [p.a, p.b] : [p.a]) {
      lo.min(at.clone().sub(e));
      hi.max(at.clone().add(e));
    }
  }
  return [lo, hi];
}

const part = (name: string, pivot: Vec, prims: Prim[], resolution = 40): PartSpec => ({
  name,
  pivot,
  prims,
  box: boxOf(prims),
  resolution,
});

const sphere = (a: Vec, r: number, col: string, tag: string, blend?: number): Prim => ({
  kind: 'sphere',
  a,
  r,
  color: col,
  tag,
  ...(blend !== undefined ? { blend } : {}),
});
const ellipsoid = (a: Vec, radii: Vec, col: string, tag: string, blend?: number): Prim => ({
  kind: 'ellipsoid',
  a,
  r: 0,
  radii,
  color: col,
  tag,
  ...(blend !== undefined ? { blend } : {}),
});
const capsule = (a: Vec, b: Vec, r: number, col: string, tag: string, blend?: number): Prim => ({
  kind: 'capsule',
  a,
  b,
  r,
  color: col,
  tag,
  ...(blend !== undefined ? { blend } : {}),
});
const cone = (
  a: Vec,
  b: Vec,
  r: number,
  r2: number,
  col: string,
  tag: string,
  blend = 0.04,
): Prim => ({ kind: 'cone', a, b, r, r2, color: col, tag, blend });

/** A point offset from `o` by (x, y, z) times `s`. */
const at = (o: Vec, x: number, y: number, z: number, s = 1): Vec =>
  V(o.x + x * s, o.y + y * s, o.z + z * s);

// ---- ears: on the head's dome, scaled with it ----

function ears(spec: SpeciesSpec, st: PartStyle): PartSpec[] {
  const d = headDome(spec);
  const s = d.rx / 0.74;
  const col = color(st.color);
  const acc = color(st.accent);
  const top = at(d.c, 0, d.ry * 0.86, -d.rz * 0.28);
  // One crest or tuft on top of the head, as the pixel drawer does.
  if (st.shape === 'crest') {
    const prims: Prim[] = [];
    for (const i of [-1, 0, 1]) {
      const tip = at(top, i * 0.3, 0.55 + 0.1 * Math.abs(i), -0.15, s);
      prims.push(cone(top.clone(), tip, 0.1 * s, 0.03 * s, col, 'crest', 0.05));
      prims.push(sphere(tip, 0.07 * s, acc, 'crest', 0.02));
    }
    return [part('earCrest', top.clone(), prims)];
  }
  if (st.shape === 'tuft') {
    return [
      part('earCrest', top.clone(), [
        sphere(at(top, -0.1, 0.05, 0, s), 0.24 * s, col, 'crest', 0.08),
        sphere(at(top, 0.16, 0.12, 0.05, s), 0.17 * s, acc, 'crest', 0.06),
      ]),
    ];
  }
  return [-1, 1].map((dx) => {
    const name = dx < 0 ? 'earL' : 'earR';
    const root = at(d.c, dx * d.rx * 0.6, d.ry * 0.62, -d.rz * 0.08);
    let prims: Prim[];
    switch (st.shape) {
      case 'long': {
        const b = at(d.c, dx * d.rx * 0.42, d.ry * 0.82, -d.rz * 0.1);
        const t = at(b, dx * 0.28, 0.95, -0.12, s);
        prims = [
          capsule(b, t, 0.15 * s, col, 'ear', 0.05),
          capsule(at(b, 0, 0.14, 0.1, s), at(t, 0, -0.12, 0.08, s), 0.075 * s, acc, 'ear', 0.02),
        ];
        break;
      }
      case 'pointed': {
        const b = at(d.c, dx * d.rx * 0.5, d.ry * 0.75, -d.rz * 0.05);
        prims = [
          cone(b, at(b, dx * 0.42, 0.6, -0.1, s), 0.32 * s, 0.03 * s, col, 'ear'),
          cone(
            at(b, dx * 0.02, 0.1, 0.17, s),
            at(b, dx * 0.38, 0.5, 0.05, s),
            0.2 * s,
            0.02,
            acc,
            'ear',
            0.02,
          ),
        ];
        break;
      }
      case 'horn': {
        // A sheep's curl: three shrinking segments round and down, a pale tip.
        const p0 = at(d.c, dx * d.rx * 0.62, d.ry * 0.55, -d.rz * 0.15);
        const p1 = at(p0, dx * 0.18, 0.22, -0.12, s);
        const p2 = at(p1, dx * 0.2, -0.15, -0.05, s);
        const p3 = at(p2, dx * 0.02, -0.22, 0.12, s);
        prims = [
          capsule(p0, p1, 0.16 * s, col, 'ear', 0.05),
          capsule(p1.clone(), p2, 0.13 * s, col, 'ear', 0.04),
          capsule(p2.clone(), p3, 0.1 * s, col, 'ear', 0.04),
          sphere(p3.clone(), 0.09 * s, acc, 'ear', 0.02),
        ];
        break;
      }
      case 'fluffy': {
        // A koala's big round ear, a pale fluffy middle.
        const c = at(d.c, dx * d.rx * 0.88, d.ry * 0.6, -d.rz * 0.1);
        prims = [
          sphere(c, 0.36 * s, col, 'ear', 0.05),
          ellipsoid(at(c, 0, 0, 0.24, s), V(0.22 * s, 0.22 * s, 0.08 * s), acc, 'ear', 0.02),
        ];
        break;
      }
      default: {
        // round: a ball ear with a disc of the accent on its face.
        const c = at(d.c, dx * d.rx * 0.8, d.ry * 0.74, -d.rz * 0.12);
        prims = [
          sphere(c, 0.27 * s, col, 'ear', 0.05),
          ellipsoid(at(c, 0, 0, 0.2, s), V(0.15 * s, 0.15 * s, 0.06 * s), acc, 'ear', 0.02),
        ];
      }
    }
    return part(name, root, prims);
  });
}

// ---- tail: from the back of the belly ----

function tail(spec: SpeciesSpec, st: PartStyle): PartSpec[] {
  const b = bellyOf(spec);
  const s = b.rx / 0.72;
  const col = color(st.color);
  const acc = color(st.accent);
  const r = at(b.c, 0, -b.ry * 0.05, -b.rz * 0.85);
  let prims: Prim[];
  switch (st.shape) {
    case 'stub':
      prims = [
        cone(r, at(r, 0, 0.12, -0.42, s), 0.16 * s, 0.05 * s, col, 'tail', 0.06),
        sphere(at(r, 0, 0.13, -0.3, s), 0.07 * s, acc, 'tail', 0.02),
      ];
      break;
    case 'fin':
      prims = [
        capsule(r, at(r, 0, 0.04, -0.32, s), 0.12 * s, col, 'tail', 0.06),
        ellipsoid(at(r, 0, 0.06, -0.45, s), V(0.32 * s, 0.06 * s, 0.16 * s), col, 'tail', 0.05),
        ellipsoid(at(r, 0, 0.1, -0.42, s), V(0.12 * s, 0.03 * s, 0.08 * s), acc, 'tail', 0.02),
      ];
      break;
    case 'long': {
      const p1 = at(r, 0, -0.06, -0.45, s);
      const p2 = at(r, 0, 0.25, -0.8, s);
      const p3 = at(r, 0, 0.7, -0.88, s);
      prims = [
        capsule(r, p1, 0.1 * s, col, 'tail', 0.06),
        capsule(p1.clone(), p2, 0.1 * s, col, 'tail', 0.04),
        capsule(p2.clone(), p3, 0.1 * s, col, 'tail', 0.04),
        // The accent as a band halfway and the tip.
        sphere(p2.clone(), 0.115 * s, acc, 'tail', 0.02),
        sphere(p3.clone(), 0.125 * s, acc, 'tail', 0.02),
      ];
      break;
    }
    case 'bushy': {
      const p1 = at(r, 0, 0.25, -0.45, s);
      const p2 = at(r, 0, 0.78, -0.58, s);
      prims = [
        capsule(r, p1, 0.2 * s, col, 'tail', 0.08),
        capsule(p1.clone(), p2, 0.27 * s, col, 'tail', 0.06),
        sphere(at(r, 0, 0.45, -0.5, s), 0.285 * s, acc, 'tail', 0.02),
        sphere(at(r, 0, 0.7, -0.56, s), 0.28 * s, acc, 'tail', 0.02),
      ];
      break;
    }
    case 'fork':
      // A swallow's forked tail: two long flat points, pale at the tips.
      prims = [-1, 1].flatMap((dx) => {
        const tip = at(r, dx * 0.32, -0.1, -0.85, s);
        return [
          capsule(r, tip, 0.07 * s, col, 'tail', 0.05),
          sphere(tip.clone(), 0.08 * s, acc, 'tail', 0.02),
        ];
      });
      break;
    case 'plume':
      // Three long tail feathers fanning down and out behind.
      prims = [-1, 0, 1].flatMap((i) => {
        const tip = at(r, i * 0.3, -0.25 + 0.15 * Math.abs(i), -1.0, s);
        return [
          capsule(r, tip, 0.065 * s, col, 'tail', 0.05),
          sphere(tip.clone(), 0.1 * s, acc, 'tail', 0.02),
        ];
      });
      break;
    default:
      // puff: a round cotton tail with a paler tuft standing off it.
      prims = [
        sphere(at(r, 0, 0.05, -0.16, s), 0.24 * s, col, 'tail', 0.06),
        sphere(at(r, -0.08, 0.16, -0.3, s), 0.12 * s, acc, 'tail', 0.03),
      ];
  }
  return [part('tail', r.clone(), prims)];
}

// ---- arms: from the spec's own shoulders, replacing the mitts ----

function arms(spec: SpeciesSpec, st: PartStyle): PartSpec[] {
  const col = color(st.color);
  const acc = color(st.accent);
  const right = spec.parts.find((p) => p.name === 'armR');
  const shoulderR = right?.pivot ?? V(0.6, 1.02, 0.1);
  const handR = right?.prims.find((p) => p.tag === 'hand')?.a ?? at(shoulderR, 0.43, -0.29, 0.12);
  return [-1, 1].map((dx) => {
    const sh = V(dx * Math.abs(shoulderR.x), shoulderR.y, shoulderR.z);
    const h = V(dx * Math.abs(handR.x), handR.y, handR.z);
    let prims: Prim[];
    switch (st.shape) {
      case 'flipper': {
        const mid = sh.clone().lerp(h, 0.6);
        const pad = at(h, dx * 0.08, -0.03, 0.04);
        prims = [
          capsule(sh.clone(), mid, 0.14, col, 'arm'),
          ellipsoid(pad, V(0.3, 0.08, 0.22), col, 'hand', 0.06),
          ellipsoid(at(pad, 0, 0.04, 0), V(0.18, 0.05, 0.13), acc, 'hand', 0.02),
        ];
        break;
      }
      case 'big': {
        const fist = at(h, dx * 0.05, -0.03, 0.02);
        prims = [
          capsule(sh.clone(), h.clone(), 0.21, col, 'arm'),
          sphere(fist, 0.3, col, 'hand', 0.06),
          ellipsoid(at(fist, 0, 0.04, 0.24), V(0.18, 0.1, 0.08), acc, 'hand', 0.02),
        ];
        break;
      }
      default:
        // paw: a round paw with three pads on its face.
        prims = [
          capsule(sh.clone(), h.clone(), 0.15, col, 'arm'),
          sphere(h.clone(), 0.22, col, 'hand', 0.06),
          ...[-1, 0, 1].map((k) => sphere(at(h, k * 0.09, -0.05, 0.19), 0.055, acc, 'hand', 0.02)),
        ];
    }
    return part(dx < 0 ? 'armL' : 'armR', sh, prims, 48);
  });
}

// ---- back: wings or a feather fan between the shoulder blades ----

function back(spec: SpeciesSpec, st: PartStyle, name = 'back'): PartSpec[] {
  const b = bellyOf(spec);
  const col = color(st.color);
  const acc = color(st.accent);
  const ink = color(C.ink);
  if (st.shape === 'shell') {
    // A turtle's shell: a dome over the back with three paler scutes.
    const c = at(b.c, 0, b.ry * 0.1, -b.rz * 0.45);
    return [
      part('backShell', c.clone(), [
        ellipsoid(c, V(b.rx * 1.02, b.ry * 0.95, b.rz * 0.62), col, 'shell', 0.04),
        ...[-1, 0, 1].map((i) =>
          ellipsoid(
            at(c, i * b.rx * 0.45, i === 0 ? b.ry * 0.25 : -b.ry * 0.05, -b.rz * 0.58),
            V(0.2, 0.17, 0.06),
            acc,
            'shell',
            0.02,
          ),
        ),
      ]),
    ];
  }
  return [-1, 1].map((dx) => {
    const a = at(b.c, dx * b.rx * 0.3, b.ry * 0.45, -b.rz * 0.75);
    let prims: Prim[];
    if (st.shape === 'feathers') {
      prims = [0, 1, 2].flatMap((i) => {
        const tip = at(a, dx * (0.35 + 0.18 * i), 0.75 - 0.22 * i, -0.25);
        return [
          capsule(a.clone(), tip, 0.045, col, 'feather', 0.03),
          sphere(tip.clone(), 0.12, acc, 'feather', 0.02),
          sphere(at(tip, 0, 0, -0.08), 0.05, ink, 'feather', 0.01),
        ];
      });
    } else if (st.shape === 'bat') {
      // A membrane wing between three finger bones, the edge scalloped by the gaps.
      prims = [
        ellipsoid(at(a, dx * 0.5, 0.25, -0.12), V(0.5, 0.32, 0.05), col, 'feather', 0.06),
        ...[0.75, 0.45, 0.1].map((y) =>
          capsule(
            at(a, dx * 0.08, 0.1, -0.08),
            at(a, dx * 0.95, y, -0.16),
            0.04,
            acc,
            'feather',
            0.02,
          ),
        ),
      ];
    } else {
      prims = [
        ellipsoid(at(a, dx * 0.45, 0.3, -0.12), V(0.42, 0.3, 0.06), col, 'feather', 0.06),
        ellipsoid(at(a, dx * 0.75, 0.55, -0.15), V(0.22, 0.16, 0.05), col, 'feather', 0.05),
        capsule(
          at(a, dx * 0.1, 0.1, -0.08),
          at(a, dx * 0.85, 0.62, -0.16),
          0.045,
          acc,
          'feather',
          0.02,
        ),
      ];
      // A phoenix's wing burns at its tips.
      if (st.shape === 'flame')
        prims.push(
          sphere(at(a, dx * 0.85, 0.62, -0.16), 0.1, acc, 'feather', 0.02),
          sphere(at(a, dx * 0.95, 0.3, -0.15), 0.08, acc, 'feather', 0.02),
        );
    }
    return part(dx < 0 ? `${name}L` : `${name}R`, a, prims);
  });
}

// ---- legs (R0401): the stock legs re-shaped at the foot; hooves and paws furred to the knee ----

const clonePrim = (q: Prim, col = q.color): Prim => ({
  ...q,
  a: q.a.clone(),
  ...(q.b ? { b: q.b.clone() } : {}),
  ...(q.radii ? { radii: q.radii.clone() } : {}),
  color: col,
});

/** The new foot, its sole on the ground where the stock foot's was. */
function footPrims(stock: Prim | undefined, fallback: Vec, st: PartStyle, k: number): Prim[] {
  const col = color(st.color);
  const acc = color(st.accent);
  const c = stock ? stock.a.clone() : fallback;
  const sole = c.y - (stock?.radii?.y ?? 0.12);
  const on = (ry: number, dz = 0): Vec => V(c.x, sole + ry * k, c.z + dz * k);
  const toes = (ry: number, z: number, r: number): Prim[] =>
    [-1, 0, 1].map((i) => sphere(at(on(ry, z), i * 0.12, 0, 0, k), r * k, acc, 'foot', 0.02));
  switch (st.shape) {
    case 'webbed':
      return [
        ellipsoid(on(0.08, 0.08), V(0.27 * k, 0.08 * k, 0.33 * k), col, 'foot', 0.08),
        ...toes(0.06, 0.36, 0.055),
      ];
    case 'hoof':
      return [ellipsoid(on(0.15), V(0.18 * k, 0.15 * k, 0.2 * k), acc, 'foot', 0.06)];
    case 'bigfoot':
      return [
        ellipsoid(on(0.11, 0.16), V(0.2 * k, 0.11 * k, 0.42 * k), col, 'foot', 0.08),
        ellipsoid(on(0.03, 0.3), V(0.11 * k, 0.04 * k, 0.16 * k), acc, 'foot', 0.02),
      ];
    case 'flipper':
      return [
        ellipsoid(on(0.06, 0.1), V(0.3 * k, 0.06 * k, 0.33 * k), col, 'foot', 0.08),
        capsule(on(0.1, -0.05), on(0.1, 0.32), 0.035 * k, acc, 'foot', 0.02),
      ];
    default:
      // paw: a round paw with three toe pads in front.
      return [
        ellipsoid(on(0.13, 0.04), V(0.23 * k, 0.13 * k, 0.27 * k), col, 'foot', 0.08),
        ...toes(0.07, 0.27, 0.06),
      ];
  }
}

/** The legs re-shaped: the joint and its planting stay, the foot changes size with `k`. */
function legs(spec: SpeciesSpec, st: PartStyle, k: number): PartSpec[] {
  const fur = st.shape === 'hoof' || st.shape === 'paw' ? color(st.color) : null;
  const recol = (q: Prim): Prim => clonePrim(q, fur && q.tag === 'leg' ? fur : q.color);
  return spec.parts
    .filter((p) => p.name === 'legL' || p.name === 'legR')
    .map((p) => {
      const j = p.joint;
      if (!j) return { ...p, prims: p.prims.map(recol) };
      const stock = j.prims.find((q) => q.tag === 'foot');
      const prims = [
        ...j.prims.filter((q) => q.tag !== 'foot').map(recol),
        ...footPrims(stock, j.pivot.clone().add(V(0, -0.16, 0.1)), st, k),
      ];
      return {
        ...p,
        prims: p.prims.map(recol),
        joint: { ...j, pivot: j.pivot.clone(), prims, box: boxOf(prims) },
      };
    });
}

// ---- horn and face (R0401): sculpted into the head, so they turn and nod with it ----

const mouthOf = (spec: SpeciesSpec): Vec => V(spec.mouth.x, spec.mouth.y, spec.mouth.z);

function horn(spec: SpeciesSpec, st: PartStyle, k: number): Prim[] {
  const d = headDome(spec);
  const s = (d.rx / 0.82) * k;
  const col = color(st.color);
  const acc = color(st.accent);
  switch (st.shape) {
    case 'tusks': {
      const m = mouthOf(spec);
      return [-1, 1].flatMap((dx) => {
        const b = at(m, dx * 0.24, 0.0, -0.06, s);
        const t = at(b, dx * 0.1, 0.24, 0.1, s);
        return [
          cone(b, t, 0.075 * s, 0.015 * s, col, 'horn', 0.03),
          sphere(t, 0.03 * s, acc, 'horn', 0.01),
        ];
      });
    }
    case 'antlers':
      return [-1, 1].flatMap((dx) => {
        const b = at(d.c, dx * d.rx * 0.38, d.ry * 0.82, d.rz * 0.05);
        const p1 = at(b, dx * 0.22, 0.42, -0.04, s);
        const p2 = at(p1, dx * 0.22, 0.34, -0.1, s);
        const br = at(p1, -dx * 0.06, 0.36, 0.14, s);
        return [
          capsule(b, p1, 0.06 * s, col, 'horn', 0.04),
          capsule(p1.clone(), p2, 0.05 * s, col, 'horn', 0.02),
          capsule(p1.clone(), br, 0.045 * s, col, 'horn', 0.02),
          sphere(p2.clone(), 0.055 * s, acc, 'horn', 0.01),
          sphere(br.clone(), 0.05 * s, acc, 'horn', 0.01),
        ];
      });
    case 'horns':
      // A dragon's pair, swept back off the brow.
      return [-1, 1].flatMap((dx) => {
        const b = at(d.c, dx * d.rx * 0.42, d.ry * 0.76, d.rz * 0.18);
        const t = at(b, dx * 0.16, 0.38, -0.4, s);
        return [
          cone(b, t, 0.13 * s, 0.02 * s, col, 'horn', 0.04),
          sphere(t, 0.035 * s, acc, 'horn', 0.01),
        ];
      });
    default: {
      // unihorn: one horn up and a little forward from the brow, banded with the accent.
      const b = at(d.c, 0, d.ry * 0.6, d.rz * 0.62);
      const t = at(b, 0, 0.78, 0.24, s);
      return [
        cone(b, t, 0.13 * s, 0.015 * s, col, 'horn', 0.04),
        ...[0.3, 0.55, 0.78].map((u) =>
          sphere(b.clone().lerp(t, u), 0.13 * s * (1 - u) + 0.012, acc, 'horn', 0.01),
        ),
      ];
    }
  }
}

function face(spec: SpeciesSpec, st: PartStyle, k: number): Prim[] {
  const m = mouthOf(spec);
  const s = (headDome(spec).rx / 0.82) * k;
  const col = color(st.color);
  const acc = color(st.accent);
  switch (st.shape) {
    case 'beak':
      return [
        cone(at(m, 0, 0.05, -0.06, s), at(m, 0, -0.02, 0.36, s), 0.17 * s, 0.03 * s, col, 'beak'),
        cone(at(m, 0, -0.05, -0.04, s), at(m, 0, -0.07, 0.24, s), 0.1 * s, 0.02 * s, acc, 'beak'),
      ];
    case 'hook': {
      const mid = at(m, 0, 0.06, 0.26, s);
      return [
        cone(at(m, 0, 0.06, -0.06, s), mid, 0.2 * s, 0.1 * s, col, 'beak'),
        cone(mid.clone(), at(m, 0, -0.16, 0.36, s), 0.1 * s, 0.02 * s, acc, 'beak', 0.03),
      ];
    }
    case 'snout':
      return [
        ellipsoid(at(m, 0, 0.04, 0.06, s), V(0.27 * s, 0.18 * s, 0.22 * s), col, 'snout', 0.08),
        sphere(at(m, 0, 0.12, 0.26, s), 0.075 * s, acc, 'snout', 0.02),
      ];
    case 'nose':
      return [
        ellipsoid(at(m, 0, 0.14, 0.04, s), V(0.13 * s, 0.17 * s, 0.09 * s), col, 'snout', 0.05),
      ];
    case 'whiskers':
      return [
        sphere(at(m, 0, 0.08, 0.04, s), 0.065 * s, acc, 'snout', 0.03),
        ...[-1, 1].flatMap((dx) =>
          [-0.03, 0.06].map((dy) =>
            capsule(
              at(m, dx * 0.14, dy, 0.02, s),
              at(m, dx * 0.55, dy * 1.8, -0.1, s),
              0.028 * s,
              acc,
              'whisker',
              0.01,
            ),
          ),
        ),
      ];
    default:
      return []; // mask: painted as a mark (`maskMark`)
  }
}

/** A raccoon's mask: a dark band painted across the eyes. */
function maskMark(spec: SpeciesSpec, st: PartStyle): Mark {
  const e = spec.eyes;
  return {
    kind: 'ellipsoid',
    a: V(0, e.y, e.z - 0.05),
    radii: V(e.x + e.r + 0.22, e.r + 0.05, 0.45),
    color: color(st.color),
    soft: 0.04,
  };
}

const BUILD: Record<
  'ears' | 'tail' | 'arms' | 'back' | 'wings',
  (spec: SpeciesSpec, st: PartStyle) => PartSpec[]
> = {
  ears,
  tail,
  arms,
  back,
  wings: (spec, st) => back(spec, st, 'wing'),
};

/** The sculpted parts for one critter part id in a slot, or null for an unknown id or a head slot. */
export function critterPart(spec: SpeciesSpec, slot: AnyPartSlot, id: string): PartSpec[] | null {
  const st = PART_STYLES[id];
  if (!st || slot === 'horn' || slot === 'face') return null;
  return slot === 'legs' ? legs(spec, st, 1) : BUILD[slot](spec, st);
}

/**
 * Parse the `~parts:` modifier body: ids in slot order ('-' for an empty slot), each with an
 * optional `@step` size (LOOK-36), and a `|t` tail when a Sun or Moon adult tints them.
 * The four-entry keys from before R0401 parse as the first four slots.
 */
export function parsePartsMod(body: string): Partial<Record<AnyPartSlot, string>> {
  const out: Partial<Record<AnyPartSlot, string>> = {};
  (body.split('|')[0] ?? '').split(',').forEach((entry, i) => {
    const slot = PART_SLOTS[i];
    const id = entry.split('@')[0];
    if (slot && id && id !== '-') out[slot] = id;
  });
  return out;
}

/** The size steps in a `~parts:` body (slots without one are left out). */
export function parsePartSteps(body: string): Partial<Record<AnyPartSlot, PartStep>> {
  const out: Partial<Record<AnyPartSlot, PartStep>> = {};
  (body.split('|')[0] ?? '').split(',').forEach((entry, i) => {
    const slot = PART_SLOTS[i];
    const step = Number(entry.split('@')[1]);
    if (slot && (step === 0 || step === 1 || step === 2)) out[slot] = step;
  });
  return out;
}

/** Whether a `~parts:` body asks for the band tint. */
export const partsTinted = (body: string): boolean => body.split('|')[1] === 't';

/** The modifier body for a Nubbin's parts ('' when every slot is empty). */
export function partsModBody(
  parts: NubbinParts,
  steps: Partial<Record<AnyPartSlot, PartStep>> = {},
  tint = false,
): string {
  if (!PART_SLOTS.some((s) => parts[s])) return '';
  const ids = PART_SLOTS.map((s) => {
    const id = parts[s];
    const step = steps[s];
    return !id ? '-' : step === undefined ? id : `${id}@${step}`;
  });
  while (ids.length > 4 && ids[ids.length - 1] === '-') ids.pop();
  return ids.join(',') + (tint ? '|t' : '');
}

/** How big a child's critter parts are against an adult's. */
export const CHILD_PART_SCALE = 0.8;

/** A part shrunk (or grown) about its own pivot, joint and all. */
function shrinkPart(p: PartSpec, k: number): PartSpec {
  const at = (v: THREE.Vector3) => v.clone().sub(p.pivot).multiplyScalar(k).add(p.pivot);
  const prim = (q: Prim): Prim => ({
    ...q,
    a: at(q.a),
    ...(q.b ? { b: at(q.b) } : {}),
    r: q.r * k,
    ...(q.r2 !== undefined ? { r2: q.r2 * k } : {}),
    ...(q.radii ? { radii: q.radii.clone().multiplyScalar(k) } : {}),
  });
  const prims = p.prims.map(prim);
  return {
    ...p,
    prims,
    box: k > 1 ? boxOf(prims) : p.box,
    ...(p.joint
      ? { joint: { ...p.joint, pivot: at(p.joint.pivot), prims: p.joint.prims.map(prim) } }
      : {}),
  };
}

/** A part's colours moved toward the body's (a Sun or Moon adult's parts, LOOK-36). */
function tintPart(p: PartSpec, body: string): PartSpec {
  const prim = (q: Prim): Prim => ({ ...q, color: mixHex(q.color, body, PART_SIZE.bandTint) });
  return {
    ...p,
    prims: p.prims.map(prim),
    ...(p.joint ? { joint: { ...p.joint, prims: p.joint.prims.map(prim) } } : {}),
  };
}

/**
 * The spec with the critter parts put on: each named slot's parts replace what the slot held
 * (a back or wings part also takes the little wings off; horn and face pieces join the head).
 * `steps` sizes each slot by its stat (LOOK-36); `tint` leans the parts toward the body colour.
 * Unknown ids are skipped.
 */
export function withCritterParts(
  base: SpeciesSpec,
  parts: Partial<Record<AnyPartSlot, string>>,
  steps: Partial<Record<AnyPartSlot, PartStep>> = {},
  tint = false,
): SpeciesSpec {
  const slots: Partial<Record<Slot, PartSpec[]>> = {};
  const headPrims: Prim[] = [];
  const hints: Mark[] = [];
  // A child wears its parts smaller and softer (LOOK-66); children keep the base Nubbin's
  // scale, which every adult form raises.
  const child = base.scale <= NUBBIN_SPEC.scale ? CHILD_PART_SCALE : 1;
  const body = tint ? base.torso.prims.find((p) => p.tag === 'belly')?.color : undefined;
  const hex = (c: string) => (body ? mixHex(c, body, PART_SIZE.bandTint) : c);
  for (const slot of PART_SLOTS) {
    const id = parts[slot];
    const st = id ? PART_STYLES[id] : undefined;
    if (!st) continue;
    const step = steps[slot];
    const k = child * (step === undefined ? 1 : partStepScale(step));
    if (slot === 'horn' || slot === 'face') {
      const prims = slot === 'horn' ? horn(base, st, k) : face(base, st, k);
      headPrims.push(...prims.map((q) => ({ ...q, color: hex(q.color) })));
      if (slot === 'face' && st.shape === 'mask') {
        const m = maskMark(base, st);
        hints.push({ ...m, color: hex(m.color) });
      }
      continue;
    }
    let built = slot === 'legs' ? legs(base, st, k) : BUILD[slot](base, st);
    if (slot !== 'legs' && k !== 1) built = built.map((p) => shrinkPart(p, k));
    if (body) built = built.map((p) => tintPart(p, body));
    if (built.length) slots[slot] = built;
  }
  if (!Object.keys(slots).length && !headPrims.length && !hints.length) return base;
  return variant(base, base.name, {
    slots,
    ...(slots.back || slots.wings ? { wings: null } : {}),
    ...(hints.length ? { hints } : {}),
    ...(headPrims.length
      ? {
          patch: (spec: SpeciesSpec) => {
            spec.head.prims.push(...headPrims);
            const [lo, hi] = boxOf(headPrims, 0.15);
            spec.head.box[0].min(lo);
            spec.head.box[1].max(hi);
          },
        }
      : {}),
  });
}
