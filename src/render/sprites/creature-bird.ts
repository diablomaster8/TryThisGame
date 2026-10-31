import type { DrawnAngle } from './angles';
import type { ChaoPose } from './chao';
import type { Anchors, CreatureSpec } from './creature';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * The bird plan (LOOK-39): an upright, long-necked bird on thin legs, with a wing span
 * about two and a half times its body and long tail streamers. The legendary trio are this
 * plan in three dresses: a ribbon tail and smooth feathers (the ice bird), jagged feathers
 * and a spiky tail (the thunder bird), flame wings and a flame tail (the fire bird). The
 * crest, face and beak come from the shared drawer; `render3d/art-bird.ts` sculpts the
 * same recipe.
 */
export interface BirdOpts {
  /** The wing's edge: smooth feathers, jagged spikes or flame tongues. */
  wing?: 'feather' | 'jagged' | 'flame';
  /** The tail: a long ribbon (twice the body), a spiky fan or a flame fan. */
  tail?: 'ribbon' | 'spiky' | 'flame';
}

/** Wing span over body width (LOOK-39: 2.5×). */
export const BIRD_SPAN = 2.5;
/** Ribbon tail length over body height (LOOK-39: 2×). */
export const BIRD_RIBBON = 2;

interface Base {
  angle: DrawnAngle;
  feetY: number;
  face: number;
  back: boolean;
  dir: 1 | -1;
}

export function birdOf(spec: CreatureSpec): Required<BirdOpts> {
  return { wing: 'feather', tail: 'ribbon', ...spec.bird };
}

/** Head and body placement: a small head high on a long neck over an egg-shaped body. */
export function birdAnchors(spec: CreatureSpec, pose: ChaoPose, b: Base): Anchors {
  const s = spec.size;
  const side = b.face >= 1;
  const quarter = b.angle === 'frontQuarter' || b.angle === 'backQuarter';
  const legH = Math.round(6 * s);
  const bodyRx = Math.round((side ? 6 : quarter ? 5 : 4) * s);
  const bodyRy = Math.round((side ? 4.5 : 5.5) * s * pose.squash);
  const bodyCx = side ? 13 : 16;
  const bodyCy = b.feetY - legH - bodyRy + 2;
  const headRx = Math.round(3.6 * s);
  const headRy = Math.round(3.3 * s * pose.squash);
  const neck = Math.round(5 * s);
  let headCx = 16;
  if (side) headCx = bodyCx + bodyRx - 1;
  else if (quarter) headCx = b.back ? 14 : 18;
  const headCy = Math.max(headRy + 1, bodyCy - bodyRy - neck + 1) + pose.headDrop;
  return {
    headCx,
    headCy,
    headRx,
    headRy,
    bodyCx,
    bodyCy,
    bodyRx,
    bodyRy,
    feetY: b.feetY,
    dir: b.dir,
    face: b.face,
    back: b.back,
    plan: 'bird',
  };
}

function blob(pc: PixelCanvas, spec: CreatureSpec, cx: number, cy: number, rx: number, ry: number) {
  const col = spec.colors;
  if (rx <= 0 || ry <= 0) return;
  pc.ellipse(cx, cy, rx, ry, col.body);
  pc.ellipse(cx + 1, cy + 1, rx - 1, ry - 1, col.shade);
  pc.ellipse(cx, cy, rx - 1, ry - 1, col.body);
  pc.px(cx - Math.round(rx * 0.5), cy - Math.round(ry * 0.5), col.belly);
}

/** One wing from the shoulder: `d` is the side (1 right), `far` shades the far wing. */
function wing(
  pc: PixelCanvas,
  spec: CreatureSpec,
  o: Required<BirdOpts>,
  sx: number,
  sy: number,
  tipX: number,
  tipY: number,
  endX: number,
  endY: number,
  far: boolean,
) {
  const col = spec.colors;
  const fill = o.wing === 'flame' ? col.accent : far ? col.shade : col.body;
  pc.tri(sx, sy, tipX, tipY, endX, endY, fill);
  // The inner coverts: a lighter band along the leading edge.
  const mx = Math.round((sx + tipX) / 2);
  const my = Math.round((sy + tipY) / 2);
  if (o.wing === 'flame') {
    pc.tri(sx, sy, mx, my, Math.round((sx + endX) / 2), Math.round((sy + endY) / 2), col.accent2);
    // Flame tongues licking off the trailing edge.
    for (let k = 1; k <= 3; k++) {
      const t = k / 4;
      const x = Math.round(tipX + (endX - tipX) * t);
      const y = Math.round(tipY + (endY - tipY) * t);
      pc.tri(x - 1, y, x + 1, y, x + Math.sign(tipX - sx) * 2, y - 3, C.sunYellow);
    }
    return;
  }
  pc.line(sx, sy, tipX, tipY, far ? col.shade : col.belly);
  if (o.wing === 'jagged') {
    // Spiky feathers: saw teeth along the trailing edge.
    for (let k = 1; k <= 3; k++) {
      const t = k / 4;
      const x = Math.round(tipX + (endX - tipX) * t);
      const y = Math.round(tipY + (endY - tipY) * t);
      const dx = Math.sign(tipX - sx) || 1;
      pc.tri(x, y - 1, x + dx * 3, y + 1, x - dx, y + 2, fill);
    }
  } else {
    // Primary feathers: a few dark lines fanning to the trailing edge.
    for (let k = 1; k <= 2; k++) {
      const t = k / 3;
      pc.line(
        Math.round(mx + (sx - mx) * 0.3),
        Math.round(my + (sy - my) * 0.3),
        Math.round(tipX + (endX - tipX) * t),
        Math.round(tipY + (endY - tipY) * t),
        col.accent,
      );
    }
  }
}

