import { describe, expect, it } from 'vitest';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature, leansForward } from '../../src/render/sprites/creature';
import { C } from '../../src/render/sprites/palette';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { artSpec } from '../../src/render3d/art-species';

/**
 * R0377 (LOOK-08): the Greymon line leans forward in Pixel as in 3D, MetalGreymon carries its
 * chest missile in both renderers, and Greymon's stripes wrap round the flanks in 3D so they
 * show from the front three-quarter view.
 */
const hornsaur = SPECIES_ART.hornsaur!;
const ironsaur = SPECIES_ART.ironsaur!;

describe('Greymon line look (R0377)', () => {
  it('leans the Greymon line only (not Charizard-style snouts)', () => {
    for (const id of ['hornsaur', 'ironsaur', 'bonesaur'])
      expect(leansForward(SPECIES_ART[id]!)).toBe(true);
    expect(leansForward({ ...hornsaur, extras: ['dinoSnout'] })).toBe(false);
  });

  it('slides the Pixel side view forward above the hips', () => {
    const upright = { ...hornsaur, extras: ['dinoSnout' as const] };
    const right = (pc: ReturnType<typeof drawCreature>) => {
      for (let x = pc.width - 1; x >= 0; x--)
        for (let y = 0; y < pc.height; y++) if (pc.data[y * pc.width + x]) return x;
      return -1;
    };
    const lean = drawCreature('side', poseFor('idle', 0), hornsaur);
    const stand = drawCreature('side', poseFor('idle', 0), upright);
    expect(right(lean)).toBeGreaterThan(right(stand));
  });

  it('paints MetalGreymon a red missile nose on the chest in Pixel and sculpts one in 3D', () => {
    const bare = { ...ironsaur, extras: ironsaur.extras!.filter((x) => x !== 'chestMissile') };
    const a = drawCreature('front', poseFor('idle', 0), ironsaur).data;
    const b = drawCreature('front', poseFor('idle', 0), bare).data;
    expect(a.some((v, i) => v !== b[i] && v === C.ember + 1)).toBe(true);
    const spec = artSpec('ironsaur', ironsaur);
    const noses = spec.torso.prims.filter((q) => q.kind === 'cone');
    expect(noses.length).toBeGreaterThan(0);
    expect(artSpec('hornsaur', hornsaur).torso.prims.filter((q) => q.kind === 'cone')).toHaveLength(
      0,
    );
  });

  it('wraps the 3D stripes round the flanks toward the front', () => {
    const marks = artSpec('hornsaur', hornsaur).marks;
    // A stripe mark reaching the front half of the body (z > 0) on each side.
    for (const s of [-1, 1])
      expect(
        marks.some((m) => m.kind === 'capsule' && m.b && m.b.z > 0 && Math.sign(m.b.x) === s),
      ).toBe(true);
  });
});
