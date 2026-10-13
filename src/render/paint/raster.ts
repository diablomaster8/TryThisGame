import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';

/**
 * A full-colour raster for the painted art: floats per channel, a coverage mask that
 * fills while `tracking` is on (so painted things get a boundary rim and an alpha
 * channel), and the few primitives the painters need. Pure except `toCanvas`, which
 * needs a DOM canvas, so the painters themselves run in tests too.
 */
export type RGB = [number, number, number];

export function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
export function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
export function shade(c: RGB, f: number): RGB {
  return [Math.min(1, c[0] * f), Math.min(1, c[1] * f), Math.min(1, c[2] * f)];
}
/** A stable hash in [0, 1) for scatter and dither. */
export function hash(x: number, y: number, salt = 0): number {
  let h = (x * 374761393 + y * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export class Raster {
  readonly data: Float32Array;
  /** Object coverage, filled while `tracking` is on. */
  readonly mask: Uint8Array;
  tracking = false;

  constructor(
    readonly w: number,
    readonly h: number,
    bg: RGB | null,
  ) {
    this.data = new Float32Array(w * h * 3);
    this.mask = new Uint8Array(w * h);
    if (bg) for (let i = 0; i < w * h; i++) this.data.set(bg, i * 3);
  }

  get(x: number, y: number): RGB {
    const i = (y * this.w + x) * 3;
    return [this.data[i] ?? 0, this.data[i + 1] ?? 0, this.data[i + 2] ?? 0];
  }

  set(x: number, y: number, c: RGB, a = 1): void {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    if (this.tracking && a >= 0.5) this.mask[y * this.w + x] = 1;
    const i = (y * this.w + x) * 3;
    if (a >= 1) this.data.set(c, i);
    else {
      this.data[i] = (this.data[i] ?? 0) * (1 - a) + c[0] * a;
      this.data[i + 1] = (this.data[i + 1] ?? 0) * (1 - a) + c[1] * a;
      this.data[i + 2] = (this.data[i + 2] ?? 0) * (1 - a) + c[2] * a;
    }
  }

  rect(x: number, y: number, w: number, h: number, c: RGB, a = 1): void {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c, a);
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, c: RGB, a = 1): void {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(x, y, c, a);
      }
    }
  }

  disc(cx: number, cy: number, r: number, c: RGB, a = 1): void {
    this.ellipse(cx, cy, r, r, c, a);
  }

  line(x0: number, y0: number, x1: number, y1: number, c: RGB, a = 1): void {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= n; i++) {
      this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c, a);
    }
  }

  tri(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, c: RGB, a = 1): void {
    const minX = Math.floor(Math.min(ax, bx, cx));
    const maxX = Math.ceil(Math.max(ax, bx, cx));
    const minY = Math.floor(Math.min(ay, by, cy));
    const maxY = Math.ceil(Math.max(ay, by, cy));
    const area = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
    if (area === 0) return;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const w0 = ((bx - x) * (cy - y) - (cx - x) * (by - y)) / area;
        const w1 = ((cx - x) * (ay - y) - (ax - x) * (cy - y)) / area;
        const w2 = 1 - w0 - w1;
        if (w0 >= 0 && w1 >= 0 && w2 >= 0) this.set(x, y, c, a);
      }
    }
  }

  gradient(x: number, y: number, w: number, h: number, top: RGB, bottom: RGB): void {
    for (let j = 0; j < h; j++) {
      const c = mix(top, bottom, j / Math.max(1, h - 1));
      for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    }
  }

  dither(x: number, y: number, w: number, h: number, top: RGB, bottom: RGB, steps: number): void {
    for (let j = 0; j < h; j++) {
      const t = j / Math.max(1, h - 1);
      for (let i = 0; i < w; i++) {
        const q = Math.floor(t * steps);
        const frac = t * steps - q;
        const bayer = ((x + i) % 2) * 0.5 + ((y + j) % 2) * 0.25;
        const k = (frac > bayer ? q + 1 : q) / steps;
        this.set(x + i, y + j, mix(top, bottom, Math.min(1, k)));
      }
    }
  }

  multiply(x: number, y: number, f: RGB): void {
    const c = this.get(x, y);
    this.set(x, y, [c[0] * f[0], c[1] * f[1], c[2] * f[2]]);
  }

  /** RGBA bytes, scaled up by an integer; alpha from the mask unless `opaque`. */
  toRgba(scale = 1, opaque = false): { width: number; height: number; rgba: Uint8Array } {
    const width = this.w * scale;
    const height = this.h * scale;
    const rgba = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = ((y / scale) | 0) * this.w + ((x / scale) | 0);
        const o = (y * width + x) * 4;
        rgba[o] = Math.round(Math.min(1, this.data[i * 3] ?? 0) * 255);
        rgba[o + 1] = Math.round(Math.min(1, this.data[i * 3 + 1] ?? 0) * 255);
        rgba[o + 2] = Math.round(Math.min(1, this.data[i * 3 + 2] ?? 0) * 255);
        rgba[o + 3] = opaque || this.mask[i] === 1 ? 255 : 0;
      }
    }
    return { width, height, rgba };
  }

  /** A DOM canvas of this raster (browser only). */
  toCanvas(opaque = false): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.w;
    canvas.height = this.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    const { rgba } = this.toRgba(1, opaque);
    const image = ctx.createImageData(this.w, this.h);
    image.data.set(rgba);
    ctx.putImageData(image, 0, 0);
    return canvas;
  }

  toTexture(opaque = false): CanvasTexture {
    const texture = new CanvasTexture(this.toCanvas(opaque));
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }
}

