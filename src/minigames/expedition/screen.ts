import { playArea } from '../play-area';
import { EXPEDITION_FUN_TEXT } from '../../config/strings-fun-r6';
import { playChime, playSound } from '../../platform/audio';
import { ExpeditionSfx } from './sfx';
import { EXPEDITION, SIM, UI } from '../../config/tuning';
import { CRITTER_LABELS, ESSENCE_LABELS, UI_TEXT } from '../../config/strings';
import type { SpriteSheet } from '../../render/sprites/atlas';
import type { Grove3dScene } from '../../render3d/grove-3d-scene';
import { selectMinigameView } from '../../render3d/minigame-layout';
import type { GraphicsMode, Nubbin, NubbinType, Rewards } from '../../sim/types';
import { button, el } from '../../ui/dom';
import { ExpeditionPixelView } from './pixel-view';
import { createRun, jumpPressed, jumpReleased, stepRun, superlative, type RunState } from './run';
import type { ExpeditionTheme, ExpeditionView } from './view';
import { showUpdateNotice } from '../../ui/update-notice';

/** R0324: how long a bumped obstacle's line stays up (ms of run time). */
const EXPEDITION_QUIP_MS = 1400;

/**
 * The Expedition screen: a full-screen overlay that owns the flow (taps and keys, the
 * HUD, the results, the reward hand-off) and steps the pure run (run.ts). It draws
 * through one of two views: the pixel canvas, or in Full 3D the 3D track, which renders
 * into the game's own canvas under this overlay (its chunk loads on first use).
 */
export class ExpeditionScreen {
  private readonly root: HTMLDivElement;
  private readonly hud: HTMLDivElement;
  private readonly quitBtn: HTMLButtonElement;
  private readonly results: HTMLDivElement;
  private readonly resultsBody: HTMLDivElement;
  private readonly tip: HTMLDivElement;
  /** R0324: what a bumped obstacle says, and the run time of the hit it is for. */
  private readonly quip: HTMLDivElement;
  private quipAt = -1;
  private tipTimer = 0;
  private readonly pixel = new ExpeditionPixelView();
  private view3d: ExpeditionView | null = null;
  private view: ExpeditionView = this.pixel;
  private run: RunState | null = null;
  private sfx = new ExpeditionSfx();
  private rafId = 0;
  private lastMs = 0;
  private accMs = 0;
  private onDone: ((rewards: Rewards) => void) | null = null;
  /** Counts starts, so a 3D view that lands after the player left is not shown. */
  private starts = 0;
  /** True while the 3D chunk and stage are on their way; the run waits. */
  private loading3d = false;
  private readonly abort = new AbortController();

  /** R0318: a loading tip under "Setting the stage…", set before `start`. */
  loadTip = '';

