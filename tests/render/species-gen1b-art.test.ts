import { describe, expect, it } from 'vitest';
import { CLIPS, type ClipName } from '../../src/render/sprites/animations';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { speciesArt, SPECIES_ART } from '../../src/render/sprites/species-art';
import { GEN1B_ART } from '../../src/render/sprites/species-art-gen1b';
import { artSpec } from '../../src/render3d/art-species';
import { parseSculpt, serializeSculpt } from '../../src/samples/sculpt-spec';
import { sculptSurface, speciesSurfaces, surfaceData } from '../../src/samples/species';
import { SPECIES } from '../../src/sim/species';
import { GEN1B_SPECIES } from '../../src/sim/species-gen1b';

/** Opaque pixels in a frame. */
const filled = (data: ArrayLike<number>) => Array.from(data).filter((v) => v !== 0).length;

describe('first-generation pocket art (#77 to #151)', () => {
  it('every species in the sim has an art recipe, and no recipe is orphaned', () => {
    for (const s of SPECIES) if (s.family !== 'chao') expect(speciesArt(s.id), s.id).toBeDefined();
    const ids = new Set(SPECIES.map((s) => s.id));
    for (const id of Object.keys(SPECIES_ART)) expect(ids.has(id), id).toBe(true);
    for (const s of GEN1B_SPECIES) expect(GEN1B_ART[s.id], s.id).toBeDefined();
  });

  it('the pixel drawer builds every clip and angle of each species', () => {
    for (const [id, art] of Object.entries(GEN1B_ART)) {
      for (const clip of Object.keys(CLIPS) as ClipName[]) {
        for (const angle of DRAWN_ANGLES) {
          const pc = drawCreature(angle, poseFor(clip, 0), art);
          expect(filled(pc.data), `${id} ${clip} ${angle}`).toBeGreaterThan(60);
        }
      }
    }
  });

  it('the extra parts change the drawing', () => {
    for (const [id, art] of Object.entries(GEN1B_ART)) {
      if (!art.gen1b?.length) continue;
      const plain = { ...art, gen1b: [] };
      const a = drawCreature('front', poseFor('idle', 0), art);
      const b = drawCreature('front', poseFor('idle', 0), plain);
      expect(Array.from(a.data), id).not.toEqual(Array.from(b.data));
    }
  });

  it('the 3D sculptor builds every species, and its surfaces survive the worker trip', () => {
    for (const [id, art] of Object.entries(GEN1B_ART)) {
      const spec = artSpec(id, art);
      for (const s of speciesSurfaces(spec)) {
        const data = surfaceData(spec, { ...s, res: 20 });
        expect(parseSculpt(serializeSculpt(data))).toEqual(data);
      }
      const head = speciesSurfaces(spec)[0]!;
      const g = sculptSurface(spec, { ...head, res: 20 });
      expect(g.getAttribute('position').count, id).toBeGreaterThan(30);
    }
  }, 60_000);

  it('the 3D extras add to the figure', () => {
    const plain = (id: string) => {
      return artSpec(id, { ...GEN1B_ART[id]!, gen1b: [] });
    };
    const star = artSpec('corestar', GEN1B_ART.corestar!);
    expect(star.head.prims.length).toBeGreaterThan(plain('corestar').head.prims.length + 4);
    const magnet = artSpec('clinkbolt', GEN1B_ART.clinkbolt!);
    expect(magnet.eyes.x).toBe(0);
    const bone = artSpec('bonecap', GEN1B_ART.bonecap!);
    const arm = bone.parts.find((p) => p.name === 'armR')!;
    expect(arm.prims.length).toBeGreaterThan(
      plain('bonecap').parts.find((p) => p.name === 'armR')!.prims.length,
    );
    const fish = artSpec('silkfin', GEN1B_ART.silkfin!);
    expect(fish.parts.some((p) => p.name === 'tail')).toBe(true);
  });
});
