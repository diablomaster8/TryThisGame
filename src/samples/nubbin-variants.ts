import type * as THREE from 'three';
import type { NubbinType } from '../sim/types';
import { sdf, V, type Prim } from './sculpted';
import type { Mark, PartSpec, SpeciesSpec } from './species';
import { NUBBIN_SPEC } from './species-data';

/**
 * The Nubbin variants as small diffs on `NUBBIN_SPEC`. `variant(base, name, overrides)`
 * deep-copies a spec and changes only what the override names: the palette (every colour
 * the base uses is swapped for its counterpart, so one `colors` line recolours a whole
 * body), the crown and the ball shape, the wings, the four part slots (ears, tail, arms,
 * back), alignment hints (extra marks) and the type silhouette (fins, longer legs, a
 * wider body, bigger wings). Templates for the child and the Sun, Moon and Neutral
 * adults live here; the families (first and second evolutions, special forms, colours)
 * derive from them in the `nubbin-variants-*.ts` files and meet in the catalogue.
 */

/** Every colour the base Nubbin uses, by role. A variant's palette maps the same roles. */
export const NUBBIN_COLORS = {
  body: '#9ad0ff',
  tip: '#ffd94a',
  pad: '#e8b830',
  belly: '#e4f3ff',
  blush: '#ffb3c6',
  star: '#fff4b0',
  crownShade: '#5f9ee8',
  iris: '#141a3a',
  lip: '#6a3a5a',
  tongue: '#ff8aa0',
  wing: '#fff1c9',
  sheen: '#dff2ff',
} as const;
export type NubbinColors = Record<keyof typeof NUBBIN_COLORS, string>;

export type CrownKind = 'point' | 'tall' | 'hook' | 'fin' | 'stub' | 'droop' | 'none';
/** Part slots a variant can fill; `legs` and `wings` are the critter slots of R0401. */
export type Slot = 'ears' | 'tail' | 'arms' | 'back' | 'legs' | 'wings';

export interface VariantOverrides {
  /** Colours by role; roles left out keep the base's colour. */
  colors?: Partial<NubbinColors>;
  /** A stock crown, or custom head primitives in place of the crown and its tip. */
  crown?: CrownKind | Prim[];
  /** Ball fields to change, or `null` for no ball. */
  ball?: Partial<NonNullable<SpeciesSpec['ball']>> | null;
  /** Wing fields to change, or `null` for no wings. */
  wings?: Partial<NonNullable<SpeciesSpec['wings']>> | null;
  /** Parts per slot: `arms` replaces the arms, the others replace any part in that slot. */
  slots?: Partial<Record<Slot, PartSpec[]>>;
  /** Extra marks painted after the base's: alignment hints, patches, rings. */
  hints?: Mark[];
  /**
   * The type tells at full strength (quills, a crest and flippers, a long crown and big
   * wings, horns and a wide body) and a second type at half strength.
   */
  type?: NubbinType;
  second?: NubbinType;
  /** The colour the type tells take; the body colour by default (Sun and Moon pass a tint). */
  accent?: string;
  scale?: number;
  surface?: Partial<SpeciesSpec['surface']>;
  /**
   * Grow the head about the neck: its primitives and box, the eyes, mouth and ball, any
   * mark or part that sits above the neck (ears, a crown's shade). Runs before the `eyes`
   * and `mouth` overrides and the `patch`, which are written for the grown head.
   */
  headScale?: number;
  eyes?: Partial<SpeciesSpec['eyes']>;
  mouth?: Partial<SpeciesSpec['mouth']>;
  notes?: string;
  /** Last-mile edits the fields above have no word for. Runs on the copy. */
  patch?: (spec: SpeciesSpec) => void;
}

// ---- deep copies: the sculpt reads THREE.Vector3 methods, so clone them properly ----

const vec = (p: THREE.Vector3) => p.clone();
const clonePrim = (p: Prim): Prim => ({
  ...p,
  a: vec(p.a),
  ...(p.b ? { b: vec(p.b) } : {}),
  ...(p.radii ? { radii: vec(p.radii) } : {}),
});
const cloneMark = (m: Mark): Mark => ({
  ...m,
  a: vec(m.a),
  ...(m.b ? { b: vec(m.b) } : {}),
  ...(m.radii ? { radii: vec(m.radii) } : {}),
});
const cloneBox = (b: [THREE.Vector3, THREE.Vector3]): [THREE.Vector3, THREE.Vector3] => [
  vec(b[0]),
  vec(b[1]),
];
const clonePart = (p: PartSpec): PartSpec => ({
  ...p,
  pivot: vec(p.pivot),
  prims: p.prims.map(clonePrim),
  box: cloneBox(p.box),
  ...(p.joint
    ? {
        joint: {
          ...p.joint,
          pivot: vec(p.joint.pivot),
          prims: p.joint.prims.map(clonePrim),
          box: cloneBox(p.joint.box),
        },
      }
    : {}),
});

