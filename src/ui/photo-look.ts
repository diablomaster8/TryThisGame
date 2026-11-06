/**
 * R0412 (LOOK-56): what a photo looks like on top of the picture: the colour filters (done
 * on the pixels, so they come out the same on every browser, Safari included, which has no
 * 2D canvas `filter`), the pixelate filter, the frames and the stickers. The same frame and
 * sticker drawing serves the live overlay and the saved photo, so what you frame is what
 * you get. Shared by the 3D photo mode and the pixel one.
 */

export const PHOTO_FILTERS = ['none', 'warm', 'film', 'sepia', 'pixelate'] as const;
export type PhotoFilter = (typeof PHOTO_FILTERS)[number];
export const PHOTO_FRAMES = [
  'none',
  'cream',
  'leaf',
  'wood',
  'night',
  'petal',
  'film',
  'golden',
] as const;
export type PhotoFrame = (typeof PHOTO_FRAMES)[number];

/** A sticker, its centre as a share of the picture's width and height. */
export interface PhotoSticker {
  glyph: string;
  u: number;
  v: number;
}

/** The live view's stand-in for a colour filter (CSS `backdrop-filter`). */
export function filterCss(f: PhotoFilter): string {
  switch (f) {
    case 'warm':
      return 'sepia(0.22) saturate(1.25) hue-rotate(-8deg) brightness(1.03)';
    case 'film':
      return 'contrast(1.12) saturate(0.8) brightness(1.04)';
    case 'sepia':
      return 'sepia(0.85) contrast(1.05)';
    default:
      return '';
  }
}

const clamp = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

/** Apply a colour filter in place to RGBA pixels. `seed` steadies the film grain. */
export function filterPixels(d: Uint8ClampedArray, f: PhotoFilter, seed = 1): void {
  if (f === 'none' || f === 'pixelate') return;
  let s = seed >>> 0 || 1;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]!;
    const g = d[i + 1]!;
    const b = d[i + 2]!;
    if (f === 'warm') {
      d[i] = clamp(r * 1.08 + 10);
      d[i + 1] = clamp(g * 1.02 + 4);
      d[i + 2] = clamp(b * 0.86);
    } else if (f === 'sepia') {
      d[i] = clamp(r * 0.393 + g * 0.769 + b * 0.189);
      d[i + 1] = clamp(r * 0.349 + g * 0.686 + b * 0.168);
      d[i + 2] = clamp(r * 0.272 + g * 0.534 + b * 0.131);
    } else {
      // Film: lifted blacks, a softer green, a gentle S-curve and a little grain.
      s = (s * 1664525 + 1013904223) >>> 0;
      const n = ((s >>> 24) - 128) * 0.09;
      const curve = (v: number) => {
        const x = v / 255;
        return (x * x * (3 - 2 * x) * 0.85 + x * 0.15) * 235 + 14;
      };
      d[i] = clamp(curve(r) + n);
      d[i + 1] = clamp(curve(g) * 0.97 + n);
      d[i + 2] = clamp(curve(b) * 0.94 + 6 + n);
    }
  }
}

/** Pixelate a canvas in place: down to `block`-pixel cells, back up with no smoothing. */
export function pixelate(c: HTMLCanvasElement, block: number): void {
  const w = Math.max(1, Math.round(c.width / block));
  const h = Math.max(1, Math.round(c.height / block));
  const small = document.createElement('canvas');
  small.width = w;
  small.height = h;
  const sc = small.getContext('2d');
  const ctx = c.getContext('2d');
  if (!sc || !ctx) return;
  sc.imageSmoothingEnabled = true;
  sc.drawImage(c, 0, 0, w, h);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.drawImage(small, 0, 0, c.width, c.height);
  ctx.restore();
}

/** How thick a frame's border is, as a share of the shorter side. */
export function frameInset(f: PhotoFrame): number {
  return f === 'none' ? 0 : f === 'film' ? 0.09 : 0.05;
}

