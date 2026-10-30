import {
  EDU_STICKER_PAGES,
  ownedStickers,
  pageStickers,
  stickerPage,
} from '../config/edu-stickers';
import { STICKER_BOOK_TEXT } from '../config/strings';
import type { Game } from '../game';
import { button, el, modal } from './dom';
import { clipPortrait, sleeperOf } from './edu';
import { speakLine } from './lesson';
import { stickerArt } from './sticker-art';

/**
 * R0685 (KIDS-17): "My Book", the Learning Grove's sticker book. Six big pages of ten places;
 * a sticker the child owns sits in its place, the others are dashed outlines. Big ◀ ▶ buttons
 * and a swipe turn pages; a tap on a sticker says its name. Stickers come in a fixed order
 * (`config/edu-stickers.ts`), so the book is the same for every child.
 */
export class StickerBook {
  private readonly m;
  private page = 0;
  private fresh: string | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.m = modal(parent, STICKER_BOOK_TEXT.title, STICKER_BOOK_TEXT.close);
    this.m.root.classList.add('sticker-book');
    let x0: number | null = null;
    this.m.body.addEventListener('pointerdown', (e) => (x0 = e.clientX));
    this.m.body.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) this.turn(dx < 0 ? 1 : -1);
    });
  }

  /** Open the book, on the page of `fresh` (a sticker just earned, which then glows). */
  open(fresh?: string): void {
    this.fresh = fresh ?? null;
    if (fresh) {
      const at = EDU_STICKER_PAGES.findIndex((p) => p.id === stickerPage(fresh));
      if (at >= 0) this.page = at;
    }
    this.render();
    this.m.show();
    const p = EDU_STICKER_PAGES[this.page]!;
    if (this.game()?.world.edu?.readAloud) speakLine(p.title);
  }

  isOpen(): boolean {
    return this.m.isOpen();
  }

  close(): void {
    this.m.hide();
  }

  private turn(by: number): void {
    const n = EDU_STICKER_PAGES.length;
    this.page = (this.page + by + n) % n;
    this.fresh = null;
    this.render();
    if (this.game()?.world.edu?.readAloud) speakLine(EDU_STICKER_PAGES[this.page]!.title);
  }

  private render(): void {
    const g = this.game();
    const body = this.m.body;
    body.innerHTML = '';
    const owned = new Set(ownedStickers(g?.world.edu?.stickers ?? 0).map((s) => s.id));
    const p = EDU_STICKER_PAGES[this.page]!;
    const head = el('div', 'sticker-head');
    const prev = button('◀', () => this.turn(-1), 'btn sticker-turn');
    prev.setAttribute('aria-label', STICKER_BOOK_TEXT.prev);
    const next = button('▶', () => this.turn(1), 'btn sticker-turn');
    next.setAttribute('aria-label', STICKER_BOOK_TEXT.next);
    const list = pageStickers(p.id);
    const have = list.filter((s) => owned.has(s.id)).length;
    const title = el('div', 'sticker-title');
    title.append(
      el('span', 'sticker-title-icon', p.icon),
      el('strong', undefined, p.title),
      el('small', undefined, STICKER_BOOK_TEXT.count(have, list.length)),
    );
    head.append(prev, title, next);
    body.appendChild(head);
    const grid = el('div', 'sticker-grid');
    const n = g ? sleeperOf(g) : undefined;
    for (const s of list) {
      if (!owned.has(s.id)) {
        const slot = el('div', 'sticker-slot');
        slot.setAttribute('aria-label', STICKER_BOOK_TEXT.empty);
        grid.appendChild(slot);
        continue;
      }
      const b = button('', () => speakLine(s.say), `sticker sticker-${s.shape}`);
      if (s.id === this.fresh) b.classList.add('sticker-fresh');
      b.style.setProperty('--sticker-bg', s.bg);
      b.setAttribute('aria-label', s.say);
      b.appendChild(g && n && s.clip ? clipPortrait(g, n, s.clip, 'sticker-art') : stickerArt(s));
      grid.appendChild(b);
    }
    body.appendChild(grid);
    const dots = el('div', 'sticker-dots');
    EDU_STICKER_PAGES.forEach((_, i) =>
      dots.appendChild(el('span', i === this.page ? 'sticker-dot on' : 'sticker-dot')),
    );
    body.appendChild(dots);
  }
}
