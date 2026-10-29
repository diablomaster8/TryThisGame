/**
 * The Chaos-tier signature each Pixel Eternal carries (LOOK-37, R0404), matching the 3D
 * figures: the Sun's gold halo ring over the crown, always on whatever the mood; the Moon's
 * spade-tipped devil tail behind the hips; the Neutral's three glowing motes, which seem to
 * orbit as the view turns. Drawn over a finished body, before the outline pass.
 */
import type { DrawnAngle } from './angles';
import type { Layout } from './layout';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

export function drawEternalSign(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  band: 'sun' | 'moon' | 'neutral',
): void {
  if (band === 'sun') {
    // A flat gold ring hovering over the crown, open in the middle.
    const y = L.headCy - L.headRy - 4;
    for (let dx = -3; dx <= 3; dx++) {
      pc.px(L.headCx + dx, y - (Math.abs(dx) === 3 ? 0 : 1), C.sunYellow);
      if (Math.abs(dx) < 3) pc.px(L.headCx + dx, y + 1, C.sunDeep);
    }
    pc.px(L.headCx - 1, y - 1, C.white);
    return;
  }
  if (band === 'moon') {
    // The tail curls out from behind the hips on the far side and ends in a spade.
    const dir = angle === 'side' ? -1 : 1;
    const x0 = L.bodyCx + dir * (L.bodyRx - 1);
    const y0 = L.bodyCy + 2;
    const pts: [number, number][] = [
      [x0, y0],
      [x0 + dir * 2, y0 + 1],
      [x0 + dir * 4, y0],
      [x0 + dir * 5, y0 - 2],
      [x0 + dir * 5, y0 - 4],
    ];
    for (const [x, y] of pts) pc.px(x, y, C.darkPlum);
    const [sx, sy] = pts[pts.length - 1]!;
    pc.px(sx, sy - 1, C.rose);
    pc.px(sx - 1, sy - 1, C.rose);
    pc.px(sx + 1, sy - 1, C.rose);
    pc.px(sx, sy - 2, C.rose);
    return;
  }
  // Neutral: three motes round the body, their places turning with the view.
  const turn = ['front', 'frontQuarter', 'side', 'backQuarter', 'back'].indexOf(angle);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + turn * 0.6;
    // Up round the crown, clear of the wings, each a small gold cross with a white heart.
    const x = Math.round(L.headCx + Math.cos(a) * (L.headRx + 2));
    const y = Math.round(L.headCy - L.headRy + 1 + Math.sin(a) * 2);
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const)
      pc.px(x + dx, y + dy, C.sunYellow);
    pc.px(x, y, C.white);
  }
}
