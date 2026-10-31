/**
 * R0366 (lane E r10): Byte's undone lace in the Pixel sheet: a copy of the frame with a few
 * white pixels added by the shoe, the figure itself unchanged.
 */
import { describe, expect, it } from 'vitest';
import { drawKeeperFrame, laceFrame, SUN_KEEPER } from '../../src/render/sprites/keeper';
import { C } from '../../src/render/sprites/palette';

describe('Byte’s lace frame', () => {
  it('adds white pixels near the feet and keeps every pixel of the frame', () => {
    const src = drawKeeperFrame('front', 'idle', 0, SUN_KEEPER);
    const out = laceFrame(src, 0);
    let added = 0;
    let lowest = 0;
    for (let i = 0; i < src.data.length; i++) {
      if (src.data[i] && out.data[i] !== src.data[i]) {
        if (out.data[i] !== C.white + 1) throw new Error('changed a pixel of the figure');
      }
      if (!src.data[i] && out.data[i]) {
        expect(out.data[i]).toBe(C.white + 1);
        added++;
        lowest = Math.max(lowest, Math.floor(i / src.width));
      }
    }
    expect(added).toBeGreaterThan(0);
    expect(lowest).toBeGreaterThan(src.height * 0.75);
  });
});
