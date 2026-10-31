/**
 * The Hollow on a phone (R0193, DUNG-50). Underground on a screen at most `HOLLOW_R9D.phone.maxWidth` wide,
 * the eight grove tabs give way to a one-thumb bar of five: Map, Acorn, Sack, Engage and
 * More (which brings the grove tabs and the floor bar's own buttons back). The buttons that
 * only show when they apply (a waypoint stone, a camp service, a stray asking, sneak past)
 * move down into a row just above the bar while the phone layout is on, and back after,
 * so every Hollow action sits in the bottom of the screen. The minimap shrinks to a round
 * 96 px corner map under the top bar (CSS in dungeon.css, `html.hollow-phone`); a tap on it
 * opens the full map. The stash, wheelbarrow, gamble stall and gear panels open as
 * full-width bottom sheets (`.hollow-sheet`).
 */
import { HOLLOW_R9D } from '../config/dungeon-r9-d';
import { HOLLOW_R9D_TEXT as T } from '../config/strings-hollow-r9-d';
import type { Game } from '../game';
import { cellDist, cellOf, runFloor } from '../sim/dungeon';
import type { World } from '../sim/types';
import { button, el } from './dom';

const PHONE = HOLLOW_R9D.phone;

export interface PhoneBarHooks {
  map(): void;
  acorn(): void;
  acornState(world: World): { label: string; disabled: boolean; hidden: boolean };
  sack(): void;
  /** The floor bar's buttons that come and go; they ride above the phone bar on a phone. */
  contextual: readonly HTMLButtonElement[];
}

export class HollowPhoneBar {
  readonly root: HTMLDivElement;
  private readonly ctx: HTMLDivElement;
  private readonly acornBtn: HTMLButtonElement;
  private readonly engageBtn: HTMLButtonElement;
  private readonly moreBtn: HTMLButtonElement;
  private more = false;
  private on = false;
  /** Where each contextual button lives when the phone layout is off. */
  private readonly homes = new Map<HTMLButtonElement, { parent: Node; next: Node | null }>();

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly hooks: PhoneBarHooks,
  ) {
    this.root = el('div', 'hollow-phone-bar');
    this.root.setAttribute('role', 'toolbar');
    this.root.setAttribute('aria-label', T.barAria);
    this.root.hidden = true;
    this.ctx = el('div', 'hollow-phone-ctx');
    const row = el('div', 'hollow-phone-row');
    const mapBtn = button(T.barMap, () => hooks.map(), 'btn hollow-phone-btn');
    this.acornBtn = button(T.barAcorn, () => hooks.acorn(), 'btn hollow-phone-btn');
    const sackBtn = button(T.barSack, () => hooks.sack(), 'btn hollow-phone-btn');
    this.engageBtn = button(T.barEngage, () => this.engage(), 'btn hollow-phone-btn');
    this.moreBtn = button(T.barMore, () => this.setMore(!this.more), 'btn hollow-phone-btn');
    this.moreBtn.setAttribute('aria-expanded', 'false');
    row.append(mapBtn, this.acornBtn, sackBtn, this.engageBtn, this.moreBtn);
    this.root.append(this.ctx, row);
    parent.appendChild(this.root);
  }

  /** The nearest pack still about, within a few cells of the Keeper, or null. */
  private target(world: World): { x: number; z: number } | null {
    const run = world.dungeon;
    const f = runFloor(world);
    if (!run || !f || run.encounter) return null;
    const k = cellOf(f, world.keeper.pos);
    let best: { x: number; z: number } | null = null;
    let bestD = Infinity;
    for (const p of run.packs ?? []) {
      if (p.state === 'beaten') continue;
      const d = cellDist(k, cellOf(f, p.pos));
      if (d < bestD && d <= PHONE.engageCells) {
        bestD = d;
        best = p.pos;
      }
    }
    return best;
  }

  /** ⚔: walk to the nearest pack; touching it starts the play-fight as a tap on it would. */
  private engage(): void {
    const g = this.game();
    const to = g && this.target(g.world);
    if (g && to) g.send({ kind: 'moveKeeperTo', pos: { x: to.x, z: to.z } });
  }

  private setMore(on: boolean): void {
    this.more = on;
    this.moreBtn.textContent = on ? T.barLess : T.barMore;
    this.moreBtn.setAttribute('aria-expanded', String(on));
    document.documentElement.classList.toggle('hollow-more', on && this.on);
  }

  /** Every frame from the floor bar; `shown` is false while the floor bar hides (a fight). */
  refresh(world: World, shown: boolean): void {
    const on =
      shown &&
      world.location === 'dungeon' &&
      !!world.dungeon &&
      window.innerWidth <= PHONE.maxWidth;
    if (on !== this.on) {
      this.on = on;
      this.root.hidden = !on;
      document.documentElement.classList.toggle('hollow-phone', on);
      if (on) this.dock();
      else this.undock();
      this.setMore(on && this.more);
      if (!on) document.documentElement.classList.remove('hollow-ctx-on');
    }
    if (!on) return;
    // The Run and camera buttons step up while a contextual button is showing.
    document.documentElement.classList.toggle(
      'hollow-ctx-on',
      this.hooks.contextual.some((b) => !b.hidden && b.offsetParent !== null),
    );
    const a = this.hooks.acornState(world);
    this.acornBtn.disabled = a.disabled || a.hidden;
    this.acornBtn.title = a.label;
    const engage = !!this.target(world);
    this.engageBtn.disabled = !engage;
    this.engageBtn.classList.toggle('is-ready', engage);
  }

  private dock(): void {
    for (const b of this.hooks.contextual) {
      if (!b.parentNode || this.homes.has(b)) continue;
      this.homes.set(b, { parent: b.parentNode, next: b.nextSibling });
      this.ctx.appendChild(b);
    }
  }

  private undock(): void {
    for (const [b, home] of this.homes) {
      const next = home.next && home.next.parentNode === home.parent ? home.next : null;
      home.parent.insertBefore(b, next);
    }
    this.homes.clear();
  }
}
