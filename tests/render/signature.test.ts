import { describe, expect, it } from 'vitest';
import { SIGNATURES, SIGNATURE_TIMING, signatureAt } from '../../src/render/signature';
import { speciesArt } from '../../src/render/sprites/species-art';
import { CLIPS } from '../../src/render/sprites/animations';

/** LOOK-44: the favourites' iconic idle beats. */
describe('signature idles', () => {
  it('gives at least 30 drawn species a signature, covering all 16 beats', () => {
    const ids = Object.keys(SIGNATURES);
    expect(ids.length).toBeGreaterThanOrEqual(30);
    for (const id of ids) expect(speciesArt(id), id).toBeDefined();
    expect(new Set(Object.values(SIGNATURES)).size).toBe(16);
  });

  it('plays each one every 8-15 s on a clip the creature sheet draws', () => {
    const drawn = new Set([...Object.keys(CLIPS), 'dizzy', 'surprised']);
    const window = SIGNATURE_TIMING.gapMs[1] + SIGNATURE_TIMING.playMs;
    for (const [id, sig] of Object.entries(SIGNATURES)) {
      const frames = [];
      for (let t = 0; t < window; t += 50) {
        const f = signatureAt(`n-${id}`, id, t);
        if (f) frames.push(f);
      }
      expect(frames.length, id).toBeGreaterThan(0);
      for (const f of frames) {
        expect(f.sig).toBe(sig);
        expect(drawn.has(f.clip), `${id} ${f.clip}`).toBe(true);
      }
    }
    expect(signatureAt('n-1', 'chao', 0)).toBeNull();
  });

  it('keeps still under reduced motion', () => {
    for (let t = 0; t < 20000; t += 50) {
      const f = signatureAt('n-x', 'copyblob', t, true);
      if (f) expect([f.dy, f.sw, f.sh, f.flip]).toEqual([0, 1, 1, false]);
    }
  });
});
