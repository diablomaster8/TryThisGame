import '../battle.css';
import { HAT_LABELS, NAMES } from '../config/strings';
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
import type { Game } from '../game';
import { Playback } from '../minigames/battle/playback';
import { isAudioUnlocked, isSoundEnabled, playSound } from '../platform/audio';
import { battleSfx } from './battle-sfx';
import { idleKind, idlePose } from './battle-idle';
import { postcardRow } from './battle-postcard';
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
import { button, dialogFocus, el } from './dom';
import '../battle-r5.css';
import { GYM } from '../config/tuning';
import { BATTLE_ATB } from '../config/tuning-battle-atb';
import { BATTLE_R5 } from '../config/tuning-battle-r5';
import { ATB_TEXT } from '../config/strings-battle-atb';
import {
  INSPECT_TEXT,
  RING_TEXT,
  SPOILS_TEXT,
  STAT_SHORT,
  WHO_TEXT,
} from '../config/strings-battle-r5';
import { pairSeen } from '../sim/battle';
import { cooldownLeft, pausedForHidden } from '../sim/battle/atb';
import { quipFor } from '../sim/battle/lines';
import { whoChoices } from '../sim/battle/turn';
import { ATB_COMMANDS, type AtbCommand, type Timing } from '../sim/battle/types';
import type { StatKey } from '../sim/types';
import { closeInspect, inspectOpen, openInspect } from './battle-inspect';
import { nubbinPortrait } from './battle-party-pick';
import { PreBout } from './battle-prebout';
import { canFuse } from '../sim/battle/fusion';
import { FRIENDLY_TEXT, FUSION_TEXT } from '../config/strings-battle-r6';
import { currentReplay, recordAct, recordStart } from './battle-record';

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
 *
 * Round 5: every bout opens on the pre-bout sheet first (FIGHT-86). Bonk-kind moves get the
 * optional timing ring (FIGHT-87), or a steady ×1.1 with "Steady hands" (FIGHT-79); doubles
 * ask "Who?" with portraits (FIGHT-60); a Command bout (`s.atb`, FIGHT-40) shows gauges and
 * four order buttons with cooldown rings instead of moves, pauses while the Item sheet is open
 * and while the tab is hidden (FIGHT-41). The log reads the comedy lines first (FIGHT-75), the
 * results card shows the spoils (FIGHT-74), the foe's card opens "Inspect" (FIGHT-77), and the
 * effectiveness badges show once a pairing has been seen (always in Gentle bouts). Keyboard Tab
 * order is moves, then actions, then the top bar (the DOM order; CSS keeps the layout).
 */
