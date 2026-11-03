import { SHELF_TEXT as T, PHOTO3D_TEXT as P } from '../config/strings-photo3d';
import { NAMES } from '../config/strings';
import type { Game } from '../game';
import { reducedMotion } from '../platform/motion';
import { frameKey } from '../render/sprites/animations';
import { DRAWN_ANGLES } from '../render/sprites/angles';
import type { SpriteSheet } from '../render/sprites/atlas';
import type { Nubbin, World } from '../sim/types';
import { button, el, modal } from './dom';
import { goldenUnlocked, savePhotoPng } from './photo-3d';
import {
  drawFrame,
  filterPixels,
  PHOTO_FILTERS,
  PHOTO_FRAMES,
  pixelate,
  type PhotoFilter,
  type PhotoFrame,
} from './photo-look';

/**
 * R0440 (LOOK-72): the collection book's Shelf: three shelves of eight slots, where any seen
 * form or owned Nubbin stands as a figure. Drag a figure from the tray onto a slot (or tap
 * the figure, then the slot), tap a placed one to spin it, and photograph the whole shelf
 * with a frame and a filter. In Full 3D each figure is the 3D turntable render (R0411); in
 * Pixel, the sprite. The arrangement is a display preference of this Grove, kept in local
 * storage by the save's seed (like the photo album, outside the save), so nothing in the sim
 * changes; it survives reloads and is simply empty where storage is blocked.
 */
export const SHELF = { rows: 3, slots: 8, slotPx: 56, figurePx: 64 } as const;

/** One placed figure: a book key (`chao:sun:run`...) or an owned Nubbin (`nubbin:<id>`). */
export type ShelfSlot = string | null;

const storeKey = (w: Pick<World, 'seed'>) => `grove.shelf.${w.seed}`;

export function readShelf(w: Pick<World, 'seed'>): ShelfSlot[] {
  const n = SHELF.rows * SHELF.slots;
  try {
    const raw = localStorage.getItem(storeKey(w));
    const list = raw ? (JSON.parse(raw) as unknown) : null;
    if (Array.isArray(list))
      return Array.from({ length: n }, (_, i) =>
        typeof list[i] === 'string' ? (list[i] as string) : null,
      );
  } catch {
    // Blocked or broken storage: an empty shelf.
  }
  return Array.from({ length: n }, () => null);
}

export function writeShelf(w: Pick<World, 'seed'>, slots: ShelfSlot[]): void {
  try {
    localStorage.setItem(storeKey(w), JSON.stringify(slots));
  } catch {
    // Storage unavailable: the shelf lasts this session only.
  }
}

/** Place `item` in `slot`; a figure already there swaps to where `item` came from (or off). */
export function placeOnShelf(
  slots: ShelfSlot[],
  item: string,
  slot: number,
  from: number | null,
): ShelfSlot[] {
  const out = [...slots];
  const was = out[slot] ?? null;
  out[slot] = item;
  if (from !== null && from !== slot) out[from] = was;
  return out;
}

interface Hooks {
  game: () => Game | null;
  /** The book's stand-in Nubbin for a key. */
  forKey: (key: string) => Nubbin;
  /** The book's sheet cache. */
  sheet: (n: Nubbin) => SpriteSheet | null;
  label: (key: string) => string;
}

export class BookShelf {
  private slots: ShelfSlot[] = [];
  private picked: { item: string; from: number | null } | null = null;
  private readonly photo: ShelfPhoto;
  private spinning = new Set<number>();
  private root: HTMLElement | null = null;

  constructor(
    parent: HTMLElement,
    private readonly hooks: Hooks,
  ) {
    this.photo = new ShelfPhoto(parent, hooks.game);
  }

  /** The Nubbin a shelf item shows: an owned one as it is now, or a book key's stand-in. */
  private figure(item: string, world: World): Nubbin | null {
    if (item.startsWith('nubbin:')) {
      return world.nubbins.find((n) => n.id === item.slice('nubbin:'.length)) ?? null;
    }
    return this.hooks.forKey(item);
  }

  private label(item: string, world: World): string {
    if (item.startsWith('nubbin:')) return this.figure(item, world)?.name ?? '';
    return this.hooks.label(item);
  }