export function cloneSpec(s: SpeciesSpec): SpeciesSpec {
  return {
    ...s,
    surface: { ...s.surface },
    torso: { ...s.torso, prims: s.torso.prims.map(clonePrim), box: cloneBox(s.torso.box) },
    head: clonePart(s.head),
    parts: s.parts.map(clonePart),
    shade: { ...s.shade },
    marks: s.marks.map(cloneMark),
    eyes: { ...s.eyes },
    mouth: { ...s.mouth },
    ...(s.wings ? { wings: { ...s.wings } } : {}),
    ...(s.ball ? { ball: { ...s.ball } } : {}),
  };
}

// ---- palettes: each derived spec remembers its roles, so a variant of a variant works ----

const PALETTES = new WeakMap<SpeciesSpec, NubbinColors>();
export const paletteOf = (spec: SpeciesSpec): NubbinColors =>
  PALETTES.get(spec) ?? { ...NUBBIN_COLORS };

function recolor(spec: SpeciesSpec, from: NubbinColors, to: NubbinColors): void {
  const map = new Map<string, string>();
  for (const role of Object.keys(from) as (keyof NubbinColors)[]) map.set(from[role], to[role]);
  const swap = (c: string) => map.get(c) ?? c;
  const prims = (ps: Prim[]) => ps.forEach((p) => (p.color = swap(p.color)));
  prims(spec.torso.prims);
  prims(spec.head.prims);
  for (const part of spec.parts) {
    prims(part.prims);
    if (part.joint) prims(part.joint.prims);
  }
  spec.marks.forEach((m) => (m.color = swap(m.color)));
  spec.eyes.iris = swap(spec.eyes.iris);
  spec.eyes.lidColor = swap(spec.eyes.lidColor);
  spec.mouth.lip = swap(spec.mouth.lip);
  spec.mouth.tongue = swap(spec.mouth.tongue);
  if (spec.wings) spec.wings.color = swap(spec.wings.color);
  if (spec.blush) spec.blush = swap(spec.blush);
  if (spec.ball) spec.ball.color = swap(spec.ball.color);
  if (spec.surface.sheenColor) spec.surface.sheenColor = swap(spec.surface.sheenColor);
}

// ---- crowns: the head's `crown` and `tip` primitives, in the base head's space ----

export function crownPrims(kind: CrownKind, body: string, tip: string): Prim[] {
  const cone = (b: THREE.Vector3, r: number, r2: number): Prim => ({
    kind: 'cone',
    a: V(0, 2.35, 0),
    b,
    r,
    r2,
    color: body,
    tag: 'crown',
    blend: 0.14,
  });
  // The tip is a small upright egg with a crisp join, so the crown's shade never reaches
  // it and it reads as the band's tip colour from every side (LOOK-01).
  const dot = (a: THREE.Vector3, r: number): Prim => ({
    kind: 'ellipsoid',
    a,
    radii: V(r * 1.3, r * 1.6, r * 1.3),
    r: 0,
    color: tip,
    tag: 'tip',
    blend: 0.03,
  });
  const bend = (a: THREE.Vector3, b: THREE.Vector3): Prim => ({
    kind: 'capsule',
    a,
    b,
    r: 0.11,
    color: body,
    tag: 'crown',
    blend: 0.08,
  });
  switch (kind) {
    case 'point':
      // Swept back in two cones, as the child's (species-data.ts).
      return [
        cone(V(0, 2.78, -0.1), 0.42, 0.2),
        { ...cone(V(0, 3.0, -0.3), 0.2, 0.05), a: V(0, 2.78, -0.1), blend: 0.1 },
        dot(V(0, 3.02, -0.32), 0.1),
      ];
    case 'tall':
      // Slimmer and higher: the Sun adult's spire.
      return [cone(V(0, 3.2, 0), 0.36, 0.04), dot(V(0, 3.2, 0), 0.08)];
    case 'hook':
      // Bends back and down into a hooked point: the Moon adult.
      return [
        cone(V(0, 2.9, -0.12), 0.42, 0.14),
        bend(V(0, 2.9, -0.12), V(0, 2.82, -0.55)),
        dot(V(0, 2.78, -0.6), 0.09),
      ];
    case 'fin':
      // A thin crest fore and aft, as the Swim forms wear.
      return [
        {
          kind: 'ellipsoid',
          a: V(0, 2.5, 0),
          radii: V(0.09, 0.42, 0.46),
          r: 0,
          color: body,
          tag: 'crown',
          blend: 0.1,
        },
        dot(V(0, 2.9, 0), 0.07),
      ];
    case 'stub':
      // Short and thick: the Power forms.
      return [cone(V(0, 2.8, 0), 0.46, 0.12), dot(V(0, 2.84, 0), 0.14)];
    case 'droop':
      // Leans forward and nods over the brow: the Neutral adult.
      return [
        cone(V(0, 2.85, 0.2), 0.4, 0.12),
        bend(V(0, 2.85, 0.2), V(0, 2.74, 0.6)),
        dot(V(0, 2.71, 0.65), 0.09),
      ];
    case 'none':
      return [];
  }
}

