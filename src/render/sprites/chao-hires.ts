import { CHILD_NEUTRAL, type ChaoColors } from './chao';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

/**
 * The hero Chao drawn for higher frame resolutions: 48 px for a 360-row frame and
 * 64 px for a 540-row frame. Every measure scales from the 32 px design, and the extra
 * pixels buy real detail: a two-tone belly, inner ears on the wings, an iris with two
 * glints, a softer crown and a proper mouth. This is the sample for choosing the
 * game's resolution; the full animation sets would follow the chosen size.
 */
export function drawChaoHiRes(size: 48 | 64, col: ChaoColors = CHILD_NEUTRAL): PixelCanvas {
  const S = size / 32;
  const pc = new PixelCanvas(size, size);
  const cx = size / 2;
  const feetY = size - 2 * S;
  const bodyRy = 5 * S;
  const bodyRx = 6 * S;
  const bodyCy = feetY - bodyRy + 1 * S;
  const headRy = 7 * S;
  const headRx = 8 * S;
  const headCy = bodyCy - bodyRy - headRy + 3 * S;
  const top = headCy - headRy;

  // Wings behind the shoulders.
  const wingY = headCy + headRy - 2 * S;
  for (const d of [-1, 1] as const) {
    const wx = cx + d * (headRx - 1 * S);
    pc.tri(
      wx,
      wingY + 2 * S,
      wx + d * 4 * S,
      wingY - 4 * S,
      wx + d * 5.5 * S,
      wingY + 2 * S,
      col.wing,
    );
    pc.tri(
      wx + d * 1 * S,
      wingY + 1 * S,
      wx + d * 3.2 * S,
      wingY - 2.2 * S,
      wx + d * 4 * S,
      wingY + 1 * S,
      col.belly,
    );
  }

  // Body with a two-tone belly.
  pc.ellipse(cx, bodyCy, bodyRx, bodyRy, col.body);
  pc.ellipse(cx + 1 * S, bodyCy + 1 * S, bodyRx - 1 * S, bodyRy - 1 * S, col.shade);
  pc.ellipse(cx, bodyCy, bodyRx - 1 * S, bodyRy - 1 * S, col.body);
  pc.ellipse(cx, bodyCy + 1 * S, 3.4 * S, 2.8 * S, col.belly);
  pc.ellipse(cx - 0.5 * S, bodyCy + 0.5 * S, 2.2 * S, 1.6 * S, C.white);

  // Feet with yellow tips.
  for (const d of [-1, 1] as const) {
    const fx = cx + d * 4 * S;
    pc.ellipse(fx, feetY, 2.6 * S, 1.6 * S, col.body);
    pc.ellipse(fx + d * 1.2 * S, feetY, 1.3 * S, 1.1 * S, col.tip);
  }

  // Arms.
  const shoulderY = bodyCy - bodyRy + 2 * S;
  for (const d of [-1, 1] as const) {
    const sx = cx + d * (bodyRx - 1 * S);
    const hx = sx + d * 2 * S;
    const hy = shoulderY + 3 * S;
    pc.line(sx, shoulderY, hx, hy, col.shade);
    if (S > 1) pc.line(sx, shoulderY + 1, hx, hy + 1, col.shade);
    pc.disc(hx, hy, 1.7 * S, col.body);
    pc.ellipse(hx + d * 0.6 * S, hy + 0.6 * S, 0.9 * S, 0.8 * S, col.tip);
  }

  // Crown: the swept point with a soft yellow tip.
  pc.tri(cx - 3 * S, top + 2 * S, cx + 3 * S, top + 2 * S, cx + 1 * S, top - 4.5 * S, col.body);
  pc.tri(
    cx - 0.5 * S,
    top - 1.5 * S,
    cx + 2 * S,
    top - 1.5 * S,
    cx + 1 * S,
    top - 4.5 * S,
    col.tip,
  );
  pc.px(cx + 1 * S, top - 4 * S, col.tipShade);

  // Head.
  pc.ellipse(cx, headCy, headRx, headRy, col.body);
  pc.ellipse(cx + 1 * S, headCy + 2 * S, headRx - 1 * S, headRy - 1 * S, col.shade);
  pc.ellipse(cx, headCy, headRx - 1 * S, headRy - 1 * S, col.body);
  pc.ellipse(cx - 2 * S, headCy - 2 * S, headRx - 4 * S, headRy - 4 * S, col.belly);
  pc.ellipse(cx - 1 * S, headCy - 1 * S, headRx - 4 * S, headRy - 4 * S, col.body);
  // Soft highlight arc.
  pc.ellipse(cx - 3.5 * S, headCy - 4 * S, 1.6 * S, 1.1 * S, col.belly);

  // Eyes: iris with two glints at this size.
  const eyeY = headCy + 1 * S;
  for (const d of [-1, 1] as const) {
    const ex = cx + d * 4 * S;
    pc.ellipse(ex, eyeY, 1.7 * S, 2.7 * S, col.eye);
    if (S >= 1.5) pc.ellipse(ex + d * 0.3 * S, eyeY + 0.6 * S, 1.0 * S, 1.5 * S, C.skyDeep);
    pc.ellipse(ex - 0.6 * S, eyeY - 1.4 * S, 0.6 * S, 0.8 * S, col.glint);
    pc.px(ex + 0.6 * S, eyeY + 1.2 * S, col.glint);
  }
  // Blush and mouth.
  pc.ellipse(cx - 6.2 * S, eyeY + 2.6 * S, 1.2 * S, 0.8 * S, C.blush);
  pc.ellipse(cx + 6.2 * S, eyeY + 2.6 * S, 1.2 * S, 0.8 * S, C.blush);
  const my = eyeY + 4 * S;
  pc.line(cx - 1.2 * S, my, cx, my + 0.9 * S, col.eye);
  pc.line(cx, my + 0.9 * S, cx + 1.2 * S, my, col.eye);

  pc.finish(col.outline, [col.eye, col.glint, C.white, C.skyDeep]);
  return pc;
}
