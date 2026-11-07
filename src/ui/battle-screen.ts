import '../battle.css';
import { drawRing, renderSheet, setView, showResults, updateAtb } from './battle-sheets';
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
import { postcardRow } from './battle-postcard';
import { worldBoutAct, type WorldBout } from '../sim/battle/world-bout';
import { battleForfeit } from '../sim/battle/core';
import { BattlePixelView } from '../minigames/battle/pixel-view';
import { rivalArt } from '../minigames/battle/cast';
import type { BattleCast, BattleFrame, BattleView } from '../minigames/battle/view';
import { selectMinigameView } from '../render3d/minigame-layout';
import { showUpdateNotice } from './update-notice';
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
export type View = 'main' | 'swap' | 'item' | 'target' | 'who' | 'ring';

let shared: BattleScreen | null = null;

/** The one screen, made on first use. */
export function battleScreen(parent: HTMLElement, game: () => Game | null): BattleScreen {
  shared ??= new BattleScreen(parent, game);
  return shared;
}

export class BattleScreen {
  readonly root: HTMLDivElement;
  /** The stage's views (R0219): the pixel canvas, and in Full 3D the arena of rigs. */
  readonly pixel = new BattlePixelView();
  view3d: BattleView | null = null;
  use3d = false;
  loading3d = false;
  started3d = false;
  startedPixel = false;
  readonly roundLabel: HTMLSpanElement;
  readonly speedBtn: HTMLButtonElement;
  readonly cards: [HTMLDivElement, HTMLDivElement];
  readonly logLine: HTMLParagraphElement;
  readonly sheet: HTMLDivElement;
  readonly confirmBox: HTMLDivElement;
  readonly results: HTMLDivElement;
  readonly playback = new Playback();
  runsAtStart = -1;
  startedAt = 0;
  view: View = 'main';
  pendingItem: BattleItemId | null = null;
  sentSig: string | null = null;
  drawnSig = '';
  /** Pass-and-play: Keeper 2 has lifted the cover over their moves. */
  passShown = false;
  rafId = 0;
  onDone: ((s: BattleState | null) => void) | null = null;
  /** A story-world bout (FIGHT-98, FUN-51): played in its own Grove copy, never sent to the sim. */
  external: WorldBout | null = null;
  /** HP and leads as the playback has shown them so far. */
  shownHp = new Map<string, number>();
  shownLead: [string, string] = ['', ''];
  pop: { id: string; text: string; at: number } | null = null;
  holdTimer = 0;
  lastEvent: BattleEvent | null = null;
  /** Round 5: the pre-bout sheet, the move waiting on "Who?" or the ring, the ring's start. */
  prebout: PreBout | null = null;
  pendingMove: { id: string; target?: string } | null = null;
  ringAt = 0;
  /** A Command bout's live bits, updated every frame without rebuilding the buttons. */
  atbSig = '';
  gauges = new Map<string, { fill: HTMLElement; num: HTMLElement; name: string }>();
  orderBtns = new Map<AtbCommand, HTMLButtonElement>();
  readonly veil: HTMLDivElement;
  readonly trap: { opened(): void; closed(): void };
  recorded = false;