// ---- slot parts the families share ----

/** Head fins on each side, the Swim mark; `k` scales them (1 for the main type). */
export function headFins(color: string, k = 1): PartSpec[] {
  return [-1, 1].map((dx) => ({
    name: dx < 0 ? 'earL' : 'earR',
    pivot: V(dx * 0.6, 2.0, -0.1),
    prims: [
      {
        kind: 'ellipsoid',
        a: V(dx * (0.78 + 0.22 * k), 2.08, -0.2),
        radii: V(0.32 * k, 0.22 * k, 0.08),
        r: 0,
        color,
        tag: 'ear',
        blend: 0.06,
      },
    ],
    box: [V(dx < 0 ? -1.5 : 0.3, 1.6, -0.6), V(dx < 0 ? -0.3 : 1.5, 2.6, 0.4)],
    resolution: 40,
  }));
}

/** A short tail stub behind the hips, as a critter part or an adult's extra. */
export function tailStub(color: string, length = 0.5): PartSpec[] {
  return [
    {
      name: 'tail',
      pivot: V(0, 0.55, -0.6),
      prims: [
        {
          kind: 'capsule',
          a: V(0, 0.55, -0.6),
          b: V(0, 0.62 + length * 0.4, -0.6 - length),
          r: 0.12,
          color,
          tag: 'tail',
          blend: 0.08,
        },
      ],
      box: [V(-0.5, 0.1, -1.4 - length), V(0.5, 1.3, -0.2)],
      resolution: 40,
    },
  ];
}

// ---- the type silhouette, after the pixel drawer's `shapeFor` ----

/** Raise everything but the feet by `d`: longer legs for the Run forms. */
function lift(spec: SpeciesSpec, d: number): void {
  const up = (p: { a: THREE.Vector3; b?: THREE.Vector3 }) => {
    p.a.y += d;
    if (p.b) p.b.y += d;
  };
  spec.torso.prims.forEach(up);
  spec.torso.box[1].y += d;
  spec.head.pivot.y += d;
  spec.head.prims.forEach(up);
  spec.head.box[0].y += d;
  spec.head.box[1].y += d;
  for (const part of spec.parts) {
    part.pivot.y += d;
    part.box[1].y += d;
    if (part.name.startsWith('leg')) {
      // The hip end of the leg rises; the foot stays on the ground.
      for (const p of part.prims) if (p.tag === 'leg') p.a.y += d;
      continue;
    }
    part.box[0].y += d;
    part.prims.forEach(up);
  }
  spec.marks.forEach(up);
  spec.eyes.y += d;
  spec.mouth.y += d;
  if (spec.wings) spec.wings.y += d;
  if (spec.ball) spec.ball.y += d;
  spec.hipY += d;
  spec.shade.yMax += d;
}

/**
 * The five type colours, after the neutral evolution chart: the Neutral adult's body, and
 * the accent the Sun (lightened) and Moon (deepened) forms carry on their tells.
 */
