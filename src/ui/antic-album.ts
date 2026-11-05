/**
 * R0564 and R0588 (lane A round 11): the Antics album (a page per behaviour, stamped the
 * first time the Keeper sees it) and the Fridge (the doodles the drawing lessons made). Also
 * reports to the sim which Nubbin is in view and doing something worth a stamp. Reads the sim;
 * its only command is `sawAntic`.
 */
import { ALBUM_TEXT } from '../config/strings-soul-r11b';
import type { Game } from '../game';
import { buildPerformSheet, doodleKey, PERFORM_CELL } from '../render/sprites/perform-art';
import { ALBUM_IDS, isAlbumId, stampCount } from '../sim/antic-album';
import { el, modal } from './dom';

export class AnticAlbum {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  /** Ids already reported this session, so the sim is told once. */
  private readonly told = new Set<string>();

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    close: string,
  ) {
    this.dialog = modal(parent, ALBUM_TEXT.title, close);
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** Tell the sim a Nubbin in view is doing an album behaviour (a no-op once stamped). */
  report(nubbinId: string, itemId: string | null): void {
    const g = this.game();
    if (!g || !isAlbumId(itemId) || this.told.has(itemId!) || g.world.album?.[itemId!]) return;
    this.told.add(itemId!);
    g.send({ kind: 'sawAntic', nubbinId });
  }

  refresh(): void {
    const g = this.game();
    this.body.innerHTML = '';
    if (!g) return;
    const w = g.world;
    this.body.appendChild(el('p', 'help', ALBUM_TEXT.help));
    this.body.appendChild(el('div', 'btn-name', ALBUM_TEXT.count(stampCount(w), ALBUM_IDS.length)));
    const grid = el('div', 'shop-list');
    for (const id of ALBUM_IDS) {
      const seen = w.album?.[id] !== undefined;
      const row = el('div', 'shop-row');
      const label = el('strong', undefined, seen ? (ALBUM_TEXT.names[id] ?? id) : '?');
      const note = el('small', undefined, seen ? '\u2605' : ALBUM_TEXT.unseen);
      const text = el('div');
      text.append(label, note);
      row.appendChild(text);
      grid.appendChild(row);
    }
    this.body.appendChild(grid);

    this.body.appendChild(el('div', 'sheet-give-title', ALBUM_TEXT.fridgeTitle));
    const fridge = w.fridge ?? [];
    if (fridge.length === 0) {
      this.body.appendChild(el('p', 'help', ALBUM_TEXT.fridgeEmpty));
      return;
    }
    const sheet = buildPerformSheet();
    const wall = el('div');
    wall.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';
    for (const d of [...fridge].reverse()) {
      const rect = sheet.frames.get(doodleKey(d.doodleId));
      const c = el('canvas');
      c.width = 64;
      c.height = 64;
      c.style.cssText =
        'width:64px;height:64px;background:#fffbea;border-radius:4px;image-rendering:pixelated';
      const by = w.nubbins.find((n) => n.id === d.nubbinId)?.name ?? '';
      c.title = ALBUM_TEXT.fridgeBy(by);
      c.setAttribute('role', 'img');
      c.setAttribute('aria-label', ALBUM_TEXT.fridgeBy(by));
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
      wall.appendChild(c);
    }
    void PERFORM_CELL;
    this.body.appendChild(wall);
  }
}
