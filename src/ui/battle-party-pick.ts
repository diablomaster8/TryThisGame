import '../battle.css';
import { BATTLE_SCREEN_TEXT as T, TYPE_WORDS } from '../config/strings-battle';
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { PX } from '../render/sprites/pixel-canvas';
import { frameKey } from '../render/sprites/animations';
import { combatantOf, typeOf } from '../sim/battle';
import type { Nubbin } from '../sim/types';
import { button, el, modal } from './dom';

/**
 * The party sheet (recs FIGHT-19): pick one to three hatched Nubbins (never an egg or a
 * cocoon), each shown with a portrait, Battle Level, type icon and word. The order picked is
 * the order they come in; the first starts. The last party is remembered in
 * `world.battlePrefs.party` and offered again.
 */
export class PartyPick {
  private readonly dialog;
  private readonly list: HTMLDivElement;
  private readonly go: HTMLButtonElement;
  private picked: string[] = [];
  private onPick: ((ids: string[]) => void) | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, T.partyTitle, UI_TEXT.close);
    this.dialog.root.classList.add('bs-pick');
    this.dialog.body.appendChild(el('p', 'help', T.partyHelp));
    this.list = el('div', 'bs-pick-list');
    this.go = button(T.partyGo, () => this.confirm(), 'btn btn-primary bs-big');
    this.dialog.body.append(this.list, this.go);
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  close(): void {
    this.dialog.hide();
  }

  /** Shows the sheet; `prefer` leads when no party is remembered yet. */
  open(onPick: (ids: string[]) => void, max = 3, prefer?: string): void {
    const g = this.game();
    if (!g) return;
    const ready = this.ready(g);
    const last = (g.world.battlePrefs?.party ?? []).filter((id) => ready.some((n) => n.id === id));
    const first = ready.find((n) => n.id === prefer) ?? ready[0];
    this.picked = (last.length ? last : first ? [first.id] : []).slice(0, max);
    this.onPick = onPick;
    this.render(g, max);
    this.dialog.show();
  }

  private ready(g: Game): Nubbin[] {
    return g.world.nubbins.filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon');
  }

  private render(g: Game, max: number): void {
    this.list.innerHTML = '';
    for (const n of this.ready(g)) {
      const at = this.picked.indexOf(n.id);
      const t = TYPE_WORDS[typeOf(n)];
      const lv = combatantOf(n, g.world).level;
      const b = button('', () => this.toggle(g, n.id, max), 'btn bs-pick-row');
      b.append(this.portrait(g, n), el('span', 'bs-pick-name', n.name));
      b.append(el('small', undefined, `${T.battleLevel(lv)} · ${t.icon} ${t.name}`));
      b.append(el('span', 'bs-pick-at', at >= 0 ? String(at + 1) : ''));
      b.setAttribute('aria-pressed', at >= 0 ? 'true' : 'false');
      this.list.appendChild(b);
    }
    this.go.disabled = this.picked.length === 0;
    this.go.title = this.picked.length ? '' : T.partyNone;
  }

  private portrait(g: Game, n: Nubbin): HTMLCanvasElement {
    return nubbinPortrait(g, n);
  }

  private toggle(g: Game, id: string, max: number): void {
    const at = this.picked.indexOf(id);
    if (at >= 0) this.picked.splice(at, 1);
    else if (this.picked.length < max) this.picked.push(id);
    else this.picked = [...this.picked.slice(1), id];
    this.render(g, max);
  }

  private confirm(): void {
    const g = this.game();
    if (!g || this.picked.length === 0) return;
    g.send({ kind: 'battlePrefs', prefs: { party: this.picked } });
    const ids = [...this.picked];
    const done = this.onPick;
    this.onPick = null;
    this.dialog.hide();
    done?.(ids);
  }
}

/**
 * A Nubbin's front-facing idle frame on its own canvas (the party sheet, the pre-bout sheet),
 * or a species' sheet when `n` is a species id (a foe on the "Who?" pick or the Inspect card).
 */
export function nubbinPortrait(g: Game, n: Nubbin | string): HTMLCanvasElement {
  const c = el('canvas', 'bs-portrait');
  try {
    const sheet = typeof n === 'string' ? g.view.sheets.species(n) : g.view.sheets.forNubbin(n);
    const rect = sheet.frames.get(frameKey('idle', 'front', 0));
    const ctx = c.getContext('2d');
    if (rect && ctx) {
      c.width = rect.w / PX;
      c.height = rect.h / PX;
      ctx.imageSmoothingEnabled = false;
      const img = sheet.texture.image as HTMLCanvasElement;
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, c.width, c.height);
    }
  } catch {
    // No portrait: the name and type still say who it is.
  }
  return c;
}
