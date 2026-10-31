import { AFFIXES, BASES, KEEPER_SLOTS, RARITIES, type GearStat } from '../config/dungeon-loot';
import { GEAR_TEXT } from '../config/strings-dungeon';
import type { Game } from '../game';
import type { GearItem, World } from '../sim/types';
import { button, el, modal } from './dom';
import { ITEMS_R8_TEXT as R8 } from '../config/strings-hollow-r8-items';
import { itemExtraStat } from '../sim/dungeon-charms';
import { charmLabel } from './dungeon-items';

/** A piece's name: its prefix, its base and its suffix ("Bouncy Boots of the Owl"). */
export function gearName(item: GearItem): string {
  // Lane B round 8: named pieces (R0172) and Charm Chains (R0173) carry their own names.
  if (item.unique) return R8.uniqueName[item.unique] ?? item.unique;
  if (item.setPiece) return R8.pieceName[item.setPiece] ?? item.setPiece;
  if (item.chain) return R8.chain[item.chain] ?? item.chain;
  const pre = item.affixes.map((a) => GEAR_TEXT.prefix[a.id]).find(Boolean);
  const suf = item.affixes.map((a) => GEAR_TEXT.suffix[a.id]).find(Boolean);
  return [pre, GEAR_TEXT.base[item.base] ?? item.base, suf].filter(Boolean).join(' ');
}

/** The tier's shape, so colour is never the only signal (R0163). */
export function gearGlyph(item: GearItem): string {
  return RARITIES.find((r) => r.id === item.rarity)?.glyph ?? '●';
}

function statLine(item: GearItem): string {
  const parts: string[] = [];
  const base = BASES.find((b) => b.id === item.base);
  if (base?.stat)
    parts.push(`${GEAR_TEXT.stat[base.stat]} +${base.value + base.perLevel * (item.level - 1)}`);
  for (const a of item.affixes) {
    const d = AFFIXES.find((x) => x.id === a.id);
    if (d) parts.push(`${GEAR_TEXT.stat[d.stat]} +${a.value}`);
  }
  // Charms, chains and uniques (lane B round 8).
  for (const stat of Object.keys(GEAR_TEXT.stat) as GearStat[]) {
    const v = itemExtraStat(item, stat);
    if (v) parts.push(`${GEAR_TEXT.stat[stat]} +${v}`);
  }
  return parts.map((p) => p.replace(/(\.\d\d)\d+/, '$1')).join(' · ');
}

/**
 * The gear panel (R0164): what the satchel holds, each piece with its shape, tier word and
 * stats, and buttons to wear it (the Keeper's slots) or give it to a party Nubbin (theirs).
 */
