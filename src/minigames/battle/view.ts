import type { SpriteSheet } from '../../render/sprites/atlas';
import type { BattleEvent, BattleState, Combatant } from '../../sim/battle';
import type { Nubbin } from '../../sim/types';

/**
 * What the battle screen draws its stage with (R0219, FIGHT-07). The bout runs in the sim; the
 * screen owns the flow (the HP cards, the log line, the action sheet, the playback cursor, the
 * results) and hands each frame to one of two views: the pixel canvas (`pixel-view.ts`, the
 * shipped look) or, in Full 3D, the arena of rigs (`render3d/battle-3d.ts`), which draws into the
 * game canvas under the see-through stage. A view only reads the bout and the frame.
 */
export interface BattleView {
  /** The element the view draws in (the pixel canvas; the 3D view's is never shown). */
  readonly element: HTMLElement;
  /** True once the view can draw: at once for pixels, after the arena and rigs for 3D. */
  readonly ready: boolean;
  /** Set up for a bout. */
  start(s: BattleState, cast: BattleCast): void;
  /** The stage's on-screen box, which the view fills. */
  resize(rect: DOMRect): void;
  draw(s: BattleState, f: BattleFrame, nowMs: number): void;
  /** The bout closed: release what it held (the view can start again). */
  stop(): void;
  dispose(): void;
}

/** Who the combatants are, as the views need them; the screen answers from the game. */
export interface BattleCast {
  /** The Nubbin behind a combatant, or null for a rival. */
  nubbin(c: Combatant): Nubbin | null;
  /** The pixel sheet a combatant draws with (the pixel view), or null when it cannot. */
  sheet(c: Combatant): SpriteSheet | null;
  /** The art id a rival draws as: a Hollow family's own look (R0157), else its species. */
  art(c: Combatant): string;
}

/** One frame of playback, as the screen has shown it so far. */
export interface BattleFrame {
  /** The event playing now and how far through it (0..1), or null when caught up. */
  e: BattleEvent | null;
  k: number;
  /** The combatant shown for each side (ours, then theirs). */
  shown: readonly [Combatant | undefined, Combatant | undefined];
  /** HP as the playback has shown it. */
  hp(c: Combatant): number;
  /** Anything still to play. */
  busy: boolean;
  /** A rising number or word over a combatant, and when it started. */
  pop: { id: string; text: string; at: number } | null;
}
