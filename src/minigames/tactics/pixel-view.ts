/**
 * The tactics board in Pixel (recs FIGHT-61): 2.5D blocks, a 32×16 top diamond over a side
 * face 8 px per height level, in the shared 48-colour palette, drawn into a low-res canvas
 * that CSS scales up with nearest-neighbour filtering. Rotation is in quarter turns, zoom has
 * two levels. Reads the state only.
 *
 * A frame is three draws on WebGL (`gl-board.ts`): the blocks, painted once per map and
 * rotation into a canvas texture; the overlays, painted into a second board-sized texture
 * only when they change; and every unit with its bars as one batch from a shared atlas
 * (`unit-atlas.ts`). Without WebGL the same layers go through Canvas 2D instead.
 */
import { idleKind, idlePose, reducedMotion } from '../../ui/battle-idle';
import { CLIPS, frameAt, frameKey, type ClipName } from '../../render/sprites/animations';
import type { FrameRect, SpriteSheet } from '../../render/sprites/atlas';
import { C, PALETTE, color } from '../../render/sprites/palette';
import { PX } from '../../render/sprites/pixel-canvas';
import { standing } from '../../sim/battle/damage';
import { heightAt, mapOf, tileAt } from '../../sim/battle/tactics';
import { chargeTiles } from '../../sim/battle/tactics/engine';
import {
  TILE,
  type TacticsCell,
  type Dir,
  type GridMap,
  type TacticsState,
  type TUnit,
} from '../../sim/battle/tactics/types';
import type { Flashes, Overlays, TacticsBoardView } from './board-view';
import { GlBoard, type GlTexture } from './gl-board';
import { UnitAtlas } from './unit-atlas';

export const TILE_W = 32;
export const TILE_H = 16;
export const LEVEL_H = 8;

export type { Overlays } from './board-view';

const TOP: Partial<Record<number, number>> = {
  [TILE.grass]: C.grass,
  [TILE.wall]: C.lilacGrey,
  [TILE.deep]: C.deepWater,
  [TILE.shallow]: C.shallows,
  [TILE.crystal]: C.tealLight,
  [TILE.lantern]: C.sunYellow,
  [TILE.tall]: C.leaf,
  [TILE.path]: C.sand,
  [TILE.mud]: C.bark,
  [TILE.shade]: C.forest,
  [TILE.tree]: C.leafDeep,
  [TILE.plot]: C.wood,
  [TILE.exit]: C.roseLight,
};
const SIDE: Partial<Record<number, number>> = {
  [TILE.wall]: C.dusk,
  [TILE.deep]: C.nightBlue,
  [TILE.shallow]: C.water,
  [TILE.crystal]: C.tealDeep,
};

const DIR_IX: Record<Dir, number> = { n: 0, e: 1, s: 2, w: 3 };

/** The clips a unit can show on the board, packed together when a creature first appears. */
const BOARD_CLIPS: ClipName[] = ['idle', 'walk', 'sad', 'sleep'];
const BOARD_ANGLES = ['frontQuarter', 'backQuarter'];

function warmKeys(): string[] {
  const out = [frameKey('idle', 'front', 0)];
  for (const clip of BOARD_CLIPS)
    for (const angle of BOARD_ANGLES)
      for (let i = 0; i < CLIPS[clip].frames; i++) out.push(frameKey(clip, angle, i));
  return out;
}

/** Palette index → 0–1 rgb, for vertex tints. */
const RGB = PALETTE.map((hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
});

/** One thing a unit draws: a sprite frame or a solid palette rectangle, in board pixels. */
type UnitOp =
  | {
      k: 'img';
      sheet: SpriteSheet;
      key: string;
      rect: FrameRect;
      x: number;
      y: number;
      w: number;
      h: number;
      flip: boolean;
      a: number;
    }
  | { k: 'rect'; c: number; x: number; y: number; w: number; h: number };