/** Draw a frame round a `w` × `h` picture (the border is drawn over its edges). */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  f: PhotoFrame,
  w: number,
  h: number,
): void {
  if (f === 'none') return;
  const m = Math.min(w, h);
  const t = Math.max(2, Math.round(frameInset(f) * m));
  const ring = (fill: string | CanvasGradient) => {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, w, t);
    ctx.fillRect(0, h - t, w, t);
    ctx.fillRect(0, 0, t, h);
    ctx.fillRect(w - t, 0, t, h);
  };
  ctx.save();
  switch (f) {
    case 'cream': {
      ring('#f6ecd6');
      // A deeper bottom, as on an instant photo.
      ctx.fillRect(0, h - t * 2, w, t * 2);
      ctx.strokeStyle = '#d8c7a4';
      ctx.lineWidth = Math.max(1, t * 0.08);
      ctx.strokeRect(t, t, w - t * 2, h - t * 3);
      break;
    }
    case 'leaf': {
      ring('#5e9b4f');
      ctx.fillStyle = '#9fd27d';
      const step = t * 1.4;
      for (let x = t * 0.5; x < w; x += step) {
        leaf(ctx, x, t * 0.5, t * 0.32, 0.6);
        leaf(ctx, x + step / 2, h - t * 0.5, t * 0.32, -0.6);
      }
      for (let y = t * 1.5; y < h - t; y += step) {
        leaf(ctx, t * 0.5, y, t * 0.32, 2.2);
        leaf(ctx, w - t * 0.5, y + step / 2, t * 0.32, -2.2);
      }
      break;
    }
    case 'wood': {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#8a5a35');
      g.addColorStop(0.5, '#a8744a');
      g.addColorStop(1, '#7a4c2c');
      ring(g);
      ctx.strokeStyle = 'rgba(60,32,16,0.35)';
      ctx.lineWidth = Math.max(1, t * 0.06);
      for (let k = 1; k < 4; k++) {
        const o = (t * k) / 4;
        ctx.strokeRect(o, o, w - o * 2, h - o * 2);
      }
      break;
    }
    case 'night': {
      ring('#2a2540');
      ctx.fillStyle = '#f4e9a8';
      const n = Math.round((w + h) / (t * 0.9));
      for (let i = 0; i < n; i++) {
        // A fixed scatter round the ring (no randomness: the same frame every time).
        const a = (i * 0.618034) % 1;
        const side = i % 4;
        const along = side < 2 ? a * w : a * h;
        const across = t * (0.25 + ((i * 0.37) % 0.5));
        const x = side === 0 ? along : side === 1 ? along : side === 2 ? across : w - across;
        const y = side === 0 ? across : side === 1 ? h - across : along;
        star(ctx, x, y, t * (i % 3 === 0 ? 0.18 : 0.1));
      }
      break;
    }
    case 'petal': {
      ring('#f3b7c6');
      ctx.fillStyle = '#fde3ea';
      const step = t * 1.1;
      for (let x = t / 2; x < w; x += step) {
        dot(ctx, x, t / 2, t * 0.22);
        dot(ctx, x, h - t / 2, t * 0.22);
      }
      for (let y = t / 2; y < h; y += step) {
        dot(ctx, t / 2, y, t * 0.22);
        dot(ctx, w - t / 2, y, t * 0.22);
      }
      break;
    }
    case 'film': {
      ctx.fillStyle = '#151515';
      ctx.fillRect(0, 0, w, t);
      ctx.fillRect(0, h - t, w, t);
      ctx.fillRect(0, 0, t * 0.25, h);
      ctx.fillRect(w - t * 0.25, 0, t * 0.25, h);
      ctx.fillStyle = '#eee8d8';
      const hw = t * 0.32;
      for (let x = t * 0.4; x < w - hw; x += t * 0.7) {
        ctx.fillRect(x, t * 0.3, hw, t * 0.4);
        ctx.fillRect(x, h - t * 0.7, hw, t * 0.4);
      }
      break;
    }
    case 'golden': {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#f7d774');
      g.addColorStop(0.35, '#c9962c');
      g.addColorStop(0.6, '#fbe7a1');
      g.addColorStop(1, '#b07d1c');
      ring(g);
      ctx.strokeStyle = '#7a5310';
      ctx.lineWidth = Math.max(1, t * 0.1);
      ctx.strokeRect(t * 0.92, t * 0.92, w - t * 1.84, h - t * 1.84);
      ctx.fillStyle = '#fff4c8';
      for (const [x, y] of [
        [t / 2, t / 2],
        [w - t / 2, t / 2],
        [t / 2, h - t / 2],
        [w - t / 2, h - t / 2],
      ] as const)
        star(ctx, x, y, t * 0.3);
      break;
    }
  }
  ctx.restore();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function leaf(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number): void {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.5, a, 0, Math.PI * 2);
  ctx.fill();
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const k = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * k, y + Math.sin(a) * k);
  }
  ctx.closePath();
  ctx.fill();
}

/** Draw the stickers, outlined so they read on sky and grass alike; `size` in pixels. */
export function drawStickers(
  ctx: CanvasRenderingContext2D,
  list: readonly PhotoSticker[],
  w: number,
  h: number,
  size: number,
): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.round(size)}px sans-serif`;
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(2, size * 0.16);
  ctx.strokeStyle = '#fbf3e0';
  ctx.fillStyle = '#c2386b';
  for (const s of list) {
    ctx.strokeText(s.glyph, s.u * w, s.v * h);
    ctx.fillText(s.glyph, s.u * w, s.v * h);
  }
  ctx.restore();
}

/** The sticker under a point (shares of the picture), nearest first, or -1. */
export function stickerAt(
  list: readonly PhotoSticker[],
  u: number,
  v: number,
  w: number,
  h: number,
  size: number,
): number {
  let best = -1;
  let bestD = Infinity;
  list.forEach((s, i) => {
    const d = Math.hypot((s.u - u) * w, (s.v - v) * h);
    if (d < size * 0.75 && d < bestD) {
      best = i;
      bestD = d;
    }
  });
  return best;
}
