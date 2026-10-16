import {
  EDU,
  EDU_AGES,
  EDU_COLOUR_HEX,
  EDU_DOMAIN,
  EDU_GAMES,
  EDU_RECOMMENDED,
  type EduAge,
  type EduGameId,
} from '../config/edu';
import { EDU_TEXT, NAMES } from '../config/strings';
import type { Game } from '../game';
import { makeRound, starsFor, type EduOption, type EduRound } from '../minigames/edu/games';
import { playSound } from '../platform/audio';
import { enabledGames } from '../sim/edu';
import { Rng } from '../sim/rng';
import { button, el, modal } from './dom';
import { storyPickButton, storyProgress, storySettings } from './edu-story';

/**
 * The Learning Grove screens: the game picker, a round screen with big targets and no
 * timer, the grown-up area behind a sum gate, and the break screen. Everything reads
 * `world.edu` and sends commands; the round generators are pure (minigames/edu/games).
 */
export class EduScreen {
  private readonly picker;
  private readonly root: HTMLDivElement;
  private readonly card: HTMLDivElement;
  private round: EduRound | null = null;
  private game: EduGameId | null = null;
  private roundNo = 0;
  private tries = 0;
  private starsTotal = 0;
  private rng = Rng.fromSeed(Date.now());

  constructor(
    parent: HTMLElement,
    private readonly game_: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.picker = modal(parent, EDU_TEXT.play, EDU_TEXT.leave);
    this.picker.body.appendChild(el('p', 'help', EDU_TEXT.playHelp));
    this.root = el('div', 'edu');
    this.root.hidden = true;
    this.card = el('div', 'edu-card');
    this.root.appendChild(this.card);
    parent.appendChild(this.root);
  }

  /** The picker: one big button per switched-on game. */
  open(): void {
    const g = this.game_();
    if (!g?.world.edu) return;
    const body = this.picker.body;
    body.querySelectorAll('.edu-grid, .help.none').forEach((n) => n.remove());
    // The story first (CV2): it is always there, whatever games are switched on.
    const storyGrid = el('div', 'edu-grid');
    storyGrid.appendChild(storyPickButton(g, () => this.close(), this.toast));
    body.appendChild(storyGrid);
    const games = enabledGames(g.world);
    if (games.length === 0) {
      body.appendChild(el('p', 'help none', EDU_TEXT.noGames));
    } else {
      const grid = el('div', 'edu-grid');
      for (const id of games) {
        const b = button('', () => this.start(id), 'btn edu-pick');
        b.append(
          el('span', 'edu-pick-icon', EDU_TEXT.gameIcons[id]),
          el('strong', undefined, EDU_TEXT.gameNames[id]),
          el('small', undefined, EDU_TEXT.gameBlurbs[id]),
        );
        grid.appendChild(b);
      }
      body.appendChild(grid);
    }
    this.picker.show();
  }

  close(): void {
    this.picker.hide();
    this.root.hidden = true;
    this.round = null;
    this.game = null;
    const g = this.game_();
    if (g) g.renderPaused = false;
  }

  isOpen(): boolean {
    return this.picker.isOpen() || !this.root.hidden;
  }

  private start(id: EduGameId): void {
    const g = this.game_();
    if (!g?.world.edu) return;
    this.picker.hide();
    this.game = id;
    this.roundNo = 0;
    this.starsTotal = 0;
    this.rng = Rng.fromSeed(Date.now());
    g.renderPaused = true;
    this.root.hidden = false;
    this.nextRound();
  }

  private nextRound(): void {
    const g = this.game_();
    const e = g?.world.edu;
    if (!g || !e || !this.game) return;
    this.roundNo += 1;
    this.tries = 0;
    if (this.roundNo > EDU.roundsPerGame) {
      this.finish();
      return;
    }
    this.round = makeRound(this.game, e.age, this.rng, e.childName || undefined);
    this.renderRound();
  }

