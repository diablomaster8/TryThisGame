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
import { Peekaboo } from '../minigames/micro/peekaboo';
import { PEEKABOO_TEXT } from '../config/strings-fun-r5';
import { playSound } from '../platform/audio';
import { enabledGames, gamesForBand } from '../sim/edu';
import { Rng } from '../sim/rng';
import { button, dialogFocus, el, modal } from './dom';
import { renderSumGate } from './grown-up-gate';
import { speakLine } from './lesson';
import { EDU_PICKER_TEXT, EDU_RESULTS_TEXT, EDU_SAY_TEXT } from '../config/strings-kids';
import { EDU_VOICE } from '../config/tuning-kids';
import { optionSay, pickStars, replySpeech, roundSpeech, spoken, type Band } from './edu-voice';
import { BREAK_KID_TEXT } from '../config/strings-kids';
import { frameKey } from '../render/sprites/animations';
import type { Nubbin } from '../sim/types';
import { storyPickButton, storyProgress, storySettings } from './edu-story';
import { NextCard } from './next-card';
import { LangPanel, langProgress } from './lang';
import { langCourses } from '../sim/lang';

/**
 * The Learning Grove screens: the game picker, a round screen with big targets and no
 * timer, the grown-up area behind a sum gate, and the break screen. Everything reads
 * `world.edu` and sends commands; the round generators are pure (minigames/edu/games).
 */
export class EduScreen {
  private readonly picker;
  private readonly lang: LangPanel;
  private readonly root: HTMLDivElement;
  private readonly card: HTMLDivElement;
  private round: EduRound | null = null;
  private game: EduGameId | null = null;
  private roundNo = 0;
  private tries = 0;
  private starsTotal = 0;
  private used = new Set<string>();
  private stickersAtStart = 0;
  private rng = Rng.fromSeed(Date.now());
  private readonly gameFocus: ReturnType<typeof dialogFocus>;
  private readonly next: NextCard;
  private readonly peek: Peekaboo;
  /** R0676: the HUD's pointing guide, behind the "What's next" card's "Show me". */
  private showMe: () => void = () => undefined;

  constructor(
    parent: HTMLElement,
    private readonly game_: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.picker = modal(parent, EDU_TEXT.play, EDU_TEXT.leave);
    this.picker.root.classList.add('edu-picker');
    this.lang = new LangPanel(parent, game_, toast);
    this.next = new NextCard(parent, () => this.showMe());
    // R0321: the sprout band's peekaboo.
    this.peek = new Peekaboo(parent, game_);
    this.picker.body.appendChild(el('p', 'help edu-play-help', EDU_TEXT.playHelp));
    this.root = el('div', 'edu');
    this.root.hidden = true;
    this.card = el('div', 'edu-card');
    this.root.appendChild(this.card);
    parent.appendChild(this.root);
    // The game card is a dialog too: named, focused on start, Escape leaves the game.
    this.card.setAttribute('aria-label', EDU_TEXT.play);
    this.gameFocus = dialogFocus(this.root, this.card, null, () => this.close());
  }

