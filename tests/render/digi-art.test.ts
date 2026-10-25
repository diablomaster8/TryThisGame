import { describe, expect, it } from 'vitest';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { CLIPS, type ClipName } from '../../src/render/sprites/animations';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { DIGI2_ART } from '../../src/render/sprites/species-art-digi2';
import { speciesArt } from '../../src/render/sprites/species-art';
import { specForKey } from '../../src/render3d/looks';
import { parseSculpt, serializeSculpt } from '../../src/samples/sculpt-spec';
import { sculptSurface, speciesSurfaces, surfaceData } from '../../src/samples/species';
import { speciesByFamily } from '../../src/sim/species';

/**
 * Every digital-line species has one recipe that both renderers draw from: the pixel drawer
 * paints every angle, and the 3D side turns the same recipe into a species spec that
 * serialises for the sculpt workers. The kit plans (four legs, fish) and extras show up in
 * both.
 */
const digi = speciesByFamily('digi');

describe('digital-line art', () => {
  it('every digital species has a recipe, and the new file holds exactly Versions 2 to 5', () => {
    for (const s of digi) expect(speciesArt(s.id), s.id).toBeDefined();
    expect(Object.keys(DIGI2_ART)).toHaveLength(56);
  });

  it('the pixel drawer paints every angle of every species', () => {
    for (const s of digi) {
      const art = speciesArt(s.id)!;
      for (const angle of DRAWN_ANGLES) {
        const b = drawCreature(angle, poseFor('idle', 0), art).bounds();
        expect(b, `${s.id} ${angle}`).not.toBeNull();
        expect(b!.w).toBeGreaterThan(8);
        expect(b!.h).toBeGreaterThan(8);
      }
    }
  });

  it('draws every clip frame for each kit plan and extra', () => {
    for (const id of ['frostwolf', 'tidehulk', 'manefist', 'trihead', 'whirlbot']) {
      for (const clip of Object.keys(CLIPS) as ClipName[])
        for (let f = 0; f < CLIPS[clip].frames; f++)
          for (const angle of DRAWN_ANGLES)
            expect(drawCreature(angle, poseFor(clip, f), speciesArt(id)!).bounds()).not.toBeNull();
    }
  });

  it('a single eye replaces the pair in the pixel face', () => {
    const plain = { ...speciesArt('hoofguard')!, extras: [] };
    const one = drawCreature('front', poseFor('idle', 0), speciesArt('hoofguard')!);
    const two = drawCreature('front', poseFor('idle', 0), plain);
    let diff = 0;
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) if (one.get(x, y) !== two.get(x, y)) diff++;
    expect(diff).toBeGreaterThan(4);
  });

  it('the 3D side builds a spec for every species from the same recipe', () => {
    for (const s of digi) {
      const spec = specForKey(`art:${s.id}`);
      expect(spec, s.id).not.toBeNull();
      for (const surface of speciesSurfaces(spec!)) {
        const d = surfaceData(spec!, surface);
        expect(parseSculpt(serializeSculpt(d))).toEqual(d);
      }
    }
  });

  it('kit plans and extras reach the 3D figure', () => {
    const wolf = specForKey('art:frostwolf')!;
    expect(wolf.gait).toBe('quadruped');
    expect(wolf.parts.map((p) => p.name)).toEqual(
      expect.arrayContaining(['legFL', 'legFR', 'legBL', 'legBR']),
    );
    expect(specForKey('art:hoofguard')!.eyes.x).toBe(0);
    const plainBird = specForKey('art:pinkbeak')!;
    expect(plainBird.head.prims.some((p) => p.kind === 'cone')).toBe(true);
    const whale = specForKey('art:tidehulk')!;
    expect(whale.parts.some((p) => p.name === 'tail')).toBe(true);
    // The quad and the whale sculpt to real geometry.
    for (const spec of [wolf, whale]) {
      const g = sculptSurface(spec, { ...speciesSurfaces(spec)[0]!, res: 28 });
      expect(g.getAttribute('position').count).toBeGreaterThan(300);
    }
  });
});
