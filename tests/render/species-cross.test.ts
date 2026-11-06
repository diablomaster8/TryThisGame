import { describe, expect, it } from 'vitest';
import { speciesArt } from '../../src/render/sprites/species-art';
import { specForKey } from '../../src/render3d/looks';
import { NUBBIN_SPEC } from '../../src/samples/species-data';
import { SPECIES } from '../../src/sim/species';

/**
 * R0455 (TECH-13): the 15 + 60 forms cross-check. Every pocket and digital species is drawn by
 * both renderers: the Pixel recipe exists and the 3D look key `art:<id>` resolves to the
 * species' own spec rather than falling back to the base Nubbin.
 */
describe('species cross-check between renderers', () => {
  const both = SPECIES.filter((s) => s.family !== 'chao');
  it('has the species to check', () => {
    expect(both.length).toBeGreaterThan(100);
  });
  it('every pocket and digital species has a Pixel recipe and its own 3D spec', () => {
    const missing2d: string[] = [];
    const missing3d: string[] = [];
    for (const s of both) {
      if (!speciesArt(s.id)) missing2d.push(s.id);
      if (specForKey(`art:${s.id}`) === NUBBIN_SPEC) missing3d.push(s.id);
    }
    expect(missing2d).toEqual([]);
    expect(missing3d).toEqual([]);
  });
});
