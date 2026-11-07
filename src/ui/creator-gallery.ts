import { CREATOR_TEXT, GALLERY_TEXT } from '../config/strings-evo';
import { NAMES } from '../config/strings';
import type { Game } from '../game';
import { frameKey } from '../render/sprites/animations';
import {
  applyPick,
  creatorCatalogue,
  pickProblem,
  type CatalogueEntry,
  type CreatorPick,
} from '../sim/creator';
import { createEgg } from '../sim/nubbin';
import { Rng } from '../sim/rng';
import type { Family } from '../sim/species';
import { speciesOf } from '../sim/species';
import type { Command } from '../sim/types';
import { button, dialogFocus, el } from './dom';

/**
 * The creator gallery (Maor only): a full-screen browse of every version of every pet. The
 * model below is plain state (tab, filter, selection, the commands it sends) so it can be
 * tested without a DOM; `CreatorGallery` is the thin modal over it. Thumbnails are the pet's
 * front idle frame from the same sprite sheets the roster portraits use, drawn lazily.
 */
export const GALLERY_FAMILIES: readonly Family[] = ['chao', 'pocket', 'digi'];

/** Entries of one family whose label or group contains every word typed. */
export function filterCatalogue(
  entries: readonly CatalogueEntry[],
  family: Family,
  text: string,
): CatalogueEntry[] {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter((e) => {
    if (e.family !== family) return false;
    const hay = `${e.label} ${e.group}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/** Entries in catalogue order, split under their group heading. */
export function groupEntries(
  entries: readonly CatalogueEntry[],
): { group: string; entries: CatalogueEntry[] }[] {
  const out: { group: string; entries: CatalogueEntry[] }[] = [];
  for (const e of entries) {
    let last = out.find((g) => g.group === e.group);
    if (!last) out.push((last = { group: e.group, entries: [] }));
    last.entries.push(e);
  }
  return out;
}

export class GalleryModel {
  family: Family = 'chao';
  text = '';
  selectedId: string | null = null;

  constructor(
    readonly entries: readonly CatalogueEntry[] = creatorCatalogue(),
    private readonly send: (c: Command) => void = () => undefined,
  ) {}

  visible(): CatalogueEntry[] {
    return filterCatalogue(this.entries, this.family, this.text);
  }

  selected(): CatalogueEntry | null {
    return this.entries.find((e) => e.id === this.selectedId) ?? null;
  }

  select(id: string): void {
    this.selectedId = id;
  }

  /** Send a grant for the selected tile. Returns whether anything was sent. */
  grant(): boolean {
    const e = this.selected();
    if (!e || pickProblem(e.pick)) return false;
    this.send({ kind: 'creatorGrant', pick: e.pick });
    return true;
  }

  /** Send a transform of the world's selected Nubbin into the selected tile. */
  transform(nubbinId: string | null): boolean {
    const e = this.selected();
    if (!e || !nubbinId || pickProblem(e.pick)) return false;
    this.send({ kind: 'creatorTransform', nubbinId, pick: e.pick });
    return true;
  }
}

const THUMB = 64;

export class CreatorGallery {
  private readonly model: GalleryModel;
  private readonly root = el('div', 'modal creator-gallery');
  private readonly card = el('div', 'modal-card creator-gallery-card');
  private readonly scroller = el('div', 'creator-gallery-scroll');
  private readonly tabs = el('div', 'creator-gallery-tabs');
  private readonly tabButtons = new Map<Family, HTMLButtonElement>();
  private readonly input = el('input', 'creator-gallery-filter');
  private readonly count = el('p', 'help creator-gallery-count');
  private readonly note = el('p', 'help creator-gallery-note');
  private readonly grantBtn: HTMLButtonElement;
  private readonly transformBtn: HTMLButtonElement;
  private readonly focus: ReturnType<typeof dialogFocus>;
  private readonly cache = new Map<string, HTMLCanvasElement>();
  private readonly tiles = new Map<string, HTMLButtonElement>();
  private observer: IntersectionObserver | null = null;
  private seq = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.model = new GalleryModel(creatorCatalogue(), (c) => this.game()?.send(c));
    this.root.hidden = true;
    const head = el('div', 'modal-head');
    const heading = el('h2', undefined, GALLERY_TEXT.title);
    const close = button('Close', () => this.close(), 'btn btn-close');
    close.setAttribute('aria-label', 'Close');
    head.append(heading, close);

    this.tabs.setAttribute('role', 'group');
    for (const f of GALLERY_FAMILIES) {
      const b = button(
        GALLERY_TEXT.tabs[f],
        () => {
          this.model.family = f;
          this.build();
        },
        'btn creator-gallery-tab',
      );
      this.tabButtons.set(f, b);
      this.tabs.appendChild(b);
    }
    this.input.type = 'search';
    this.input.placeholder = GALLERY_TEXT.filterHint;
    this.input.setAttribute('aria-label', GALLERY_TEXT.filter);
    this.input.addEventListener('input', () => {
      this.model.text = this.input.value;
      this.build();
    });

    this.grantBtn = button(CREATOR_TEXT.grant, () => this.apply(false), 'btn btn-primary');
    this.transformBtn = button(CREATOR_TEXT.transform, () => this.apply(true), 'btn');
    const bar = el('div', 'creator-actions creator-gallery-bar');
    bar.append(this.grantBtn, this.transformBtn);
    this.note.setAttribute('role', 'status');
    this.scroller.addEventListener('keydown', (e) => this.onKey(e));

    this.card.append(head, this.tabs, this.input, this.count, this.scroller, bar, this.note);
    this.root.appendChild(this.card);
    parent.appendChild(this.root);
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });
    this.focus = dialogFocus(this.root, this.card, heading, () => this.close());
  }

  open(): void {
    this.root.hidden = false;
    this.build();
    this.focus.opened();
  }

  close(): void {
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.observer?.disconnect();
    this.focus.closed();
  }

  isOpen(): boolean {
    return !this.root.hidden;
  }

  /** The pick of the chosen tile, or null. */
  pick(): CreatorPick | null {
    return this.model.selected()?.pick ?? null;
  }

  private build(): void {
    this.observer?.disconnect();
    this.tiles.clear();
    for (const [f, b] of this.tabButtons)
      b.setAttribute('aria-pressed', String(f === this.model.family));
    const shown = this.model.visible();
    this.count.textContent = shown.length ? GALLERY_TEXT.count(shown.length) : GALLERY_TEXT.none;
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (hits) => {
          for (const h of hits) {
            if (!h.isIntersecting) continue;
            this.observer?.unobserve(h.target);
            this.draw(h.target as HTMLCanvasElement);
          }
        },
        { root: this.scroller, rootMargin: '200px' },
      );
    }
    const frag = document.createDocumentFragment();
    for (const g of groupEntries(shown)) {
      const sec = el('section', 'creator-gallery-group');
      sec.appendChild(el('h3', undefined, g.group));
      const grid = el('div', 'creator-gallery-grid');
      for (const e of g.entries) grid.appendChild(this.tile(e));
      sec.appendChild(grid);
      frag.appendChild(sec);
    }
    this.scroller.replaceChildren(frag);
    this.refreshBar();
  }

  private tile(e: CatalogueEntry): HTMLButtonElement {
    const b = el('button', 'creator-tile');
    b.type = 'button';
    b.dataset['id'] = e.id;
    b.setAttribute('aria-pressed', String(this.model.selectedId === e.id));
    b.title = e.label;
    const c = el('canvas', 'creator-tile-img');
    c.width = THUMB;
    c.height = THUMB;
    c.dataset['id'] = e.id;
    c.setAttribute('aria-hidden', 'true');
    b.append(c, el('span', 'creator-tile-label', e.label));
    b.addEventListener('click', () => {
      this.model.select(e.id);
      for (const [id, t] of this.tiles) t.setAttribute('aria-pressed', String(id === e.id));
      this.refreshBar();
    });
    this.tiles.set(e.id, b);
    if (this.observer) this.observer.observe(c);
    else this.draw(c);
    return b;
  }

  /** The pet's front idle frame, from the same sheets the roster portrait draws. */
  private draw(c: HTMLCanvasElement): void {
    const id = c.dataset['id'] ?? '';
    let src = this.cache.get(id);
    if (!src) {
      const entry = this.model.entries.find((e) => e.id === id);
      const g = this.game();
      if (!entry || !g) return;
      src = this.thumbnail(g, entry) ?? undefined;
      if (!src) return;
      this.cache.set(id, src);
    }
    c.getContext('2d')?.drawImage(src, 0, 0);
  }

  private thumbnail(g: Game, e: CatalogueEntry): HTMLCanvasElement | null {
    const n = createEgg(
      `gallery~${++this.seq}`,
      { x: 0, z: 0 },
      new Rng(1000 + this.seq),
      e.pick.eggColor ?? 'plain',
      speciesOf(e.pick.species).id,
    );
    applyPick(n, e.pick, g.world);
    const sheet = g.view.sheets.forNubbin(n);
    const rect =
      sheet.frames.get(frameKey('idle', 'front', 0)) ?? sheet.frames.values().next().value;
    const out = el('canvas');
    out.width = THUMB;
    out.height = THUMB;
    const ctx = out.getContext('2d');
    if (!ctx || !rect) return null;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      sheet.texture.image as HTMLCanvasElement,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      0,
      0,
      THUMB,
      THUMB,
    );
    return out;
  }

  private refreshBar(): void {
    const sel = this.model.selected();
    const world = this.game()?.world.selected ?? null;
    this.grantBtn.disabled = !sel;
    this.transformBtn.disabled = !sel || !world;
    if (!sel) this.note.textContent = GALLERY_TEXT.pickFirst;
    else if (!world) this.note.textContent = CREATOR_TEXT.noSelection;
    else this.note.textContent = GALLERY_TEXT.selected(sel.label);
  }

  private apply(transform: boolean): void {
    const g = this.game();
    if (!g) return;
    const ok = transform ? this.model.transform(g.world.selected) : this.model.grant();
    if (ok) this.note.textContent = CREATOR_TEXT.done(NAMES.creature);
  }

  private onKey(e: KeyboardEvent): void {
    const keys = [...this.scroller.querySelectorAll<HTMLButtonElement>('.creator-tile')];
    const at = keys.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0) return;
    const step: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let next = -1;
    if (e.key in step) next = at + step[e.key]!;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = keys.length - 1;
    if (next < 0 || next >= keys.length) return;
    e.preventDefault();
    keys[next]!.focus();
  }
}