  constructor(
    parent: HTMLElement,
    readonly game: () => Game | null,
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
    this.cards = [el('div', 'bs-card ally'), el('div', 'bs-card foe')];
    stage.append(this.pixel.element, this.cards[1], this.cards[0]);
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
  skipBout(context: BattleContext, onDone?: (s: BattleState | null) => void): void {
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

  /** Plays a story-world bout on this screen; its actions go to the copy, not the sim. */
  startWorld(b: WorldBout, onDone?: (s: BattleState | null) => void): void {
    this.external = b;
    this.begin(b.context, onDone, true);
  }

  /** Reopens the bout a load found still going (FIGHT-64), without starting a new one. */
  resume(onDone?: (s: BattleState | null) => void): void {
    const s = this.game()?.world.battle;
    if (!s || s.result || s.mode !== 'turn') return;
    this.begin(s.context, onDone, true);
  }

  begin(context: BattleContext, onDone?: (s: BattleState | null) => void, resumed = false): void {
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
    if (!this.external || this.external.context !== context) this.external = null;
    if (resumed) this.runsAtStart = (g.world.battleRuns ?? 1) - 1;
    else g.send({ kind: 'battleStart', context });
    g.renderPaused = true;
    this.root.hidden = false;
    this.root.classList.toggle('gentle-sprout', false);
    this.trap.opened();
    this.stopViews();
    this.want3d();
    this.resize();
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.frame);
  }

  /** The bout this screen started, once the sim has made it. */
  bout(): BattleState | null {
    const g = this.game();
    if (this.external) return this.external.battle;
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

  leave(): void {
    const g = this.game();
    const s = this.bout();
    if (s && !s.result && this.external) battleForfeit(s);
    else if (g && s && !s.result) g.send({ kind: 'battleForfeit' });
    this.close(null);
  }

  close(result?: BattleState | null): void {
    cancelAnimationFrame(this.rafId);
    const s = result === undefined ? this.bout() : result;
    this.stopViews();
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
    this.external = null;
    done?.(s?.result ? s : null);
  }

  toggleSpeed(): void {
    const g = this.game();
    this.playback.speed = this.playback.speed === 1 ? 2 : 1;
    g?.send({ kind: 'battlePrefs', prefs: { speed: this.playback.speed } });
    this.drawnSig = '';
  }

  skip(): void {
    const s = this.bout();
    if (s) {
      this.playback.skip(s.log);
      this.sync(s);
    }
  }

  resize(): void {
    const rect = this.stageBox();
    this.pixel.resize(rect);
    if (this.started3d) this.view3d?.resize(rect);
  }

  /** Shown HP and leads catch up with the bout. */
  sync(s: BattleState): void {
    for (const c of [...s.sides[0], ...s.sides[1]]) this.shownHp.set(c.id, c.hp);
    this.shownLead = [this.leadOf(s, 0)?.id ?? '', this.leadOf(s, 1)?.id ?? ''];
  }

  leadOf(s: BattleState, side: 0 | 1): Combatant | undefined {
    const list = s.sides[side];
    return s.lead ? list[s.lead[side]] : (list.find(standing) ?? list[0]);
  }

  shown(s: BattleState, side: 0 | 1): Combatant | undefined {
    return s.sides[side].find((c) => c.id === this.shownLead[side]) ?? this.leadOf(s, side);
  }

  frame = (now: number): void => {
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
      if (!s.atb) renderSheet(this, s, busy);
      this.roundLabel.textContent = BATTLE_TEXT.round(s.turn, s.context.tier);
      this.speedBtn.textContent = T.speed(this.playback.speed);
    }
    if (s.atb && atbSig !== this.atbSig) {
      this.atbSig = atbSig;
      renderSheet(this, s, busy);
    }
    if (s.atb) updateAtb(this, s);
    if (cur) this.logLine.textContent = this.line(s, cur.e) ?? this.logLine.textContent;
    if (s.result && !busy && this.results.hidden) showResults(this, s);
    if (this.view === 'ring') drawRing(this, s, now);
    this.rafId = requestAnimationFrame(this.frame);
  };

  names(s: BattleState): (id: string) => string {
    const map = new Map([...s.sides[0], ...s.sides[1]].map((c) => [c.id, combatantName(c)]));
    return (id) => map.get(id) ?? id;
  }

  line(s: BattleState, e: BattleEvent): string | null {
    const name = this.names(s);
    if (e.k === 'order') return ATB_TEXT.order(name(e.who), e.cmd, e.obeyed);
    if (e.k === 'gag') return ATB_TEXT.gag(name(e.who), e.gag);
    if (e.k === 'swing') return e.sweet ? RING_TEXT.nice : null;
    // The comedy lines first (FIGHT-75), then the plain one.
    const ix = s.log.indexOf(e);
    return (ix >= 0 ? quipFor(s, ix, name) : null) ?? formatEvent(e, name);
  }

  /** An event starts playing: move the shown HP and leads, and give the hit its feel. */
  onEvent(s: BattleState, e: BattleEvent, now: number): void {
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
    } else if (e.k === 'miss') playSound('tap');
    else if (e.k === 'guard') playSound(battleSfx(e)!);
    // FIGHT-76: a Dizzy self-bonk boings, a tuckered-out Nubbin yawns.
    else if (e.k === 'boing' || e.k === 'tuckered') playSound(battleSfx(e)!);
    this.drawnSig = '';
  }

  // ---------- the stage ----------

  /** The frame the views draw: the playing event and what the playback has shown so far. */
  frameFor(s: BattleState, e: BattleEvent | null, k: number): BattleFrame {
    return {
      e,
      k,
      shown: [this.shown(s, 0), this.shown(s, 1)],
      hp: (c) => this.shownHp.get(c.id) ?? c.hp,
      busy: this.playback.busy(s.log),
      pop: this.pop,
    };
  }

