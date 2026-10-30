import { TRIAL_MAPS, type TrialMap } from '../config/battle-maps';
import { TRIAL_TEXT } from '../config/strings-battle-r6';
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import {
  gateOpen,
  trialStart,
  trialStep,
  trialsOf,
  type Step,
  type TrialState,
} from '../sim/battle/tactics/trials';
import { button, el, modal } from './dom';

/**
 * The trial map pack's screen (recs FIGHT-97): a list of the twelve puzzle boards with each
 * one's best and par, and a board played with four big arrow buttons or the arrow keys. The
 * board is drawn as a grid of labelled cells (an icon and a word each, never colour alone).
 * A clear is sent to the sim as the list of steps, which it replays before keeping it.
 */
const CELL: Readonly<Record<string, string>> = {
  '#': '🧱',
  '~': '🌊',
  B: '🪨',
  X: '🚪',
  '1': '🔔',
  '2': '🔔',
  '3': '🔔',
  F: '🔥',
  L: '🏮',
  '.': '',
  S: '',
};

export class TrialsMenu {
  private readonly dialog;
  private map: TrialMap | null = null;
  private state: TrialState | null = null;
  private steps: Step[] = [];
  private history: TrialState[] = [];

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, TRIAL_TEXT.title, UI_TEXT.close);
    this.dialog.root.classList.add('trials');
    this.dialog.root.addEventListener('keydown', (e) => {
      const d = { ArrowUp: 'n', ArrowRight: 'e', ArrowDown: 's', ArrowLeft: 'w' }[e.key] as
        Step | undefined;
      if (d && this.state) {
        e.preventDefault();
        this.step(d);
      }
    });
  }

  open(): void {
    this.map = null;
    this.draw();
    this.dialog.show();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private pick(m: TrialMap): void {
    this.map = m;
    this.state = trialStart(m);
    this.steps = [];
    this.history = [];
    this.draw();
  }

  private step(d: Step): void {
    if (!this.map || !this.state || this.state.done) return;
    const next = trialStep(this.map, this.state, d);
    if (!next) return;
    this.history.push(this.state);
    this.state = next;
    this.steps.push(d);
    if (next.done)
      this.game()?.send({ kind: 'trialClear', id: this.map.id, steps: [...this.steps] });
    this.draw();
  }

  private undo(): void {
    const prev = this.history.pop();
    if (!prev) return;
    this.state = prev;
    this.steps.pop();
    this.draw();
  }

  private draw(): void {
    const body = this.dialog.body;
    body.innerHTML = '';
    const g = this.game();
    if (!g) return;
    if (!this.map || !this.state) {
      body.appendChild(el('p', 'help', TRIAL_TEXT.help));
      const rec = trialsOf(g.world);
      for (const m of TRIAL_MAPS) {
        const r = rec[m.id];
        const label = `${r?.par ? '⭐' : r ? '✓' : '○'} ${m.name} · ${TRIAL_TEXT.par(m.par)}${r ? ` · ${TRIAL_TEXT.best(r.best)}` : ''}`;
        body.appendChild(button(label, () => this.pick(m), 'btn bs-tier'));
      }
      return;
    }
    const m = this.map;
    const s = this.state;
    body.appendChild(el('div', 'btn-name', m.name));
    body.appendChild(
      el(
        'p',
        'help',
        `${TRIAL_TEXT.steps(s.steps, m.par)} · ${gateOpen(m, s) ? TRIAL_TEXT.open : TRIAL_TEXT.shut}${s.flame ? ` · 🔥 ${s.flame}` : ''}`,
      ),
    );
    const grid = el('div', 'trial-grid');
    grid.style.gridTemplateColumns = `repeat(${m.rows[0]!.length}, 1fr)`;
    grid.setAttribute('role', 'grid');
    m.rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        const k = `${x},${y}`;
        let icon = CELL[ch] ?? '';
        if (ch === '~' && s.bridges.includes(k)) icon = '🪵';
        if (ch === 'B') icon = '';
        if (s.boulders.includes(k)) icon = '🪨';
        if (ch === 'L' && s.lit.includes(k)) icon = '🔥';
        if (s.x === x && s.y === y) icon = '🐣';
        const cell = el(
          'div',
          `trial-cell t-${ch === '#' ? 'wall' : ch === '~' ? 'water' : 'floor'}`,
          icon,
        );
        if ('123'.includes(ch)) cell.appendChild(el('small', undefined, ch));
        grid.appendChild(cell);
      }),
    );
    body.appendChild(grid);
    if (s.done) {
      body.appendChild(
        el('p', 'bs-prompt', s.steps <= m.par ? TRIAL_TEXT.atPar : TRIAL_TEXT.cleared(s.steps)),
      );
    }
    const pad = el('div', 'trial-pad');
    for (const [d, label] of [
      ['n', '⬆'],
      ['w', '⬅'],
      ['e', '➡'],
      ['s', '⬇'],
    ] as const) {
      const b = button(label, () => this.step(d), `btn trial-${d}`);
      b.setAttribute('aria-label', TRIAL_TEXT.dir[d]);
      pad.appendChild(b);
    }
    body.appendChild(pad);
    const row = el('div', 'bs-row');
    row.append(
      button(TRIAL_TEXT.undo, () => this.undo(), 'btn'),
      button(TRIAL_TEXT.reset, () => this.pick(m), 'btn'),
      button(TRIAL_TEXT.back, () => this.open(), 'btn'),
    );
    body.appendChild(row);
  }
}
