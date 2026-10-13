import { NAMES, UI_TEXT } from '../config/strings';
import { RECIPES, TOYS } from '../config/tuning';
import type { Game } from '../game';
import { canCraft, hasWorkshop, type RecipeId } from '../sim/craft';
import { DECOR_KINDS, decorPrice } from '../sim/decorate';
import type { Placing } from '../input/game-input';
import { FLAVORS, type DecorKind, type DyeColor, type TileKind, type ToyKind } from '../sim/types';
import { button, el, modal } from './dom';

type Tab = 'decor' | 'paint' | 'plant' | 'toys' | 'workshop';

const TILES: TileKind[] = ['grass', 'dirt', 'water', 'flowers', 'stone'];
const TOY_KINDS: ToyKind[] = ['ball', 'radio', 'blocks', 'mirror', 'tv'];
const DYES: DyeColor[] = ['rose', 'sky', 'mint', 'gold', 'violet', 'ember'];

/**
 * The garden panel: buy and place pieces, paint tiles, plant seeds, place toys and
 * craft in the workshop. Placing hands a mode to the game; the HUD shows a chip while
 * a ground tap is awaited.
 */
export class DecorateMenu {
  private readonly dialog;
  private readonly tabs: HTMLDivElement;
  private readonly list: HTMLDivElement;
  private readonly help: HTMLParagraphElement;
  private tab: Tab = 'decor';
  private dyeChoice: DyeColor = 'rose';

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.decorate, UI_TEXT.close);
    this.tabs = el('div', 'tabs');
    const tabs: Array<[Tab, string]> = [
      ['decor', UI_TEXT.decorate],
      ['paint', UI_TEXT.paint],
      ['plant', UI_TEXT.orchard],
      ['toys', UI_TEXT.toys],
      ['workshop', UI_TEXT.workshop],
    ];
    for (const [tab, label] of tabs) {
      const b = button(label, () => this.show(tab), 'btn btn-small');
      b.dataset['tab'] = tab;
      this.tabs.appendChild(b);
    }
    this.dialog.body.appendChild(this.tabs);
    this.help = el('p', 'help', UI_TEXT.decorateHelp);
    this.dialog.body.appendChild(this.help);
    this.list = el('div', 'shop-list');
    this.dialog.body.appendChild(this.list);
  }

  open(tab?: Tab): void {
    if (tab) this.tab = tab;
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private show(tab: Tab): void {
    this.tab = tab;
    this.refresh();
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    for (const b of this.tabs.querySelectorAll('button')) {
      b.classList.toggle('active', b.dataset['tab'] === this.tab);
    }
    this.list.innerHTML = '';
    const inv = g.world.inventory;
    this.list.appendChild(el('div', 'shop-balance', `🐚 ${inv.shells} ${NAMES.currency}`));
    switch (this.tab) {
      case 'decor':
        this.help.textContent = UI_TEXT.decorateHelp;
        this.decorTab(g);
        break;
      case 'paint':
        this.help.textContent = UI_TEXT.paintHelp;
        this.paintTab();
        break;
      case 'plant':
        this.help.textContent = UI_TEXT.orchardHelp;
        this.plantTab(g);
        break;
      case 'toys':
        this.help.textContent = UI_TEXT.toyHelp.ball;
        this.toysTab(g);
        break;
      case 'workshop':
        this.help.textContent = UI_TEXT.workshopHelp;
        this.workshopTab(g);
        break;
    }
  }

  private row(title: string, sub: string, ...buttons: HTMLButtonElement[]): HTMLDivElement {
    const row = el('div', 'shop-row');
    const text = el('div');
    text.append(el('strong', undefined, title), el('small', undefined, sub));
    row.append(text, ...buttons);
    return row;
  }

  private decorTab(g: Game): void {
    for (const kind of DECOR_KINDS) {
      const owned = g.world.inventory.decor[kind] ?? 0;
      const price = decorPrice(kind);
      const buy = button(
        `${price} ${NAMES.currency}`,
        () => {
          g.send({ kind: 'buyDecor', decor: kind });
          setTimeout(() => this.refresh(), 150);
        },
        'btn btn-small',
      );
      buy.disabled = g.world.inventory.shells < price;
      const place = button(
        UI_TEXT.placeDecor,
        () => this.place({ mode: 'decor', kind }, UI_TEXT.decorNames[kind]),
        'btn btn-small btn-primary',
      );
      place.disabled = owned <= 0;
      this.list.appendChild(this.row(UI_TEXT.decorNames[kind], `×${owned}`, buy, place));
    }
  }

  private paintTab(): void {
    for (const tile of TILES) {
      const paint = button(
        UI_TEXT.placeDecor,
        () => this.place({ mode: 'tile', tile }, UI_TEXT.tileNames[tile]),
        'btn btn-small btn-primary',
      );
      this.list.appendChild(this.row(UI_TEXT.tileNames[tile], UI_TEXT.tileHelp, paint));
    }
  }

  private plantTab(g: Game): void {
    let any = false;
    for (const flavor of FLAVORS) {
      const seeds = g.world.inventory.seeds[flavor] ?? 0;
      if (seeds <= 0) continue;
      any = true;
      const name = UI_TEXT.flavorNames[flavor];
      const tree = button(
        UI_TEXT.plantTree,
        () => this.place({ mode: 'plant', plantKind: 'tree', flavor }, name),
        'btn btn-small btn-primary',
      );
      const crop = button(
        UI_TEXT.plantCrop,
        () => this.place({ mode: 'plant', plantKind: 'crop', flavor }, name),
        'btn btn-small',
      );
      this.list.appendChild(this.row(`${name} ${UI_TEXT.seeds}`, `×${seeds}`, tree, crop));
    }
    if (!any) this.list.appendChild(el('span', 'help', UI_TEXT.noSeeds));
  }

  private toysTab(g: Game): void {
    for (const toy of TOY_KINDS) {
      const owned = g.world.inventory.toys[toy] ?? 0;
      const price = TOYS.prices[toy];
      const buy = button(
        `${price} ${NAMES.currency}`,
        () => {
          g.send({ kind: 'buyToy', toy });
          setTimeout(() => this.refresh(), 150);
        },
        'btn btn-small',
      );
      buy.disabled = g.world.inventory.shells < price;
      const place = button(
        UI_TEXT.placeDecor,
        () => this.place({ mode: 'toy', toy }, UI_TEXT.toyNames[toy]),
        'btn btn-small btn-primary',
      );
      place.disabled = owned <= 0;
      this.list.appendChild(
        this.row(UI_TEXT.toyNames[toy], `${UI_TEXT.toyHelp[toy]} ×${owned}`, buy, place),
      );
    }
  }

  private workshopTab(g: Game): void {
    const inv = g.world.inventory;
    this.list.appendChild(
      el('div', 'shop-note', UI_TEXT.materials(inv.wood, inv.stone, inv.reeds)),
    );
    if (!hasWorkshop(g.world)) this.list.appendChild(el('span', 'help', UI_TEXT.needsWorkshop));
    // Dye colour picker for the dye recipe.
    const dyeRow = el('label', 'field-row');
    const sel = el('select');
    for (const d of DYES) {
      const o = el('option', undefined, UI_TEXT.dyeNames[d]);
      o.value = d;
      sel.appendChild(o);
    }
    sel.value = this.dyeChoice;
    sel.addEventListener('change', () => {
      this.dyeChoice = sel.value as DyeColor;
    });
    dyeRow.append(el('strong', undefined, UI_TEXT.recipeNames.dye), sel);
    this.list.appendChild(dyeRow);
    for (const id of Object.keys(RECIPES) as RecipeId[]) {
      const r = RECIPES[id];
      const cost = [
        r.wood ? `🪵${r.wood}` : '',
        r.stone ? `🪨${r.stone}` : '',
        r.reeds ? `🌾${r.reeds}` : '',
        r.shells ? `🐚${r.shells}` : '',
      ]
        .filter(Boolean)
        .join(' ');
      const why = canCraft(g.world, id);
      const make = button(
        UI_TEXT.craftBtn,
        () => {
          g.send({ kind: 'craft', recipe: id === 'dye' ? `dye:${this.dyeChoice}` : id });
          setTimeout(() => this.refresh(), 150);
        },
        'btn btn-small btn-primary',
      );
      make.disabled = why !== null;
      const owned =
        id === 'ball'
          ? (inv.toys.ball ?? 0)
          : id === 'dye'
            ? DYES.reduce((s, d) => s + (inv.dyes[d] ?? 0), 0)
            : (inv.decor[id as DecorKind] ?? 0);
      this.list.appendChild(this.row(UI_TEXT.recipeNames[id], `${cost} · ×${owned}`, make));
    }
  }

  private place(mode: Placing, label: string): void {
    const g = this.game();
    if (!g) return;
    g.placing = mode;
    this.close();
    this.toast(UI_TEXT.placing(label));
  }
}

/** The chip label while placing. */
export function placingLabel(p: Placing): string {
  if (!p) return '';
  switch (p.mode) {
    case 'decor':
      return UI_TEXT.decorNames[p.kind];
    case 'tile':
      return UI_TEXT.tileNames[p.tile];
    case 'plant':
      return `${UI_TEXT.flavorNames[p.flavor]} ${p.plantKind === 'tree' ? UI_TEXT.plantTree : UI_TEXT.plantCrop}`;
    case 'toy':
      return UI_TEXT.toyNames[p.toy];
  }
}
