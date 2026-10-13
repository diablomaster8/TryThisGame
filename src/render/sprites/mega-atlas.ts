import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import type { FrameRect, SpriteSheet } from './atlas';

/** Where a sheet landed inside the mega atlas. */
export interface Placement {
  x: number;
  y: number;
}

/**
 * One big texture holding every sprite sheet, so all sprites can be drawn in one call.
 * Sheets are packed on shelves (rows) as they arrive; a sheet that does not fit is
 * reported so the caller can skip it. The texture is re-uploaded only when a sheet is
 * added, which is rare after the first minute of play.
 */
export class MegaAtlas {
  readonly canvas: HTMLCanvasElement;
  readonly texture: CanvasTexture;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly placements = new Map<SpriteSheet, Placement>();
  private shelfY = 0;
  private shelfX = 0;
  private shelfH = 0;

  constructor(readonly size = 4096) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    ctx.imageSmoothingEnabled = false;
    this.ctx = ctx;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.magFilter = NearestFilter;
    this.texture.minFilter = NearestFilter;
    this.texture.generateMipmaps = false;
    this.texture.colorSpace = SRGBColorSpace;
  }

  has(sheet: SpriteSheet): boolean {
    return this.placements.has(sheet);
  }

  /** Copy a sheet in; returns null when there is no room. */
  place(sheet: SpriteSheet): Placement | null {
    const existing = this.placements.get(sheet);
    if (existing) return existing;
    const w = sheet.width;
    const h = sheet.height;
    if (w > this.size || h > this.size) return null;
    if (this.shelfX + w > this.size) {
      this.shelfY += this.shelfH;
      this.shelfX = 0;
      this.shelfH = 0;
    }
    if (this.shelfY + h > this.size) return null;
    const p = { x: this.shelfX, y: this.shelfY };
    this.ctx.drawImage(sheet.texture.image as HTMLCanvasElement, p.x, p.y);
    this.shelfX += w;
    this.shelfH = Math.max(this.shelfH, h);
    this.placements.set(sheet, p);
    this.texture.needsUpdate = true;
    return p;
  }

  /** UV rectangle [u0, vTop, u1, vBottom] for a frame of a placed sheet. */
  uv(sheet: SpriteSheet, rect: FrameRect): [number, number, number, number] | null {
    const p = this.placements.get(sheet);
    if (!p) return null;
    const x = p.x + rect.x;
    const y = p.y + rect.y;
    return [
      x / this.size,
      1 - y / this.size,
      (x + rect.w) / this.size,
      1 - (y + rect.h) / this.size,
    ];
  }

  dispose(): void {
    this.texture.dispose();
  }
}