  /** Draw a figure into `c`: the 3D strip's frame when there is one, else the sprite. */
  private paint(c: HTMLCanvasElement, item: string, world: World, angle = 0): void {
    const n = this.figure(item, world);
    const ctx = c.getContext('2d');
    if (!n || !ctx) return;
    const s3 = this.hooks.game()?.scene3d;
    const sprite = () => {
      const sheet = this.hooks.sheet(n);
      const turn = [...DRAWN_ANGLES, ...DRAWN_ANGLES.slice(1, -1).reverse()];
      const a = turn[angle % turn.length]!;
      const rect = sheet?.frames.get(frameKey('idle', a, 0));
      if (!sheet || !rect) return;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.imageSmoothingEnabled = false;
      ctx.save();
      if (angle % turn.length >= DRAWN_ANGLES.length) {
        ctx.translate(c.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(
        sheet.texture.image as HTMLCanvasElement,
        rect.x,
        rect.y,
        rect.w,
        rect.h,
        0,
        0,
        c.width,
        c.height,
      );
      ctx.restore();
    };
    if (!s3) {
      sprite();
      return;
    }
    sprite();
    void s3.turntable(n).then((strip) => {
      if (!strip || !c.isConnected) return;
      const frames = strip.width / strip.height;
      const px = strip.height;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(strip, (angle % frames) * px, 0, px, px, 0, 0, c.width, c.height);
      c.style.imageRendering = 'auto';
    });
  }

  /** Lay the shelf out in `into` (the book's page area). */
  render(into: HTMLElement, world: World): void {
    this.root = into;
    this.slots = readShelf(world);
    into.textContent = '';
    const filled = this.slots.filter(Boolean).length;
    into.append(
      el('p', 'help', T.help),
      el('p', 'help', T.count(filled, this.slots.length)),
      button(T.photo, () => this.photo.open(this.drawShelf()), 'btn'),
    );
    const shelves = el('div', 'shelf');
    for (let r = 0; r < SHELF.rows; r++) {
      const row = el('div', 'shelf-row');
      row.setAttribute('aria-label', T.shelfRow(r));
      for (let s = 0; s < SHELF.slots; s++) {
        const i = r * SHELF.slots + s;
        const item = this.slots[i] ?? null;
        const slot = el(
          'button',
          `shelf-slot${item ? ' filled' : ''}${this.picked?.from === i ? ' picked' : ''}`,
        );
        slot.type = 'button';
        slot.dataset['slot'] = String(i);
        slot.setAttribute('aria-label', item ? this.label(item, world) : T.empty);
        if (item) {
          const c = document.createElement('canvas');
          c.width = c.height = SHELF.figurePx;
          this.paint(c, item, world);
          slot.appendChild(c);
          this.dragSource(slot, item, i, world);
        }
        slot.addEventListener('click', () => this.tapSlot(i, world));
        row.appendChild(slot);
      }
      shelves.appendChild(row);
    }
    into.appendChild(shelves);
    // The tray: owned Nubbins first, then every seen form.
    const owned = world.nubbins.filter((n) => n.stage !== 'egg').map((n) => `nubbin:${n.id}`);
    const seen = Object.keys(world.seen).filter((k) => !k.startsWith('nubbin:'));
    into.appendChild(el('h3', undefined, T.tray));
    if (!owned.length && !seen.length) into.appendChild(el('p', 'help', T.none));
    for (const [title, list] of [
      [T.owned, owned],
      [T.seen, seen],
    ] as const) {
      if (!list.length) continue;
      into.appendChild(el('div', 'btn-name', title));
      const tray = el('div', 'shelf-tray');
      for (const item of list) {
        const b = el('button', `shelf-item${this.picked?.item === item ? ' picked' : ''}`);
        b.type = 'button';
        b.title = this.label(item, world);
        b.setAttribute('aria-label', b.title);
        const c = document.createElement('canvas');
        c.width = c.height = 48;
        // Thumbnails stay sprites (cheap); the shelf shows the renderer's figure.
        const n = this.figure(item, world);
        const sheet = n ? this.hooks.sheet(n) : null;
        const rect = sheet?.frames.get(frameKey('idle', 'front', 0));
        const ctx = c.getContext('2d');
        if (ctx && sheet && rect) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            sheet.texture.image as HTMLCanvasElement,
            rect.x,
            rect.y,
            rect.w,
            rect.h,
            0,
            0,
            48,
            48,
          );
        }
        b.append(c, el('span', undefined, b.title));
        b.addEventListener('click', () => {
          this.picked = this.picked?.item === item ? null : { item, from: null };
          this.render(into, world);
        });
        this.dragSource(b, item, null, world);
        tray.appendChild(b);
      }
      into.appendChild(tray);
    }
    if (this.picked?.from !== null && this.picked)
      into.appendChild(button(T.remove, () => this.removePicked(world), 'btn btn-small'));
  }

