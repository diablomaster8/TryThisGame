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
import type { PartSpec, SpeciesSpec } from './species';

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

/** A white stripe across each shoe. */
const shoeStripes = (color = WHITE) =>
  [-1, 1].map((dx) => ({
    kind: 'ellipsoid' as const,
    a: V(dx * 0.36, 0.2, 0.42),
    radii: V(0.3, 0.05, 0.16),
    color,
    soft: 0.02,
  }));

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
function bigQuills(color: string): Prim[] {
  const q = (a: Prim['a'], b: Prim['a'], r: number) => cone(a, b, r, 0.06, color, 'quill', 0.09);
  return [
    q(V(0, 2.45, -0.25), V(0, 3.0, -1.25), 0.28),
    q(V(-0.36, 2.3, -0.3), V(-0.8, 2.6, -1.2), 0.25),
    q(V(0.36, 2.3, -0.3), V(0.8, 2.6, -1.2), 0.25),
    q(V(-0.5, 1.9, -0.35), V(-0.9, 1.85, -1.05), 0.2),
    q(V(0.5, 1.9, -0.35), V(0.9, 1.85, -1.05), 0.2),
  ];
}

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
    colors: { body: '#2f5fe6', belly: '#ffd2a6', tip: '#ffd2a6', pad: '#1f3db0', iris: '#1e7a74' },
    crown: 'none',
    hints: [...shoeStripes(), chestMark('#ffd2a6', 1.05, 0.32)],
    patch: (spec) => {
      spec.head.prims.push(...bigQuills('#2f5fe6'));
      widen(spec.head, { x: 1.2, z: -1.7 });
      dress(spec, { gloves: WHITE, shoes: '#e0562e', chunky: 1.35 });
    },
    notes: 'Blue with five big rounded quills, a peach belly, white gloves and red striped shoes.',
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