// ---------------------------------------------------------------- post-processing on rasters

export function boxBlur(r: Raster, radius: number, rows: (y: number) => number): void {
  const src = new Float32Array(r.data);
  for (let y = 0; y < r.h; y++) {
    const amt = rows(y);
    if (amt <= 0) continue;
    const rad = Math.max(1, Math.round(radius * amt));
    for (let x = 0; x < r.w; x++) {
      let acc: RGB = [0, 0, 0];
      let n = 0;
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= r.w || yy >= r.h) continue;
          const i = (yy * r.w + xx) * 3;
          acc = [acc[0] + (src[i] ?? 0), acc[1] + (src[i + 1] ?? 0), acc[2] + (src[i + 2] ?? 0)];
          n++;
        }
      }
      const blurred: RGB = [acc[0] / n, acc[1] / n, acc[2] / n];
      const i = (y * r.w + x) * 3;
      const orig: RGB = [src[i] ?? 0, src[i + 1] ?? 0, src[i + 2] ?? 0];
      r.data.set(mix(orig, blurred, Math.min(1, amt)), i);
    }
  }
}

export function bloom(r: Raster, threshold: number, radius: number, strength: number): void {
  const bright = new Raster(r.w, r.h, [0, 0, 0]);
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      const l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
      if (l > threshold) bright.set(x, y, shade(c, (l - threshold) / (1 - threshold)));
    }
  }
  boxBlur(bright, radius, () => 1);
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      const b = bright.get(x, y);
      r.set(x, y, [c[0] + b[0] * strength, c[1] + b[1] * strength, c[2] + b[2] * strength]);
    }
  }
}

export function vignette(r: Raster, strength: number): void {
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const dx = (x / r.w - 0.5) * 2;
      const dy = (y / r.h - 0.5) * 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      const f = 1 - Math.max(0, d - 0.55) * strength;
      r.multiply(x, y, [f, f, f]);
    }
  }
}

export function grade(r: Raster, shadows: RGB, highlights: RGB): void {
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      const l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
      const tint = mix(shadows, highlights, l);
      r.set(x, y, [c[0] * tint[0], c[1] * tint[1], c[2] * tint[2]]);
    }
  }
}

/**
 * Contrast at every object boundary: the object's edge pixels darken, the background
 * pixels just outside darken a little, so each thing reads as a separate thing.
 */
export function rimObjects(r: Raster, inner = 0.45, outer = 0.78): void {
  const m = r.mask;
  const edgeIn: number[] = [];
  const edgeOut: number[] = [];
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const i = y * r.w + x;
      const on = m[i] === 1;
      let boundary = false;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= r.w || yy >= r.h) continue;
        if ((m[yy * r.w + xx] === 1) !== on) boundary = true;
      }
      if (!boundary) continue;
      (on ? edgeIn : edgeOut).push(i);
    }
  }
  for (const i of edgeIn) r.multiply(i % r.w, Math.floor(i / r.w), [inner, inner, inner * 1.05]);
  for (const i of edgeOut) r.multiply(i % r.w, Math.floor(i / r.w), [outer, outer, outer]);
}