  /** The picker: one big button per switched-on game. */
  open(): void {
    const g = this.game_();
    if (!g?.world.edu) return;
    const body = this.picker.body;
    body.querySelectorAll('.edu-grid, .help.none').forEach((n) => n.remove());
    // R0681: the help line is for grown-ups; a sprout hears the question instead.
    const sprout = g.world.edu.band === 'sprout';
    const help = body.querySelector<HTMLElement>('.edu-play-help');
    if (help) help.hidden = sprout;
    // The story first (CV2): it is always there, whatever games are switched on.
    const storyGrid = el('div', 'edu-grid');
    storyGrid.appendChild(
      storyPickButton(
        g,
        () => this.close(),
        () => {
          const cur = this.game_();
          if (cur) this.next.show(cur);
        },
      ),
    );
    // Nova's postcard (CV3): the language courses, once their scripts have loaded.
    if (langCourses().length > 0) storyGrid.appendChild(this.lang.pickButton(() => this.close()));
    // R0321 (FUN-32): "Where's Kiki?" for the 3–6 band, once a Nubbin is out of its egg.
    const hider = g.world.edu.band === 'sprout' ? Peekaboo.pickNubbin(g) : null;
    if (hider) {
      const b = button(
        '',
        () => {
          this.picker.hide();
          this.peek.open();
        },
        'btn edu-pick',
      );
      b.append(
        el('span', 'edu-pick-icon', '🙈'),
        el('strong', undefined, PEEKABOO_TEXT.pick(hider.name)),
        el('small', undefined, PEEKABOO_TEXT.blurb),
      );
      storyGrid.appendChild(b);
    }
    body.appendChild(storyGrid);
    const games = enabledGames(g.world);
    if (games.length === 0) {
      body.appendChild(el('p', 'help none', EDU_TEXT.noGames));
    } else {
      const grid = el('div', 'edu-grid');
      for (const id of games) {
        const reader = g.world.edu.band === 'reader';
        const name = gameName(id, reader);
        // R0681: a sprout hears the game's name while its tile bounces, then it starts.
        const b = button(
          '',
          () => (sprout ? this.launch(b, id, name) : this.start(id)),
          'btn edu-pick',
        );
        b.append(
          el('span', 'edu-pick-icon', EDU_TEXT.gameIcons[id]),
          el('strong', undefined, name),
          el('small', undefined, gameBlurb(id, reader)),
        );
        const p = g.world.edu.progress[id];
        const earned = pickStars(p?.plays ?? 0, p?.stars ?? 0);
        if (earned > 0) {
          const row = el('span', 'edu-pick-stars', '⭐'.repeat(earned));
          row.setAttribute('aria-label', EDU_PICKER_TEXT.stars(earned));
          b.appendChild(row);
        }
        grid.appendChild(b);
      }
      body.appendChild(grid);
    }
    this.picker.show();
    if (sprout && g.world.edu.readAloud) speakLine(EDU_PICKER_TEXT.say);
  }

  /** R0681: say the game's name during a short bounce, then start it. */
  private launch(b: HTMLButtonElement, id: EduGameId, name: string): void {
    if (b.classList.contains('launching')) return;
    b.classList.add('launching');
    if (this.game_()?.world.edu?.readAloud) speakLine(name);
    window.setTimeout(() => {
      b.classList.remove('launching');
      if (this.picker.isOpen()) this.start(id);
    }, EDU_VOICE.launchMs);
  }

  close(): void {
    this.picker.hide();
    if (!this.root.hidden) {
      this.root.hidden = true;
      this.gameFocus.closed();
    }
    this.round = null;
    this.game = null;
    const g = this.game_();
    if (g) g.renderPaused = false;
  }

  /** R0676: wire "Show me" to the guide (hud.ts). */
  onShowMe(fn: () => void): void {
    this.showMe = fn;
  }

