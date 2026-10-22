import type { Game } from '../game';

/**
 * Panels that cover the Grove (a story scene, the "While you were away" screen, the photo
 * panel) stop the Full 3D render behind them, to spare a phone's battery: the last frame
 * stays up and the sim runs on. The pixel view is cheap and keeps drawing, as it always
 * has. Polled from the HUD's refresh loop, so every way a panel closes is seen; it only
 * lifts a pause it set itself, so the minigames' own pauses are left alone.
 */
let held = false;
/** What the covered view shows (a story scene and its speaker), and until when it draws on. */
let shownKey = '';
let drawUntil = 0;

/**
 * `key` names what is staged under the panel (the scene and who speaks). When it changes,
 * the render runs again for `RESTAGE_MS` so the new set, light and shot are drawn before
 * the frame is held: a debug chapter jump or the next speaker restages under a box that
 * never closed.
 */
const RESTAGE_MS = 2400;

export function holdRenderWhile(
  g: Game,
  covered: boolean,
  key = '',
  nowMs: number = performance.now(),
): void {
  if (key !== shownKey) {
    shownKey = key;
    drawUntil = nowMs + RESTAGE_MS;
  }
  // Not while the 3D Grove is still loading: its build advances on frames, and the away
  // screen often opens at boot, over the loading bar.
  const want = covered && nowMs >= drawUntil && !!g.scene3d && g.scene3d.loadState().done;
  if (want && !held && !g.renderPaused) {
    g.renderPaused = true;
    held = true;
  } else if (!want && held) {
    g.renderPaused = false;
    held = false;
  }
}
