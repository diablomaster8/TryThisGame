import { playArea } from '../play-area';
import { RACE, SIM } from '../../config/tuning';
import { RACE_PERSONA } from '../../config/tuning-soul-r11h';
import { countLabel, inCountdown } from '../../sim/race-persona';
import { UI_TEXT } from '../../config/strings';
import type { SpriteSheet } from '../../render/sprites/atlas';
import type { SheetCache } from '../../render/sprites/sheets';
import type { Grove3dScene } from '../../render3d/grove-3d-scene';
import { selectMinigameView } from '../../render3d/minigame-layout';
import { playSound } from '../../platform/audio';
import {
  cheer,
  cheerReady,
  playerPlacement,
  prizeFor,
  stepRace,
  type RaceState,
} from '../../sim/race';
import type { GraphicsMode, Nubbin } from '../../sim/types';
import { button, dialogFocus, el } from '../../ui/dom';
import { RaceWatch, standingsList } from '../../ui/race-results';
import '../../fun.css';
import { UI_FX_TEXT } from '../../config/strings-ui';
import { RacePixelView } from './pixel-view';
import type { RaceView } from './view';
import { showUpdateNotice } from '../../ui/update-notice';
import { FUN_RUN_TEXT } from '../../config/strings-kid-games';
import { FUN_RUN } from '../../config/tuning-kids';

export interface RaceOutcome {
  placement: number;
  shells: number;
  hat: string | null;
}

/**
 * The race screen: owns the flow (the cheer button, a big DOM button so it stays a 44 px
 * target on phones; keys; the HUD; the results and the outcome hand-off) and steps the
 * sim's race. It draws through one of two views: the pixel canvas, or in Full 3D the 3D
 * course, which renders into the game's own canvas under this overlay (its chunk loads
 * on first use).
 */
export class RaceScreen {
  private readonly root: HTMLDivElement;
  private readonly hud: HTMLDivElement;
  private readonly cheerBtn: HTMLButtonElement;
  private readonly quitBtn: HTMLButtonElement;
  private readonly results: HTMLDivElement;
  private readonly resultsBody: HTMLDivElement;
  private readonly pixel = new RacePixelView();
  private view3d: RaceView | null = null;
  private view: RaceView = this.pixel;
  private race: RaceState | null = null;
  private rafId = 0;
  private lastMs = 0;
  private accMs = 0;
  private onDone: ((outcome: RaceOutcome) => void) | null = null;
  private outcome: RaceOutcome | null = null;
  private hatRoll = 0;
  /** The tier-3 look prizes for this race (the Keeper picks the hero look). */
  private looks: readonly string[] = LOOK_PRIZES;
  /** Counts starts, so a 3D view that lands after the player left is not shown. */
  private starts = 0;
  /** True while the 3D chunk and stage are on their way; the race waits at the line. */
  private loading3d = false;
  private readonly abort = new AbortController();
  /** Watches the race for the results card's standings and tip. */
  private watch: RaceWatch | null = null;
  private readonly resultsFocus: ReturnType<typeof dialogFocus>;