export class GearPanel {
  private readonly dialog;
  private readonly list: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, GEAR_TEXT.title, '✕');
    this.dialog.root.classList.add('hollow-gear');
    this.list = el('div', 'hollow-gear-list');
    this.dialog.body.append(el('p', 'hollow-gear-help', GEAR_TEXT.help), this.list);
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

  private send(cmd: Parameters<Game['send']>[0]): void {
    this.game()?.send(cmd);
    this.render();
  }

  private render(): void {
    const w = this.game()?.world;
    if (!w) return;
    const items = w.gear?.items ?? [];
    if (!items.length) {
      this.list.replaceChildren(el('p', '', GEAR_TEXT.empty), ...this.pouch(w));
      return;
    }
    this.list.replaceChildren(...this.pouch(w), ...items.map((it) => this.row(w, it)));
  }

  private row(w: World, it: GearItem): HTMLElement {
    const tier = RARITIES.find((r) => r.id === it.rarity);
    const row = el('div', 'hollow-gear-row');
    const name = el('div', 'hollow-gear-name');
    const glyph = el('span', 'hollow-gear-glyph', gearGlyph(it));
    if (tier) glyph.style.color = tier.colour;
    name.append(glyph, ` ${gearName(it)} · ${GEAR_TEXT.rarity[it.rarity] ?? ''} · Lv ${it.level}`);
    const info = el('div', 'hollow-gear-stats', statLine(it));
    const who = wearer(w, it.id);
    const buttons = el('div', 'hollow-gear-buttons');
    if (who !== null) {
      info.append(` · ${GEAR_TEXT.worn(who)}`);
      buttons.append(
        button(
          GEAR_TEXT.takeOff,
          () => this.send({ kind: 'unequipGear', itemId: it.id }),
          'btn btn-small',
        ),
      );
    } else if ((KEEPER_SLOTS as readonly string[]).includes(it.slot)) {
      buttons.append(
        button(
          GEAR_TEXT.wearKeeper,
          () => this.send({ kind: 'equipGear', itemId: it.id, nubbinId: null }),
          'btn btn-small btn-primary',
        ),
      );
    } else {
      const ids = w.dungeon?.party.length ? w.dungeon.party : w.nubbins.map((n) => n.id);
      for (const id of ids.slice(0, 3)) {
        const n = w.nubbins.find((x) => x.id === id);
        if (!n || n.stage === 'egg') continue;
        buttons.append(
          button(
            GEAR_TEXT.wearOn(n.name),
            () => this.send({ kind: 'equipGear', itemId: it.id, nubbinId: id }),
            'btn btn-small btn-primary',
          ),
        );
      }
    }
    row.append(name, info, buttons);
    const sockets = this.sockets(w, it);
    if (sockets) row.append(sockets);
    return row;
  }

  /** R0173, R0183: the charm pouch and the keys, above the pieces. */
  private pouch(w: World): HTMLElement[] {
    const charms = Object.entries(w.gear?.charms ?? {}).filter(([, n]) => n > 0);
    const out: HTMLElement[] = [el('h3', undefined, R8.pouchTitle)];
    out.push(
      el(
        'p',
        'help',
        charms.length
          ? charms.map(([k, n]) => `${charmLabel(k)} ×${n}`).join(' · ')
          : R8.pouchEmpty,
      ),
    );
    const keys = Object.entries(w.gear?.keys ?? {}).filter(([, n]) => n > 0);
    if (keys.length)
      out.push(
        el(
          'p',
          'help',
          `${R8.keysTitle}: ${keys.map(([k, n]) => `${R8.keyIcon[k] ?? ''} ${R8.keyName[k] ?? k} ×${n}`).join(' · ')}`,
        ),
      );
    return out;
  }

  /** R0173: a socketed piece's sockets as pips, a button per pouch charm, and "take out". */
  private sockets(w: World, it: GearItem): HTMLElement | null {
    const total = it.sockets ?? 0;
    if (!total) return null;
    const used = it.socketed ?? [];
    const box = el('div', 'hollow-gear-sockets');
    const pips = '◆'.repeat(used.length) + '◇'.repeat(total - used.length);
    box.append(
      el('div', 'hollow-gear-stats', `${R8.sockets(used.length, total)} ${pips}`),
      ...used.map((k) => el('div', 'hollow-gear-stats', `· ${charmLabel(k)}`)),
    );
    const buttons = el('div', 'hollow-gear-buttons');
    if (used.length < total)
      for (const [k, n] of Object.entries(w.gear?.charms ?? {}))
        if (n > 0)
          buttons.append(
            button(
              R8.socketIn(charmLabel(k)),
              () => this.send({ kind: 'socketCharm', itemId: it.id, charm: k }),
              'btn btn-small',
            ),
          );
    if (used.length)
      buttons.append(
        button(
          R8.socketOut,
          () => this.send({ kind: 'unsocketCharms', itemId: it.id }),
          'btn btn-small',
        ),
      );
    box.append(buttons);
    return box;
  }
}

function wearer(w: World, id: string): string | null {
  const g = w.gear;
  if (!g) return null;
  if (Object.values(g.keeper).includes(id)) return GEAR_TEXT.you;
  for (const [nid, slots] of Object.entries(g.nubbins))
    if (Object.values(slots).includes(id)) return w.nubbins.find((n) => n.id === nid)?.name ?? '';
  return null;
}
