/**
 * HOT-1 (Maor, 2026-10-30): with the stats sheet open, the selected Nubbin sits at the centre
 * of the part of the screen the sheet leaves clear. The camera aims at the Nubbin itself and
 * the projection is shifted (`setViewOffset`) so that point lands at the clear area's centre,
 * the same in the Pixel view's orthographic camera and Full 3D's perspective one; picking and
 * projection read the same matrix, so taps still land where they look.
 *
 * Before this, the view stayed on the Keeper and was pushed a fixed share of the view sideways
 * (17% of the width on a desktop, a 22% lift on a phone), so the clicked Nubbin ended up
 * wherever it happened to be, often far off to one side.
 */
import type { OrthographicCamera, PerspectiveCamera } from 'three';

/** Where the subject should sit, as shares of the view from its centre: +x right, +y up. */
export interface ViewShift {
  x: number;
  y: number;
}

export const NO_SHIFT: ViewShift = { x: 0, y: 0 };

/**
 * The shift that centres the subject in the clear part of a `w`×`h` view, given the
 * sheet's rectangle in the same pixels (or null when no sheet is open). The clear part is
 * the larger of the strip left of the sheet and the strip above it.
 */
export function clearShift(
  w: number,
  h: number,
  sheet: { left: number; top: number; right: number; bottom: number } | null,
): ViewShift {
  if (!sheet || w <= 0 || h <= 0) return NO_SHIFT;
  const leftArea = Math.max(0, sheet.left) * h;
  const topArea = Math.max(0, sheet.top) * w;
  if (leftArea <= 0 && topArea <= 0) return NO_SHIFT;
  if (leftArea >= topArea) return { x: (sheet.left / 2 - w / 2) / w, y: 0 };
  return { x: 0, y: (h / 2 - sheet.top / 2) / h };
}

/** Ease one shift toward another (`t` in 0..1). */
export function easeShift(from: ViewShift, to: ViewShift, t: number): ViewShift {
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  // Close enough is there: an exponential ease never quite lands, and the offset should clear.
  return Math.abs(to.x - x) < 1e-3 && Math.abs(to.y - y) < 1e-3 ? to : { x, y };
}

/**
 * Apply a shift to a camera's projection. `snapW`/`snapH` (the low-res frame in pixels, for
 * the Pixel view) round the offset to whole pixels so the art never shimmers.
 */
export function applyViewShift(
  cam: OrthographicCamera | PerspectiveCamera,
  s: ViewShift,
  snapW = 0,
  snapH = 0,
): void {
  let ox = -s.x;
  let oy = s.y;
  if (snapW > 0) ox = Math.round(ox * snapW) / snapW;
  if (snapH > 0) oy = Math.round(oy * snapH) / snapH;
  if (Math.abs(ox) < 1e-6 && Math.abs(oy) < 1e-6) {
    if (cam.view?.enabled) cam.clearViewOffset();
    return;
  }
  // A perspective camera takes its aspect from the full size given here, so keep its own.
  const fh = 1000;
  const fw = 'aspect' in cam ? fh * cam.aspect : fh;
  const v = cam.view;
  if (v?.enabled && v.fullWidth === fw && v.offsetX === ox * fw && v.offsetY === oy * fh) return;
  cam.setViewOffset(fw, fh, ox * fw, oy * fh, fw, fh);
}
