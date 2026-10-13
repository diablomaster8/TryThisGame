import {
  GROVE_LABELS,
  NAMES,
  SPECIES_LABELS,
  STAT_LABELS,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import type { Game } from '../game';
import type { SimEvent } from '../sim/types';
import { button, el } from './dom';

/**
 * The evolution celebration: a short card with the new form, the grade that went up and
 * any Grove unlock. Kid-friendly, dismissed with one tap or on its own.
 */
export class Celebration {
  private readonly root: HTMLDivElement;
  private readonly title: HTMLHeadingElement;
  private readonly lines: HTMLDivElement;
  private timer = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'celebrate');
    this.root.hidden = true;
    const card = el('div', 'celebrate-card');
    this.title = el('h2');
    this.lines = el('div', 'celebrate-lines');
    card.append(
      el('div', 'celebrate-sparkle', '✦ ✧ ✦'),
      this.title,
      this.lines,
      button('✓', () => this.hide(), 'btn btn-primary'),
    );
    this.root.appendChild(card);
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.hide();
    });
    parent.appendChild(this.root);
  }

  /** Show for an evolution event. */
  show(e: Extract<SimEvent, { kind: 'evolved' }>): void {
    const g = this.game();
    if (!g) return;
    const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
    const name = n?.name ?? NAMES.creature;
    const band =
      e.band === 'sun'
        ? NAMES.alignmentSun
        : e.band === 'moon'
          ? NAMES.alignmentMoon
          : NAMES.alignmentNeutral;
    this.title.textContent = UI_TEXT.evolvedTitle(name);
    this.lines.innerHTML = '';
    this.lines.appendChild(
      el(
        'p',
        'celebrate-form',
        e.species === 'chao'
          ? UI_TEXT.evolvedForm(band, TYPE_LABELS[e.type])
          : `${SPECIES_LABELS[e.species] ?? e.species} · ${band} ${TYPE_LABELS[e.type]}`,
      ),
    );
    if (e.upgraded && n) {
      this.lines.appendChild(
        el('p', undefined, UI_TEXT.gradeUp(STAT_LABELS[e.upgraded], n.stats[e.upgraded].grade)),
      );
    }
    if (e.groveUnlocked) {
      this.lines.appendChild(
        el('p', undefined, UI_TEXT.groveUnlocked(GROVE_LABELS[e.groveUnlocked])),
      );
    }
    this.root.hidden = false;
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.hide(), 6000);
  }

  hide(): void {
    this.root.hidden = true;
  }
}
