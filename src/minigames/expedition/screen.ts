import { EXPEDITION, SIM } from '../../config/tuning';
import { PX } from '../../render/sprites/pixel-canvas';
import { CRITTER_LABELS, ESSENCE_LABELS, NAMES, UI_TEXT } from '../../config/strings';
import { CLIPS, frameAt, frameKey } from '../../render/sprites/animations';
import type { SpriteSheet } from '../../render/sprites/atlas';
import { C, color } from '../../render/sprites/palette';
import type { Nubbin, NubbinType, Rewards } from '../../sim/types';
import { button, el } from '../../ui/dom';
import { buildExpeditionArt, type ExpeditionArt } from './art';
import {
  createRun,
  jumpPressed,
  jumpReleased,
  progressOf,
  RUNNER_H,
  stepRun,
  type RunState,
} from './run';

/**
 * The Expedition screen: a full-screen overlay with its own low-res 2D canvas. The run
 * logic is pure (run.ts); this file draws it, takes taps and keys, and hands the
 * rewards back when the run ends.
 */
export class ExpeditionScreen {
  private readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly hud: HTMLDivElement;
  private readonly quitBtn: HTMLButtonElement;
  private readonly results: HTMLDivElement;
  private readonly resultsBody: HTMLDivElement;
  private art: ExpeditionArt | null = null;
  private run: RunState | null = null;
  private runner: { sheet: SpriteSheet; name: string } | null = null;
  private rafId = 0;
  private lastMs = 0;
  private accMs = 0;
  private viewW: number = EXPEDITION.maxViewW;
  private onDone: ((rewards: Rewards) => void) | null = null;
  private readonly abort = new AbortController();

