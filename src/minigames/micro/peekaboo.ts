/**
 * R0321 (FUN-32): "Where's Kiki?" for the youngest players. The child's own Nubbin hides
 * behind one of 3–5 big spots with its crown poking out over the top; a wrong spot shows a
 * silly decoy (a frog, a sock, Fern's stone saying "Not me!"), the right one a "Boo!" with
 * a giggle. Every line is read aloud when read-aloud is on. Nothing in the Grove changes.
 */
import { PEEKABOO_TEXT } from '../../config/strings-fun-r5';
import type { Game } from '../../game';
import { playSound } from '../../platform/audio';
import type { Nubbin } from '../../sim/types';
import { button, dialogFocus, el } from '../../ui/dom';
import { nubbinPortrait } from '../../ui/hatch-card';
import { speakLine } from '../../ui/lesson';
import { PEEK_ICONS, peekRound } from './peekaboo-round';
import '../../fun.css';

export class Peekaboo {
  private readonly root: HTMLDivElement;
  private readonly card: HTMLDivElement;
  private readonly title: HTMLHeadingElement;
  private readonly field: HTMLDivElement;
  private readonly line: HTMLParagraphElement;
  private readonly row: HTMLDivElement;
  private readonly focus: ReturnType<typeof dialogFocus>;
  private round = 0;
  private seed = 1;
  private nubbin: Nubbin | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'modal peekaboo');
    this.root.hidden = true;
    this.card = el('div', 'modal-card peekaboo-card');
    this.title = el('h2');
    this.field = el('div', 'peek-field');
    this.line = el('p', 'peek-line');
    this.line.setAttribute('aria-live', 'polite');
    this.row = el('div', 'peek-row');
    this.card.append(this.title, this.field, this.line, this.row);
    this.root.append(this.card);
    this.focus = dialogFocus(this.root, this.card, this.title, () => this.close());
    parent.append(this.root);
  }

  /** The child's Nubbin to hide (the youngest one out of the egg). */
  static pickNubbin(g: Game): Nubbin | null {
    return g.world.nubbins.find((n) => n.stage === 'child' || n.stage === 'adult') ?? null;
  }

  open(): void {
    const g = this.game();
    const n = g ? Peekaboo.pickNubbin(g) : null;
    if (!g || !n) return;
    this.nubbin = n;
    this.round = 0;
    this.seed = Math.floor(performance.now()) % 100_000;
    this.title.textContent = PEEKABOO_TEXT.pick(n.name);
    this.root.hidden = false;
    this.focus.opened();
    this.deal();
  }

  close(): void {
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.focus.closed();
  }

  private say(text: string): void {
    this.line.textContent = text;
    if (this.game()?.world.edu?.readAloud) speakLine(text);
  }

  private deal(): void {
    const g = this.game();
    const n = this.nubbin;
    if (!g || !n) return;
    const r = peekRound(this.seed, this.round);
    this.field.textContent = '';
    this.row.textContent = '';
    const name = n.name;
    // The question names the first spot, which may or may not be the right one.
    const firstSpot = PEEKABOO_TEXT.spots[r.spots[0]!] ?? '';
    this.say(PEEKABOO_TEXT.ask(name, firstSpot));
    r.spots.forEach((spot, i) => {
      const cell = el('div', 'peek-cell');
      const hides = i === r.hidden;
      const peek = hides ? nubbinPortrait(g, n, 'peek-nubbin') : null;
      const b = button('', () => undefined, 'btn peek-spot');
      b.setAttribute('aria-label', PEEKABOO_TEXT.spots[spot] ?? spot);
      b.append(el('span', 'peek-icon', PEEK_ICONS[spot] ?? '❓'));
      b.addEventListener('click', () => {
        if (b.classList.contains('peek-open')) return;
        b.classList.add('peek-open');
        if (hides) {
          cell.classList.add('peek-found');
          playSound('giggle');
          this.say(PEEKABOO_TEXT.found(name));
          this.row.textContent = '';
          this.row.append(
            button(
              PEEKABOO_TEXT.again,
              () => {
                this.round += 1;
                this.deal();
              },
              'btn btn-primary peek-again',
            ),
            button(PEEKABOO_TEXT.done, () => this.close(), 'btn'),
          );
          return;
        }
        const decoy = r.decoys[i]!;
        cell.append(el('span', 'peek-decoy', PEEK_ICONS[decoy] ?? '❓'));
        playSound(decoy === 'frog' ? 'boing' : decoy === 'stone' ? 'raspberry' : 'pop');
        this.say(PEEKABOO_TEXT.decoys[decoy] ?? '');
      });
      if (peek) cell.append(peek);
      cell.append(b);
      this.field.append(cell);
    });
  }
}