export const TYPE_COLORS: Record<NubbinType, { body: string; shade: string; belly: string }> = {
  normal: { body: '#3ec9d6', shade: '#1a8fa6', belly: '#d2f6ff' },
  swim: { body: '#86d94a', shade: '#3f9a2a', belly: '#e6ffb8' },
  fly: { body: '#ff86c2', shade: '#c84d8f', belly: '#ffd9ec' },
  run: { body: '#3b6cf0', shade: '#1f3db0', belly: '#c0d4ff' },
  power: { body: '#ff6a2a', shade: '#b8360e', belly: '#ffd2a6' },
};

/** Mix two hex colours: `t` 0 gives `a`, 1 gives `b`. For the second evolutions' hue blends. */
export function mixHex(a: string, b: string, t: number): string {
  const ca = parseInt(a.slice(1), 16);
  const cb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const x = (ca >> shift) & 255;
    const y = (cb >> shift) & 255;
    return Math.round(x + (y - x) * t);
  };
  return '#' + [16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('');
}

/** Quills swept back from the head, the Run tell: three at full strength, two at half. */
export function quills(color: string, k = 1): Prim[] {
  const q = (a: THREE.Vector3, b: THREE.Vector3, r: number): Prim => ({
    kind: 'cone',
    a,
    b,
    r,
    r2: 0.03,
    color,
    tag: 'quill',
    blend: 0.08,
  });
  const len = 0.55 + 0.45 * k;
  const out = [
    q(V(-0.32, 2.25, -0.3), V(-0.6, 2.55 + 0.2 * k, -0.3 - 0.75 * len), 0.16),
    q(V(0.32, 2.25, -0.3), V(0.6, 2.55 + 0.2 * k, -0.3 - 0.75 * len), 0.16),
  ];
  if (k >= 1) out.push(q(V(0, 2.45, -0.3), V(0, 2.95, -0.3 - 0.8 * len), 0.17));
  return out;
}

/** Two short horns on the brow, the Power tell. */
export function horns(color: string, k = 1): Prim[] {
  return [-1, 1].map((dx) => ({
    kind: 'cone',
    a: V(dx * 0.36, 2.4, 0.15),
    b: V(dx * (0.5 + 0.08 * k), 2.72 + 0.18 * k, 0.1),
    r: 0.11,
    r2: 0.02,
    color,
    tag: 'horn',
    blend: 0.06,
  }));
}

/** A flat fin blade (thin across, tall and long), for the Swim back fin and tail stub. */
function finBlade(a: THREE.Vector3, radii: THREE.Vector3, color: string): Prim {
  return { kind: 'ellipsoid', a, radii, r: 0, color, tag: 'fin', blend: 0.05 };
}

/** Two feather tufts at the temples, the Fly tell beside the great wings. */
export function templeTufts(color: string): Prim[] {
  return [-1, 1].map((dx) => ({
    kind: 'cone',
    a: V(dx * 0.68, 2.05, 0.05),
    b: V(dx * 1.05, 2.42, -0.05),
    r: 0.1,
    r2: 0.02,
    color,
    tag: 'tuft',
    blend: 0.06,
  }));
}

/** Flipper arms in place of the mitts, the Swim tell. */
export function flipperArms(body: string, accent: string): PartSpec[] {
  return [-1, 1].map((dx) => ({
    name: dx < 0 ? 'armL' : 'armR',
    pivot: V(dx * 0.6, 1.02, 0.1),
    prims: [
      {
        kind: 'capsule',
        a: V(dx * 0.6, 1.02, 0.1),
        b: V(dx * 0.95, 0.78, 0.2),
        r: 0.14,
        color: body,
        tag: 'arm',
      },
      {
        kind: 'ellipsoid',
        a: V(dx * 1.12, 0.7, 0.26),
        radii: V(0.3, 0.08, 0.22),
        r: 0,
        color: accent,
        tag: 'hand',
        blend: 0.06,
      },
    ],
    box: [V(dx < 0 ? -1.6 : 0.2, 0.3, -0.3), V(dx < 0 ? -0.2 : 1.6, 1.4, 0.7)],
    resolution: 56,
  }));
}

function setCrown(spec: SpeciesSpec, crown: CrownKind | Prim[], body: string, tip: string): void {
  const keep = spec.head.prims.filter((p) => p.tag !== 'crown' && p.tag !== 'tip');
  const prims = Array.isArray(crown) ? crown.map(clonePrim) : crownPrims(crown, body, tip);
  spec.head.prims = [...keep, ...prims];
}

