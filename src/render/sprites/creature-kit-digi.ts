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

/**
 * How a four-legged species stands (LOOK-06): a dog, a long-legged horse, a low wide toad
 * (Bulbasaur), a legless seal on flippers, or seated with the front legs straight.
 */
export type QuadStance = 'dog' | 'horse' | 'toad' | 'seal' | 'sit';
export interface QuadOpts {
  stance?: QuadStance;
  /** Leg length, 0.4–1.0 (dog 0.6). */
  legLen?: number;
  /** How far the head stands up and forward on a neck, 0–0.6. */
  neck?: number;
  /** Muzzle length, 0–0.5. */
  snout?: number;
  /** Where the tail leaves the body. */
  tailSet?: 'high' | 'low';
}

const STANCE: Record<QuadStance, Required<Omit<QuadOpts, 'stance' | 'tailSet'>>> = {
  dog: { legLen: 0.6, neck: 0.2, snout: 0.2 },
  horse: { legLen: 0.9, neck: 0.5, snout: 0.3 },
  toad: { legLen: 0.4, neck: 0, snout: 0.25 },
  seal: { legLen: 0, neck: 0.3, snout: 0.15 },
  sit: { legLen: 0.6, neck: 0.1, snout: 0.15 },
};

/** A quad's settings with the stance defaults filled in. */
export function quadOf(spec: CreatureSpec): Required<QuadOpts> {
  const o = spec.quad ?? {};
  const stance = o.stance ?? 'dog';
  return { stance, tailSet: o.tailSet ?? 'high', ...STANCE[stance], ...o } as Required<QuadOpts>;
}

