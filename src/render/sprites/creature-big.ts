import type { Anchors, CreatureSpec } from './creature';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * LOOK-43 (R0409): parts only a big-grid (48 px) final form draws, the ones that collapsed
 * to a blob at 32 px. A spec opts in with `big: [...]`; every drawer here scales by the
 * anchors' `k` (grid/32), and a spec on the 32 grid never reaches them, so the 251 older
 * species stay pixel-identical.
 *
 *  - `longNeck`: the torso is shorter and the head stands clear of it on a neck column.
 *  - `wingBones`: a full bat wing, a teal membrane between orange bone fingers.
 *  - `bigTail`: a thick tapering tail on a curve, banded when the species has stripes, with a
 *    flame tip when its `tail` is `flame`.
 *  - `clawArms`: stout arms ending in three claws.
 *  - `whiskers`: long trailing barbels curling from the mouth.
 */
export type BigPart = 'longNeck' | 'wingBones' | 'bigTail' | 'clawArms' | 'whiskers';

/** The grid scale: 1 on the 32 grid, 1.5 on the 48 grid. */
export const kOf = (spec: Pick<CreatureSpec, 'grid'>): number => (spec.grid ?? 32) / 32;

export const bigHas = (spec: Pick<CreatureSpec, 'big' | 'grid'>, p: BigPart): boolean =>
  (spec.grid ?? 32) > 32 && !!spec.big?.includes(p);

/** Design pixels the neck adds (the torso loses this much on each side of its height). */
export function neckPx(spec: Pick<CreatureSpec, 'big' | 'grid'>): number {
  return bigHas(spec, 'longNeck') ? 2 : 0;
}

/** A tall big form's torso gives up this much height so horns and crests clear the frame top. */
export function headroomPx(spec: Pick<CreatureSpec, 'grid'>): number {
  return (spec.grid ?? 32) > 32 ? 3 : 0;
}

/** The neck column between the head and the shorter torso. */
export function drawNeck(pc: PixelCanvas, a: Anchors, spec: CreatureSpec): void {
  const n = neckPx(spec);
  if (n === 0 || a.plan !== 'tall') return;
  const col = spec.colors;
  const half = Math.max(2, Math.round(a.headRx * 0.5));
  const x = a.headCx + (a.face >= 1 ? 1 : 0);
  const y0 = Math.round(a.headCy + a.headRy * 0.4);
  const y1 = Math.round(a.bodyCy - a.bodyRy + 4);
  pc.rect(x - half, y0, half * 2, y1 - y0, col.shade);
  pc.rect(x - half + (a.face >= 1 ? 1 : 0), y0, half * 2 - 2, y1 - y0, col.body);
  if (!a.back && a.face < 1) pc.rect(x - 1, y0, 3, y1 - y0, col.belly);
}

/** A big bat wing off the shoulder: leading arm, three fingers and a scalloped membrane. */
export function drawBigWings(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  raise: number,
  behind: boolean,
): void {
  if (behind === a.back) return;
  const col = spec.colors;
  const k = kOf(spec);
  const sy = a.bodyCy - a.bodyRy + Math.round(2 * k) - raise;
  const wing = (sx: number, d: 1 | -1, span: number) => {
    const tipX = sx + d * Math.round(7.5 * k * span);
    const tipY = sy - Math.round(12 * k);
    const f1 = [sx + d * Math.round(8.5 * k * span), sy - Math.round(2 * k)];
    const f2 = [sx + d * Math.round(6 * k * span), sy + Math.round(4 * k)];
    const f3 = [sx + d * Math.round(3 * k * span), sy + Math.round(6 * k)];
    // The membrane, in the palette's inner colour.
    pc.tri(sx, sy, tipX, tipY, f1[0]!, f1[1]!, col.accent2);
    pc.tri(sx, sy, f1[0]!, f1[1]!, f2[0]!, f2[1]!, col.accent2);
    pc.tri(sx, sy, f2[0]!, f2[1]!, f3[0]!, f3[1]!, col.accent2);
    // Bones: the leading arm thick and orange, the fingers thin and dark.
    pc.line(sx, sy, tipX, tipY, col.body);
    pc.line(sx, sy + 1, tipX, tipY + 1, col.shade);
    for (const f of [f1, f2, f3]) pc.thinLine(sx, sy, f[0]!, f[1]!, col.shade);
    pc.disc(tipX, tipY, 1.4, col.accent);
  };
  if (a.face >= 1) wing(a.bodyCx - 1, -1, 0.85);
  else if (a.back) {
    wing(a.bodyCx - 3, -1, 1);
    wing(a.bodyCx + 3, 1, 1);
  } else {
    wing(a.bodyCx - Math.max(2, a.bodyRx - 6), -1, 1);
    wing(a.bodyCx + Math.max(2, a.bodyRx - 6), 1, 1);
  }
}

