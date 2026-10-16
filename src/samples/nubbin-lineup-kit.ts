import { V, type Prim } from './sculpted';
import type { Mark, PartSpec, SpeciesSpec } from './species';

/**
 * The shared pieces of the special Nubbin forms: cones and balls, toy proportions (`widen`,
 * `dress`), ears, tails, arms, goggles, crystals and quills, tuned against Maor's "Chao World"
 * line-up reference (docs/reference/chao-world-lineup.jpg, Part G8b). The Eternals and the
 * character looks both build from these. Custom crowns, slot parts and head additions are
 * written in final colours because the palette swap runs first.
 */

export const WHITE = '#ffffff';

export const cone = (
  a: Prim['a'],
  b: Prim['a'],
  r: number,
  r2: number,
  color: string,
  tag = 'crown',
  blend = 0.1,
): Prim => ({ kind: 'cone', a, b, r, r2, color, tag, blend });
export const ball = (a: Prim['a'], r: number, color: string, tag = 'tip'): Prim => ({
  kind: 'sphere',
  a,
  r,
  color,
  tag,
});

/** Grow a part's sculpt box so additions past the base box are not clipped. */
export function widen(
  part: Pick<PartSpec, 'box'>,
  w: { x?: number; y?: number; z?: number },
): void {
  const [lo, hi] = part.box;
  if (w.x !== undefined) {
    lo.x = Math.min(lo.x, -w.x);
    hi.x = Math.max(hi.x, w.x);
  }
  if (w.y !== undefined) lo.y = Math.min(lo.y, w.y);
  if (w.z !== undefined) lo.z = Math.min(lo.z, w.z);
}

/**
 * Toy proportions: bigger mitts and feet, and optionally gloves and shoes in their own
 * colours (the hands and feet are tagged `hand` and `foot` on the base).
 */
export function dress(
  spec: SpeciesSpec,
  o: { gloves?: string; shoes?: string; chunky?: number },
): void {
  const k = o.chunky ?? 1.25;
  for (const part of spec.parts) {
    for (const p of part.prims) {
      if (p.tag === 'hand') {
        p.r *= k;
        if (p.radii) p.radii.multiplyScalar(k);
        if (o.gloves) p.color = o.gloves;
      }
      if (p.tag === 'foot') {
        p.r *= k;
        if (p.radii) p.radii.multiplyScalar(k);
        if (o.shoes) p.color = o.shoes;
      }
    }
  }
}

// ---- head and body additions ----

/** Big round ears on the sides of the head, hinged at the head. */
export const roundEar = (dx: number, color: string, r = 0.32): PartSpec => ({
  name: dx < 0 ? 'earL' : 'earR',
  pivot: V(dx * 0.6, 2.2, -0.1),
  prims: [ball(V(dx * 0.86, 2.32, -0.12), r, color, 'ear')],
  box: [V(dx < 0 ? -1.4 : 0.2, 1.8, -0.6), V(dx < 0 ? -0.2 : 1.4, 2.8, 0.4)],
  resolution: 40,
});

/**
 * A huge flat-faced round ear: a pale front disc over a darker back lobe, so the outline
 * reads as the pale cap sitting on a body-coloured ear (in the head's pre-scale coordinates).
 */
export const bigEar = (dx: number, front: string, back: string): PartSpec => ({
  name: dx < 0 ? 'earL' : 'earR',
  pivot: V(dx * 0.7, 2.2, -0.1),
  prims: [
    {
      kind: 'ellipsoid',
      a: V(dx * 0.95, 2.32, -0.25),
      r: 0,
      radii: V(0.33, 0.42, 0.28),
      color: back,
      tag: 'ear',
    },
    {
      kind: 'ellipsoid',
      a: V(dx * 0.99, 2.34, -0.04),
      r: 0,
      radii: V(0.27, 0.36, 0.23),
      color: front,
      tag: 'ear',
      blend: 0.04,
    },
  ],
  box: [V(dx < 0 ? -2.0 : 0.2, 1.6, -0.9), V(dx < 0 ? -0.2 : 2.0, 3.1, 0.6)],
  resolution: 48,
});

