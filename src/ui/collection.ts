import { formatDuration, NAMES, SPECIES_LABELS, TYPE_LABELS, UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { frameKey } from '../render/sprites/animations';
import type { SpriteSheet } from '../render/sprites/atlas';
import {
  adultColors,
  buildChaoSheet,
  CHILD_NEUTRAL,
  eternalColors,
  lookOf,
} from '../render/sprites/chao';
import { buildCreatureSheet } from '../render/sprites/creature';
import { speciesArt } from '../render/sprites/species-art';
import { allKeys } from '../sim/collection';
import type { Memorial } from '../sim/types';
import { button, el, modal } from './dom';

/** Label for a collection key. */
export function keyLabel(key: string): string {
  if (!key.startsWith('chao:')) return SPECIES_LABELS[key] ?? key;
  const parts = key.split(':');
  if (parts[1] === 'child') return `${NAMES.creature} (child)`;
  if (parts[1] === 'eternal') {
    const band =
      parts[2] === 'sun'
        ? NAMES.alignmentSun
        : parts[2] === 'moon'
          ? NAMES.alignmentMoon
          : NAMES.alignmentNeutral;
    return `${NAMES.eternal} ${band}`;
  }
  const band =
    parts[1] === 'sun'
      ? NAMES.alignmentSun
      : parts[1] === 'moon'
        ? NAMES.alignmentMoon
        : NAMES.alignmentNeutral;
  return `${band} ${TYPE_LABELS[parts[2] as keyof typeof TYPE_LABELS] ?? parts[2]}`;
}

/** The collection book: a page of every species and Chao form, seen or still unknown. */
export class CollectionBook {
  private readonly dialog;
  private readonly grid: HTMLDivElement;
  private readonly summary: HTMLParagraphElement;
  private readonly sheets = new Map<string, SpriteSheet>();

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.collection, UI_TEXT.close);
    this.summary = el('p', 'help');
    this.grid = el('div', 'book-grid');
    this.dialog.body.append(this.summary, this.grid);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private sheetFor(key: string): SpriteSheet | null {
    const cached = this.sheets.get(key);
    if (cached) return cached;
    let sheet: SpriteSheet | null = null;
    if (key.startsWith('chao:')) {
      const parts = key.split(':');
      if (parts[1] === 'child') sheet = buildChaoSheet(lookOf(CHILD_NEUTRAL));
      else if (parts[1] === 'eternal') {
        sheet = buildChaoSheet(
          lookOf(
            eternalColors(parts[2] as 'sun' | 'moon' | 'neutral'),
            'normal',
            null,
            undefined,
            true,
          ),
        );
      } else {
        const type = parts[2] as 'normal' | 'swim' | 'fly' | 'run' | 'power';
        sheet = buildChaoSheet(
          lookOf(adultColors(parts[1] as 'sun' | 'moon' | 'neutral', type), type),
        );
      }
    } else {
      const art = speciesArt(key);
      if (art) sheet = buildCreatureSheet(art);
    }
    if (sheet) this.sheets.set(key, sheet);
    return sheet;
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    const keys = allKeys();
    const seen = keys.filter((k) => g.world.seen[k] !== undefined).length;
    this.summary.textContent = UI_TEXT.collectionHelp(seen, keys.length);
    this.grid.innerHTML = '';
    for (const key of keys) {
      const known = g.world.seen[key] !== undefined;
      const cell = el('div', `book-cell${known ? '' : ' unknown'}`);
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const sheet = this.sheetFor(key);
      const rect = sheet?.frames.get(frameKey('idle', 'front', 0));
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
          64,
          64,
        );
        if (!known) {
          ctx.globalCompositeOperation = 'source-in';
          ctx.fillStyle = '#2a2540';
          ctx.fillRect(0, 0, 64, 64);
        }
      }
      cell.append(c, el('div', 'book-label', known ? keyLabel(key) : UI_TEXT.unknown));
      this.grid.appendChild(cell);
    }
  }
}

/** The card shown when a memorial flower is tapped. */
export class MemorialCard {
  private readonly dialog;
  private readonly body: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, NAMES.garden, UI_TEXT.close);
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  show(m: Memorial): void {
    const g = this.game();
    this.body.innerHTML = '';
    this.body.appendChild(el('h3', undefined, UI_TEXT.memorialTitle(m.name)));
    if (m.form) {
      const label =
        m.form === 'child'
          ? `${NAMES.creature} (child)`
          : keyLabel(
              `${m.species === 'chao' || !m.species ? 'chao:' : ''}${m.species && m.species !== 'chao' ? m.species : m.form}`,
            );
      this.body.appendChild(el('p', undefined, UI_TEXT.memorialForm(label)));
    }
    if (m.ageMs !== undefined)
      this.body.appendChild(el('p', undefined, UI_TEXT.memorialLived(formatDuration(m.ageMs))));
    if (m.rebirths) this.body.appendChild(el('p', undefined, UI_TEXT.memorialRebirths(m.rebirths)));
    if (m.departedAtMs !== undefined && g) {
      this.body.appendChild(
        el('p', 'help', UI_TEXT.memorialAgo(formatDuration(g.world.timeMs - m.departedAtMs))),
      );
    }
    this.body.appendChild(el('p', 'help', '🌸'));
    this.body.appendChild(button(UI_TEXT.close, () => this.dialog.hide(), 'btn btn-primary'));
    this.dialog.show();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  close(): void {
    this.dialog.hide();
  }
}