interface Layer {
  key: string;
  canvas: HTMLCanvasElement;
  ox: number;
  oy: number;
  /** Nothing painted (the overlay layer then costs no draw). */
  empty: boolean;
}

export class TacticsPixelView implements TacticsBoardView {
  /** Draw calls in the last frame: the map, the overlays when any, and the units. */
  private calls = 0;
  /** The Canvas 2D fallback's context (null on the WebGL path). */
  readonly ctx: CanvasRenderingContext2D | null;
  private readonly gl: GlBoard | null;
  private atlas: UnitAtlas | null = null;
  private tex: { map: GlTexture; over: GlTexture; units: GlTexture } | null = null;
  private warm: string[] | null = null;
  /** Quarter turns clockwise. */
  rot = 0;
  /** Device pixels per board pixel, for each zoom level. */
  zoom: 1 | 2 = 1;
  scale = 1;
  /** Pan, in board pixels. */
  panX = 0;
  panY = 0;
  private cache: Layer | null = null;
  private over: Layer | null = null;

  constructor(
    readonly canvas: HTMLCanvasElement,
    useGl = true,
  ) {
    this.gl = useGl ? GlBoard.create(canvas) : null;
    this.ctx = this.gl ? null : canvas.getContext('2d');
    // The CSS box comes from a ResizeObserver, so a frame never forces a layout to read it.
    if (typeof ResizeObserver === 'function') {
      this.sizer = new ResizeObserver(() => (this.box = null));
      this.sizer.observe(canvas);
    }
  }

  private sizer: ResizeObserver | null = null;
  private box: { width: number; height: number } | null = null;

  /** The canvas's CSS size, read from layout only after a resize (every frame without RO). */
  private cssBox(): { width: number; height: number } {
    if (this.box) return this.box;
    const r = this.canvas.getBoundingClientRect();
    const box = { width: r.width, height: r.height };
    if (this.sizer) this.box = box;
    return box;
  }

  /** Which path draws the board (tests and the perf log). */
  get backend(): 'webgl' | '2d' {
    return this.gl ? 'webgl' : '2d';
  }

  /** Fits the low-res canvas to its CSS box: zoom 1 fits the board, zoom 2 doubles it. */
  resize(m: GridMap): void {
    const r = this.cssBox();
    const fitW = r.width / ((m.w + m.h) * (TILE_W / 2) + 24);
    const fitH = r.height / ((m.w + m.h) * (TILE_H / 2) + 4 * LEVEL_H + 40);
    const base = Math.max(1, Math.floor(Math.min(fitW, fitH)));
    this.scale = this.zoom === 2 ? base * 2 : base;
    const w = Math.max(1, Math.ceil(r.width / this.scale));
    const h = Math.max(1, Math.ceil(r.height / this.scale));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (this.ctx) this.ctx.imageSmoothingEnabled = false;
  }

  /** A grid cell in the rotated frame. */
  private rotated(m: GridMap, x: number, y: number): TacticsCell {
    switch (this.rot & 3) {
      case 1:
        return { x: m.h - 1 - y, y: x };
      case 2:
        return { x: m.w - 1 - x, y: m.h - 1 - y };
      case 3:
        return { x: y, y: m.w - 1 - x };
      default:
        return { x, y };
    }
  }

  /** Board-space position of a tile's top centre. */
  private iso(
    m: GridMap,
    x: number,
    y: number,
    ox: number,
    oy: number,
  ): { sx: number; sy: number } {
    const r = this.rotated(m, x, y);
    return {
      sx: ox + (r.x - r.y) * (TILE_W / 2),
      sy: oy + (r.x + r.y) * (TILE_H / 2) - heightAt(m, x, y) * LEVEL_H,
    };
  }

  /** The origin so the board sits centred, then panned. */
  private origin(m: GridMap): { ox: number; oy: number } {
    const rw = this.rot & 1 ? m.h : m.w;
    const rh = this.rot & 1 ? m.w : m.h;
    const boardH = (rw + rh) * (TILE_H / 2);
    return {
      ox: Math.round(this.canvas.width / 2 + ((rh - rw) * TILE_W) / 4 + this.panX),
      oy: Math.round((this.canvas.height - boardH) / 2 + 2 * LEVEL_H + this.panY),
    };
  }