/** One of the twin tails: a capsule sweeping back and up, ending in a white ball. */
export const twinTail = (name: string, dx: number, color: string): PartSpec => ({
  name,
  pivot: V(dx * 0.2, 0.6, -0.6),
  prims: [
    {
      kind: 'capsule',
      a: V(dx * 0.2, 0.6, -0.6),
      b: V(dx * 0.5, 1.1, -1.6),
      r: 0.2,
      color,
      tag: 'tail',
      blend: 0.08,
    },
    ball(V(dx * 0.5, 1.12, -1.62), 0.26, WHITE, 'tail'),
  ],
  box: [V(-1.1, 0, -2.1), V(1.1, 1.6, -0.2)],
  resolution: 40,
});

/**
 * Aviator goggles pushed up on the right side of the hood: a dark rim, a glass lens and a
 * small bright highlight standing off the glass (final head coordinates, after `headScale`).
 */
export function gogglesUp(glass: string, rim: string): { prims: Prim[]; marks: Mark[] } {
  const at = V(0.62, 2.78, 0.42);
  const lens = (c: Prim['a'], radii: Prim['a'], color: string, tag: string): Prim => ({
    kind: 'ellipsoid',
    a: c,
    r: 0,
    radii,
    color,
    tag,
    blend: 0.02,
  });
  const parts = [
    lens(at, V(0.26, 0.21, 0.12), rim, 'band'),
    lens(at.clone().add(V(0, 0, 0.06)), V(0.2, 0.16, 0.12), glass, 'goggle'),
    lens(at.clone().add(V(0.07, 0.06, 0.15)), V(0.08, 0.05, 0.05), WHITE, 'goggle'),
  ];
  // The same three as marks, for a look that paints a hood over the head afterwards.
  const marks = parts.map((q) => ({
    kind: 'ellipsoid' as const,
    a: q.a.clone(),
    radii: q.radii!.clone().multiplyScalar(1.05),
    color: q.color,
    soft: 0.01,
  }));
  return { prims: parts, marks };
}

/** A crystal spike: a thin cone that glows a little, for the Eternal Moon's shoulders and feet. */
export const crystalSpike = (
  a: Prim['a'],
  b: Prim['a'],
  r: number,
  color: string,
  glow = 0.5,
): Prim => ({
  ...cone(a, b, r, 0.03, color, 'spike', 0.04),
  glow,
});

/** The cluster of lilac crystals the Eternal Moon stands in: four around each foot. */
export function footCrystals(color: string): Prim[] {
  const out: Prim[] = [];
  for (const dx of [-1, 1])
    for (const [ox, oz, h] of [
      [0.28, 0.1, 0.5],
      [-0.28, 0.05, 0.42],
      [0.05, 0.42, 0.34],
      [0.0, -0.25, 0.46],
    ] as const) {
      const x = dx * 0.38 + ox;
      out.push(
        crystalSpike(V(x, 0.02, 0.2 + oz), V(x + ox * 0.8, h, 0.2 + oz * 1.1), 0.1, color, 0.7),
      );
    }
  return out;
}

export const chestMark = (color: string, y = 1.05, rx = 0.3) => ({
  kind: 'ellipsoid' as const,
  a: V(0, y, 0.62),
  radii: V(rx, 0.14, 0.2),
  color,
  soft: 0.02,
});

/**
 * A short arm with a grey studded bracer at the wrist and a body-coloured fist (the dream
 * look): the band is a capsule a hair wider than the arm, the studs gold beads on it.
 */
