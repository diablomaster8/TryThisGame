import { V, type Prim } from './sculpted';
import {
  CHILD,
  MOON_ADULT,
  NEUTRAL_ADULT,
  SUN_ADULT,
  horns,
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

/** A pointed ear: a cone from the crown's base up and slightly out, hinged at its base. */
const pointEar = (dx: number, color: string, len = 0.7): PartSpec => ({
  name: dx < 0 ? 'earL' : 'earR',
  pivot: V(dx * 0.45, 2.3, -0.1),
  prims: [
    cone(V(dx * 0.42, 2.25, -0.1), V(dx * 0.72, 2.25 + len, -0.2), 0.24, 0.03, color, 'ear', 0.06),
  ],
  box: [V(dx < 0 ? -1.1 : 0.1, 2.0, -0.6), V(dx < 0 ? -0.1 : 1.1, 3.4, 0.4)],
  resolution: 40,
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

/** Big rounded quills swept back from the head: three high, two low. */
/** Aviator goggles pushed up on the brow: a strap and two lenses. */
function goggles(strap: string, lens: string): Prim[] {
  return [
    {
      kind: 'torus',
      a: V(0, 2.5, 0.02),
      r: 0.62,
      r2: 0.07,
      color: strap,
      tag: 'band',
      blend: 0.04,
    },
    ball(V(-0.3, 2.55, 0.66), 0.19, lens, 'goggle'),
    ball(V(0.3, 2.55, 0.66), 0.19, lens, 'goggle'),
    {
      kind: 'torus',
      a: V(-0.3, 2.55, 0.66),
      r: 0.19,
      r2: 0.045,
      color: strap,
      tag: 'band',
      blend: 0.03,
    },
    {
      kind: 'torus',
      a: V(0.3, 2.55, 0.66),
      r: 0.19,
      r2: 0.045,
      color: strap,
      tag: 'band',
      blend: 0.03,
    },
  ];
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

const ETERNAL_NEUTRAL = variant(NEUTRAL_ADULT, 'Nubbin (Eternal Neutral)', {
  colors: {
    body: '#86d94a',
    belly: '#fff1c9',
    tip: '#f29c2e',
    pad: '#e0562e',
    crownShade: '#3f9a2a',
    iris: '#1e7a74',
    wing: '#c6ec6a',
  },
  crown: [
    cone(V(0, 2.35, 0), V(0, 3.1, -0.55), 0.32, 0.05, '#86d94a', 'crown', 0.12),
    ball(V(0, 3.12, -0.57), 0.08, '#f29c2e'),
  ],
  slots: { tail: tailStub('#86d94a', 1.0) },
  ball: { color: '#f29c2e', glow: '#b86a10' },
  wings: { shape: 'fairy', size: 1.8 },
  scale: 0.9,
  surface: GLASS,
  patch: (spec) => {
    spec.head.prims.push(...horns('#f29c2e'));
    dress(spec, { chunky: 1.25 });
  },
  notes: 'Eternal Neutral: a lime-green dragon look with orange horns, claws and a long tail.',
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
const gloveArm = (dx: number, body: string, glove: string): PartSpec => ({
  name: dx < 0 ? 'armL' : 'armR',
  // The arms stick straight out sideways in the line-up.
  pivot: V(dx * 0.55, 1.0, 0.1),
  prims: [
    {
      kind: 'capsule',
      a: V(dx * 0.55, 1.0, 0.1),
      b: V(dx * 1.0, 0.98, 0.14),
      r: 0.13,
      color: body,
      tag: 'arm',
    },
    ball(V(dx * 1.03, 0.98, 0.14), 0.2, glove, 'cuff'),
    { ...ball(V(dx * 1.3, 0.98, 0.16), 0.3, glove, 'hand'), blend: 0.06 },
  ],
  box: [V(dx < 0 ? -1.75 : 0.2, 0.5, -0.4), V(dx < 0 ? -0.2 : 1.75, 1.45, 0.6)],
});

/**
 * Mech lower legs under big shoes: a grey capsule with a red ring, a red shoe a third
 * larger than the toy foot, and the white stripe as a flattened ellipsoid standing proud
 * of the shoe's top. Replaces the leg parts' primitives in place (final coordinates).
 */
function mechLegs(
  spec: SpeciesSpec,
  o: { leg: string; ring: string; shoe: string; stripe: string },
): void {
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
        radii: V(0.37, 0.28, 0.52),
        color: o.shoe,
        tag: 'foot',
        blend: 0.05,
      },
      {
        kind: 'ellipsoid',
        a: V(x, 0.28, 0.68),
        r: 0,
        radii: V(0.4, 0.07, 0.17),
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
    colors: { body: '#f29c2e', belly: WHITE, tip: WHITE, pad: '#e0562e', crownShade: '#c06a10' },
    slots: {
      ears: [pointEar(-1, '#f29c2e', 0.55), pointEar(1, '#f29c2e', 0.55)],
      tail: [twinTail('tail', -1, '#f29c2e'), twinTail('tail2', 1, '#f29c2e')],
    },
    hints: [chestMark(WHITE, 1.0, 0.34)],
    patch: (spec) => {
      spec.head.prims.push(...goggles('#5a3a2a', '#8fd6f0'));
      dress(spec, { gloves: WHITE, shoes: '#e0562e' });
    },
    notes: 'Orange and white with goggles on the brow, pointed ears and twin white-tipped tails.',
  }),
  look('look-echidna', 'Nubbin (Echidna look)', {
    colors: { body: '#e0304a', belly: WHITE, tip: WHITE, pad: '#e0304a', crownShade: '#9e2b3f' },
    slots: { ears: [roundEar(-1, WHITE), roundEar(1, WHITE)] },
    ball: { color: '#3fbfa8', glow: '#1e7a74' },
    hints: [chestMark(WHITE, 1.05, 0.34)],
    patch: (spec) => {
      spec.head.prims.push({
        kind: 'torus',
        a: V(0, 2.32, 0),
        r: 0.63,
        r2: 0.07,
        color: WHITE,
        tag: 'band',
        blend: 0.04,
      });
      dress(spec, { gloves: WHITE, shoes: '#e0304a' });
    },
    notes: 'Rose red with big round white ears, a white headband, white gloves and a green ball.',
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
    colors: {
      body: '#7a2fb0',
      belly: '#e0c9f7',
      tip: '#c02a8a',
      pad: '#5b1f80',
      crownShade: '#5b1f80',
    },
    crown: [
      cone(V(0, 2.35, 0), V(0, 3.45, -0.55), 0.34, 0.04, '#c02a8a', 'crown', 0.1),
      cone(V(0, 2.3, 0.1), V(0.1, 2.95, 0.4), 0.18, 0.03, '#c02a8a', 'crown', 0.08),
      ball(V(0, 3.47, -0.57), 0.09, '#ffd94a'),
    ],
    hints: [
      // A pale mask across the eyes and a white chest star.
      {
        kind: 'ellipsoid',
        a: V(0, 2.05, 0.5),
        radii: V(0.66, 0.24, 0.34),
        color: '#b08ae8',
        soft: 0.03,
      },
      chestMark(WHITE, 1.05, 0.26),
    ],
    patch: (spec) => dress(spec, { gloves: '#c02a8a', shoes: '#c02a8a' }),
    notes: 'Purple and magenta with a tall swept jester point, a pale mask and a white chest star.',
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
    colors: {
      body: '#0d0a1a',
      belly: WHITE,
      tip: WHITE,
      pad: '#2b2440',
      iris: '#3fbfa8',
      blush: '#2b2440',
    },
    crown: 'none',
    eyes: { lid: 0.3 },
    slots: { ears: [pointEar(-1, '#0d0a1a', 0.6), pointEar(1, '#0d0a1a', 0.6)] },
    hints: [
      chestMark(WHITE, 1.1, 0.3),
      ...[-1, 1].map((dx) => ({
        kind: 'ellipsoid' as const,
        a: V(dx * 0.64, 1.78, 0.28),
        radii: V(0.2, 0.14, 0.16),
        color: WHITE,
        soft: 0.02,
      })),
    ],
    patch: (spec) => dress(spec, { gloves: WHITE, shoes: '#2b2440' }),
    notes: 'A black cat: pointed ears, white cheek tufts, chest and gloves, slanted green eyes.',
  }),
];
