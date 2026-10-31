/**
 * R0041 (MOVE-41, lane A r10): the Pixel Keeper's uphill lean. Each walk frame is redrawn
 * with everything above the waist pushed forward, more the higher it is (side and quarter
 * views lean toward the right-facing drawn front; front and back views stoop a pixel).
 * Drawn once into the player's sheet as the `walk-lean` clip.
 */
import type { DrawnAngle } from './angles';
import { PixelCanvas, PX } from './pixel-canvas';

export const KEEPER_LEAN_CLIP = 'walk-lean';

/** The design row the lean pivots at (the belt sits at 24 on a 32 px Keeper). */
const WAIST = 24;

/** A copy of `src` leaning forward from the waist. */
export function leanFrame(src: PixelCanvas, angle: DrawnAngle): PixelCanvas {
  const out = new PixelCanvas(src.logicalWidth, src.logicalHeight);
  const w = src.width;
  const waist = WAIST * PX;
  // The forward push at the top row, in design pixels.
  const reach = angle === 'side' ? 2 : angle === 'frontQuarter' || angle === 'backQuarter' ? 1 : 0;
  const stoop = reach === 0 ? PX : 0;
  for (let y = 0; y < src.height; y++) {
    const above = Math.max(0, waist - y);
    const dx = Math.round((above / waist) * reach * PX);
    // Front and back: the upper body drops a pixel instead (head bowed into the climb).
    const sy = y < waist ? y - stoop : y;
    if (sy < 0) continue;
    for (let x = 0; x < w; x++) {
      const sx = x - dx;
      if (sx < 0 || sx >= w) continue;
      const v = src.data[sy * w + sx] ?? 0;
      if (v) out.data[y * w + x] = v;
    }
  }
  return out;
}
