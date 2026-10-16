import { V, type Prim } from './sculpted';
import {
  CHILD,
  MOON_ADULT,
  NEUTRAL_ADULT,
  SUN_ADULT,
  tailStub,
  variant,
  type NubbinVariant,
  type VariantOverrides,
} from './nubbin-variants';
import type { Mark, PartSpec, SpeciesSpec } from './species';

/**
 * The special Nubbin forms: the three Eternals (the rare immortal adults, glassy and jewel-like,
 * with wings twice the size and a head of their own), the ash-grey Shadow stray from the story,
 * and six unlockable character looks on the child body. After Maor's "Chao World" line-up
 * reference (2026-10-16) the looks are built like toys: oversized ears, tufts and quills, real
 * shoes and gloves, goggles, a crest, crystal spikes, and saturated two-tone colours. Everything
 * derives from the templates with `variant()`; custom crowns, slot parts and head additions are
 * written in final colours because the palette swap runs first.
 */

/** The glassy finish the Eternals share. */
const GLASS = {
  detail: 'smooth',
  roughness: 0.18,
  clearcoat: 0.8,
  sheen: 1,
  amount: 0.05,
} as const;

const WHITE = '#ffffff';

const cone = (
  a: Prim['a'],
  b: Prim['a'],
  r: number,
  r2: number,
  color: string,
  tag = 'crown',
  blend = 0.1,
): Prim => ({ kind: 'cone', a, b, r, r2, color, tag, blend });
const ball = (a: Prim['a'], r: number, color: string, tag = 'tip'): Prim => ({
  kind: 'sphere',
  a,
  r,
  color,
  tag,
});

