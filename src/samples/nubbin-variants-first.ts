import type { NubbinType } from '../sim/types';
import {
  MOON_ADULT,
  NEUTRAL_ADULT,
  SUN_ADULT,
  TYPE_COLORS,
  mixHex,
  variant,
  type NubbinVariant,
  type VariantOverrides,
} from './nubbin-variants';
import type { SpeciesSpec } from './species';

/**
 * The 15 first evolutions of the Nubbin: three alignment bands (Sun, Moon, Neutral) times
 * five types (Normal, Swim, Fly, Run, Power). Each is a small diff on its band's adult
 * template. The helper's `type` override draws the silhouette (quills, a crest with flippers,
 * a long crown with big wings, horns with a wide body); the colours follow the reference chart.
 * Neutral wears its type hue as the body, Sun stays white and Moon stays black with the hue on
 * the tells only. The Normal forms are the templates themselves. The second evolutions derive
 * from these through `firstSpec`, sharing `bandColors`.
 */

export type Band = 'sun' | 'moon' | 'neutral';
export interface Hue {
  body: string;
  shade: string;
  belly: string;
}

const BANDS: Band[] = ['sun', 'moon', 'neutral'];
const TYPES: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];

const TEMPLATE: Record<Band, SpeciesSpec> = {
  sun: SUN_ADULT,
  moon: MOON_ADULT,
  neutral: NEUTRAL_ADULT,
};
export const BAND_LABEL: Record<Band, string> = { sun: 'Sun', moon: 'Moon', neutral: 'Neutral' };
export const TYPE_LABEL: Record<NubbinType, string> = {
  normal: 'Normal',
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
};

/** The Moon forms' type hues: Swim teal, Fly violet, Run navy-blue, Power crimson. */
const MOON_HUE: Partial<Record<NubbinType, string>> = {
  swim: '#1fa89a',
  fly: '#8a4ae0',
  run: '#2a5ae0',
  power: '#d82040',
};
const WHITE = '#ffffff';
const BLACK = '#000000';

/** The colours and tell accent one band gives a hue: Neutral wears it, Sun lightens, Moon deepens. */
export function bandColors(
  band: Band,
  hue: Hue,
  type: NubbinType = 'normal',
): Pick<VariantOverrides, 'colors' | 'accent'> {
  const { body, shade, belly } = hue;
  switch (band) {
    case 'neutral':
      return { colors: { body, crownShade: shade, belly } };
    case 'sun':
      return {
        // The references keep the Sun tells fairly saturated: only a light lift toward white.
        accent: mixHex(body, WHITE, 0.1),
        colors: { tip: mixHex(body, WHITE, 0.25), pad: body, crownShade: mixHex(body, WHITE, 0.5) },
      };
    case 'moon': {
      // The type hue at about 70% saturation on the crown, tip, hands and feet, so five near-
      // black adults read apart at dusk (LOOK-48).
      const tint = mixHex(MOON_HUE[type] ?? body, '#6a6070', 0.3);
      return {
        accent: tint,
        colors: { tip: tint, pad: mixHex(tint, BLACK, 0.3), crownShade: tint },
      };
    }
  }
}

const NOTES: Record<Band, string> = {
  sun: 'a white body with the type hue on tip, hands and tells',
  moon: 'a black body with slanted eyes and the type hue on tells',
  neutral: 'the type hue as the whole body',
};

function build(band: Band, type: NubbinType): NubbinVariant {
  const id = `first-${band}-${type}`;
  const base = TEMPLATE[band];
  if (type === 'normal') return { id, family: 'first', spec: base };
  const spec = variant(base, `Nubbin (${BAND_LABEL[band]} ${TYPE_LABEL[type]})`, {
    type,
    ...bandColors(band, TYPE_COLORS[type], type),
    ...(band === 'moon' ? { eyes: { lid: 0.3 } } : {}),
    notes: `First evolution, ${BAND_LABEL[band]} ${TYPE_LABEL[type]}: ${NOTES[band]}.`,
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
