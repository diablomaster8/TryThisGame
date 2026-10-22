import { CG2_U } from '../config/tuning-u';
import { STORY_UI_TEXT } from '../config/strings';
import { el } from './dom';

/**
 * The chapter postcard (N1): two letterbox bars while a chapter's opening holds on its
 * first frame, with the chapter's title card (ui/title-card.ts) between them. Tapping
 * skips the hold. Under reduced motion the bars are simply there and then gone.
 */
export class Postcard {
  readonly root: HTMLDivElement;
  private readonly top: HTMLDivElement;
  private readonly bottom: HTMLDivElement;
  private readonly hint: HTMLDivElement;
  private timer = 0;
  private active = false;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'postcard');
    this.root.hidden = true;
    this.root.setAttribute('aria-hidden', 'true');
    this.top = el('div', 'postcard-bar postcard-top');
    this.bottom = el('div', 'postcard-bar postcard-bottom');
    this.hint = el('div', 'postcard-hint', STORY_UI_TEXT.skipHint);
    this.bottom.appendChild(this.hint);
    this.root.append(this.top, this.bottom);
    parent.appendChild(this.root);
  }

  get isActive(): boolean {
    return this.active;
  }

  /** Show the bars for `seconds`, then call `done` (also on a skip). */
  begin(seconds: number, reduce: boolean, done: () => void): void {
    this.end();
    this.active = true;
    const share = `${CG2_U.postcard.barShare * 100}%`;
    for (const bar of [this.top, this.bottom]) {
      bar.style.height = share;
      bar.style.transition = 'none';
    }
    this.top.style.transform = reduce ? 'none' : 'translateY(-100%)';
    this.bottom.style.transform = reduce ? 'none' : 'translateY(100%)';
    this.root.hidden = false;
    if (!reduce)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!this.active) return;
          for (const bar of [this.top, this.bottom])
            bar.style.transition = `transform ${CG2_U.postcard.barSlideS}s ease`;
          this.top.style.transform = 'none';
          this.bottom.style.transform = 'none';
        }),
      );
    this.timer = window.setTimeout(() => {
      this.end();
      done();
    }, seconds * 1000);
  }

  /** Take the bars away at once (a skip, a dropped scene). */
  end(): void {
    window.clearTimeout(this.timer);
    this.active = false;
    this.root.hidden = true;
  }
}
