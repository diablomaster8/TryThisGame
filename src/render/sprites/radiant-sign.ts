/**
 * Lane F r11 (EVO): the Chaos-tier signature a Pixel Nubbin wears at the top of its ladder
 * (`form.radiant`), over its second form. It is kept apart from an Eternal's (halo, devil
 * tail, motes in `eternal-sign.ts`) so the Eternals stay their own: the Sun wears a gold
 * star jewel on the brow and gold rays off the ball; the Moon a red crescent on the brow
 * and two red spikes behind the crown; the Neutral a white-hearted jewel in its type colour
 * on the brow and a gold star on the belly. The wings grow too (`ChaoShape.wingScale`).
 * Drawn over a finished body, before the outline pass.
 */
import type { DrawnAngle } from './angles';
import type { Layout } from './layout';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';
import type { ChaoColors } from './chao';

/**
 * The Chaos-tier palette over a second form's: the tips, wings and a lit rim go gold for the
 * Sun and the Neutral and red for the Moon, so the stage reads at a glance from any side.
 */
export function radiantColors(c: ChaoColors, band: 'sun' | 'moon' | 'neutral'): ChaoColors {
  if (band === 'moon') return { ...c, tip: C.rose, tipShade: C.berry, wing: C.berry, rim: C.rose };
  return {
    ...c,
    tip: C.sunYellow,
    tipShade: C.sunDeep,
    wing: band === 'sun' ? C.sunLight : c.wing,
    rim: C.sunYellow,
  };
}

/** A small four-point sparkle with a white heart. */
function sparkle(pc: PixelCanvas, x: number, y: number, c: number): void {
  for (const [dx, dy] of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const)
    pc.px(x + dx, y + dy, c);
  pc.px(x, y, C.white);
}

export function drawRadiantSign(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  band: 'sun' | 'moon' | 'neutral',
  jewel: number,
): void {
  const front = angle !== 'back' && angle !== 'backQuarter';
  // The aura: sparkles at the shoulders and hips, in the band's colour, from every side.
  const glow = band === 'moon' ? C.rose : C.sunYellow;
  for (const [dx, dy] of [
    [-(L.bodyRx + 3), -2],
    [L.bodyRx + 3, 1],
  ] as const)
    sparkle(pc, L.bodyCx + dx, L.bodyCy + dy, glow);
  const bx = L.headCx + (angle === 'side' ? 2 : angle === 'frontQuarter' ? 1 : 0);
  const by = L.headCy - L.headRy + 3;
  if (band === 'sun') {
    if (front) {
      for (const [dx, dy] of [
        [0, -1],
        [-1, 0],
        [1, 0],
        [0, 1],
      ] as const)
        pc.px(bx + dx, by + dy, C.sunYellow);
      pc.px(bx, by, C.white);
    }
    // Rays off the ball above the crown, seen from every side.
    const y = L.headCy - L.headRy - 7;
    for (const dx of [-3, 3]) pc.px(L.headCx + dx, y, C.sunYellow);
    pc.px(L.headCx, y - 3, C.sunYellow);
    return;
  }
  if (band === 'moon') {
    if (front) {
      pc.px(bx - 1, by, C.rose);
      pc.px(bx, by + 1, C.rose);
      pc.px(bx + 1, by, C.rose);
      pc.px(bx, by - 1, C.berry);
    }
    // Two red spikes behind the crown, one a side.
    for (const dir of [-1, 1]) {
      const x = L.headCx + dir * (L.headRx - 2);
      const y = L.headCy - L.headRy;
      pc.px(x, y, C.berry);
      pc.px(x + dir, y - 1, C.berry);
      pc.px(x + dir, y - 2, C.rose);
    }
    return;
  }
  if (front) {
    pc.px(bx, by - 1, jewel);
    pc.px(bx - 1, by, jewel);
    pc.px(bx + 1, by, jewel);
    pc.px(bx, by + 1, jewel);
    pc.px(bx, by, C.white);
    // A gold star on the belly.
    const sy = L.bodyCy + 1;
    pc.px(L.bodyCx, sy - 1, C.sunYellow);
    pc.px(L.bodyCx - 1, sy, C.sunYellow);
    pc.px(L.bodyCx + 1, sy, C.sunYellow);
    pc.px(L.bodyCx, sy, C.sunYellow);
    pc.px(L.bodyCx, sy + 1, C.sunDeep);
  }
}
