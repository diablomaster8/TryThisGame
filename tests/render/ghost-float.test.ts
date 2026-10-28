import { describe, expect, it } from 'vitest';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { speciesArt } from '../../src/render/sprites/species-art';
import { artSpec } from '../../src/render3d/art-species';

/** R0416: the ghost line floats, Gastly wears its gas, Haunter's hands drift free. */
const filled = (data: ArrayLike<number>) => Array.from(data).filter((v) => v !== 0).length;

describe('floating ghosts', () => {
  it('the gas ball and the hands float in both renderers', () => {
    for (const id of ['spooklet', 'spookhand']) {
      const art = speciesArt(id)!;
      expect(art.gen1b, id).toContain('float');
      const spec = artSpec(id, art);
      expect(spec.gait, id).toBe('hover');
      expect(spec.hover ?? 0, id).toBeGreaterThan(0.3);
      const grounded = { ...art, gen1b: art.gen1b!.filter((p) => p !== 'float') };
      const up = drawCreature('front', poseFor('idle', 0), art).bounds()!;
      const down = drawCreature('front', poseFor('idle', 0), grounded).bounds()!;
      expect(up.y + up.h, id).toBeLessThan(down.y + down.h);
    }
  });

  it('Gastly has a gas ring in pixels and a gas shell hook in 3D', () => {
    const art = speciesArt('spooklet')!;
    expect(art.gen1b).toContain('gas');
    const plain = { ...art, gen1b: art.gen1b!.filter((p) => p !== 'gas') };
    const gas = drawCreature('front', poseFor('idle', 0), art);
    const bare = drawCreature('front', poseFor('idle', 0), plain);
    expect(filled(gas.data)).toBeGreaterThan(filled(bare.data) + 40);
    expect(typeof artSpec('spooklet', art).extras).toBe('function');
  });

  it("Haunter's hands are their own parts, 1.6 times the old floating hands", () => {
    const spec = artSpec('spookhand', speciesArt('spookhand')!);
    const hands = spec.parts.filter((p) => p.name === 'ghostL' || p.name === 'ghostR');
    expect(hands).toHaveLength(2);
    for (const h of hands) expect(h.prims[0]!.r).toBeCloseTo(0.22 * 1.6, 2);
  });
});
