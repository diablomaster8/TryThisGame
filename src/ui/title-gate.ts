/**
 * FUN-67 (R0356, lane E r9): the title screen's living gate. A tiny pixel scene loops under
 * the logo: a Nubbin walks up to the garden gate, lifts and pushes, gets nowhere, sits down
 * in a huff; a second Nubbin trots up, they push together, the gate swings open and both
 * hop through. Eight seconds a loop, a few dozen rectangles a frame on a 96×32 canvas, so
 * it costs nothing on a phone. Reduced motion shows one still (both by the open gate).
 * Typing "liftandpush" (the FUN-43 curiosity) skips straight to the gate creaking open.
 *
 * `gateFrame` is the pure part (what is where at a time), so a node test can check it.
 */
import { C, color } from '../render/sprites/palette';
import { reducedMotion } from './battle-idle';

export const TITLE_GATE = {
  w: 96,
  h: 32,
  loopMs: 8000,
  /** The still frame reduced motion shows, and where the typed word jumps to. */
  stillMs: 6600,
  openFromMs: 5200,
  gateX: 58,
  word: 'liftandpush',
} as const;

export interface GateFrame {
  /** 0 shut … 1 wide open. */
  open: number;
  /** The gate's shiver while one Nubbin pushes alone, in pixels. */
  shake: number;
  a: { x: number; lean: number; sit: boolean; emote: 'plain' | 'spiral' | 'heart' | 'sweat' };
  b: { x: number; lean: number; emote: 'plain' | 'heart' } | null;
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * Math.min(1, Math.max(0, k));

/** What the scene shows at `t` ms into the loop. */
export function gateFrame(tMs: number): GateFrame {
  const t = ((tMs % TITLE_GATE.loopMs) + TITLE_GATE.loopMs) % TITLE_GATE.loopMs;
  const at = TITLE_GATE.gateX - 9;
  if (t < 1500)
    return {
      open: 0,
      shake: 0,
      a: { x: lerp(4, at, t / 1500), lean: 0, sit: false, emote: 'plain' },
      b: null,
    };
  if (t < 3500) {
    const wob = Math.floor(t / 120) % 2;
    return {
      open: 0,
      shake: wob,
      a: { x: at + wob, lean: 2, sit: false, emote: 'sweat' },
      b: null,
    };
  }
  if (t < 4200)
    return { open: 0, shake: 0, a: { x: at - 3, lean: 0, sit: true, emote: 'spiral' }, b: null };
  if (t < TITLE_GATE.openFromMs)
    return {
      open: 0,
      shake: 0,
      a: { x: at - 3, lean: 0, sit: true, emote: 'spiral' },
      b: { x: lerp(-8, at - 12, (t - 4200) / 1000), lean: 0, emote: 'plain' },
    };
  if (t < 6200) {
    const k = (t - TITLE_GATE.openFromMs) / 1000;
    return {
      open: k,
      shake: 0,
      a: { x: at + k * 4, lean: 2, sit: false, emote: 'sweat' },
      b: { x: at - 9 + k * 4, lean: 2, emote: 'plain' },
    };
  }
  if (t < 7500) {
    const k = (t - 6200) / 1300;
    return {
      open: 1,
      shake: 0,
      a: { x: lerp(at + 4, 100, k), lean: 0, sit: false, emote: 'heart' },
      b: { x: lerp(at - 5, 92, k), lean: 0, emote: 'heart' },
    };
  }
  // The gate swings shut behind them, ready for the next try.
  return {
    open: lerp(1, 0, (t - 7500) / 500),
    shake: 0,
    a: { x: 120, lean: 0, sit: false, emote: 'plain' },
    b: null,
  };
}

type Ctx = CanvasRenderingContext2D;

function disc(ctx: Ctx, cx: number, cy: number, r: number, fill: number): void {
  ctx.fillStyle = color(fill);
  for (let y = -r; y <= r; y++) {
    const half = Math.floor(Math.sqrt(r * r - y * y) + 0.3);
    ctx.fillRect(Math.round(cx - half), Math.round(cy + y), half * 2 + 1, 1);
  }
}

/** A Nubbin facing right, feet on y=27: round body, yellow-tipped crown, emote ball above. */
function nubbin(ctx: Ctx, x: number, lean: number, sit: boolean, emote: string, tMs: number): void {
  const fy = sit ? 2 : 0;
  const bx = Math.round(x + lean);
  disc(ctx, bx, 22 + fy, 4, C.shallows);
  disc(ctx, bx + lean, 16 + fy, 4, C.shallows);
  ctx.fillStyle = color(C.sunYellow);
  ctx.fillRect(bx + lean, 11 + fy, 1, 2);
  ctx.fillRect(bx - 4, 25 + fy, 3, 2);
  ctx.fillRect(bx + 2, 25 + fy, 3, 2);
  ctx.fillStyle = color(C.ink);
  ctx.fillRect(bx + lean + 1, 16 + fy, 1, 2);
  ctx.fillRect(bx + lean + 3, 16 + fy, 1, 2);
  const ey = 7 + fy + (Math.floor(tMs / 400) % 2);
  const ex = bx + lean;
  if (emote === 'heart') {
    ctx.fillStyle = color(C.rose);
    ctx.fillRect(ex - 2, ey, 2, 2);
    ctx.fillRect(ex + 1, ey, 2, 2);
    ctx.fillRect(ex - 1, ey + 1, 3, 2);
  } else if (emote === 'spiral') {
    ctx.fillStyle = color(C.lavender);
    ctx.fillRect(ex - 1, ey, 3, 1);
    ctx.fillRect(ex + 1, ey + 1, 1, 1);
    ctx.fillRect(ex - 1, ey + 2, 3, 1);
  } else disc(ctx, ex, ey + 1, 1, C.sunLight);
  if (emote === 'sweat') {
    ctx.fillStyle = color(C.skyLight);
    ctx.fillRect(bx - 5, 13 + fy + (Math.floor(tMs / 200) % 3), 1, 2);
  }
}

/** Draw one frame. */
export function drawGate(ctx: Ctx, tMs: number): void {
  const { w, h, gateX } = TITLE_GATE;
  const f = gateFrame(tMs);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color(C.leafDeep);
  ctx.fillRect(0, 27, w, h - 27);
  ctx.fillStyle = color(C.leaf);
  for (let x = 1; x < w; x += 5) ctx.fillRect(x, 27 + ((x * 3) % 2), 2, 1);
  // Hedge either side of the gate.
  ctx.fillStyle = color(C.forest);
  ctx.fillRect(0, 18, gateX - 3, 9);
  ctx.fillRect(gateX + 17, 18, w - gateX - 17, 9);
  // Posts, then the gate: it swings toward the viewer, so it narrows as it opens.
  ctx.fillStyle = color(C.bark);
  ctx.fillRect(gateX - 3, 12, 3, 15);
  ctx.fillRect(gateX + 14, 12, 3, 15);
  const gw = Math.max(1, Math.round(14 * (1 - f.open * 0.85)));
  const gx = gateX + f.shake;
  ctx.fillStyle = color(C.wood);
  for (let i = 0; i < gw; i += 3) ctx.fillRect(gx + i, 15, 2, 12);
  ctx.fillRect(gx, 17, gw, 1);
  ctx.fillRect(gx, 24, gw, 1);
  if (f.b) nubbin(ctx, f.b.x, f.b.lean, false, f.b.emote, tMs + 200);
  nubbin(ctx, f.a.x, f.a.lean, f.a.sit, f.a.emote, tMs);
}

/** The scene's canvas, looping while it is on the page; it stops by itself once removed. */
export function titleGate(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.className = 'title-gate';
  c.width = TITLE_GATE.w;
  c.height = TITLE_GATE.h;
  c.setAttribute('aria-hidden', 'true');
  Object.assign(c.style, {
    display: 'block',
    width: 'min(288px, 100%)',
    aspectRatio: `${TITLE_GATE.w} / ${TITLE_GATE.h}`,
    margin: '8px auto 4px',
    imageRendering: 'pixelated',
  });
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  let start = performance.now();
  let typed = '';
  const onKey = (e: KeyboardEvent) => {
    if (e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-TITLE_GATE.word.length);
    if (typed !== TITLE_GATE.word) return;
    // The curiosity: the gate creaks open now (or, held still, stands open).
    start = performance.now() - TITLE_GATE.openFromMs;
    if (reducedMotion()) drawGate(ctx, TITLE_GATE.stillMs);
  };
  window.addEventListener('keydown', onKey);
  const still = reducedMotion();
  drawGate(ctx, still ? TITLE_GATE.stillMs : 0);
  const loop = (now: number) => {
    if (!c.isConnected && now - start > 1000) {
      window.removeEventListener('keydown', onKey);
      return;
    }
    if (!reducedMotion()) drawGate(ctx, now - start);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return c;
}
