import { RACE, SIM } from '../../config/tuning';
import { drawShadowText, drawText } from '../../render/sprites/font';
import { PX } from '../../render/sprites/pixel-canvas';
import { NAMES, UI_TEXT } from '../../config/strings';
import { CLIPS, frameAt, frameKey, type ClipName } from '../../render/sprites/animations';
import type { SpriteSheet } from '../../render/sprites/atlas';
import { C, color } from '../../render/sprites/palette';
import type { SheetCache } from '../../render/sprites/sheets';
import { playSound } from '../../platform/audio';
import {
  cheer,
  cheerReady,
  playerPlacement,
  prizeFor,
  sectionAt,
  stepRace,
  type RaceState,
  type Racer,
} from '../../sim/race';
import { button, el } from '../../ui/dom';

export interface RaceOutcome {
  placement: number;
  shells: number;
  hat: string | null;
}

const PX_PER_UNIT = 22;
const VIEW_H = 270;
const LANE_GAP = 14;
const TRACK_TOP = 150;

/**
 * The race screen: a side view with lanes stacked in depth, drawn on a low-res canvas.
 * The cheer button is a big DOM button so it stays a 44 px target on phones. Portrait
 * keeps the player near the left third so the track ahead stays readable.
 */
export class RaceScreen {
  private readonly root: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly hud: HTMLDivElement;
  private readonly cheerBtn: HTMLButtonElement;
  private readonly quitBtn: HTMLButtonElement;
  private readonly results: HTMLDivElement;
  private readonly resultsBody: HTMLDivElement;
  private race: RaceState | null = null;
  private sheets: Map<string, SpriteSheet> = new Map();
  private rafId = 0;
  private lastMs = 0;
  private accMs = 0;
  private viewW = 480;
  private onDone: ((outcome: RaceOutcome) => void) | null = null;
  private outcome: RaceOutcome | null = null;
  private hatRoll = 0;
  private readonly abort = new AbortController();