  /** Tiles from the back to the front of the current view. */
  private order(m: GridMap): TacticsCell[] {
    const out: Array<TacticsCell & { d: number }> = [];
    for (let y = 0; y < m.h; y++)
      for (let x = 0; x < m.w; x++) {
        const r = this.rotated(m, x, y);
        out.push({ x, y, d: r.x + r.y });
      }
    return out.sort((a, b) => a.d - b.d);
  }

  private block(
    ctx: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    h: number,
    top: string,
    side: string,
  ): void {
    const hw = TILE_W / 2;
    const hh = TILE_H / 2;
    const depth = h * LEVEL_H + 4;
    ctx.fillStyle = side;
    ctx.beginPath();
    ctx.moveTo(sx - hw, sy + hh);
    ctx.lineTo(sx, sy + TILE_H);
    ctx.lineTo(sx + hw, sy + hh);
    ctx.lineTo(sx + hw, sy + hh + depth);
    ctx.lineTo(sx, sy + TILE_H + depth);
    ctx.lineTo(sx - hw, sy + hh + depth);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = top;
    diamond(ctx, sx, sy);
    ctx.fill();
  }

  /** A board-sized canvas with the board's own origin (the map and overlay layers share it). */
  private layerFrame(m: GridMap): { W: number; H: number; ox: number; oy: number } {
    const pad = 6 * LEVEL_H;
    const rh = this.rot & 1 ? m.w : m.h;
    return {
      W: (m.w + m.h) * (TILE_W / 2) + 2,
      H: (m.w + m.h) * (TILE_H / 2) + pad + 4 * LEVEL_H + 8,
      ox: rh * (TILE_W / 2) + 1,
      oy: pad,
    };
  }

