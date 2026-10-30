/**
 * The tactics board in Pixel (recs FIGHT-61): 2.5D blocks, a 32×16 top diamond over a side
 * face 8 px per height level, in the shared 48-colour palette, drawn into a low-res canvas
 * that CSS scales up with nearest-neighbour filtering. The blocks are painted once into an
 * offscreen canvas per rotation (one `drawImage` a frame for the whole map); units, overlays
 * and bars go on top. Rotation is in quarter turns, zoom has two levels. Reads the state only.
 */
import { CLIPS, frameAt, frameKey, type ClipName } from '../../render/sprites/animations';
import type { SpriteSheet } from '../../render/sprites/atlas';
import { C, color } from '../../render/sprites/palette';
import { PX } from '../../render/sprites/pixel-canvas';
import { standing } from '../../sim/battle/damage';
import { heightAt, mapOf, tileAt } from '../../sim/battle/tactics';
import { chargeTiles } from '../../sim/battle/tactics/engine';
import {
  TILE,
  type Cell,
  type Dir,
  type GridMap,
  type TacticsState,
  type TUnit,
} from '../../sim/battle/tactics/types';
import type { Flashes, Overlays, TacticsBoardView } from './board-view';

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

export class TacticsPixelView implements TacticsBoardView {
  /** drawImage calls in the last frame (the map blit plus one per unit). */
  private calls = 0;
  readonly ctx: CanvasRenderingContext2D;
  /** Quarter turns clockwise. */
  rot = 0;
  /** Device pixels per board pixel, for each zoom level. */
  zoom: 1 | 2 = 1;
  scale = 1;
  /** Pan, in board pixels. */
  panX = 0;
  panY = 0;
  private cache: { key: string; canvas: HTMLCanvasElement; ox: number; oy: number } | null = null;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  /** Fits the low-res canvas to its CSS box: zoom 1 fits the board, zoom 2 doubles it. */
  resize(m: GridMap): void {
    const r = this.canvas.getBoundingClientRect();
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
    this.ctx.imageSmoothingEnabled = false;
  }

