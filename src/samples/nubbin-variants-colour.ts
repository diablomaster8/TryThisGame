import { V } from './sculpted';
import { CHILD, variant, type NubbinColors, type NubbinVariant } from './nubbin-variants';

/**
 * The colour family of the Nubbin: the egg colours, their two-tone and glossy versions, and
 * the gemstone finishes. An egg's colour is the Nubbin's colour for life, so every entry
 * derives from the child template and changes only the palette and the surface. The four
 * groups are built by small loops over the tables below, so adding a colour is one row.
 */

type Palette = Partial<NubbinColors>;

export interface EggColour {
  name: string;
  body: string;
  crownShade: string;
  belly: string;
  /** Set where the default yellow tips would vanish into the body. */
  tip?: string;
  pad?: string;
}

export const EGG_COLOURS: EggColour[] = [
  { name: 'sky', body: '#4a9be0', crownShade: '#2e5ca8', belly: '#8fd6f0' },
  { name: 'rose', body: '#e85a7a', crownShade: '#9e2b3f', belly: '#f7a3c2' },
  { name: 'mint', body: '#3fbfa8', crownShade: '#1e7a74', belly: '#e8e2ee' },
  {
    name: 'gold',
    body: '#ffd94a',
    crownShade: '#f29c2e',
    belly: '#fff1c9',
    tip: '#f29c2e',
    pad: '#e0562e',
  },
  { name: 'violet', body: '#9b5de5', crownShade: '#5b3a8f', belly: '#cdb1f0' },
  { name: 'frost', body: '#bfe0ff', crownShade: '#6aa8e0', belly: '#ffffff' },
  { name: 'ember', body: '#e0562e', crownShade: '#9e2b3f', belly: '#ffe08a' },
];

interface Jewel {
  name: string;
  body: string;
  crownShade: string;
  belly: string;
  tip: string;
}

const JEWELS: Jewel[] = [
  { name: 'ruby', body: '#c81e3c', crownShade: '#7a0f24', belly: '#ff8aa0', tip: '#ffd0d8' },
  { name: 'sapphire', body: '#1e4fc8', crownShade: '#10287a', belly: '#8fb0ff', tip: '#d0e0ff' },
  { name: 'emerald', body: '#1ea860', crownShade: '#0f6a3a', belly: '#8ae5b0', tip: '#d0ffe0' },
  { name: 'amethyst', body: '#8a3fd0', crownShade: '#4a1f80', belly: '#d0a8ff', tip: '#ecd8ff' },
  { name: 'topaz', body: '#e8a020', crownShade: '#a06010', belly: '#ffe08a', tip: '#fff4c0' },
  { name: 'garnet', body: '#8a1030', crownShade: '#4a0818', belly: '#e05070', tip: '#ffb0c0' },
  { name: 'onyx', body: '#1a1a24', crownShade: '#0a0a10', belly: '#4a4a5a', tip: '#9a9aa8' },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const plain = (c: EggColour): Palette => ({
  body: c.body,
  crownShade: c.crownShade,
  belly: c.belly,
  ...(c.tip ? { tip: c.tip } : {}),
  ...(c.pad ? { pad: c.pad } : {}),
});

/** The same body and shade, with the next colour's body, belly and shade as belly, tip, pad. */
const twoTone = (c: EggColour, next: EggColour): Palette => ({
  body: c.body,
  crownShade: c.crownShade,
  belly: next.body,
  tip: next.belly,
  pad: next.crownShade,
});

const entry = (
  id: string,
  name: string,
  colors: Palette,
  notes: string,
  extra: Parameters<typeof variant>[2] = {},
  placeholder?: string,
): NubbinVariant => ({
  id,
  family: 'colour',
  spec: variant(CHILD, name, { colors, notes, ...extra }),
  ...(placeholder ? { placeholder } : {}),
});

export const SHINY_FINISH = {
  surface: { roughness: 0.3, clearcoat: 0.6, sheen: 1, sheenColor: '#ffffff' },
  ball: { glow: '#e0c060' },
  // A small pale star on the brow, the one hint mark a shiny wears.
  hints: [{ kind: 'sphere' as const, a: V(0, 2.42, 0.6), r: 0.11, color: '#ffffff', soft: 0.02 }],
};

const JEWEL_FINISH = {
  detail: 'facet' as const,
  scale: 0.55,
  roughness: 0.12,
  clearcoat: 1,
  sheen: 0.6,
  sheenColor: '#ffffff',
  amount: 0.3,
  bump: 1,
};

const PLAIN = EGG_COLOURS.map((c) =>
  entry(`colour-${c.name}`, `Nubbin (${cap(c.name)})`, plain(c), `Egg colour ${c.name}.`),
);

const TWO_TONE = EGG_COLOURS.map((c, i) => {
  const next = EGG_COLOURS[(i + 1) % EGG_COLOURS.length] as EggColour;
  return entry(
    `colour-${c.name}-twotone`,
    `Nubbin (${cap(c.name)}, two-tone)`,
    twoTone(c, next),
    `Egg colour ${c.name} with the belly and tips of ${next.name}.`,
  );
});

const SHINY = EGG_COLOURS.map((c) =>
  entry(
    `colour-${c.name}-shiny`,
    `Nubbin (${cap(c.name)}, shiny)`,
    plain(c),
    `Egg colour ${c.name} with a glossy finish and a pale star on the brow.`,
    SHINY_FINISH,
  ),
);

const JEWEL = JEWELS.map((j) =>
  entry(
    `jewel-${j.name}`,
    `Nubbin (${cap(j.name)})`,
    { body: j.body, crownShade: j.crownShade, belly: j.belly, tip: j.tip },
    `Gemstone finish in ${j.name}: cut facets and a hard gloss over the plain child shape.`,
    { surface: JEWEL_FINISH, eyes: { iris: j.crownShade } },
  ),
);

export const COLOUR_VARIANTS: NubbinVariant[] = [...PLAIN, ...TWO_TONE, ...SHINY, ...JEWEL];
