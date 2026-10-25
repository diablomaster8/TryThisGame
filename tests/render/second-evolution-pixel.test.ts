/**
 * Second evolutions in the pixel renderer: each of the 15 first evolutions with a touch of a
 * second type blends its colours toward that type, as the 3D variants do, and always looks
 * different from the first evolution, an untrained "–Normal" one included (review 2026-10-24).
 */
import { describe, expect, it } from 'vitest';
import {
  adultColors,
  drawChao,
  lookOf,
  poseFor,
  secondColors,
  TYPE_HEX,
} from '../../src/render/sprites/chao';
import { mixHex, nearestIndex, PALETTE } from '../../src/render/sprites/palette';
import { TYPE_COLORS } from '../../src/samples/nubbin-variants';
import type { NubbinType } from '../../src/sim/types';

const BANDS = ['sun', 'moon', 'neutral'] as const;
const TYPES: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];

describe('pixel second evolutions', () => {
  it('uses the same type hues as the 3D variants', () => {
    expect(TYPE_HEX).toEqual(TYPE_COLORS);
  });

  it('changes colour and shape for every band, type and second type, Normal included', () => {
    for (const band of BANDS)
      for (const type of TYPES)
        for (const second of TYPES) {
          const first = adultColors(band, type);
          const c = secondColors(band, type, second);
          // A new body or shade colour, and a tell colour for the second type's mark.
          expect(
            c.body !== first.body || c.shade !== first.shade,
            `${band} ${type}-${second}`,
          ).toBe(true);
          expect(c.tell).toBeDefined();
          for (const v of [c.body, c.shade, c.belly, c.tell!])
            expect(v).toBeLessThan(PALETTE.length);
          const was = drawChao('front', poseFor('idle', 0), lookOf(first, type));
          const now = drawChao('front', poseFor('idle', 0), lookOf(c, type, second));
          expect(Array.from(now.data)).not.toEqual(Array.from(was.data));
        }
  });

  it('gives an untrained "-Normal" second evolution a taller crown in its tell colour', () => {
    const first = drawChao(
      'side',
      poseFor('idle', 0),
      lookOf(adultColors('neutral', 'swim'), 'swim'),
    );
    const c = secondColors('neutral', 'swim', 'normal');
    const second = drawChao('side', poseFor('idle', 0), lookOf(c, 'swim', 'normal'));
    const topRow = (pc: { data: ArrayLike<number>; width: number }) =>
      Math.floor(Array.from(pc.data).findIndex((v) => v !== 0) / pc.width);
    expect(topRow(second)).toBeLessThan(topRow(first));
    expect(Array.from(second.data)).toContain(c.tell! + 1);
  });

  it('maps a neutral blend to the palette colour nearest the 3D hue', () => {
    const c = secondColors('neutral', 'fly', 'swim');
    const hue = mixHex(TYPE_HEX.fly.body, TYPE_HEX.swim.body, 0.55);
    expect(c.body).toBe(nearestIndex(hue, [adultColors('neutral', 'fly').body]));
  });
});
