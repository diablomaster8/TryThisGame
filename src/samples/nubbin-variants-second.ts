import type { NubbinType } from '../sim/types';
import { TYPE_COLORS, mixHex, variant, type NubbinVariant } from './nubbin-variants';
import { BAND_LABEL, TYPE_LABEL, bandColors, firstSpec, type Band } from './nubbin-variants-first';

/**
 * The 60 second evolutions of the Nubbin: each of the 15 first evolutions with a touch of one
 * of the four other types. The helper applies the second type's silhouette at half strength,
 * and the colour is the first type's hue blended 55% toward the second's, put through the same
 * band recipe as the first evolutions (Neutral wears it, Sun lightens it, Moon deepens it); the
 * half-strength tells take the second type's own colour, so the pair reads at a glance.
 */

const BANDS: Band[] = ['sun', 'moon', 'neutral'];
const TYPES: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];

function build(band: Band, type: NubbinType, second: NubbinType): NubbinVariant {
  const a = TYPE_COLORS[type];
  const b = TYPE_COLORS[second];
  const hue = {
    body: mixHex(a.body, b.body, 0.55),
    shade: mixHex(a.shade, b.shade, 0.55),
    belly: mixHex(a.belly, b.belly, 0.55),
  };
  const name = `Nubbin (${BAND_LABEL[band]} ${TYPE_LABEL[type]}\u2013${TYPE_LABEL[second]})`;
  const tell = mixHex(b.body, a.body, 0.3);
  const accent =
    band === 'sun'
      ? mixHex(tell, '#ffffff', 0.1)
      : band === 'moon'
        ? mixHex(tell, '#000000', 0.25)
        : tell;
  const spec = variant(firstSpec(band, type), name, {
    second,
    ...bandColors(band, hue),
    accent,
    notes: `Second evolution: ${BAND_LABEL[band]} ${TYPE_LABEL[type]} with a ${TYPE_LABEL[second]} touch, derived from first-${band}-${type}.`,
  });
  return { id: `second-${band}-${type}-${second}`, family: 'second', spec };
}

export const SECOND_VARIANTS: NubbinVariant[] = BANDS.flatMap((band) =>
  TYPES.flatMap((type) =>
    TYPES.filter((second) => second !== type).map((second) => build(band, type, second)),
  ),
);