function tail(pc: PixelCanvas, a: Anchors, spec: CreatureSpec, o: Required<BirdOpts>) {
  const col = spec.colors;
  const side = a.face >= 1;
  const rootX = side ? a.bodyCx - a.bodyRx + 1 : a.bodyCx;
  const rootY = a.bodyCy + Math.round(a.bodyRy * 0.5);
  if (o.tail === 'ribbon') {
    // A long ribbon, twice the body's height: back and down to the ground, then a curl.
    const len = Math.round(a.bodyRy * 2 * BIRD_RIBBON);
    const pts: [number, number][] = side
      ? [
          [rootX, rootY],
          [rootX - 5, rootY + 3],
          [rootX - 7, a.feetY - 3],
          [rootX - 4, a.feetY],
          [rootX - 1, a.feetY - 2],
        ]
      : [
          [rootX + 1, rootY],
          [rootX + 6, rootY + Math.round(len * 0.25)],
          [rootX + 9, a.feetY - 2],
          [rootX + 12, a.feetY - 5],
          [rootX + 13, a.feetY - 9],
        ];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]!;
      const [x1, y1] = pts[i]!;
      pc.line(x0, y0, x1, y1, col.accent2);
      pc.line(x0 + 1, y0, x1 + 1, y1, col.accent2);
      pc.line(x0, y0 + 1, x1, y1 + 1, col.accent);
    }
    return;
  }
  // A fan of three: spikes or flames.
  const fan: [number, number][] = side
    ? [
        [-8, -5],
        [-9, 0],
        [-7, 4],
      ]
    : [
        [-5, 6],
        [0, 8],
        [5, 6],
      ];
  for (const [dx, dy] of fan) {
    const tx = rootX + dx;
    const ty = rootY + dy;
    if (o.tail === 'flame') {
      pc.tri(rootX - 2, rootY, rootX + 2, rootY, tx, ty - 2, col.accent);
      pc.tri(rootX - 1, rootY, rootX + 1, rootY, Math.round((rootX + tx) / 2), ty, C.sunYellow);
    } else {
      pc.tri(rootX - 1, rootY - 1, rootX + 1, rootY + 1, tx, ty, col.body);
      pc.px(tx, ty, col.shade);
    }
  }
}

/** The bird's legs, body, wings, tail and neck, with its head blob (the face goes on after). */
export function drawBirdBody(pc: PixelCanvas, a: Anchors, spec: CreatureSpec, pose: ChaoPose) {
  const col = spec.colors;
  const o = birdOf(spec);
  const side = a.face >= 1;
  const span = Math.round(a.bodyRx * BIRD_SPAN * (side ? 0.6 : 1));
  // A flap raises the wings higher; a sleeping bird folds them down.
  const lift = pose.wings === 1 ? 3 : pose.eyes === 'closed' ? -4 : 0;
  const shoulderY = a.bodyCy - a.bodyRy + 2;
  const wings = (front: boolean) => {
    if (side) {
      const far = !front;
      const dx = far ? 2 : 0;
      wing(
        pc,
        spec,
        o,
        a.bodyCx + 1 + dx,
        shoulderY,
        a.bodyCx - span + dx,
        shoulderY - 8 - lift,
        a.bodyCx - a.bodyRx + dx,
        a.bodyCy + 1,
        far,
      );
      return;
    }
    for (const d of [-1, 1] as const) {
      const sx = a.bodyCx + d * 2;
      wing(
        pc,
        spec,
        o,
        sx,
        shoulderY,
        a.bodyCx + d * span,
        shoulderY - 6 - lift,
        a.bodyCx + d * (a.bodyRx + 2),
        a.bodyCy + 2,
        false,
      );
    }
  };
  if (!a.back) {
    tail(pc, a, spec, o);
    wings(false);
  } else if (side) wings(false);
  // Thin legs, stepping on the walk.
  if (!pose.waterline) {
    const step = pose.legs === 'stepA' ? -1 : pose.legs === 'stepB' ? 1 : 0;
    const top = a.bodyCy + a.bodyRy - 2;
    for (const [i, x] of (side
      ? [a.bodyCx - 1, a.bodyCx + 1]
      : [a.bodyCx - 2, a.bodyCx + 2]
    ).entries()) {
      const dy = i === 0 ? step : -step;
      pc.line(x, top, x, a.feetY - 1 + dy, col.shade);
      pc.line(x - 1, a.feetY + dy, x + 1, a.feetY + dy, col.shade);
      if (side) pc.px(x + 2, a.feetY + dy, col.shade);
    }
  }
  blob(pc, spec, a.bodyCx, a.bodyCy, a.bodyRx, a.bodyRy);
  if (!a.back)
    pc.ellipse(
      a.bodyCx + (side ? 2 : 0),
      a.bodyCy + 1,
      Math.max(1, a.bodyRx - 2),
      Math.max(1, a.bodyRy - 2),
      col.belly,
    );
  if (a.back) {
    wings(true);
    tail(pc, a, spec, o);
  } else if (side) wings(true);
  // The long neck, then the head on top.
  const nx0 = side ? a.bodyCx + a.bodyRx - 3 : a.bodyCx;
  pc.line(nx0, a.bodyCy - a.bodyRy + 1, a.headCx, a.headCy + a.headRy - 1, col.body);
  pc.line(nx0 + 1, a.bodyCy - a.bodyRy + 1, a.headCx + 1, a.headCy + a.headRy - 1, col.body);
  pc.line(nx0 - 1, a.bodyCy - a.bodyRy + 2, a.headCx - 1, a.headCy + a.headRy, col.body);
  blob(pc, spec, a.headCx, a.headCy, a.headRx, a.headRy);
}