  constructor(parent: HTMLElement) {
    this.root = el('div', 'expedition');
    this.root.hidden = true;
    this.hud = el('div', 'expedition-hud');
    this.results = el('div', 'modal');
    this.results.hidden = true;
    const card = el('div', 'modal-card');
    card.appendChild(el('h2', undefined, UI_TEXT.expeditionResults));
    this.resultsBody = el('div');
    card.append(
      this.resultsBody,
      button(UI_TEXT.backToGrove, () => this.finish(), 'btn btn-primary'),
    );
    this.results.appendChild(card);
    this.quitBtn = button('✕', () => this.finish(), 'btn btn-icon quit');
    this.quitBtn.setAttribute('aria-label', UI_TEXT.quitMinigame);
    this.quitBtn.title = UI_TEXT.quitMinigame;
    // Tap to jump, hold to jump higher: said at the start of every run (bug 23).
    this.tip = el('div', 'expedition-tip');
    this.tip.setAttribute('role', 'status');
    this.tip.hidden = true;
    // The results card joins the DOM only when it shows, so no hidden "Back to the Grove"
    // waits in the page for a screen reader to find (bug 35).
    this.quip = el('div', 'expedition-quip');
    this.quip.hidden = true;
    this.quip.setAttribute('aria-live', 'polite');
    this.root.append(this.pixel.element, this.hud, this.quitBtn, this.tip, this.quip);
    parent.appendChild(this.root);

    const { signal } = this.abort;
    const press = (e: Event) => {
      if (!this.run || this.run.finished || !this.view.ready) return;
      e.preventDefault();
      this.hideTip();
      jumpPressed(this.run);
    };
    const release = () => this.run && jumpReleased(this.run);
    // Taps land on the pixel canvas as before; the 3D view draws under the overlay, so
    // there a tap anywhere on it (not on a button) jumps.
    this.root.addEventListener(
      'pointerdown',
      (e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('button')) return;
        if (this.view === this.pixel && target !== this.pixel.element) return;
        press(e);
      },
      { signal },
    );
    this.root.addEventListener('pointerup', release, { signal });
    this.root.addEventListener('pointercancel', release, { signal });
    window.addEventListener(
      'keydown',
      (e) => {
        if (this.root.hidden || e.repeat) return;
        if (e.key === 'Escape') this.finish();
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') press(e);
      },
      { signal },
    );
    window.addEventListener(
      'keyup',
      (e) => {
        if (this.root.hidden) return;
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') release();
      },
      { signal },
    );
    window.addEventListener('resize', () => !this.root.hidden && this.resize(), { signal });
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /**
   * Start a run with the given Nubbin as the runner. In Full 3D (`graphics` with a loaded
   * `scene3d`) the 3D view draws it; otherwise the pixel canvas does, as it always has.
   */
  start(
    runner: Nubbin,
    sheet: SpriteSheet,
    seed: number,
    onDone: (rewards: Rewards) => void,
    theme: ExpeditionTheme = 'meadow',
    graphics: GraphicsMode = 'pixel',
    scene3d: Grove3dScene | null = null,
  ): void {
    const starts = ++this.starts;
    this.run = createRun(seed);
    this.sfx = new ExpeditionSfx();
    this.quipAt = -1;
    this.quip.hidden = true;
    this.onDone = onDone;
    this.results.hidden = true;
    this.results.remove();
    this.root.hidden = false;
    this.tip.textContent = window.matchMedia?.('(pointer: coarse)').matches
      ? UI_TEXT.expeditionTip
      : UI_TEXT.expeditionTipKeys;
    this.tip.hidden = false;
    clearTimeout(this.tipTimer);
    this.tipTimer = window.setTimeout(() => this.hideTip(), UI.tipMs);
    this.lastMs = 0;
    this.accMs = 0;
    const startPixel = (): void => {
      this.root.classList.remove('three');
      this.pixel.element.hidden = false;
      this.loading3d = false;
      this.view = this.pixel;
      this.view.start(runner, sheet, theme);
      this.resize();
    };
    const mode = selectMinigameView(graphics, !!scene3d && scene3d.loadState().done);
    if (mode === '3d' && scene3d) {
      this.root.classList.add('three');
      this.pixel.element.hidden = true;
      // The 3D view is a separate chunk, loaded the first time Full 3D goes on a run.
      const ready = this.view3d
        ? Promise.resolve(this.view3d)
        : import('../../render3d/expedition-3d').then((m) => {
            this.view3d ??= new m.Expedition3dView(scene3d);
            this.root.appendChild(this.view3d.element);
            return this.view3d;
          });
      // Until it lands the loop idles (nothing steps) and the HUD says the stage is coming.
      this.view = this.pixel;
      this.loading3d = true;
      void ready.then(
        (view) => {
          if (starts !== this.starts || !this.run) return;
          this.loading3d = false;
          this.view = view;
          view.start(runner, sheet, theme);
          this.resize();
        },
        (err: unknown) => {
          // The chunk is gone (usually a new deploy): say so, and run in pixel art.
          showUpdateNotice(err);
          if (starts === this.starts && this.run) startPixel();
        },
      );
    } else startPixel();
    this.rafId = requestAnimationFrame(this.frame);
  }

