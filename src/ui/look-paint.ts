import type { LookDef } from '../config/campaign-look';
import { CG4_U4 } from '../config/tuning-u4';

/**
 * Canvas versions of two screen-space looks (campaign graphics 4): the grade layers painted
 * onto a captured frame (K30; the DOM layers cannot be read back, so the same gradients are
 * drawn with `globalCompositeOperation`), and the landmark silhouette on each campaign's
 * title card (K32). Pure drawing; nothing here reads the world.
 */

const rgba = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
};

/** What the grade layers were last driven with (set by title-card.ts `driveLook`). */
export interface GradeFrame {
  look: LookDef | null;
  ground: { color: string; alpha: number; blend: string } | null;
}

/** A CSS-style `farthest-corner` ellipse at (px, py) filled with `stops`. */
function ellipse(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  px: number,
  py: number,
  stops: Array<[number, string]>,
): void {
  const cx = w * px;
  const cy = h * py;
  const rx = Math.max(cx, w - cx) * Math.SQRT2;
  const ry = Math.max(cy, h - cy) * Math.SQRT2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(rx, ry);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const [at, col] of stops) g.addColorStop(Math.min(1, Math.max(0, at)), col);
  ctx.fillStyle = g;
  ctx.fillRect(-cx / rx, -cy / ry, w / rx, h / ry);
  ctx.restore();
}

/** Lay the campaign's grade, desaturation, ground tint and grid over a captured frame. */
export function paintGrade(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  f: GradeFrame | null,
  gridPx = 48,
): void {
  const look = f?.look;
  if (!f || !look) return;
  ctx.save();
  const core = look.core ?? 0.55;
  ctx.globalCompositeOperation = (look.blend ?? 'overlay') as GlobalCompositeOperation;
  if (look.split) {
    const s = look.split;
    const lin = ctx.createLinearGradient(0, 0, 0, h);
    lin.addColorStop(0, rgba(s.key, s.keyAlpha));
    lin.addColorStop(0.38, rgba(s.key, s.keyAlpha * 0.7));
    lin.addColorStop(0.62, rgba(s.shade, s.shadeAlpha * 0.6));
    lin.addColorStop(1, rgba(s.shade, s.shadeAlpha));
    ctx.fillStyle = lin;
    ctx.fillRect(0, 0, w, h);
    ellipse(ctx, w, h, 0.5, 0.45, [
      [0, 'rgba(0,0,0,0)'],
      [core, 'rgba(0,0,0,0)'],
      [1, rgba(look.shadow, look.shadowAlpha)],
    ]);
  } else {
    const t = rgba(look.tint, look.tintAlpha);
    ellipse(ctx, w, h, 0.5, 0.45, [
      [0, t],
      [core, t],
      [1, rgba(look.shadow, look.shadowAlpha)],
    ]);
  }
  if (look.sat < 0.99) {
    ctx.globalCompositeOperation = 'saturation';
    ctx.globalAlpha = 1 - look.sat;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  const g = f.ground;
  if (g) {
    ctx.globalCompositeOperation = g.blend as GlobalCompositeOperation;
    const lin = ctx.createLinearGradient(0, 0, 0, h);
    lin.addColorStop(0.22, rgba(g.color, 0));
    lin.addColorStop(0.55, rgba(g.color, g.alpha * 0.45));
    lin.addColorStop(1, rgba(g.color, g.alpha));
    ctx.fillStyle = lin;
    ctx.fillRect(0, 0, w, h);
  }
  if (look.grid) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(82,230,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += gridPx) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    for (let y = 0; y < h; y += gridPx) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * A campaign's landmark as a flat silhouette centred at (cx, base), standing on `base` and
 * about `H` high (K32): the Fold's mill, the board, the cart, four roofs, the gate.
 */
export function drawSilhouette(
  ctx: CanvasRenderingContext2D,
  campaign: string,
  cx: number,
  base: number,
  color: string,
  H: number = CG4_U4.card.h,
): void {
  ctx.save();
  ctx.translate(cx, base);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const k = H / 74;
  ctx.scale(k, k);
  switch (campaign) {
    case 'hundred': {
      // The Fold's mill: a tapering tower, a cap, four sails, a door.
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(-9, -44);
      ctx.lineTo(9, -44);
      ctx.lineTo(14, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-12, -44);
      ctx.lineTo(0, -58);
      ctx.lineTo(12, -44);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(0, -48);
        ctx.lineTo(Math.cos(a) * 34, -48 + Math.sin(a) * 34);
        ctx.stroke();
        ctx.fillRect(Math.cos(a) * 24 - 4, -48 + Math.sin(a) * 24 - 4, 8, 8);
      }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(-3, -14, 6, 14);
      break;
    }
    case 'logged': {
      // The board: two posts, a wide frame with pinned cards, a header bar.
      ctx.fillRect(-32, -64, 4, 64);
      ctx.fillRect(28, -64, 4, 64);
      ctx.fillRect(-38, -66, 76, 7);
      ctx.fillRect(-32, -58, 64, 40);
      ctx.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 6; i++)
        ctx.fillRect(-27 + (i % 3) * 19, -54 + Math.floor(i / 3) * 17, 15, 14);
      break;
    }
    case 'beetle': {
      // The cart: a box on two wheels, a canopy and a yoke.
      ctx.fillRect(-26, -34, 52, 20);
      ctx.beginPath();
      ctx.moveTo(-30, -34);
      ctx.quadraticCurveTo(0, -62, 30, -34);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(26, -24);
      ctx.lineTo(54, -34);
      ctx.stroke();
      for (const x of [-16, 16]) {
        ctx.beginPath();
        ctx.arc(x, -9, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'destination-out';
      for (const x of [-16, 16]) {
        ctx.beginPath();
        ctx.arc(x, -9, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'dawn':
    case 'dusk': {
      // Four roofs of different heights on a common ground line.
      const roofs: Array<[number, number, number]> = [
        [-48, 30, 34],
        [-16, 34, 48],
        [18, 30, 40],
        [50, 28, 30],
      ];
      for (const [x, w, h] of roofs) {
        ctx.fillRect(x - w / 2 + 2, -h * 0.55, w - 4, h * 0.55);
        ctx.beginPath();
        ctx.moveTo(x - w / 2 - 3, -h * 0.55);
        ctx.lineTo(x, -h);
        ctx.lineTo(x + w / 2 + 3, -h * 0.55);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    default: {
      // Hazel's Grove: the gate, two posts with rails and an arch.
      ctx.fillRect(-26, -48, 6, 48);
      ctx.fillRect(20, -48, 6, 48);
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, -48, 23, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -75, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      for (const y of [-14, -30]) {
        ctx.beginPath();
        ctx.moveTo(-20, y);
        ctx.lineTo(20, y);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}
