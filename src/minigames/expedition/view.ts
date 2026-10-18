import type { SpriteSheet } from '../../render/sprites/atlas';
import type { Nubbin } from '../../sim/types';
import type { RunState } from './run';

/**
 * What the Expedition screen draws with. The run itself is pure (`run.ts`); the screen
 * owns the flow (taps, keys, HUD, results, the reward hand-off) and hands each frame to
 * one of two views: the pixel canvas (`pixel-view.ts`, the shipped look) or, in Full 3D,
 * the 3D track (`render3d/expedition-3d.ts`). A view only reads the run.
 */
export type ExpeditionTheme = 'meadow' | 'hollow';

export interface ExpeditionView {
  /** The element the view draws in; the screen shows the one in use. */
  readonly element: HTMLElement;
  /** True once the view can draw: at once for pixels, after the stage and rig for 3D. */
  readonly ready: boolean;
  /** Set up for a run with this runner (its sheet is for the pixel view). */
  start(runner: Nubbin, sheet: SpriteSheet, theme: ExpeditionTheme): void;
  /** The screen's box changed (resize, rotation). */
  resize(rect: DOMRect): void;
  draw(run: RunState, nowMs: number): void;
  /** The run ended or was left: release what the run held. */
  stop(): void;
  dispose(): void;
}
