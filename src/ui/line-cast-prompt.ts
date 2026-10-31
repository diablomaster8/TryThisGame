import { BRING_HOME_TEXT } from '../config/strings-camp9';
import type { Game } from '../game';
import { castAwaitingChoice } from '../sim/line-rewards';
import type { SimEvent } from '../sim/types';
import { button, el } from './dom';

/**
 * Lane C round 9 (R0594, agent J): the bring-home choice at a line's end. A bottom sheet like
 * the offer card, never over a scene or panel: one Nubbin at a time, Bring home (primary, thumb
 * side) or Let them stay. It reads the waiting cast from the line's flags, so a reload asks
 * again; a refused Bring home (the Grove is full) says so and keeps asking.
 */
export class LineCastPrompt {
  private readonly root: HTMLDivElement;
  /** `line:nubbin` on screen now. */
  private shown: string | null = null;
  /** The Nubbin whose Bring home the Grove had no room for. */
  private full: string | null = null;
  /** An answer sent and not yet applied (commands apply on the next step). */
  private sent: string | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'offer-card cast-prompt');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'false');
    parent.append(this.root);
  }

  onEvents(events: readonly SimEvent[]): void {
    for (const e of events) {
      if (e.kind === 'lineCastChose') {
        this.sent = null;
        this.full = e.ok ? null : e.nubbinId;
        this.shown = null;
      }
    }
  }

  /** The first line Nubbin waiting on the Keeper's answer, if any. */
  private waiting(g: Game): { line: string; id: string } | null {
    for (const line of Object.keys(g.world.lines ?? {}))
      for (const id of castAwaitingChoice(g.world, line))
        if (g.world.nubbins.some((n) => n.id === id)) return { line, id };
    return null;
  }

  /** From the offer card's refresh; true while the prompt is up (the offer card then waits). */
  refresh(busy: boolean): boolean {
    const g = this.game();
    const w = g && !busy ? this.waiting(g) : null;
    if (!g || !w || this.sent === `${w.line}:${w.id}`) {
      this.root.hidden = true;
      if (!w) this.shown = null;
      return false;
    }
    const key = `${w.line}:${w.id}`;
    if (this.shown !== key) {
      this.shown = key;
      this.build(g, w.line, w.id);
    }
    this.root.hidden = false;
    return true;
  }

  private build(g: Game, line: string, id: string): void {
    const n = g.world.nubbins.find((x) => x.id === id);
    const name = n?.name ?? '';
    this.root.replaceChildren();
    const ask = el('p', 'offer-pitch', BRING_HOME_TEXT.ask(name));
    ask.id = `cast-ask-${id}`;
    this.root.setAttribute('aria-labelledby', ask.id);
    this.root.append(ask);
    if (this.full === id) this.root.append(el('p', 'offer-lapse', BRING_HOME_TEXT.full));
    const send = (home: boolean): void => {
      g.send({ kind: 'lineCastHome', line, nubbinId: id, home });
      this.sent = `${line}:${id}`;
      this.root.hidden = true;
    };
    const buttons = el('div', 'offer-buttons');
    buttons.append(
      button(BRING_HOME_TEXT.stay, () => send(false), 'btn'),
      button(BRING_HOME_TEXT.home, () => send(true), 'btn btn-primary'),
    );
    this.root.append(buttons);
  }
}