const VIEW_H = 160;
type View = 'main' | 'swap' | 'item' | 'target' | 'who' | 'ring';

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
  /** Pass-and-play: Keeper 2 has lifted the cover over their moves. */
  private passShown = false;
  private rafId = 0;
  private viewW = 260;
  private onDone: ((s: BattleState | null) => void) | null = null;
  /** HP and leads as the playback has shown them so far. */
  private shownHp = new Map<string, number>();
  private shownLead: [string, string] = ['', ''];
  private pop: { id: string; text: string; at: number } | null = null;
  private holdTimer = 0;
  private lastEvent: BattleEvent | null = null;
  /** Round 5: the pre-bout sheet, the move waiting on "Who?" or the ring, the ring's start. */
  private prebout: PreBout | null = null;
  private pendingMove: { id: string; target?: string } | null = null;
  private ringAt = 0;
  /** A Command bout's live bits, updated every frame without rebuilding the buttons. */
  private atbSig = '';
  private gauges = new Map<string, { fill: HTMLElement; num: HTMLElement; name: string }>();
  private orderBtns = new Map<AtbCommand, HTMLButtonElement>();
  private readonly veil: HTMLDivElement;
  private readonly trap: { opened(): void; closed(): void };
  private recorded = false;

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
    // The foe's card opens "Inspect" (FIGHT-77); its own press never skips the playback.
    const foeCard = this.cards[1];
    foeCard.setAttribute('role', 'button');
    foeCard.tabIndex = 0;
    foeCard.addEventListener('pointerdown', (e) => e.stopPropagation());
    foeCard.addEventListener('click', () => this.inspect());
    foeCard.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      this.inspect();
    });
    this.logLine = el('p', 'bs-log');
    this.logLine.setAttribute('aria-live', 'polite');
    this.logLine.setAttribute('role', 'log');
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
    // A Command bout's "Paused" veil while the tab was hidden (FIGHT-41).
    this.veil = el('div', 'bs-veil');
    this.veil.hidden = true;
    this.veil.append(
      el('strong', undefined, ATB_TEXT.paused),
      el('p', undefined, ATB_TEXT.pausedHelp),
    );
    // DOM order is the Tab order (moves, actions, then the top bar); CSS places them.
    this.root.append(panel, top, stage, this.veil, this.confirmBox, this.results);
    parent.appendChild(this.root);
    this.trap = dialogFocus(this.root, this.root, null);
    document.addEventListener('visibilitychange', () => this.onVisibility());
    // Capture, so the HUD's own Escape handling never sees it while a bout is up.
    window.addEventListener(
      'keydown',
      (e) => {
        if (this.root.hidden || e.key !== 'Escape') return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (inspectOpen()) closeInspect();
        else if (!this.results.hidden) this.close();
        else if (!this.confirmBox.hidden) this.confirmBox.hidden = true;
        else this.askLeave();
      },
      true,
    );
    window.addEventListener('resize', () => !this.root.hidden && this.resize());
  }

  get isOpen(): boolean {
    return !this.root.hidden || !!this.prebout?.isOpen;
  }

  /**
   * Opens the pre-bout sheet for `context` (FIGHT-86); "Let's play!" starts the bout on this
   * screen, "Skip" resolves a story bout in the sim (FIGHT-71), and Back sends nothing at all.
   * `onDone` gets the finished bout, or null when the Keeper backed out.
   */
  start(context: BattleContext, onDone?: (s: BattleState | null) => void): void {
    const g = this.game();
    if (!g) return;
    this.prebout ??= new PreBout(this.root.parentElement ?? document.body, this.game);
    this.prebout.open(context, {
      play: (c) => this.begin(c, onDone),
      skip: (c) => this.skipBout(c, onDone),
      back: () => onDone?.(null),
    });
  }

  /** A skipped story bout: the sim resolves and pays it; the sheet shows what it paid. */
  private skipBout(context: BattleContext, onDone?: (s: BattleState | null) => void): void {
    const g = this.game();
    if (!g) return;
    const runs = g.world.battleRuns ?? 0;
    const shells = g.world.inventory.shells;
    g.send({ kind: 'battleStart', context: { ...context, auto: true } });
    const t0 = performance.now();
    const wait = (): void => {
      const s = g.world.battle;
      if ((g.world.battleRuns ?? 0) > runs && s?.result) {
        this.prebout?.showSkipped(g.world.inventory.shells - shells, () => onDone?.(s));
      } else if (performance.now() - t0 < 2000) requestAnimationFrame(wait);
      else onDone?.(null);
    };
    requestAnimationFrame(wait);
  }

  /** Reopens the bout a load found still going (FIGHT-64), without starting a new one. */
  resume(onDone?: (s: BattleState | null) => void): void {
    const s = this.game()?.world.battle;
    if (!s || s.result || s.mode !== 'turn') return;
    this.begin(s.context, onDone, true);
  }

  private begin(
    context: BattleContext,
    onDone?: (s: BattleState | null) => void,
    resumed = false,
  ): void {
    const g = this.game();
    if (!g) return;
    this.pendingMove = null;
    this.atbSig = '';
    this.recorded = false;
    this.veil.hidden = true;
    this.runsAtStart = g.world.battleRuns ?? 0;
    this.startedAt = performance.now();
    this.onDone = onDone ?? null;
    this.view = 'main';
    this.pendingItem = null;
    this.sentSig = null;
    this.drawnSig = '';
    this.pop = null;
    this.lastEvent = null;
    this.shownHp.clear();
    this.shownLead = ['', ''];
    this.playback.reset(0);
    this.playback.speed = g.world.battlePrefs?.speed ?? 1;
    this.confirmBox.hidden = true;
    this.results.hidden = true;
    this.logLine.textContent = T.waiting;
    if (resumed) this.runsAtStart = (g.world.battleRuns ?? 1) - 1;
    else g.send({ kind: 'battleStart', context });
    g.renderPaused = true;
    this.root.hidden = false;
    this.root.classList.toggle('gentle-sprout', false);
    this.trap.opened();
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
    if (this.root.hidden && this.prebout?.isOpen) {
      this.prebout.back();
      return;
    }
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
    closeInspect();
    if (!this.root.hidden) {
      this.root.hidden = true;
      this.trap.closed();
    }
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
    if (!this.recorded) {
      this.recorded = true;
      recordStart(s);
    }
    // The game itself stops while the tab is hidden, so the pause lands as it comes back.
    this.veil.hidden = !s.atb || !!s.result || !(pausedForHidden(s) || document.hidden);
    const cur = this.playback.current(s.log, now);
    if (cur && cur.e !== this.lastEvent) {
      this.lastEvent = cur.e;
      this.onEvent(s, cur.e, now);
    }
    if (!cur) this.sync(s);
    this.draw(s, now, cur?.e ?? null, cur?.k ?? 0);
    const busy = this.playback.busy(s.log);
    const sig = `${s.log.length}:${s.turn}:${s.phase}:${busy ? 1 : 0}:${this.view}:${this.playback.speed}:${s.passPlay ? `pp${s.passPlay.choosing}${this.passShown ? 1 : 0}` : ''}`;
    if (this.sentSig !== null && !sig.startsWith(this.sentSig)) this.sentSig = null;
    // A Command bout's sheet is rebuilt only when its shape changes, so a press is never lost
    // to a rebuild; its gauges and cooldowns move every frame in `updateAtb`.
    const atbSig = s.atb
      ? `atb:${this.view}:${s.result ? 1 : 0}:${s.sides[0].map((c) => `${c.id}${onField(s, c) ? 1 : 0}${c.hp > 0 ? 1 : 0}`).join()}:${s.sides[1].map((c) => (onField(s, c) ? c.id : '')).join()}`
      : '';
    if (sig !== this.drawnSig) {
      this.drawnSig = sig;
      this.renderCards(s);
      if (!s.atb) this.renderSheet(s, busy);
      this.roundLabel.textContent = BATTLE_TEXT.round(s.turn, s.context.tier);
      this.speedBtn.textContent = T.speed(this.playback.speed);
    }
    if (s.atb && atbSig !== this.atbSig) {
      this.atbSig = atbSig;
      this.renderSheet(s, busy);
    }
    if (s.atb) this.updateAtb(s);
    if (cur) this.logLine.textContent = this.line(s, cur.e) ?? this.logLine.textContent;
    if (s.result && !busy && this.results.hidden) this.showResults(s);
    if (this.view === 'ring') this.drawRing(s, now);
    this.rafId = requestAnimationFrame(this.frame);
  };

  private names(s: BattleState): (id: string) => string {
    const map = new Map([...s.sides[0], ...s.sides[1]].map((c) => [c.id, combatantName(c)]));
    return (id) => map.get(id) ?? id;
  }

  private line(s: BattleState, e: BattleEvent): string | null {
    const name = this.names(s);
    if (e.k === 'order') return ATB_TEXT.order(name(e.who), e.cmd, e.obeyed);
    if (e.k === 'gag') return ATB_TEXT.gag(name(e.who), e.gag);
    if (e.k === 'swing') return e.sweet ? RING_TEXT.nice : null;
    // The comedy lines first (FIGHT-75), then the plain one.
    const ix = s.log.indexOf(e);
    return (ix >= 0 ? quipFor(s, ix, name) : null) ?? formatEvent(e, name);
  }

  /** An event starts playing: move the shown HP and leads, and give the hit its feel. */
  private onEvent(s: BattleState, e: BattleEvent, now: number): void {
    if (e.k === 'hit') {
      this.shownHp.set(e.to, Math.max(0, (this.shownHp.get(e.to) ?? 0) - e.dmg));
      this.pop = { id: e.to, text: `-${e.dmg}`, at: now };
      playSound(battleSfx(e) ?? 'hit');
      if (isSoundEnabled() && isAudioUnlocked()) navigator.vibrate?.(10);
    } else if (e.k === 'rally' || e.k === 'cuddle') {
      const id = e.k === 'rally' ? e.by : e.who;
      this.shownHp.set(id, (this.shownHp.get(id) ?? 0) + e.heal);
      this.pop = { id, text: `+${e.heal}`, at: now };
    } else if (e.k === 'swing' && e.sweet) this.pop = { id: e.by, text: RING_TEXT.nice, at: now };
    else if (e.k === 'swap') this.shownLead[e.side] = e.to;
    // FIGHT-95: the fusion's big comedic moment, a shout and a boing.
    else if (e.k === 'fusion') {
      this.pop = { id: e.who, text: e.on ? FUSION_TEXT.pop : FUSION_TEXT.popOff, at: now };
      playSound(e.on ? 'slideUp' : 'boing');
    }
    else if (e.k === 'miss') playSound('tap');
    // FIGHT-76: a Dizzy self-bonk boings, a tuckered-out Nubbin yawns.
    else if (e.k === 'boing' || e.k === 'tuckered') playSound(battleSfx(e)!);
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
      // FIGHT-78: a personality idle while the bout waits for the Keeper.
      let dy = 0;
      if (!e && !out && !s.result && s.phase === 'choose') {
        const n = c.nubbinId ? g?.world.nubbins.find((x) => x.id === c.nubbinId) : null;
        const idle = idlePose(
          idleKind({ ...c, moody: n?.moody ?? null }),
          c.id,
          s.seed,
          now,
          still,
        );
        dx += idle.dx;
        dy = idle.dy;
        if (idle.glyph)
          drawShadowText(ctx, idle.glyph, x + 10, floor - 34, color(C.cream), color(C.darkPlum));
      }
      if (sheet) this.drawSprite(sheet, clip, now, x + dx, floor + dy, side === 1);
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
      const label = `${combatantName(c)}, ${t.name}, ${BATTLE_TEXT.hp} ${hp}/${c.maxHp}`;
      box.setAttribute('aria-label', side === 1 ? `${INSPECT_TEXT.inspect(label)}` : label);
    }
  }

  // ---------- the action sheet ----------

  private send(s: BattleState, a: BattleAction): void {
    const g = this.game();
    if (!g || s.result) return;
    // A Command bout never waits on a turn, so it has no one-action-per-turn latch.
    if (!s.atb) {
      if (this.sentSig !== null) return;
      this.sentSig = `${s.log.length}:${s.turn}:${s.phase}:`;
    }
    const wasItems = this.view === 'item' || this.view === 'target';
    this.view = 'main';
    this.pendingItem = null;
    this.pendingMove = null;
    this.raw(s, a);
    if (s.atb && wasItems) this.raw(s, { k: 'pause', why: 'items', on: false });
    this.drawnSig = '';
  }

  /** Sends one action as is (and keeps it for the debug panel's replay). */
  private raw(s: BattleState, a: BattleAction): void {
    recordAct(s, a);
    this.game()?.send({ kind: 'battleAct', action: a });
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

  private act(id: string, target?: string, timing?: Timing): BattleAction {
    const t = target === undefined ? {} : { target };
    const tm = timing === undefined ? {} : { timing };
    if (id === 'bonk') return { k: 'strike', ...t, ...tm };
    if (id === 'huddle') return { k: 'rally' };
    return { k: 'move', move: id, ...t, ...tm };
  }

  /** A move tile pressed: "Who?" first in doubles when there is a choice, then the ring. */
  private choose(s: BattleState, me: Combatant, id: string, foe: Combatant | undefined): void {
    if (s.doubles) {
      const w = whoChoices(s, me.id, id);
      if (w.pick !== 'none' && w.ids.length > 1) {
        this.pendingMove = { id };
        this.setView('who');
        return;
      }
      if (w.pick !== 'none' && w.ids.length === 1) {
        this.aim(s, id, w.ids[0]);
        return;
      }
    }
    this.aim(s, id, moveOf(id).target === 'foe' ? foe?.id : undefined);
  }

  /**
   * The timing ring for a Bonk-kind move (FIGHT-87), unless the bout is gentle (kid mode: no
   * timing at all) or "Steady hands" is on (a fixed ×1.1, FIGHT-79).
   */
  private aim(s: BattleState, id: string, target?: string): void {
    const g = this.game();
    if (moveOf(id).kind !== 'bonk' || s.gentle || !g) {
      this.send(s, this.act(id, target));
      return;
    }
    if (g.world.settings.steadyHands) {
      this.send(s, this.act(id, target, 'steady'));
      return;
    }
    this.pendingMove = { id, ...(target === undefined ? {} : { target }) };
    this.ringAt = performance.now();
    this.setView('ring');
  }

  private renderSheet(s: BattleState, busy: boolean): void {
    const sheet = this.sheet;
    // Keyboard play: a rebuild must not drop focus out of the screen (FIGHT-79).
    const at = document.activeElement;
    const refocus = !at || at === document.body || at === this.root || sheet.contains(at);
    sheet.innerHTML = '';
    this.fillSheet(s, busy);
    if (refocus && !this.root.hidden)
      sheet
        .querySelector<HTMLButtonElement>('button:not(:disabled)')
        ?.focus({ preventScroll: true });
  }

  private fillSheet(s: BattleState, busy: boolean): void {
    const sheet = this.sheet;
    const sprout = s.gentle === 'sprout';
    this.root.classList.toggle('gentle-sprout', sprout);
    if (s.result) return;
    if (s.atb) {
      this.atbSheet(s);
      return;
    }
    if (busy) {
      sheet.appendChild(this.big(T.tapToSkip, '', () => this.skip(), 'bs-wide'));
      return;
    }
    if (s.passPlay?.choosing === 1) {
      this.secondKeeperSheet(s, sheet);
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
    if (this.view === 'who' && this.pendingMove) {
      this.whoButtons(s, me, this.pendingMove.id);
      return;
    }
    if (this.view === 'ring' && this.pendingMove) {
      this.ringButton(s);
      return;
    }
    const g = this.game();
    const grid = el('div', 'bs-grid');
    const best = s.gentle ? this.bestMove(s, me) : null;
    const ids = sprout ? [best!] : ['bonk', ...me.moves].slice(0, 4);
    for (const id of ids) {
      const d = moveOf(id);
      const t = TYPE_WORDS[d.type];
      const cost = puffCost(s, me, id);
      const a = this.act(id, d.target === 'foe' ? foe?.id : undefined);
      const ok = canChoose(s, me, a);
      // The badge only once that pairing has been seen to land (FIGHT-77); always when gentle.
      const known = !!foe && !!g && (!!s.gentle || pairSeen(g.world, d.type, foe.type));
      const eff =
        known && d.kind !== 'status' && d.kind !== 'support' ? typeMult(d.type, foe.type) : 1;
      const badge = eff > 1 ? ` ${T.matchGood}` : eff < 1 ? ` ${T.matchPoor}` : '';
      const pips = cost === 0 ? BATTLE_TEXT.cost(0) : '●'.repeat(cost);
      const tile = this.big(moveName(id), `${t.icon} ${t.name} · ${pips}${badge}`, () =>
        this.choose(s, me, id, foe),
      );
      if (badge) tile.dataset.eff = String(eff);
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
    // Fusion burst (FIGHT-95): shown only while the partners may fuse.
    if (canFuse(s)) {
      const fuseBtn = button(
        FUSION_TEXT.button,
        () => this.send(s, { k: 'fuse' }),
        'btn bs-act bs-fuse',
      );
      fuseBtn.title = FUSION_TEXT.help;
      row.appendChild(fuseBtn);
    }
    sheet.appendChild(row);
  }

  /**
   * Pass-and-play (FIGHT-96): Keeper 2's picks, behind a cover so Keeper 1's choice and
   * Keeper 2's moves are never on screen together.
   */
  private secondKeeperSheet(s: BattleState, sheet: HTMLElement): void {
    const me = s.sides[1][s.active];
    if (!me) return;
    // The latch on sends is per turn; Keeper 2's pick is a second send in the same turn.
    this.sentSig = null;
    if (!this.passShown) {
      sheet.appendChild(el('p', 'bs-prompt', FRIENDLY_TEXT.pass));
      sheet.appendChild(
        this.big(
          FRIENDLY_TEXT.ready,
          '',
          () => {
            this.passShown = true;
            this.drawnSig = '';
          },
          'bs-wide',
        ),
      );
      return;
    }
    sheet.appendChild(el('p', 'bs-prompt', FRIENDLY_TEXT.picking(combatantName(me))));
    const grid = el('div', 'bs-grid');
    const pick = (a: BattleAction) => {
      this.passShown = false;
      this.raw(s, a);
      this.drawnSig = '';
    };
    grid.appendChild(this.big(moveName('bonk'), '', () => pick({ k: 'strike' })));
    for (const id of me.moves)
      if (id !== 'bonk' && canChoose(s, me, { k: 'move', move: id }))
        grid.appendChild(this.big(moveName(id), '', () => pick({ k: 'move', move: id })));
    sheet.appendChild(grid);
    sheet.appendChild(this.big(T.breath, '', () => pick({ k: 'guard' }), 'bs-wide'));
  }

  private setView(v: View): void {
    const s = this.bout();
    const was = this.view;
    this.view = v;
    this.drawnSig = '';
    // Time stops in a Command bout while the Item sheet is open (FIGHT-40).
    if (s?.atb && !s.result) {
      const items = (x: View): boolean => x === 'item' || x === 'target';
      if (items(v) !== items(was)) this.raw(s, { k: 'pause', why: 'items', on: items(v) });
    }
    if (v === 'main') this.pendingMove = null;
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

  // ---------- doubles: "Who?" (recs FIGHT-60) ----------

  private whoButtons(s: BattleState, me: Combatant, id: string): void {
    const g = this.game();
    const w = whoChoices(s, me.id, id);
    const box = this.sheet;
    box.appendChild(el('p', 'bs-prompt', w.pick === 'ally' ? WHO_TEXT.ally : WHO_TEXT.foe));
    if (w.spread) box.appendChild(el('p', 'bs-hint', WHO_TEXT.both));
    const grid = el('div', 'bs-grid');
    const all = [...s.sides[0], ...s.sides[1]];
    for (const cid of w.ids) {
      const c = all.find((x) => x.id === cid);
      if (!c) continue;
      const t = TYPE_WORDS[c.type];
      const b = this.big(
        combatantName(c),
        `${t.icon} ${t.name} · ❤ ${BATTLE_TEXT.hp} ${c.hp}/${c.maxHp}`,
        () => this.aim(s, id, c.id),
        'bs-who',
      );
      if (g) {
        const n = c.nubbinId ? g.world.nubbins.find((x) => x.id === c.nubbinId) : undefined;
        b.prepend(nubbinPortrait(g, n ?? c.species));
      }
      b.disabled = !canChoose(s, me, this.act(id, c.id));
      grid.appendChild(b);
    }
    box.appendChild(grid);
    box.appendChild(this.big(BATTLE_TEXT.cancel, '', () => this.setView('main'), 'bs-wide'));
  }

  // ---------- the timing ring (recs FIGHT-87) ----------

  /** Where the dot is, 0..1, sweeping back and forth like the gym's bar. */
  private ringPos(now: number): number {
    const t = ((now - this.ringAt) % (GYM.sweepMs * 2)) / GYM.sweepMs;
    return t <= 1 ? t : 2 - t;
  }

  private ringButton(s: BattleState): void {
    const b = this.big(RING_TEXT.tap, '', () => this.ringTap(s), 'bs-wide bs-ring');
    b.setAttribute('aria-label', `${RING_TEXT.label}: ${RING_TEXT.tap}`);
    const zone = el('i', 'bs-ring-zone');
    zone.style.left = `${(0.5 - GYM.zone / 2) * 100}%`;
    zone.style.width = `${GYM.zone * 100}%`;
    b.append(zone, el('i', 'bs-ring-dot'));
    this.sheet.appendChild(b);
  }

  private ringTap(s: BattleState): void {
    const p = this.pendingMove;
    if (!p) return;
    const pos = this.ringPos(performance.now());
    const sweet = Math.abs(pos - 0.5) <= GYM.zone / 2;
    this.send(s, this.act(p.id, p.target, sweet ? 'sweet' : 'plain'));
  }

  private drawRing(s: BattleState, now: number): void {
    const p = this.pendingMove;
    if (!p) return;
    // No tap in time is a plain hit, never a penalty.
    if (now - this.ringAt > BATTLE_R5.ringTimeoutMs) {
      this.send(s, this.act(p.id, p.target, 'plain'));
      return;
    }
    const dot = this.sheet.querySelector<HTMLElement>('.bs-ring-dot');
    if (dot) dot.style.left = `${(this.ringPos(now) * 100).toFixed(1)}%`;
  }

  // ---------- the Command bout (recs FIGHT-40, FIGHT-41) ----------

  private atbSheet(s: BattleState): void {
    const box = this.sheet;
    const me = s.sides[0].find((c) => onField(s, c)) ?? s.sides[0][0];
    const foe = s.sides[1].find((c) => onField(s, c));
    if (this.view === 'item' || this.view === 'target') {
      if (me) this.itemButtons(s, me, foe, box);
      return;
    }
    this.gauges.clear();
    this.orderBtns.clear();
    const list = el('div', 'bs-gauges');
    for (const c of [...s.sides[0], ...s.sides[1]]) {
      if (!onField(s, c)) continue;
      const row = el('div', `bs-gauge ${c.side === 0 ? 'ally' : 'foe'}`);
      const name = combatantName(c);
      const bar = el('div', 'bs-gauge-bar');
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-label', name);
      const fill = el('span');
      bar.appendChild(fill);
      const num = el('small', 'bs-gauge-num');
      row.append(el('span', 'bs-gauge-name', name), bar, num);
      list.appendChild(row);
      this.gauges.set(c.id, { fill, num, name });
    }
    box.appendChild(list);
    const grid = el('div', 'bs-grid bs-orders');
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', ATB_TEXT.ordersLabel);
    for (const cmd of ATB_COMMANDS) {
      const o = ATB_TEXT.orders[cmd];
      const b = this.big(`${o.icon} ${o.name}`, '', () => this.order(cmd), 'bs-order');
      b.appendChild(el('i', 'bs-cd'));
      grid.appendChild(b);
      this.orderBtns.set(cmd, b);
    }
    box.appendChild(grid);
    const row = el('div', 'bs-row');
    const item = button(T.item, () => this.setView('item'), 'btn bs-act');
    item.disabled = !BATTLE_ITEMS.some((i) => itemsLeft(s, 0, i) > 0);
    row.appendChild(item);
    box.appendChild(row);
    this.updateAtb(s);
  }

  private order(cmd: AtbCommand): void {
    const s = this.bout();
    if (!s?.atb || s.result || cooldownLeft(s, cmd) > 0) return;
    this.raw(s, { k: 'order', cmd });
  }

  /** Gauges and cooldown rings follow the sim every frame. */
  private updateAtb(s: BattleState): void {
    const t = s.atb;
    if (!t) return;
    for (const [id, g] of this.gauges) {
      const v = Math.max(0, Math.min(100, t.gauge[id] ?? 0));
      g.fill.style.width = `${v}%`;
      g.fill.parentElement?.setAttribute('aria-valuenow', String(Math.round(v)));
      g.num.textContent = `${Math.round(v)}%`;
    }
    const benchEmpty = bench(s, 0).length === 0;
    for (const [cmd, b] of this.orderBtns) {
      const left = cooldownLeft(s, cmd);
      const share = Math.min(1, left / BATTLE_ATB.cooldownMs);
      b.style.setProperty('--cd', share.toFixed(3));
      const off = left > 0 || !!s.result || (cmd === 'back' && benchEmpty);
      if (b.disabled !== off) b.disabled = off;
      const small = left > 0 ? ATB_TEXT.wait(left / 1000) : ATB_TEXT.ready;
      const sub = b.querySelector('small') ?? b.appendChild(el('small'));
      if (sub.textContent !== small) sub.textContent = small;
    }
  }

  /** The tab hides: stop a Command bout's clock; it starts again a moment after it shows. */
  private onVisibility(): void {
    const s = this.bout();
    if (this.root.hidden || !s?.atb || s.result) return;
    if (document.hidden) {
      this.raw(s, { k: 'pause', why: 'hidden', on: true });
      return;
    }
    // Two frames late, so the first long frame back is spent paused, not fighting.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const b = this.bout();
        if (b?.atb && !b.result && !document.hidden)
          this.raw(b, { k: 'pause', why: 'hidden', on: false });
      }),
    );
  }

  // ---------- "Inspect foe" (recs FIGHT-77) ----------

  private inspect(): void {
    const s = this.bout();
    if (!s || s.result || this.root.hidden) return;
    const foe = this.shown(s, 1);
    if (foe) openInspect(this.root.parentElement ?? document.body, s, foe);
  }

  // ---------- results ----------

  private showResults(s: BattleState): void {
    closeInspect();
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
    // The sim's own account of the bout (FIGHT-74) when it has one, else the prize table.
    const sp = s.spoils;
    const shells = sp ? sp.shells : prizeFor(s.context, r, !!s.gentle);
    if (shells > 0) card.appendChild(el('p', undefined, BATTLE_TEXT.prize(shells, NAMES.currency)));
    if (sp) this.spoilLines(s, sp.gained, card);
    if (sp?.hat)
      card.appendChild(el('p', undefined, SPOILS_TEXT.hat(HAT_LABELS[sp.hat] ?? sp.hat)));
    if (sp?.cards.length) card.appendChild(el('p', undefined, SPOILS_TEXT.cards(sp.cards.length)));
    for (const f of s.sides[1]) {
      if (f.friend) card.appendChild(el('p', undefined, T.newFriend(combatantName(f))));
      else if (f.calm !== undefined)
        card.appendChild(el('p', undefined, T.calmed(combatantName(f), f.calm)));
    }
    // FIGHT-100: the funniest moment as a postcard, and the bout's replay code.
    if (s.mode === 'turn') card.appendChild(postcardRow(s, currentReplay()));
    card.appendChild(button(T.backToGrove, () => this.close(), 'btn btn-primary bs-big'));
    box.appendChild(card);
    box.hidden = false;
    playSound(r.winner === 0 ? 'win' : 'sad');
    if (this.root.contains(document.activeElement) || document.activeElement === document.body)
      card.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  }

  /** "Nono: +12 Power, +4 Stamina" for each Nubbin that gained points. */
  private spoilLines(
    s: BattleState,
    gained: Record<string, Partial<Record<StatKey, number>>>,
    card: HTMLElement,
  ): void {
    const g = this.game();
    for (const [id, stats] of Object.entries(gained)) {
      const list = (Object.keys(stats) as StatKey[])
        .filter((k) => (stats[k] ?? 0) > 0)
        .map((k) => SPOILS_TEXT.stat(STAT_SHORT[k], stats[k]!));
      if (!list.length) continue;
      const ally = s.sides[0].find((c) => c.nubbinId === id);
      const name = ally
        ? combatantName(ally)
        : (g?.world.nubbins.find((n) => n.id === id)?.name ?? id);
      card.appendChild(el('p', 'bs-spoils', SPOILS_TEXT.points(name, list.join(', '))));
    }
  }
}
