import { playArea } from '../play-area';
import { RACE, SIM } from '../../config/tuning';
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
    this.onDone = onDone;
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
    if (cheer(this.race)) {
      playSound('cheer');
      this.view.cheered(this.race, performance.now());
    }
  }

  private finish(): void {
    const outcome = this.outcome ?? {
      placement: this.race?.racers.length ?? 1,
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
    const dt = this.lastMs === 0 || !live ? 0 : Math.min(RACE.maxFrameDeltaMs, nowMs - this.lastMs);
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
    this.hud.textContent = live
      ? `${UI_TEXT.place(place)}  ·  ${Math.floor(race.timeMs / 1000)}s`
      : UI_TEXT.stageLoading;
    this.cheerBtn.disabled = !live || !cheerReady(race) || race.finished;
  }

  private showResults(race: RaceState): void {
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
    for (const line of this.footer) this.resultsBody.appendChild(el('p', 'race-footer', line));
    playSound(placement <= 3 ? 'win' : 'sad');
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
