/**
 * LOOK-60 (R0428): the dress-up mirror. The Nubbin turns on a pedestal through all eight
 * views while the player taps hats down the side to try them on; Wear commits through the
 * sim's `wearHat`. Hats not owned yet show as dark silhouettes with where they come from,
 * so the panel doubles as a wish list. The preview is the Pixel sheet in both modes, built
 * with the same look rules as the Grove (`SheetCache.forNubbin`). Every button is at least
 * 44 px and the list scrolls under one thumb.
 */
import { reducedMotion } from '../platform/motion';
import { COSMETICS } from '../config/cosmetics';
import { BELT_TEXT, WARDROBE_TEXT } from '../config/strings-look';
import { LADDER_TEXT } from '../config/strings-battle-r6';
import { ladderBelt } from '../sim/battle/ladder';
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { DRAWN_ANGLES } from '../render/sprites/angles';
import { frameKey } from '../render/sprites/animations';
import { SheetCache } from '../render/sprites/sheets';
import type { Nubbin } from '../sim/types';
import { mayWear } from '../sim/remembrance'; /* Lane E r9 */
import { button, el, modal } from './dom';

/** The eight views, the five drawn angles and three mirrored back round to the front. */
const TURN = [...DRAWN_ANGLES, ...DRAWN_ANGLES.slice(1, -1).reverse()];

export class Wardrobe {
  private readonly dialog;
  private readonly canvas: HTMLCanvasElement;
  private readonly status: HTMLParagraphElement;
  private readonly list: HTMLDivElement;
  private readonly wear: HTMLButtonElement;
  private readonly cache = new SheetCache(() => performance.now(), {
    maxSheets: 12,
    idleMs: 30000,
  });
  private id: string | null = null;
  private readonly belt: HTMLButtonElement;
  private trying: string | null = null;
  private spin = 0;
  private step = 0;
  private label = '';

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly onChange: () => void,
  ) {
    this.dialog = modal(parent, WARDROBE_TEXT.title, UI_TEXT.close);
    this.dialog.root.classList.add('wardrobe');
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = 128;
    this.canvas.className = 'wardrobe-mirror';
    this.status = el('p', 'help', WARDROBE_TEXT.help);
    this.wear = button(WARDROBE_TEXT.wear, () => this.commit(), 'btn btn-primary wardrobe-wear');
    this.list = el('div', 'wardrobe-list');
    // LOOK-69: a Nubbin with a Dojo belt can take it off or put it back on.
    this.belt = button('', () => this.flipBelt(), 'btn btn-small wardrobe-belt');
    this.belt.hidden = true;
    this.dialog.body.append(this.canvas, this.status, this.wear, this.belt, this.list);
  }

  open(nubbinId: string): void {
    this.id = nubbinId;
    const n = this.nubbin();
    if (!n) return;
    this.trying = n.hat;
    this.build();
    this.syncBelt(n, !n.hideBelt);
    this.preview();
    this.stopSpin();
    if (!reducedMotion())
      this.spin = window.setInterval(() => {
        this.step++;
        this.draw();
      }, 350);
    this.dialog.show();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private nubbin(): Nubbin | undefined {
    return this.game()?.world.nubbins.find((x) => x.id === this.id);
  }

  private stopSpin(): void {
    if (this.spin) clearInterval(this.spin);
    this.spin = 0;
  }

  /** The hat buttons: nothing, then every wearable, owned ones first. */
  private build(): void {
    const g = this.game();
    if (!g) return;
    const owned = new Set(g.world.inventory.hats);
    this.list.innerHTML = '';
    this.list.appendChild(this.item(null, WARDROBE_TEXT.none, true, ''));
    const all = [...COSMETICS].sort((a, b) => Number(owned.has(b.id)) - Number(owned.has(a.id)));
    for (const c of all) {
      // Lane E r9 (R0424): the remembrance flower only for a friend of someone on the hill.
      const n = this.nubbin();
      const has = owned.has(c.id) && (!n || mayWear(n, c.id));
      this.list.appendChild(
        this.item(c.id, c.label, has, has ? '' : (WARDROBE_TEXT.locked[c.source] ?? '')),
      );
    }
  }

  private item(id: string | null, label: string, owned: boolean, note: string): HTMLElement {
    const b = button(
      owned ? label : `🔒 ${label}`,
      () => {
        this.trying = id;
        this.preview();
      },
      `btn wardrobe-item${owned ? '' : ' locked'}`,
    );
    b.disabled = !owned;
    if (note) b.appendChild(el('small', 'flavour', note));
    b.dataset.hat = id ?? '';
    return b;
  }

  private preview(): void {
    const n = this.nubbin();
    if (!n) return;
    const label = this.trying
      ? (COSMETICS.find((c) => c.id === this.trying)?.label ?? this.trying)
      : WARDROBE_TEXT.none;
    this.label = label;
    this.status.textContent =
      this.trying === n.hat ? WARDROBE_TEXT.wearing(n.name, label) : WARDROBE_TEXT.trying(label);
    this.wear.textContent = this.trying ? WARDROBE_TEXT.wear : WARDROBE_TEXT.takeOff;
    this.wear.disabled = this.trying === n.hat;
    for (const b of this.list.querySelectorAll<HTMLButtonElement>('.wardrobe-item'))
      b.classList.toggle('on', (b.dataset.hat || null) === this.trying);
    this.draw();
  }

  private draw(): void {
    const n = this.nubbin();
    const ctx = this.canvas.getContext('2d');
    if (!n || !ctx) return;
    let sheet;
    try {
      sheet = this.cache.forNubbin({ ...n, hat: this.trying });
    } catch {
      return;
    }
    const i = this.step % TURN.length;
    const rect = sheet.frames.get(frameKey('idle', TURN[i]!, 0));
    if (!rect) return;
    ctx.clearRect(0, 0, 128, 128);
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    if (i >= DRAWN_ANGLES.length) {
      ctx.translate(128, 0);
      ctx.scale(-1, 1);
    }
    const img = sheet.texture.image as HTMLCanvasElement;
    ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, 128, 128);
    ctx.restore();
  }

  private syncBelt(n: Nubbin, worn: boolean): void {
    const b = ladderBelt(n);
    this.belt.hidden = b === 0;
    if (b === 0) return;
    const name = LADDER_TEXT.belt(b).toLowerCase();
    this.belt.textContent = worn ? BELT_TEXT.off(name) : BELT_TEXT.wear(name);
    this.belt.setAttribute('aria-pressed', String(worn));
  }

  private flipBelt(): void {
    const g = this.game();
    const n = this.nubbin();
    if (!g || !n) return;
    const on = !!n.hideBelt;
    g.send({ kind: 'wearBelt', nubbinId: n.id, on });
    this.syncBelt(n, on);
    this.onChange();
  }

  private commit(): void {
    const g = this.game();
    if (!g || !this.id) return;
    g.send({ kind: 'wearHat', nubbinId: this.id, hat: this.trying });
    // The sim applies it on its next step; show it as worn now.
    const n = this.nubbin();
    if (n) this.status.textContent = WARDROBE_TEXT.wearing(n.name, this.label);
    this.wear.disabled = true;
    this.onChange();
  }
}
