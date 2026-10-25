import type { CanvasTexture } from 'three';
import type { FrameRect, SpriteSheet } from '../sprites/atlas';
import { canvasToTexture } from '../sprites/pixel-canvas';
import type { Raster } from './raster';

/**
 * Packs rasters of different sizes into one RGBA canvas (shelf packing, rows of
 * decreasing height) and returns a SpriteSheet the sprite batch can draw from.
 */
export class RasterAtlas {
  private readonly entries: Array<{ key: string; raster: Raster }> = [];

  constructor(private readonly maxWidth = 2048) {}

  add(key: string, raster: Raster): void {
    this.entries.push({ key, raster });
  }

  build(): SpriteSheet {
    const sorted = [...this.entries].sort((a, b) => b.raster.h - a.raster.h);
    const frames = new Map<string, FrameRect>();
    const pad = 2;
    let x = pad;
    let y = pad;
    let rowH = 0;
    let width = 0;
    const placed: Array<{ raster: Raster; x: number; y: number }> = [];
    for (const e of sorted) {
      if (x + e.raster.w + pad > this.maxWidth) {
        x = pad;
        y += rowH + pad;
        rowH = 0;
      }
      placed.push({ raster: e.raster, x, y });
      frames.set(e.key, { x, y, w: e.raster.w, h: e.raster.h });
      x += e.raster.w + pad;
      rowH = Math.max(rowH, e.raster.h);
      width = Math.max(width, x);
    }
    const height = y + rowH + pad;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    // Painted sheets are read back (snow crowns, ruins, tap picking): say so up front, or
    // Chrome warns about repeated getImageData on a GPU canvas.
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D canvas context unavailable');
    for (const p of placed) ctx.drawImage(p.raster.toCanvas(), p.x, p.y);
    const texture: CanvasTexture = canvasToTexture(canvas);
    let cellW = 0;
    let cellH = 0;
    for (const f of frames.values()) {
      cellW = Math.max(cellW, f.w);
      cellH = Math.max(cellH, f.h);
    }
    return {
      texture,
      width: canvas.width,
      height: canvas.height,
      frames,
      cellW,
      cellH,
      dispose: () => texture.dispose(),
    };
  }
}