/**
 * The type tells, after the neutral evolution chart. At full strength (`k` 1) the type
 * also sets the crown; at half strength it adds its tell more quietly and keeps the crown.
 */
function applyType(
  spec: SpeciesSpec,
  type: NubbinType,
  k: number,
  palette: NubbinColors,
  accent: string,
): void {
  const head = spec.head;
  switch (type) {
    case 'swim':
      if (k >= 1) setCrown(spec, 'fin', accent, palette.tip);
      setSlot(spec, 'ears', headFins(accent, 0.55 + 0.45 * k));
      if (k >= 1) setSlot(spec, 'arms', flipperArms(palette.body, accent));
      // A fin ridge on the back and a fish-tail stub (LOOK-19).
      if (k >= 1) {
        spec.torso.prims.push(
          finBlade(V(0, 1.28, -0.5), V(0.05, 0.3, 0.24), accent),
          finBlade(V(0, 0.78, -0.64), V(0.05, 0.17, 0.22), accent),
        );
        spec.torso.box[0].z = Math.min(spec.torso.box[0].z, -1.0);
      }
      break;
    case 'fly':
      if (k >= 1) setCrown(spec, 'tall', palette.body, accent);
      if (spec.wings) {
        // Great wings standing up behind the head: 2.2× at full strength (LOOK-19).
        spec.wings.size *= 1 + 1.2 * k;
        spec.wings.y += 0.3 * k;
        spec.wings.color = mixHex(accent, '#ffffff', 0.45);
      }
      if (k >= 1) {
        head.prims.push(...templeTufts(mixHex(accent, '#ffffff', 0.45)));
        head.box[0].x = Math.min(head.box[0].x, -1.3);
        head.box[1].x = Math.max(head.box[1].x, 1.3);
      }
      break;
    case 'run':
      if (k >= 1) setCrown(spec, 'none', palette.body, palette.tip);
      head.prims.push(...quills(accent, k));
      head.box[0].z = Math.min(head.box[0].z, -1.4);
      lift(spec, 0.24 * k);
      // A leaner runner's body (×0.88 wide at full strength).
      for (const p of spec.torso.prims) if (p.radii) p.radii.x *= 1 - 0.12 * k;
      break;
    case 'power':
      if (k >= 1) setCrown(spec, 'stub', palette.body, palette.tip);
      head.prims.push(...horns(accent, k));
      for (const p of spec.torso.prims)
        if (p.radii) {
          p.radii.x *= 1 + 0.16 * k;
          p.radii.z *= 1 + 0.12 * k;
        }
      for (const part of spec.parts)
        for (const p of part.prims) {
          if (p.tag === 'hand') {
            p.r *= 1 + 0.5 * k;
            p.radii?.multiplyScalar(1 + 0.5 * k);
          }
          if (p.tag === 'arm') p.r *= 1 + 0.25 * k;
        }
      break;
    case 'normal':
      break;
  }
}

function setSlot(spec: SpeciesSpec, slot: Slot, parts: PartSpec[]): void {
  const prefix =
    slot === 'arms'
      ? 'arm'
      : slot === 'ears'
        ? 'ear'
        : slot === 'legs'
          ? 'leg'
          : slot === 'wings'
            ? 'wing'
            : slot;
  spec.parts = spec.parts.filter((p) => !p.name.startsWith(prefix));
  spec.parts.push(...parts.map(clonePart));
}

/** Scale everything above the neck about the head's pivot (see `headScale`). */
function scaleHead(spec: SpeciesSpec, k: number): void {
  const o = spec.head.pivot;
  const pt = (p: THREE.Vector3) => p.sub(o).multiplyScalar(k).add(o);
  const prim = (p: Prim | Mark) => {
    pt(p.a);
    if (p.b) pt(p.b);
    if (p.r !== undefined) p.r *= k;
    if (p.radii) p.radii.multiplyScalar(k);
  };
  const part = (ps: PartSpec) => {
    ps.prims.forEach(prim);
    ps.box.forEach(pt);
  };
  part(spec.head);
  for (const ps of spec.parts)
    if (ps.pivot.y > o.y) {
      part(ps);
      pt(ps.pivot);
    }
  for (const m of spec.marks) if (m.a.y > o.y) prim(m);
  const e = spec.eyes;
  spec.eyes = { ...e, x: e.x * k, y: o.y + (e.y - o.y) * k, z: e.z * k, r: e.r * k };
  const m = spec.mouth;
  spec.mouth = { ...m, x: m.x * k, y: o.y + (m.y - o.y) * k, z: m.z * k, width: m.width * k };
  if (spec.ball) spec.ball.y = o.y + (spec.ball.y - o.y) * k;
}