  constructor(parent: HTMLElement) {
    this.root = el('div', 'expedition');
    this.root.hidden = true;
    this.canvas = el('canvas', 'expedition-canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
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
    this.root.append(this.canvas, this.hud, this.quitBtn, this.results);
    parent.appendChild(this.root);

    const { signal } = this.abort;
    const press = (e: Event) => {
      if (!this.run || this.run.finished) return;
      e.preventDefault();
      jumpPressed(this.run);
    };
    const release = () => this.run && jumpReleased(this.run);
    this.canvas.addEventListener('pointerdown', press, { signal });
    this.canvas.addEventListener('pointerup', release, { signal });
    this.canvas.addEventListener('pointercancel', release, { signal });
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

  /** Start a run with the given Nubbin as the runner. */
  start(
    runner: Nubbin,
    sheet: SpriteSheet,
    seed: number,
    onDone: (rewards: Rewards) => void,
  ): void {
    this.art ??= buildExpeditionArt();
    this.runner = { sheet, name: runner.name };
    this.run = createRun(seed);
    this.onDone = onDone;
    this.results.hidden = true;
    this.root.hidden = false;
    this.resize();
    this.lastMs = 0;
    this.accMs = 0;
    this.rafId = requestAnimationFrame(this.frame);
  }

  private finish(): void {
    const rewards = this.run?.rewards ?? { shells: 0, essences: {}, critters: {} };
    cancelAnimationFrame(this.rafId);
    this.root.hidden = true;
    this.run = null;
    this.onDone?.(rewards);
    this.onDone = null;
  }

  resize(): void {
    const rect = this.root.getBoundingClientRect();
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(
      Math.max(EXPEDITION.minViewW, Math.min(EXPEDITION.maxViewW, EXPEDITION.viewH * aspect)),
    );
    this.canvas.width = this.viewW * PX;
    this.canvas.height = EXPEDITION.viewH * PX;
    // Letterbox: scale to fit while keeping the low-res aspect.
    const scale = Math.min(rect.width / this.viewW, rect.height / EXPEDITION.viewH);
    this.canvas.style.width = `${Math.floor(this.viewW * scale)}px`;
    this.canvas.style.height = `${Math.floor(EXPEDITION.viewH * scale)}px`;
  }

  private readonly frame = (nowMs: number): void => {
    const run = this.run;
    if (!run) return;
    // The backing canvas is PX times the design size; draw in design units.
    this.ctx.setTransform(PX, 0, 0, PX, 0, 0);
    const dt = this.lastMs === 0 ? 0 : Math.min(100, nowMs - this.lastMs);
    this.lastMs = nowMs;
    this.accMs += dt;
    const step = SIM.stepMs / 4; // 25 ms physics steps for a crisp jump
    while (this.accMs >= step) {
      stepRun(run, step);
      this.accMs -= step;
    }
    this.draw(run, nowMs);
    this.updateHud(run);
    if (run.finished && this.results.hidden) this.showResults(run.rewards);
    if (!run.finished || this.results.hidden) this.rafId = requestAnimationFrame(this.frame);
  };

  private updateHud(run: RunState): void {
    this.hud.textContent = `🐚 ${run.shells}  ·  ${Math.max(0, Math.ceil((EXPEDITION.durationMs - run.timeMs) / 1000))}s`;
  }

  private showResults(rewards: Rewards): void {
    this.resultsBody.innerHTML = '';
    const lines: string[] = [UI_TEXT.resultShells(rewards.shells)];
    for (const [type, n] of Object.entries(rewards.essences)) {
      if (n) lines.push(`${ESSENCE_LABELS[type as NubbinType]} ×${n}`);
    }
    for (const [species, n] of Object.entries(rewards.critters)) {
      if (n) lines.push(`${CRITTER_LABELS[species] ?? species} ×${n}`);
    }
    if (lines.length === 1 && rewards.shells === 0) lines.push(UI_TEXT.resultNothing);
    for (const line of lines) this.resultsBody.appendChild(el('p', undefined, line));
    this.results.hidden = false;
  }

  // ---------- drawing ----------

  private draw(run: RunState, nowMs: number): void {
    const ctx = this.ctx;
    const blit = (img: HTMLCanvasElement, x: number, y: number) =>
      ctx.drawImage(img, x, y, img.width / PX, img.height / PX);
    const art = this.art;
    if (!art) return;
    const W = this.viewW;
    const H = EXPEDITION.viewH;
    ctx.imageSmoothingEnabled = false;

    // Sky bands.
    ctx.fillStyle = color(C.shallows);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color(C.water);
    ctx.fillRect(0, 0, W, 60);
    ctx.fillStyle = color(C.pale);
    ctx.fillRect(0, EXPEDITION.groundY - 70, W, 70);

    // Parallax clouds and hills.
    const cloudShift = (run.distance * 0.2) % (W + 60);
    for (let i = 0; i < 4; i++) {
      const x = ((i * 150 - cloudShift) % (W + 60)) - 30;
      blit(art.cloud, x < -40 ? x + W + 60 : x, 20 + (i % 2) * 24);
    }
    const hillShift = (run.distance * 0.45) % 140;
    for (let x = -hillShift - 140; x < W + 140; x += 140) {
      blit(art.hill, x, EXPEDITION.groundY - 40);
    }

    // Ground: one grassy row, then earth with a few scrolling pebbles.
    ctx.fillStyle = color(C.bark);
    ctx.fillRect(0, EXPEDITION.groundY + 16, W, H - EXPEDITION.groundY - 16);
    const groundShift = run.distance % 16;
    for (let x = -groundShift - 16; x < W + 16; x += 16) {
      blit(art.groundTile, x, EXPEDITION.groundY);
    }
    ctx.fillStyle = color(C.darkBark);
    const pebbleShift = Math.floor(run.distance) % 48;
    for (let x = -pebbleShift; x < W + 48; x += 48) {
      ctx.fillRect(x + 7, EXPEDITION.groundY + 26, 2, 2);
      ctx.fillRect(x + 29, EXPEDITION.groundY + 41, 3, 2);
    }

    // Things.
    const bob = Math.floor(nowMs / 250) % 2;
    for (const t of run.things) {
      const sx = Math.round(t.x - run.distance);
      if (sx + t.w < 0 || sx > W) continue;
      switch (t.kind) {
        case 'shell':
          blit(art.shell[bob] ?? art.shell[0]!, sx, Math.round(t.y));
          break;
        case 'essence':
          blit(art.essence[t.type ?? 'normal'], sx, Math.round(t.y + (bob ? 1 : 0)));
          break;
        case 'critter':
          blit(art.bubble[bob] ?? art.bubble[0]!, sx, Math.round(t.y + (bob ? -1 : 1)));
          break;
        case 'rock':
          blit(art.rock, sx, Math.round(t.y));
          break;
        case 'log':
          blit(art.log, sx, Math.round(t.y));
          break;
        case 'bush':
          blit(art.bush, sx, Math.round(t.y));
          break;
      }
    }

    // Runner: the Nubbin's own side-view frames (walk on the ground, flap in the air).
    if (this.runner) {
      const sheet = this.runner.sheet;
      const clip = run.onGround ? 'walk' : 'flap';
      const f = frameAt(CLIPS[clip], run.timeMs);
      const rect = sheet.frames.get(frameKey(clip, 'side', f));
      if (rect) {
        const hit = run.lastEvent?.kind === 'hit' && run.timeMs - run.lastEvent.atMs < 300;
        if (!hit || Math.floor(nowMs / 60) % 2 === 0) {
          const image = sheet.texture.image as HTMLCanvasElement;
          const dx = Math.round(EXPEDITION.runnerX - rect.w / (2 * PX));
          const dy = Math.round(run.runnerY - RUNNER_H - 4);
          ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w / PX, rect.h / PX);
        }
      }
    }

    // Pickup sparkle.
    if (run.lastEvent && run.lastEvent.kind !== 'hit' && run.timeMs - run.lastEvent.atMs < 250) {
      ctx.fillStyle = color(C.white);
      const px = EXPEDITION.runnerX + 10;
      const py = run.runnerY - RUNNER_H - 8;
      ctx.fillRect(px, py, 2, 2);
      ctx.fillRect(px + 6, py - 4, 2, 2);
      ctx.fillRect(px - 5, py - 3, 2, 2);
    }

    // Progress bar.
    ctx.fillStyle = 'rgba(13,10,26,0.5)';
    ctx.fillRect(8, 8, W - 16, 4);
    ctx.fillStyle = color(C.sunYellow);
    ctx.fillRect(8, 8, Math.round((W - 16) * progressOf(run)), 4);

    // Name tag.
    ctx.fillStyle = color(C.cream);
    ctx.font = '8px monospace';
    ctx.fillText(this.runner?.name ?? NAMES.creature, 8, 24);
  }

  dispose(): void {
    this.abort.abort();
    cancelAnimationFrame(this.rafId);
  }
}
