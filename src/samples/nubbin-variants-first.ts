import type { NubbinType } from '../sim/types';
import {
  MOON_ADULT,
  NEUTRAL_ADULT,
  SUN_ADULT,
  variant,
  type CrownKind,
  type NubbinColors,
  type NubbinVariant,
} from './nubbin-variants';
import type { SpeciesSpec } from './species';

/**
 * The 15 first evolutions of the Nubbin: three alignment bands (Sun, Moon, Neutral) times
 * five types (Normal, Swim, Fly, Run, Power). Each is a small diff on its band's adult
 * template: the type silhouette (head fins, bigger wings, longer legs, a wider body) comes
 * from the helper's `type` override, and only the body, crown shade and belly colours change
 * by type. The Normal forms are the templates themselves. The second evolutions derive from
 * these through `firstSpec`.
 */

type Band = 'sun' | 'moon' | 'neutral';

const BANDS: Band[] = ['sun', 'moon', 'neutral'];
const TYPES: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];

const TEMPLATE: Record<Band, SpeciesSpec> = {
  sun: SUN_ADULT,
  moon: MOON_ADULT,
  neutral: NEUTRAL_ADULT,
};
const BAND_LABEL: Record<Band, string> = { sun: 'Sun', moon: 'Moon', neutral: 'Neutral' };
const TYPE_LABEL: Record<NubbinType, string> = {
  normal: 'Normal',
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
};

/** Neutral crowns by type; Sun and Moon keep the template crown, and Normal keeps the droop. */
const NEUTRAL_CROWN: Partial<Record<NubbinType, CrownKind>> = {
  swim: 'fin',
  fly: 'tall',
  run: 'point',
  power: 'stub',
};

/**
 * Colours by band and type, from the pixel game's adult palette. The Sun fly body is white
 * like the template belly, so its belly (and the sheen that shares the white) is nudged
 * darker to keep the belly patch readable.
 */
const COLOURS: Record<Band, Partial<Record<NubbinType, Partial<NubbinColors>>>> = {
  sun: {
    swim: { body: '#8fd6f0', crownShade: '#4a9be0' },
    fly: { body: '#ffffff', crownShade: '#cdb1f0', belly: '#e3ecfa', sheen: '#e3ecfa' },
    run: { body: '#fff1c9', crownShade: '#d9a66c' },
    power: { body: '#e8e2ee', crownShade: '#f29c2e' },
  },
  moon: {
    swim: { body: '#16284a', crownShade: '#0d0a1a' },
    fly: { body: '#5b3a8f', crownShade: '#2b2440' },
    run: { body: '#1d3b2a', crownShade: '#0d0a1a' },
    power: { body: '#9e2b3f', crownShade: '#2b2440' },
  },
  neutral: {
    swim: { body: '#4a9be0', crownShade: '#2e5ca8', belly: '#8fd6f0' },
    fly: { body: '#cdb1f0', crownShade: '#9b5de5', belly: '#e8e2ee' },
    run: { body: '#c6ec6a', crownShade: '#86c94a', belly: '#fff1c9' },
    power: { body: '#f29c2e', crownShade: '#e0562e', belly: '#d9a66c' },
  },
};

function build(band: Band, type: NubbinType): NubbinVariant {
  const id = `first-${band}-${type}`;
  const base = TEMPLATE[band];
  if (type === 'normal') return { id, family: 'first', spec: base };
  const crown = band === 'neutral' ? NEUTRAL_CROWN[type] : undefined;
  const spec = variant(base, `Nubbin (${BAND_LABEL[band]} ${TYPE_LABEL[type]})`, {
    type,
    colors: COLOURS[band][type] ?? {},
    ...(crown ? { crown } : {}),
    notes: `First evolution, ${BAND_LABEL[band]} band, ${TYPE_LABEL[type]} type: derived from the ${BAND_LABEL[band]} template.`,
  });
  return { id, family: 'first', spec };
}

export const FIRST_VARIANTS: NubbinVariant[] = BANDS.flatMap((band) =>
  TYPES.map((type) => build(band, type)),
);

/** The spec of one first evolution, for the second evolutions to derive from. */
export function firstSpec(band: Band, type: NubbinType): SpeciesSpec {
  const found = FIRST_VARIANTS.find((v) => v.id === `first-${band}-${type}`);
  if (!found) throw new Error(`No first evolution for ${band} ${type}`);
  return found.spec;
}