/** A thick tapering tail on a curve; banded for stripes, flame-tipped for `tail: 'flame'`. */
export function drawBigTail(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  x0: number,
  y: number,
  d: 1 | -1,
): void {
  const col = spec.colors;
  const k = kOf(spec);
  // From the front the tail peeks out beside the hip, so it starts further in and runs shorter.
  const front = a.face < 1 && !a.back;
  const x = x0 - d * Math.round((front ? 4 : 4) * k);
  const len = Math.round((front ? 4 : 5) * k);
  const bands = spec.marks.includes('stripes');
  const steps = 9;
  let ex = x;
  let ey = y;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x + d * len * t;
    const py =
      y +
      Math.round(2 * k) * Math.sin(t * Math.PI) -
      (spec.tail === 'flame' ? 9 * k * t * t : 3 * k * t);
    const r = Math.max(1.2, 3.4 * k * (1 - t * 0.75));
    pc.disc(px, py, r, col.shade);
    pc.disc(
      px - 0.3,
      py - 0.4,
      Math.max(0.8, r - 0.9),
      bands && i % 3 === 1 ? C.deepWater : col.body,
    );
    ex = px;
    ey = py;
  }
  if (spec.tail === 'flame') {
    // Outer flame in the accent, a yellow heart and a hot white core.
    pc.tri(ex - 3 * k, ey + 1, ex + 3 * k, ey + 1, ex + d, ey - 10 * k, col.accent);
    pc.tri(ex - 2 * k, ey, ex + 2 * k, ey, ex + d, ey - 7 * k, C.sunYellow);
    pc.disc(ex + d, ey - 1, 1.1, C.white);
  }
}

/** A stout arm ending in three claws. */
export function drawBigClaw(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  sx: number,
  sy: number,
  hx: number,
  hy: number,
  d: 1 | -1,
): void {
  const col = spec.colors;
  const k = kOf(spec);
  pc.line(sx, sy, hx, hy, col.shade);
  pc.line(sx, sy - 1, hx, hy - 1, col.body);
  pc.line(sx, sy, hx, hy, col.body);
  pc.disc(hx, hy, 2 * k, col.body);
  for (const dy of [-3, 0, 3]) {
    pc.tri(hx, hy + dy - 1, hx, hy + dy + 1, hx + d * 4 * k, hy + dy * 1.4 + 1, C.cream);
  }
}

/** Long barbels from the mouth corners, curling out and down. */
export function drawWhiskers(pc: PixelCanvas, a: Anchors, spec: CreatureSpec): void {
  if (a.back) return;
  const col = spec.colors;
  const k = kOf(spec);
  const side = a.face >= 1;
  const y = a.headCy + Math.round(a.headRy * 0.35);
  const x0 = a.headCx + (a.face > 0 ? 2 : 0);
  for (const d of side ? [1] : [-1, 1]) {
    const sx = x0 + d * (side ? Math.round(a.headRx * 0.9) : Math.round(a.headRx * 0.8));
    const dir = side ? -1 : d;
    let px = sx;
    let py = y;
    for (let i = 1; i <= 3; i++) {
      const nx = Math.min(Math.max(sx + dir * Math.round(2.6 * k * i), 4), 32 * k - 5);
      const ny = y + Math.round(2 * k * i) - (i === 3 ? Math.round(2 * k) : 0);
      pc.line(px, py, nx, ny, col.accent2);
      px = nx;
      py = ny;
    }
    pc.disc(px, py, 1.1, col.accent2);
  }
}
