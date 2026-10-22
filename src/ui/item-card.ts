import { STORY_UI_TEXT } from '../config/strings';
import { CG2_U } from '../config/tuning-u';
import { el } from './dom';
import { pixelItem } from './item-art';

/**
 * The story item card (M9): a small card above the dialogue box with the thing the text is
 * about. The renderer fills `itemSource`: the pixel view draws the art at 3x, Full 3D
 * renders its prop-kit model once to a cached image. It fades in over 0.2 s, and appears
 * at once under reduced motion. Nothing here runs in the frame loop.
 */
export type ItemSource = (kind: string) => HTMLCanvasElement | null;

let source: ItemSource = pixelItem;

/** The renderer's drawing of an item. Pass null to go back to the pixel art. */
export function setItemSource(fn: ItemSource | null): void {
  source = fn ?? pixelItem;
}

export class ItemCard {
  readonly root: HTMLDivElement;
  private readonly picture: HTMLDivElement;
  private readonly label: HTMLDivElement;
  private shown: string | null = null;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'item-card');
    this.root.hidden = true;
    this.picture = el('div', 'item-card-picture');
    this.label = el('div', 'item-card-label');
    this.root.append(this.picture, this.label);
    parent.appendChild(this.root);
  }

  show(kind: string, reduce: boolean): void {
    const art = source(kind) ?? pixelItem(kind);
    if (!art) return this.hide();
    const name = STORY_UI_TEXT.items[kind] ?? kind;
    this.picture.replaceChildren(art);
    art.className = source === pixelItem || art.width <= CG2_U.card.grid ? 'pixel' : 'smooth';
    const size = art.width <= CG2_U.card.grid ? art.width * CG2_U.card.scale : 96;
    art.style.width = `${size}px`;
    art.style.height = `${size}px`;
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', STORY_UI_TEXT.itemAlt(name));
    this.label.textContent = name;
    this.shown = kind;
    this.root.style.transition = 'none';
    this.root.style.opacity = reduce ? '1' : '0';
    this.root.hidden = false;
    if (reduce) return;
    // Two frames, so the browser has seen opacity 0 before it fades to 1.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (this.shown !== kind) return;
        this.root.style.transition = `opacity ${CG2_U.card.fadeS}s ease`;
        this.root.style.opacity = '1';
      }),
    );
  }

  hide(): void {
    this.shown = null;
    this.root.hidden = true;
  }
}

/** The picture the card would show for `kind` (tests and the sample sheet read it). */
export function drawItem(kind: string): HTMLCanvasElement | null {
  return source(kind) ?? pixelItem(kind);
}
