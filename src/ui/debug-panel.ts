import { SIM } from '../config/tuning';
import { STAT_LABELS, TYPE_LABELS, UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { clearSave } from '../platform/storage';
import { NUBBIN_TYPES, STAT_KEYS } from '../sim/types';
import { createWorld } from '../sim/world';
import { button, el } from './dom';

/**
 * Debug panel (backtick or triple-tap the logo): time speed, give items, force
 * evolve / end of life, hidden values of the selected Nubbin, reset save.
 */
export class DebugPanel {
  readonly root: HTMLDivElement;
  private readonly values: HTMLPreElement;
  private readonly speedButtons: HTMLButtonElement[] = [];

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly selected: () => string | null,
  ) {
    this.root = el('div', 'debug');
    this.root.hidden = true;
    this.root.appendChild(el('h2', undefined, UI_TEXT.debugTitle));

    const speed = el('div', 'debug-row');
    speed.appendChild(el('span', undefined, UI_TEXT.debugSpeed));
    for (const s of SIM.timeScales) {
      const b = button(
        `×${s}`,
        () => {
          this.game()?.setTimeScale(s);
          this.syncSpeed();
        },
        'btn btn-small',
      );
      this.speedButtons.push(b);
      speed.appendChild(b);
    }
    this.root.appendChild(speed);

    const give = el('div', 'debug-row');
    give.appendChild(el('span', undefined, UI_TEXT.debugGive));
    give.append(
      button(
        '+100 Shells',
        () => this.game()?.send({ kind: 'debugGive', what: 'shells', amount: 100 }),
        'btn btn-small',
      ),
      button(
        '+5 fruit',
        () => this.game()?.send({ kind: 'debugGive', what: 'fruit', amount: 5 }),
        'btn btn-small',
      ),
      button('+critter (M2)', () => undefined, 'btn btn-small'),
      button('+essence (M2)', () => undefined, 'btn btn-small'),
    );
    this.root.appendChild(give);

    const force = el('div', 'debug-row');
    force.append(
      button(
        UI_TEXT.debugHatchNow,
        () => this.withSelected((id) => ({ kind: 'debugHatchNow', nubbinId: id })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.debugFillNeeds,
        () => this.withSelected((id) => ({ kind: 'debugFillNeeds', nubbinId: id })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.debugForceEvolve,
        () => this.withSelected((id) => ({ kind: 'debugForceEvolve', nubbinId: id })),
        'btn btn-small',
      ),
      button(
        UI_TEXT.debugForceEnd,
        () => this.withSelected((id) => ({ kind: 'debugForceEndOfLife', nubbinId: id })),
        'btn btn-small',
      ),
    );
    this.root.appendChild(force);

    this.values = el('pre', 'debug-values');
    this.root.appendChild(this.values);

    this.root.appendChild(
      button(
        UI_TEXT.debugReset,
        () => {
          const g = this.game();
          if (!g) return;
          clearSave();
          const now = Date.now();
          g.replaceWorld(createWorld(now % 2147483647, now));
        },
        'btn btn-small btn-danger',
      ),
    );

    parent.appendChild(this.root);
    this.syncSpeed();
  }

  toggle(): void {
    this.root.hidden = !this.root.hidden;
    if (!this.root.hidden) this.refresh();
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  refresh(): void {
    if (this.root.hidden) return;
    const g = this.game();
    const id = this.selected();
    if (!g) return;
    const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
    if (!n) {
      this.values.textContent = UI_TEXT.debugNoSelection;
      return;
    }
    const lines = [
      `${n.name} (${n.id}) ${n.stage} ${n.behavior.state}`,
      `alignment ${n.alignment.toFixed(3)}  happiness ${n.needs.happiness.toFixed(1)}  affection ${n.needs.affection.toFixed(1)}`,
      `hunger ${n.needs.hunger.toFixed(2)}  energy ${n.needs.energy.toFixed(2)}  stageMs ${Math.round(n.stageMs)}`,
      `lean ${NUBBIN_TYPES.map((t) => `${TYPE_LABELS[t]} ${n.typeLean[t].toFixed(0)}`).join('  ')}`,
      ...STAT_KEYS.map(
        (k) => `${STAT_LABELS[k]} ${n.stats[k].points.toFixed(1)} pts (${n.stats[k].grade})`,
      ),
      `sim t ${Math.round(g.world.timeMs / 1000)} s  rng ${g.world.rngState}`,
    ];
    this.values.textContent = lines.join('\n');
  }

  private withSelected(make: (id: string) => Parameters<Game['send']>[0]): void {
    const g = this.game();
    const id = this.selected();
    if (!g || !id) return;
    g.send(make(id));
  }

  private syncSpeed(): void {
    const scale = this.game()?.clock.timeScale ?? 1;
    this.speedButtons.forEach((b, i) => b.classList.toggle('active', SIM.timeScales[i] === scale));
  }
}
