/**
 * The stash panel (R0174; lane B round 8): the same stash at every act camp's chest and at the
 * Grove cottage. Tabs along the top (with counts), a slot filter and a search box, the stash's
 * pieces rarest first with Take and "To tab n", and the satchel below with "Put in stash".
 * `CottageChest` is the Grove's way in: a button that shows while the Keeper stands by the
 * cottage door.
 */
import { STASH } from '../config/dungeon-items-r8';
import { KEEPER_SLOTS, LOOT, NUBBIN_SLOTS, RARITIES } from '../config/dungeon-loot';
import { GEAR_TEXT, UI_TEXT } from '../config/strings';
import { ITEMS_R8_TEXT as T } from '../config/strings-hollow-r8-items';
import type { Game } from '../game';
import { canReachStash, filterStash, stashTab, tabCounts } from '../sim/dungeon-stash';
import { stashTabCount } from '../sim/gear';
import type { GearItem, World } from '../sim/types';
import { button, el, modal } from './dom';
import { gearGlyph, gearName } from './dungeon-gear';

export class StashPanel {
  private readonly dialog;
  private readonly tabs: HTMLDivElement;
  private readonly slots: HTMLDivElement;
  private readonly search: HTMLInputElement;
  private readonly list: HTMLDivElement;
  private tab = 0;
  private slot: string | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, T.stashTitle, UI_TEXT.close);
    // R0193: a full-width bottom sheet on a phone (dungeon.css).
    this.dialog.root.classList.add('hollow-sheet');
    this.dialog.root.classList.add('hollow-gear');
    this.tabs = el('div', 'hollow-gear-buttons');
    this.slots = el('div', 'hollow-gear-buttons');
    this.search = el('input');
    this.search.type = 'search';
    this.search.placeholder = T.stashSearch;
    this.search.setAttribute('aria-label', T.stashSearch);
    this.search.style.minHeight = '44px';
    this.search.addEventListener('input', () => this.render());
    this.list = el('div', 'hollow-gear-list');
    this.dialog.body.append(
      el('p', 'help', T.stashHelp),
      this.tabs,
      this.slots,
      this.search,
      this.list,
    );
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  open(): void {
    this.render();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  /** Called every frame: shuts when the Keeper walks away from the chest. */
  refresh(world: World): void {
    if (this.isOpen() && !canReachStash(world)) this.close();
  }

  private send(cmd: Parameters<Game['send']>[0]): void {
    this.game()?.send(cmd);
    this.render();
  }

  private render(): void {
    const w = this.game()?.world;
    if (!w) return;
    const n = stashTabCount(w);
    this.tab = Math.min(this.tab, n - 1);
    const counts = tabCounts(w);
    this.tabs.replaceChildren(
      ...counts.map((c, i) => {
        const b = button(
          T.stashTab(i + 1, c, STASH.perTab),
          () => {
            this.tab = i;
            this.render();
          },
          i === this.tab ? 'btn btn-small btn-primary' : 'btn btn-small',
        );
        b.setAttribute('aria-pressed', String(i === this.tab));
        return b;
      }),
    );
    const slotIds = [null, ...KEEPER_SLOTS, ...NUBBIN_SLOTS];
    this.slots.replaceChildren(
      ...slotIds.map((s) => {
        const b = button(
          s ? (GEAR_TEXT.base[s] ?? s) : T.stashAllSlots,
          () => {
            this.slot = s;
            this.render();
          },
          s === this.slot ? 'btn btn-small btn-primary' : 'btn btn-small',
        );
        b.setAttribute('aria-pressed', String(s === this.slot));
        return b;
      }),
    );
    const order = RARITIES.map((r) => r.id as string).reverse();
    const words = (x: GearItem) => `${gearName(x)} ${GEAR_TEXT.rarity[x.rarity] ?? ''}`;
    const shown = filterStash(
      w.gear?.stash ?? [],
      {
        tab: this.search.value.trim() ? null : this.tab,
        slot: this.slot,
        query: this.search.value,
      },
      (x) => stashTab(w, x),
      words,
    ).sort(
      (a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity) || a.slot.localeCompare(b.slot),
    );
    const satchel = w.gear?.items ?? [];
    const room = satchel.length < LOOT.carry;
    const rows: HTMLElement[] = shown.map((it) => {
      const r = this.itemRow(it);
      const bs = el('div', 'hollow-gear-buttons');
      const take = button(
        T.stashTake,
        () => this.send({ kind: 'stashTake', itemId: it.id }),
        'btn btn-small btn-primary',
      );
      take.disabled = !room;
      bs.append(take);
      for (let t = 0; t < n; t++)
        if (t !== stashTab(w, it) && (counts[t] ?? 0) < STASH.perTab)
          bs.append(
            button(
              T.stashMove(t + 1),
              () => this.send({ kind: 'stashMove', itemId: it.id, tab: t }),
              'btn btn-small',
            ),
          );
      r.append(bs);
      return r;
    });
    if (!rows.length) rows.push(el('p', 'help', T.stashEmpty));
    rows.push(el('h3', undefined, T.satchelTitle(satchel.length, LOOT.carry)));
    for (const it of satchel) {
      const r = this.itemRow(it);
      r.append(
        button(T.stashPut, () => this.send({ kind: 'stashPut', itemId: it.id }), 'btn btn-small'),
      );
      rows.push(r);
    }
    this.list.replaceChildren(...rows);
  }

  private itemRow(it: GearItem): HTMLDivElement {
    const tier = RARITIES.find((r) => r.id === it.rarity);
    const row = el('div', 'hollow-gear-row');
    const name = el('div', 'hollow-gear-name');
    const glyph = el('span', 'hollow-gear-glyph', gearGlyph(it));
    if (tier) glyph.style.color = tier.colour;
    name.append(glyph, ` ${gearName(it)} · ${GEAR_TEXT.rarity[it.rarity] ?? ''} · Lv ${it.level}`);
    row.append(name);
    return row;
  }
}

/** The Grove's cottage chest: a button by the cottage door that opens the stash panel. */
export class CottageChest {
  readonly button: HTMLButtonElement;
  constructor(
    parent: HTMLElement,
    private readonly panel: StashPanel,
  ) {
    this.button = button(
      T.cottageChest,
      () => this.panel.open(),
      'btn btn-small hollow-cottage-chest',
    );
    this.button.hidden = true;
    parent.appendChild(this.button);
  }

  refresh(world: World): void {
    const show = world.location === 'grove' && canReachStash(world) && !this.panel.isOpen();
    if (this.button.hidden === show) this.button.hidden = !show;
    this.panel.refresh(world);
  }
}