  /** A grid cell in the rotated frame. */
  private rotated(m: GridMap, x: number, y: number): Cell {
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
  private order(m: GridMap): Cell[] {
    const out: Array<Cell & { d: number }> = [];
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

  /** Paints the blocks once per map and rotation (the one map draw of each frame). */
  private board(
    s: TacticsState,
    m: GridMap,
  ): { canvas: HTMLCanvasElement; ox: number; oy: number } {
    const key = `${s.map.tiles}:${s.map.height}:${this.rot}`;
    if (this.cache?.key === key) return this.cache;
    const pad = 6 * LEVEL_H;
    const W = (m.w + m.h) * (TILE_W / 2) + 2;
    const H = (m.w + m.h) * (TILE_H / 2) + pad + 4 * LEVEL_H + 8;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const rh = this.rot & 1 ? m.w : m.h;
    const ox = rh * (TILE_W / 2) + 1;
    const oy = pad;
    for (const c of this.order(m)) {
      const t = tileAt(m, c.x, c.y);
      const p = this.iso(m, c.x, c.y, ox, oy);
      const top = color(TOP[t] ?? C.grass);
      const side = color(SIDE[t] ?? C.darkBark);
      this.block(ctx, p.sx, p.sy, heightAt(m, c.x, c.y), top, side);
      decorate(ctx, t, p.sx, p.sy);
    }
    this.cache = { key, canvas, ox, oy };
    return this.cache;
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
    this.calls = 1;
    this.resize(m);
    const ctx = this.ctx;
    ctx.fillStyle = color(C.darkPlum);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const { ox, oy } = this.origin(m);
    const b = this.board(s, m);
    ctx.drawImage(b.canvas, ox - b.ox, oy - b.oy);
    const tint = (cells: Cell[] | undefined, fill: string, mark: 'dot' | 'x' | 'foot') => {
      if (!cells) return;
      for (const c of cells) {
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
    for (const c of chargeTiles(s)) {
      const p = this.iso(m, c.x, c.y, ox, oy);
      ctx.strokeStyle = color(C.ember);
      ctx.setLineDash([2, 2]);
      diamond(ctx, p.sx, p.sy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (const f of s.fruit) {
      const p = this.iso(m, f.x, f.y, ox, oy);
      ctx.fillStyle = color(C.berry);
      ctx.fillRect(p.sx - 2, p.sy + 4, 4, 4);
    }
    for (const c of [o.target, o.cursor]) {
      if (!c) continue;
      const p = this.iso(m, c.x, c.y, ox, oy);
      ctx.strokeStyle = color(c === o.target ? C.sunYellow : C.white);
      diamond(ctx, p.sx, p.sy);
      ctx.stroke();
    }
    if (o.heights)
      for (let y = 0; y < m.h; y++)
        for (let x = 0; x < m.w; x++) {
          const p = this.iso(m, x, y, ox, oy);
          ctx.fillStyle = color(C.ink);
          ctx.fillText(String(heightAt(m, x, y)), p.sx - 2, p.sy + 11);
        }
    const units = s.units
      .filter((u) => standing(u.c) || u.c.side === 0)
      .map((u) => ({ u, d: this.rotated(m, u.x, u.y) }))
      .sort((a, b) => a.d.x + a.d.y - (b.d.x + b.d.y));
    for (const { u } of units)
      this.unit(
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
  }

  private unit(
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
    const ctx = this.ctx;
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
    if (s.active === u.c.id) {
      ctx.strokeStyle = color(C.sunYellow);
      diamond(ctx, p.sx, p.sy);
      ctx.stroke();
    }
    const rect =
      sheet &&
      (sheet.frames.get(frameKey(clip, angle, frameAt(CLIPS[clip], now))) ??
        sheet.frames.get(frameKey('idle', 'front', 0)));
    if (sheet && rect) {
      const w = rect.w / PX;
      const h = rect.h / PX;
      const image = sheet.texture.image as HTMLCanvasElement;
      ctx.save();
      if (out) ctx.globalAlpha = 0.6;
      // A pile-on (FIGHT-57) jostles the target side to side for a moment.
      const jostle =
        pile !== undefined && now - pile < 450 ? Math.round(Math.sin((now - pile) / 40) * 2) : 0;
      ctx.translate(Math.round(p.sx) + jostle, Math.round(feet - h));
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, -w / 2, 0, w, h);
      this.calls++;
      ctx.restore();
    } else {
      ctx.fillStyle = color(u.c.side === 0 ? C.skyLight : C.violet);
      ctx.beginPath();
      ctx.arc(p.sx, feet - 8, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    // A marker shape per side (round for yours, diamond for theirs), so colour isn't the only cue.
    const top = feet - 30;
    ctx.fillStyle = color(u.c.side === 0 ? C.skyLight : C.ember);
    if (u.c.side === 0) ctx.fillRect(p.sx - 13, top - 1, 3, 3);
    else {
      ctx.beginPath();
      ctx.moveTo(p.sx - 12, top - 2);
      ctx.lineTo(p.sx - 10, top);
      ctx.lineTo(p.sx - 12, top + 2);
      ctx.lineTo(p.sx - 14, top);
      ctx.fill();
    }
    const share = Math.max(0, u.c.hp / u.c.maxHp);
    ctx.fillStyle = color(C.ink);
    ctx.fillRect(p.sx - 9, top - 1, 20, 4);
    ctx.fillStyle = color(share > 0.5 ? C.leaf : share > 0.25 ? C.sunYellow : C.berry);
    ctx.fillRect(p.sx - 8, top, Math.round(18 * share), 2);
    if (u.c.calm !== undefined) {
      ctx.fillStyle = color(C.ink);
      ctx.fillRect(p.sx - 9, top + 3, 20, 3);
      ctx.fillStyle = color(C.rose);
      ctx.fillRect(p.sx - 8, top + 4, Math.round((18 * u.c.calm) / 100), 1);
    }
  }

  /** The tile under a board point, front tiles first (heights included). */
  pick(s: TacticsState, bx: number, by: number): Cell | null {
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
    this.cache = null;
  }

  /** CSS pixels across one tile at the current zoom (for the 44 px tap rule). */
  tileCss(): number {
    return TILE_W * this.scale;
  }

  /** Pans so a tile sits in the middle. */
  centreOn(s: TacticsState, c: Cell): void {
    const m = mapOf(s);
    this.panX = 0;
    this.panY = 0;
    const { ox, oy } = this.origin(m);
    const p = this.iso(m, c.x, c.y, ox, oy);
    this.panX = Math.round(this.canvas.width / 2 - p.sx);
    this.panY = Math.round(this.canvas.height / 2 - p.sy);
  }

  /** The client point at a tile's top centre (tests and the auto-zoom). */
  clientOf(s: TacticsState, c: Cell): { x: number; y: number } {
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
