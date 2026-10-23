import { STORY_U4_TEXT, STORY_UI_TEXT } from '../config/strings';
import { CG4_U4 } from '../config/tuning-u4';
import { button, el } from './dom';

/**
 * The keepsake inspector (K12, campaign graphics 4): tap the story item card and the item
 * opens in a small view you turn by dragging, with a one-line description under it. Full 3D
 * hands in a live offscreen render (render3d/dress-u4.ts); the pixel view shows two angle
 * sprites (front, then a narrowed side look, mirrored for the other way) and turns between
 * them by drag or the Turn button. The view exists only while the panel is open. Under
 * reduced motion nothing spins by itself. Render-only: nothing here touches the sim.
 */
export interface InspectHandle {
  dispose(): void;
  /** One step of turn for the button (keyboard and switch users); drag does the rest. */
  turn?(): void;
}

/** Build a view for `kind` inside `host`; null when this renderer has none for it. */
export type InspectSource = (
  kind: string,
  host: HTMLElement,
  reduce: boolean,
) => InspectHandle | null;

let source: InspectSource = pixelInspect;

/** The renderer's live view. Pass null to go back to the pixel angle sprites. */
export function setInspectSource(fn: InspectSource | null): void {
  source = fn ?? pixelInspect;
}

/** The art of an item as the card draws it (set by item-card.ts, which avoids a cycle). */
let artOf: (kind: string) => HTMLCanvasElement | null = () => null;
export function setInspectArt(fn: (kind: string) => HTMLCanvasElement | null): void {
  artOf = fn;
}

/** The pixel renderer's view: the item at its native grid, front and side sprites. */
function pixelInspect(kind: string, host: HTMLElement): InspectHandle | null {
  const art = artOf(kind);
  if (!art) return null;
  const size = CG4_U4.inspect.size;
  const make = (side: boolean, mirror: boolean): HTMLCanvasElement => {
    const c = document.createElement('canvas');
    c.width = art.width;
    c.height = art.height;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    if (!side) {
      ctx.drawImage(art, 0, 0);
      return c;
    }
    const w = Math.max(2, Math.round(art.width * CG4_U4.inspect.sideShare));
    const x = Math.round((art.width - w) / 2);
    ctx.save();
    if (mirror) {
      ctx.translate(art.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(art, x, 0, w, art.height);
    // The far edge falls into shade and the near one catches the light: a turned look.
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(20,10,40,0.26)';
    ctx.fillRect(x + w - Math.max(1, Math.round(w * 0.22)), 0, w, art.height);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(x, 0, 1, art.height);
    ctx.restore();
    return c;
  };
  const angles = [make(false, false), make(true, false), make(true, true)];
  const view = document.createElement('canvas');
  view.width = art.width;
  view.height = art.height;
  view.className = 'inspect-canvas pixel';
  view.style.width = `${size}px`;
  view.style.height = `${Math.round((size * art.height) / art.width)}px`;
  view.setAttribute('role', 'img');
  let at = 0;
  const draw = (): void => {
    const ctx = view.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, view.width, view.height);
    ctx.drawImage(angles[at]!, 0, 0);
  };
  draw();
  host.appendChild(view);
  let last: number | null = null;
  let acc = 0;
  const step = (d: number): void => {
    at = (at + d + angles.length) % angles.length;
    draw();
  };
  const onDown = (e: PointerEvent): void => {
    last = e.clientX;
    acc = 0;
    view.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent): void => {
    if (last === null) return;
    acc += e.clientX - last;
    last = e.clientX;
    if (Math.abs(acc) >= 26) {
      step(acc > 0 ? 1 : -1);
      acc = 0;
    }
  };
  const onUp = (): void => {
    last = null;
  };
  view.addEventListener('pointerdown', onDown);
  view.addEventListener('pointermove', onMove);
  view.addEventListener('pointerup', onUp);
  view.addEventListener('pointercancel', onUp);
  return {
    dispose: () => {
      view.removeEventListener('pointerdown', onDown);
      view.removeEventListener('pointermove', onMove);
      view.removeEventListener('pointerup', onUp);
      view.removeEventListener('pointercancel', onUp);
      view.remove();
    },
    turn: () => step(1),
  };
}

export class ItemInspector {
  readonly root: HTMLDivElement;
  private readonly title: HTMLHeadingElement;
  private readonly host: HTMLDivElement;
  private readonly line: HTMLParagraphElement;
  private handle: InspectHandle | null = null;
  private readonly turnBtn: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'modal inspect');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    const card = el('div', 'modal-card inspect-card');
    this.title = document.createElement('h2');
    this.host = el('div', 'inspect-view');
    this.host.style.width = `${CG4_U4.inspect.size}px`;
    this.host.style.height = `${CG4_U4.inspect.size}px`;
    this.line = el('p', 'inspect-line');
    const hint = el('p', 'help inspect-hint', STORY_U4_TEXT.inspectHint);
    this.turnBtn = button('↻', () => this.handle?.turn?.(), 'btn');
    this.turnBtn.setAttribute('aria-label', STORY_U4_TEXT.inspectHint);
    const close = button(STORY_U4_TEXT.inspectClose, () => this.close(), 'btn btn-primary');
    const row = el('div', 'inspect-row');
    row.append(this.turnBtn, close);
    card.append(this.title, this.host, this.line, hint, row);
    this.root.appendChild(card);
    // A tap on the dimmed backdrop closes; no tap here reaches the dialogue underneath.
    this.root.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target === this.root) this.close();
    });
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.close();
      }
    });
    parent.appendChild(this.root);
  }

  isOpen(): boolean {
    return !this.root.hidden;
  }

  /** Open on `kind`. */
  open(kind: string, reduce: boolean): void {
    this.close();
    const name = STORY_UI_TEXT.items[kind] ?? STORY_U4_TEXT.items[kind] ?? kind;
    this.title.textContent = name;
    this.line.textContent = STORY_U4_TEXT.itemLines[kind] ?? '';
    this.handle = source(kind, this.host, reduce) ?? pixelInspect(kind, this.host);
    this.host.setAttribute('aria-label', STORY_U4_TEXT.inspectAlt(name));
    this.turnBtn.hidden = !this.handle?.turn;
    this.root.hidden = false;
    (this.root.querySelector('.btn-primary') as HTMLElement | null)?.focus();
  }

  close(): void {
    if (this.root.hidden && !this.handle) return;
    this.handle?.dispose();
    this.handle = null;
    this.host.replaceChildren();
    this.root.hidden = true;
  }
}
