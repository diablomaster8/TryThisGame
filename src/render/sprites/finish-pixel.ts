import type { ChaoColors } from './chao';
import { lightOf, shadeOf, C } from './palette';
import { PX, type PixelCanvas } from './pixel-canvas';

/**
 * The metal and glass egg finishes in Pixel (LOOK-31). Metal turns the egg colour's ramp
 * hard: a deeper shade, a lit belly, a white rim and glint, so gold reads as gold leaf and
 * grey as silver. Glass is a dithered checker: every other interior design pixel is left
 * clear, so the ground shows through; the outline, eyes and highlights stay solid.
 */

export function metalColors(c: ChaoColors): ChaoColors {
  return {
    ...c,
    shade: shadeOf(c.shade),
    belly: lightOf(c.body),
    rim: C.white,
    glint: C.white,
  };
}

/** Clear a checker of interior pixels, keeping the outline and the `keep` colours. */
export function ditherGlass(pc: PixelCanvas, keep: readonly number[]): void {
  const w = pc.logicalWidth;
  const h = pc.logicalHeight;
  const solid = new Set(keep);
  const filled = (x: number, y: number) => pc.get(x, y) >= 0;
  const clear: [number, number][] = [];
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      if ((x + y) % 2 !== 0) continue;
      const v = pc.get(x, y);
      if (v < 0 || solid.has(v)) continue;
      // Interior only: the edge pixels carry the outline.
      if (!filled(x - 1, y) || !filled(x + 1, y) || !filled(x, y - 1) || !filled(x, y + 1))
        continue;
      clear.push([x, y]);
    }
  for (const [x, y] of clear)
    for (let dy = 0; dy < PX; dy++)
      pc.data.fill(0, (y * PX + dy) * pc.width + x * PX, (y * PX + dy) * pc.width + x * PX + PX);
}
