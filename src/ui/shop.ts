import { NAMES, SHOP_ITEMS, UI_TEXT, shopHatNote } from '../config/strings';
import { FLAVOUR } from '../config/strings-look';
import { cosmeticLabel } from '../config/cosmetics';
import type { Game } from '../game';
import { rosterCap } from '../sim/roster';
import { priceOf, rosterCount, shopHat } from '../sim/shop';
import type { ShopItem } from '../sim/types';
import { button, el, modal } from './dom';

/** The shop: fruit, eggs (with a chance of a rare colour), hats and toys, paid in Shells. */
export class ShopMenu {
  private readonly dialog;
  private readonly balance: HTMLDivElement;
  private readonly rows = new Map<ShopItem, { button: HTMLButtonElement; note: HTMLSpanElement }>();

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.shop, UI_TEXT.close);
    this.balance = el('div', 'shop-balance');
    this.dialog.body.appendChild(this.balance);
    const list = el('div', 'shop-list');
    for (const item of ['fruit', 'egg', 'hat', 'toy', 'heartFruit', 'twine'] as const) {
      const row = el('div', 'shop-row');
      const text = el('div');
      text.append(
        el('strong', undefined, SHOP_ITEMS[item].name),
        el('small', undefined, SHOP_ITEMS[item].help),
        el('small', 'flavour', FLAVOUR.shop[item] ?? ''),
      );
      const note = el('span', 'shop-note');
      const b = button(`${priceOf(item)} ${NAMES.currency}`, () => this.buy(item), 'btn btn-small');
      row.append(text, note, b);
      list.appendChild(row);
      this.rows.set(item, { button: b, note });
    }
    this.dialog.body.appendChild(list);
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

  refresh(): void {
    const g = this.game();
    if (!g || !this.isOpen()) return;
    const inv = g.world.inventory;
    this.balance.textContent = `🐚 ${inv.shells} ${NAMES.currency}`;
    for (const [item, row] of this.rows) {
      row.button.disabled = inv.shells < priceOf(item);
      switch (item) {
        case 'fruit':
          row.note.textContent = `×${inv.fruit}`;
          break;
        case 'egg':
          row.note.textContent = `${rosterCount(g.world)}/${rosterCap(g.world)}`;
          break;
        case 'hat':
          row.note.textContent = shopHatNote(cosmeticLabel(shopHat(g.world)));
          break;
        case 'toy':
          row.note.textContent = `×${g.world.items.filter((i) => i.kind === 'toy').length}`;
          break;
        case 'heartFruit':
          row.note.textContent = `×${inv.heartFruit}`;
          break;
      }
    }
  }

  private buy(item: ShopItem): void {
    this.game()?.send({ kind: 'buy', item });
  }

  /** Called from the HUD when a `bought` event arrives. */
  onBought(ok: boolean, reason: 'shells' | 'roster' | 'toys' | null, item: ShopItem): void {
    if (ok) this.toast(UI_TEXT.bought(SHOP_ITEMS[item]?.name ?? item));
    else if (reason === 'roster') this.toast(UI_TEXT.rosterFull);
    else if (reason === 'toys') this.toast(UI_TEXT.tooManyToys);
    else this.toast(UI_TEXT.notEnoughShells);
    this.refresh();
  }
}