  /** R0673: the "What's next" card on its own, for the entry prompt's Story. */
  showNext(): void {
    const g = this.game_();
    if (g) this.next.show(g);
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
    // R0684: no target twice in one session.
    this.used = new Set();
    this.stickersAtStart = g.world.edu.stickers;
    this.rng = Rng.fromSeed(Date.now());
    g.renderPaused = true;
    this.root.hidden = false;
    this.gameFocus.opened();
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
    this.round = makeRound(this.game, e.age, this.rng, e.childName || undefined, e.band, this.used);
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
      // R0674: the prompt again, for every band.
      button('🔊', () => speakLine(spoken(r.prompt)), 'btn edu-hear'),
      button(EDU_TEXT.leave, () => this.close(), 'btn btn-small'),
    );
    head.querySelector('.edu-hear')?.setAttribute('aria-label', EDU_SAY_TEXT.hearAgain);
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
      holdToHear(b, o);
      opts.appendChild(b);
    });
    c.appendChild(opts);
    this.feedback = el('div', 'edu-feedback');
    c.appendChild(this.feedback);
    for (const line of roundSpeech(r, this.band(), this.readAloud())) speakLine(line);
  }

  private band(): Band {
    return this.game_()?.world.edu?.band === 'reader' ? 'reader' : 'sprout';
  }

  private readAloud(): boolean {
    return !!this.game_()?.world.edu?.readAloud;
  }

  /** R0674: the feedback line, shown and (for a sprout) said. */
  private reply(text: string): void {
    this.feedback.textContent = text;
    for (const line of replySpeech(text, this.band(), this.readAloud())) speakLine(line);
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
      this.reply(`${this.rng.pick(EDU_TEXT.wellDone)} ${r.teach} ${EDU_TEXT.stars(stars)}`);
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
      this.reply(`${EDU_TEXT.showAnswer} ${r.teach}`);
      this.starsTotal += 1;
      this.game_()?.send({ kind: 'eduResult', game: r.game, stars: 1 });
      this.tries = -1;
      this.card.appendChild(
        button(EDU_TEXT.nextRound, () => this.nextRound(), 'btn btn-primary edu-next'),
      );
      return;
    }
    this.reply(this.tries === 1 ? EDU_TEXT.tryAgain : EDU_TEXT.almost);
  }

  /**
   * R0686: the results card is a celebration: the child's Nubbin cheering, the stars popping
   * in one by one with a chime (all at once under reduced motion), the Shells this game
   * earned in one line, a new sticker if one came, and two big picture buttons.
   */
  private finish(): void {
    const g = this.game_();
    const c = this.card;
    c.innerHTML = '';
    const max = EDU.roundsPerGame * 3;
    const card = el('div', 'edu-results');
    const n = g ? sleeperOf(g) : undefined;
    if (g && n) card.appendChild(clipPortrait(g, n, 'happy', 'edu-results-pic'));
    card.appendChild(el('div', 'edu-prompt', EDU_TEXT.finished(this.starsTotal, max)));
    const stars = el('div', 'edu-big edu-results-stars');
    const count = Math.max(1, Math.round((this.starsTotal / max) * 5));
    const calm = document.documentElement.classList.contains('reduce-motion');
    for (let i = 0; i < count; i++) {
      const s = el('span', 'edu-star', '⭐');
      if (!calm) {
        s.style.animationDelay = `${i * EDU_VOICE.starMs}ms`;
        window.setTimeout(() => playSound('tap'), i * EDU_VOICE.starMs);
      }
      stars.appendChild(s);
    }
    card.appendChild(stars);
    card.appendChild(el('div', 'edu-results-shells', `+${this.starsTotal * EDU.shellsPerStar} 🐚`));
    const e = g?.world.edu;
    const newSticker = !!e && e.stickers > this.stickersAtStart;
    if (e)
      card.appendChild(
        el(
          'div',
          newSticker ? 'edu-results-sticker' : 'help',
          newSticker ? `🌟 ${EDU_TEXT.sticker}` : EDU_TEXT.stickers(e.stickers),
        ),
      );
    const row = el('div', 'edu-results-actions');
    const big = (icon: string, label: string, onPress: () => void, cls: string) => {
      const b = button('', onPress, `btn ${cls} edu-results-btn`);
      b.append(el('span', 'edu-results-icon', icon), el('span', undefined, label));
      return b;
    };
    row.append(
      big('🔁', EDU_TEXT.playAgain, () => this.game && this.start(this.game), 'btn-primary'),
      big('🏡', EDU_TEXT.backToGrove, () => this.close(), ''),
    );
    card.appendChild(row);
    c.appendChild(card);
    window.setTimeout(() => playSound('cheer'), calm ? 0 : count * EDU_VOICE.starMs);
    // R0674 / R0693: a sprout hears the praise; nobody gets a toast over the card.
    const say = n
      ? EDU_RESULTS_TEXT.say(this.starsTotal, n.name)
      : EDU_TEXT.finished(this.starsTotal, max);
    for (const line of replySpeech(say, this.band(), this.readAloud())) speakLine(line);
  }
}

/**
 * R0674: holding an option for a moment says it ("red", "cow", "one, two, three"), and a
 * counting option pulses each icon as it is counted. A tap still picks it: the hold cancels the
 * click that would follow it.
 */
