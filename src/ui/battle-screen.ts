import '../battle.css';
import { NAMES } from '../config/strings';
import {
  BATTLE_MOVE_TEXT,
  BATTLE_SCREEN_TEXT as T,
  BATTLE_TEXT,
  combatantName,
  formatEvent,
  moodWord,
  moveName,
  STATUS_TEXT,
  TYPE_WORDS,
} from '../config/strings-battle';
import { BATTLE } from '../config/tuning-battle';
import type { Game } from '../game';
import { Playback } from '../minigames/battle/playback';
import { isAudioUnlocked, isSoundEnabled, playSound } from '../platform/audio';
import { PX } from '../render/sprites/pixel-canvas';
import { CLIPS, frameAt, frameKey, type ClipName } from '../render/sprites/animations';
import type { SpriteSheet } from '../render/sprites/atlas';
import { drawShadowText } from '../render/sprites/font';
import { C, color } from '../render/sprites/palette';
import {
  BATTLE_ITEMS,
  bench,
  canChoose,
  itemsLeft,
  moveOf,
  MOOD_STATS,
  onField,
  prizeFor,
  puffCost,
  standing,
  typeMult,
  type BattleAction,
  type BattleContext,
  type BattleEvent,
  type BattleItemId,
  type BattleState,
  type Combatant,
} from '../sim/battle';
import { openTypeHelp } from './battle-help';
import { button, el } from './dom';

/**
 * The one battle screen (recs FIGHT-25, FIGHT-26, FIGHT-30) for dojo singles, story bouts and
 * the Grove Circuit. It is full-screen: the Grove stops drawing under it (`g.renderPaused`) and
 * the HUD is covered. Portrait: the stage in the top half (the foe upper right, ours lower
 * left, HP bars with numbers and an icon), a one-line log bubble, then the action sheet in the
 * thumb zone: a 2×2 grid of moves (type icon and word, Puff pips, a ×1.5 / ×0.67 badge once
 * that matchup has been seen) and a row of Swap, Item and Breath. Landscape puts the stage on
 * the left. Back (top left) and Escape ask before leaving, which forfeits.
 *
 * The sim resolves a turn at once; the screen plays the new log events one by one
 * (`Playback`), and a tap on the stage skips ahead. Under reduced motion nothing shakes or
 * flashes and numbers fade in place. Gentle bouts glow the best move with a hint, and in the
 * sprout band show only two big buttons.
 */
const VIEW_H = 160;
type View = 'main' | 'swap' | 'item' | 'target' | 'swing';

let shared: BattleScreen | null = null;

/** The one screen, made on first use. */
export function battleScreen(parent: HTMLElement, game: () => Game | null): BattleScreen {
  shared ??= new BattleScreen(parent, game);
  return shared;
}