  private renderRound(): void {
    const r = this.round;
    if (!r) return;
    const c = this.card;
    c.innerHTML = '';
    const head = el('div', 'edu-head');
    head.append(
      el('span', 'edu-progress', EDU_TEXT.roundOf(this.roundNo, EDU.roundsPerGame)),
      button(EDU_TEXT.leave, () => this.close(), 'btn btn-small'),
    );
    c.appendChild(head);
    c.appendChild(el('div', 'edu-prompt', r.prompt));
    if (r.cue) {
      const cue = el('div', 'edu-cue');
      cue.appendChild(renderOption(r.cue, true));
      c.appendChild(cue);
    }
    const opts = el('div', `edu-options n${r.options.length}`);
    r.options.forEach((o, i) => {
      const b = button('', () => this.answer(i, b), 'btn edu-option');
      b.appendChild(renderOption(o, false));
      if (o.kind === 'colour') b.setAttribute('aria-label', o.label);
      opts.appendChild(b);
    });
    c.appendChild(opts);
    this.feedback = el('div', 'edu-feedback');
    c.appendChild(this.feedback);
  }

  private feedback: HTMLDivElement = el('div');

  private answer(i: number, btn: HTMLButtonElement): void {
    const r = this.round;
    if (!r || this.tries < 0) return;
    this.tries += 1;
    if (i === r.answer) {
      const stars = starsFor(this.tries);
      this.starsTotal += stars;
      btn.classList.add('right');
      playSound('win');
      this.feedback.textContent = `${this.rng.pick(EDU_TEXT.wellDone)} ${r.teach} ${EDU_TEXT.stars(stars)}`;
      this.game_()?.send({ kind: 'eduResult', game: r.game, stars });
      this.tries = -1;
      this.card.appendChild(
        button(EDU_TEXT.nextRound, () => this.nextRound(), 'btn btn-primary edu-next'),
      );
      return;
    }
    btn.classList.add('wrong');
    btn.disabled = true;
    playSound('tap');
    if (this.tries >= EDU.triesBeforeShow) {
      // Show the answer; the round still counts, with one star.
      const right = this.card.querySelectorAll<HTMLButtonElement>('.edu-option')[r.answer];
      right?.classList.add('right');
      this.feedback.textContent = `${EDU_TEXT.showAnswer} ${r.teach}`;
      this.starsTotal += 1;
      this.game_()?.send({ kind: 'eduResult', game: r.game, stars: 1 });
      this.tries = -1;
      this.card.appendChild(
        button(EDU_TEXT.nextRound, () => this.nextRound(), 'btn btn-primary edu-next'),
      );
      return;
    }
    this.feedback.textContent = this.tries === 1 ? EDU_TEXT.tryAgain : EDU_TEXT.almost;
  }

  private finish(): void {
    const g = this.game_();
    const c = this.card;
    c.innerHTML = '';
    const max = EDU.roundsPerGame * 3;
    c.appendChild(el('div', 'edu-prompt', EDU_TEXT.finished(this.starsTotal, max)));
    c.appendChild(
      el('div', 'edu-big', '⭐'.repeat(Math.max(1, Math.round((this.starsTotal / max) * 5)))),
    );
    if (g?.world.edu) c.appendChild(el('div', 'help', EDU_TEXT.stickers(g.world.edu.stickers)));
    const row = el('div', 'settings-actions');
    row.append(
      button(EDU_TEXT.playAgain, () => this.game && this.start(this.game), 'btn btn-primary'),
      button(EDU_TEXT.backToGrove, () => this.close(), 'btn'),
    );
    c.appendChild(row);
    playSound('cheer');
    this.toast(EDU_TEXT.finished(this.starsTotal, max));
  }
}

function renderOption(o: EduOption, large: boolean): HTMLElement {
  const box = el('div', `edu-opt ${o.kind}${large ? ' large' : ''}`);
  switch (o.kind) {
    case 'colour': {
      const sw = el('div', 'edu-swatch');
      sw.style.background = EDU_COLOUR_HEX[o.colour] ?? o.colour;
      box.appendChild(sw);
      break;
    }
    case 'shape':
      box.appendChild(shapeSvg(o.shape));
      break;
    case 'letter':
      box.appendChild(el('span', 'edu-letter', o.letter));
      break;
    case 'number':
      box.appendChild(el('span', 'edu-letter', String(o.n)));
      break;
    case 'count': {
      const icons = el('div', 'edu-icons');
      for (let i = 0; i < o.n; i++) icons.appendChild(el('span', undefined, o.icon));
      box.appendChild(icons);
      break;
    }
    case 'picture':
      box.append(el('span', 'edu-icon', o.icon), el('span', 'edu-word', o.label));
      break;
  }
  return box;
}