function holdToHear(b: HTMLButtonElement, o: EduOption): void {
  let timer = 0;
  let held = false;
  const cancel = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
  };
  b.addEventListener('pointerdown', () => {
    held = false;
    cancel();
    timer = window.setTimeout(() => {
      timer = 0;
      held = true;
      speakLine(optionSay(o));
      if (o.kind === 'count') pulseCount(b);
    }, EDU_VOICE.holdMs);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel'] as const)
    b.addEventListener(ev, cancel);
  b.addEventListener(
    'click',
    (e) => {
      if (!held) return;
      held = false;
      e.stopImmediatePropagation();
      e.preventDefault();
    },
    true,
  );
  b.addEventListener('contextmenu', (e) => e.preventDefault());
}

/** Light each counted icon in turn, in time with the counting voice. */
function pulseCount(b: HTMLElement): void {
  const icons = [...b.querySelectorAll<HTMLElement>('.edu-icons > span')];
  icons.forEach((s, i) =>
    window.setTimeout(() => {
      s.classList.add('edu-counted');
      window.setTimeout(() => s.classList.remove('edu-counted'), EDU_VOICE.countMs);
    }, i * EDU_VOICE.countMs),
  );
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
    case 'sum': {
      // R0684: two groups and a plus, so the cue models a + b instead of showing the total.
      const group = (n: number) => {
        const icons = el('div', 'edu-icons');
        for (let i = 0; i < n; i++) icons.appendChild(el('span', undefined, o.icon));
        return icons;
      };
      box.classList.add('edu-sum');
      box.append(group(o.a), el('span', 'edu-plus', '➕'), group(o.b));
      break;
    }
    case 'word':
      box.appendChild(el('span', 'edu-read', o.word));
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
    renderSumGate(this.body, this.toast, () => this.renderPanel());
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
    const reader = e.band === 'reader';
    for (const id of gamesForBand(e.band)) {
      const row = el('label', 'check-row');
      const cb = el('input');
      cb.type = 'checkbox';
      cb.checked = e.games[id];
      cb.addEventListener('change', () => g.send({ kind: 'eduSetGame', game: id, on: cb.checked }));
      const text = el('span');
      const rec = EDU_RECOMMENDED[e.age].includes(id);
      text.append(
        el('strong', undefined, `${EDU_TEXT.gameIcons[id]} ${gameName(id, reader)}`),
        el(
          'small',
          undefined,
          `${gameBlurb(id, reader)}${rec && !reader ? ` · ${EDU_TEXT.recommended(e.age)}` : ''}`,
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
    langProgress(this.body, g);
    this.body.appendChild(el('p', 'help', EDU_TEXT.stickers(e.stickers)));
    this.body.appendChild(
      el('p', 'help', EDU_TEXT.coPlay[Math.floor(Math.random() * EDU_TEXT.coPlay.length)] ?? ''),
    );
    this.body.appendChild(el('p', 'help', `🐚 ${g.world.inventory.shells} ${NAMES.currency}`));
  }
}

/**
 * The break screen after the session length: a calm card that locks play until the break
 * ends. Only a grown-up (the sum gate) can end it early; a reload keeps it (`breakUntilMs`).
 */
export class BreakScreen {
  private readonly root: HTMLDivElement;
  private readonly count: HTMLElement;
  private readonly ring: HTMLElement;
  private readonly sleeper: HTMLElement;
  private readonly night: HTMLElement;
  private shown = false;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly ask: () => Promise<boolean>,
    private readonly grownUps: () => void,
  ) {
    this.root = el('div', 'edu-break');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    const card = el('div', 'edu-break-card');
    this.ring = el('div', 'edu-break-ring');
    this.count = el('div', 'edu-break-count');
    // R0672: the child's own Nubbin asleep inside the ring, the emoji when none has hatched.
    this.sleeper = el('div', 'edu-break-sleeper');
    this.ring.appendChild(this.sleeper);
    this.night = el('p', 'edu-break-night', BREAK_KID_TEXT.goodnight);
    this.night.hidden = true;
    card.append(
      el('h2', undefined, EDU_TEXT.breakTitle),
      this.ring,
      this.count,
      el('p', 'help', EDU_TEXT.breakBody),
      this.night,
      button(BREAK_KID_TEXT.done, () => this.goodnight(), 'btn btn-primary edu-break-done'),
      button(
        EDU_TEXT.breakMore,
        () => {
          void this.ask().then((ok) => {
            if (!ok) return;
            this.game()?.send({ kind: 'eduEndBreak' });
            this.hide();
            this.grownUps();
          });
        },
        'btn btn-small',
      ),
    );
    this.root.appendChild(card);
    parent.appendChild(this.root);
  }

  /** Show the card (once) and speak the line; `update` keeps the countdown. */
  show(): void {
    if (this.shown) return;
    this.shown = true;
    this.root.hidden = false;
    this.root.classList.remove('edu-break-goodnight');
    this.night.hidden = true;
    this.drawSleeper();
    const e = this.game()?.world.edu;
    if (e?.readAloud) speakLine(EDU_TEXT.breakSay);
  }

  /**
   * "All done for now": tuck in and say goodnight. The break keeps running and play stays
   * locked; only the gated button or the end of the break lets a round start (R0672).
   */
  private goodnight(): void {
    const g = this.game();
    this.root.classList.add('edu-break-goodnight');
    this.night.hidden = false;
    if (!g?.world.edu?.readAloud) return;
    const n = sleeperOf(g);
    speakLine(n ? BREAK_KID_TEXT.goodnightSay(n.name) : BREAK_KID_TEXT.goodnightSayNone);
  }

  private drawSleeper(): void {
    this.sleeper.textContent = '';
    const g = this.game();
    const n = g && sleeperOf(g);
    if (!g || !n) {
      this.sleeper.appendChild(el('div', 'edu-big', '😴'));
      return;
    }
    this.sleeper.appendChild(sleepingPortrait(g, n));
    this.sleeper.appendChild(el('span', 'edu-break-zzz', 'z z z'));
  }

  hide(): void {
    this.shown = false;
    this.root.hidden = true;
  }

  /** Per-frame: the time left on the ring. */
  update(nowMs: number): void {
    const e = this.game()?.world.edu;
    if (!e || !this.shown) return;
    const left = Math.max(0, e.breakUntilMs - nowMs);
    const total = EDU.breakMinutes * 60_000;
    const mins = Math.floor(left / 60_000);
    const secs = Math.floor((left % 60_000) / 1000);
    this.count.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
    this.ring.style.setProperty('--left', `${Math.round((1 - left / total) * 360)}deg`);
  }

  isOpen(): boolean {
    return this.shown;
  }
}

/** A game's name for the band: readers see Sums, Spelling and Rhymes. */
function gameName(id: EduGameId, reader: boolean): string {
  return (reader ? EDU_TEXT.readerGameNames[id] : undefined) ?? EDU_TEXT.gameNames[id];
}

function gameBlurb(id: EduGameId, reader: boolean): string {
  return (reader ? EDU_TEXT.readerGameBlurbs[id] : undefined) ?? EDU_TEXT.gameBlurbs[id];
}

/** The Nubbin the break card tucks in: the first hatched one, or none. */
function sleeperOf(g: Game): Nubbin | undefined {
  // Sable is a guest; the card tucks in the child's own Nubbin.
  const sable = g.world.campaign?.sableId;
  return g.world.nubbins.find((n) => n.stage !== 'egg' && n.stage !== 'cocoon' && n.id !== sable);
}

/** The Nubbin's front sleep frame (drawn at 64 px, shown larger); the idle frame if a sheet lacks one. */
function sleepingPortrait(g: Game, n: Nubbin): HTMLCanvasElement {
  return clipPortrait(g, n, 'sleep', 'edu-break-pic');
}

/** One front frame of a clip, falling back to idle; drawn at 64 px for CSS to scale. */
function clipPortrait(g: Game, n: Nubbin, clip: string, cls: string): HTMLCanvasElement {
  const c = el('canvas', cls);
  c.width = 64;
  c.height = 64;
  try {
    const sheet = g.view.sheets.forNubbin(n);
    const rect =
      sheet.frames.get(frameKey(clip, 'front', 0)) ??
      sheet.frames.get(frameKey('idle', 'front', 0));
    const ctx = c.getContext('2d');
    if (ctx && rect) {
      ctx.imageSmoothingEnabled = false;
      const img = sheet.texture.image as HTMLCanvasElement;
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, 64, 64);
    }
  } catch {
    // A picture is a nicety; the card still says goodnight.
  }
  return c;
}