  private removePicked(world: World): void {
    if (this.picked?.from == null) return;
    this.slots[this.picked.from] = null;
    writeShelf(world, this.slots);
    this.picked = null;
    if (this.root) this.render(this.root, world);
  }

  private tapSlot(i: number, world: World): void {
    const item = this.slots[i] ?? null;
    if (this.picked) {
      if (this.picked.from === i) {
        // Tapping the picked figure again puts it down and spins it.
        this.picked = null;
        if (this.root) this.render(this.root, world);
        this.spin(i, world);
        return;
      }
      this.slots = placeOnShelf(this.slots, this.picked.item, i, this.picked.from);
      writeShelf(world, this.slots);
      this.picked = null;
      if (this.root) this.render(this.root, world);
      return;
    }
    if (item) {
      // A tap spins it; it also picks it up, to move or take off.
      this.picked = { item, from: i };
      if (this.root) this.render(this.root, world);
      this.spin(i, world);
    }
  }

  /** One turn of a placed figure, through the angles (still under reduced motion). */
  private spin(i: number, world: World): void {
    const item = this.slots[i];
    if (!item || this.spinning.has(i) || reducedMotion()) return;
    const c = this.root?.querySelector<HTMLCanvasElement>(`[data-slot="${i}"] canvas`);
    if (!c) return;
    this.spinning.add(i);
    let a = 0;
    const steps = 8;
    const t = window.setInterval(() => {
      a++;
      this.paint(c, item, world, a);
      if (a >= steps) {
        window.clearInterval(t);
        this.spinning.delete(i);
        this.paint(c, item, world, 0);
      }
    }, 140);
  }

  /** Pointer drag: a ghost follows the finger; let go over a slot to place it there. */
  private dragSource(node: HTMLElement, item: string, from: number | null, world: World): void {
    node.addEventListener('pointerdown', (e) => {
      const sx = e.clientX;
      const sy = e.clientY;
      let ghost: HTMLElement | null = null;
      const move = (m: PointerEvent) => {
        if (!ghost && Math.hypot(m.clientX - sx, m.clientY - sy) > 10) {
          ghost = el('div', 'shelf-ghost');
          const src = node.querySelector('canvas');
          if (src) {
            const c = document.createElement('canvas');
            c.width = c.height = 48;
            c.getContext('2d')?.drawImage(src, 0, 0, 48, 48);
            ghost.appendChild(c);
          }
          document.body.appendChild(ghost);
        }
        if (ghost) {
          ghost.style.left = `${m.clientX - 24}px`;
          ghost.style.top = `${m.clientY - 24}px`;
        }
      };
      const up = (u: PointerEvent) => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        if (!ghost) return;
        ghost.remove();
        const over = document
          .elementFromPoint(u.clientX, u.clientY)
          ?.closest<HTMLElement>('[data-slot]');
        if (!over) return;
        // A drag is not a tap: swallow the click the release would send.
        node.addEventListener('click', (c) => c.stopImmediatePropagation(), {
          once: true,
          capture: true,
        });
        const slot = Number(over.dataset['slot']);
        this.slots = placeOnShelf(this.slots, item, slot, from);
        writeShelf(world, this.slots);
        this.picked = null;
        if (this.root) this.render(this.root, world);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });
  }

