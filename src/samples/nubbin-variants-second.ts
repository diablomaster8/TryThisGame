import type { NubbinType } from '../sim/types';
import { variant, type NubbinVariant } from './nubbin-variants';
import { firstSpec } from './nubbin-variants-first';
import { V } from './sculpted';

/**
 * The 60 second evolutions of the Nubbin: each of the 15 first evolutions with a touch of one
 * of the four other types. The helper applies the second type's silhouette at half strength
 * (small head fins, slightly bigger wings, a little longer legs, a little wider), and a soft
 * belly patch in that type's colour makes the pair readable at a glance. The Moon band uses
 * darker versions of the patch colours.
 */

type Band = 'sun' | 'moon' | 'neutral';

const BANDS: Band[] = ['sun', 'moon', 'neutral'];
const TYPES: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];
const LABEL: Record<Band | NubbinType, string> = {
  sun: 'Sun',
  moon: 'Moon',
  neutral: 'Neutral',
  normal: 'Normal',
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
};

const TOUCH_LIGHT: Record<NubbinType, string> = {
  normal: '#8fdcc8',
  swim: '#4a9be0',
  fly: '#cdb1f0',
  run: '#c6ec6a',
  power: '#f29c2e',
};
const TOUCH_DARK: Record<NubbinType, string> = {
  normal: '#3fbfa8',
  swim: '#2e5ca8',
  fly: '#9b5de5',
  run: '#86c94a',
  power: '#e0562e',
};

function build(band: Band, type: NubbinType, second: NubbinType): NubbinVariant {
  const palette = band === 'moon' ? TOUCH_DARK : TOUCH_LIGHT;
  const spec = variant(
    firstSpec(band, type),
    `Nubbin (${LABEL[band]} ${LABEL[type]}\u2013${LABEL[second]})`,
    {
      second,
      hints: [
        {
          kind: 'ellipsoid',
          a: V(0, 0.95, 0.62),
          radii: V(0.26, 0.2, 0.16),
          color: palette[second],
          soft: 0.14,
        },
      ],
      notes: `Second evolution: ${LABEL[band]} ${LABEL[type]} with a ${LABEL[second]} touch, derived from first-${band}-${type}.`,
    },
  );
  return { id: `second-${band}-${type}-${second}`, family: 'second', spec };
}

export const SECOND_VARIANTS: NubbinVariant[] = BANDS.flatMap((band) =>
  TYPES.flatMap((type) =>
    TYPES.filter((second) => second !== type).map((second) => build(band, type, second)),
  ),
);
