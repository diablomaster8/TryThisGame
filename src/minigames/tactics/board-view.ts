/**
 * What the tactics screen needs from a board, so the Pixel board (`pixel-view.ts`) and the
 * Full 3D board (`render3d/tactics-3d.ts`) are interchangeable. Pan is in the view's own
 * board units: low-res pixels for Pixel, CSS pixels for 3D (where `scale` is 0.5 so the
 * screen's drag maths lands on CSS pixels). Both read the state only.
 */
import type { SpriteSheet } from '../../render/sprites/atlas';
import type { TacticsCell, GridMap, TacticsState, TUnit } from '../../sim/battle/tactics/types';

export interface Overlays {
  move?: TacticsCell[];
  aim?: TacticsCell[];
  path?: TacticsCell[];
  target?: TacticsCell | null;
  cursor?: TacticsCell | null;
  heights?: boolean;
}

/** Recent hits by unit id (ms timestamps): `hurt` for any hit, `pile` for a pile-on. */
export interface Flashes {
  hurt: Map<string, number>;
  pile: Map<string, number>;
}

export interface TacticsBoardView {
  /** Quarter turns clockwise. */
  rot: number;
  zoom: 1 | 2;
  scale: number;
  panX: number;
  panY: number;
  resize(m: GridMap): void;
  draw(
    s: TacticsState,
    o: Overlays,
    now: number,
    sheetFor: (u: TUnit) => SpriteSheet | null,
    flashes: Flashes,
  ): void;
  pick(s: TacticsState, bx: number, by: number): TacticsCell | null;
  tileCss(): number;
  centreOn(s: TacticsState, c: TacticsCell): void;
  clientOf(s: TacticsState, c: TacticsCell): { x: number; y: number };
  toBoard(clientX: number, clientY: number): { x: number; y: number };
  /** Draw calls in the last frame, for the R0253/R0254 budgets (null when unknown). */
  drawCalls(): number | null;
  dispose(): void;
}
