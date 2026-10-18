import {
  FAMILY_LABELS,
  KEEPER_LOOK_NAMES,
  NAMES,
  TRAINER_LABELS,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import type { Game } from '../game';
import { frameKey } from '../render/sprites/animations';
import { TRAINERS, type Trainer } from '../sim/trainers';
import { button, el, modal } from './dom';

/** Pick the playable Keeper. Each trainer shows their side and what their eggs tend to hatch. */
export class TrainersMenu {
  private readonly dialog;
  private readonly list: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.trainers, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.trainersHelp));
    this.list = el('div', 'roster-list');
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

  private refresh(): void {
    const g = this.game();
    if (!g) return;
    this.list.innerHTML = '';
    for (const t of TRAINERS) this.list.appendChild(this.row(g, t));
  }

  private row(g: Game, t: Trainer): HTMLDivElement {
    const row = el('div', 'roster-row');
    row.appendChild(this.portrait(g, t));
    const body = el('div', 'roster-body');
    const label = TRAINER_LABELS[t.id] ?? { name: t.id, blurb: '' };
    const side = t.band === 'sun' ? `☀ ${NAMES.playerSun}` : `☾ ${NAMES.playerMoon}`;
    body.appendChild(el('div', 'btn-name', KEEPER_LOOK_NAMES[t.id] ?? label.name));
    body.appendChild(el('div', 'roster-line', `${side} · ${label.blurb}`));
    const total = t.eggs.chao + t.eggs.pocket + t.eggs.digi;
    const eggs = (['chao', 'pocket', 'digi'] as const)
      .filter((f) => t.eggs[f] > 0)
      .map((f) => `${FAMILY_LABELS[f]} ${Math.round((t.eggs[f] / total) * 100)}%`)
      .join(' · ');
    body.appendChild(
      el(
        'div',
        'roster-stats',
        `${UI_TEXT.eggsLabel}: ${eggs} · ${UI_TEXT.favouriteLabel}: ${TYPE_LABELS[t.favourite]}`,
      ),
    );
    const active = g.world.trainer === t.id;
    const choose = button(
      active ? UI_TEXT.activeTrainer : UI_TEXT.chooseTrainer,
      () => {
        g.send({ kind: 'setTrainer', id: t.id });
        this.toast(UI_TEXT.trainerChosen(label.name));
        setTimeout(() => this.refresh(), 150);
      },
      'btn btn-small',
    );
    choose.disabled = active;
    if (active) choose.classList.add('active');
    body.appendChild(choose);
    row.appendChild(body);
    return row;
  }

  private portrait(g: Game, t: Trainer): HTMLCanvasElement {
    const sheet = g.view.sheets.keeper(t.id);
    const rect = sheet.frames.get(frameKey('idle', 'front', 0));
    const c = el('canvas', 'roster-portrait');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    if (ctx && rect) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        sheet.texture.image as HTMLCanvasElement,
        rect.x,
        rect.y,
        rect.w,
        rect.h,
        0,
        0,
        64,
        64,
      );
    }
    return c;
  }
}