/**
 * Drops a crown-shade mark that would paint over a tip: a new crown (a fin, a stub) moves
 * the tip into the shade the base crown laid down, and the tip must keep its colour
 * (LOOK-01; tests/render/likeness.test.ts).
 */
function clearTips(spec: SpeciesSpec, shade: string): void {
  const tips = spec.head.prims.filter((p) => p.tag === 'tip');
  if (tips.length === 0) return;
  const reach = (t: Prim) => Math.max(t.r, t.radii?.x ?? 0, t.radii?.y ?? 0, t.radii?.z ?? 0);
  spec.marks = spec.marks.filter(
    (m) =>
      m.color !== shade ||
      tips.every(
        (t) => sdf(t.a, { ...m, r: m.r ?? 0, tag: 'mark' }) >= reach(t) + (m.soft ?? 0.06),
      ),
  );
}

// ---- the helper ----

export function variant(base: SpeciesSpec, name: string, o: VariantOverrides): SpeciesSpec {
  const spec = cloneSpec(base);
  spec.name = name;
  const from = paletteOf(base);
  const palette: NubbinColors = { ...from, ...o.colors };
  if (o.colors) recolor(spec, from, palette);
  if (o.crown !== undefined) setCrown(spec, o.crown, palette.body, palette.tip);
  if (o.ball === null) delete spec.ball;
  else if (o.ball) spec.ball = { y: 3.5, color: palette.tip, ...spec.ball, ...o.ball };
  if (o.wings === null) delete spec.wings;
  else if (o.wings)
    spec.wings = {
      x: 0.52,
      y: 1.2,
      z: -0.5,
      size: 1.15,
      color: palette.wing,
      ...spec.wings,
      ...o.wings,
    };
  const accent = o.accent ?? palette.body;
  if (o.type) applyType(spec, o.type, 1, palette, accent);
  if (o.second && o.second !== o.type) applyType(spec, o.second, 0.5, palette, accent);
  if (o.slots)
    for (const [slot, parts] of Object.entries(o.slots)) setSlot(spec, slot as Slot, parts);
  if (o.hints) spec.marks.push(...o.hints.map(cloneMark));
  if (o.scale !== undefined) spec.scale = o.scale;
  if (o.surface) spec.surface = { ...spec.surface, ...o.surface };
  if (o.headScale !== undefined && o.headScale !== 1) scaleHead(spec, o.headScale);
  if (o.eyes) spec.eyes = { ...spec.eyes, ...o.eyes };
  if (o.mouth) spec.mouth = { ...spec.mouth, ...o.mouth };
  if (o.notes !== undefined) spec.notes = o.notes;
  o.patch?.(spec);
  clearTips(spec, palette.crownShade);
  PALETTES.set(spec, palette);
  return spec;
}

// ---- templates ----

/** The neutral child: the base itself, registered so the palette roles are known. */
export const CHILD = variant(NUBBIN_SPEC, 'Nubbin', {});

/**
 * A child leaning Sun (LOOK-49): ice white going blue, the crown and hands sky blue instead of
 * yellow, a gold sparkle in the ball, a faint pale ring at the crown's base.
 */
export const CHILD_SUN = variant(NUBBIN_SPEC, 'Nubbin (Sun-leaning)', {
  colors: {
    body: '#e6f4ff',
    belly: '#ffffff',
    tip: '#bfe6ff',
    pad: '#8fc4f0',
    crownShade: '#9ccaf2',
    wing: '#fffaf0',
    star: '#ffe680',
  },
  ball: { glow: '#e0b030' },
  hints: [
    { kind: 'capsule', a: V(0, 2.22, 0), b: V(0, 2.36, 0), r: 0.46, color: '#fff8e0', soft: 0.12 },
  ],
  notes: 'Child hint of the Sun band: colour only, the shape stays the child shape.',
});