  /** Who the combatants are, for the views: the game's Nubbins, sheets and foe looks. */
  readonly cast: BattleCast = {
    nubbin: (c) => {
      const g = this.game();
      return (c.nubbinId && g?.world.nubbins.find((x) => x.id === c.nubbinId)) || null;
    },
    sheet: (c) => {
      const g = this.game();
      if (!g) return null;
      try {
        const n = this.cast.nubbin(c);
        return n ? g.view.sheets.forNubbin(n) : g.view.sheets.species(this.cast.art(c));
      } catch {
        return null;
      }
    },
    art: (c) => {
      const g = this.game();
      const s = this.bout();
      return g && s ? rivalArt(g.world, s.context, c.species) : c.species;
    },
  };

  /**
   * In Full 3D (once the Grove's 3D scene has loaded) the bout gets the 3D arena; its chunk
   * loads on first use. The pixel stage draws until the arena is ready, and stays if the
   * chunk fails to load.
   */
  want3d(): void {
    this.use3d = false;
    const g = this.game();
    const scene3d = g?.scene3d;
    if (!g || !scene3d) return;
    if (selectMinigameView(g.graphics, scene3d.loadState().done) !== '3d') return;
    this.use3d = true;
    if (this.view3d || this.loading3d) return;
    this.loading3d = true;
    void import('../render3d/battle-3d').then(
      (m) => {
        this.loading3d = false;
        this.view3d ??= new m.Battle3dView(scene3d);
      },
      (err: unknown) => {
        this.loading3d = false;
        this.use3d = false;
        showUpdateNotice(err);
      },
    );
  }

  /** Draw the stage with the view in use, starting the 3D one once its chunk is here. */
  draw(s: BattleState, now: number, e: BattleEvent | null, k: number): void {
    const f = this.frameFor(s, e, k);
    if (!this.startedPixel) {
      this.startedPixel = true;
      this.pixel.start(s, this.cast);
    }
    const v3 = this.use3d ? this.view3d : null;
    if (v3 && !this.started3d) {
      this.started3d = true;
      v3.start(s, this.cast);
      v3.resize(this.stageBox());
    }
    if (v3) v3.draw(s, f, now);
    const three = !!v3 && v3.ready;
    if (this.root.classList.contains('three') !== three) {
      this.root.classList.toggle('three', three);
      this.pixel.element.hidden = three;
    }
    if (!three) this.pixel.draw(s, f, now);
  }

  /** The 3D view lets go of the bout's arena and rigs; the pixel stage shows again. */
  stopViews(): void {
    if (this.started3d) this.view3d?.stop();
    this.started3d = false;
    this.startedPixel = false;
    this.root.classList.remove('three');
    this.pixel.element.hidden = false;
    this.pixel.stop();
  }

  stageBox(): DOMRect {
    return this.pixel.element.parentElement!.getBoundingClientRect();
  }

  // ---------- the HP cards ----------

  renderCards(s: BattleState): void {
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

  send(s: BattleState, a: BattleAction): void {
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
  raw(s: BattleState, a: BattleAction): void {
    recordAct(s, a);
    if (this.external) {
      worldBoutAct(this.external, a);
      this.drawnSig = '';
      return;
    }
    this.game()?.send({ kind: 'battleAct', action: a });
  }

  big(label: string, sub: string, press: () => void, cls = ''): HTMLButtonElement {
    const b = button('', press, `btn bs-tile ${cls}`);
    b.append(el('span', 'bs-tile-name', label));
    if (sub) b.append(el('small', undefined, sub));
    return b;
  }

  /** The best move against the foe on the field, by type chart then power (gentle hints). */
  bestMove(s: BattleState, me: Combatant): string {
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

  act(id: string, target?: string, timing?: Timing): BattleAction {
    const t = target === undefined ? {} : { target };
    const tm = timing === undefined ? {} : { timing };
    if (id === 'bonk') return { k: 'strike', ...t, ...tm };
    if (id === 'huddle') return { k: 'rally' };
    return { k: 'move', move: id, ...t, ...tm };
  }

  /** A move tile pressed: "Who?" first in doubles when there is a choice, then the ring. */
  choose(s: BattleState, me: Combatant, id: string, foe: Combatant | undefined): void {
    if (s.doubles) {
      const w = whoChoices(s, me.id, id);
      if (w.pick !== 'none' && w.ids.length > 1) {
        this.pendingMove = { id };
        setView(this, 'who');
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
  aim(s: BattleState, id: string, target?: string): void {
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
    setView(this, 'ring');
  }

  /** The tab hides: stop a Command bout's clock; it starts again a moment after it shows. */
  onVisibility(): void {
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

  inspect(): void {
    const s = this.bout();
    if (!s || s.result || this.root.hidden) return;
    const foe = this.shown(s, 1);
    if (foe) openInspect(this.root.parentElement ?? document.body, s, foe);
  }
}
