import type { Game } from '../game';
import type { MicroScreen } from '../minigames/micro/micro-screen';
import type { TraceGame } from './trace';

/** Lane C r13 (R0610): what the journal's page renderers need from the Journal that owns them. */
export interface JournalCtx {
  g: Game;
  body: HTMLElement;
  parent: HTMLElement;
  /** Hides the dialog so a scene the step starts plays in the clear. */
  hide: () => void;
  close: () => void;
  refresh: () => void;
  /** Opens the journal again (after the tracing game closes). */
  reopen: () => void;
  openers: Record<string, () => void>;
  micro: MicroScreen;
  trace: TraceGame;
}
