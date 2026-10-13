import { CanvasTexture, NearestFilter, RepeatWrapping, SRGBColorSpace } from 'three';
import { color, lightOf, outlineOf, shadeOf } from './palette';

/**
 * Physical pixels per design pixel. The sprites are designed on a 32 px grid; at 2 they
 * rasterise on a 64 px grid (the 540p look Maor chose): curves come out smoother,
 * outlines and highlights are one fine pixel wide, and drawers can place detail on the
 * fine grid with fractional coordinates or the `dot` / `thinLine` primitives.
 */
export const PX = 2;

/**
 * A tiny pixel-plotting surface. Everything generated in code goes through this so
 * sprites and textures stay on the palette and stay crisp. Pixels are kept in a plain
 * Uint8 index buffer (palette index + 1, 0 = transparent) and flushed to a canvas, so
 * drawing is cheap, deterministic and testable without a DOM.
 *
 * Coordinates passed to the drawing calls are design pixels; `width` and `height`
 * (and `data`) are physical, `PX` times larger.
 */
export class PixelCanvas {
  readonly data: Uint8Array;
  readonly width: number;
  readonly height: number;

  constructor(
    readonly logicalWidth: number,
    readonly logicalHeight: number,
  ) {
    this.width = logicalWidth * PX;
    this.height = logicalHeight * PX;
    this.data = new Uint8Array(this.width * this.height);
  }

  clear(): void {
    this.data.fill(0);
  }

  /** Palette index at a design pixel (its top-left physical pixel), or -1. */
  get(x: number, y: number): number {
    return this.getFine(Math.round(x) * PX, Math.round(y) * PX);
  }

  /** Palette index at a physical pixel, or -1. */
  getFine(px: number, py: number): number {
    if (px < 0 || py < 0 || px >= this.width || py >= this.height) return -1;
    return (this.data[py * this.width + px] ?? 0) - 1;
  }

  private set(px: number, py: number, v: number): void {
    if (px < 0 || py < 0 || px >= this.width || py >= this.height) return;
    this.data[py * this.width + px] = v;
  }

  /** One design pixel: a PX×PX block. */
  px(x: number, y: number, paletteIndex: number): void {
    const x0 = Math.round(x * PX);
    const y0 = Math.round(y * PX);
    for (let j = 0; j < PX; j++)
      for (let i = 0; i < PX; i++) this.set(x0 + i, y0 + j, paletteIndex + 1);
  }

  /** One physical pixel, at design coordinates (so 10.5 is the fine grid). */
  dot(x: number, y: number, paletteIndex: number): void {
    this.set(Math.floor(x * PX), Math.floor(y * PX), paletteIndex + 1);
  }

