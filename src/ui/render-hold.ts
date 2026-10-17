import type { Game } from '../game';

/**
 * Panels that cover the Grove (a story scene, the "While you were away" screen, the photo
 * panel) stop the Full 3D render behind them, to spare a phone's battery: the last frame
 * stays up and the sim runs on. The pixel view is cheap and keeps drawing, as it always
 * has. Polled from the HUD's refresh loop, so every way a panel closes is seen; it only
 * lifts a pause it set itself, so the minigames' own pauses are left alone.
 */
let held = false;

export function holdRenderWhile(g: Game, covered: boolean): void {
  // Not while the 3D Grove is still loading: its build advances on frames, and the away
  // screen often opens at boot, over the loading bar.
  const want = covered && !!g.scene3d && g.scene3d.loadState().done;
  if (want && !held && !g.renderPaused) {
    g.renderPaused = true;
    held = true;
  } else if (!want && held) {
    g.renderPaused = false;
    held = false;
  }
}
