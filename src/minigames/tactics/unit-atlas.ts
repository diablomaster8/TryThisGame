/**
 * One shared texture for every creature frame on the tactics board (recs FIGHT-61), so all
 * units go out in a single batched draw. Each creature's own sheet is copied frame by frame
 * into a shelf-packed canvas the first time it is seen; the canvas grows taller (never wider)
 * when it fills, so packed rectangles never move. A 4×4 white block at the origin serves the
 * solid quads (bars, markers) with the same texture.
 */
import type { FrameRect, SpriteSheet } from '../../render/sprites/atlas';

/** Rows of rectangles left to right, a new shelf when a row is full. Pure maths, no DOM. */
export class ShelfPacker {
  private x = 0;
  private y = 0;
  private shelf = 0;

  constructor(
    readonly width: number,
    public height: number,
    private readonly maxHeight = height,
    private readonly gap = 1,
  ) {}

  /** Where a w×h rectangle goes, growing the height (doubling) up to `maxHeight`, or null. */
  add(w: number, h: number): { x: number; y: number } | null {
    if (w > this.width) return null;
    if (this.x + w > this.width) {
      this.y += this.shelf + this.gap;
      this.x = 0;
      this.shelf = 0;
    }
    while (this.y + h > this.height) {
      if (this.height * 2 > this.maxHeight) return null;
      this.height *= 2;
    }
    const at = { x: this.x, y: this.y };
    this.x += w + this.gap;
    this.shelf = Math.max(this.shelf, h);
    return at;
  }
}

/** The packed rectangle for a frame, in atlas pixels. */
export type AtlasRect = FrameRect;

/** Frames each sheet is warmed with on first sight (the clips the board plays). */
export type WarmList = (sheet: SpriteSheet) => string[];

export class UnitAtlas {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly packer: ShelfPacker;
  private readonly ids = new WeakMap<SpriteSheet, number>();
  private readonly rects = new Map<string, AtlasRect | null>();
  private nextId = 0;
  /** Bumped whenever pixels change, so the GPU copy knows to re-upload. */
  version = 0;
  /** The centre of the white block, for solid quads. */
  readonly white = { x: 2, y: 2 };

  constructor(
    width = 1024,
    height = 512,
    maxHeight = 4096,
    private readonly makeCanvas: () => HTMLCanvasElement = () => document.createElement('canvas'),
  ) {
    this.packer = new ShelfPacker(width, height, maxHeight);
    this.canvas = makeCanvas();
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.packer.add(4, 4);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, 4, 4);
  }

  /** The atlas rectangle of a sheet's frame, packing it (and the sheet's warm set) if new. */
  frame(sheet: SpriteSheet, key: string, warm?: WarmList): AtlasRect | null {
    let id = this.ids.get(sheet);
    if (id === undefined) {
      id = this.nextId++;
      this.ids.set(sheet, id);
      if (warm) for (const k of warm(sheet)) this.put(sheet, id, k);
    }
    return this.put(sheet, id, key);
  }

  private put(sheet: SpriteSheet, id: number, key: string): AtlasRect | null {
    const name = `${id}|${key}`;
    const known = this.rects.get(name);
    if (known !== undefined) return known;
    const src = sheet.frames.get(key);
    if (!src) {
      this.rects.set(name, null);
      return null;
    }
    const at = this.packer.add(src.w, src.h);
    if (!at) return null;
    if (this.packer.height !== this.canvas.height) this.grow(this.packer.height);
    this.ctx.drawImage(
      sheet.texture.image as CanvasImageSource,
      src.x,
      src.y,
      src.w,
      src.h,
      at.x,
      at.y,
      src.w,
      src.h,
    );
    const rect = { x: at.x, y: at.y, w: src.w, h: src.h };
    this.rects.set(name, rect);
    this.version++;
    return rect;
  }

  /** Taller canvas, old pixels kept in place. */
  private grow(h: number): void {
    const old = this.makeCanvas();
    old.width = this.canvas.width;
    old.height = this.canvas.height;
    old.getContext('2d')!.drawImage(this.canvas, 0, 0);
    this.canvas.height = h;
    this.ctx.drawImage(old, 0, 0);
    this.version++;
  }

  /** Frames packed so far (tests). */
  get size(): number {
    return [...this.rects.values()].filter(Boolean).length;
  }
}
