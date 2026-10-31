/**
 * The Gardener's Wheelbarrow panel (R0177; lane B round 8), opened from an act camp's crafting
 * table. Six tray slots: tap a satchel piece, a pouch charm, an essence or a key to put it in,
 * tap a tray slot to take it back out, then "Mix!". The sim decides what a mix makes; a mix that
 * matches nothing takes nothing. The recipe book lists the recipes found so far.
 */
import { RECIPES, WHEELBARROW } from '../config/dungeon-items-r8';
import { GEAR_TEXT, UI_TEXT } from '../config/strings';
import { ITEMS_R8_TEXT as T } from '../config/strings-hollow-r8-items';
import type { Game } from '../game';
import { wheelbarrowOpen } from '../sim/dungeon-wheelbarrow';
import type { BarrowSlot, NubbinType, World } from '../sim/types';
import { button, el, modal } from './dom';
import { gearGlyph, gearName } from './dungeon-gear';
import { charmLabel } from './dungeon-items';

const TYPES: NubbinType[] = ['swim', 'fly', 'run', 'power', 'normal'];

export class WheelbarrowPanel {
  private readonly dialog;
  private readonly content: HTMLDivElement;
  private tray: BarrowSlot[] = [];

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, T.barrowTitle, UI_TEXT.close);
    this.dialog.root.classList.add('hollow-gear');
    this.content = el('div', 'hollow-gear-list');
    this.dialog.body.appendChild(this.content);
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  open(): void {
    this.tray = [];
    this.render();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  private label(w: World, s: BarrowSlot): string {
    if (s.kind === 'item') {
      const it = w.gear?.items.find((x) => x.id === s.id);
      return it ? `${gearGlyph(it)} ${gearName(it)} · ${GEAR_TEXT.rarity[it.rarity] ?? ''}` : '?';
    }
    if (s.kind === 'charm') return charmLabel(s.key);
    if (s.kind === 'essence') return T.essence(s.type);
    return `${T.keyIcon[s.id] ?? ''} ${T.keyName[s.id] ?? s.id}`;
  }

  /** How many of a thing the tray already holds (so a button greys out at what is owned). */
  private inTray(match: (s: BarrowSlot) => boolean): number {
    return this.tray.filter(match).length;
  }

  private render(): void {
    const w = this.game()?.world;
    if (!w) return;
    const rows: HTMLElement[] = [];
    if (!wheelbarrowOpen(w)) {
      this.content.replaceChildren(el('p', 'help', T.barrowLocked));
      return;
    }
    rows.push(el('p', 'help', T.barrowHelp));
    // The tray.
    const tray = el('div', 'hollow-gear-buttons');
    for (let i = 0; i < WHEELBARROW.slots; i++) {
      const s = this.tray[i];
      const b = button(
        s ? `✕ ${this.label(w, s)}` : '·',
        () => {
          this.tray.splice(i, 1);
          this.render();
        },
        'btn btn-small',
      );
      b.disabled = !s;
      tray.append(b);
    }
    rows.push(tray);
    const actions = el('div', 'hollow-gear-buttons');
    const mix = button(
      T.barrowMix,
      () => {
        this.game()?.send({ kind: 'wheelbarrowMix', slots: this.tray });
        this.tray = [];
        this.render();
      },
      'btn btn-small btn-primary',
    );
    mix.disabled = !this.tray.length;
    actions.append(
      mix,
      button(
        T.barrowClear,
        () => {
          this.tray = [];
          this.render();
        },
        'btn btn-small',
      ),
    );
    rows.push(actions);
    // What can go in.
    const full = this.tray.length >= WHEELBARROW.slots;
    const add = (text: string, slot: BarrowSlot, have: number, used: number) => {
      const b = button(
        `${T.barrowAdd}: ${text}${have > 1 ? ` (${have - used})` : ''}`,
        () => {
          this.tray.push(slot);
          this.render();
        },
        'btn btn-small',
      );
      b.disabled = full || used >= have;
      return b;
    };
    const pick = el('div', 'hollow-gear-buttons');
    for (const it of w.gear?.items ?? [])
      pick.append(
        add(
          this.label(w, { kind: 'item', id: it.id }),
          { kind: 'item', id: it.id },
          1,
          this.inTray((s) => s.kind === 'item' && s.id === it.id),
        ),
      );
    for (const [k, n] of Object.entries(w.gear?.charms ?? {}))
      if (n > 0)
        pick.append(
          add(
            charmLabel(k),
            { kind: 'charm', key: k },
            n,
            this.inTray((s) => s.kind === 'charm' && s.key === k),
          ),
        );
    for (const t of TYPES) {
      const n = w.inventory.essences[t] ?? 0;
      if (n > 0)
        pick.append(
          add(
            T.essence(t),
            { kind: 'essence', type: t },
            n,
            this.inTray((s) => s.kind === 'essence' && s.type === t),
          ),
        );
    }
    for (const [k, n] of Object.entries(w.gear?.keys ?? {}))
      if (n > 0)
        pick.append(
          add(
            this.label(w, { kind: 'key', id: k }),
            { kind: 'key', id: k },
            n,
            this.inTray((s) => s.kind === 'key' && s.id === k),
          ),
        );
    rows.push(pick);
    // The recipe book.
    rows.push(el('h3', undefined, T.barrowBook));
    const known = w.gear?.recipes ?? [];
    for (const r of RECIPES)
      rows.push(el('p', 'help', known.includes(r) ? `✓ ${T.recipe[r]}` : `○ ${T.barrowUnknown}`));
    this.content.replaceChildren(...rows);
  }
}
