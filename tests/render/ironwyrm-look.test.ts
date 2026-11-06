import { describe, expect, it } from 'vitest';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { artSpec } from '../../src/render3d/art-species';

/** Ironwyrm reads as steel (plated, spiked, underbite), not as Boulderwyrm's rocks. */
const iron = SPECIES_ART.ironwyrm!;
const boulder = SPECIES_ART.boulderwyrm!;

describe('Ironwyrm look', () => {
  it('draws differently from Boulderwyrm at every angle', () => {
    for (const angle of ['front', 'frontQuarter', 'side'] as const) {
      const a = drawCreature(angle, poseFor('idle', 0), iron);
      const b = drawCreature(angle, poseFor('idle', 0), boulder);
      const same =
        a.width === b.width && a.height === b.height && a.data.every((v, i) => v === b.data[i]);
      expect(same).toBe(false);
    }
  });

  it('asks for plates, spikes and a jaw, and drops the boulders', () => {
    expect(iron.serpent).toMatchObject({ plated: true, spikes: true, jaw: true });
    expect(iron.gen1b ?? []).not.toContain('boulders');
    expect(boulder.serpent?.jaw).toBeUndefined();
  });

  it('builds the jaw, spikes and plates in 3D', () => {
    const spec = artSpec('ironwyrm', iron);
    const tags = (ps: { tag?: string }[]) => ps.map((p) => p.tag);
    expect(tags(spec.head.prims)).toContain('jaw');
    const segs = spec.parts.filter((p) => p.name.startsWith('seg'));
    const all = segs.flatMap((s) => tags(s.prims));
    expect(all.filter((t) => t === 'spike').length).toBeGreaterThanOrEqual(10);
    expect(all).toContain('plate');
    expect(tags(artSpec('boulderwyrm', boulder).head.prims)).not.toContain('jaw');
  });
});
