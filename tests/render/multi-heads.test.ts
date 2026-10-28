import { describe, expect, it } from 'vitest';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { speciesArt } from '../../src/render/sprites/species-art';
import { artSpec } from '../../src/render3d/art-species';

/**
 * R0376: the many-headed species draw every head alike, each on its own neck, in both
 * renderers (Dodrio, Doduo, Exeggcute, Exeggutor, Magneton, Dugtrio, Weezing, Deltamon).
 */
const MULTI = [
  'tristrut',
  'twinstrut',
  'seedclutch',
  'palmtrio',
  'clinktrio',
  'burrowtrio',
  'smogtwin',
  'trihead',
];

describe('many-headed species', () => {
  it('every multi-head species has more than one head, with a size for each', () => {
    for (const id of MULTI) {
      const h = speciesArt(id)?.heads;
      expect(h, id).toBeDefined();
      expect(h!.count, id).toBeGreaterThan(1);
      expect(h!.sizes.length, id).toBe(h!.count);
    }
  });

  it('the pixel drawer places every head in every view, inside the frame', () => {
    for (const id of MULTI) {
      const art = speciesArt(id)!;
      for (const angle of DRAWN_ANGLES) {
        const pc = drawCreature(angle, poseFor('idle', 0), art);
        expect(pc.bounds(), `${id} ${angle}`).not.toBeNull();
      }
      const single = drawCreature('front', poseFor('idle', 0), {
        ...art,
        heads: { ...art.heads!, count: 1 },
      });
      const many = drawCreature('front', poseFor('idle', 0), art);
      expect(Array.from(many.data), id).not.toEqual(Array.from(single.data));
    }
  });

  it('in 3D each extra head is its own part, and the heads bob on an extras hook', () => {
    for (const id of MULTI) {
      const art = speciesArt(id)!;
      const spec = artSpec(id, art);
      const heads = spec.parts.filter((p) => /^head\d$/.test(p.name));
      expect(heads.length, id).toBe(art.heads!.count - 1);
      expect(typeof spec.extras, id).toBe('function');
    }
  });

  it('a clutch has no shared body: six separate eggs', () => {
    const art = speciesArt('seedclutch')!;
    expect(art.heads!.cluster).toBe(true);
    expect(art.heads!.count).toBe(6);
    expect(art.gen1b ?? []).toEqual([]);
  });
});