  /** Paints the blocks once per map and rotation (the one map draw of each frame). */
  private board(s: TacticsState, m: GridMap): Layer {
    const key = `${s.map.tiles}:${s.map.height}:${this.rot}`;
    if (this.cache?.key === key) return this.cache;
    const { W, H, ox, oy } = this.layerFrame(m);
    const canvas = this.cache?.canvas ?? document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);
    for (const c of this.order(m)) {
      const t = tileAt(m, c.x, c.y);
      const p = this.iso(m, c.x, c.y, ox, oy);
      const top = color(TOP[t] ?? C.grass);
      const side = color(SIDE[t] ?? C.darkBark);
      this.block(ctx, p.sx, p.sy, heightAt(m, c.x, c.y), top, side);
      decorate(ctx, t, p.sx, p.sy);
    }
    this.cache = { key, canvas, ox, oy, empty: false };
    if (this.tex) {
      this.tex.map.source = canvas;
      this.tex.map.version++;
    }
    return this.cache;
  }

  /**
   * The range tints, marks, charges, fruit, cursors, the active unit's ring and the height
   * numbers, repainted only when one of them changes (most frames reuse the last texture).
   */
  private overlay(s: TacticsState, m: GridMap, o: Overlays, mapKey: string): Layer {
    const active = s.units.find((u) => u.c.id === s.active);
    const charges = chargeTiles(s);
    const key = JSON.stringify([
      mapKey,
      o.move,
      o.aim,
      o.path,
      o.target,
      o.cursor,
      !!o.heights,
      charges,
      s.fruit,
      active ? [active.x, active.y] : null,
    ]);
    if (this.over?.key === key) return this.over;
    const { W, H, ox, oy } = this.layerFrame(m);
    const canvas = this.over?.canvas ?? document.createElement('canvas');
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);
    let empty = true;
    const tint = (cells: TacticsCell[] | undefined, fill: string, mark: 'dot' | 'x' | 'foot') => {
      if (!cells) return;
      for (const c of cells) {
        empty = false;
        const p = this.iso(m, c.x, c.y, ox, oy);
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = fill;
        diamond(ctx, p.sx, p.sy);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = color(C.cream);
        if (mark === 'dot') ctx.fillRect(p.sx - 1, p.sy + 7, 2, 2);
        else if (mark === 'foot') {
          ctx.fillRect(p.sx - 3, p.sy + 6, 2, 3);
          ctx.fillRect(p.sx + 1, p.sy + 8, 2, 3);
        } else {
          ctx.fillRect(p.sx - 3, p.sy + 5, 2, 2);
          ctx.fillRect(p.sx + 1, p.sy + 5, 2, 2);
          ctx.fillRect(p.sx - 1, p.sy + 7, 2, 2);
          ctx.fillRect(p.sx - 3, p.sy + 9, 2, 2);
          ctx.fillRect(p.sx + 1, p.sy + 9, 2, 2);
        }
      }
    };
    tint(o.move, color(C.skyDeep), 'dot');
    tint(o.aim, color(C.orange), 'x');
    tint(o.path, color(C.cream), 'foot');
    for (const c of charges) {
      empty = false;
      const p = this.iso(m, c.x, c.y, ox, oy);
      ctx.strokeStyle = color(C.ember);
      ctx.setLineDash([2, 2]);
      diamond(ctx, p.sx, p.sy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (const f of s.fruit) {
      empty = false;
      const p = this.iso(m, f.x, f.y, ox, oy);
      ctx.fillStyle = color(C.berry);
      ctx.fillRect(p.sx - 2, p.sy + 4, 4, 4);
    }
    for (const c of [o.target, o.cursor]) {
      if (!c) continue;
      empty = false;
      const p = this.iso(m, c.x, c.y, ox, oy);
      ctx.strokeStyle = color(c === o.target ? C.sunYellow : C.white);
      diamond(ctx, p.sx, p.sy);
      ctx.stroke();
    }
    if (o.heights) {
      empty = false;
      for (let y = 0; y < m.h; y++)
        for (let x = 0; x < m.w; x++) {
          const p = this.iso(m, x, y, ox, oy);
          ctx.fillStyle = color(C.ink);
          ctx.fillText(String(heightAt(m, x, y)), p.sx - 2, p.sy + 11);
        }
    }
    if (active) {
      empty = false;
      const p = this.iso(m, active.x, active.y, ox, oy);
      ctx.strokeStyle = color(C.sunYellow);
      diamond(ctx, p.sx, p.sy);
      ctx.stroke();
    }
    this.over = { key, canvas, ox, oy, empty };
    if (this.tex) {
      this.tex.over.source = canvas;
      this.tex.over.version++;
    }
    return this.over;
  }

  /** Draws a frame. `sheetFor` may return null (the fallback is a coloured token). */
  draw(
    s: TacticsState,
    o: Overlays,
    now: number,
    sheetFor: (u: TUnit) => SpriteSheet | null,
    flashes: Flashes,
  ): void {
    const m = mapOf(s);
    this.resize(m);
    const { ox, oy } = this.origin(m);
    const b = this.board(s, m);
    const ov = this.overlay(s, m, o, b.key);
    const ops: UnitOp[] = [];
    const units = s.units
      .filter((u) => standing(u.c) || u.c.side === 0)
      .map((u) => ({ u, d: this.rotated(m, u.x, u.y) }))
      .sort((a, b) => a.d.x + a.d.y - (b.d.x + b.d.y));
    for (const { u } of units)
      this.unit(
        ops,
        s,
        m,
        u,
        ox,
        oy,
        now,
        sheetFor(u),
        flashes.hurt.get(u.c.id),
        flashes.pile.get(u.c.id),
      );
    const bx = ox - b.ox;
    const by = oy - b.oy;
    if (this.gl) this.drawGl(this.gl, b, ov, bx, by, ops);
    else if (this.ctx) this.draw2d(this.ctx, b, ov, bx, by, ops);
    // The R0253 budget, readable by the headless perf drivers.
    (globalThis as { __tacticsDraws?: number }).__tacticsDraws = this.calls;
  }

  private drawGl(gl: GlBoard, b: Layer, ov: Layer, bx: number, by: number, ops: UnitOp[]): void {
    if (gl.lost) {
      this.calls = 0;
      return;
    }
    if (!this.tex) {
      this.atlas = new UnitAtlas();
      this.tex = {
        map: gl.texture(b.canvas),
        over: gl.texture(ov.canvas),
        units: gl.texture(this.atlas.canvas),
      };
    }
    const t = this.tex;
    const atlas = this.atlas!;
    const bg = RGB[C.darkPlum]!;
    gl.begin(bg[0], bg[1], bg[2]);
    gl.sync(t.map);
    gl.quad(t.map, bx, by, b.canvas.width, b.canvas.height, 0, 0, b.canvas.width, b.canvas.height);
    gl.flush(t.map);
    if (!ov.empty) {
      gl.sync(t.over);
      const w = ov.canvas.width;
      const h = ov.canvas.height;
      gl.quad(t.over, bx, by, w, h, 0, 0, w, h);
      gl.flush(t.over);
    }
    // Pack first (it may grow the atlas), then size the uvs against the final canvas.
    const warm = (this.warm ??= warmKeys());
    const rects = ops.map((op) =>
      op.k === 'img' ? atlas.frame(op.sheet, op.key, () => warm) : null,
    );
    t.units.version = atlas.version;
    gl.sync(t.units);
    const wx = atlas.white.x;
    const wy = atlas.white.y;
    ops.forEach((op, i) => {
      if (op.k === 'rect') {
        const c = RGB[op.c]!;
        gl.quad(t.units, op.x, op.y, op.w, op.h, wx, wy, wx, wy, c[0], c[1], c[2], 1);
        return;
      }
      const r = rects[i];
      if (!r) return;
      // Nearest sampling lands on texel edges when a frame is shrunk by an even factor;
      // half a texel keeps every sample inside one texel.
      const shift = Math.round(r.w / op.w) % 2 === 0 ? -0.5 : 0;
      const u0 = (op.flip ? r.x + r.w : r.x) + shift;
      const u1 = (op.flip ? r.x : r.x + r.w) + shift;
      gl.quad(
        t.units,
        op.x,
        op.y,
        op.w,
        op.h,
        u0,
        r.y + shift,
        u1,
        r.y + r.h + shift,
        1,
        1,
        1,
        op.a,
      );
    });
    gl.flush(t.units);
    this.calls = gl.draws;
  }

  private draw2d(
    ctx: CanvasRenderingContext2D,
    b: Layer,
    ov: Layer,
    bx: number,
    by: number,
    ops: UnitOp[],
  ): void {
    ctx.fillStyle = color(C.darkPlum);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(b.canvas, bx, by);
    this.calls = 1;
    if (!ov.empty) {
      ctx.drawImage(ov.canvas, bx, by);
      this.calls++;
    }
    for (const op of ops) {
      if (op.k === 'rect') {
        ctx.fillStyle = color(op.c);
        ctx.fillRect(op.x, op.y, op.w, op.h);
        continue;
      }
      const image = op.sheet.texture.image as HTMLCanvasElement;
      ctx.save();
      ctx.globalAlpha = op.a;
      ctx.translate(op.x + (op.flip ? op.w : 0), op.y);
      if (op.flip) ctx.scale(-1, 1);
      ctx.drawImage(image, op.rect.x, op.rect.y, op.rect.w, op.rect.h, 0, 0, op.w, op.h);
      ctx.restore();
      this.calls++;
    }
  }

  /** One unit's sprite, side marker and bars, as ops in paint order. */
  private unit(
    ops: UnitOp[],
    s: TacticsState,
    m: GridMap,
    u: TUnit,
    ox: number,
    oy: number,
    now: number,
    sheet: SpriteSheet | null,
    hurt: number | undefined,
    pile?: number,
  ): void {
    const rect = (c: number, x: number, y: number, w: number, h: number) =>
      ops.push({ k: 'rect', c, x, y, w, h });
    const p = this.iso(m, u.x, u.y, ox, oy);
    const out = !standing(u.c);
    const rel = (DIR_IX[u.face] - this.rot + 4) % 4;
    // Facing the viewer (south or east in the turned frame) shows the front three-quarter view.
    const angle = rel === 1 || rel === 2 ? 'frontQuarter' : 'backQuarter';
    const flip = rel === 1 || rel === 0;
    const clip: ClipName = out
      ? 'sleep'
      : hurt !== undefined && now - hurt < 500
        ? 'sad'
        : s.active === u.c.id
          ? 'walk'
          : 'idle';
    const feet = p.sy + TILE_H / 2 + 2;
    let key = frameKey(clip, angle, frameAt(CLIPS[clip], now));
    let frame = sheet?.frames.get(key);
    if (sheet && !frame) {
      key = frameKey('idle', 'front', 0);
      frame = sheet.frames.get(key);
    }
    if (sheet && frame) {
      // Merged partners (FIGHT-57) stand two tiles tall.
      const tall = u.tall ? 2 : 1;
      const w = (frame.w / PX) * tall;
      const h = (frame.h / PX) * tall;
      // A pile-on (FIGHT-57) jostles the target side to side for a moment.
      const jostle =
        pile !== undefined && now - pile < 450 ? Math.round(Math.sin((now - pile) / 40) * 2) : 0;
      // FIGHT-78: a personality idle while the board waits on the Keeper.
      const idle =
        out || s.result ? null : idlePose(idleKind(u.c), u.c.id, s.seed, now, reducedMotion());
      const x = Math.round(p.sx + (idle?.dx ?? 0)) + jostle;
      const y = Math.round(feet - h + (idle?.dy ?? 0));
      ops.push({
        k: 'img',
        sheet,
        key,
        rect: frame,
        x: x - w / 2,
        y,
        w,
        h,
        flip,
        a: out ? 0.6 : 1,
      });
    } else {
      // A round token in pixel rows when no sheet is ready.
      const c = u.c.side === 0 ? C.skyLight : C.violet;
      const cy = Math.round(feet - 8);
      for (let dy = -7; dy < 7; dy++) {
        const half = Math.round(Math.sqrt(49 - (dy + 0.5) ** 2));
        rect(c, Math.round(p.sx) - half, cy + dy, half * 2, 1);
      }
    }
    // A marker shape per side (round for yours, diamond for theirs), so colour isn't the only cue.
    const top = feet - 30;
    const mark = u.c.side === 0 ? C.skyLight : C.ember;
    if (u.c.side === 0) rect(mark, p.sx - 13, top - 1, 3, 3);
    else {
      rect(mark, p.sx - 13, top - 2, 2, 1);
      rect(mark, p.sx - 14, top - 1, 4, 2);
      rect(mark, p.sx - 13, top + 1, 2, 1);
    }
    const share = Math.max(0, u.c.hp / u.c.maxHp);
    rect(C.ink, p.sx - 9, top - 1, 20, 4);
    rect(
      share > 0.5 ? C.leaf : share > 0.25 ? C.sunYellow : C.berry,
      p.sx - 8,
      top,
      Math.round(18 * share),
      2,
    );
    if (u.c.calm !== undefined) {
      rect(C.ink, p.sx - 9, top + 3, 20, 3);
      rect(C.rose, p.sx - 8, top + 4, Math.round((18 * u.c.calm) / 100), 1);
    }
  }

  /** The tile under a board point, front tiles first (heights included). */
  pick(s: TacticsState, bx: number, by: number): TacticsCell | null {
    const m = mapOf(s);
    const { ox, oy } = this.origin(m);
    const tiles = this.order(m).reverse();
    for (const c of tiles) {
      const p = this.iso(m, c.x, c.y, ox, oy);
      const dx = Math.abs(bx - p.sx) / (TILE_W / 2);
      const dy = Math.abs(by - (p.sy + TILE_H / 2)) / (TILE_H / 2);
      if (dx + dy <= 1) return c;
    }
    return null;
  }

  drawCalls(): number {
    return this.calls;
  }

  dispose(): void {
    this.gl?.dispose();
    this.sizer?.disconnect();
    this.sizer = null;
    this.tex = null;
    this.atlas = null;
    this.cache = null;
    this.over = null;
  }

  /** CSS pixels across one tile at the current zoom (for the 44 px tap rule). */
  tileCss(): number {
    return TILE_W * this.scale;
  }

  /** Pans so a tile sits in the middle. */
  centreOn(s: TacticsState, c: TacticsCell): void {
    const m = mapOf(s);
    this.panX = 0;
    this.panY = 0;
    const { ox, oy } = this.origin(m);
    const p = this.iso(m, c.x, c.y, ox, oy);
    this.panX = Math.round(this.canvas.width / 2 - p.sx);
    this.panY = Math.round(this.canvas.height / 2 - p.sy);
  }

  /** The client point at a tile's top centre (tests and the auto-zoom). */
  clientOf(s: TacticsState, c: TacticsCell): { x: number; y: number } {
    const m = mapOf(s);
    const { ox, oy } = this.origin(m);
    const p = this.iso(m, c.x, c.y, ox, oy);
    const r = this.canvas.getBoundingClientRect();
    return {
      x: r.left + (p.sx / this.canvas.width) * r.width,
      y: r.top + ((p.sy + TILE_H / 2) / this.canvas.height) * r.height,
    };
  }

  /** Board pixels from a client point. */
  toBoard(clientX: number, clientY: number): { x: number; y: number } {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * this.canvas.width,
      y: ((clientY - r.top) / r.height) * this.canvas.height,
    };
  }
}

