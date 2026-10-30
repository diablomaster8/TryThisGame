import {
  CRITTER_LABELS,
  EGG_COLOR_LABELS,
  formatDuration,
  NAMES,
  SPECIES_LABELS,
  TEN_TEXT,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import { FLAVOUR } from '../config/strings-look';
import { BOOK_TEXT } from '../config/strings-look';
import { cosmeticLabel } from '../config/cosmetics';
import { canConvert } from '../sim/scans';
import type { Game } from '../game';
import { frameKey } from '../render/sprites/animations';
import type { SpriteSheet } from '../render/sprites/atlas';
import { DRAWN_ANGLES } from '../render/sprites/angles';
import { SheetCache } from '../render/sprites/sheets';
import { allKeys, BOOK_TABS, tabOf, tabProgress, type BookTab } from '../sim/collection';
import { createEgg } from '../sim/nubbin';
import { Rng } from '../sim/rng';
import type { AlignmentBand, Memorial, Nubbin, NubbinType, World } from '../sim/types';
import type { CollectibleKind } from '../config/region-collectibles';
import type { RegionId } from '../config/regions';
import { WORLD_TEXT } from '../config/strings-world';
import { tally } from '../sim/collectibles';
import { button, el, modal } from './dom';
import '../look.css';

const bandLabel = (b: string | undefined): string =>
  b === 'sun' ? NAMES.alignmentSun : b === 'moon' ? NAMES.alignmentMoon : NAMES.alignmentNeutral;
const typeLabel = (t: string | undefined): string =>
  TYPE_LABELS[t as keyof typeof TYPE_LABELS] ?? t ?? '';
const colourLabel = (c: string | undefined): string => EGG_COLOR_LABELS[c ?? ''] ?? c ?? '';

/** Label for a collection key. */
export function keyLabel(key: string): string {
  const parts = key.split(':');
  switch (parts[0]) {
    case 'colour': {
      const base = colourLabel(parts[1]);
      if (parts[2] === 'shiny') return `${base} (${BOOK_TEXT.shiny})`;
      if (parts[2] === 'twotone') return `${base} (${BOOK_TEXT.twoTone(colourLabel(parts[3]))})`;
      return base;
    }
    case 'jewel':
      return colourLabel(parts[1]);
    case 'look':
    case 'hat':
      return cosmeticLabel(parts[1] ?? '');
    case 'part':
      return BOOK_TEXT.part(CRITTER_LABELS[parts[1] ?? ''] ?? parts[1] ?? '', parts[2] ?? '');
    case 'chao':
      break;
    default:
      return SPECIES_LABELS[key] ?? key;
  }
  if (parts[1] === 'child') return `${NAMES.creature} (child)`;
  if (parts[1] === 'eternal') return `${NAMES.eternal} ${bandLabel(parts[2])}`;
  const first = `${bandLabel(parts[1])} ${typeLabel(parts[2])}`;
  return parts[3] ? BOOK_TEXT.second(first, typeLabel(parts[3])) : first;
}

/** FUN-28: a book entry's dry line: a hat's or look's, or a critter part's critter. */
export function keyFlavour(key: string): string {
  const parts = key.split(':');
  if (parts[0] === 'hat' || parts[0] === 'look') return FLAVOUR.wear[parts[1] ?? ''] ?? '';
  if (parts[0] === 'part') return FLAVOUR.critter[parts[1] ?? ''] ?? '';
  return '';
}

/**
 * A stand-in Nubbin that shows one book key, so the page draws it with the same look rules
 * as the Grove (`SheetCache.forNubbin`): a form, a colour on a child, a part or a hat.
 */
export function nubbinForKey(key: string): Nubbin {
  const n = createEgg(`book:${key}`, { x: 0, z: 0 }, Rng.fromSeed(key));
  n.stage = 'child';
  const p = key.split(':');
  const adult = (band: AlignmentBand, type: NubbinType, second: NubbinType | null = null) => {
    n.stage = 'adult';
    n.form = { band, type, second, leanAtEvolution: { ...n.typeLean } };
  };
  switch (p[0]) {
    case 'chao':
      if (p[1] === 'eternal') {
        adult(p[2] as AlignmentBand, 'normal');
        n.eternal = p[2] as AlignmentBand;
      } else if (p[1] !== 'child' && p[1] !== 'egg') {
        adult(p[1] as AlignmentBand, p[2] as NubbinType, (p[3] as NubbinType) ?? null);
      }
      break;
    case 'colour':
      n.eggColor = p[1] ?? 'plain';
      n.shiny = p[2] === 'shiny';
      if (p[2] === 'twotone') n.tone = p[3] ?? null;
      break;
    case 'jewel':
      n.eggColor = p[1] ?? 'plain';
      break;
    case 'part':
      adult('neutral', 'normal');
      n.parts = { ...n.parts, [p[2] ?? 'ears']: p[1] ?? null };
      break;
    case 'look':
    case 'hat':
      n.hat = p[1] ?? null;
      break;
    default:
      n.species = key;
  }
  return n;
}

/**
 * The collection book (LOOK-55): tabs for forms, the pocket and digital lines, colours,
 * looks, parts and hats, each with its count. A thumbnail is drawn only when its cell
 * scrolls into view; tapping a seen page turns the figure through all eight angles with the
 * date it was first seen and who showed it. An unseen page is a silhouette.
 */
export class CollectionBook {
  private readonly dialog;
  private readonly tabs: HTMLDivElement;
  private readonly grid: HTMLDivElement;
  private readonly summary: HTMLParagraphElement;
  private readonly page: HTMLDivElement;
  private readonly cache = new SheetCache(() => performance.now(), {
    maxSheets: 48,
    idleMs: 60000,
  });
  private tab: BookTab = 'forms';
  private observer: IntersectionObserver | null = null;
  private spin = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.collection, UI_TEXT.close);
    this.summary = el('p', 'help');
    this.tabs = el('div', 'book-tabs');
    this.page = el('div', 'book-page');
    this.grid = el('div', 'book-grid');
    this.dialog.body.append(this.summary, this.tabs, this.page, this.grid);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.stopSpin();
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private sheetFor(key: string): SpriteSheet | null {
    try {
      return this.cache.forNubbin(nubbinForKey(key));
    } catch {
      return null;
    }
  }

  private draw(c: HTMLCanvasElement, key: string, angle: string, flip: boolean, known: boolean) {
    const ctx = c.getContext('2d');
    const sheet = this.sheetFor(key);
    const rect = sheet?.frames.get(frameKey('idle', angle, 0));
    if (!ctx || !sheet || !rect) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    if (flip) {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    const img = sheet.texture.image as HTMLCanvasElement;
    ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, c.width, c.height);
    ctx.restore();
    if (!known) {
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#2a2540';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  private stopSpin(): void {
    if (this.spin) clearInterval(this.spin);
    this.spin = 0;
  }

  /** The open page: the figure turning through the five drawn angles and their mirrors. */
  private showPage(key: string, world: World): void {
    this.stopSpin();
    this.page.innerHTML = '';
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const turn = [...DRAWN_ANGLES, ...DRAWN_ANGLES.slice(1, -1).reverse()];
    let i = 0;
    const tick = () => {
      this.draw(c, key, turn[i % turn.length]!, i % turn.length >= DRAWN_ANGLES.length, true);
      i++;
    };
    tick();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
      this.spin = window.setInterval(tick, 400);
    const at = world.seen[key];
    const by = world.seenBy?.[key];
    this.page.append(
      c,
      el('h3', undefined, keyLabel(key)),
      ...(keyFlavour(key) ? [el('p', 'flavour', keyFlavour(key))] : []),
      ...(at !== undefined
        ? [el('p', 'help', BOOK_TEXT.firstSeen(formatDuration(world.timeMs - at)))]
        : []),
      ...(by ? [el('p', 'help', BOOK_TEXT.earnedBy(by))] : []),
    );
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    const world = g.world;
    const keys = allKeys();
    const seen = keys.filter((k) => world.seen[k] !== undefined).length;
    this.summary.textContent = UI_TEXT.collectionHelp(seen, keys.length);
    this.tabs.innerHTML = '';
    for (const tab of BOOK_TABS) {
      const p = tabProgress(world, tab);
      const done = !!world.bookTabs?.includes(tab);
      const b = button(
        BOOK_TEXT.tabCount(BOOK_TEXT.tabs[tab] ?? tab, p.seen, p.total, done),
        () => {
          this.tab = tab;
          this.refresh();
        },
        `btn btn-small${tab === this.tab ? ' btn-primary' : ''}`,
      );
      b.setAttribute('aria-pressed', String(tab === this.tab));
      this.tabs.appendChild(b);
    }
    this.stopSpin();
    this.page.innerHTML = '';
    if (world.bookTabs?.includes(this.tab)) this.page.append(el('p', 'help', BOOK_TEXT.tabDone));
    this.observer?.disconnect();
    const pending = new Map<Element, () => void>();
    this.observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver((entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              pending.get(e.target)?.();
              pending.delete(e.target);
              this.observer?.unobserve(e.target);
            }
          });
    this.grid.innerHTML = '';
    this.grid.dataset['tab'] = this.tab;
    for (const key of keys) {
      if (tabOf(key) !== this.tab) continue;
      const known = world.seen[key] !== undefined;
      const cell = el('div', `book-cell${known ? '' : ' unknown'}`);
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const paint = () => this.draw(c, key, 'front', false, known);
      if (this.observer) {
        pending.set(cell, paint);
        this.observer.observe(cell);
      } else paint();
      cell.append(c, el('div', 'book-label', known ? keyLabel(key) : UI_TEXT.unknown));
      if (known) {
        cell.tabIndex = 0;
        cell.addEventListener('click', () => this.showPage(key, world));
      }
      if (this.tab === 'pocket' || this.tab === 'digital') {
        const scan = world.scans[key] ?? 0;
        const bar = el('div', 'meter-bar');
        const fill = el('div');
        fill.style.width = `${Math.min(100, scan)}%`;
        bar.appendChild(fill);
        cell.appendChild(bar);
        const why = canConvert(world, key);
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
