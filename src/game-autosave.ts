/**
 * hot/perf-leaks E4: the frame's side of the autosave, split out of game.ts. The frame that
 * finds the autosave due only asks (`platform/autosave.ts` runs the write in idle time). Every
 * 2 minutes the slot's picture is wanted too: it used to draw the whole scene a second time
 * inside that frame (20-33 ms of a 53-71 ms frame at 4x CPU in Full 3D). Now the frame just
 * drawn is copied while its pixels are still in the canvas, and shrunk and encoded later in
 * idle time, once the save it belongs to is written.
 */
import { browserIdle } from './platform/autosave';
import { currentSlot, slotId, writeThumb } from './platform/storage';
import type { GradeFrame } from './ui/look-paint';
import { paintGrade } from './ui/look-paint';
import { currentGrade } from './ui/title-card';
import type { World } from './sim/types';
import type { Game } from './game';

/** R0447: how often the slot list's picture is refreshed. */
export const THUMB_EVERY_MS = 120_000;

/** A copy of one drawn frame, waiting for its save to be written. */
export interface FrameShot {
  bitmap: Promise<ImageBitmap | null>;
  slot: string;
  world: World;
  clientHeight: number;
  grade: GradeFrame | null;
}

/**
 * `src` (a `srcW` x `srcH` frame shown `clientHeight` CSS px tall) centre-cropped into a new
 * `w` x `h` canvas, with the DOM grade layers painted on (they are not in the canvas).
 */
export function cropFrame(
  src: CanvasImageSource,
  srcW: number,
  srcH: number,
  clientHeight: number,
  w: number,
  h: number,
  grade: GradeFrame | null,
): HTMLCanvasElement | null {
  if (!srcW || !srcH) return null;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');
  if (!ctx) return null;
  const k = Math.min(srcW / w, srcH / h);
  const sw = w * k;
  const sh = h * k;
  ctx.drawImage(src, (srcW - sw) / 2, (srcH - sh) / 2, sw, sh, 0, 0, w, h);
  // K30: the grid's 48 CSS px spacing scales with the crop.
  paintGrade(ctx, w, h, grade, 48 * (h / Math.max(1, clientHeight || srcH / k)));
  return out;
}

/**
 * Called from the frame once the autosave is due. `drew`: this frame rendered, so the canvas
 * still holds its pixels for the slot picture. A request already waiting is left alone.
 */
export function queueAutosave(g: Game, drew: boolean): void {
  if (g.autosave.pending) return;
  const shot = drew && g.thumbDue() && typeof createImageBitmap === 'function' ? takeShot(g) : null;
  g.autosaveShot = shot;
  g.autosave.request(() => {
    g.autosaveShot = null;
    const ok = g.writeNow();
    if (!ok) dropShot(shot);
    else if (shot) finishThumb(g, shot);
    // No copy of a frame (none drawn, or no createImageBitmap): the old way, still off the frame.
    else g.saveThumb();
  });
}

/** Let go of a frame copy that will not be used. */
export function dropShot(shot: FrameShot | null): void {
  if (shot) void shot.bitmap.then((b) => b?.close());
}

function takeShot(g: Game): FrameShot {
  const c = g.canvas;
  let bitmap: Promise<ImageBitmap | null>;
  try {
    bitmap = createImageBitmap(c).catch(() => null);
  } catch {
    bitmap = Promise.resolve(null);
  }
  return {
    bitmap,
    slot: slotId(currentSlot()),
    world: g.world,
    clientHeight: c.clientHeight,
    grade: currentGrade(),
  };
}

function finishThumb(g: Game, shot: FrameShot): void {
  // As `saveThumb` does once the save is written: the next picture in 2 minutes.
  g.nextThumbMs = performance.now() + THUMB_EVERY_MS;
  void shot.bitmap.then((bm) => {
    if (!bm) return;
    browserIdle(() => {
      try {
        // A slot switch or an import since the copy: it is not this slot's picture any more.
        if (g.world !== shot.world || slotId(currentSlot()) !== shot.slot) return;
        const c = cropFrame(bm, bm.width, bm.height, shot.clientHeight, 160, 90, shot.grade);
        if (c) writeThumb(currentSlot(), c.toDataURL('image/jpeg', 0.5));
      } catch {
        // A lost canvas: the slot just keeps its older picture.
      } finally {
        bm.close();
      }
    }, 2000);
  });
}