function diamond(ctx: CanvasRenderingContext2D, sx: number, sy: number): void {
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + TILE_W / 2, sy + TILE_H / 2);
  ctx.lineTo(sx, sy + TILE_H);
  ctx.lineTo(sx - TILE_W / 2, sy + TILE_H / 2);
  ctx.closePath();
}

/** Small marks so kinds read without colour: tufts, ripples, sparkles, a lantern flame. */
function decorate(ctx: CanvasRenderingContext2D, t: number, sx: number, sy: number): void {
  const px = (c: number, x: number, y: number, w = 1, h = 1) => {
    ctx.fillStyle = color(c);
    ctx.fillRect(sx + x, sy + y, w, h);
  };
  switch (t) {
    case TILE.grass:
      px(C.leafLight, -5, 6);
      px(C.leafLight, 4, 9);
      break;
    case TILE.tall:
      px(C.leafDeep, -4, 3, 1, 4);
      px(C.leafDeep, 0, 4, 1, 5);
      px(C.leafDeep, 4, 3, 1, 4);
      break;
    case TILE.shallow:
    case TILE.deep:
      px(C.skyLight, -4, 7, 4, 1);
      px(C.skyLight, 2, 10, 4, 1);
      break;
    case TILE.crystal:
      px(C.white, -1, 2, 2, 6);
      px(C.tealLight, -3, 5, 2, 3);
      px(C.tealLight, 2, 4, 2, 4);
      break;
    case TILE.lantern:
      px(C.darkBark, -1, -6, 2, 12);
      px(C.orange, -2, -9, 4, 4);
      px(C.sunLight, -1, -8, 2, 2);
      break;
    case TILE.tree:
      px(C.darkBark, -1, -4, 2, 10);
      px(C.leaf, -6, -14, 12, 10);
      px(C.berry, -3, -10, 2, 2);
      break;
    case TILE.mud:
      px(C.darkBark, -3, 7, 3, 1);
      break;
    case TILE.exit:
      px(C.cream, -1, 3, 2, 8);
      break;
  }
}
