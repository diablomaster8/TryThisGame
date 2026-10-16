import { V } from './sculpted';
import {
  CHILD,
  MOON_ADULT,
  NEUTRAL_ADULT,
  SUN_ADULT,
  tailStub,
  variant,
  type NubbinVariant,
} from './nubbin-variants';
import { LINEUP_LOOKS } from './nubbin-variants-lineup';
import {
  WHITE,
  ball,
  cone,
  crystalSpike,
  dress,
  footCrystals,
  gloveArm,
  widen,
} from './nubbin-lineup-kit';

/**
 * The special Nubbin forms: the three Eternals (the rare immortal adults, glassy and jewel-like,
 * with wings twice the size and a head of their own) and the ash-grey Shadow stray from the
 * story, followed by the six character looks from `nubbin-variants-lineup.ts`. Everything
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

/** The Eternal Moon look's flats. */
const MOON_BODY = '#2e2660';
const MOON_DEEP = '#1c1640';
const MOON_ICE = '#9aa8e8';
const MOON_CREST = '#5468d0';
const MOON_CRYSTAL = '#a860e0';

const ETERNAL_MOON = variant(MOON_ADULT, 'Nubbin (Eternal Moon)', {
  // Flat dark indigo armour, an icy crest and shoulder spikes, lilac crystals underfoot.
  colors: {
    body: MOON_BODY,
    belly: MOON_DEEP,
    tip: MOON_BODY,
    pad: MOON_BODY,
    crownShade: MOON_BODY,
    blush: MOON_BODY,
    star: MOON_BODY,
    iris: '#e0562e',
    wing: MOON_BODY,
  },
  // Small blue horns at the top corners of the head; the crest is painted between them.
  crown: [-1, 1].map((dx) =>
    cone(V(dx * 0.72, 2.45, -0.05), V(dx * 0.85, 2.85, -0.1), 0.13, 0.02, MOON_ICE, 'horn', 0.04),
  ),
  wings: null,
  ball: { shape: 'spikes', color: '#2a1a60', glow: '#7a4fc0' },
  slots: {
    arms: [
      gloveArm(-1, MOON_BODY, MOON_BODY, { y: 1.2, reach: 1.0, hand: 0.3 }),
      gloveArm(1, MOON_BODY, MOON_BODY, { y: 1.2, reach: 1.0, hand: 0.3 }),
    ],
  },
  hints: [
    // White oval eyes under the closed arcs.
    ...[-1, 1].map((dx) => ({
      kind: 'ellipsoid' as const,
      a: V(dx * 0.42, 2.0, 0.82),
      radii: V(0.24, 0.32, 0.2),
      color: WHITE,
      soft: 0.01,
    })),
    // The blue crest down the middle of the head, and the pale bat-shaped chest mark.
    {
      kind: 'ellipsoid' as const,
      a: V(0, 2.65, 0.45),
      radii: V(0.3, 0.55, 0.5),
      color: MOON_CREST,
      soft: 0.01,
    },
    {
      kind: 'ellipsoid' as const,
      a: V(0, 1.12, 0.62),
      radii: V(0.36, 0.14, 0.14),
      color: '#c8d8f0',
      soft: 0.01,
    },
  ],
  headScale: 1.15,
  eyes: { x: 0.42, y: 2.0, r: 0.24, tall: 1.4, lidColor: WHITE, brow: false },
  mouth: { shape: 'o', width: 0.07, y: 1.66, z: 1.0, line: '#6a1a2a' },
  surface: { ...GLASS, glowStrength: 1.4 },
  patch: (spec) => {
    const dome = spec.head.prims.find((p) => p.tag === 'head')!;
    dome.a.set(0, 2.0, 0);
    dome.radii!.set(1.1, 0.85, 0.95);
    spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
    // Icy spikes out of the shoulders, two a side, and the crystals round the feet.
    spec.torso.prims.push(
      ...[-1, 1].flatMap((dx) => [
        crystalSpike(V(dx * 0.62, 1.2, -0.1), V(dx * 1.1, 1.55, -0.15), 0.15, MOON_ICE),
        crystalSpike(V(dx * 0.62, 1.05, -0.2), V(dx * 1.05, 1.1, -0.35), 0.12, MOON_ICE),
      ]),
      ...footCrystals(MOON_CRYSTAL),
    );
    widen(spec.head, { x: 1.5, z: -1.2 });
    widen(spec.torso, { x: 1.5, z: -1.2 });
    dress(spec, { chunky: 1.2 });
  },
  notes:
    'Line-up figure 7 (Part G8b): dark indigo armour, a blue crest and small horns, white oval ' +
    'eyes, icy shoulder spikes, a pale chest mark, a spiked ball and lilac crystals underfoot.',
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

export const SPECIAL_VARIANTS: NubbinVariant[] = [
  { id: 'eternal-sun', family: 'special', spec: ETERNAL_SUN },
  { id: 'eternal-moon', family: 'special', spec: ETERNAL_MOON },
  { id: 'eternal-neutral', family: 'special', spec: ETERNAL_NEUTRAL },
  { id: 'shadow', family: 'special', spec: SHADOW },
  ...LINEUP_LOOKS,
];