const reduced = (): boolean =>
  document.documentElement.classList.contains('reduce-motion') ||
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export class BattleScreen {
  readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly roundLabel: HTMLSpanElement;
  private readonly speedBtn: HTMLButtonElement;
  private readonly cards: [HTMLDivElement, HTMLDivElement];
  private readonly logLine: HTMLParagraphElement;
  private readonly sheet: HTMLDivElement;
  private readonly confirmBox: HTMLDivElement;
  private readonly results: HTMLDivElement;
  private readonly playback = new Playback();
  private runsAtStart = -1;
  private startedAt = 0;
  private view: View = 'main';
  private pendingItem: BattleItemId | null = null;
  private sentSig: string | null = null;
  private drawnSig = '';
  private rafId = 0;
  private viewW = 260;
  private onDone: ((s: BattleState | null) => void) | null = null;
  /** HP and leads as the playback has shown them so far. */
  private shownHp = new Map<string, number>();
  private shownLead: [string, string] = ['', ''];
  /** Matchups seen in this bout: "moveType>foeType" → multiplier. */
  private seen = new Map<string, number>();
  private pop: { id: string; text: string; at: number } | null = null;
  private swingAt = 0;
  private holdTimer = 0;
  private lastEvent: BattleEvent | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'expedition battle-screen');
    this.root.hidden = true;
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-label', BATTLE_TEXT.partyTitle);
    const top = el('div', 'bs-top');
    const back = button(T.back, () => this.askLeave(), 'btn bs-back');
    this.roundLabel = el('span', 'bs-round');
    this.speedBtn = button('', () => this.toggleSpeed(), 'btn bs-speed');
    this.speedBtn.setAttribute('aria-label', T.speedLabel);
    const help = button(BATTLE_TEXT.help, () => openTypeHelp(document.body), 'btn bs-help');
    top.append(back, this.roundLabel, this.speedBtn, help);
    const stage = el('div', 'bs-stage');
    this.canvas = el('canvas', 'bs-canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
    this.cards = [el('div', 'bs-card ally'), el('div', 'bs-card foe')];
    stage.append(this.canvas, this.cards[1], this.cards[0]);
    stage.addEventListener('pointerdown', () => this.skip());
    this.logLine = el('p', 'bs-log');
    this.logLine.setAttribute('aria-live', 'polite');
    this.sheet = el('div', 'bs-sheet');
    this.confirmBox = el('div', 'bs-confirm');
    this.confirmBox.hidden = true;
    this.confirmBox.append(
      el('p', undefined, T.leaveAsk),
      button(T.leaveNo, () => (this.confirmBox.hidden = true), 'btn bs-big'),
      button(T.leaveYes, () => this.leave(), 'btn btn-primary bs-big'),
    );
    this.results = el('div', 'bs-results');
    this.results.hidden = true;
    const panel = el('div', 'bs-panel');
    panel.append(this.logLine, this.sheet);
    this.root.append(top, stage, panel, this.confirmBox, this.results);
    parent.appendChild(this.root);
    // Capture, so the HUD's own Escape handling never sees it while a bout is up.
    window.addEventListener(
      'keydown',
      (e) => {
        if (this.root.hidden || e.key !== 'Escape') return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!this.results.hidden) this.close();
        else if (!this.confirmBox.hidden) this.confirmBox.hidden = true;
        else this.askLeave();
      },
      true,
    );
    window.addEventListener('resize', () => !this.root.hidden && this.resize());
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /** Starts a bout for `context` and shows it; `onDone` gets the finished bout (or null). */
  start(context: BattleContext, onDone?: (s: BattleState | null) => void): void {
    const g = this.game();
    if (!g) return;
    this.runsAtStart = g.world.battleRuns ?? 0;
    this.startedAt = performance.now();
    this.onDone = onDone ?? null;
    this.view = 'main';
    this.pendingItem = null;
    this.sentSig = null;
    this.drawnSig = '';
    this.seen.clear();
    this.pop = null;
    this.lastEvent = null;
    this.shownHp.clear();
    this.shownLead = ['', ''];
    this.playback.reset(0);
    this.playback.speed = g.world.battlePrefs?.speed ?? 1;
    this.confirmBox.hidden = true;
    this.results.hidden = true;
    this.logLine.textContent = T.waiting;
    g.send({ kind: 'battleStart', context });
    g.renderPaused = true;
    this.root.hidden = false;
    this.root.classList.toggle('gentle-sprout', false);
    this.resize();
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.frame);
  }

  /** The bout this screen started, once the sim has made it. */
  private bout(): BattleState | null {
    const g = this.game();
    const s = g?.world.battle;
    if (!g || !s || s.mode !== 'turn') return null;
    return (g.world.battleRuns ?? 0) > this.runsAtStart ? s : null;
  }

  askLeave(): void {
    const s = this.bout();
    if (!s || s.result) this.close();
    else this.confirmBox.hidden = false;
  }

  private leave(): void {
    const g = this.game();
    const s = this.bout();
    if (g && s && !s.result) g.send({ kind: 'battleForfeit' });
    this.close(null);
  }

  close(result?: BattleState | null): void {
    cancelAnimationFrame(this.rafId);
    const s = result === undefined ? this.bout() : result;
    this.root.hidden = true;
    this.confirmBox.hidden = true;
    const g = this.game();
    if (g) g.renderPaused = false;
    this.runsAtStart = Number.MAX_SAFE_INTEGER;
    const done = this.onDone;
    this.onDone = null;
    done?.(s?.result ? s : null);
  }

  private toggleSpeed(): void {
    const g = this.game();
    this.playback.speed = this.playback.speed === 1 ? 2 : 1;
    g?.send({ kind: 'battlePrefs', prefs: { speed: this.playback.speed } });
    this.drawnSig = '';
  }

  private skip(): void {
    const s = this.bout();
    if (s) {
      this.playback.skip(s.log);
      this.sync(s);
    }
  }

  private resize(): void {
    const stage = this.canvas.parentElement!;
    const rect = stage.getBoundingClientRect();
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(Math.max(160, Math.min(420, VIEW_H * aspect)));
    this.canvas.width = this.viewW * PX;
    this.canvas.height = VIEW_H * PX;
  }

  /** Shown HP and leads catch up with the bout. */
  private sync(s: BattleState): void {
    for (const c of [...s.sides[0], ...s.sides[1]]) this.shownHp.set(c.id, c.hp);
    this.shownLead = [this.leadOf(s, 0)?.id ?? '', this.leadOf(s, 1)?.id ?? ''];
  }

  private leadOf(s: BattleState, side: 0 | 1): Combatant | undefined {
    const list = s.sides[side];
    return s.lead ? list[s.lead[side]] : (list.find(standing) ?? list[0]);
  }

  private shown(s: BattleState, side: 0 | 1): Combatant | undefined {
    return s.sides[side].find((c) => c.id === this.shownLead[side]) ?? this.leadOf(s, side);
  }

  private frame = (now: number): void => {
    const s = this.bout();
    if (!s) {
      // The sim refused the bout (nobody hatched, a locked tier): give up after a moment.
      if (now - this.startedAt > 1500) this.close(null);
      else this.rafId = requestAnimationFrame(this.frame);
      return;
    }
    if (this.shownLead[0] === '' || !this.shownHp.size) {
      this.sync(s);
      this.playback.reset(s.log.length);
    }
    const cur = this.playback.current(s.log, now);
    if (cur && cur.e !== this.lastEvent) {
      this.lastEvent = cur.e;
      this.onEvent(s, cur.e, now);
    }
    if (!cur) this.sync(s);
    this.draw(s, now, cur?.e ?? null, cur?.k ?? 0);
    const busy = this.playback.busy(s.log);
    const sig = `${s.log.length}:${s.turn}:${s.phase}:${busy ? 1 : 0}:${this.view}:${this.playback.speed}`;
    if (this.sentSig !== null && !sig.startsWith(this.sentSig)) this.sentSig = null;
    if (sig !== this.drawnSig) {
      this.drawnSig = sig;
      this.renderCards(s);
      this.renderSheet(s, busy);
      this.roundLabel.textContent = BATTLE_TEXT.round(s.turn, s.context.tier);
      this.speedBtn.textContent = T.speed(this.playback.speed);
    }
    if (cur) this.logLine.textContent = this.line(s, cur.e) ?? this.logLine.textContent;
    if (s.result && !busy && this.results.hidden) this.showResults(s);
    if (this.view === 'swing') this.drawSwing(now);
    this.rafId = requestAnimationFrame(this.frame);
  };

  private names(s: BattleState): (id: string) => string {
    const map = new Map([...s.sides[0], ...s.sides[1]].map((c) => [c.id, combatantName(c)]));
    return (id) => map.get(id) ?? id;
  }

  private line(s: BattleState, e: BattleEvent): string | null {
    return formatEvent(e, this.names(s));
  }

  /** An event starts playing: move the shown HP and leads, and give the hit its feel. */
  private onEvent(s: BattleState, e: BattleEvent, now: number): void {
    if (e.k === 'hit') {
      this.shownHp.set(e.to, Math.max(0, (this.shownHp.get(e.to) ?? 0) - e.dmg));
      this.pop = { id: e.to, text: `-${e.dmg}`, at: now };
      const by = [...s.sides[0], ...s.sides[1]].find((c) => c.id === e.to);
      if (e.move && by && e.eff !== undefined)
        this.seen.set(`${moveOf(e.move).type}>${by.type}`, e.eff);
      playSound('hit');
      if (isSoundEnabled() && isAudioUnlocked()) navigator.vibrate?.(10);
    } else if (e.k === 'rally' || e.k === 'cuddle') {
      const id = e.k === 'rally' ? e.by : e.who;
      this.shownHp.set(id, (this.shownHp.get(id) ?? 0) + e.heal);
      this.pop = { id, text: `+${e.heal}`, at: now };
    } else if (e.k === 'swap') this.shownLead[e.side] = e.to;
    else if (e.k === 'miss') playSound('tap');
    this.drawnSig = '';
  }

  // ---------- the stage ----------

  private draw(s: BattleState, now: number, e: BattleEvent | null, k: number): void {
    const ctx = this.ctx;
    const W = this.viewW;
    const H = VIEW_H;
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const sky =
      s.context.kind === 'story' ? C.darkPlum : s.context.kind === 'circuit' ? C.skyLight : C.wood;
    ctx.fillStyle = color(sky);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color(s.context.kind === 'story' ? C.plum : C.sand);
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
    // Two pads: ours lower left, theirs upper right.
    ctx.fillStyle = color(C.sandDeep);
    ctx.fillRect(Math.round(W * 0.1), Math.round(H * 0.86), Math.round(W * 0.36), 6);
    ctx.fillRect(Math.round(W * 0.56), Math.round(H * 0.52), Math.round(W * 0.34), 5);
    const still = reduced();
    const g = this.game();
    for (const side of [1, 0] as const) {
      const c = this.shown(s, side);
      if (!c) continue;
      const x = side === 0 ? W * 0.28 : W * 0.73;
      const floor = side === 0 ? H * 0.88 : H * 0.54;
      const hp = this.shownHp.get(c.id) ?? c.hp;
      const out = hp <= 0 || (c.friend && !this.playback.busy(s.log));
      let dx = 0;
      let clip: ClipName = out ? (side === 0 ? 'sleep' : 'walk') : 'idle';
      if (e && !still) {
        const by = 'by' in e ? e.by : null;
        if (e.k === 'use' && by === c.id) dx = (side === 0 ? 1 : -1) * Math.sin(k * Math.PI) * 10;
        if (e.k === 'hit' && e.to === c.id) dx = Math.sin(k * Math.PI * 6) * 3 * (1 - k);
        if (e.k === 'miss' && e.to === c.id) dx = Math.sin(k * Math.PI * 2) * 6;
        if (e.k === 'tuckered' && e.who === c.id && side === 1) dx = k * W * 0.4;
        if (e.k === 'befriend' && e.who === c.id) dx = -k * W * 0.3;
      }
      if (e && e.k === 'hit' && e.to === c.id) clip = 'sad';
      if (e && (e.k === 'befriend' || e.k === 'cuddle')) clip = 'happy';
      if (out && side === 1 && !(e && 'who' in e && e.who === c.id)) continue;
      const sheet = g ? this.sheetFor(g, c) : null;
      if (sheet) this.drawSprite(sheet, clip, now, x + dx, floor, side === 1);
      if (out && side === 0) {
        ctx.fillStyle = color(C.leaf);
        ctx.fillRect(Math.round(x - 12), Math.round(floor - 14), 24, 4);
        drawShadowText(ctx, BATTLE_TEXT.zzz, x + 14, floor - 30, color(C.cream), color(C.darkPlum));
      }
      if (this.pop?.id === c.id && now - this.pop.at < 700) {
        const t = (now - this.pop.at) / 700;
        const rise = still ? 0 : t * 10;
        ctx.globalAlpha = still ? Math.min(1, t * 3) : 1 - t * 0.5;
        drawShadowText(
          ctx,
          this.pop.text,
          x,
          floor - 44 - rise,
          color(C.cream),
          color(C.darkPlum),
          1,
          'center',
        );
        ctx.globalAlpha = 1;
      }
    }
  }

  private sheetFor(g: Game, c: Combatant): SpriteSheet | null {
    try {
      const n = c.nubbinId ? g.world.nubbins.find((x) => x.id === c.nubbinId) : null;
      return n ? g.view.sheets.forNubbin(n) : g.view.sheets.species(c.species);
    } catch {
      return null;
    }
  }

  private drawSprite(
    sheet: SpriteSheet,
    clip: ClipName,
    now: number,
    x: number,
    floor: number,
    flip: boolean,
  ): void {
    const f = frameAt(CLIPS[clip], now);
    const rect =
      sheet.frames.get(frameKey(clip, 'side', f)) ?? sheet.frames.get(frameKey('idle', 'side', 0));
    if (!rect) return;
    const image = sheet.texture.image as HTMLCanvasElement;
    const w = rect.w / PX;
    const h = rect.h / PX;
    const dx = Math.round(x - w / 2);
    const dy = Math.round(floor - h + 2);
    const ctx = this.ctx;
    ctx.save();
    if (flip) {
      ctx.translate(dx + w, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, w, h);
    } else ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, w, h);
    ctx.restore();
  }

  // ---------- the HP cards ----------

  private renderCards(s: BattleState): void {
    for (const side of [0, 1] as const) {
      const box = this.cards[side];
      box.innerHTML = '';
      const c = this.shown(s, side);
      if (!c) continue;
      const hp = Math.max(0, this.shownHp.get(c.id) ?? c.hp);
      const t = TYPE_WORDS[c.type];
      box.appendChild(el('div', 'bs-name', `${t.icon} ${combatantName(c)} · ${t.name}`));
      const bar = el('div', 'bs-hp');
      const fill = el('span');
      fill.style.width = `${Math.round((100 * hp) / c.maxHp)}%`;
      bar.appendChild(fill);
      box.append(bar, el('div', 'bs-hpnum', `❤ ${BATTLE_TEXT.hp} ${hp}/${c.maxHp}`));
      if (c.calm !== undefined) {
        const calm = el('div', 'bs-calm', `${T.calmIcon} ${T.calm} ${c.calm}/100`);
        box.appendChild(calm);
      }
      const marks: string[] = [];
      if (hp <= 0)
        marks.push(side === 0 ? `🍃 ${BATTLE_TEXT.tuckered}` : `🎒 ${BATTLE_TEXT.wentHome}`);
      if (c.major) marks.push(`${STATUS_TEXT[c.major.id].icon} ${STATUS_TEXT[c.major.id].name}`);
      for (const st of MOOD_STATS) if (c.moods[st]) marks.push(moodWord(st, c.moods[st]!));
      if (side === 0)
        marks.push(
          `${BATTLE_TEXT.puff} ${'●'.repeat(c.puff)}${'○'.repeat(Math.max(0, c.puffMax - c.puff))}`,
        );
      if (s.lead) {
        const team = s.sides[side].map((x) => (standing(x) ? '●' : '○')).join('');
        marks.push(team);
      }
      box.appendChild(el('div', 'bs-marks', marks.join(' · ')));
      box.setAttribute('aria-label', `${combatantName(c)}, ${BATTLE_TEXT.hp} ${hp}/${c.maxHp}`);
    }
  }

  // ---------- the action sheet ----------

  private send(s: BattleState, a: BattleAction): void {
    const g = this.game();
    if (!g || s.result || this.sentSig !== null) return;
    this.sentSig = `${s.log.length}:${s.turn}:${s.phase}:`;
    this.view = 'main';
    this.pendingItem = null;
    g.send({ kind: 'battleAct', action: a });
    this.drawnSig = '';
  }

  private big(label: string, sub: string, press: () => void, cls = ''): HTMLButtonElement {
    const b = button('', press, `btn bs-tile ${cls}`);
    b.append(el('span', 'bs-tile-name', label));
    if (sub) b.append(el('small', undefined, sub));
    return b;
  }

  /** The best move against the foe on the field, by type chart then power (gentle hints). */
  private bestMove(s: BattleState, me: Combatant): string {
    const foe = s.sides[1].find((c) => onField(s, c));
    let best = 'bonk';
    let score = -1;
    for (const id of ['bonk', ...me.moves]) {
      const d = moveOf(id);
      if ((d.kind !== 'bonk' && d.kind !== 'splash') || !canChoose(s, me, this.act(id, foe?.id)))
        continue;
      const v = (foe ? typeMult(d.type, foe.type) : 1) * 1000 + d.power;
      if (v > score) [best, score] = [id, v];
    }
    return best;
  }

  private act(id: string, target?: string): BattleAction {
    const t = target === undefined ? {} : { target };
    if (id === 'bonk') return { k: 'strike', ...t };
    if (id === 'huddle') return { k: 'rally' };
    return { k: 'move', move: id, ...t };
  }

  private renderSheet(s: BattleState, busy: boolean): void {
    const sheet = this.sheet;
    sheet.innerHTML = '';
    const sprout = s.gentle === 'sprout';
    this.root.classList.toggle('gentle-sprout', sprout);
    if (s.result) return;
    if (busy) {
      sheet.appendChild(this.big(T.tapToSkip, '', () => this.skip(), 'bs-wide'));
      return;
    }
    const me = s.sides[0][s.active];
    if (s.phase === 'replace') {
      sheet.appendChild(el('p', 'bs-prompt', T.pickNext));
      this.benchButtons(s, sheet);
      return;
    }
    if (!me) return;
    if (this.logLine.textContent === T.waiting)
      this.logLine.textContent = T.yourTurn(combatantName(me));
    const foe = s.sides[1].find((c) => onField(s, c));
    if (this.view === 'swap') {
      sheet.appendChild(el('p', 'bs-prompt', T.swapTitle));
      this.benchButtons(s, sheet);
      sheet.appendChild(this.big(BATTLE_TEXT.cancel, '', () => this.setView('main'), 'bs-wide'));
      return;
    }
    if (this.view === 'item' || this.view === 'target') {
      this.itemButtons(s, me, foe, sheet);
      return;
    }
    if (this.view === 'swing') {
      const bar = this.big(T.swingTap, '', () => this.swing(s, foe), 'bs-wide bs-swing');
      bar.appendChild(el('i', 'bs-swing-dot'));
      sheet.appendChild(bar);
      this.swingAt = performance.now();
      return;
    }
    const grid = el('div', 'bs-grid');
    const best = s.gentle ? this.bestMove(s, me) : null;
    const ids = sprout ? [best!] : ['bonk', ...me.moves].slice(0, 4);
    for (const id of ids) {
      const d = moveOf(id);
      const t = TYPE_WORDS[d.type];
      const cost = puffCost(s, me, id);
      const a = this.act(id, d.target === 'foe' ? foe?.id : undefined);
      const ok = canChoose(s, me, a);
      const eff = foe ? this.seen.get(`${d.type}>${foe.type}`) : undefined;
      const badge =
        eff === undefined ? '' : eff > 1 ? ` ${T.matchGood}` : eff < 1 ? ` ${T.matchPoor}` : '';
      const pips = cost === 0 ? BATTLE_TEXT.cost(0) : '●'.repeat(cost);
      const tile = this.big(moveName(id), `${t.icon} ${t.name} · ${pips}${badge}`, () => {
        if (id === 'bonk' && s.context.kind === 'dojo' && !s.gentle) this.setView('swing');
        else this.send(s, a);
      });
      tile.disabled = !ok;
      if (id === best) tile.classList.add('bs-glow');
      this.longPress(tile, id);
      grid.appendChild(tile);
    }
    if (sprout)
      grid.appendChild(this.big(T.hug, '🤗', () => this.send(s, { k: 'guard' }), 'bs-hug'));
    sheet.appendChild(grid);
    if (best && foe) {
      const word = T.hintWord[moveOf(best).type] ?? '';
      sheet.appendChild(el('p', 'bs-hint', T.hint(moveName(best), word)));
    }
    if (sprout) return;
    const row = el('div', 'bs-row');
    const swap = button(T.swap, () => this.setView('swap'), 'btn bs-act');
    swap.disabled = bench(s, 0).length === 0;
    const item = button(T.item, () => this.setView('item'), 'btn bs-act');
    item.disabled = !BATTLE_ITEMS.some((i) => itemsLeft(s, 0, i) > 0);
    const breath = button(T.breath, () => this.send(s, { k: 'guard' }), 'btn bs-act');
    row.append(swap, item, breath);
    sheet.appendChild(row);
  }

  private setView(v: View): void {
    this.view = v;
    this.drawnSig = '';
  }

  private benchButtons(s: BattleState, box: HTMLElement): void {
    const grid = el('div', 'bs-grid');
    for (const c of bench(s, 0)) {
      const t = TYPE_WORDS[c.type];
      grid.appendChild(
        this.big(
          combatantName(c),
          `${t.icon} ${t.name} · ${BATTLE_TEXT.hp} ${c.hp}/${c.maxHp}`,
          () => this.send(s, { k: 'swap', to: c.id }),
        ),
      );
    }
    box.appendChild(grid);
  }

  private itemButtons(
    s: BattleState,
    me: Combatant,
    foe: Combatant | undefined,
    box: HTMLElement,
  ): void {
    const grid = el('div', 'bs-grid');
    if (this.view === 'target' && this.pendingItem) {
      const item = this.pendingItem;
      box.appendChild(el('p', 'bs-prompt', T.onWho(T.items[item]!.name)));
      for (const to of [me, foe]) {
        if (!to) continue;
        const a: BattleAction = { k: 'item', item, target: to.id };
        const b = this.big(combatantName(to), '', () => this.send(s, a));
        b.disabled = !canChoose(s, me, a);
        grid.appendChild(b);
      }
    } else {
      box.appendChild(el('p', 'bs-prompt', T.itemTitle));
      for (const item of BATTLE_ITEMS) {
        const left = itemsLeft(s, 0, item);
        if (left <= 0) continue;
        const info = T.items[item]!;
        const press = (): void => {
          if (item === 'toy') this.send(s, { k: 'item', item, ...(foe ? { target: foe.id } : {}) });
          else if (foe?.calm !== undefined) {
            this.pendingItem = item;
            this.setView('target');
          } else this.send(s, { k: 'item', item, target: me.id });
        };
        grid.appendChild(this.big(`${info.icon} ${info.name}`, `×${left}`, press));
      }
      if (!grid.children.length) box.appendChild(el('p', 'bs-prompt', T.noItems));
    }
    box.appendChild(grid);
    box.appendChild(this.big(BATTLE_TEXT.cancel, '', () => this.setView('main'), 'bs-wide'));
  }

  /** Long-press a move for its blurb. */
  private longPress(b: HTMLButtonElement, id: string): void {
    const show = (): void => {
      const text = BATTLE_MOVE_TEXT[id]?.blurb;
      if (text) this.logLine.textContent = `${moveName(id)}: ${text}`;
    };
    b.addEventListener('pointerdown', () => {
      clearTimeout(this.holdTimer);
      this.holdTimer = window.setTimeout(show, 450);
    });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel'])
      b.addEventListener(ev, () => clearTimeout(this.holdTimer));
    b.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      show();
    });
  }

  // ---------- the dojo's Power swing (recs FIGHT-28) ----------

  private swingOffset(now: number): number {
    // 0 in the middle, 1 at either end; one sweep a second or so.
    const t = ((now - this.swingAt) / 1000) * BATTLE.karate.barSpeed;
    return Math.abs(Math.cos(t * Math.PI));
  }

  private drawSwing(now: number): void {
    const dot = this.sheet.querySelector<HTMLElement>('.bs-swing-dot');
    if (!dot) return;
    const t = ((now - this.swingAt) / 1000) * BATTLE.karate.barSpeed;
    dot.style.left = `${Math.round(50 + 45 * Math.sin(t * Math.PI))}%`;
  }

  private swing(s: BattleState, foe: Combatant | undefined): void {
    const sweet = this.swingOffset(performance.now()) <= BATTLE.karate.sweetSpot;
    this.send(s, {
      k: 'strike',
      ...(foe ? { target: foe.id } : {}),
      ...(sweet ? { swing: true } : {}),
    });
  }

  // ---------- results ----------

  private showResults(s: BattleState): void {
    const r = s.result!;
    const box = this.results;
    box.innerHTML = '';
    const card = el('div', 'bs-results-card');
    const title =
      r.reason === 'hug'
        ? T.hugged
        : r.reason === 'friends'
          ? T.friends
          : r.winner === 0
            ? T.won
            : r.winner === 1
              ? T.lost
              : T.draw;
    card.appendChild(el('h2', undefined, T.results));
    card.appendChild(el('p', 'celebrate-form', title));
    const shells = prizeFor(s.context, r, !!s.gentle);
    if (shells > 0) card.appendChild(el('p', undefined, BATTLE_TEXT.prize(shells, NAMES.currency)));
    for (const f of s.sides[1]) {
      if (f.friend) card.appendChild(el('p', undefined, T.newFriend(combatantName(f))));
      else if (f.calm !== undefined)
        card.appendChild(el('p', undefined, T.calmed(combatantName(f), f.calm)));
    }
    card.appendChild(button(T.backToGrove, () => this.close(), 'btn btn-primary bs-big'));
    box.appendChild(card);
    box.hidden = false;
    playSound(r.winner === 0 ? 'win' : 'sad');
  }
}
