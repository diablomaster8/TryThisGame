import { BATTLE_MOVE_TEXT, moveName } from '../config/strings-battle-moves';
import { TYPE_WORDS } from '../config/strings-battle';
import { BOOK_TEXT, LADDER_TEXT } from '../config/strings-battle-r6';
import { battleBook } from '../sim/battle/book';
import { moveOf } from '../sim/battle/moves';
import {
  formatDuration,
  NAMES,
  SPECIES_LABELS,
  TEN_TEXT,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import { canConvert } from '../sim/scans';
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
import type { Memorial, World } from '../sim/types';
import type { CollectibleKind } from '../config/region-collectibles';
import type { RegionId } from '../config/regions';
import { WORLD_TEXT } from '../config/strings-world';
import { tally } from '../sim/collectibles';
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
  /** The Battle Book's pages (FIGHT-84), under the species. */
  private readonly battle: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.collection, UI_TEXT.close);
    this.summary = el('p', 'help');
    this.grid = el('div', 'book-grid');
    this.battle = el('div', 'book-battle');
    this.dialog.body.append(this.summary, this.grid, this.battle);
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
      if (!key.startsWith('chao:')) {
        const scan = g.world.scans[key] ?? 0;
        const bar = el('div', 'meter-bar');
        const fill = el('div');
        fill.style.width = `${Math.min(100, scan)}%`;
        bar.appendChild(fill);
        cell.appendChild(bar);
        const why = canConvert(g.world, key);
        const b = button(
          why ? TEN_TEXT.scan(scan) : TEN_TEXT.convert,
          () => {
            g.send({ kind: 'convertScan', species: key });
            setTimeout(() => this.refresh(), 150);
          },
          'btn btn-small',
        );
        b.disabled = why !== null;
        if (why === 'roster') b.title = TEN_TEXT.convertWhy.roster ?? '';
        cell.appendChild(b);
      }
      this.grid.appendChild(cell);
    }
    this.battleBook(g);
  }

  /** The Battle Book (FIGHT-84): counts, then each move's card, each with its type icon and blurb. */
  private battleBook(g: Game): void {
    const b = battleBook(g.world);
    this.battle.innerHTML = '';
    this.battle.appendChild(el('h3', undefined, BOOK_TEXT.title));
    const belt = b.belt ? (LADDER_TEXT.belts[b.belt - 1] ?? '') : LADDER_TEXT.belt(0);
    for (const line of [
      BOOK_TEXT.moves(b.learned, b.total),
      BOOK_TEXT.seen(b.seen, b.total),
      BOOK_TEXT.befriended(b.befriended),
      BOOK_TEXT.ribbons(b.ribbons, b.ribbonSlots),
      BOOK_TEXT.belt(belt),
    ])
      this.battle.appendChild(el('p', 'help', line));
    this.battle.appendChild(el('div', 'btn-name', BOOK_TEXT.keepsakes));
    this.battle.appendChild(
      el(
        'p',
        'help',
        b.keepsakes.length
          ? b.keepsakes.map((k) => BOOK_TEXT.keepsakeNames[k] ?? k).join(' · ')
          : BOOK_TEXT.noKeepsakes,
      ),
    );
    const grid = el('div', 'book-moves');
    for (const m of b.moves) {
      const def = moveOf(m.id);
      const t = TYPE_WORDS[def.type];
      const card = el('div', `book-move${m.seen ? '' : ' unknown'}${m.learned ? ' learned' : ''}`);
      card.append(
        el('span', 'book-move-icon', m.seen ? t.icon : '?'),
        el('strong', undefined, m.seen ? moveName(m.id) : BOOK_TEXT.unknown),
        el(
          'small',
          undefined,
          m.seen ? (BATTLE_MOVE_TEXT[m.id]?.blurb ?? '') : BOOK_TEXT.unknownBlurb,
        ),
      );
      grid.appendChild(card);
    }
    this.battle.appendChild(grid);
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

/** R0091: the toast for a found collectible or a finished set. */
export function keepsakeToast(
  e:
    | { kind: 'keepsakeFound'; id: string; what: CollectibleKind }
    | { kind: 'collectionSetDone'; region: string; what: CollectibleKind },
  world: Pick<World, 'collected'> | undefined,
): string {
  if (e.kind === 'collectionSetDone') return WORLD_TEXT.keepsakeSet[e.what];
  const region = e.id.split(':')[0] as RegionId;
  const t = world ? tally(world, region, e.what) : { got: 1, of: 1 };
  return WORLD_TEXT.keepsakeFound(WORLD_TEXT.keepsake[e.what][0], t.got, t.of);
}

/** R0091: a region's collectible counts as one line ("Petals 7/12 · Postcards 1/3 · Keys 0/1"). */
export function keepsakeLine(world: Pick<World, 'collected'>, region: RegionId): string {
  return (['petal', 'postcard', 'key'] as const)
    .map((k) => {
      const t = tally(world, region, k);
      return WORLD_TEXT.keepsakeTally(WORLD_TEXT.keepsake[k][1], t.got, t.of);
    })
    .join(' · ');
}
