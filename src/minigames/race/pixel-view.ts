import { drawShadowText, drawText } from '../../render/sprites/font';
import { PX } from '../../render/sprites/pixel-canvas';
import { NAMES, SECTION_LABELS, UI_TEXT } from '../../config/strings';
import { CLIPS, frameAt, frameKey, type ClipName } from '../../render/sprites/animations';
import type { SpriteSheet } from '../../render/sprites/atlas';
import { C, color } from '../../render/sprites/palette';
import type { SheetCache } from '../../render/sprites/sheets';
import { sectionAt, type RaceState, type Racer } from '../../sim/race';
import type { Nubbin } from '../../sim/types';
import { el } from '../../ui/dom';
import type { RaceView } from './view';

const PX_PER_UNIT = 22;
const VIEW_H = 270;
const LANE_GAP = 14;
const TRACK_TOP = 150;
/**
 * Low-res pixels of ground shown before the start line, so the runners lined up on it
 * (half a sprite each side of their spot) and their name tags are whole at the gun.
 */
const START_PAD = 20;

/**
 * The race's pixel view: a side view with lanes stacked in depth, drawn on a low-res
 * canvas; portrait keeps the player near the left third so the track ahead stays
 * readable. The drawing is the original screen code, moved here unchanged (G17).
 */
export class RacePixelView implements RaceView {
  readonly element: HTMLCanvasElement;
  readonly ready = true;
  private readonly ctx: CanvasRenderingContext2D;
  private sheets: Map<string, SpriteSheet> = new Map();
  private viewW = 480;

  constructor() {
    this.element = el('canvas', 'expedition-canvas');
    const ctx = this.element.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
  }

  start(race: RaceState, _player: Nubbin, playerSheet: SpriteSheet, cache: SheetCache): void {
    this.sheets = new Map();
    for (const r of race.racers) {
      this.sheets.set(r.id, r.isPlayer ? playerSheet : cache.rival(r.look.band, r.look.type));
    }
  }

  resize(rect: DOMRect): void {
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(Math.max(200, Math.min(480, VIEW_H * aspect)));
    this.element.width = this.viewW * PX;
    this.element.height = VIEW_H * PX;
    const scale = Math.min(rect.width / this.viewW, rect.height / VIEW_H);
    this.element.style.width = `${Math.floor(this.viewW * scale)}px`;
    this.element.style.height = `${Math.floor(VIEW_H * scale)}px`;
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

  draw(race: RaceState, nowMs: number): void {
    const ctx = this.ctx;
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    const W = this.viewW;
    ctx.imageSmoothingEnabled = false;
    const player = race.racers.find((r) => r.isPlayer) ?? race.racers[0]!;
    const camX = Math.max(-START_PAD, player.pos * PX_PER_UNIT - W * 0.35);
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
    // The run-up before the start line: grass, whatever the first section is.
    const startX = Math.round(-camX);
    if (startX > 0) {
      ctx.fillStyle = color(C.grass);
      ctx.fillRect(0, bandTop, startX, bandBottom - bandTop);
    }
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
      // Name tag, the player's in yellow: just ahead of the runner on its own lane row, so
      // the tags of a full field, lined up at the start, do not pile on one another.
      drawText(
        ctx,
        r.name,
        sx + rect.w / PX - 4,
        TRACK_TOP + lane * LANE_GAP - 8,
        color(r.isPlayer ? C.sunYellow : C.cream),
      );
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
}
