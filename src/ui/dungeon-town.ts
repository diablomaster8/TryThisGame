import { ACTS } from '../config/dungeon-acts';
import {
  HOLLOW_LOCALS,
  HOLLOW_TOWN_LINES,
  HOLLOW_ZONE_TEXT,
  HOLLOW_TEXT,
  TRAINER_LABELS,
  UI_TEXT,
} from '../config/strings';
import { HOLLOW, HOLLOW_ZONES } from '../config/tuning';
import type { Game } from '../game';
import type { Service } from '../sim/dungeon';
import { serviceHere } from '../sim/dungeon-towns';
import type { World } from '../sim/types';
import { button, el, modal } from './dom';
import { GEAR_TEXT, HOLLOW_R6_TEXT } from '../config/strings';
import { basketPrice, basketSlots } from '../sim/dungeon-gamble';
import { ITEMS_R8_TEXT } from '../config/strings-hollow-r8-items';
import { wheelbarrowOpen } from '../sim/dungeon-wheelbarrow';
import { WheelbarrowPanel } from './dungeon-barrow';
import { StashPanel } from './dungeon-stash';

/**
 * An act camp's services (R0152): the panel that opens from the Hollow bar's service button
 * when the Keeper stands at one. The stash, the vendor and the quest-giver work; crafting,
 * gambling and hiring say they are not open yet.
 */
