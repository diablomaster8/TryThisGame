import '../tactics.css';
import { moveName } from '../config/strings-battle';
import { TACTICS_TEXT as T } from '../config/strings-tactics';
import type { Dir } from '../sim/battle/tactics/types';
import type { PreviewRow } from '../sim/battle/tactics';
import { button, el } from './dom';

/**
 * The phone tactics bar (recs FIGHT-63): Move, Act, Wait and Undo at the bottom (64 px), a
 * 2×2 move sheet, a preview card with Confirm, and four big facing arrows for Wait. Pure DOM:
 * the screen tells it what to show and gets the taps back. Nothing commits on one tap: a move
 * needs the same tile twice (or Go), an act needs Confirm, a wait needs an arrow.
 */
export interface BarHandlers {
  move(): void;
  act(): void;
  wait(): void;
  undo(): void;
  go(): void;
  pickMove(id: string): void;
  confirm(): void;
  together(): void;
  face(d: Dir): void;
  cancel(): void;
}

export class TacticsBar {
  readonly root = el('div', 'tactics-bar');
  private readonly main = el('div', 'tactics-main');
  private readonly sheet = el('div', 'tactics-sheet');
  private readonly card = el('div', 'tactics-card');
  private readonly arrows = el('div', 'tactics-arrows');
  private readonly hint = el('div', 'tactics-hint');
  readonly buttons: Record<'move' | 'act' | 'wait' | 'undo' | 'go', HTMLButtonElement>;

  constructor(
    parent: HTMLElement,
    private readonly h: BarHandlers,
  ) {
    this.buttons = {
      move: button(`👣 ${T.move}`, () => h.move(), 'btn tactics-btn'),
      act: button(`✊ ${T.act}`, () => h.act(), 'btn tactics-btn'),
      wait: button(`⏳ ${T.wait}`, () => h.wait(), 'btn tactics-btn'),
      undo: button(`↶ ${T.undo}`, () => h.undo(), 'btn tactics-btn'),
      go: button(`✔ ${T.go}`, () => h.go(), 'btn tactics-btn tactics-go'),
    };
    this.main.append(
      this.buttons.move,
      this.buttons.act,
      this.buttons.wait,
      this.buttons.undo,
      this.buttons.go,
    );
    const arrow = (d: Dir, icon: string, label: string) => {
      const b = button(icon, () => h.face(d), `btn tactics-arrow tactics-arrow-${d}`);
      b.setAttribute('aria-label', label);
      return b;
    };
    this.arrows.append(
      arrow('n', '▲', 'North'),
      arrow('w', '◀', 'West'),
      arrow('e', '▶', 'East'),
      arrow('s', '▼', 'South'),
    );
    this.root.append(this.hint, this.card, this.sheet, this.arrows, this.main);
    parent.appendChild(this.root);
    this.show('idle');
  }

  /** Which panel shows; the others hide. */
  show(mode: 'idle' | 'move' | 'moveSheet' | 'aim' | 'preview' | 'face' | 'busy'): void {
    this.sheet.hidden = mode !== 'moveSheet';
    this.card.hidden = mode !== 'preview';
    this.arrows.hidden = mode !== 'face';
    this.main.hidden = mode === 'busy';
    this.buttons.go.hidden = mode !== 'move';
    this.hint.textContent =
      mode === 'move'
        ? T.tapTile
        : mode === 'aim'
          ? T.tapTarget
          : mode === 'face'
            ? T.faceHint
            : '';
    this.hint.hidden = !this.hint.textContent;
  }

  state(o: { moved: boolean; acted: boolean; canUndo: boolean; goReady: boolean }): void {
    this.buttons.move.disabled = o.moved;
    this.buttons.act.disabled = o.acted;
    this.buttons.undo.disabled = !o.canUndo;
    this.buttons.go.disabled = !o.goReady;
  }

  /** The 2×2 sheet of the unit's moves (up to four, plus a champion's fifth). */
  moves(list: Array<{ id: string; ok: boolean; puff: number }>): void {
    this.sheet.replaceChildren(
      ...list.map((m, i) => {
        const b = button(
          `${i + 1}. ${moveName(m.id)} · ${m.puff}`,
          () => this.h.pickMove(m.id),
          'btn tactics-move',
        );
        b.disabled = !m.ok;
        return b;
      }),
      button(T.cancel, () => this.h.cancel(), 'btn tactics-move tactics-cancel'),
    );
  }

  /** The preview card: per target damage or heal, hit chance and the back/height badges. */
  preview(rows: Array<PreviewRow & { name: string }>, together: boolean): void {
    const lines = rows.map((r) => {
      const line = el('div', 'tactics-card-row');
      const bits = [r.name];
      if (r.dmg) bits.push(T.dmg(r.dmg));
      if (r.heal) bits.push(T.heal(r.heal));
      bits.push(T.hitPct(r.chance));
      line.appendChild(el('span', undefined, bits.join(' · ')));
      const badge = (text: string) => line.appendChild(el('span', 'tactics-badge', text));
      if (r.side === 'back') badge(`🎯 ${T.back}`);
      else if (r.side === 'side') badge(`↔ ${T.side}`);
      if (r.dh > 0) badge(`⛰ ${T.higher}`);
      if (r.dh < 0) badge(`⤵ ${T.lower}`);
      if (r.pile) badge(`✋ ${T.pile}`);
      return line;
    });
    const row = el('div', 'tactics-card-buttons');
    row.append(
      button(T.confirm, () => this.h.confirm(), 'btn tactics-btn tactics-confirm'),
      button(T.cancel, () => this.h.cancel(), 'btn tactics-btn'),
    );
    if (together)
      row.append(button(`🤝 ${T.together}`, () => this.h.together(), 'btn tactics-btn'));
    this.card.replaceChildren(...lines, row);
  }
}
