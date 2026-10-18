import type * as THREE from 'three';
import { PART_STYLES, type PartStyle } from '../render/sprites/parts';
import { C, color } from '../render/sprites/palette';
import type { PartSlot } from '../sim/types';
import { V, type Prim } from './sculpted';
import { variant, type Slot } from './nubbin-variants';
import type { PartSpec, SpeciesSpec } from './species';

/**
 * Critter parts in 3D: the sculpted counterpart of the pixel drawer's `PART_STYLES`. Each part
 * id maps to a shape, a colour and an accent (palette indices); every shape here is a few plain
 * primitives, so a part goes through the sculpt workers and the geometry cache like any body
 * part and needs no named rule. Parts are placed from the spec they are added to (the head's
 * dome, the shoulders, the belly), so they sit right on a grown head, a lifted Run form or a
 * character look. Ears hang as `earL`/`earR` (one crest or tuft as `earCrest`), the tail as
 * `tail` and arms as `armL`/`armR`, so the stock poses flick, wag and swing them; a back part
 * replaces the little wings, as in the pixel view.
 */

/** Slot order in a `~parts:` look-key modifier (the pixel sheet key uses the same order). */
export const PART_SLOTS: readonly PartSlot[] = ['ears', 'tail', 'arms', 'back'];

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

function back(spec: SpeciesSpec, st: PartStyle): PartSpec[] {
  const b = bellyOf(spec);
  const col = color(st.color);
  const acc = color(st.accent);
  const ink = color(C.ink);
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
    }
    return part(dx < 0 ? 'backL' : 'backR', a, prims);
  });
}

const BUILD: Record<PartSlot, (spec: SpeciesSpec, st: PartStyle) => PartSpec[]> = {
  ears,
  tail,
  arms,
  back,
};

/** The sculpted parts for one critter part id in a slot, or null for an unknown id. */
export function critterPart(spec: SpeciesSpec, slot: PartSlot, id: string): PartSpec[] | null {
  const st = PART_STYLES[id];
  return st ? BUILD[slot](spec, st) : null;
}

/** Parse the `~parts:` modifier body: four ids in slot order, '-' for an empty slot. */
export function parsePartsMod(body: string): Partial<Record<PartSlot, string>> {
  const out: Partial<Record<PartSlot, string>> = {};
  body.split(',').forEach((id, i) => {
    const slot = PART_SLOTS[i];
    if (slot && id && id !== '-') out[slot] = id;
  });
  return out;
}

/** The modifier body for a Nubbin's parts ('' when every slot is empty). */
export function partsModBody(parts: Record<PartSlot, string | null>): string {
  if (!PART_SLOTS.some((s) => parts[s])) return '';
  return PART_SLOTS.map((s) => parts[s] ?? '-').join(',');
}

/**
 * The spec with the critter parts put on: each named slot's parts replace what the slot held
 * (a back part also takes the wings off). Unknown ids are skipped.
 */
export function withCritterParts(
  base: SpeciesSpec,
  parts: Partial<Record<PartSlot, string>>,
): SpeciesSpec {
  const slots: Partial<Record<Slot, PartSpec[]>> = {};
  for (const slot of PART_SLOTS) {
    const id = parts[slot];
    const built = id ? critterPart(base, slot, id) : null;
    if (built) slots[slot] = built;
  }
  if (!Object.keys(slots).length) return base;
  return variant(base, base.name, { slots, ...(slots.back ? { wings: null } : {}) });
}
