/**
 * R0312 (FUN-23): a hatch is one card, not three toasts. Every hatch in the same moment joins
 * the card (portrait, name, the shell on its head), the "New in the book" note folds into it
 * as "First Nubbin in your book", and a Pet button gives the first pet. The eggshell hat
 * itself is lane E's (worn for ten minutes, kept in the hat box). The card closes itself.
 */
import { HATCH_CARD_TEXT } from '../config/strings-fun-r5';
import type { Game } from '../game';
import { frameKey } from '../render/sprites/animations';
import type { Nubbin } from '../sim/types';
import { button, el } from './dom';
import { toastBand } from './fun-toasts';
import { speakLine } from './lesson';
import '../fun.css';

const CARD_MS = 9000;
/** A "New in the book" note this soon after a hatch belongs to the card. */
const FOLD_MS = 1500;

export class HatchCard {
  private readonly root: HTMLDivElement;
  private readonly pics: HTMLDivElement;
  private readonly title: HTMLParagraphElement;
  private readonly sub: HTMLParagraphElement;
  private readonly note: HTMLParagraphElement;
  private ids: string[] = [];
  private names: string[] = [];
  private openedAt = -Infinity;
  private timer = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'hatch-card');
    this.root.hidden = true;
    this.root.setAttribute('role', 'status');
    this.pics = el('div', 'hatch-card-pics');
    this.title = el('p', 'hatch-card-title');
    this.sub = el('p', 'hatch-card-sub');
    this.note = el('p', 'hatch-card-note');
    const row = el('div', 'hatch-card-row');
    row.append(
      button(`♥ ${HATCH_CARD_TEXT.pet}`, () => this.pet(), 'btn btn-primary'),
      button(HATCH_CARD_TEXT.close, () => this.close(), 'btn'),
    );
    this.root.append(this.pics, this.title, this.sub, this.note, row);
    parent.append(this.root);
  }

  /** A Nubbin just hatched: open the card, or add it to the one already up. */
  add(n: Nubbin | undefined, name: string): void {
    const g = this.game();
    const now = performance.now();
    if (this.root.hidden) {
      this.ids = [];
      this.names = [];
      this.pics.textContent = '';
      this.note.textContent = '';
    }
    if (n) this.ids.push(n.id);
    this.names.push(name);
    if (g && n) this.pics.append(this.portrait(g, n));
    const sprout = !!g && toastBand(g.world) === 'sprout';
    this.title.textContent = HATCH_CARD_TEXT.hatched(this.names);
    this.sub.textContent = sprout ? HATCH_CARD_TEXT.sprout : HATCH_CARD_TEXT.shell(this.names);
    if (sprout && g?.world.edu?.readAloud)
      speakLine(`${this.title.textContent} ${this.sub.textContent}`);
    this.root.hidden = false;
    this.openedAt = now;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.close(), CARD_MS);
  }

  /** Folds a "New in the book" note into the card when it came with the hatch. */
  foldFirstSeen(key: string): boolean {
    if (this.root.hidden || performance.now() - this.openedAt > FOLD_MS) return false;
    if (key !== 'chao:child') return false;
    this.note.textContent = HATCH_CARD_TEXT.firstInBook;
    return true;
  }

  private pet(): void {
    const g = this.game();
    const id = this.ids[0];
    if (g && id) g.send({ kind: 'pet', nubbinId: id });
    this.close();
  }

  private close(): void {
    window.clearTimeout(this.timer);
    this.root.hidden = true;
  }

  private portrait(g: Game, n: Nubbin): HTMLCanvasElement {
    return nubbinPortrait(g, n, 'hatch-card-pic');
  }
}

/** A Nubbin's idle front frame on a 64 px canvas (as the roster draws it). */
export function nubbinPortrait(g: Game, n: Nubbin, className: string): HTMLCanvasElement {
  const c = el('canvas', className);
  c.width = 64;
  c.height = 64;
  try {
    const sheet = g.view.sheets.forNubbin(n);
    const rect =
      sheet.frames.get(frameKey('idle', 'front', 0)) ?? sheet.frames.values().next().value;
    const ctx = c.getContext('2d');
    if (ctx && rect) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        sheet.texture.image as HTMLCanvasElement,
        rect.x,
        rect.y,
        rect.w,
        rect.h,
        0,
        0,
        64,
        64,
      );
    }
  } catch {
    // A portrait is a nicety; the card still names the newborn.
  }
  return c;
}