  constructor(parent: HTMLElement) {
    this.root = el('div', 'expedition race');
    this.root.hidden = true;
    this.canvas = el('canvas', 'expedition-canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
    this.hud = el('div', 'expedition-hud');
    this.cheerBtn = button(UI_TEXT.cheer, () => this.cheer(), 'btn btn-primary cheer');
    this.results = el('div', 'modal');
    this.results.hidden = true;
    const card = el('div', 'modal-card');
    card.appendChild(el('h2', undefined, UI_TEXT.raceResults));
    this.resultsBody = el('div');
    card.append(
      this.resultsBody,
      button(UI_TEXT.backToGrove, () => this.finish(), 'btn btn-primary'),
    );
    this.results.appendChild(card);
    this.quitBtn = button('✕', () => this.finish(), 'btn btn-icon quit');
    this.quitBtn.setAttribute('aria-label', UI_TEXT.quitMinigame);
    this.quitBtn.title = UI_TEXT.quitMinigame;
    this.root.append(this.canvas, this.hud, this.cheerBtn, this.quitBtn, this.results);
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

  start(
    race: RaceState,
    playerSheet: SpriteSheet,
    cache: SheetCache,
    hatRoll: number,
    onDone: (outcome: RaceOutcome) => void,
  ): void {
    this.race = race;
    this.onDone = onDone;
    this.outcome = null;
    this.hatRoll = hatRoll;
    this.sheets = new Map();
    for (const r of race.racers) {
      this.sheets.set(r.id, r.isPlayer ? playerSheet : cache.rival(r.look.band, r.look.type));
    }
    this.results.hidden = true;
    this.root.hidden = false;
    this.resize();
    this.lastMs = 0;
    this.accMs = 0;
    this.rafId = requestAnimationFrame(this.frame);
  }

  private cheer(): void {
    if (!this.race) return;
    if (cheer(this.race)) playSound('cheer');
  }

  private finish(): void {
    const outcome = this.outcome ?? {
      placement: this.race?.racers.length ?? 1,
      shells: 0,
      hat: null,
    };
    cancelAnimationFrame(this.rafId);
    this.root.hidden = true;
    this.race = null;
    this.onDone?.(outcome);
    this.onDone = null;
  }

  resize(): void {
    const rect = this.root.getBoundingClientRect();
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(Math.max(200, Math.min(480, VIEW_H * aspect)));
    this.canvas.width = this.viewW * PX;
    this.canvas.height = VIEW_H * PX;
    const scale = Math.min(rect.width / this.viewW, rect.height / VIEW_H);
    this.canvas.style.width = `${Math.floor(this.viewW * scale)}px`;
    this.canvas.style.height = `${Math.floor(VIEW_H * scale)}px`;
  }

  private readonly frame = (nowMs: number): void => {
    const race = this.race;
    if (!race) return;
    this.ctx.setTransform(PX, 0, 0, PX, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    const dt = this.lastMs === 0 ? 0 : Math.min(100, nowMs - this.lastMs);
    this.lastMs = nowMs;
    this.accMs += dt;
    while (this.accMs >= SIM.stepMs) {
      stepRace(race, SIM.stepMs);
      this.accMs -= SIM.stepMs;
    }
    this.draw(race, nowMs);
    this.updateHud(race);
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

  private updateHud(race: RaceState): void {
    const place = this.livePlacement(race);
    this.hud.textContent = `${UI_TEXT.place(place)}  ·  ${Math.floor(race.timeMs / 1000)}s`;
    this.cheerBtn.disabled = !cheerReady(race) || race.finished;
  }

  private showResults(race: RaceState): void {
    const placement = playerPlacement(race);
    const shells = prizeFor(placement, race.tier);
    let hat: string | null = null;
    if (placement === 1 && this.hatRoll < RACE.hatChanceOnWin) {
      const lookIndex = Math.floor((this.hatRoll / RACE.hatChanceOnWin) * LOOK_PRIZES.length);
      hat =
        race.tier === 3 ? (LOOK_PRIZES[lookIndex] ?? null) : (HAT_PRIZES[race.tier - 1] ?? null);
    }
    this.outcome = { placement, shells, hat };
    this.resultsBody.innerHTML = '';
    this.resultsBody.appendChild(el('p', 'celebrate-form', UI_TEXT.place(placement)));
    if (shells > 0) this.resultsBody.appendChild(el('p', undefined, UI_TEXT.resultShells(shells)));
    if (hat) this.resultsBody.appendChild(el('p', undefined, UI_TEXT.wonHat));
    if (placement === 1 && race.tier < 3)
      this.resultsBody.appendChild(el('p', undefined, UI_TEXT.tierUnlocked));
    playSound(placement <= 3 ? 'win' : 'sad');
    this.results.hidden = false;
  }

  // ---------- drawing ----------

  private draw(race: RaceState, nowMs: number): void {
    const ctx = this.ctx;
    const W = this.viewW;
    ctx.imageSmoothingEnabled = false;
    const player = race.racers.find((r) => r.isPlayer) ?? race.racers[0]!;
    const camX = Math.max(0, player.pos * PX_PER_UNIT - W * 0.35);
    const trackPx = race.length * PX_PER_UNIT;

    // Sky.
    ctx.fillStyle = color(C.shallows);
    ctx.fillRect(0, 0, W, VIEW_H);
    ctx.fillStyle = color(C.water);
    ctx.fillRect(0, 0, W, 50);

    // Track sections, each lane band shares the section colour.
    const lanes = race.racers.length;
    const bandTop = TRACK_TOP - 30;
    const bandBottom = TRACK_TOP + lanes * LANE_GAP + 10;
    let start = 0;
    for (const s of race.course.sections) {
      const x0 = Math.round(start * PX_PER_UNIT - camX);
      const x1 = Math.round((start + s.length) * PX_PER_UNIT - camX);
      start += s.length;
      if (x1 < 0 || x0 > W) continue;
      const fill =
        s.kind === 'swim'
          ? C.water
          : s.kind === 'fly'
            ? C.pale
            : s.kind === 'climb'
              ? C.dusk
              : s.kind === 'stretch'
                ? C.sand
                : C.grass;
      ctx.fillStyle = color(fill);
      ctx.fillRect(x0, bandTop, x1 - x0, bandBottom - bandTop);
      // Section label and a divider post.
      ctx.fillStyle = color(C.darkPlum);
      ctx.fillRect(x0, bandTop - 8, 2, bandBottom - bandTop + 8);
      ctx.fillStyle = color(C.cream);
      drawText(ctx, SECTION_LABELS[s.kind], x0 + 5, bandTop - 9, color(C.cream));
    }
    // Finish line.
    const fx = Math.round(trackPx - camX);
    for (let y = bandTop; y < bandBottom; y += 6) {
      ctx.fillStyle = color((y / 6) % 2 === 0 ? C.white : C.ink);
      ctx.fillRect(fx, y, 4, 6);
    }

    // Racers, far lanes first so near ones draw on top.
    const order = [...race.racers].reverse();
    for (const r of order) {
      const lane = race.racers.indexOf(r);
      const sheet = this.sheets.get(r.id);
      if (!sheet) continue;
      const { section } = sectionAt(race.course, r.pos);
      const resting = r.restMs > 0;
      const clip: ClipName = resting
        ? 'sad'
        : section.kind === 'swim'
          ? 'swim'
          : section.kind === 'fly'
            ? 'flap'
            : 'walk';
      const f = frameAt(CLIPS[clip], nowMs + lane * 90);
      const rect = sheet.frames.get(frameKey(clip, 'side', f));
      if (!rect) continue;
      const image = sheet.texture.image as HTMLCanvasElement;
      const sx = Math.round(r.pos * PX_PER_UNIT - camX - rect.w / (2 * PX));
      const lift = section.kind === 'fly' && !resting ? 18 : section.kind === 'climb' ? 6 : 0;
      const sy = Math.round(TRACK_TOP + lane * LANE_GAP - rect.h / PX + 4 - lift);
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, sx, sy, rect.w / PX, rect.h / PX);
      // Name tag, the player's in yellow.
      drawText(ctx, r.name, sx + 2, sy - 9, color(r.isPlayer ? C.sunYellow : C.cream));
      if (resting) {
        drawText(ctx, 'zz', sx + rect.w / PX - 6, sy - 2, color(C.pale));
      }
      if (r.isPlayer) this.drawStamina(r, sx, sy + rect.h / PX + 2);
    }

    // Cheer glow.
    if (race.timeMs < race.cheerUntilMs) {
      ctx.fillStyle = 'rgba(242,211,76,0.18)';
      ctx.fillRect(0, 0, W, VIEW_H);
    }
    // Progress bar.
    ctx.fillStyle = 'rgba(13,10,26,0.5)';
    ctx.fillRect(8, 8, W - 16, 4);
    ctx.fillStyle = color(C.sunYellow);
    ctx.fillRect(8, 8, Math.round(((W - 16) * player.pos) / race.length), 4);
    ctx.fillStyle = color(C.cream);
    drawShadowText(
      ctx,
      `${NAMES.game} · ${UI_TEXT.tierLabel(race.tier)}`,
      8,
      18,
      color(C.cream),
      color(C.darkPlum),
    );
  }

  private drawStamina(r: Racer, x: number, y: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(13,10,26,0.6)';
    ctx.fillRect(x, y, 24, 3);
    ctx.fillStyle = color(r.stamina > r.staminaMax * 0.25 ? C.mint : C.ember);
    ctx.fillRect(x, y, Math.round((24 * r.stamina) / r.staminaMax), 3);
  }

  dispose(): void {
    this.abort.abort();
    cancelAnimationFrame(this.rafId);
  }
}

const SECTION_LABELS = {
  swim: 'SWIM',
  fly: 'FLY',
  run: 'RUN',
  climb: 'CLIMB',
  stretch: 'STAMINA',
} as const;

/** Hat prizes by tier (index 0 = tier 1); tier 3 pays a character look. */
export const HAT_PRIZES = ['straw', 'beanie', 'look-fox'] as const;
export const LOOK_PRIZES = ['look-fox', 'look-echidna', 'look-rose', 'look-dream'] as const;