  /** R0314: lines for the bottom of the results card (Byte's stopwatches), set before `start`. */
  footer: string[] = [];
  /** R0318: a tip under "Setting the stage…", set before `start`. */
  tip = '';
  /** R0688: a Fun Run speaks the count, the cheer and the end tip through this (read-aloud on). */
  friendlySpeak: (text: string) => void = () => undefined;
  /** R0688: the Fun Run's end tip ("Swimming more will make Nono faster in water"). */
  friendlyTip = '';
  /** R0688: when the spoken count began (0: not yet), and how many steps were shown. */
  private countStart = 0;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'expedition race');
    this.root.hidden = true;
    this.hud = el('div', 'expedition-hud');
    this.cheerBtn = button(UI_TEXT.cheer, () => this.cheer(), 'btn btn-primary cheer');
    this.results = el('div', 'modal');
    this.results.hidden = true;
    const card = el('div', 'modal-card');
    const heading = el('h2', undefined, UI_TEXT.raceResults);
    card.appendChild(heading);
    this.resultsBody = el('div');
    card.append(
      this.resultsBody,
      button(UI_TEXT.backToGrove, () => this.finish(), 'btn btn-primary'),
    );
    this.results.appendChild(card);
    this.resultsFocus = dialogFocus(this.results, card, heading);
    this.quitBtn = button('✕', () => this.finish(), 'btn btn-icon quit');
    this.quitBtn.setAttribute('aria-label', UI_TEXT.quitMinigame);
    this.quitBtn.title = UI_TEXT.quitMinigame;
    // The results card joins the DOM only when shown: no hidden duplicate "Back to the Grove".
    this.root.append(this.pixel.element, this.hud, this.cheerBtn, this.quitBtn);
    parent.appendChild(this.root);

    const { signal } = this.abort;
    window.addEventListener(
      'keydown',
      (e) => {
        if (this.root.hidden || e.repeat) return;
        if (e.key === 'Escape') this.finish();
        if (e.key === ' ') {
          e.preventDefault();
          this.cheer();
        }
      },
      { signal },
    );
    window.addEventListener('resize', () => !this.root.hidden && this.resize(), { signal });
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /**
   * Run a race. In Full 3D (`graphics` with a loaded `scene3d`) the 3D view draws it;
   * otherwise the pixel canvas does, as it always has.
   */
  start(
    race: RaceState,
    player: Nubbin,
    playerSheet: SpriteSheet,
    cache: SheetCache,
    hatRoll: number,
    onDone: (outcome: RaceOutcome) => void,
    graphics: GraphicsMode = 'pixel',
    scene3d: Grove3dScene | null = null,
    looks: readonly string[] = LOOK_PRIZES,
  ): void {
    this.looks = looks;
    const starts = ++this.starts;
    this.race = race;
    this.countStart = 0;
    // R0688: a Fun Run's cheer is a 96 px 📣; the other races keep the plain button.
    const kid = !!race.friendly;
    this.cheerBtn.classList.toggle('cheer-big', kid);
    this.cheerBtn.textContent = kid ? FUN_RUN_TEXT.cheer : UI_TEXT.cheer;
    this.cheerBtn.setAttribute('aria-label', kid ? FUN_RUN_TEXT.cheerAria : UI_TEXT.cheer);
    if (kid) this.cheerBtn.style.setProperty('--cheer-px', `${FUN_RUN.cheerPx}px`);
    this.onDone = onDone;
    // R0583: hold the field at the line while the start poses play (once per race).
    if (race.countdownTotalMs === undefined) {
      race.countdownMs = race.countdownTotalMs = RACE_PERSONA.countdownMs;
    }
    this.watch = new RaceWatch(race);
    this.outcome = null;
    this.hatRoll = hatRoll;
    this.results.hidden = true;
    this.results.remove();
    this.root.hidden = false;
    this.lastMs = 0;
    this.accMs = 0;
    const startPixel = (): void => {
      this.root.classList.remove('three');
      this.pixel.element.hidden = false;
      this.loading3d = false;
      this.view = this.pixel;
      this.view.start(race, player, playerSheet, cache);
      this.resize();
    };
    const mode = selectMinigameView(graphics, !!scene3d && scene3d.loadState().done);
    if (mode === '3d' && scene3d) {
      this.root.classList.add('three');
      this.pixel.element.hidden = true;
      const ready = this.view3d
        ? Promise.resolve(this.view3d)
        : import('../../render3d/race-3d').then((m) => {
            this.view3d ??= new m.Race3dView(scene3d);
            this.root.appendChild(this.view3d.element);
            return this.view3d;
          });
      this.view = this.pixel;
      this.loading3d = true;
      void ready.then(
        (view) => {
          if (starts !== this.starts || !this.race) return;
          this.loading3d = false;
          this.view = view;
          view.start(race, player, playerSheet, cache);
          this.resize();
        },
        (err: unknown) => {
          // The chunk is gone (usually a new deploy): say so, and run in pixel art.
          showUpdateNotice(err);
          if (starts === this.starts && this.race) startPixel();
        },
      );
    } else startPixel();
    this.rafId = requestAnimationFrame(this.frame);
  }

  private cheer(): void {
    if (!this.race || this.loading3d || !this.view.ready) return;
    if (inCountdown(this.race)) return;
    if (cheer(this.race)) {
      playSound('cheer');
      if (this.race.friendly) this.friendlySpeak(FUN_RUN_TEXT.cheerSay);
      this.view.cheered(this.race, performance.now());
    }
  }

  private finish(): void {
    const outcome = this.outcome ?? {
      placement: this.race?.friendly ? 0 : (this.race?.racers.length ?? 1),
      shells: 0,
      hat: null,
    };
    cancelAnimationFrame(this.rafId);
    if (!this.results.hidden) this.resultsFocus.closed();
    this.starts++;
    this.loading3d = false;
    this.root.hidden = true;
    this.race = null;
    this.view.stop();
    this.view = this.pixel;
    this.onDone?.(outcome);
    this.onDone = null;
  }

  resize(): void {
    const pixel = this.view === this.pixel;
    let rect = playArea(this.root, pixel);
    this.root.style.paddingBottom = '';
    // The pixel lanes end above the Cheer button: in landscape it sat on the bottom lanes
    // (review 2026-10-21, bug 22).
    const cheer = this.cheerBtn.getBoundingClientRect();
    if (pixel && cheer.height > 0) {
      const below = Math.max(0, Math.ceil(rect.bottom - cheer.top) + 6);
      this.root.style.paddingBottom = `${below}px`;
      rect = new DOMRect(rect.x, rect.y, rect.width, Math.max(1, rect.height - below));
    }
    this.view.resize(rect);
  }

  private readonly frame = (nowMs: number): void => {
    const race = this.race;
    if (!race) return;
    // A 3D stage still building: the field waits at the line.
    const live = !this.loading3d && this.view.ready;
    // R0688: a Fun Run waits at the line for "3, 2, 1, go!" (said, and tapped along).
    const counting = live && race.friendly ? this.counting(nowMs) : false;
    const dt =
      this.lastMs === 0 || !live || counting
        ? 0
        : Math.min(RACE.maxFrameDeltaMs, nowMs - this.lastMs);
    this.lastMs = nowMs;
    this.accMs += dt;
    while (this.accMs >= SIM.stepMs) {
      stepRace(race, SIM.stepMs);
      this.watch?.observe(SIM.stepMs);
      this.accMs -= SIM.stepMs;
    }
    // The view draws even before it is ready: a 3D stage builds its rigs across frames.
    if (!this.loading3d) this.view.draw(race, nowMs);
    this.updateHud(race, live);
    if (race.finished && this.results.hidden) this.showResults(race);
    if (!race.finished || this.results.hidden) this.rafId = requestAnimationFrame(this.frame);
  };

  /** R0688: true while the start count runs; the first live frame starts it and says it. */
  private counting(nowMs: number): boolean {
    if (this.countStart === 0) {
      this.countStart = nowMs;
      this.friendlySpeak(FUN_RUN_TEXT.countSay);
    }
    return nowMs - this.countStart < FUN_RUN.countSteps * FUN_RUN.countGapMs;
  }

  /** R0688: which step of the count shows (0 is "3"), or -1 once the race is on. */
  private countStep(nowMs: number): number {
    if (this.countStart === 0) return 0;
    const i = Math.floor((nowMs - this.countStart) / FUN_RUN.countGapMs);
    return i < FUN_RUN.countSteps ? i : -1;
  }

  private livePlacement(race: RaceState): number {
    const sorted = [...race.racers].sort((a, b) => {
      const fa = a.finishedAtMs ?? Infinity;
      const fb = b.finishedAtMs ?? Infinity;
      if (fa !== fb) return fa - fb;
      return b.pos - a.pos;
    });
    return sorted.findIndex((r) => r.isPlayer) + 1;
  }

  private updateHud(race: RaceState, live: boolean): void {
    const place = this.livePlacement(race);
    if (race.friendly && live) {
      // R0688: no placings, only the count and a flag.
      const step = this.countStep(performance.now());
      this.hud.textContent = step >= 0 ? (FUN_RUN_TEXT.count[step] ?? '') : '🏁';
      this.cheerBtn.disabled = step >= 0 || !cheerReady(race) || race.finished;
      return;
    }
    this.hud.textContent = live
      ? (countLabel(race) ?? `${UI_TEXT.place(place)}  ·  ${Math.floor(race.timeMs / 1000)}s`)
      : this.tip
        ? `${UI_TEXT.stageLoading} ${this.tip}`
        : UI_TEXT.stageLoading;
    this.cheerBtn.disabled = !live || inCountdown(race) || !cheerReady(race) || race.finished;
  }

  private showResults(race: RaceState): void {
    if (race.friendly) return this.showFriendlyResults();
    const placement = playerPlacement(race);
    const shells = prizeFor(placement, race.tier);
    let hat: string | null = null;
    if (placement === 1 && this.hatRoll < RACE.hatChanceOnWin) {
      const lookIndex = Math.floor((this.hatRoll / RACE.hatChanceOnWin) * this.looks.length);
      hat = race.tier === 3 ? (this.looks[lookIndex] ?? null) : (HAT_PRIZES[race.tier - 1] ?? null);
    }
    this.outcome = { placement, shells, hat };
    this.resultsBody.innerHTML = '';
    this.resultsBody.appendChild(el('p', 'celebrate-form', UI_TEXT.place(placement)));
    // The prize, then every racer's place and time with the player marked, then one tip.
    this.resultsBody.appendChild(el('p', 'race-prize', UI_FX_TEXT.prize(shells)));
    if (hat) this.resultsBody.appendChild(el('p', undefined, UI_TEXT.wonHat));
    if (placement === 1 && race.tier < 3)
      this.resultsBody.appendChild(el('p', undefined, UI_TEXT.tierUnlocked));
    this.resultsBody.appendChild(standingsList(race));
    const tip = this.watch?.tip();
    if (tip) this.resultsBody.appendChild(el('p', 'race-tip', tip));
    const flutter = this.watch?.butterfly();
    if (flutter) this.resultsBody.appendChild(el('p', 'race-tip', flutter));
    for (const line of this.footer) this.resultsBody.appendChild(el('p', 'race-footer', line));
    playSound(placement <= 3 ? 'win' : 'sad');
    this.root.appendChild(this.results);
    this.results.hidden = false;
    this.resultsFocus.opened();
  }

  /** R0688: a ribbon for everyone, and one spoken tip. No rank, no prize, no standings. */
  private showFriendlyResults(): void {
    this.outcome = { placement: 0, shells: 0, hat: null };
    this.resultsBody.innerHTML = '';
    this.resultsBody.appendChild(el('p', 'celebrate-form', `🎀 ${FUN_RUN_TEXT.ribbon}`));
    this.resultsBody.appendChild(el('p', 'race-tip', this.friendlyTip));
    playSound('win');
    this.friendlySpeak(`${FUN_RUN_TEXT.ribbon} ${this.friendlyTip}`);
    this.root.appendChild(this.results);
    this.results.hidden = false;
    this.resultsFocus.opened();
  }

  dispose(): void {
    this.abort.abort();
    cancelAnimationFrame(this.rafId);
    this.pixel.dispose();
    this.view3d?.dispose();
  }
}

/** Hat prizes by tier (index 0 = tier 1); tier 3 pays a character look. */
export const HAT_PRIZES = ['straw', 'beanie', 'look-fox'] as const;
export const LOOK_PRIZES = [
  'look-fox',
  'look-echidna',
  'look-rose',
  'look-dream',
  'look-quills',
  'look-shade',
] as const;