/** A child leaning Moon: dusky body, a berry ball, a shadow ring under the crown. */
export const CHILD_MOON = variant(NUBBIN_SPEC, 'Nubbin (Moon-leaning)', {
  colors: {
    body: '#6a5a8a',
    belly: '#9a90ac',
    tip: '#e85a7a',
    pad: '#9e2b3f',
    crownShade: '#4a4063',
    blush: '#c06080',
    wing: '#cdb1f0',
  },
  ball: { color: '#9e2b3f', glow: '#6a1830' },
  hints: [
    { kind: 'capsule', a: V(0, 2.22, 0), b: V(0, 2.36, 0), r: 0.46, color: '#4a4063', soft: 0.12 },
  ],
  notes: 'Child hint of the Moon band: colour only, the shape stays the child shape.',
});

/** The Sun adult, Normal type: white and blue, a spire crown, a halo, feathered wings. */
export const SUN_ADULT = variant(NUBBIN_SPEC, 'Nubbin (Sun)', {
  colors: {
    body: '#f6f8ff',
    tip: '#8fd6f0',
    pad: '#4a9be0',
    belly: '#ffffff',
    blush: '#ffd6e0',
    star: '#fffbe6',
    crownShade: '#bfe0ff',
    iris: '#1a2450',
    wing: '#fffaf0',
    sheen: '#ffffff',
  },
  crown: 'tall',
  ball: { shape: 'halo', color: '#cfefff', glow: '#e0a820' },
  wings: { shape: 'feather', size: 1.6 },
  scale: 0.86,
  surface: { sheen: 0.9 },
  notes: 'Sun adult template: tuned by eye against the child on the stage, 2026-10-15.',
});

/** The Moon adult, Normal type: black and purple, a hooked crown, spikes, bat wings. */
export const MOON_ADULT = variant(NUBBIN_SPEC, 'Nubbin (Moon)', {
  colors: {
    body: '#3a2f58',
    tip: '#e85a7a',
    pad: '#9e2b3f',
    belly: '#4a4063',
    blush: '#7a3a5a',
    star: '#4a4063',
    crownShade: '#0d0a1a',
    iris: '#e0562e',
    lip: '#1a0f20',
    tongue: '#c04060',
    wing: '#4a4063',
    sheen: '#7a6f8c',
  },
  crown: 'hook',
  ball: { shape: 'spikes', color: '#3a1a4a', glow: '#6a2050', tip: '#c8304a' },
  wings: { shape: 'bat', size: 1.5 },
  scale: 0.86,
  eyes: { lid: 0.2 },
  // R0418 (LOOK-48): a purple toon rim on the Moon band only, so a dark adult keeps its edge.
  surface: { sheen: 0.5, roughness: 0.55, bandRim: { color: '#8a6ad0', strength: 0.5 } },
  notes: 'Moon adult template: tuned by eye against the child on the stage, 2026-10-15.',
});

/** The Neutral adult, Normal type: minty and a little bigger, the crown nodding forward. */
export const NEUTRAL_ADULT = variant(NUBBIN_SPEC, 'Nubbin (Neutral)', {
  colors: { body: '#8fdcc8', belly: '#e8f8f2', crownShade: '#3fbfa8', sheen: '#e8fff8' },
  crown: 'droop',
  scale: 0.86,
  notes: 'Neutral adult template: tuned by eye against the child on the stage, 2026-10-15.',
});

export type VariantFamily = 'child' | 'first' | 'second' | 'special' | 'colour';

export interface NubbinVariant {
  /** Kebab-case, unique across every family: `&creature=variant:<id>` on the stage. */
  id: string;
  family: VariantFamily;
  spec: SpeciesSpec;
  /** Set when the look is a stand-in that still needs its own pass, saying what is missing. */
  placeholder?: string;
}

export const CHILD_VARIANTS: NubbinVariant[] = [
  { id: 'child', family: 'child', spec: CHILD },
  { id: 'child-sun', family: 'child', spec: CHILD_SUN },
  { id: 'child-moon', family: 'child', spec: CHILD_MOON },
];

/** The six templates in a row, for `&creature=variants&family=templates`. */
export const TEMPLATES: NubbinVariant[] = [
  { id: 'template-child', family: 'child', spec: CHILD },
  { id: 'template-child-sun', family: 'child', spec: CHILD_SUN },
  { id: 'template-child-moon', family: 'child', spec: CHILD_MOON },
  { id: 'template-sun', family: 'first', spec: SUN_ADULT },
  { id: 'template-moon', family: 'first', spec: MOON_ADULT },
  { id: 'template-neutral', family: 'first', spec: NEUTRAL_ADULT },
];
