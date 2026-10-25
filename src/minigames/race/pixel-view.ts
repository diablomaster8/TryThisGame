import { RACE_LOOK } from '../../config/campaign-look';
import { drawBib, drawStoryTrack } from '../../render/dress-f-race';
import { drawShadowText, FONT_H, measureText } from '../../render/sprites/font';
import { PX } from '../../render/sprites/pixel-canvas';
import { NAMES, SECTION_LABELS, UI_TEXT } from '../../config/strings';
import { CLIPS, frameAt, frameKey, type ClipName } from '../../render/sprites/animations';
import type { SpriteSheet } from '../../render/sprites/atlas';
import { C, color } from '../../render/sprites/palette';
import type { SheetCache } from '../../render/sprites/sheets';
import { sectionAt, type RaceState, type Racer } from '../../sim/race';
import type { Nubbin } from '../../sim/types';
import { el } from '../../ui/dom';
import { buildExpeditionArt, type ExpeditionArt } from '../expedition/art';
import { paintForeground, paintSection, skyBands, SKY_STOPS, type TrackFrame } from './pixel-track';
import type { RaceView } from './view';

const PX_PER_UNIT = 22;

const reduceMotion = (): boolean =>
  document.documentElement.classList.contains('reduce-motion') ||
  (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

/** Landscape view height in low-res pixels; the width follows the screen. */
const VIEW_H = 270;
/** Portrait view width: narrow enough that the runners read at phone size. */
const PORTRAIT_W = 192;
/** The tallest a portrait view grows before it letterboxes. */
const MAX_VIEW_H = 460;
/** Lane spacing bounds; the spacing grows with the room the screen gives. */
const MIN_LANE_GAP = 14;
const MAX_LANE_GAP = 26;
/** The progress bar and title along the top, and the least sky kept above the band. */
const HEADER_H = 24;
const MIN_SKY = 46;
/** The ground strip in front of the band. */
const FOREGROUND_H = 14;
/**
 * Low-res pixels of ground shown before the start line, so the runners lined up on it
 * (half a sprite each side of their spot) and their name tags are whole at the gun.
 */
const START_PAD = 20;
/** After the line, runners jog on and ease to a stop, the winner farthest (at least this far). */
const RUNOUT_MIN = 0.8;
const RUNOUT_MS = 1400;

interface Tag {
  text: string;
  x: number;
  y: number;
  /** Screen x of the runner it labels, for the fallback spot behind it. */
  sx: number;
  player: boolean;
}

/**
 * The race's pixel view: a side view with lanes stacked in depth, drawn on a low-res
 * canvas. Portrait narrows and heightens the view so the lanes spread to fill the phone
 * (review 2026-10-24: the race was a 400 px strip between empty bands); the player stays in
 * the left third so the track ahead reads.
 */
export class RacePixelView implements RaceView {
  readonly element: HTMLCanvasElement;
  readonly ready = true;
  private readonly ctx: CanvasRenderingContext2D;
  private sheets: Map<string, SpriteSheet> = new Map();
  private art: ExpeditionArt | null = null;
  private viewW = 480;
  private viewH = VIEW_H;
  private lanes = 6;

  constructor() {
    this.element = el('canvas', 'expedition-canvas');
    const ctx = this.element.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
  }

  start(race: RaceState, _player: Nubbin, playerSheet: SpriteSheet, cache: SheetCache): void {
    this.sheets = new Map();
    this.art ??= buildExpeditionArt();
    this.lanes = race.racers.length;
    for (const r of race.racers) {
      this.sheets.set(r.id, r.isPlayer ? playerSheet : cache.rival(r.look.band, r.look.type));
    }
  }

  resize(rect: DOMRect): void {
    const aspect = rect.width / Math.max(1, rect.height);
    if (aspect >= 1) {
      this.viewH = VIEW_H;
      this.viewW = Math.round(Math.max(200, Math.min(480, VIEW_H * aspect)));
    } else {
      // Portrait: a narrower view, as tall as the screen allows, so the field fills it.
      this.viewW = Math.round(Math.max(160, Math.min(PORTRAIT_W, VIEW_H * aspect * 1.6)));
      this.viewH = Math.round(Math.max(VIEW_H * 0.8, Math.min(MAX_VIEW_H, this.viewW / aspect)));
    }
    this.element.width = this.viewW * PX;
    this.element.height = this.viewH * PX;
    const scale = Math.min(rect.width / this.viewW, rect.height / this.viewH);
    this.element.style.width = `${Math.floor(this.viewW * scale)}px`;
    this.element.style.height = `${Math.floor(this.viewH * scale)}px`;
  }

  /** The lane spacing and the band's place for the current view and field. */
  private layout(lanes: number): {
    gap: number;
    trackTop: number;
    bandTop: number;
    bandBottom: number;
  } {
    const room = this.viewH - HEADER_H - MIN_SKY - FOREGROUND_H - 40;
    const gap = Math.max(
      MIN_LANE_GAP,
      Math.min(MAX_LANE_GAP, Math.floor(room / Math.max(1, lanes))),
    );
    const bandBottom = this.viewH - FOREGROUND_H;
    const trackTop = bandBottom - 10 - (lanes - 1) * gap - Math.round(gap * 0.4);
    return { gap, trackTop, bandTop: trackTop - 30, bandBottom };
  }

  cheered(): void {
    // The glow is drawn from the race's own cheer timer.
  }

  stop(): void {
    this.sheets = new Map();
  }

  dispose(): void {
    this.sheets = new Map();
  }

  /**
   * Where a runner is drawn, in course units. Past the line, finishers jog on and ease to a
   * stop spread out by place (they all used to stack on the line in one column).
   */
  private drawnPos(race: RaceState, r: Racer, place: number): number {
    if (r.finishedAtMs === null) return r.pos;
    const room = (this.viewW * 0.55 - 24) / PX_PER_UNIT;
    const step = Math.min(
      0.6,
      Math.max(0.2, (room - RUNOUT_MIN) / Math.max(1, race.racers.length - 1)),
    );
    const stopAt = RUNOUT_MIN + (race.racers.length - place) * step;
    const t = Math.min(1, (race.timeMs - r.finishedAtMs) / RUNOUT_MS);
    return race.length + stopAt * (1 - (1 - t) * (1 - t));
  }

  draw(race: RaceState, nowMs: number): void {
    const ctx = this.ctx;
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    const W = this.viewW;
    const H = this.viewH;
    ctx.imageSmoothingEnabled = false;
    const still = reduceMotion();
    const lanes = race.racers.length;
    const { gap, trackTop, bandTop, bandBottom } = this.layout(lanes);
    const trackPx = race.length * PX_PER_UNIT;

    // Places so far: finishers by time, then by distance.
    const placeOf = new Map<string, number>();
    [...race.racers]
      .sort((a, b) => {
        const fa = a.finishedAtMs ?? Infinity;
        const fb = b.finishedAtMs ?? Infinity;
        return fa !== fb ? fa - fb : b.pos - a.pos;
      })
      .forEach((r, i) => placeOf.set(r.id, i + 1));
    const player = race.racers.find((r) => r.isPlayer) ?? race.racers[0]!;
    const playerPos = this.drawnPos(race, player, placeOf.get(player.id) ?? 1);
    // Follow the player, but hold the finish line in view once it is reached.
    const camX = Math.max(
      -START_PAD,
      Math.min(playerPos * PX_PER_UNIT - W * 0.35, trackPx - W * 0.42),
    );

    // Sky, clouds and far hills.
    skyBands(ctx, W, 0, bandTop, SKY_STOPS);
    const art = this.art;
    if (art) {
      const cw = art.cloud.width / PX;
      const span = W + cw + 40;
      for (let i = 0; i < 5; i++) {
        const raw = i * 97 - camX * 0.15 - (still ? 0 : nowMs / 900);
        const x = (((raw % span) + span) % span) - cw;
        const y = HEADER_H + 4 + ((i * 13) % Math.max(8, bandTop - HEADER_H - 40));
        ctx.drawImage(art.cloud, Math.round(x), y, cw, art.cloud.height / PX);
      }
      const hw = art.hill.width / PX;
      const hh = art.hill.height / PX;
      const shift = (((camX * 0.4) % hw) + hw) % hw;
      for (let x = -shift - hw; x < W + hw; x += hw)
        ctx.drawImage(art.hill, Math.round(x), bandTop - hh + 6, hw, hh);
    }

    const laneY = race.racers.map((_, i) => trackTop + i * gap);
    const frame: TrackFrame = { ctx, W, H, bandTop, bandBottom, laneY, camX, nowMs, still };
    // The run-up before the start line, and the run-out past the finish: grass.
    const startX = Math.round(-camX);
    if (startX > 0) paintSection(frame, 'runup', 0, startX);
    let start = 0;
    const labels: Array<{ text: string; x: number }> = [];
    for (const s of race.course.sections) {
      const x0 = Math.round(start * PX_PER_UNIT - camX);
      const x1 = Math.round((start + s.length) * PX_PER_UNIT - camX);
      start += s.length;
      if (x1 < 0 || x0 > W) continue;
      paintSection(frame, s.kind, x0, x1);
      // The label stays whole while its section scrolls past the left edge, until the
      // section's own end pushes it off ("IM" for SWIM at 375 px, review 2026-10-21, 22).
      const label = SECTION_LABELS[s.kind];
      labels.push({ text: label, x: Math.min(Math.max(x0 + 5, 4), x1 - measureText(label) - 4) });
      ctx.fillStyle = color(C.darkPlum);
      ctx.fillRect(x0, bandTop - 8, 2, bandBottom - bandTop + 8);
    }
    const fx = Math.round(trackPx - camX);
    if (fx < W) paintSection(frame, 'runup', fx, W);
    paintForeground(frame);
    for (const l of labels)
      drawShadowText(ctx, l.text, l.x, bandTop - 9, color(C.cream), color(C.darkPlum));
    // Finish line.
    for (let y = bandTop; y < bandBottom; y += 6) {
      ctx.fillStyle = color((y / 6) % 2 === 0 ? C.white : C.ink);
      ctx.fillRect(fx, y, 4, 6);
    }

    // The story race (chapter 5): frosted rails, a stand of spectators, bibs (campaign look M4).
    if (RACE_LOOK.story)
      drawStoryTrack(ctx, { W, bandTop, bandBottom, camX, nowMs, reduce: still });

    // Racers, far lanes first so near ones draw on top. Name tags go on after every
    // sprite, outlined, so a near runner never hides a far one's name (bug 22).
    const tags: Tag[] = [];
    for (let lane = lanes - 1; lane >= 0; lane--) {
      const r = race.racers[lane]!;
      const sheet = this.sheets.get(r.id);
      if (!sheet) continue;
      const place = placeOf.get(r.id) ?? lane + 1;
      const pos = this.drawnPos(race, r, place);
      const { section } = sectionAt(race.course, Math.min(r.pos, race.length - 0.001));
      const done = r.finishedAtMs !== null;
      const resting = r.restMs > 0 && !done;
      const clip: ClipName = done
        ? race.timeMs - (r.finishedAtMs ?? 0) > RUNOUT_MS
          ? place <= 3
            ? 'happy'
            : 'idle'
          : 'walk'
        : resting
          ? 'sad'
          : section.kind === 'swim'
            ? 'swim'
            : section.kind === 'fly'
              ? 'flap'
              : 'walk';
      const f = frameAt(CLIPS[clip], still ? 0 : nowMs + lane * 90);
      const rect = sheet.frames.get(frameKey(clip, 'side', f));
      if (!rect) continue;
      const image = sheet.texture.image as HTMLCanvasElement;
      const sx = Math.round(pos * PX_PER_UNIT - camX - rect.w / (2 * PX));
      const lift = done
        ? 0
        : section.kind === 'fly' && !resting
          ? 18
          : section.kind === 'climb'
            ? 6
            : 0;
      const sy = Math.round(laneY[lane]! - rect.h / PX + 4 - lift);
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, sx, sy, rect.w / PX, rect.h / PX);
      if (RACE_LOOK.story && !r.isPlayer)
        drawBib(
          ctx,
          Math.round(sx + rect.w / (2 * PX) - 4),
          Math.round(sy + rect.h / PX - 14),
          lane + 1,
        );
      // Name tag, the player's in yellow, with the place once they are home.
      tags.push({
        text: done ? `${place} ${r.name}` : r.name,
        x: sx + rect.w / PX - 4,
        y: laneY[lane]! - 8 - lift,
        sx,
        player: r.isPlayer,
      });
      if (resting)
        drawShadowText(ctx, 'zz', sx + rect.w / PX - 6, sy - 2, color(C.pale), color(C.darkPlum));
      if (r.isPlayer) this.drawStamina(r, sx + 4, sy + rect.h / PX + 1);
    }
    for (const t of placeTags(tags, W)) {
      const fg = color(t.player ? C.sunYellow : C.cream);
      drawShadowText(ctx, t.text, t.x, t.y, fg, color(C.darkPlum));
    }

    // Cheer glow.
    if (race.timeMs < race.cheerUntilMs) {
      ctx.fillStyle = 'rgba(242,211,76,0.18)';
      ctx.fillRect(0, 0, W, H);
    }
    // Progress bar and title.
    ctx.fillStyle = 'rgba(13,10,26,0.5)';
    ctx.fillRect(8, 8, W - 16, 4);
    ctx.fillStyle = color(C.sunYellow);
    ctx.fillRect(8, 8, Math.round(((W - 16) * Math.min(player.pos, race.length)) / race.length), 4);
    drawShadowText(
      ctx,
      `${NAMES.game} · ${UI_TEXT.tierLabel(race.tier)}`,
      8,
      15,
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
}

/**
 * Lay the name tags out so none sits on another (review 2026-10-24): the player's first,
 * then the rest front to back. A tag that would overlap moves past the one it hits, then
 * tries behind its runner; a rival's tag with nowhere free is left off for that frame.
 */
export function placeTags<T extends Tag>(tags: readonly T[], W: number): T[] {
  const h = FONT_H + 2;
  const placed: Array<T & { w: number }> = [];
  const hits = (x: number, y: number, w: number) =>
    placed.find((p) => x < p.x + p.w + 2 && x + w + 2 > p.x && y < p.y + h && y + h > p.y);
  const ordered = [...tags].sort((a, b) => Number(b.player) - Number(a.player));
  for (const t of ordered) {
    const w = measureText(t.text) + 1;
    let x = Math.min(t.x, W - w - 2);
    let ok = false;
    for (let tries = 0; tries < 6; tries++) {
      const hit = hits(x, t.y, w);
      if (!hit) {
        ok = true;
        break;
      }
      x = hit.x + hit.w + 3;
      if (x + w > W - 1) break;
    }
    if (!ok) {
      x = Math.max(1, t.sx - w - 1);
      ok = !hits(x, t.y, w);
    }
    if (ok || t.player) placed.push({ ...t, x, w });
  }
  return placed;
}