  private hideTip(): void {
    clearTimeout(this.tipTimer);
    this.tip.hidden = true;
  }

  private finish(): void {
    this.hideTip();
    this.results.remove();
    const rewards = this.run?.rewards ?? { shells: 0, essences: {}, critters: {} };
    cancelAnimationFrame(this.rafId);
    this.starts++;
    this.loading3d = false;
    this.root.hidden = true;
    this.run = null;
    this.view.stop();
    this.view = this.pixel;
    this.onDone?.(rewards);
    this.onDone = null;
  }

  resize(): void {
    this.view.resize(playArea(this.root, this.view === this.pixel));
  }

  private readonly frame = (nowMs: number): void => {
    const run = this.run;
    if (!run) return;
    // A 3D stage still building, or a hidden tab: hold the run where it is.
    const live = !this.loading3d && this.view.ready;
    const dt = this.lastMs === 0 || !live ? 0 : Math.min(100, nowMs - this.lastMs);
    this.lastMs = nowMs;
    this.accMs += dt;
    const step = SIM.stepMs / 4; // 25 ms physics steps for a crisp jump
    while (this.accMs >= step) {
      stepRun(run, step);
      this.accMs -= step;
    }
    // The view draws even before it is ready: a 3D stage builds its rig across frames.
    if (!this.loading3d) this.view.draw(run, nowMs);
    this.updateHud(run, live);
    this.quipFor(run);
    // R0450 (TECH-08): the run's sound effects.
    for (const c of this.sfx.observe(run)) {
      if ('sound' in c) playSound(c.sound);
      else playChime(c.chime);
    }
    if (run.finished && this.results.hidden) this.showResults(run.rewards, superlative(run));
    if (!run.finished || this.results.hidden) this.rafId = requestAnimationFrame(this.frame);
  };

  private updateHud(run: RunState, live: boolean): void {
    this.hud.textContent = live
      ? `🐚 ${run.shells}  ·  ${Math.max(0, Math.ceil((EXPEDITION.durationMs - run.timeMs) / 1000))}s`
      : this.loadTip
        ? `${UI_TEXT.stageLoading} ${this.loadTip}`
        : UI_TEXT.stageLoading;
  }

  /** R0324: a bumped obstacle says something (or doesn't, for a rock), once per hit. */
  private quipFor(run: RunState): void {
    const e = run.lastEvent;
    if (!e || e.kind !== 'hit' || e.atMs === this.quipAt) {
      if (this.quipAt >= 0 && run.timeMs - this.quipAt > EXPEDITION_QUIP_MS)
        this.quip.hidden = true;
      return;
    }
    this.quipAt = e.atMs;
    const lines = EXPEDITION_FUN_TEXT.quips[e.thing ?? 'rock'] ?? [];
    if (lines.length === 0) return;
    this.quip.textContent = lines[run.hits % lines.length]!;
    this.quip.hidden = false;
  }

  private showResults(rewards: Rewards, best: string): void {
    this.resultsBody.innerHTML = '';
    const lines: string[] = [UI_TEXT.resultShells(rewards.shells)];
    for (const [type, n] of Object.entries(rewards.essences)) {
      if (n) lines.push(`${ESSENCE_LABELS[type as NubbinType]} ×${n}`);
    }
    for (const [species, n] of Object.entries(rewards.critters)) {
      if (n) lines.push(`${CRITTER_LABELS[species] ?? species} ×${n}`);
    }
    if (lines.length === 1 && rewards.shells === 0) lines.push(EXPEDITION_FUN_TEXT.nothing);
    // R0324 (FUN-35): every card gets one superlative from the run.
    lines.push(best);
    for (const line of lines) this.resultsBody.appendChild(el('p', undefined, line));
    this.root.appendChild(this.results);
    this.results.hidden = false;
  }

  dispose(): void {
    this.abort.abort();
    cancelAnimationFrame(this.rafId);
    this.pixel.dispose();
    this.view3d?.dispose();
  }
}
