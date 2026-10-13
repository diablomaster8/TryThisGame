import type { CanvasTexture } from 'three';
import { canvasToTexture, PX, type PixelCanvas } from './pixel-canvas';

export interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One texture holding many frames, looked up by key. */
export interface SpriteSheet {
  texture: CanvasTexture;
  width: number;
  height: number;
  frames: Map<string, FrameRect>;
  /** Frame cell size, so a view can size its quad before it knows the frame. */
  cellW: number;
  cellH: number;
  dispose(): void;
}

/** Pure packing math: where frame `i` of `cellW`×`cellH` lands on a `columns`-wide grid. */
export function cellRect(i: number, cellW: number, cellH: number, columns: number): FrameRect {
  return { x: (i % columns) * cellW, y: Math.floor(i / columns) * cellH, w: cellW, h: cellH };
}

export function atlasSize(
  count: number,
  cellW: number,
  cellH: number,
  columns: number,
): { width: number; height: number; rows: number } {
  const rows = Math.max(1, Math.ceil(count / columns));
  return { width: columns * cellW, height: rows * cellH, rows };
}

/**
 * Collects same-sized frames and bakes them into one canvas texture. The same shape can
 * later be filled from a hand-drawn sheet plus a JSON frame map instead of PixelCanvas
 * drawings; views only see `SpriteSheet`.
 */
export class AtlasBuilder {
  private readonly entries: Array<{ key: string; canvas: PixelCanvas }> = [];
  /** Physical cell size: the design size times PX. */
  readonly cellW: number;
  readonly cellH: number;

  constructor(
    designCellW: number,
    designCellH: number,
    readonly columns = 8,
  ) {
    this.cellW = designCellW * PX;
    this.cellH = designCellH * PX;
  }

  add(key: string, canvas: PixelCanvas): void {
    if (canvas.width !== this.cellW || canvas.height !== this.cellH) {
      throw new Error(
        `Frame ${key} is ${canvas.width}×${canvas.height}, atlas cell is ${this.cellW}×${this.cellH}`,
      );
    }
    this.entries.push({ key, canvas });
  }

  get count(): number {
    return this.entries.length;
  }

  build(): SpriteSheet {
    const { width, height } = atlasSize(this.entries.length, this.cellW, this.cellH, this.columns);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    const frames = new Map<string, FrameRect>();
    this.entries.forEach((entry, i) => {
      const rect = cellRect(i, this.cellW, this.cellH, this.columns);
      entry.canvas.paint(ctx, rect.x, rect.y);
      frames.set(entry.key, rect);
    });
    const texture = canvasToTexture(canvas);
    return {
      texture,
      width,
      height,
      frames,
      cellW: this.cellW,
      cellH: this.cellH,
      dispose: () => texture.dispose(),
    };
  }
}

/** Load a hand-drawn sheet: an image plus `{ key: [x, y, w, h] }`. Same shape as generated ones. */
export function sheetFromImage(
  image: HTMLImageElement | HTMLCanvasElement,
  frameMap: Record<string, [number, number, number, number]>,
  cellW: number,
  cellH: number,
): SpriteSheet {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0);
  const frames = new Map<string, FrameRect>();
  for (const [key, [x, y, w, h]] of Object.entries(frameMap)) frames.set(key, { x, y, w, h });
  const texture = canvasToTexture(canvas);
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
