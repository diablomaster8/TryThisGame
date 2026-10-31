import { CG4_D4 } from '../config/tuning-d4';

/**
 * K35, pixel: the wind's two-frame sway for bushes and banners. The d4 dressing sets `lean`
 * (how far the wind pushes everything, world units) and `still` (reduced motion) once a
 * frame; the scenery and banner draws ask `windSway` for a sprite's sideways shift. Two frames,
 * not a smooth wave, to match the sprites; held leaning, never swaying, when `still`.
 */
/** `shed`: the Pixel governor dropped the sway (TECH-53); held leaning, as when `still`. */
export const PIXEL_WIND = { lean: 0, windy: 0, still: false, shed: false };

export function windSway(seed: number, nowMs: number): number {
  const p = CG4_D4.windPx;
  if (PIXEL_WIND.still || PIXEL_WIND.shed) return PIXEL_WIND.lean * p.leanShare;
  // Each sprite flips on its own phase, so a row of bushes does not move as one.
  const frame = Math.floor(nowMs / p.frameMs + seed * 0.37) % 2;
  return (
    PIXEL_WIND.lean * p.leanShare + (frame === 0 ? -1 : 1) * p.swing * (0.4 + PIXEL_WIND.windy)
  );
}
