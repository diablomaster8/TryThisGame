/**
 * R0041 (lane A r10): the Pixel Keeper's uphill lean frame pushes the head forward in side
 * view (toward the right-facing drawn front), stoops it in front view, and leaves the feet.
 */
import { describe, expect, it } from 'vitest';
import { drawKeeperFrame, SUN_KEEPER } from '../../src/render/sprites/keeper';
import { leanFrame } from '../../src/render/sprites/keeper-lean';
import type { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { hillHeight } from '../../src/sim/terrain';
import { KEEPER_SLOPE } from '../../src/config/tuning-move';
import { PIXEL_LEAN } from '../../src/config/tuning-move-r10';

/** First and last filled row, and the mean x of a row band's filled pixels. */
function box(pc: PixelCanvas, y0: number, y1: number): { top: number; cx: number } {
  let top = Infinity;
  let sx = 0;
  let n = 0;
  for (let y = 0; y < pc.height; y++)
    for (let x = 0; x < pc.width; x++) {
      if (!pc.data[y * pc.width + x]) continue;
      top = Math.min(top, y);
      if (y >= y0 && y < y1) {
        sx += x;
        n++;
      }
    }
  return { top, cx: n ? sx / n : 0 };
}

describe('Pixel uphill lean (MOVE-41)', () => {
  it('side view: the head moves forward, the feet stay', () => {
    const walk = drawKeeperFrame('side', 'walk', 0, SUN_KEEPER);
    const lean = leanFrame(walk, 'side');
    expect(box(lean, 0, 24).cx).toBeGreaterThan(box(walk, 0, 24).cx + 1);
    expect(box(lean, 56, 64).cx).toBeCloseTo(box(walk, 56, 64).cx, 5);
  });

  it('front view: it stoops a pixel', () => {
    const walk = drawKeeperFrame('front', 'walk', 0, SUN_KEEPER);
    const lean = leanFrame(walk, 'front');
    expect(box(lean, 0, 1).top).toBeGreaterThan(box(walk, 0, 1).top);
  });

  it('the Grove ramps are steep enough somewhere to show it', () => {
    let steepest = 0;
    const r = KEEPER_SLOPE.probe;
    for (let x = -48; x <= 48; x += 1)
      for (let z = -48; z <= 48; z += 1)
        steepest = Math.max(steepest, (hillHeight(x + r, z) - hillHeight(x, z)) / r);
    expect(steepest).toBeGreaterThan(PIXEL_LEAN.minSlope);
  });
});
