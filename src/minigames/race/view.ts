import type { SpriteSheet } from '../../render/sprites/atlas';
import type { SheetCache } from '../../render/sprites/sheets';
import type { RaceState } from '../../sim/race';
import type { Nubbin } from '../../sim/types';

/**
 * What the race screen draws with. The race runs in the sim (`sim/race.ts`); the screen
 * owns the flow (the cheer button, keys, HUD, results, the outcome hand-off) and hands
 * each frame to one of two views: the pixel canvas (`pixel-view.ts`, the shipped look)
 * or, in Full 3D, the 3D course (`render3d/race-3d.ts`). A view only reads the race.
 */
export interface RaceView {
  /** The element the view draws in; the screen shows the one in use. */
  readonly element: HTMLElement;
  /** True once the view can draw: at once for pixels, after the stage and rigs for 3D. */
  readonly ready: boolean;
  /** Set up for a race; the sheets are for the pixel view, the Nubbin for the 3D look. */
  start(race: RaceState, player: Nubbin, playerSheet: SpriteSheet, cache: SheetCache): void;
  resize(rect: DOMRect): void;
  draw(race: RaceState, nowMs: number): void;
  /** The player cheered (the sim already took it): a flourish, if the view has one. */
  cheered(race: RaceState, nowMs: number): void;
  /** The race ended or was left: release what it held. */
  stop(): void;
  dispose(): void;
}
