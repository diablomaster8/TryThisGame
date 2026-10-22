import { STORY_UI_TEXT } from '../config/strings';
import { CG2_U } from '../config/tuning-u';
import { button, el } from './dom';

/**
 * Chapter photos (N6). When a chapter's closing scene ends, the story UI copies one frame
 * of the staged view (cast and props as the scene stood) and offers it as a keepsake. The
 * photo panel (ui/photo.ts) shows it in its frame. Render-only: nothing here touches the sim.
 */
export interface ChapterShot {
  canvas: HTMLCanvasElement;
  chapter: number;
  title: string;
  campaign: string;
}

/** Fired on `window` when the player takes the offer; the photo panel opens on it. */
export const CHAPTER_PHOTO_EVENT = 'grove:chapter-photo';

let last: ChapterShot | null = null;

export const chapterShot = {
  get: (): ChapterShot | null => last,
  set: (s: ChapterShot | null): void => {
    last = s;
  },
};

/** The small card that offers the photo, once nothing else is open over the Grove. */
export class ChapterOffer {
  readonly root: HTMLDivElement;
  private pending: ChapterShot | null = null;
  private poll = 0;
  private hideTimer = 0;
  private readonly thumb: HTMLDivElement;
  private readonly title: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly busy: () => boolean,
    private readonly reduce: () => boolean,
    /** K30: the player's answer, so the offer is not made again after a reload. */
    private readonly onState?: (state: 'taken' | 'declined') => void,
  ) {
    this.root = el('div', 'chapter-offer');
    this.root.hidden = true;
    this.root.setAttribute('role', 'status');
    this.thumb = el('div', 'chapter-offer-thumb');
    this.title = el('div', 'chapter-offer-title');
    const text = el('div', 'chapter-offer-text', STORY_UI_TEXT.offerText);
    const yes = button(
      `📷 ${STORY_UI_TEXT.offerYes}`,
      () => {
        this.hide();
        this.onState?.('taken');
        window.dispatchEvent(new CustomEvent(CHAPTER_PHOTO_EVENT));
      },
      'btn btn-primary',
    );
    const no = button(
      STORY_UI_TEXT.offerNo,
      () => {
        this.hide();
        this.onState?.('declined');
      },
      'btn',
    );
    const body = el('div', 'chapter-offer-body');
    const row = el('div', 'chapter-offer-row');
    row.append(yes, no);
    body.append(this.title, text, row);
    this.root.append(this.thumb, body);
    parent.appendChild(this.root);
  }

  /** Queue the offer; it shows when no scene or panel is open. A newer shot replaces it. */
  offer(shot: ChapterShot): void {
    this.hide();
    this.pending = shot;
    window.clearInterval(this.poll);
    this.poll = window.setInterval(() => this.tryShow(), 500);
  }

  private tryShow(): void {
    const shot = this.pending;
    if (!shot || this.busy()) return;
    window.clearInterval(this.poll);
    this.pending = null;
    const thumb = document.createElement('canvas');
    thumb.width = 96;
    thumb.height = Math.round((96 * shot.canvas.height) / shot.canvas.width);
    thumb.getContext('2d')?.drawImage(shot.canvas, 0, 0, thumb.width, thumb.height);
    this.thumb.replaceChildren(thumb);
    this.title.textContent = STORY_UI_TEXT.offerTitle(shot.chapter, shot.title);
    this.root.style.opacity = '1';
    this.root.hidden = false;
    if (!this.reduce()) {
      this.root.style.opacity = '0';
      this.root.style.transition = 'none';
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          this.root.style.transition = 'opacity 0.3s ease';
          this.root.style.opacity = '1';
        }),
      );
    }
    this.hideTimer = window.setTimeout(() => {
      this.hide();
      this.onState?.('declined');
    }, CG2_U.photo.offerS * 1000);
  }

  hide(): void {
    window.clearInterval(this.poll);
    window.clearTimeout(this.hideTimer);
    this.pending = null;
    this.root.hidden = true;
  }
}
