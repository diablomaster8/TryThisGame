import { NAMES, UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { CLIPS, frameAt, frameKey } from '../render/sprites/animations';
import { moodOf } from '../sim/needs';
import type { Nubbin } from '../sim/types';
import { button, dialogFocus, el, meter } from './dom';
import { clipFor } from '../render/world-view';

/**
 * Pocket mode: one Nubbin close up with its needs and the quick things you can do for
 * it. The sim keeps running underneath; this is just a different window onto it.
 */
export class PocketMode {
  readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly name: HTMLDivElement;
  private readonly mood: HTMLDivElement;
  private readonly meters: ReturnType<typeof meter>[];
  private readonly pickRow: HTMLDivElement;
  private id: string | null = null;
  private timer = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'pocket');
    this.root.hidden = true;
    const card = el('div', 'pocket-card');
    this.name = el('div', 'btn-name');
    this.mood = el('div', 'help');
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'pocket-portrait';
    this.pickRow = el('div', 'race-tiers');
    const needs = el('div', 'sheet-needs');
    this.meters = [
      meter(UI_TEXT.hunger, '🍎'),
      meter(UI_TEXT.energy, '⚡'),
      meter(UI_TEXT.happiness, '☺'),
      meter(UI_TEXT.affection, '♥'),
      meter(UI_TEXT.trust, '🤝'),
    ];
    for (const m of this.meters) needs.appendChild(m.root);
    const send = (make: (id: string) => Parameters<Game['send']>[0]) => {
      const g = this.game();
      if (g && this.id) g.send(make(this.id));
    };
    const actions = el('div', 'sheet-actions');
    actions.append(
      button(UI_TEXT.feed, () => send((id) => ({ kind: 'feed', nubbinId: id })), 'btn btn-small'),
      button(UI_TEXT.pet, () => send((id) => ({ kind: 'pet', nubbinId: id })), 'btn btn-small'),
      button(
        UI_TEXT.hug,
        () => send((id) => ({ kind: 'interact', nubbinId: id, action: 'hug' })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.tickle,
        () => send((id) => ({ kind: 'interact', nubbinId: id, action: 'tickle' })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.tuckIn,
        () => send((id) => ({ kind: 'interact', nubbinId: id, action: 'tuckIn' })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.playCatch,
        () => send((id) => ({ kind: 'playCatch', nubbinId: id })),
        'btn btn-small',
      ),
    );
    card.append(
      this.pickRow,
      this.canvas,
      this.name,
      this.mood,
      needs,
      actions,
      button(UI_TEXT.close, () => this.close(), 'btn btn-primary'),
    );
    this.root.appendChild(card);
    parent.appendChild(this.root);
    // A dialog named by the Nubbin's name; Escape closes it (the HUD's Escape does too).
    this.focus = dialogFocus(this.root, card, this.name, () => this.close());
  }

  private readonly focus: ReturnType<typeof dialogFocus>;

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  open(id?: string | null): void {
    const g = this.game();
    if (!g) return;
    const first = g.world.nubbins.find((n) => n.stage !== 'egg') ?? g.world.nubbins[0];
    this.id = (id && g.world.nubbins.some((n) => n.id === id) ? id : first?.id) ?? null;
    this.root.hidden = false;
    this.focus.opened();
    this.refreshPicks();
    clearInterval(this.timer);
    this.timer = window.setInterval(() => this.refresh(), 150);
    this.refresh();
  }

  close(): void {
    clearInterval(this.timer);
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.focus.closed();
  }

  private refreshPicks(): void {
    const g = this.game();
    if (!g) return;
    this.pickRow.innerHTML = '';
    for (const n of g.world.nubbins) {
      const b = button(
        n.name,
        () => {
          this.id = n.id;
          this.refreshPicks();
        },
        'btn btn-small',
      );
      if (n.id === this.id) b.classList.add('active');
      this.pickRow.appendChild(b);
    }
  }

  private refresh(): void {
    const g = this.game();
    const n = g && this.id ? g.world.nubbins.find((x) => x.id === this.id) : undefined;
    if (!g || !n) {
      this.name.textContent = NAMES.creature;
      return;
    }
    this.name.textContent = n.name;
    this.mood.textContent = `${moodOf(n)} · ${n.behavior.state}`;
    this.meters[0]!.set(n.needs.hunger);
    this.meters[1]!.set(n.needs.energy);
    this.meters[2]!.set((n.needs.happiness + 100) / 200);
    this.meters[3]!.set(n.needs.affection / 100);
    this.meters[4]!.set(n.trust / 100);
    this.drawPortrait(g, n);
  }

  private drawPortrait(g: Game, n: Nubbin): void {
    const sheet = g.view.sheets.forNubbin(n);
    const clip = n.stage === 'egg' || n.stage === 'cocoon' ? 'idle' : clipFor(n);
    const def = CLIPS[clip as keyof typeof CLIPS];
    const frame = def ? frameAt(def, performance.now()) : 0;
    const rect =
      sheet.frames.get(frameKey(clip, 'front', frame)) ?? sheet.frames.values().next().value;
    const S = 3;
    this.canvas.width = 64 * S;
    this.canvas.height = 64 * S;
    const ctx = this.canvas.getContext('2d');
    if (!ctx || !rect) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      sheet.texture.image as HTMLCanvasElement,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      0,
      0,
      64 * S,
      64 * S,
    );
  }
}