function shapeSvg(shape: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('edu-shape');
  const fill = '#f2d34c';
  let node: SVGElement;
  const poly = (points: string) => {
    const p = document.createElementNS(ns, 'polygon');
    p.setAttribute('points', points);
    return p;
  };
  switch (shape) {
    case 'circle':
      node = document.createElementNS(ns, 'circle');
      node.setAttribute('cx', '50');
      node.setAttribute('cy', '50');
      node.setAttribute('r', '40');
      break;
    case 'oval':
      node = document.createElementNS(ns, 'ellipse');
      node.setAttribute('cx', '50');
      node.setAttribute('cy', '50');
      node.setAttribute('rx', '44');
      node.setAttribute('ry', '28');
      break;
    case 'square':
      node = poly('12,12 88,12 88,88 12,88');
      break;
    case 'rectangle':
      node = poly('6,28 94,28 94,72 6,72');
      break;
    case 'triangle':
      node = poly('50,10 92,88 8,88');
      break;
    case 'diamond':
      node = poly('50,6 92,50 50,94 8,50');
      break;
    case 'star':
      node = poly('50,6 61,38 95,38 68,58 78,92 50,72 22,92 32,58 5,38 39,38');
      break;
    case 'heart':
    default:
      node = document.createElementNS(ns, 'path');
      node.setAttribute('d', 'M50 88 L14 50 A20 20 0 0 1 50 26 A20 20 0 0 1 86 50 Z');
      break;
  }
  node.setAttribute('fill', fill);
  node.setAttribute('stroke', '#1b1326');
  node.setAttribute('stroke-width', '4');
  node.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(node);
  return svg;
}

