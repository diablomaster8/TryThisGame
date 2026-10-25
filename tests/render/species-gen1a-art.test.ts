import { describe, expect, it } from 'vitest';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { SPECIES_ART, speciesArt } from '../../src/render/sprites/species-art';
import { SPECIES_ART_GEN1A } from '../../src/render/sprites/species-art-gen1a';
import { artSpec } from '../../src/render3d/art-species';
import { sculptSurface, speciesSurfaces } from '../../src/samples/species';
import { SPECIES } from '../../src/sim/species';
import { GEN1A_SPECIES } from '../../src/sim/species-gen1a';

/**
 * The pocket line A art: every species in the sim has a recipe, both renderers build it,
 * and the extra kit parts (creature-extras.ts, art-species-extras.ts) really draw.
 */
const ANGLES = ['front', 'frontQuarter', 'side', 'backQuarter', 'back'] as const;
const filled = (data: Uint8Array) => data.reduce((n, v) => n + (v ? 1 : 0), 0);

describe('pocket line A art', () => {
  it('every non-Chao species has an art recipe, and line A only names its own species', () => {
    for (const s of SPECIES) if (s.family !== 'chao') expect(speciesArt(s.id), s.id).toBeDefined();
    const ids = new Set(GEN1A_SPECIES.map((s) => s.id));
    expect(Object.keys(SPECIES_ART_GEN1A).sort()).toEqual([...ids].sort());
    for (const id of ids) expect(SPECIES_ART[id]).toBe(SPECIES_ART_GEN1A[id]);
  });

  it('the pixel drawer draws every species at every angle, extras included', () => {
    for (const [id, art] of Object.entries(SPECIES_ART_GEN1A)) {
      for (const angle of ANGLES) {
        const pc = drawCreature(angle, poseFor('idle', 0), art);
        expect(filled(pc.data), `${id} ${angle}`).toBeGreaterThan(150);
      }
      if (art.addons?.length) {
        const bare = { ...art, addons: [] };
        const changed = ANGLES.some(
          (a) =>
            Array.from(drawCreature(a, poseFor('idle', 0), art).data).join() !==
            Array.from(drawCreature(a, poseFor('idle', 0), bare).data).join(),
        );
        expect(changed, `${id} extras draw`).toBe(true);
      }
    }
  });

  it('the 3D builder sculpts every species, extras included', () => {
    for (const [id, art] of Object.entries(SPECIES_ART_GEN1A)) {
      const spec = artSpec(id, art);
      const bare = artSpec(id, { ...art, addons: [] });
      if (art.addons?.length) {
        const more =
          spec.torso.prims.length + spec.head.prims.length >
          bare.torso.prims.length + bare.head.prims.length;
        expect(more, `${id} extras sculpt`).toBe(true);
      }
      for (const b of [...spec.torso.box, ...spec.head.box])
        expect(Number.isFinite(b.x + b.y + b.z), id).toBe(true);
      // Torso and head at a coarse grid: real geometry, no NaNs.
      for (const [k, surface] of speciesSurfaces(spec).slice(0, 2).entries()) {
        const g = sculptSurface(spec, { ...surface, res: 18 });
        const pos = g.getAttribute('position');
        expect(pos.count, `${id} surface ${k}`).toBeGreaterThan(30);
        expect(Array.from(pos.array as Float32Array).every(Number.isFinite), id).toBe(true);
      }
    }
  });
});