export const braceletArm = (dx: number, body: string): PartSpec => ({
  name: dx < 0 ? 'armL' : 'armR',
  pivot: V(dx * 0.55, 1.15, 0.1),
  prims: [
    {
      kind: 'capsule',
      a: V(dx * 0.55, 1.15, 0.1),
      b: V(dx * 1.0, 1.05, 0.14),
      r: 0.16,
      color: body,
      tag: 'arm',
    },
    {
      kind: 'capsule',
      a: V(dx * 0.82, 1.09, 0.13),
      b: V(dx * 1.0, 1.05, 0.14),
      r: 0.22,
      color: '#aeb3bf',
      tag: 'band',
      blend: 0.02,
    },
    ball(V(dx * 0.9, 1.08, 0.36), 0.05, '#e6b84a', 'stud'),
    ball(V(dx * 0.98, 1.06, 0.36), 0.05, '#e6b84a', 'stud'),
    { ...ball(V(dx * 1.28, 1.0, 0.16), 0.3, body, 'hand'), blend: 0.06 },
  ],
  box: [V(dx < 0 ? -1.75 : 0.2, 0.5, -0.4), V(dx < 0 ? -0.2 : 1.75, 1.7, 0.7)],
});

/** A tall cat ear: a pointed black cone with a grey inner cone on its face (head pre-scale coordinates). */
export const catEar = (dx: number, outer: string, inner: string): PartSpec => ({
  name: dx < 0 ? 'earL' : 'earR',
  pivot: V(dx * 0.55, 2.3, -0.05),
  prims: [
    cone(V(dx * 0.5, 2.25, -0.05), V(dx * 1.0, 2.85, -0.15), 0.36, 0.03, outer, 'ear', 0.04),
    cone(V(dx * 0.52, 2.35, 0.12), V(dx * 0.95, 2.75, 0.0), 0.22, 0.02, inner, 'ear', 0.02),
  ],
  box: [V(dx < 0 ? -1.4 : 0.1, 1.9, -0.7), V(dx < 0 ? -0.1 : 1.4, 3.4, 0.6)],
  resolution: 48,
});

/** An arm folded in across the chest, the fist tucked under the collar. */
export const foldedArm = (dx: number, body: string): PartSpec => ({
  name: dx < 0 ? 'armL' : 'armR',
  pivot: V(dx * 0.55, 1.05, 0.1),
  prims: [
    {
      kind: 'capsule',
      a: V(dx * 0.55, 1.05, 0.1),
      b: V(dx * 0.25, 0.95, 0.58),
      r: 0.17,
      color: body,
      tag: 'arm',
    },
    { ...ball(V(dx * 0.18, 0.95, 0.64), 0.22, body, 'hand'), blend: 0.06 },
  ],
  box: [V(dx < 0 ? -0.9 : -0.1, 0.5, -0.2), V(dx < 0 ? 0.1 : 0.9, 1.5, 1.0)],
});

// ---- the line-up match (Part G8b): pieces tuned against the reference ----

/** Darker shade on the underside of each quill, so the cluster reads as separate spikes. */
export function quillShades(quills: Prim[], color: string): Mark[] {
  return quills.map((q) => {
    const d = q.b!.clone().sub(q.a).normalize();
    // The underside: straight down, less the part of down that runs along the quill.
    const under = V(0, -1, 0)
      .addScaledVector(d, -d.y)
      .normalize()
      .multiplyScalar(q.r * 0.55);
    return {
      kind: 'capsule' as const,
      a: q.a
        .clone()
        .add(under)
        .addScaledVector(d, q.r * 0.3),
      b: q.a.clone().lerp(q.b!, 0.72).add(under),
      r: q.r * 0.7,
      color,
      soft: 0.03,
    };
  });
}

/**
 * A short arm ending in a big round glove with a cuff: the glove is a ball, the cuff a
 * smaller ball stepping out of the sleeve, so the outline draws the cuff's edge.
 */
