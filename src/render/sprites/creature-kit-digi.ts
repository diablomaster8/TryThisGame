import type { DrawnAngle } from './angles';
import type { ChaoPose } from './chao';
import type { Anchors, CreatureSpec } from './creature';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * Extra kit for the generic creature drawer, added for the digital line's Versions 2 to 5:
 * two body plans the chibi plans could not fake (a four-legged walker and a big fish or
 * whale) and a handful of head and body extras (a beak, sunglasses, tusks, a mane, stag
 * pincers, a drill nose, a propeller, a single eye, two extra heads). creature.ts calls in
 * here for those plans and draws the extras; the 3D side reads the same names in
 * render3d/art-kit-digi.ts.
 */
export type KitPlan = 'quad' | 'fish';
export type KitExtra =
  | 'beak'
  | 'shades'
  | 'tusks'
  | 'mane'
  | 'pincers'
  | 'drill'
  | 'propeller'
  | 'sideHeads'
  | 'monoEye';

interface Base {
  angle: DrawnAngle;
  feetY: number;
  face: number;
  back: boolean;
  dir: 1 | -1;
}

/** Head and body placement for the kit plans, in the same frame as creature.ts. */
export function kitAnchors(plan: KitPlan, spec: CreatureSpec, pose: ChaoPose, b: Base): Anchors {
  const s = spec.size;
  const side = b.face >= 1;
  const quarter = b.angle === 'frontQuarter' || b.angle === 'backQuarter';
  if (plan === 'fish') {
    const headRx = Math.min(14, Math.round((side ? 12 : quarter ? 11 : 9) * s));
    const headRy = Math.round(7.5 * s * pose.squash);
    return {
      headCx: side ? 15 : 16,
      headCy: b.feetY - headRy - 1 + pose.headDrop,
      headRx,
      headRy,
      bodyCx: 16,
      bodyCy: b.feetY - 1,
      bodyRx: 0,
      bodyRy: 0,
      feetY: b.feetY,
      dir: b.dir,
      face: b.face,
      back: b.back,
      plan,
    };
  }
  // quad: a level body on four short legs, the head up at the front.
  const legH = Math.round(4 * s);
  const bodyRx = Math.round((side ? 8 : quarter ? 7 : 5.5) * s);
  const bodyRy = Math.round(4.5 * s * pose.squash);
  const bodyCx = side ? 14 : 16;
  const bodyCy = b.feetY - legH - bodyRy;
  const headRx = Math.round(5 * s);
  const headRy = Math.round(4.5 * s * pose.squash);
  let headCx = 16;
  let headCy = bodyCy - 2;
  if (side) {
    headCx = bodyCx + bodyRx - 1;
    headCy = bodyCy - bodyRy - 1;
  } else if (quarter) {
    headCx = b.back ? 13 : 19;
    headCy = bodyCy - bodyRy + (b.back ? -1 : 1);
  } else if (b.back) headCy = bodyCy - bodyRy - 1;
  return {
    headCx,
    headCy: headCy + pose.headDrop,
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
    plan,
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

/** The body (and for a quad, the legs and head) of a kit plan. */
export function drawKitBody(pc: PixelCanvas, a: Anchors, spec: CreatureSpec, pose: ChaoPose) {
  const col = spec.colors;
  if (a.plan === 'fish') {
    const side = a.face >= 1;
    // Flukes: behind from the front, on top from the back, at the tail end from the side.
    const flukes = () => {
      if (side) {
        const tx = a.headCx - a.headRx;
        pc.tri(tx + 2, a.headCy, tx - 3, a.headCy - 6, tx - 1, a.headCy + 1, col.shade);
        pc.tri(tx + 2, a.headCy, tx - 3, a.headCy + 5, tx - 1, a.headCy - 1, col.shade);
      } else {
        const ty = a.headCy - a.headRy + 1;
        pc.tri(a.headCx, ty + 2, a.headCx - 6, ty - 3, a.headCx - 2, ty + 2, col.shade);
        pc.tri(a.headCx, ty + 2, a.headCx + 6, ty - 3, a.headCx + 2, ty + 2, col.shade);
      }
    };
    if (!a.back) flukes();
    blob(pc, spec, a.headCx, a.headCy, a.headRx, a.headRy);
    if (!a.back)
      pc.ellipse(
        a.headCx + (side ? 1 : 0),
        a.headCy + Math.round(a.headRy * 0.5),
        a.headRx - 2,
        Math.max(1, Math.round(a.headRy * 0.4)),
        col.belly,
      );
    // Pectoral fins at the bottom.
    const fy = a.headCy + a.headRy - 2;
    if (side) pc.tri(a.headCx + 1, fy - 1, a.headCx + 4, fy - 1, a.headCx - 1, fy + 3, col.shade);
    else {
      pc.tri(
        a.headCx - a.headRx + 1,
        fy - 2,
        a.headCx - a.headRx - 3,
        fy + 2,
        a.headCx - a.headRx + 3,
        fy,
        col.shade,
      );
      pc.tri(
        a.headCx + a.headRx - 1,
        fy - 2,
        a.headCx + a.headRx + 3,
        fy + 2,
        a.headCx + a.headRx - 3,
        fy,
        col.shade,
      );
    }
    if (a.back) flukes();
    return;
  }
  // quad
  const step = pose.legs === 'stepA' ? -1 : pose.legs === 'stepB' ? 1 : 0;
  const legTop = a.bodyCy + a.bodyRy - 2;
  const leg = (x: number, dy: number, near: boolean) => {
    if (pose.waterline) return;
    pc.rect(x, legTop, 2, a.feetY - legTop + dy, near ? col.body : col.shade);
    pc.rect(x - 1, a.feetY + dy - 1, 4, 2, col.shade);
  };
  const side = a.face >= 1;
  if (side) {
    leg(a.bodyCx - a.bodyRx + 3, -step, false);
    leg(a.bodyCx + a.bodyRx - 4, step, false);
    leg(a.bodyCx - a.bodyRx + 1, step, true);
    leg(a.bodyCx + a.bodyRx - 6, -step, true);
  } else {
    leg(a.bodyCx - a.bodyRx + 1, -step, false);
    leg(a.bodyCx + a.bodyRx - 3, step, false);
  }
  const head = () => blob(pc, spec, a.headCx, a.headCy, a.headRx, a.headRy);
  if (a.back) head();
  blob(pc, spec, a.bodyCx, a.bodyCy, a.bodyRx, a.bodyRy);
  if (!side && !a.back) {
    // Front legs under the chest, in front of the body.
    leg(a.headCx - 3, step, true);
    leg(a.headCx + 1, -step, true);
  }
  if (!a.back) head();
}

/** Extras behind the body (`behind`) or over the face (`!behind`). */
export function drawKitExtras(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  behind: boolean,
): void {
  const extras = spec.extras;
  if (!extras || extras.length === 0) return;
  const col = spec.colors;
  const side = a.face >= 1;
  const top = a.headCy - a.headRy;
  const ey = a.headCy + (spec.plan === 'round' ? 0 : 1);
  const spread = Math.round(a.headRx * 0.55);
  // Toward the face in side view.
  const fx = a.headCx + a.headRx;
  for (const x of extras) {
    switch (x) {
      case 'mane':
        // A ring of mane behind the head from the front, over it from the back.
        if (behind === a.back) break;
        if (a.back) {
          pc.ellipse(a.headCx, a.headCy, a.headRx + 1, a.headRy + 1, col.accent);
          pc.ellipse(a.headCx, a.headCy + 1, a.headRx - 1, a.headRy - 1, col.accent2);
        } else {
          pc.ellipse(a.headCx - (side ? 2 : 0), a.headCy, a.headRx + 4, a.headRy + 4, col.accent);
          for (const [dx, dy] of [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ] as const)
            pc.px(a.headCx + dx * (a.headRx + 4), a.headCy + dy * (a.headRy + 2), col.accent2);
        }
        break;
      case 'beak':
        if (behind || a.back) break;
        if (side) pc.tri(fx - 2, ey + 1, fx - 2, ey + 4, fx + 3, ey + 3, col.accent2);
        else if (a.face > 0)
          pc.tri(a.headCx, ey + 2, a.headCx + 4, ey + 2, a.headCx + 5, ey + 4, col.accent2);
        else pc.tri(a.headCx - 2, ey + 2, a.headCx + 2, ey + 2, a.headCx, ey + 5, col.accent2);
        break;
      case 'shades':
        if (behind || a.back) break;
        if (side) pc.rect(a.headCx, ey - 1, a.headRx, 3, C.ink);
        else {
          pc.rect(a.headCx - spread - 2, ey - 1, spread * 2 + 5, 3, C.ink);
          pc.px(a.headCx - spread, ey - 1, C.white);
        }
        break;
      case 'monoEye': {
        if (behind || a.back) break;
        // Paint the two eyes out and set one big eye in the middle of the face.
        const cx = side ? a.headCx + spread - 1 : a.face > 0 ? a.headCx + 2 : a.headCx;
        pc.ellipse(a.headCx + (side ? 1 : 0), ey, spread + 2, 2.6, col.body);
        pc.ellipse(cx, ey, side ? 1.6 : 2.4, 2.4, C.white);
        pc.ellipse(cx + 0.3, ey + 0.3, side ? 0.9 : 1.3, 1.4, col.eye);
        pc.dot(cx - 0.4, ey - 0.6, C.white);
        break;
      }
      case 'tusks':
        if (behind || a.back) break;
        if (side) pc.tri(fx - 3, ey + 4, fx - 1, ey + 4, fx + 2, ey - 2, C.cream);
        else
          for (const d of [-1, 1] as const)
            pc.tri(
              a.headCx + d * 2,
              ey + 5,
              a.headCx + d * 4,
              ey + 4,
              a.headCx + d * (a.headRx + 1),
              ey - 3,
              C.cream,
            );
        break;
      case 'pincers':
        if (behind) break;
        if (side) {
          pc.tri(a.headCx - 1, top + 2, a.headCx + 2, top + 2, a.headCx + 7, top - 7, col.accent);
          pc.px(a.headCx + 4, top - 3, col.accent2);
        } else
          for (const d of [-1, 1] as const) {
            pc.tri(
              a.headCx + d * 1,
              top + 2,
              a.headCx + d * 4,
              top + 2,
              a.headCx + d * 7,
              top - 8,
              col.accent,
            );
            pc.tri(
              a.headCx + d * 5,
              top - 4,
              a.headCx + d * 6,
              top - 6,
              a.headCx + d * 3,
              top - 6,
              col.accent,
            );
          }
        break;
      case 'drill':
        if (behind || a.back) break;
        if (side) {
          pc.tri(fx - 2, ey, fx - 2, ey + 5, fx + 5, ey + 3, col.accent2);
          pc.px(fx + 1, ey + 3, col.outline);
        } else {
          const dx = a.face > 0 ? 3 : 0;
          pc.disc(a.headCx + dx, ey + 3, 2.6, col.accent2);
          pc.px(a.headCx + dx, ey + 3, col.outline);
          pc.px(a.headCx + dx + 1, ey + 2, col.outline);
        }
        break;
      case 'propeller':
        if (behind) break;
        pc.line(a.headCx, top + 1, a.headCx, top - 3, col.outline);
        if (side) pc.line(a.headCx - 2, top - 4, a.headCx + 2, top - 4, col.accent);
        else pc.line(a.headCx - 6, top - 4, a.headCx + 6, top - 4, col.accent);
        pc.px(a.headCx, top - 4, col.accent2);
        break;
      case 'sideHeads': {
        if (behind) break;
        // Two small heads on the arms, each with an eye and a snout.
        const head = (hx: number, hy: number, c: number) => {
          pc.disc(hx, hy, 3, c);
          pc.px(hx - 1, hy + 2, col.shade);
          if (!a.back) pc.px(hx, hy - 1, col.eye);
        };
        const hy = a.bodyCy - Math.round(a.bodyRy * 0.3);
        if (side) head(a.bodyCx + a.bodyRx + 1, hy, col.accent);
        else {
          head(a.bodyCx - a.bodyRx - 2, hy, col.accent);
          head(a.bodyCx + a.bodyRx + 2, hy, col.accent2);
        }
        break;
      }
    }
  }
}