  /** The whole shelf as one picture: wood, three planks, the figures standing on them. */
  private drawShelf(): HTMLCanvasElement {
    const fig = 96;
    const pad = 24;
    const w = SHELF.slots * fig + pad * 2;
    const rowH = fig + 28;
    const h = SHELF.rows * rowH + pad * 2;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (!ctx) return c;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#5b3a22');
    g.addColorStop(1, '#3f2716');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2e1c10';
    ctx.fillRect(pad / 2, pad / 2, w - pad, h - pad);
    for (let r = 0; r < SHELF.rows; r++) {
      const y = pad + r * rowH;
      ctx.fillStyle = '#ead9b8';
      ctx.fillRect(pad, y, w - pad * 2, fig + 6);
      ctx.fillStyle = '#9b6a3c';
      ctx.fillRect(pad - 6, y + fig + 6, w - pad * 2 + 12, 14);
      ctx.fillStyle = '#7a4f2b';
      ctx.fillRect(pad - 6, y + fig + 18, w - pad * 2 + 12, 4);
      for (let s = 0; s < SHELF.slots; s++) {
        const slot = this.root?.querySelector<HTMLCanvasElement>(
          `[data-slot="${r * SHELF.slots + s}"] canvas`,
        );
        if (slot) {
          ctx.imageSmoothingEnabled = slot.style.imageRendering === 'auto';
          ctx.drawImage(slot, pad + s * fig, y + 6, fig, fig);
        }
      }
    }
    return c;
  }
}

/** The shelf's photo: frames (the golden one once a book tab is done), filters, a PNG. */
class ShelfPhoto {
  private readonly dialog;
  private readonly view: HTMLCanvasElement;
  private base: HTMLCanvasElement | null = null;
  private frame: PhotoFrame = 'wood';
  private filter: PhotoFilter = 'none';
  private readonly frameSel: HTMLSelectElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, P.title, P.close);
    this.view = el('canvas', 'photo-canvas');
    this.view.style.width = '100%';
    this.view.style.height = 'auto';
    this.frameSel = el('select');
    this.frameSel.className = 'btn';
    this.frameSel.setAttribute('aria-label', P.frame);
    for (const f of PHOTO_FRAMES) {
      const o = el('option', undefined, `${P.frame}: ${P.frames[f] ?? f}`);
      o.value = f;
      this.frameSel.appendChild(o);
    }
    this.frameSel.addEventListener('change', () => {
      this.frame = this.frameSel.value as PhotoFrame;
      this.draw();
    });
    const filterSel = el('select');
    filterSel.className = 'btn';
    filterSel.setAttribute('aria-label', P.filter);
    for (const f of PHOTO_FILTERS) {
      const o = el('option', undefined, `${P.filter}: ${P.filters[f] ?? f}`);
      o.value = f;
      filterSel.appendChild(o);
    }
    filterSel.addEventListener('change', () => {
      this.filter = filterSel.value as PhotoFilter;
      this.draw();
    });
    const row = el('div', 'photo-stickers');
    row.append(this.frameSel, filterSel);
    this.dialog.body.append(
      this.view,
      row,
      button(P.save, () => this.save(), 'btn btn-primary'),
    );
  }

  open(base: HTMLCanvasElement): void {
    this.base = base;
    const golden = this.frameSel.querySelector<HTMLOptionElement>('option[value="golden"]');
    if (golden) golden.disabled = !goldenUnlocked(this.game());
    if (golden?.disabled && this.frame === 'golden') this.frame = 'wood';
    this.frameSel.value = this.frame;
    this.draw();
    this.dialog.show();
  }

  private draw(): void {
    const b = this.base;
    if (!b) return;
    const c = this.view;
    c.width = b.width;
    c.height = b.height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(b, 0, 0);
    if (this.filter === 'pixelate') pixelate(c, 4);
    else if (this.filter !== 'none') {
      const img = ctx.getImageData(0, 0, c.width, c.height);
      filterPixels(img.data, this.filter, 7);
      ctx.putImageData(img, 0, 0);
    }
    drawFrame(ctx, this.frame, c.width, c.height);
  }

  private save(): void {
    savePhotoPng(this.view, [], `${NAMES.garden} · ${T.tab}`);
  }
}
