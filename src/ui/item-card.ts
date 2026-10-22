import { STORY_U4_TEXT, STORY_UI_TEXT } from '../config/strings';
import { CG2_U } from '../config/tuning-u';
import { el } from './dom';
import { boardItem } from './board-art';
import { pixelItem } from './item-art';
import { ItemInspector, setInspectArt } from './item-inspect';

/**
 * The story item card (M9): a small card above the dialogue box with the thing the text is
 * about. The renderer fills `itemSource`: the pixel view draws the art at 3x, Full 3D
 * renders its prop-kit model once to a cached image. It fades in over 0.2 s, and appears
 * at once under reduced motion. Nothing here runs in the frame loop.
 */
export type ItemSource = (kind: string) => HTMLCanvasElement | null;

let source: ItemSource = pixelItem;

/** The picture for `kind`: the renderer's, else the pixel art, else a drawn board (K29). */
function art(kind: string): HTMLCanvasElement | null {
  return source(kind) ?? pixelItem(kind) ?? boardItem(kind);
}
setInspectArt(art);

/** The renderer's current item source (a later dressing wraps it, K12). */
export function itemSourceNow(): ItemSource {
  return source;
}

/** The renderer's drawing of an item. Pass null to go back to the pixel art. */
export function setItemSource(fn: ItemSource | null): void {
  source = fn ?? pixelItem;
}

export class ItemCard {
  readonly root: HTMLDivElement;
  private readonly picture: HTMLDivElement;
  private readonly label: HTMLDivElement;
  private shown: string | null = null;
  private readonly inspector: ItemInspector;
  private reduce = false;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'item-card');
    this.root.hidden = true;
    this.picture = el('div', 'item-card-picture');
    this.label = el('div', 'item-card-label');
    this.root.append(this.picture, this.label);
    parent.appendChild(this.root);
    // K12: tapping the card opens the inspector. The card sits inside the dialogue box, so
    // the tap is stopped here and does not advance the line.
    this.inspector = new ItemInspector(document.getElementById('app') ?? document.body);
    this.root.setAttribute('role', 'button');
    this.root.tabIndex = 0;
    const open = (e: Event): void => {
      e.stopPropagation();
      if (this.shown) this.inspector.open(this.shown, this.reduce);
    };
    this.root.addEventListener('click', open);
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(e);
      }
    });
  }

  show(kind: string, reduce: boolean): void {
    const art = source(kind) ?? pixelItem(kind) ?? boardItem(kind);
    if (!art) return this.hide();
    this.reduce = reduce;
    const name = STORY_UI_TEXT.items[kind] ?? STORY_U4_TEXT.items[kind] ?? kind;
    this.picture.replaceChildren(art);
    art.className = source === pixelItem || art.width <= CG2_U.card.grid ? 'pixel' : 'smooth';
    const size = art.dataset.px
      ? Math.min(150, Number(art.dataset.px))
      : art.width <= CG2_U.card.grid
        ? art.width * CG2_U.card.scale
        : 96;
    art.style.width = `${size}px`;
    art.style.height = art.dataset.px
      ? `${Math.round((size * art.height) / art.width)}px`
      : `${size}px`;
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', STORY_UI_TEXT.itemAlt(name));
    this.root.setAttribute(
      'aria-label',
      `${STORY_UI_TEXT.itemAlt(name)}. ${STORY_U4_TEXT.inspectTap}`,
    );
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
    this.inspector.close();
    this.root.hidden = true;
  }
}

/** The picture the card would show for `kind` (tests and the sample sheet read it). */
export function drawItem(kind: string): HTMLCanvasElement | null {
  return art(kind);
}
