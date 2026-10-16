import { V, type Prim } from './sculpted';
import {
  CHILD,
  MOON_ADULT,
  NEUTRAL_ADULT,
  SUN_ADULT,
  horns,
  quills,
  variant,
  type NubbinVariant,
  type VariantOverrides,
} from './nubbin-variants';
import type { PartSpec, SpeciesSpec } from './species';

/**
 * The special Nubbin forms: the three Eternals (the rare immortal adults, glassy and jewel-like,
 * with wings twice the size and a crown of their own), the ash-grey Shadow stray from the story,
 * and six unlockable character looks on the child body, each with its own modelled accessories
 * (ears and twin tails, locks, a headband, a jester hat, quills, a swept crest). Everything is
 * derived from the templates with `variant()`; custom crowns, slot parts and head additions are
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

const crownPrim = (
  a: Prim['a'],
  b: Prim['a'],
  r: number,
  r2: number,
  color: string,
  blend = 0.14,
): Prim => ({ kind: 'cone', a, b, r, r2, color, tag: 'crown', blend });
const tipPrim = (a: Prim['a'], r: number, color: string): Prim => ({
  kind: 'sphere',
  a,
  r,
  color,
  tag: 'tip',
});

/** Grow the head's sculpt box so additions past the base box are not clipped. */
function widenHead(spec: SpeciesSpec, w: { y?: number; z?: number }): void {
  const box = spec.head.box;
  if (w.y !== undefined) box[0].y = Math.min(box[0].y, w.y);
  if (w.z !== undefined) box[0].z = Math.min(box[0].z, w.z);
}

const ETERNAL_SUN = variant(SUN_ADULT, 'Nubbin (Eternal Sun)', {
  colors: {
    body: '#ffffff',
    belly: '#ffffff',
    tip: '#c8ffe0',
    pad: '#8ae5d2',
    crownShade: '#d8fff0',
    iris: '#1e7a74',
    wing: '#e0fff0',
  },
  crown: [
    crownPrim(V(0, 2.35, 0.1), V(0, 3.15, -0.6), 0.36, 0.05, '#ffffff'),
    crownPrim(V(0, 2.3, -0.2), V(0, 2.8, -0.9), 0.22, 0.04, '#ffffff'),
    tipPrim(V(0, 3.17, -0.62), 0.07, '#c8ffe0'),
  ],
  ball: { shape: 'halo', y: 3.65, color: '#ffe680', glow: '#d0a020' },
  wings: { shape: 'feather', size: 2.2 },
  scale: 0.9,
  surface: GLASS,
  notes: 'Eternal Sun: pure white with a green cast, a swept two-cone crown, a halo.',
});

const ETERNAL_MOON = variant(MOON_ADULT, 'Nubbin (Eternal Moon)', {
  colors: {
    body: '#16284a',
    belly: '#2e4a7a',
    tip: '#4a9be0',
    pad: '#2e5ca8',
    iris: '#e0562e',
    wing: '#1f3db0',
  },
  crown: 'none',
  ball: { shape: 'spikes', color: '#2e5ca8', glow: '#4a9be0' },
  wings: { shape: 'bat', size: 2.2 },
  eyes: { lid: 0.3 },
  scale: 0.9,
  surface: GLASS,
  patch: (spec) => {
    spec.head.prims.push(...quills('#4a9be0'), ...horns('#4a9be0'));
    widenHead(spec, { z: -1.5 });
  },
  notes: 'Eternal Moon: navy and blue, slanted eyes, an angular head of quills and horns.',
});

