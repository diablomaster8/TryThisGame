import { V, type Prim } from './sculpted';
import {
  CHILD,
  MOON_ADULT,
  NEUTRAL_ADULT,
  SUN_ADULT,
  variant,
  type NubbinVariant,
} from './nubbin-variants';

/**
 * The special Nubbin forms: the three Eternals (the rare immortal adults, glassy and jewel-like,
 * with wings twice the size and a crown of their own), the ash-grey Shadow stray from the story,
 * and four unlockable character looks. The looks are palette-only stand-ins on the child body
 * until their head accessories are modelled. Everything is derived from the templates with
 * `variant()`; custom crowns are written in final colours because the palette swap runs first.
 */

/** The glassy finish the Eternals share. */
const GLASS = {
  detail: 'smooth',
  roughness: 0.18,
  clearcoat: 0.8,
  sheen: 1,
  amount: 0.05,
} as const;

const crownPrim = (a: Prim['a'], b: Prim['a'], r: number, r2: number, color: string): Prim => ({
  kind: 'cone',
  a,
  b,
  r,
  r2,
  color,
  tag: 'crown',
  blend: 0.14,
});
const tipPrim = (a: Prim['a'], r: number, color: string): Prim => ({
  kind: 'sphere',
  a,
  r,
  color,
  tag: 'tip',
});
const horn = (dx: number, color: string): Prim => ({
  kind: 'capsule',
  a: V(dx * 0.15, 2.35, -0.05),
  b: V(dx * 0.45, 2.95, -0.45),
  r: 0.11,
  color,
  tag: 'crown',
  blend: 0.08,
});

const ETERNAL_SUN = variant(SUN_ADULT, 'Nubbin (Eternal Sun)', {
  colors: {
    body: '#ffffff',
    belly: '#ffffff',
    tip: '#ffd94a',
    pad: '#f29c2e',
    crownShade: '#fff1c9',
    iris: '#2e5ca8',
    wing: '#fff1c9',
  },
  crown: [
    crownPrim(V(0, 2.35, 0), V(0, 3.3, 0), 0.3, 0.04, '#ffffff'),
    crownPrim(V(-0.15, 2.35, 0), V(-0.35, 3.05, 0), 0.2, 0.04, '#ffffff'),
    crownPrim(V(0.15, 2.35, 0), V(0.35, 3.05, 0), 0.2, 0.04, '#ffffff'),
    tipPrim(V(0, 3.3, 0), 0.08, '#ffd94a'),
  ],
  ball: { shape: 'halo', y: 3.65, color: '#ffe680', glow: '#d0a020' },
  wings: { shape: 'feather', size: 2.2 },
  scale: 0.9,
  surface: GLASS,
  notes: 'Eternal Sun: three spires, a larger halo, glassy white.',
});

const ETERNAL_MOON = variant(MOON_ADULT, 'Nubbin (Eternal Moon)', {
  colors: {
    body: '#0d0a1a',
    belly: '#4a4063',
    tip: '#e0562e',
    pad: '#9e2b3f',
    crownShade: '#2b2440',
    iris: '#e0562e',
    wing: '#9e2b3f',
  },
  crown: [
    horn(-1, '#0d0a1a'),
    horn(1, '#0d0a1a'),
    crownPrim(V(0, 2.35, 0), V(0, 2.8, 0), 0.3, 0.05, '#0d0a1a'),
    tipPrim(V(0, 2.82, 0), 0.07, '#e0562e'),
  ],
  ball: { shape: 'spikes', color: '#9e2b3f', glow: '#ff5a3a' },
  wings: { shape: 'bat', size: 2.2 },
  scale: 0.9,
  surface: GLASS,
  notes: 'Eternal Moon: two swept horns, a short centre point, glassy black.',
});

const ETERNAL_NEUTRAL = variant(NEUTRAL_ADULT, 'Nubbin (Eternal Neutral)', {
  colors: {
    body: '#c9c0d6',
    belly: '#e8e2ee',
    tip: '#3fbfa8',
    pad: '#1e7a74',
    crownShade: '#7a6f8c',
    iris: '#1e7a74',
    wing: '#cdb1f0',
  },
  crown: [
    {
      kind: 'ellipsoid',
      a: V(0, 2.75, 0),
      radii: V(0.08, 0.5, 0.3),
      r: 0,
      color: '#c9c0d6',
      tag: 'crown',
      blend: 0.1,
    },
    tipPrim(V(0, 3.25, 0), 0.07, '#3fbfa8'),
  ],
  ball: { color: '#3fbfa8', glow: '#1e7a74' },
  wings: { shape: 'fairy', size: 2.2 },
  scale: 0.9,
  surface: GLASS,
  notes: 'Eternal Neutral: a tall thin crest, fairy wings, glassy lilac grey.',
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

const PLACEHOLDER = 'head accessory not yet modelled';

const look = (
  id: string,
  name: string,
  colors: { body: string; belly: string; tip: string; crownShade: string },
): NubbinVariant => ({
  id,
  family: 'special',
  spec: variant(CHILD, name, { colors, notes: 'Palette-only look on the child body.' }),
  placeholder: PLACEHOLDER,
});

export const SPECIAL_VARIANTS: NubbinVariant[] = [
  { id: 'eternal-sun', family: 'special', spec: ETERNAL_SUN },
  { id: 'eternal-moon', family: 'special', spec: ETERNAL_MOON },
  { id: 'eternal-neutral', family: 'special', spec: ETERNAL_NEUTRAL },
  { id: 'shadow', family: 'special', spec: SHADOW },
  look('look-fox', 'Nubbin (Fox look)', {
    body: '#4a9be0',
    belly: '#fff1c9',
    tip: '#e8e2ee',
    crownShade: '#2e5ca8',
  }),
  look('look-echidna', 'Nubbin (Echidna look)', {
    body: '#e0562e',
    belly: '#fff1c9',
    tip: '#ffffff',
    crownShade: '#9e2b3f',
  }),
  look('look-rose', 'Nubbin (Rose look)', {
    body: '#f7a3c2',
    belly: '#ffc8d8',
    tip: '#e85a7a',
    crownShade: '#a3365e',
  }),
  look('look-dream', 'Nubbin (Dream look)', {
    body: '#cdb1f0',
    belly: '#e0c9f7',
    tip: '#ffffff',
    crownShade: '#9b5de5',
  }),
];