export class TownPanel {
  private readonly dialog;
  private readonly heading: HTMLHeadingElement;
  private readonly content: HTMLDivElement;
  private service: Service | null = null;
  /** Lane B round 8: the stash's own panel (R0174) and the wheelbarrow (R0177). */
  private readonly stash: StashPanel;
  private readonly barrow: WheelbarrowPanel;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, HOLLOW_ZONE_TEXT.stashTitle, UI_TEXT.close);
    this.heading = this.dialog.root.querySelector('h2')!;
    this.content = el('div', 'town-panel');
    this.dialog.body.appendChild(this.content);
    this.stash = new StashPanel(parent, game);
    this.barrow = new WheelbarrowPanel(parent, game);
  }

  isOpen(): boolean {
    return this.dialog.isOpen() || this.stash.isOpen() || this.barrow.isOpen();
  }

  close(): void {
    this.dialog.hide();
    this.stash.close();
    this.barrow.close();
  }

  /** Who keeps a service, by name; '' for the stash. */
  static keeperName(world: World, s: Service): string {
    if (!s.keeper) return '';
    const act = world.dungeon?.act;
    if (s.keeper === 'local') return act !== undefined ? (HOLLOW_LOCALS[ACTS[act]!.id] ?? '') : '';
    return TRAINER_LABELS[s.keeper]?.name ?? s.keeper;
  }

  /** The bar button's label for a service. */
  static label(world: World, s: Service): string {
    const who = TownPanel.keeperName(world, s);
    return who
      ? HOLLOW_ZONE_TEXT.talk(who)
      : HOLLOW_ZONE_TEXT.open(HOLLOW_ZONE_TEXT.services[s.kind] ?? '');
  }

  open(): void {
    const g = this.game();
    if (!g) return;
    this.service = serviceHere(g.world);
    if (!this.service) return;
    this.render(g.world);
    this.dialog.show();
  }

  /** Called every frame: closes when the Keeper walks away. */
  refresh(world: World): void {
    if (!this.isOpen()) return;
    const s = serviceHere(world);
    if (!s || s !== this.service) this.close();
  }

  private send(cmd: Parameters<Game['send']>[0]): void {
    const g = this.game();
    if (!g) return;
    g.send(cmd);
    this.render(g.world);
  }

  private render(world: World): void {
    const s = this.service;
    if (!s) return;
    const who = TownPanel.keeperName(world, s);
    const what = HOLLOW_ZONE_TEXT.services[s.kind] ?? '';
    this.heading.textContent = who ? `${who} · ${what}` : what;
    this.content.replaceChildren();
    const act = world.dungeon?.act ?? 0;
    const line = HOLLOW_TOWN_LINES[ACTS[act]!.id]?.[s.kind];
    if (line) this.content.appendChild(el('p', 'town-line', line));
    const row = (title: string, help: string, label: string, act: () => void, ok = true) => {
      const r = el('div', 'shop-row');
      const info = el('div');
      info.append(el('strong', undefined, title), el('small', undefined, help));
      const b = button(label, act, 'btn btn-small btn-primary');
      b.disabled = !ok;
      r.append(info, b);
      this.content.appendChild(r);
    };
    const shells = world.inventory.shells;
    if (s.kind === 'stash') {
      const camp = world.hollow.camp;
      this.content.append(
        el('p', 'help', HOLLOW_ZONE_TEXT.stashHelp),
        el('p', 'shop-note', HOLLOW_ZONE_TEXT.stashHeld(camp.shells, shells)),
      );
      const bar = el('div', 'town-stash');
      for (const n of [10, 50]) {
        const b = button(HOLLOW_ZONE_TEXT.stashIn(n), () =>
          this.send({ kind: 'stash', amount: n }),
        );
        b.disabled = shells < 1;
        bar.appendChild(b);
      }
      const all = button(HOLLOW_ZONE_TEXT.stashAll, () =>
        this.send({ kind: 'stash', amount: shells }),
      );
      all.disabled = shells < 1;
      bar.appendChild(all);
      for (const n of [10, 50]) {
        const b = button(HOLLOW_ZONE_TEXT.stashOut(n), () =>
          this.send({ kind: 'stash', amount: -n }),
        );
        b.disabled = camp.shells < 1;
        bar.appendChild(b);
      }
      for (const b of bar.querySelectorAll('button')) b.className = 'btn btn-small';
      this.content.appendChild(bar);
      // R0174: the gear stash, shared by every camp and the cottage; its own panel has the tabs.
      const stash = world.gear?.stash ?? [];
      this.content.appendChild(el('h3', undefined, HOLLOW_R6_TEXT.stashTitle(stash.length)));
      this.content.appendChild(
        button(ITEMS_R8_TEXT.stashButton, () => this.stash.open(), 'btn btn-small btn-primary'),
      );
    } else if (s.kind === 'vendor') {
      const price = HOLLOW_ZONES.vendor.fruitPrice;
      row(
        HOLLOW_ZONE_TEXT.vendorFruit(price),
        HOLLOW_ZONE_TEXT.vendorFruitHelp,
        HOLLOW_TEXT.acornsBuy,
        () => this.send({ kind: 'townBuy', item: 'fruit' }),
        shells >= price,
      );
      const { bundle, price: acorn } = HOLLOW.acorns;
      row(
        HOLLOW_TEXT.acornsTitle,
        HOLLOW_TEXT.acornsHelp(world.hollow.acorns, bundle, acorn),
        HOLLOW_TEXT.acornsBuy,
        () => this.send({ kind: 'townBuy', item: 'acorns' }),
        shells >= acorn,
      );
      // R0176: the Mystery Basket stall, one covered basket per slot, price shown plainly.
      this.content.append(
        el('h3', undefined, HOLLOW_R6_TEXT.basketTitle),
        el('p', 'help', HOLLOW_R6_TEXT.basketHelp),
      );
      const cost = basketPrice(act);
      for (const slot of basketSlots())
        row(
          GEAR_TEXT.base[slot] ?? slot,
          HOLLOW_R6_TEXT.basketBuy(cost),
          HOLLOW_TEXT.acornsBuy,
          () => this.send({ kind: 'gambleBasket', slot }),
          shells >= cost,
        );
    } else if (s.kind === 'quest') {
      const beaten = world.hollow.acts[act]?.bossDefeated === true;
      const paid = world.hollow.camp.questsPaid.includes(act);
      if (paid) this.content.appendChild(el('p', 'shop-note', HOLLOW_ZONE_TEXT.questPaid));
      else if (beaten) {
        const reward = HOLLOW_ZONES.questReward[act] ?? HOLLOW_ZONES.questReward[0];
        row(HOLLOW_ZONE_TEXT.services.quest!, HOLLOW_ZONE_TEXT.questDone(reward), '✓', () =>
          this.send({ kind: 'townQuest' }),
        );
      }
    } else if (s.kind === 'craft') {
      // R0177: the crafting table is the Gardener's Wheelbarrow.
      this.content.append(
        el(
          'p',
          'help',
          wheelbarrowOpen(world) ? ITEMS_R8_TEXT.barrowHelp : ITEMS_R8_TEXT.barrowLocked,
        ),
        button(ITEMS_R8_TEXT.barrowButton, () => this.barrow.open(), 'btn btn-small btn-primary'),
      );
    } else {
      this.content.appendChild(el('p', 'shop-note', HOLLOW_ZONE_TEXT.soon));
    }
  }
}
