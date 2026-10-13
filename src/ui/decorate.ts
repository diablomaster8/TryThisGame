import { NAMES, UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { DECOR_KINDS, decorPrice } from '../sim/decorate';
import type { DecorKind } from '../sim/types';
import { button, el, modal } from './dom';

/** Buy garden pieces and enter placing mode; the HUD shows a chip while placing. */
export class DecorateMenu {
  private readonly dialog;
  private readonly list: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.decorate, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.decorateHelp));
    this.list = el('div', 'shop-list');
    this.dialog.body.appendChild(this.list);
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
    if (!g) return;
    this.list.innerHTML = '';
    this.list.appendChild(
      el('div', 'shop-balance', `🐚 ${g.world.inventory.shells} ${NAMES.currency}`),
    );
    for (const kind of DECOR_KINDS) {
      const row = el('div', 'shop-row');
      const owned = g.world.inventory.decor[kind] ?? 0;
      const text = el('div');
      text.append(
        el('strong', undefined, UI_TEXT.decorNames[kind]),
        el('small', undefined, `×${owned}`),
      );
      const buy = button(
        `${decorPrice(kind)} ${NAMES.currency}`,
        () => {
          g.send({ kind: 'buyDecor', decor: kind });
          setTimeout(() => this.refresh(), 150);
        },
        'btn btn-small',
      );
      buy.disabled = g.world.inventory.shells < decorPrice(kind);
      const place = button(UI_TEXT.placeDecor, () => this.place(kind), 'btn btn-small btn-primary');
      place.disabled = owned <= 0;
      row.append(text, buy, place);
      this.list.appendChild(row);
    }
  }

  private place(kind: DecorKind): void {
    const g = this.game();
    if (!g) return;
    g.placing = kind;
    this.close();
    this.toast(UI_TEXT.placing(UI_TEXT.decorNames[kind]));
  }
}