/** Grow a part's sculpt box so additions past the base box are not clipped. */
function widen(part: Pick<PartSpec, 'box'>, w: { x?: number; y?: number; z?: number }): void {
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
function dress(spec: SpeciesSpec, o: { gloves?: string; shoes?: string; chunky?: number }): void {
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
const roundEar = (dx: number, color: string, r = 0.32): PartSpec => ({
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
const bigEar = (dx: number, front: string, back: string): PartSpec => ({
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
const twinTail = (name: string, dx: number, color: string): PartSpec => ({
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
function gogglesUp(glass: string, rim: string): { prims: Prim[]; marks: Mark[] } {
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

/** Crystal spikes for the Eternal Moon: faceted-looking cones with a faint glow. */
function crystals(color: string): { head: Prim[]; torso: Prim[] } {
  const c = (a: Prim['a'], b: Prim['a'], r: number): Prim => ({
    ...cone(a, b, r, 0.03, color, 'spike', 0.05),
    glow: 0.5,
  });
  return {
    head: [
      c(V(0, 2.4, -0.05), V(0, 3.35, -0.25), 0.3),
      c(V(-0.45, 2.3, -0.2), V(-1.05, 2.8, -0.5), 0.2),
      c(V(0.45, 2.3, -0.2), V(1.05, 2.8, -0.5), 0.2),
      c(V(0, 2.2, -0.5), V(0, 2.6, -1.3), 0.22),
      c(V(-0.6, 1.85, 0.25), V(-1.0, 1.75, 0.45), 0.13),
      c(V(0.6, 1.85, 0.25), V(1.0, 1.75, 0.45), 0.13),
    ],
    torso: [
      c(V(-0.55, 1.2, -0.25), V(-1.1, 1.65, -0.55), 0.17),
      c(V(0.55, 1.2, -0.25), V(1.1, 1.65, -0.55), 0.17),
      c(V(0, 0.9, -0.6), V(0, 1.25, -1.25), 0.17),
    ],
  };
}

const chestMark = (color: string, y = 1.05, rx = 0.3) => ({
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
const braceletArm = (dx: number, body: string): PartSpec => ({
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
const catEar = (dx: number, outer: string, inner: string): PartSpec => ({
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
const foldedArm = (dx: number, body: string): PartSpec => ({
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

// ---- the Eternals ----

const ETERNAL_SUN = variant(SUN_ADULT, 'Nubbin (Eternal Sun)', {
  colors: {
    body: WHITE,
    belly: WHITE,
    tip: '#c8ffe0',
    pad: '#8ae5d2',
    crownShade: '#d8fff0',
    iris: '#1e7a74',
    wing: '#e0fff0',
  },
  crown: [
    cone(V(0, 2.35, 0.1), V(0, 3.15, -0.6), 0.36, 0.05, WHITE, 'crown', 0.14),
    cone(V(0, 2.3, -0.2), V(0, 2.8, -0.9), 0.22, 0.04, WHITE, 'crown', 0.14),
    ball(V(0, 3.17, -0.62), 0.07, '#c8ffe0'),
  ],
  ball: { shape: 'halo', y: 3.65, color: '#ffe680', glow: '#d0a020' },
  wings: { shape: 'feather', size: 2.2 },
  scale: 0.9,
  surface: GLASS,
  patch: (spec) => dress(spec, { chunky: 1.2 }),
  notes: 'Eternal Sun: pure white with a green cast, a swept two-cone crown, a halo.',
});

const ETERNAL_MOON = variant(MOON_ADULT, 'Nubbin (Eternal Moon)', {
  colors: {
    body: '#3a1a6a',
    belly: '#5b2a8f',
    tip: '#b08ae8',
    pad: '#7a4fc0',
    crownShade: '#1a0a30',
    iris: '#e0562e',
    wing: '#5b2a8f',
  },
  crown: 'none',
  ball: { shape: 'spikes', color: '#1a0a30', glow: '#7a4fc0' },
  wings: { shape: 'bat', size: 2.0 },
  eyes: { lid: 0.3 },
  scale: 0.9,
  surface: { ...GLASS, glowStrength: 1.4 },
  patch: (spec) => {
    const c = crystals('#b08ae8');
    spec.head.prims.push(...c.head);
    spec.torso.prims.push(...c.torso);
    widen(spec.head, { x: 1.4, z: -1.5 });
    widen(spec.torso, { x: 1.4, z: -1.5 });
    dress(spec, { chunky: 1.2 });
  },
  notes: 'Eternal Moon: deep purple with glowing lilac crystal spikes, slanted eyes, bat wings.',
});

/** The Eternal Neutral look's flats. */
const NEUTRAL_LIME = '#7ee02c';
const NEUTRAL_BELLY = '#d2e640';
const NEUTRAL_SALMON = '#f0707c';
const NEUTRAL_TIP = '#f0a070';

const ETERNAL_NEUTRAL = variant(NEUTRAL_ADULT, 'Nubbin (Eternal Neutral)', {
  // Flat lime green with a yellow-green belly and salmon hands and feet, as in the line-up.
  colors: {
    body: NEUTRAL_LIME,
    belly: NEUTRAL_BELLY,
    tip: NEUTRAL_SALMON,
    pad: NEUTRAL_SALMON,
    crownShade: NEUTRAL_LIME,
    blush: NEUTRAL_LIME,
    star: NEUTRAL_LIME,
    iris: '#1e7a74',
    wing: NEUTRAL_LIME,
  },
  // A single small spike on the crown and two horns at the sides, each tipped salmon.
  crown: [
    cone(V(0, 2.65, 0), V(0, 3.1, -0.05), 0.2, 0.03, NEUTRAL_LIME, 'crown', 0.1),
    cone(V(0, 2.95, -0.04), V(0, 3.12, -0.05), 0.07, 0.02, NEUTRAL_TIP, 'crown', 0.02),
    ...[-1, 1].flatMap((dx) => [
      cone(
        V(dx * 0.72, 2.4, -0.05),
        V(dx * 0.95, 2.9, -0.1),
        0.14,
        0.03,
        NEUTRAL_LIME,
        'horn',
        0.05,
      ),
      cone(
        V(dx * 0.92, 2.78, -0.09),
        V(dx * 0.95, 2.92, -0.1),
        0.07,
        0.02,
        NEUTRAL_TIP,
        'horn',
        0.02,
      ),
    ]),
  ],
  slots: {
    tail: tailStub(NEUTRAL_LIME, 0.8),
    arms: [
      gloveArm(-1, NEUTRAL_LIME, NEUTRAL_SALMON, { y: 1.0, reach: 1.2, hand: 0.2 }),
      gloveArm(1, NEUTRAL_LIME, NEUTRAL_SALMON, { y: 1.0, reach: 1.2, hand: 0.2 }),
    ],
  },
  ball: { color: '#e0309a', glow: '#a02070' },
  wings: null,
  // The closed eye is a white oval with a grey ^; the lids carry the white.
  eyes: { x: 0.46, y: 2.02, r: 0.27, tall: 1.3, lidColor: WHITE, brow: false },
  mouth: { shape: 'smile', width: 0.1, y: 1.7, z: 1.0, line: NEUTRAL_LIME },
  surface: GLASS,
  hints: [
    ...[-1, 1].map((dx) => ({
      kind: 'ellipsoid' as const,
      a: V(dx * 0.46, 2.06, 0.8),
      radii: V(0.27, 0.34, 0.2),
      color: WHITE,
      soft: 0.01,
    })),
    // The belly patch, and the salmon toes.
    {
      kind: 'ellipsoid',
      a: V(0, 0.88, 0.62),
      radii: V(0.45, 0.5, 0.3),
      color: NEUTRAL_BELLY,
      soft: 0.01,
    },
    ...[-1, 1].map((dx) => ({
      kind: 'ellipsoid' as const,
      a: V(dx * 0.36, 0.1, 0.55),
      radii: V(0.3, 0.2, 0.3),
      color: NEUTRAL_SALMON,
      soft: 0.08,
    })),
  ],
  patch: (spec) => {
    const dome = spec.head.prims.find((p) => p.tag === 'head')!;
    dome.a.set(0, 2.0, 0);
    dome.radii!.set(0.95, 0.85, 0.9);
    const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
    belly.radii!.set(0.86, 0.66, 0.72);
    spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
    widen(spec.head, { x: 1.5, z: -1.2 });
    // The gold chain: a ring where the head meets the body, with beads along the front.
    const gold = '#e8c030';
    spec.torso.prims.push({
      kind: 'torus',
      a: V(0, 1.3, 0.1),
      r: 0.58,
      r2: 0.05,
      color: gold,
      tag: 'band',
      blend: 0.03,
    });
    for (let i = -3; i <= 3; i++)
      spec.torso.prims.push({
        kind: 'sphere',
        a: V(i * 0.17, 1.33 - 0.04 * Math.abs(i), 0.64 - 0.03 * i * i * 0.3),
        r: 0.065,
        color: gold,
        tag: 'band',
        blend: 0.02,
      });
    dress(spec, { gloves: NEUTRAL_SALMON, shoes: NEUTRAL_LIME, chunky: 1.2 });
  },
  notes:
    'Line-up figure 5 (Part G8b): a lime-green dragon with a crown spike and two salmon-tipped ' +
    'horns, white oval eyes, a gold chain, a yellow-green belly, salmon hands and toes, a pink ball.',
});

const SHADOW = variant(CHILD, 'Nubbin (Shadow)', {
  colors: {
    body: '#7a6f8c',
    belly: '#c9c0d6',
    tip: '#4a4063',
    pad: '#2b2440',
    crownShade: '#2b2440',
    blush: '#5a4a6a',
    iris: '#e0562e',
    wing: '#4a4063',
  },
  ball: { color: '#2b2440', glow: '#6a2030' },
  surface: { roughness: 0.85, sheen: 0.2 },
  notes: 'The ash-grey stray from the story: a child body in dusk colours.',
});

// ---- the character looks ----

// ---- the line-up match (Part G8b): pieces tuned against docs/reference/chao-world-lineup.jpg ----

/** Darker shade on the underside of each quill, so the cluster reads as separate spikes. */
function quillShades(quills: Prim[], color: string): Mark[] {
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
function gloveArm(
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
function mechLegs(
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
function quillCluster(color: string): Prim[] {
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
const earTips = (color: string): Prim[] =>
  [-1, 1].map((dx) =>
    cone(V(dx * 0.72, 2.4, -0.1), V(dx * 0.98, 2.72, -0.15), 0.13, 0.02, color, 'tip', 0.04),
  );

const QUILLS_BODY = '#2c58e0';
const QUILLS_BELLY = '#f5c99a';
const QUILLS_SHOE = '#d8302a';
/** The quill ball is a shade darker than the dome in the line-up. */
const QUILLS_NAVY = '#2443c4';
const QUILLS_CLUSTER = quillCluster(QUILLS_NAVY);

/** The echidna look's body: a deep crimson-maroon, darker than the flat red of the quills' shoes. */
/** The shade look's flats: near-black suit, grey inner ears. */
const SHADE_BLACK = '#2c2a34';
const SHADE_GREY = '#8c8a96';

/** The dream look's body: a saturated magenta. */
const DREAM_BODY = '#a82a8c';

/** The fox look's flats: orange vest, cream face and feet, black hood, pink trim, navy eyes. */
const FOX_ORANGE = '#f08a1c';
const FOX_CREAM = '#f6e2b4';
const FOX_HOOD = '#16121f';
const FOX_PINK = '#d02a72';
const FOX_NAVY = '#1c2a58';

const ECHIDNA_BODY = '#b8344f';

const look = (id: string, name: string, o: VariantOverrides): NubbinVariant => ({
  id,
  family: 'special',
  spec: variant(CHILD, name, o),
});

export const SPECIAL_VARIANTS: NubbinVariant[] = [
  { id: 'eternal-sun', family: 'special', spec: ETERNAL_SUN },
  { id: 'eternal-moon', family: 'special', spec: ETERNAL_MOON },
  { id: 'eternal-neutral', family: 'special', spec: ETERNAL_NEUTRAL },
  { id: 'shadow', family: 'special', spec: SHADOW },
  look('look-fox', 'Nubbin (Fox look)', {
    // Flat line-up colours: an orange vest over a black hood with a cream face, cream hands
    // and feet. The role colours the base paints as marks all take the orange or cream.
    colors: {
      body: FOX_ORANGE,
      belly: FOX_ORANGE,
      tip: FOX_CREAM,
      pad: FOX_CREAM,
      iris: FOX_NAVY,
      blush: FOX_CREAM,
      star: FOX_ORANGE,
      crownShade: FOX_HOOD,
    },
    crown: 'none',
    slots: {
      ears: [],
      tail: [twinTail('tail', -1, FOX_ORANGE), twinTail('tail2', 1, FOX_ORANGE)],
      arms: [
        gloveArm(-1, FOX_ORANGE, WHITE, { y: 1.1, reach: 0.55 }),
        gloveArm(1, FOX_ORANGE, WHITE, { y: 1.1, reach: 0.55 }),
      ],
    },
    ball: { color: '#f29c2e', glow: '#b86a10' },
    hints: [
      // Black sides to the vest and the gold bell under it.
      ...[-1, 1].map((dx) => ({
        kind: 'ellipsoid' as const,
        a: V(dx * 0.5, 0.85, 0.3),
        radii: V(0.16, 0.3, 0.22),
        color: FOX_HOOD,
        soft: 0.01,
      })),
      { kind: 'sphere' as const, a: V(0, 0.55, 0.58), r: 0.09, color: '#f2c94c', soft: 0.01 },
    ],
    headScale: 1.2,
    eyes: {
      x: 0.5,
      y: 2.12,
      r: 0.17,
      tall: 1.4,
      irisScale: 1,
      iris: FOX_NAVY,
      lidColor: FOX_CREAM,
      lid: 0,
      brow: false,
    },
    mouth: { shape: 'smile', width: 0.14, y: 1.8, z: 1.0, line: '#b8895a' },
    patch: (spec) => {
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.25, 0);
      dome.radii!.set(0.95, 0.85, 0.9);
      // The face is cream; the hood is painted over the top of it, down to a pink V.
      dome.color = FOX_CREAM;
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.02, 0);
      belly.radii!.set(0.58, 0.5, 0.55);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      // A point on the dome's skin at (x, y), pushed a hair out.
      const onDome = (x: number, y: number, out = 0.03): ReturnType<typeof V> =>
        V(x, y, 0.9 * Math.sqrt(Math.max(0, 1 - (x / 0.95) ** 2 - ((y - 2.25) / 0.85) ** 2)) + out);
      // The V: from the temples at y 2.25 down to an apex at y 1.72, as short capsules that
      // follow the dome (a straight chord would cut inside it and paint nothing).
      const vLine = (r: number, lift: number, color: string): Mark[] => {
        const out: Mark[] = [];
        for (const dx of [-1, 1])
          for (let i = 0; i < 4; i++) {
            const x0 = (i / 4) * 0.94;
            const x1 = ((i + 1) / 4) * 0.94;
            const y = (x: number) => 2.0 + 0.64 * x + lift;
            out.push({
              kind: 'capsule',
              a: onDome(dx * x0, y(x0)),
              b: onDome(dx * x1, y(x1)),
              r,
              color,
              soft: 0.01,
            });
          }
        return out;
      };
      spec.marks.push(
        // The hood: black over the back and crown, and thick black capsules riding above the
        // V line so their lower edge is the V.
        {
          kind: 'ellipsoid',
          a: V(0, 3.05, -0.2),
          radii: V(1.1, 0.7, 1.0),
          color: FOX_HOOD,
          soft: 0.01,
        },
        {
          kind: 'ellipsoid',
          a: V(0, 2.3, -0.9),
          radii: V(0.9, 0.8, 0.3),
          color: FOX_HOOD,
          soft: 0.01,
        },
        ...vLine(0.5, 0.5, FOX_HOOD),
        ...vLine(0.1, 0, FOX_PINK),
        // The orange crown with a pale stripe.
        {
          kind: 'ellipsoid',
          a: V(-0.1, 3.12, 0.05),
          radii: V(0.7, 0.3, 0.6),
          color: FOX_ORANGE,
          soft: 0.01,
        },
        {
          kind: 'capsule',
          a: V(-0.4, 3.1, 0.25),
          b: V(0.3, 3.1, -0.1),
          r: 0.06,
          color: WHITE,
          soft: 0.01,
        },
      );
      const gg = gogglesUp('#bfe8ff', '#4a3a30');
      spec.head.prims.push(...gg.prims);
      spec.marks.push(...gg.marks);
      widen(spec.head, { x: 1.4, z: -1.2 });
      mechLegs(spec, {
        leg: FOX_ORANGE,
        ring: FOX_CREAM,
        shoe: FOX_CREAM,
        stripe: FOX_CREAM,
        size: 0.9,
      });
    },
    notes:
      'Line-up figure 3 (Part G8b): a cream face under a black hood edged by a pink V, an orange ' +
      'crown, big navy eyes, goggles pushed up on the right, an orange vest, cream shoes, twin tails.',
  }),
  look('look-echidna', 'Nubbin (Echidna look)', {
    colors: {
      body: ECHIDNA_BODY,
      belly: WHITE,
      tip: WHITE,
      pad: ECHIDNA_BODY,
      iris: '#1e7a74',
      blush: ECHIDNA_BODY,
      star: ECHIDNA_BODY,
      crownShade: WHITE,
    },
    // A low white tuft of short spikes on the top of the dome, in place of the crown.
    crown: [
      cone(V(0, 2.6, 0.1), V(0, 2.98, 0.05), 0.26, 0.03, WHITE, 'crown', 0.03),
      cone(V(-0.3, 2.58, 0.1), V(-0.64, 2.86, 0), 0.22, 0.03, WHITE, 'crown', 0.03),
      cone(V(0.3, 2.58, 0.1), V(0.64, 2.86, 0), 0.22, 0.03, WHITE, 'crown', 0.03),
      cone(V(-0.15, 2.55, 0.35), V(-0.32, 2.9, 0.55), 0.2, 0.03, WHITE, 'crown', 0.03),
      cone(V(0.15, 2.55, 0.35), V(0.32, 2.9, 0.55), 0.2, 0.03, WHITE, 'crown', 0.03),
    ],
    slots: {
      ears: [bigEar(-1, WHITE, ECHIDNA_BODY), bigEar(1, WHITE, ECHIDNA_BODY)],
      arms: [
        gloveArm(-1, ECHIDNA_BODY, WHITE, { y: 1.3, reach: 0.8 }),
        gloveArm(1, ECHIDNA_BODY, WHITE, { y: 1.3, reach: 0.8 }),
      ],
    },
    // The reference's ball is a flat green ring floating over the head.
    ball: { shape: 'halo', color: '#2fa84a', glow: '#1e7a3a' },
    hints: [
      // A big white belly patch with a green dot.
      {
        kind: 'ellipsoid',
        a: V(0, 0.98, 0.5),
        radii: V(0.36, 0.36, 0.3),
        color: WHITE,
        soft: 0.01,
      },
      { kind: 'sphere', a: V(0, 1.2, 0.52), r: 0.1, color: '#4cc47a', soft: 0.01 },
    ],
    headScale: 1.2,
    eyes: { r: 0.34, tall: 1.15, brow: false },
    mouth: { shape: 'smile', width: 0.26, y: 1.72, z: 1.0, line: '#c8203a' },
    patch: (spec) => {
      // A wide, low dome and a small body, as in the line-up.
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.0, 0);
      dome.radii!.set(1.12, 0.8, 0.92);
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.0, 0);
      belly.radii!.set(0.56, 0.5, 0.54);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      // The white muzzle across the lower face.
      spec.head.prims.push({
        kind: 'ellipsoid',
        a: V(0, 1.72, 0.72),
        r: 0,
        radii: V(0.58, 0.3, 0.3),
        color: WHITE,
        tag: 'muzzle',
        blend: 0.08,
      });
      widen(spec.head, { x: 1.7, z: -1.2 });
      mechLegs(spec, {
        leg: ECHIDNA_BODY,
        ring: ECHIDNA_BODY,
        shoe: WHITE,
        stripe: WHITE,
        size: 0.8,
      });
    },
    notes:
      'Line-up figure 2 (Part G8b): crimson, a wide low head with a white tuft, huge white ears, ' +
      'a white muzzle and belly patch with a green dot, white gloves and shoes, a green ring above.',
  }),
  look('look-rose', 'Nubbin (Rose look)', {
    colors: {
      body: '#f7a3c2',
      belly: '#ffc8d8',
      tip: WHITE,
      pad: '#a3365e',
      crownShade: '#e85a7a',
    },
    slots: { ears: [roundEar(-1, '#ffc8d8', 0.28), roundEar(1, '#ffc8d8', 0.28)] },
    hints: [chestMark('#ffc8d8', 1.05, 0.3)],
    patch: (spec) => {
      const bow = (a: Prim['a']): Prim => ({
        kind: 'ellipsoid',
        a,
        radii: V(0.14, 0.1, 0.1),
        r: 0,
        color: '#e0562e',
        tag: 'band',
      });
      spec.head.prims.push(
        {
          kind: 'torus',
          a: V(0, 2.32, 0),
          r: 0.7,
          r2: 0.06,
          color: '#e0562e',
          tag: 'band',
          blend: 0.04,
        },
        bow(V(0.55, 2.5, 0.35)),
        bow(V(0.75, 2.42, 0.2)),
      );
      dress(spec, { gloves: WHITE, shoes: '#e85a7a' });
    },
    notes: 'Pink with round ears, a red headband and bow, white gloves and pink shoes.',
  }),
  look('look-dream', 'Nubbin (Dream look)', {
    // Flat magenta all over; a darker centre on the belly, a gold horn, a black ball above.
    colors: {
      body: DREAM_BODY,
      belly: DREAM_BODY,
      tip: '#e6b84a',
      pad: DREAM_BODY,
      iris: '#2a1a4a',
      blush: DREAM_BODY,
      star: DREAM_BODY,
      crownShade: DREAM_BODY,
    },
    // An onion dome: a wide cone that melts into the head, tiny ear points and the gold horn.
    crown: [
      cone(V(0, 2.5, 0), V(0, 3.2, -0.05), 0.58, 0.04, DREAM_BODY, 'crown', 0.1),
      ...[-1, 1].map((dx) =>
        cone(
          V(dx * 0.9, 2.28, -0.1),
          V(dx * 1.12, 2.55, -0.15),
          0.13,
          0.02,
          DREAM_BODY,
          'ear',
          0.05,
        ),
      ),
      cone(V(0, 2.4, 0.6), V(0, 2.82, 0.78), 0.13, 0.02, '#e6b84a', 'tip', 0.03),
    ],
    slots: {
      arms: [braceletArm(-1, DREAM_BODY), braceletArm(1, DREAM_BODY)],
    },
    ball: { color: '#1a1424', glow: '#3a2a50' },
    hints: [
      // The eyes are white ovals the closed arcs are drawn on.
      ...[-1, 1].map((dx) => ({
        kind: 'ellipsoid' as const,
        a: V(dx * 0.46, 1.86, 0.86),
        radii: V(0.34, 0.42, 0.2),
        color: WHITE,
        soft: 0.01,
      })),
      // The dark smudge in the middle of the belly.
      {
        kind: 'ellipsoid',
        a: V(0, 1.0, 0.5),
        radii: V(0.4, 0.42, 0.3),
        color: '#5a1250',
        soft: 0.12,
      },
    ],
    headScale: 1.2,
    // A closed eye stays a white oval with a dark ^ across it.
    eyes: { x: 0.42, y: 1.78, r: 0.3, tall: 1.3, lidColor: WHITE, brow: false },
    mouth: { shape: 'smile', width: 0.12, y: 1.62, z: 1.0, line: '#d0508a' },
    patch: (spec) => {
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.0, 0);
      dome.radii!.set(1.2, 0.78, 0.95);
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.0, 0);
      belly.radii!.set(0.6, 0.55, 0.56);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      widen(spec.head, { x: 1.4, z: -1.2 });
      // Long pointed teardrop legs in place of legs and shoes.
      for (const ps of spec.parts) {
        if (!ps.name.startsWith('leg')) continue;
        const x = (ps.name === 'legL' ? -1 : 1) * 0.36;
        ps.prims = [
          cone(V(x, 0.78, 0.05), V(x * 1.4, 0.08, 0.3), 0.36, 0.14, DREAM_BODY, 'foot', 0.1),
        ];
        ps.box = [V(x - 0.8, -0.2, -0.5), V(x + 0.8, 1.0, 0.8)];
        ps.resolution = 56;
      }
    },
    notes:
      'Line-up figure 4 (Part G8b): an onion-domed magenta head with tiny ear points and a gold ' +
      'horn, big white oval eyes, grey studded bracers, a dark belly centre, pointed legs.',
  }),
  look('look-quills', 'Nubbin (Quills look)', {
    // Flat line-up colours; the blush, star and crown shade take the body colour so no
    // soft marks show on the flat head.
    colors: {
      body: QUILLS_BODY,
      belly: QUILLS_BELLY,
      tip: QUILLS_BELLY,
      pad: '#1f3db0',
      iris: '#1e7a74',
      blush: QUILLS_BODY,
      star: QUILLS_BODY,
      crownShade: QUILLS_BODY,
    },
    crown: [...QUILLS_CLUSTER, ...earTips('#f2c94c')],
    hints: [
      ...quillShades(QUILLS_CLUSTER, '#17289a'),
      chestMark(QUILLS_BELLY, 0.92, 0.3),
      // The mech emblem on the belly: a yellow ring around a dark hexagon-like disc.
      { kind: 'sphere', a: V(0, 0.9, 0.5), r: 0.2, color: '#f2c94c', soft: 0.01 },
      { kind: 'sphere', a: V(0, 0.9, 0.52), r: 0.13, color: '#1a1026', soft: 0.01 },
    ],
    slots: { arms: [gloveArm(-1, QUILLS_BODY, WHITE), gloveArm(1, QUILLS_BODY, WHITE)] },
    // The head is about half the standing height in the line-up.
    headScale: 1.25,
    eyes: { r: 0.34, tall: 1.15, brow: false },
    mouth: { shape: 'o', width: 0.24, y: 1.74, z: 1.0, line: QUILLS_SHOE },
    patch: (spec) => {
      // The dome is wider than it is tall, and the body a small ball held clear of the legs.
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.02, 0);
      dome.radii!.set(1.0, 0.8, 0.9);
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.05, 0);
      belly.radii!.set(0.56, 0.5, 0.54);
      // Flat colour top to bottom: the line-up's figures carry no painted gradient.
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      // The peach muzzle, raised off the face around the mouth.
      spec.head.prims.push({
        kind: 'ellipsoid',
        a: V(0, 1.74, 0.76),
        r: 0,
        radii: V(0.4, 0.24, 0.28),
        color: QUILLS_BELLY,
        tag: 'muzzle',
        blend: 0.08,
      });
      widen(spec.head, { x: 1.4, z: -1.75 });
      mechLegs(spec, { leg: '#8e95a3', ring: QUILLS_SHOE, shoe: QUILLS_SHOE, stripe: WHITE });
    },
    notes:
      'Line-up figure 1 (Part G8b): head half the height, five quills with shade marks, a peach ' +
      'muzzle, glove balls with cuffs, mech lower legs with a red ring, red striped shoes.',
  }),
  look('look-shade', 'Nubbin (Shade look)', {
    // A black cat suit: flat near-black, grey inner ears, a white collar with a lilac diamond.
    colors: {
      body: SHADE_BLACK,
      belly: SHADE_BLACK,
      tip: SHADE_BLACK,
      pad: SHADE_BLACK,
      iris: '#2a2a3a',
      blush: SHADE_BLACK,
      star: SHADE_BLACK,
      crownShade: SHADE_BLACK,
    },
    // A few white spikes standing up behind the crown.
    crown: [
      cone(V(-0.25, 2.65, -0.35), V(-0.4, 2.95, -0.5), 0.15, 0.02, WHITE, 'crown', 0.03),
      cone(V(0.05, 2.7, -0.35), V(0.1, 3.05, -0.5), 0.17, 0.02, WHITE, 'crown', 0.03),
      cone(V(0.35, 2.65, -0.3), V(0.5, 2.9, -0.45), 0.13, 0.02, WHITE, 'crown', 0.03),
    ],
    slots: {
      ears: [catEar(-1, SHADE_BLACK, SHADE_GREY), catEar(1, SHADE_BLACK, SHADE_GREY)],
      arms: [foldedArm(-1, SHADE_BLACK), foldedArm(1, SHADE_BLACK)],
    },
    ball: { shape: 'spikes', color: '#3a3840', glow: '#201e26' },
    hints: [
      // White oval eyes with a white slash over the left one.
      ...[-1, 1].map((dx) => ({
        kind: 'ellipsoid' as const,
        a: V(dx * 0.42, 2.0, 0.8),
        radii: V(0.2, 0.3, 0.2),
        color: WHITE,
        soft: 0.01,
      })),
      {
        kind: 'capsule' as const,
        a: V(-0.62, 2.28, 0.6),
        b: V(-0.3, 1.82, 0.84),
        r: 0.05,
        color: WHITE,
        soft: 0.01,
      },
      // The white collar and the lilac diamond on the chest.
      {
        kind: 'ellipsoid' as const,
        a: V(0, 1.4, 0.55),
        radii: V(0.34, 0.1, 0.22),
        color: WHITE,
        soft: 0.01,
      },
      {
        kind: 'ellipsoid' as const,
        a: V(0, 1.26, 0.66),
        radii: V(0.13, 0.18, 0.1),
        color: '#d070e0',
        soft: 0.01,
      },
    ],
    headScale: 1.15,
    eyes: { x: 0.42, y: 2.0, r: 0.22, tall: 1.4, lidColor: WHITE, brow: false },
    mouth: { shape: 'o', width: 0.07, y: 1.66, z: 1.0, line: '#d02a3a' },
    patch: (spec) => {
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.0, 0);
      dome.radii!.set(1.05, 0.88, 0.92);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      widen(spec.head, { x: 1.4, z: -1.2 });
      mechLegs(spec, {
        leg: SHADE_BLACK,
        ring: SHADE_BLACK,
        shoe: WHITE,
        stripe: WHITE,
        size: 0.95,
      });
    },
    notes:
      'Line-up figure 6 (Part G8b): a black cat suit, tall pointed ears with grey insides, white ' +
      'spikes behind the crown, white oval eyes, a white collar with a lilac diamond, white shoes.',
  }),
];
