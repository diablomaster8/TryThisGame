import { describe, expect, it } from 'vitest';
import { adultColors, drawChao, lookOf, NO_PARTS, poseFor } from '../../src/render/sprites/chao';
import type { NubbinType } from '../../src/sim/types';

/**
 * The first evolutions' silhouette tells (LOOK-19), as a stand-in for a tester sorting the
 * 15 pixel forms by outline with colour stripped: every form's nearest outline (front and
 * side together) among the other 14 must be one of its own type.
 */

const TYPES: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];
const BANDS = ['neutral', 'sun', 'moon'] as const;

function outline(band: (typeof BANDS)[number], type: NubbinType): boolean[] {
  const look = lookOf(adultColors(band, type), type, null, NO_PARTS, false, null, false, band);
  return (['front', 'side'] as const).flatMap((a) =>
    Array.from(drawChao(a, poseFor('idle', 0), look).data, (v) => v > 0),
  );
}

const apart = (a: boolean[], b: boolean[]) => a.reduce((n, v, i) => n + (v !== b[i] ? 1 : 0), 0);

describe('first-evolution silhouettes (LOOK-19)', () => {
  const forms = BANDS.flatMap((band) =>
    TYPES.map((type) => ({ band, type, m: outline(band, type) })),
  );

  it('sorts all 15 by outline alone', () => {
    for (const f of forms) {
      const nearest = forms
        .filter((g) => g !== f)
        .sort((g, h) => apart(f.m, g.m) - apart(f.m, h.m))[0]!;
      expect(nearest.type, `${f.band} ${f.type} → ${nearest.band} ${nearest.type}`).toBe(f.type);
    }
  });

  it('Sun and Moon crowns differ from the Neutral one at every type', () => {
    for (const type of TYPES) {
      const n = forms.find((f) => f.band === 'neutral' && f.type === type)!.m;
      for (const band of ['sun', 'moon'] as const)
        expect(apart(n, forms.find((f) => f.band === band && f.type === type)!.m)).toBeGreaterThan(
          8,
        );
    }
  });
});
