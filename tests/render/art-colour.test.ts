import { describe, expect, it } from 'vitest';
import { speciesArt } from '../../src/render/sprites/species-art';
import { artSpec } from '../../src/render3d/art-species';
import { REF_HEX, deltaE, oklab, vivid } from '../../src/render3d/art-species-colour';

// LOOK-09: the 3D art species keep their pixel hue, pushed a little more vivid, and their body
// colour sits within ΔE 12 of the reference. The stage render itself needs WebGL, so this
// measures the colour the sculpt bakes, which the toon stage shows nearly flat.
describe('art species colour', () => {
  it('pushes chroma out and keeps hue and lightness', () => {
    for (const hex of ['#f2d34c', '#1e7a74', '#9b5de5', '#f29c2e']) {
      const [l0, a0, b0] = oklab(hex);
      const [l1, a1, b1] = oklab(vivid(hex));
      expect(Math.abs(l1 - l0)).toBeLessThan(0.02);
      expect(Math.hypot(a1, b1)).toBeGreaterThanOrEqual(Math.hypot(a0, b0) - 1e-3);
      expect(Math.abs(Math.atan2(b1, a1) - Math.atan2(b0, a0))).toBeLessThan(0.06);
    }
  });

  it('keeps every reference species body within ΔE 12', () => {
    for (const [id, ref] of Object.entries(REF_HEX)) {
      const art = speciesArt(id);
      expect(art, id).toBeTruthy();
      const spec = artSpec(id, art!);
      const body = spec.torso.prims[0]!.color;
      expect(deltaE(body, ref), `${id} ${body} vs ${ref}`).toBeLessThanOrEqual(12);
    }
  });

  it('keeps the sheen low on art species', () => {
    const spec = artSpec('zapkin', speciesArt('zapkin')!);
    expect(spec.surface?.sheen ?? 0).toBeLessThanOrEqual(0.3);
  });
});
