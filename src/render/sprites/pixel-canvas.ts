import { CanvasTexture, NearestFilter, RepeatWrapping, SRGBColorSpace } from 'three';
import { color } from './palette';

/**
 * A tiny pixel-plotting surface. Everything generated in code goes through this so
 * sprites and textures stay on the palette and stay crisp.
 */
export class PixelCanvas {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    ctx.imageSmoothingEnabled = false;
    this.ctx = ctx;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  px(x: number, y: number, paletteIndex: number): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.ctx.fillStyle = color(paletteIndex);
    this.ctx.fillRect(x, y, 1, 1);
  }

  rect(x: number, y: number, w: number, h: number, paletteIndex: number): void {
    this.ctx.fillStyle = color(paletteIndex);
    this.ctx.fillRect(x, y, w, h);
  }

  /** Filled pixel circle (centre may be fractional for even-sized blobs). */
  disc(cx: number, cy: number, r: number, paletteIndex: number): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r * r) this.px(x, y, paletteIndex);
      }
    }
  }

  toTexture(options: { repeat?: boolean } = {}): CanvasTexture {
    const texture = new CanvasTexture(this.canvas);
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = SRGBColorSpace;
    if (options.repeat) {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
    }
    texture.needsUpdate = true;
    return texture;
  }
}