/** The grown-up area: a sum gate, then age, name, session length and the game toggles. */
export class GrownUpPanel {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  private gate: { a: number; b: number } | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, EDU_TEXT.parentTitle, EDU_TEXT.leave);
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  open(): void {
    this.gate = { a: 3 + Math.floor(Math.random() * 7), b: 2 + Math.floor(Math.random() * 7) };
    this.renderGate();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private renderGate(): void {
    const g = this.gate;
    if (!g) return;
    this.body.innerHTML = '';
    this.body.appendChild(el('h3', undefined, EDU_TEXT.gateTitle));
    this.body.appendChild(el('p', 'help', EDU_TEXT.gateHelp(g.a, g.b)));
    const row = el('div', 'settings-actions');
    const input = el('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.className = 'edu-gate-input';
    input.setAttribute('aria-label', EDU_TEXT.gateTitle);
    const enter = button(
      EDU_TEXT.gateEnter,
      () => {
        if (Number(input.value) === g.a + g.b) this.renderPanel();
        else {
          this.toast(EDU_TEXT.gateWrong);
          input.value = '';
        }
      },
      'btn btn-primary',
    );
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') enter.click();
    });
    row.append(input, enter);
    this.body.appendChild(row);
    setTimeout(() => input.focus(), 50);
  }

  renderPanel(): void {
    const g = this.game();
    const e = g?.world.edu;
    if (!g || !e) return;
    this.body.innerHTML = '';
    this.body.appendChild(el('p', 'help', EDU_TEXT.parentHelp));
    // Age.
    const ageRow = el('label', 'field-row');
    const ageSel = el('select');
    for (const a of EDU_AGES) {
      const o = el('option', undefined, String(a));
      o.value = String(a);
      ageSel.appendChild(o);
    }
    ageSel.value = String(e.age);
    ageSel.addEventListener('change', () => {
      g.send({ kind: 'eduSetAge', age: Number(ageSel.value) as EduAge, resetGames: true });
      setTimeout(() => this.renderPanel(), 100);
    });
    ageRow.append(el('strong', undefined, EDU_TEXT.ageLabel), ageSel);
    this.body.appendChild(ageRow);
    // Name.
    const nameRow = el('label', 'field-row');
    const name = el('input');
    name.type = 'text';
    name.maxLength = 20;
    name.value = e.childName;
    name.addEventListener('change', () => g.send({ kind: 'eduSetName', name: name.value }));
    nameRow.append(el('strong', undefined, EDU_TEXT.childName), name);
    this.body.appendChild(nameRow);
    // Session length.
    const sessRow = el('label', 'field-row');
    const sess = el('input');
    sess.type = 'number';
    sess.inputMode = 'numeric';
    sess.min = String(EDU.sessionRange[0]);
    sess.max = String(EDU.sessionRange[1]);
    sess.value = String(e.sessionMinutes);
    sess.addEventListener('change', () =>
      g.send({ kind: 'eduSetSession', minutes: Number(sess.value) || EDU.sessionMinutes }),
    );
    sessRow.append(el('strong', undefined, EDU_TEXT.sessionLabel), sess);
    this.body.appendChild(sessRow);
    this.body.appendChild(el('p', 'help', EDU_TEXT.sessionHelp));
    storySettings(this.body, g);
    // Games: toggles with the recommendation tag.
    this.body.appendChild(el('h3', undefined, EDU_TEXT.gamesLabel));
    for (const id of EDU_GAMES) {
      const row = el('label', 'check-row');
      const cb = el('input');
      cb.type = 'checkbox';
      cb.checked = e.games[id];
      cb.addEventListener('change', () => g.send({ kind: 'eduSetGame', game: id, on: cb.checked }));
      const text = el('span');
      const rec = EDU_RECOMMENDED[e.age].includes(id);
      text.append(
        el('strong', undefined, `${EDU_TEXT.gameIcons[id]} ${EDU_TEXT.gameNames[id]}`),
        el(
          'small',
          undefined,
          `${EDU_TEXT.gameBlurbs[id]}${rec ? ` · ${EDU_TEXT.recommended(e.age)}` : ''}`,
        ),
      );
      row.append(cb, text);
      this.body.appendChild(row);
    }
    this.body.appendChild(
      button(
        EDU_TEXT.resetRecommended,
        () => {
          g.send({ kind: 'eduSetAge', age: e.age, resetGames: true });
          setTimeout(() => this.renderPanel(), 100);
        },
        'btn btn-small',
      ),
    );
    // Progress by domain.
    this.body.appendChild(el('h3', undefined, EDU_TEXT.progressLabel));
    const list = el('div', 'shop-list');
    const byDomain = new Map<string, { plays: number; stars: number }>();
    for (const id of EDU_GAMES) {
      const d = EDU_DOMAIN[id];
      const cur = byDomain.get(d) ?? { plays: 0, stars: 0 };
      cur.plays += e.progress[id]?.plays ?? 0;
      cur.stars += e.progress[id]?.stars ?? 0;
      byDomain.set(d, cur);
    }
    for (const [d, p] of byDomain) {
      const row = el('div', 'shop-row');
      const t = el('div');
      t.append(
        el('strong', undefined, EDU_TEXT.domains[d as keyof typeof EDU_TEXT.domains]),
        el('small', undefined, EDU_TEXT.progressRow(p.plays, p.stars)),
      );
      row.appendChild(t);
      list.appendChild(row);
    }
    this.body.appendChild(list);
    storyProgress(this.body, g);
    this.body.appendChild(el('p', 'help', EDU_TEXT.stickers(e.stickers)));
    this.body.appendChild(
      el('p', 'help', EDU_TEXT.coPlay[Math.floor(Math.random() * EDU_TEXT.coPlay.length)] ?? ''),
    );
    this.body.appendChild(el('p', 'help', `🐚 ${g.world.inventory.shells} ${NAMES.currency}`));
  }
}

/** The break screen after the session length; a grown-up can extend it. */
export class BreakScreen {
  private readonly dialog;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly grownUps: () => void,
  ) {
    this.dialog = modal(parent, EDU_TEXT.breakTitle, EDU_TEXT.breakDone);
    this.dialog.body.appendChild(el('p', 'help', EDU_TEXT.breakBody));
    this.dialog.body.appendChild(el('div', 'edu-big', '🌿'));
    this.dialog.body.appendChild(
      button(
        EDU_TEXT.breakMore,
        () => {
          this.game()?.send({ kind: 'eduResetSession' });
          this.dialog.hide();
          this.grownUps();
        },
        'btn btn-small',
      ),
    );
  }

  show(): void {
    if (this.dialog.isOpen()) return;
    this.game()?.send({ kind: 'eduResetSession' });
    this.dialog.show();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }
}