/** Babies keep the chibi head (LOOK-06): a third bigger below this size. */
export const QUAD_BABY_SIZE = 0.95;
export type KitExtra =
  | 'beak'
  | 'shades'
  | 'tusks'
  | 'mane'
  | 'pincers'
  | 'drill'
  | 'propeller'
  | 'sideHeads'
  | 'monoEye'
  | 'skullHelmet'
  | 'dinoSnout'
  | 'ribs';

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
  // quad: a level body on four legs, the head up at the front on its neck (LOOK-06).
  const q = quadOf(spec);
  const legH = Math.round(4 * s * (q.legLen / 0.6));
  const wide = q.stance === 'toad' ? 1.15 : q.stance === 'seal' ? 1.1 : 1;
  const bodyRx = Math.round((side ? 8 : quarter ? 7 : 5.5) * s * wide);
  const bodyRy = Math.round(4.5 * s * pose.squash);
  // A long neck or muzzle pushes the body back so the head stays in the frame.
  const bodyCx = side ? 14 - Math.round(q.neck * 3 + q.snout * 4) : 16;
  // Seated, the rump is on the ground and the chest stands up on the front legs.
  const bodyCy = b.feetY - legH - bodyRy + (q.stance === 'sit' ? 2 : 0);
  const baby = s < QUAD_BABY_SIZE ? 1.3 : 1;
  const headRx = Math.round(5 * s * baby);
  const headRy = Math.round(4.5 * s * baby * pose.squash);
  const up = Math.round(q.neck * 6) + (q.stance === 'sit' ? 2 : 0);
  let headCx = 16;
  let headCy = bodyCy - 2 - up;
  if (side) {
    headCx = bodyCx + bodyRx - 1 + Math.round(q.neck * 4);
    headCy = bodyCy - bodyRy - 1 - up;
  } else if (quarter) {
    headCx = b.back ? 13 : 19;
    headCy = bodyCy - bodyRy + (b.back ? -1 : 1) - up;
  } else if (b.back) headCy = bodyCy - bodyRy - 1 - up;
  headCy = Math.max(headRy + 1, headCy);
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
  // quad, in its stance (LOOK-06): two depth layers of legs, the far pair in shade.
  const q = quadOf(spec);
  const step = pose.legs === 'stepA' ? -1 : pose.legs === 'stepB' ? 1 : 0;
  const legTop = a.bodyCy + a.bodyRy - 2;
  const thick = q.stance === 'toad' ? 3 : 2;
  const leg = (x: number, dy: number, near: boolean) => {
    if (pose.waterline || q.stance === 'seal') return;
    pc.rect(x, legTop, thick, a.feetY - legTop + dy, near ? col.body : col.shade);
    pc.rect(x - 1, a.feetY + dy - 1, thick + 2, 2, col.shade);
  };
  // A seated quad's hind legs fold into a haunch on the ground.
  const haunch = (x: number, near: boolean) =>
    pc.ellipse(x, a.feetY - 2, 3, 2, near ? col.body : col.shade);
  const side = a.face >= 1;
  const sit = q.stance === 'sit';
  const rear = (x: number, dy: number, near: boolean) => (sit ? haunch(x, near) : leg(x, dy, near));
  if (side) {
    rear(a.bodyCx - a.bodyRx + 3, -step, false);
    leg(a.bodyCx + a.bodyRx - 4, step, false);
  } else {
    leg(a.bodyCx - a.bodyRx + 1, -step, false);
    leg(a.bodyCx + a.bodyRx - 3, step, false);
  }
  const head = () => {
    blob(pc, spec, a.headCx, a.headCy, a.headRx, a.headRy);
    if (q.snout <= 0 || a.back) return;
    // The muzzle: out in front from the side, a pale oval under the eyes from the front.
    const sx = side ? a.headCx + a.headRx - 1 : a.headCx;
    const rx = side ? 1.5 + q.snout * 7 : a.headRx * 0.5;
    pc.ellipse(sx, a.headCy + 2, rx, Math.max(1.5, a.headRy * 0.45), col.body);
    pc.ellipse(
      sx + (side ? 0.5 : 0),
      a.headCy + 2.6,
      rx - 0.8,
      Math.max(1, a.headRy * 0.3),
      col.belly,
    );
    if (side) pc.px(Math.round(sx + rx - 1), a.headCy + 1, col.outline);
  };
  // The neck joins the chest to the head when the head stands up.
  const neck = () => {
    if (q.neck <= 0.15) return;
    const nx = side ? (a.bodyCx + a.bodyRx * 0.6 + a.headCx) / 2 : a.headCx;
    const ny = (a.bodyCy - a.bodyRy + a.headCy) / 2 + 1;
    pc.ellipse(nx, ny, side ? 2.5 : 3, Math.abs(a.bodyCy - a.headCy) / 2, col.body);
  };
  if (a.back) head();
  if (a.back) neck();
  blob(pc, spec, a.bodyCx, a.bodyCy, a.bodyRx, a.bodyRy);
  if (q.stance === 'seal' && !pose.waterline) {
    // Fore-flippers under the chest.
    const fx = side ? a.bodyCx + a.bodyRx - 5 : a.bodyCx;
    for (const d of side ? [0] : [-1, 1])
      pc.tri(fx + d * 5, a.feetY - 3, fx + d * 9 + 2, a.feetY, fx + d * 4 - 1, a.feetY, col.shade);
  }
  if (side) {
    rear(a.bodyCx - a.bodyRx + 1, step, true);
    leg(a.bodyCx + a.bodyRx - 6, -step, true);
  }
  if (!side && !a.back) {
    // Front legs under the chest, in front of the body.
    leg(a.headCx - 3, step, true);
    leg(a.headCx + 1, -step, true);
  }
  if (!a.back) neck();
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
      case 'dinoSnout': {
        // Greymon's long muzzle (LOOK-08): out front from the side, a pale jaw from the front.
        if (behind || a.back) break;
        if (side) {
          pc.ellipse(fx - 1, ey + 2, 3.5, 2.4, col.body);
          pc.line(fx - 3, ey + 3, fx + 2, ey + 3, col.shade);
          pc.px(fx + 1, ey + 1, col.outline);
        } else {
          pc.ellipse(a.headCx + (a.face > 0 ? 2 : 0), ey + 3, a.headRx * 0.55, 2.2, col.belly);
          pc.line(a.headCx - 2, ey + 3, a.headCx + 2, ey + 3, col.shade);
        }
        break;
      }
      case 'skullHelmet': {
        // The brown skull cap over the top of the head, two side horns and a nose horn.
        if (behind) break;
        const bark = C.bark;
        const horn = C.cream;
        pc.ellipse(a.headCx - (side ? 1 : 0), top + 2.5, a.headRx + 0.5, 3, bark);
        pc.line(a.headCx - a.headRx + 1, top + 4, a.headCx + a.headRx - 1, top + 4, C.darkBark);
        if (side) {
          pc.tri(a.headCx - 3, top + 1, a.headCx, top + 1, a.headCx - 5, top - 5, horn);
          if (!a.back) pc.tri(fx - 2, top + 5, fx, top + 6, fx + 1, top + 1, horn);
        } else {
          for (const d of [-1, 1] as const)
            pc.tri(
              a.headCx + d * (a.headRx - 2),
              top + 2,
              a.headCx + d * (a.headRx - 4),
              top + 1,
              a.headCx + d * (a.headRx + 2),
              top - 5,
              horn,
            );
          if (!a.back)
            pc.tri(a.headCx - 1, top + 6, a.headCx + 1, top + 6, a.headCx, top + 2, horn);
        }
        break;
      }
      case 'ribs':
        // SkullGreymon's rib cage: bone bars across the chest.
        if (behind || a.back) break;
        for (let i = 0; i < 3; i++)
          pc.line(
            a.bodyCx - a.bodyRx + 2,
            a.bodyCy - 2 + i * 2,
            a.bodyCx + a.bodyRx - 2,
            a.bodyCy - 2 + i * 2,
            C.white,
          );
        break;
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