const ETERNAL_NEUTRAL = variant(NEUTRAL_ADULT, 'Nubbin (Eternal Neutral)', {
  colors: {
    body: '#7fe6d0',
    belly: '#e8fff8',
    tip: '#3fbfa8',
    pad: '#1e7a74',
    crownShade: '#3fbfa8',
    iris: '#1e7a74',
  },
  crown: [
    {
      kind: 'ellipsoid',
      a: V(0, 2.8, -0.05),
      radii: V(0.08, 0.55, 0.32),
      r: 0,
      color: '#7fe6d0',
      tag: 'crown',
      blend: 0.1,
    },
    tipPrim(V(0, 3.35, -0.05), 0.07, '#3fbfa8'),
  ],
  ball: { color: '#3fbfa8', glow: '#1e7a74' },
  wings: { shape: 'fairy', size: 2.2 },
  scale: 0.9,
  surface: GLASS,
  notes: 'Eternal Neutral: cyan-green, a tall thin crest, fairy wings.',
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

/** A pointed ear: a cone from the crown's base up and slightly back, hinged at its base. */
const foxEar = (dx: number, color: string): PartSpec => ({
  name: dx < 0 ? 'earL' : 'earR',
  pivot: V(dx * 0.45, 2.3, -0.1),
  prims: [
    {
      kind: 'cone',
      a: V(dx * 0.45, 2.3, -0.1),
      b: V(dx * 0.7, 3.0, -0.2),
      r: 0.2,
      r2: 0.03,
      color,
      tag: 'ear',
      blend: 0.06,
    },
  ],
  box: [V(dx < 0 ? -1.0 : 0.1, 2.1, -0.6), V(dx < 0 ? -0.1 : 1.0, 3.3, 0.4)],
  resolution: 40,
});

/** One of the twin tails: a capsule sweeping back and up, ending in a white ball. */
const foxTail = (name: string, dx: number, color: string): PartSpec => ({
  name,
  pivot: V(dx * 0.2, 0.6, -0.6),
  prims: [
    {
      kind: 'capsule',
      a: V(dx * 0.2, 0.6, -0.6),
      b: V(dx * 0.45, 1.0, -1.5),
      r: 0.16,
      color,
      tag: 'tail',
      blend: 0.08,
    },
    { kind: 'sphere', a: V(dx * 0.45, 1.0, -1.5), r: 0.2, color: '#ffffff', tag: 'tail' },
  ],
  box: [V(-1, 0, -2), V(1, 1.5, -0.2)],
  resolution: 40,
});

/** A lock of hair hanging from the back or side of the head. */
const lock = (a: [number, number, number], b: [number, number, number], color: string): Prim => ({
  kind: 'capsule',
  a: V(...a),
  b: V(...b),
  r: 0.16,
  color,
  tag: 'lock',
  blend: 0.07,
});

export const SPECIAL_VARIANTS: NubbinVariant[] = [
  { id: 'eternal-sun', family: 'special', spec: ETERNAL_SUN },
  { id: 'eternal-moon', family: 'special', spec: ETERNAL_MOON },
  { id: 'eternal-neutral', family: 'special', spec: ETERNAL_NEUTRAL },
  { id: 'shadow', family: 'special', spec: SHADOW },
  look('look-fox', 'Nubbin (Fox look)', {
    colors: { body: '#ffd94a', belly: '#ffffff', tip: '#ffffff', pad: '#f29c2e' },
    slots: {
      ears: [foxEar(-1, '#ffd94a'), foxEar(1, '#ffd94a')],
      tail: [foxTail('tail', -1, '#ffd94a'), foxTail('tail2', 1, '#ffd94a')],
    },
    notes: 'Yellow and white with two pointed ears and twin white-tipped tails.',
  }),
  look('look-echidna', 'Nubbin (Echidna look)', {
    colors: { body: '#e0562e', belly: '#fff1c9', tip: '#ffffff', pad: '#e0562e' },
    crown: 'none',
    hints: [
      {
        kind: 'ellipsoid',
        a: V(0, 1.05, 0.62),
        radii: V(0.3, 0.12, 0.2),
        color: '#ffffff',
        soft: 0.02,
      },
    ],
    patch: (spec) => {
      const c = '#e0562e';
      spec.head.prims.push(
        lock([0, 2.3, -0.3], [0, 1.3, -0.8], c),
        lock([-0.45, 2.15, -0.35], [-0.5, 1.3, -0.85], c),
        lock([0.45, 2.15, -0.35], [0.5, 1.3, -0.85], c),
        lock([-0.6, 1.9, -0.1], [-0.7, 1.3, -0.6], c),
        lock([0.6, 1.9, -0.1], [0.7, 1.3, -0.6], c),
      );
      widenHead(spec, { y: 1.0, z: -1.3 });
    },
    notes: 'Red with a white chest crescent and five long locks hanging from the head.',
  }),
  look('look-rose', 'Nubbin (Rose look)', {
    colors: { body: '#f7a3c2', belly: '#ffc8d8', tip: '#e85a7a', pad: '#a3365e' },
    patch: (spec) => {
      const bow = (a: Prim['a']): Prim => ({
        kind: 'ellipsoid',
        a,
        radii: V(0.12, 0.09, 0.09),
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
    },
    notes: 'Pink with a red headband and a small bow at the side.',
  }),
  look('look-dream', 'Nubbin (Dream look)', {
    colors: { body: '#9b5de5', belly: '#e0c9f7', tip: '#e85a7a', pad: '#5b3a8f' },
    crown: [
      crownPrim(V(0, 2.35, 0), V(-0.75, 3.0, -0.2), 0.32, 0.04, '#e0562e', 0.1),
      crownPrim(V(0, 2.35, 0), V(0.75, 3.0, -0.2), 0.32, 0.04, '#e0562e', 0.1),
      tipPrim(V(-0.75, 3.0, -0.2), 0.1, '#ffd94a'),
      tipPrim(V(0.75, 3.0, -0.2), 0.1, '#ffd94a'),
    ],
    notes: 'Purple with a two-pointed red jester hat and gold bells.',
  }),
  look('look-quills', 'Nubbin (Quills look)', {
    colors: { body: '#3b6cf0', belly: '#ffd2a6', tip: '#ffd2a6', pad: '#1f3db0', iris: '#1e7a74' },
    crown: 'none',
    hints: [-1, 1].map((dx) => ({
      kind: 'ellipsoid' as const,
      a: V(dx * 0.36, 0.12, 0.3),
      radii: V(0.3, 0.14, 0.4),
      color: '#e0562e',
      soft: 0.02,
    })),
    patch: (spec) => {
      spec.head.prims.push(...quills('#1f3db0'));
      widenHead(spec, { z: -1.5 });
    },
    notes: 'Blue with swept-back quills, green irises and red sneakers.',
  }),
  look('look-shade', 'Nubbin (Shade look)', {
    colors: { body: '#0d0a1a', belly: '#2b2440', tip: '#e0562e', pad: '#9e2b3f', iris: '#e0562e' },
    crown: 'none',
    eyes: { lid: 0.3 },
    hints: [
      {
        kind: 'ellipsoid',
        a: V(0, 1.1, 0.62),
        radii: V(0.26, 0.14, 0.2),
        color: '#ffffff',
        soft: 0.02,
      },
    ],
    patch: (spec) => {
      spec.head.prims.push(...quills('#e0562e'));
      widenHead(spec, { z: -1.5 });
    },
    notes: 'Near-black with red quills, slanted eyes and a white chest tuft.',
  }),
];