  erase(x: number, y: number): void {
    const x0 = Math.round(x * PX);
    const y0 = Math.round(y * PX);
    for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) this.set(x0 + i, y0 + j, 0);
  }

  rect(x: number, y: number, w: number, h: number, paletteIndex: number): void {
    const x0 = Math.round(x * PX);
    const y0 = Math.round(y * PX);
    const x1 = Math.round((x + w) * PX);
    const y1 = Math.round((y + h) * PX);
    for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) this.set(i, j, paletteIndex + 1);
  }

  /** Filled pixel circle (centre may be fractional for even-sized blobs). */
  disc(cx: number, cy: number, r: number, paletteIndex: number): void {
    this.ellipse(cx, cy, r, r, paletteIndex);
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, paletteIndex: number): void {
    if (rx <= 0 || ry <= 0) return;
    cx *= PX;
    cy *= PX;
    rx *= PX;
    ry *= PX;
    const x0 = Math.max(0, Math.floor(cx - rx - 1));
    const x1 = Math.min(this.width - 1, Math.ceil(cx + rx + 1));
    const y0 = Math.max(0, Math.floor(cy - ry - 1));
    const y1 = Math.min(this.height - 1, Math.ceil(cy + ry + 1));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = (x + 0.5 - cx) / rx;
        const dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(x, y, paletteIndex + 1);
      }
    }
  }

  /** A line one design pixel thick. */
  line(x0: number, y0: number, x1: number, y1: number, paletteIndex: number): void {
    this.rasterLine(x0, y0, x1, y1, (px, py) => {
      for (let j = 0; j < PX; j++)
        for (let i = 0; i < PX; i++) this.set(px + i, py + j, paletteIndex + 1);
    });
  }

  /** A line one physical pixel thick. */
  thinLine(x0: number, y0: number, x1: number, y1: number, paletteIndex: number): void {
    this.rasterLine(x0, y0, x1, y1, (px, py) => this.set(px, py, paletteIndex + 1), 1);
  }

  private rasterLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    plot: (px: number, py: number) => void,
    step = PX,
  ): void {
    // Bresenham on the design grid for thick lines (so the weight stays even), on the
    // physical grid for thin ones.
    const s = step === PX ? 1 : PX;
    x0 = Math.round(x0 * s);
    y0 = Math.round(y0 * s);
    x1 = Math.round(x1 * s);
    y1 = Math.round(y1 * s);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      plot(x0 * step, y0 * step);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  /** Filled triangle. */
  tri(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    paletteIndex: number,
  ): void {
    ax *= PX;
    ay *= PX;
    bx *= PX;
    by *= PX;
    cx *= PX;
    cy *= PX;
    const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maxX = Math.min(this.width - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maxY = Math.min(this.height - 1, Math.ceil(Math.max(ay, by, cy)));
    const edge = (x0: number, y0: number, x1: number, y1: number, px: number, py: number) =>
      (x1 - x0) * (py - y0) - (y1 - y0) * (px - x0);
    const area = edge(ax, ay, bx, by, cx, cy);
    if (area === 0) return;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const px = x + 0.5;
        const py = y + 0.5;
        const w0 = edge(ax, ay, bx, by, px, py) / area;
        const w1 = edge(bx, by, cx, cy, px, py) / area;
        const w2 = edge(cx, cy, ax, ay, px, py) / area;
        if (w0 >= 0 && w1 >= 0 && w2 >= 0) this.set(x, y, paletteIndex + 1);
      }
    }
  }

  /** Copy another canvas onto this one at design coordinates, optionally mirrored. Transparent pixels skip. */
  blit(src: PixelCanvas, dx: number, dy: number, flipX = false): void {
    const ox = Math.round(dx * PX);
    const oy = Math.round(dy * PX);
    for (let y = 0; y < src.height; y++) {
      for (let x = 0; x < src.width; x++) {
        const v = src.data[y * src.width + x] ?? 0;
        if (v === 0) continue;
        const tx = flipX ? ox + (src.width - 1 - x) : ox + x;
        this.set(tx, oy + y, v);
      }
    }
  }

  /** Add a one-physical-pixel outline around every opaque pixel (4-neighbour). */
  outline(paletteIndex: number): void {
    const src = this.data.slice();
    const w = this.width;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < w; x++) {
        if (src[y * w + x] !== 0) continue;
        const near =
          (x > 0 && src[y * w + x - 1] !== 0) ||
          (x < w - 1 && src[y * w + x + 1] !== 0) ||
          (y > 0 && src[(y - 1) * w + x] !== 0) ||
          (y < this.height - 1 && src[(y + 1) * w + x] !== 0);
        if (near) this.data[y * w + x] = paletteIndex + 1;
      }
    }
  }

  /**
   * Automatic lighting from the top-left: pixels whose upper-left neighbour is empty get
   * their ramp highlight, pixels whose lower-right neighbour is empty get their ramp
   * shade. Pixels listed in `keep` (eyes, glints) are left alone.
   */
  lightPass(keep: readonly number[] = []): void {
    const src = this.data.slice();
    const w = this.width;
    const h = this.height;
    const skip = new Set(keep.map((k) => k + 1));
    const at = (x: number, y: number) =>
      x < 0 || y < 0 || x >= w || y >= h ? 0 : (src[y * w + x] ?? 0);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = src[y * w + x] ?? 0;
        if (v === 0 || skip.has(v)) continue;
        const litEdge = at(x - 1, y - 1) === 0 && at(x, y - 1) === 0;
        const darkEdge = at(x + 1, y + 1) === 0 && at(x, y + 1) === 0;
        if (litEdge && !darkEdge) this.data[y * w + x] = lightOf(v - 1) + 1;
        else if (darkEdge && !litEdge) this.data[y * w + x] = shadeOf(v - 1) + 1;
      }
    }
  }

  /**
   * A coloured outline: each outline pixel takes the deep ramp colour of the nearest
   * opaque neighbour, except along the bottom edge which stays `groundColor` so the
   * sprite sits on the ground. Reads softer than a flat dark line.
   */
  outlineColored(groundColor: number): void {
    const src = this.data.slice();
    const w = this.width;
    const h = this.height;
    const at = (x: number, y: number) =>
      x < 0 || y < 0 || x >= w || y >= h ? 0 : (src[y * w + x] ?? 0);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (at(x, y) !== 0) continue;
        const up = at(x, y - 1);
        const left = at(x - 1, y);
        const right = at(x + 1, y);
        const down = at(x, y + 1);
        const near = up || left || right || down;
        if (!near) continue;
        // Below a sprite: grounding colour.
        if (up && !down) {
          this.data[y * w + x] = groundColor + 1;
          continue;
        }
        this.data[y * w + x] = outlineOf(near - 1) + 1;
      }
    }
  }

  /** The standard finish for generated sprites: light pass, then a coloured outline. */
  finish(groundColor: number, keep: readonly number[] = []): void {
    this.lightPass(keep);
    this.outlineColored(groundColor);
  }

  /** Swap palette indices in place. */
  recolor(map: Partial<Record<number, number>>): void {
    for (let i = 0; i < this.data.length; i++) {
      const v = this.data[i] ?? 0;
      if (v === 0) continue;
      const to = map[v - 1];
      if (to !== undefined) this.data[i] = to + 1;
    }
  }

  mirrored(): PixelCanvas {
    const out = new PixelCanvas(this.logicalWidth, this.logicalHeight);
    out.blit(this, 0, 0, true);
    return out;
  }

  /** Bounding box of opaque physical pixels, or null when empty. */
  bounds(): { x: number; y: number; w: number; h: number } | null {
    let minX = this.width;
    let minY = this.height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if ((this.data[y * this.width + x] ?? 0) === 0) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < 0) return null;
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  /** Paint onto a 2D canvas context at physical (dx, dy). */
  paint(ctx: CanvasRenderingContext2D, dx: number, dy: number): void {
    const image = ctx.createImageData(this.width, this.height);
    const px = image.data;
    for (let i = 0; i < this.data.length; i++) {
      const v = this.data[i] ?? 0;
      if (v === 0) continue;
      const [r, g, b] = hexToRgb(color(v - 1));
      px[i * 4] = r;
      px[i * 4 + 1] = g;
      px[i * 4 + 2] = b;
      px[i * 4 + 3] = 255;
    }
    ctx.putImageData(image, dx, dy);
  }

  toCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.paint(ctx, 0, 0);
    return canvas;
  }

  toTexture(options: { repeat?: boolean } = {}): CanvasTexture {
    return canvasToTexture(this.toCanvas(), options);
  }
}

export function canvasToTexture(
  canvas: HTMLCanvasElement,
  options: { repeat?: boolean } = {},
): CanvasTexture {
  const texture = new CanvasTexture(canvas);
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

const rgbCache = new Map<string, [number, number, number]>();

export function hexToRgb(hex: string): [number, number, number] {
  const cached = rgbCache.get(hex);
  if (cached) return cached;
  const v = parseInt(hex.slice(1), 16);
  const rgb: [number, number, number] = [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  rgbCache.set(hex, rgb);
  return rgb;
}