export function gloveArm(
  dx: number,
  body: string,
  glove: string,
  o: { y?: number; reach?: number; hand?: number } = {},
): PartSpec {
  // The arms stick straight out sideways in the quills' line-up; `y` lifts them and `reach`
  // pulls the glove in or out.
  const y = o.y ?? 1.0;
  const k = o.reach ?? 1;
  const h = o.hand ?? 0.3;
  return {
    name: dx < 0 ? 'armL' : 'armR',
    pivot: V(dx * 0.55, y, 0.1),
    prims: [
      {
        kind: 'capsule',
        a: V(dx * 0.55, y, 0.1),
        b: V(dx * (0.55 + 0.45 * k), y - 0.02, 0.14),
        r: 0.13,
        color: body,
        tag: 'arm',
      },
      ball(V(dx * (0.55 + 0.48 * k), y - 0.02, 0.14), (h * 2) / 3, glove, 'cuff'),
      { ...ball(V(dx * (0.55 + 0.75 * k), y - 0.02, 0.16), h, glove, 'hand'), blend: 0.06 },
    ],
    box: [V(dx < 0 ? -1.75 : 0.2, 0.5, -0.4), V(dx < 0 ? -0.2 : 1.75, 1.8, 0.6)],
  };
}

/**
 * Mech lower legs under big shoes: a grey capsule with a red ring, a red shoe a third
 * larger than the toy foot, and the white stripe as a flattened ellipsoid standing proud
 * of the shoe's top. Replaces the leg parts' primitives in place (final coordinates).
 */
export function mechLegs(
  spec: SpeciesSpec,
  o: { leg: string; ring: string; shoe: string; stripe: string; size?: number },
): void {
  const k = o.size ?? 1;
  for (const ps of spec.parts) {
    if (!ps.name.startsWith('leg')) continue;
    const x = (ps.name === 'legL' ? -1 : 1) * 0.4;
    ps.pivot.set(x, 0.45, 0.1);
    ps.prims = [
      {
        kind: 'capsule',
        a: V(x, 0.62, 0.1),
        b: V(x, 0.14, 0.2),
        r: 0.12,
        color: o.leg,
        tag: 'leg',
      },
      {
        kind: 'torus',
        a: V(x, 0.33, 0.14),
        r: 0.13,
        r2: 0.05,
        color: o.ring,
        tag: 'ring',
        blend: 0.02,
      },
      {
        kind: 'ellipsoid',
        a: V(x, 0.1, 0.3),
        r: 0,
        radii: V(0.37 * k, 0.28 * k, 0.52 * k),
        color: o.shoe,
        tag: 'foot',
        blend: 0.05,
      },
      {
        kind: 'ellipsoid',
        a: V(x, 0.28 * (0.5 + 0.5 * k), 0.3 + 0.38 * k),
        r: 0,
        radii: V(0.4 * k, 0.07, 0.17 * k),
        color: o.stripe,
        tag: 'stripe',
        blend: 0.02,
      },
    ];
    ps.box = [V(x - 0.6, -0.2, -0.3), V(x + 0.6, 0.8, 1.05)];
    ps.resolution = 56;
  }
}

/** The quills cluster on the back of the head, in the base head's coordinates. */
export function quillCluster(color: string): Prim[] {
  const q = (a: Prim['a'], b: Prim['a'], r: number) => cone(a, b, r, 0.07, color, 'quill', 0.09);
  return [
    // A spiky ball sitting on the top-back of the dome: one up, two up and out, two back.
    q(V(0, 2.55, -0.3), V(0, 3.3, -0.55), 0.3),
    q(V(-0.3, 2.5, -0.35), V(-0.85, 3.1, -0.7), 0.27),
    q(V(0.3, 2.5, -0.35), V(0.85, 3.1, -0.7), 0.27),
    q(V(-0.45, 2.3, -0.45), V(-0.95, 2.55, -1.1), 0.24),
    q(V(0.45, 2.3, -0.45), V(0.95, 2.55, -1.1), 0.24),
  ];
}

/** The small yellow ear tips at the sides of the dome where the quills begin. */
export const earTips = (color: string): Prim[] =>
  [-1, 1].map((dx) =>
    cone(V(dx * 0.72, 2.4, -0.1), V(dx * 0.98, 2.72, -0.15), 0.13, 0.02, color, 'tip', 0.04),
  );
