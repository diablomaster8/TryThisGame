import { C, color } from './sprites/palette';
import { drawText } from './sprites/font';

/**
 * Campaign graphics M4, pixel race view: the story race's dressing (Hazel's chapter 5,
 * `c5-circuit`). Frosted rails and a pale wash over the lanes, a stand of spectators drawn as
 * small Keeper figures along the back, and numbered bibs for the grey runners. Draws only,
 * from numbers the race view already has; nothing here reads or changes the race.
 */

const SKIN = ['#f2c9a0', '#d9a074', '#a8734a', '#f6d7b8'];
const SHIRT = ['#d9534f', '#4f8fd9', '#e0b43a', '#6fbf73', '#9a6ad9', '#e07fb0'];

/** Frost on the rails and lane wash, and the stand behind the far lane. */
export function drawStoryTrack(
  ctx: CanvasRenderingContext2D,
  o: {
    W: number;
    bandTop: number;
    bandBottom: number;
    camX: number;
    nowMs: number;
    reduce: boolean;
  },
): void {
  const { W, bandTop, bandBottom } = o;
  // The stand: two plank steps, the crowd on them.
  const standTop = bandTop - 44;
  ctx.fillStyle = '#6b5a52';
  ctx.fillRect(0, standTop + 22, W, 6);
  ctx.fillStyle = '#85726a';
  ctx.fillRect(0, standTop + 28, W, 8);
  ctx.fillStyle = '#4a3c38';
  ctx.fillRect(0, standTop + 36, W, 2);
  const step = 11;
  const first = Math.floor(o.camX / step) - 1;
  for (let i = first; i < first + Math.ceil(W / step) + 3; i++) {
    const h = Math.abs((i * 2654435761) >>> 0);
    for (const row of [0, 1]) {
      if ((h >> (row + 2)) % 5 === 0) continue;
      const x = Math.round(i * step + row * 5 - o.camX);
      if (x < -8 || x > W + 8) continue;
      const y =
        standTop +
        (row ? 22 : 14) +
        (!o.reduce && (h + Math.floor(o.nowMs / 420)) % 7 === 0 ? -1 : 0);
      ctx.fillStyle = SHIRT[(h >> 3) % SHIRT.length]!;
      ctx.fillRect(x, y + 4, 6, 6);
      ctx.fillStyle = SKIN[(h >> 5) % SKIN.length]!;
      ctx.fillRect(x + 1, y, 4, 4);
    }
  }
  // The pale frost over the lanes, and the cold rails.
  ctx.fillStyle = 'rgba(225,240,255,0.2)';
  ctx.fillRect(0, bandTop, W, bandBottom - bandTop);
  for (const y of [bandTop - 4, bandBottom + 1]) {
    ctx.fillStyle = '#cfe3f2';
    ctx.fillRect(0, y, W, 3);
    ctx.fillStyle = '#ffffff';
    for (let x = (-Math.round(o.camX) % 17) - 17; x < W; x += 17) ctx.fillRect(x + 4, y, 3, 1);
    ctx.fillStyle = '#8fa9bd';
    for (let x = (-Math.round(o.camX) % 51) - 51; x < W; x += 51) ctx.fillRect(x, y, 2, 8);
  }
}

/** A numbered bib on a runner's chest: a pale square with its number in dark ink. */
export function drawBib(ctx: CanvasRenderingContext2D, x: number, y: number, n: number): void {
  ctx.fillStyle = color(C.cream);
  ctx.fillRect(x, y, 9, 9);
  ctx.fillStyle = color(C.darkPlum);
  ctx.fillRect(x, y, 9, 1);
  ctx.fillRect(x, y + 8, 9, 1);
  drawText(ctx, String(n), x + 2, y + 2, color(C.darkPlum));
}
